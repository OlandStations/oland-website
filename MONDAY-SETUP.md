# Wiring up `/api/create-rental-item`

Same pattern as `/api/create-deal`: your quote form fires one more `fetch()`,
this time to a function that creates an item on your **Rental Ops** board,
in the **Quote** group, using a monday.com API token that stays server-side.

It's independent of the HubSpot piece — if monday.com is down or a column
mapping is wrong, the contact and deal still get created; only this one
step fails, and it fails with a readable error instead of silently.

## 1. Drop the file in

`functions/api/create-rental-item.ts` from the repo root — same as
`create-deal.ts`, Cloudflare Pages auto-routes it to `/api/create-rental-item`.

## 2. Get a monday.com API token

monday.com → your avatar (bottom left) → **Developers** → **My Access
Tokens** → copy your personal token. (If your org restricts personal tokens,
an admin can create one under Admin → API instead — either works here,
`Authorization` just needs a valid token in it.)

## 3. Set it as a Cloudflare secret

Same as before — either:

- Dashboard: Pages project → Settings → Environment variables → add
  `MONDAY_API_TOKEN` as **Secret**, then redeploy, or
- CLI: `npx wrangler pages secret put MONDAY_API_TOKEN --project-name <your-project-name>`

## 4. Find your board's real IDs

`create-rental-item.ts` currently has placeholders for `MONDAY_BOARD_ID`,
`MONDAY_GROUP_ID`, and every column ID in `MONDAY_COLUMN_MAP`. monday
identifies all of these by opaque IDs, not the names you see on screen — but
one query gets you everything at once.

**Board ID:** open the Rental Ops board in your browser; the number in the
URL (`monday.com/boards/1234567890`) is the board ID.

**Group ID and column IDs:** go to `developer.monday.com/api-playground`
(or, in the monday.com app, avatar → Developers → API Playground), make
sure you're authenticated as yourself, and run this — swapping in the real
board ID from above:

```graphql
query {
  boards(ids: [1234567890]) {
    groups {
      id
      title
    }
    columns {
      id
      title
      type
    }
  }
}
```

The `groups` list tells you the real ID behind "Quote". The `columns` list
gives you the ID and `type` for every column on the board — match those
against `MONDAY_COLUMN_MAP` in `create-rental-item.ts` (email column →
`type: "email"`, a plain text field → `type: "text"`, a number field →
`type: "numbers"`, a date field → `type: "date"`). If a column you want to
fill is a type this file doesn't handle yet (e.g. a `status` or `location`
column), tell me which one and I'll add that shape — the value format is
different for each column type, so it's worth getting right rather than
guessing.

*(If you connect the monday.com connector in this chat, I can run this
query myself and fill in the real IDs directly instead of you pasting
into the playground.)*

## 5. Test it before touching the real form

```
curl -i -X POST https://<your-site>/api/create-rental-item \
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

Expect `{"ok":true,"itemId":"..."}`. Check the Rental Ops board — a new item
should be sitting in the Quote group with those values filled in. Delete it
once confirmed, it's just test data.

Note this one doesn't dedupe — every call creates a new item, on purpose
(you said every submission should be a new item). If that ever needs to
change, say so and I'll add the same "look before creating" step the
HubSpot function uses.

## 6. Wire it into `QuoteForm.tsx`

Add the second `fetch()` from `quoteform-snippet.tsx` right alongside the
`/api/create-deal` call — both fire off the same form data independently.
