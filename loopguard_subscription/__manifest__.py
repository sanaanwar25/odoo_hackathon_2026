{
    "name": "LoopGuard Subscription Rescue",
    "summary": "Spot renewal risk early and coordinate customer save actions",
    "version": "19.0.1.0.0",
    "category": "Sales/Subscriptions",
    "author": "Brightloop Software",
    "license": "LGPL-3",
    "depends": ["sale_subscription", "account", "mail"],
    "data": [
        "security/ir.model.access.csv",
        "views/rescue_case_views.xml",
        "data/ir_cron.xml",
    ],
    "application": True,
    "installable": True,
}
