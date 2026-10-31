# LoopGuard: save the renewal before it becomes churn

## One-liner

LoopGuard is an Odoo subscription rescue layer that spots risk early, explains the signal, and gives a person a useful next action.

## The problem

Subscription teams notice failed renewals in fragments: an overdue invoice here, an expiring contract there, a paused account buried in a list. By the time the finance report is assembled, a recoverable customer may already be gone.

## The idea

Odoo already manages products, recurring plans, quotations, invoices, payments, and portal access. LoopGuard connects those signals into one ranked renewal queue. Every flagged account shows why it surfaced, its exposed contract value, who owns it, and what to do next.

## Why it stands out

- **Explainable risk:** overdue invoice age, upcoming contract end, and late billing contribute visible points and reasons.
- **Next best action:** the suggested follow-up changes with the signal, from a payment-date call to a renewal-options check-in.
- **Closed loop:** staff assign and track a rescue case through review, follow-up, renewal, or closure.
- **No double billing:** the demo creates one invoice per subscription billing cycle and skips cycles already billed.
- **Human first:** it ranks work for the team instead of claiming that an opaque model can predict every cancellation.

## 90-second stage demo

Show the overview. Open Lena's case and explain the overdue invoice plus the contract end date. Record the payment and show the risk score fall. Generate the due invoices and show that a second run does not create duplicates. Switch to Lena's customer view and show that she can see only her own records.

## Product path

The project includes an Odoo 19 add-on scaffold in `loopguard_subscription/` and a no-build browser demo in `demo/`. The add-on uses Odoo Subscriptions and Accounting as its source of truth; the demo makes the proposed user experience easy to review before connecting the final hackathon database and payment provider.
