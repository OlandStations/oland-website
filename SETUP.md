# Wiring up `/api/create-deal`

Replaces the Make.com scenario. `QuoteForm.tsx` keeps posting to HubSpot's
public Forms API exactly as it does today — this adds one more `fetch()`
from that same form to a small function living on your own site.

## 1. Drop the file in

Copy `functions/api/create-deal.ts` into your repo at the same path —
`functions/api/create-deal.ts` from the repo root. Cloudflare Pages
auto-routes any file under `functions/` to the matching URL path, so this
one becomes `POST /api/create-deal` with no extra config.

If your project doesn't already have `@cloudflare/workers-types`, add it so
`PagesFunction` resolves:

```
npm install -D @cloudflare/workers-types
```

and make sure your `tsconfig.json` includes it:

```json
{ "compilerOptions": { "types": ["@cloudflare/workers-types"] } }
```

## 2. Create the HubSpot private app

HubSpot → Settings (gear icon) → Integrations → Private Apps → Create a
private app.

Scopes needed:

- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.deals.read`
- `crm.objects.deals.write`

Create it, then copy the access token it shows you once — you won't be able
to see it again (you can only rotate it).

## 3. Set the token as a Cloudflare secret

**Dashboard:** your Pages project → Settings → Environment variables → Add
variable → name it `HUBSPOT_PRIVATE_APP_TOKEN`, paste the token, set it as
**Secret** (encrypted, not plaintext), save, then trigger a redeploy — Pages
only picks up new environment variables on the next deploy.

**Or via CLI:**

```
npx wrangler pages secret put HUBSPOT_PRIVATE_APP_TOKEN --project-name <your-project-name>
```

it'll prompt you to paste the token.

## 4. Fix the deal property names

Open `functions/api/create-deal.ts` and look at `DEAL_PROPERTY_MAP` near the
top — it's currently guesses (`event_start_date`, `event_end_date`,
`event_location`, `expected_attendance`). In HubSpot: Settings → Properties
→ Deal properties → click each property you want filled in → the **Internal
name** field (not the label) is what belongs in that map. Update the four
values to match your portal.

## 5. Test it before touching the real form

Don't wire up `QuoteForm.tsx` yet. Deploy (or run `npx wrangler pages dev`
locally) and hit the endpoint directly with a throwaway email:

```
curl -i -X POST https://<your-site>/api/create-deal \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Test",
    "lastname": "Submission",
    "email": "test-create-deal@example.com",
    "eventStartDate": "2026-10-01",
    "eventEndDate": "2026-10-03",
    "eventLocation": "Test Venue",
    "expectedAttendance": "150"
  }'
```

You should get back `{"ok":true,"duplicate":false,"dealId":"...","contactId":"..."}`.
If something's wrong, the response body says exactly what HubSpot rejected —
no field-picker to hunt through. Run the same `curl` a second time: it
should come back `"duplicate":true` with the same `dealId`, proving the
dedupe works.

Then check HubSpot itself: the test contact and deal should exist and be
linked. Delete both once you've confirmed it, since they're just test data.

## 6. Wire it into `QuoteForm.tsx`

Once step 5 works, add the snippet in `quoteform-snippet.tsx` (shipped
alongside this file) right after the existing HubSpot Forms API call
succeeds. It's fire-and-forget relative to the "Thank you" UI — the contact
is already created by the Forms API call, so a failure here shouldn't block
that confirmation, just get logged.

## 7. Retire Make

Leave the Make scenario turned on but unused for a day or two while real
submissions come through, then turn it off (or delete it) once you've
confirmed deals are showing up correctly from the new path.
