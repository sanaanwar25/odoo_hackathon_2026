from datetime import timedelta

from odoo import _, api, fields, models


class LoopGuardRescueCase(models.Model):
    _name = "loopguard.rescue.case"
    _description = "Subscription Renewal Rescue"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "risk_score desc, next_action_date asc, id desc"
    _rec_name = "name"

    name = fields.Char(compute="_compute_name", store=True)
    subscription_id = fields.Many2one(
        "sale.order", required=True, index=True, ondelete="cascade", tracking=True
    )
    partner_id = fields.Many2one(related="subscription_id.partner_id", store=True, index=True)
    company_id = fields.Many2one(related="subscription_id.company_id", store=True, index=True)
    currency_id = fields.Many2one(related="subscription_id.currency_id")
    recurring_value = fields.Monetary(related="subscription_id.amount_total", currency_field="currency_id")
    owner_id = fields.Many2one("res.users", default=lambda self: self.env.user, tracking=True)
    stage = fields.Selection(
        [("new", "Needs review"), ("working", "In progress"), ("saved", "Renewed"), ("closed", "Closed")],
        default="new", required=True, tracking=True, index=True,
    )
    risk_score = fields.Integer(compute="_compute_risk", store=True, index=True)
    risk_level = fields.Selection(
        [("low", "Low"), ("watch", "Watch"), ("high", "High"), ("critical", "Critical")],
        compute="_compute_risk", store=True, index=True,
    )
    risk_reasons = fields.Text(compute="_compute_risk", store=True)
    next_action = fields.Char(compute="_compute_risk", store=True)
    next_action_date = fields.Date(compute="_compute_risk", store=True, index=True)
    last_scanned_at = fields.Datetime(default=fields.Datetime.now, readonly=True)
    subscription_state = fields.Char(compute="_compute_subscription_state")
    overdue_amount = fields.Monetary(compute="_compute_risk", store=True, currency_field="currency_id")

    _subscription_unique = models.Constraint(
        "UNIQUE(subscription_id)", "A subscription can only have one open rescue case."
    )

    @api.depends("subscription_id.name", "partner_id.name")
    def _compute_name(self):
        for case in self:
            case.name = _("Renewal rescue · %(customer)s · %(order)s", customer=case.partner_id.name or _("Customer"), order=case.subscription_id.name or "")

    @api.depends(
        "subscription_id.end_date", "subscription_id.next_invoice_date",
        "subscription_id.invoice_ids.state", "subscription_id.invoice_ids.payment_state",
        "subscription_id.invoice_ids.amount_residual", "subscription_id.invoice_ids.invoice_date_due",
        "subscription_id.amount_total", "subscription_id.subscription_state",
    )
    def _compute_risk(self):
        today = fields.Date.context_today(self)
        for case in self:
            order = case.subscription_id
            score = 0
            reasons = []
            open_invoices = order.invoice_ids.filtered(
                lambda move: move.move_type == "out_invoice" and move.state == "posted" and move.payment_state not in ("paid", "reversed")
            )
            overdue = open_invoices.filtered(lambda move: move.invoice_date_due and move.invoice_date_due < today)
            overdue_amount = sum(overdue.mapped("amount_residual"))
            if overdue:
                score += min(55, 25 + 10 * min(max((today - min(overdue.mapped("invoice_date_due"))).days // 7, 0), 3))
                reasons.append(_("%(count)s overdue invoice(s), %(amount)s %(currency)s still due", count=len(overdue), amount=f"{overdue_amount:.2f}", currency=case.currency_id.name or ""))
            elif open_invoices:
                score += 18
                reasons.append(_("%(count)s unpaid invoice(s) still open", count=len(open_invoices)))

            end_date = order.end_date
            if end_date:
                days_left = (end_date - today).days
                if days_left < 0:
                    score += 28
                    reasons.append(_("Contract end date passed %(days)s day(s) ago", days=abs(days_left)))
                elif days_left <= 14:
                    score += 25
                    reasons.append(_("Contract ends in %(days)s day(s)", days=days_left))
                elif days_left <= 45:
                    score += 12
                    reasons.append(_("Contract renewal window opens in %(days)s day(s)", days=days_left))

            next_invoice = order.next_invoice_date
            if next_invoice and next_invoice < today and order.subscription_state in ("in_progress", "paused"):
                score += 18
                reasons.append(_("Next billing date is %(days)s day(s) late", days=(today - next_invoice).days))

            case.overdue_amount = overdue_amount
            case.risk_score = min(score, 100)
            case.risk_level = "critical" if score >= 75 else "high" if score >= 50 else "watch" if score >= 25 else "low"
            case.risk_reasons = "\n".join(reasons) if reasons else _("No billing or renewal warning detected")
            case.next_action = (
                _("Call customer and agree a payment date") if overdue else
                _("Send renewal options and confirm seat needs") if end_date and (end_date - today).days <= 45 else
                _("Review account health and schedule a check-in") if score >= 25 else
                _("Keep on the standard renewal cadence")
            )
            case.next_action_date = today if score >= 50 else today + timedelta(days=2 if score >= 25 else 7)

    @api.depends("subscription_id.subscription_state")
    def _compute_subscription_state(self):
        for case in self:
            case.subscription_state = case.subscription_id.subscription_state or ""

    @api.model
    def _cron_scan_subscriptions(self):
        """Keep one rescue record per active Odoo subscription; close stale low-risk cases."""
        today = fields.Date.context_today(self)
        orders = self.env["sale.order"].search([
            ("is_subscription", "=", True),
            ("subscription_state", "in", ["in_progress", "paused"]),
        ])
        existing = {case.subscription_id.id: case for case in self.search([("subscription_id", "in", orders.ids)])}
        for order in orders:
            case = existing.get(order.id)
            if not case:
                case = self.create({"subscription_id": order.id})
            case.last_scanned_at = fields.Datetime.now()
            if case.stage in ("new", "working") and case.risk_score < 25:
                case.stage = "closed"
            elif case.stage == "closed" and case.risk_score >= 25:
                case.stage = "new"
        self.search([("subscription_id", "not in", orders.ids), ("stage", "in", ["new", "working"]) ]).write({"stage": "closed"})

    def action_open_subscription(self):
        self.ensure_one()
        return {
            "type": "ir.actions.act_window", "name": _("Subscription"),
            "res_model": "sale.order", "res_id": self.subscription_id.id,
            "view_mode": "form", "target": "current",
        }

    def action_start_work(self):
        self.write({"stage": "working"})
        return True

    def action_mark_saved(self):
        self.write({"stage": "saved"})
        return True
