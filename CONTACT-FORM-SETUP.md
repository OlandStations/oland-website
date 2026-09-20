# Contact-page form → HubSpot Ticket — setup

This wires up the *second* form on the site — the "Send us a message" form
on `/contact-1` (General Inquiry / Marketing / Troubleshooting dropdown) —
which today does nothing but build a `mailto:` draft and hope the visitor
sends it themselves. Nothing is saved anywhere right now, and it has no
HubSpot connection at all.

This is separate from the quote-request form and its monday.com/deal
pipeline — don't touch those files.

**What this does:** every submission becomes a HubSpot **Ticket**, tagged
with which inquiry type the visitor picked, associated to a HubSpot
contact. **What this deliberately does NOT do:** send any notification
email itself. That part is a HubSpot **workflow** you build once in the
HubSpot UI (step 4 below) — it watches for new tickets and emails the right
person/people based on the inquiry type. No email-sending code, no new
service to sign up for, and Rachel or whoever manages HubSpot can change
who gets notified later without touching code at all.

---

## 1. Add ticket scopes to the existing Private App

Reuse the same Private App that already does contacts/deals — don't create
a second one. In HubSpot: **Settings → Integrations → Private Apps** (or
**Legacy Apps**, depending on where your account shows it now) → open the
app → **Scopes** tab → search `ticket` and add:

- `tickets` — on this portal it's exposed as a single combined scope
  (covers both read and write) rather than the split `.read`/`.write` pair
  the newer objects (contacts, deals) use. Just the one checkbox.

Save. This regenerates nothing and doesn't invalidate the existing
`HUBSPOT_PRIVATE_APP_TOKEN` secret already set in Cloudflare — same token,
just one more scope attached to it.

## 2. Create the "Inquiry Type" ticket property

**Settings → Properties → Ticket properties → Create property**

- Label: `Inquiry Type`
- Field type: **Dropdown select**
- Options, in this order: `General Inquiry`, `Marketing`, `Troubleshooting`
  (must match the three dropdown options on the site exactly — that's what
  gets written into this property from the form)

After creating it, open the property again and note the **Internal name**
shown on its detail page (usually `inquiry_type`, but HubSpot sometimes
appends a suffix — use whatever it actually shows, not a guess).

## 3. Find the ticket pipeline + starting stage

Tickets require a pipeline and stage on creation. Most accounts have one
default "Support Pipeline" — confirm rather than assume:

```
curl -s https://api.hubapi.com/crm/v3/pipelines/tickets \
  -H "Authorization: Bearer $HUBSPOT_PRIVATE_APP_TOKEN" | python3 -m json.tool
```

Pick the pipeline these should land in (likely the only one, or whichever
one your team actually works tickets out of) and its first/earliest stage
(commonly "New" or "Open"). Note both `id` values.

## 4. Wire the function (Claude Code)

Everything above is manual setup you do once. Once steps 1–3 are done, hand
`claude-code-prompt-contact-form.md` (alongside this file) to Claude Code —
it fills in the three placeholders in `create-ticket.ts` with the real
values from steps 2–3 and wires the actual form component.

## 5. Build the HubSpot workflow that routes notification emails

This is the piece that decides who gets emailed for which inquiry type —
built entirely in HubSpot, no code, no deploy. Once tickets are flowing in
(after step 4 is live):

**Automation → Workflows → Create workflow → From scratch → Ticket-based**

- **Enrollment trigger:** Ticket created, with a filter `Inquiry Type is
  known` (or just enroll all, then branch — either works).
- Add an **If/then branch** on the `Inquiry Type` property, one branch per
  value (`General Inquiry`, `Marketing`, `Troubleshooting`).
- In each branch, add a **"Send internal email notification"** (or
  "Notify team member" — naming varies by HubSpot UI version) action, and
  pick the actual people who should get that category. You can add more
  than one recipient per branch. This is the only place these email
  addresses live — nothing in code needs to know them, and you can add,
  remove, or change recipients any time without a deploy.
- Turn the workflow on.

One thing to check before relying on this: ticket-based workflows with
branching/notification actions are a paid HubSpot feature (Service Hub or
Sales Hub Professional tier and up, roughly) — if your account is on a
Starter or free tier, the workflow builder may not offer this, and it's
worth confirming in your HubSpot account rather than assuming. If it turns
out to be unavailable, the fallback is a plain single-branch workflow that
emails one shared inbox/list regardless of category, with the category
still visible on the ticket itself for manual routing.

## 6. What to tell the team

Once the workflow is live, anyone who used to rely on the old "email draft
opens, please send it" flow should stop expecting that — submissions now
land as Tickets in HubSpot automatically, and the right people get
notified per the workflow in step 5.
