# LoopGuard | Odoo Subscription Rescue

LoopGuard is a focused Odoo 19 add-on concept for the Brightloop subscription brief. It builds on Odoo's native subscription, sales, accounting, product, discount, and customer portal flows, then adds a proactive renewal-rescue queue so a team can act before recurring revenue is lost.

## What is included

- An installable Odoo add-on in `loopguard_subscription/`.
- A standalone interactive judging demo in `demo/` (no build step).
- Renewal risk signals from unpaid invoices, upcoming contract end dates, and overdue next billing dates.
- A single rescue case per subscription, with severity, reasons, owner, stage, and a suggested next action.
- A scheduled scan and team dashboard views inside Odoo.

## Odoo installation

Copy `loopguard_subscription` into an Odoo 19 addons path, restart Odoo, update the Apps list, and install **LoopGuard Subscription Rescue**. It depends on the Odoo Subscriptions app (`sale_subscription`) and Accounting (`account`).

The full subscription lifecycle remains in Odoo's standard Sales and Subscriptions workflows; LoopGuard adds the missing early-warning and follow-up layer. The daily scan can also be run manually from Scheduled Actions while setting up a demo database.

## Demo

Open `demo/index.html` in a modern browser. The demo stores edits in browser local storage. Use the profile menu to switch between the Admin, Operations, and Customer views. The sample customer and financial records are fictional. Reset sample data from Settings → Reset demo data.

## Hackathon pitch

**LoopGuard turns subscription churn into a queue the team can work.** Instead of waiting for a failed renewal or a quarterly spreadsheet, it explains why each contract is at risk, ranks the most urgent recoverable revenue, and gives the owner a useful next action.

The add-on is a hackathon implementation starter, not a payment gateway or production identity service. Live payment collection, email delivery, and customer portal authorization are handled by Odoo configuration and the installed provider.
