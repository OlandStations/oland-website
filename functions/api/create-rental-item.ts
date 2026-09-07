// functions/api/create-rental-item.ts
//
// Cloudflare Pages Function — creates a new item on the "Rental Operations"
// board, in the "Quote Stage Only - Requests from Hubspot" group, for each
// quote-form submission.
//
// Route:  POST /api/create-rental-item
// Called: from QuoteForm.tsx (and QuoteFormFr.tsx), after /api/create-deal
//         resolves — see quoteform-snippet.tsx for the sequencing. If this
//         call fails, it doesn't undo the HubSpot contact/deal; it just
//         logs, same as before.
//
// Requires one Cloudflare Pages secret:
//   MONDAY_API_TOKEN
// See MONDAY-SETUP.md for the token and the general column-lookup query.

export interface Env {
  MONDAY_API_TOKEN: string;
}

const MONDAY_BOARD_ID = 4653069063; // "Rental Operations" board — confirmed
const MONDAY_GROUP_ID = "group_mm0mwx2g"; // "Quote Stage Only - Requests from Hubspot" — confirmed

type MondayColumnType = "text" | "long_text" | "email" | "date" | "numbers";

interface MondayColumnConfig {
  id: string;
  type: MondayColumnType;
}

// Confirmed pass-through fields: form value -> column, written as-is.
const MONDAY_COLUMN_MAP: Record<string, MondayColumnConfig> = {
  email: { id: "text_mkt3kh0j", type: "text" }, // "Contact email(s)" — no email-type column exists on this board, written as plain text
  eventStartDate: { id: "date__1", type: "date" }, // "Event Start Date"
  eventEndDate: { id: "date8__1", type: "date" }, // "Event End Date"
  notes: { id: "text2__1", type: "text" }, // "Extra comments & notes" — used by QuoteFormFr's "additional notes" field; not sent by the English form
};

// "Client name" and "Contact Name" — two separate text columns, confirmed
// via board introspection. If the form doesn't collect a distinct
// company/client name (only a person's name), both end up holding the same
// value — handled in createItem(), not here.
const CLIENT_NAME_COLUMN_ID: string | null = "text_mkqzsepd"; // "Client name"
const CONTACT_NAME_COLUMN_ID: string | null = "text_mkt33327"; // "Contact Name(s)"

// "Event name" — no column titled "Event Name" exists on this board (only
// the item's own built-in title, i.e. the `name` column). Left null; the
// computed name still becomes the item's title via itemName() below.
const EVENT_NAME_COLUMN_ID: string | null = null;

// Status — every item this creates starts out as "MQL/Interested". Column
// confirmed (id "status", type "status") and the label confirmed as an
// EXACT existing option (labels.10 === "MQL/Interested") — not a near-miss
// that would silently create a stray new label.
const STATUS_COLUMN_ID: string | null = "status";
const STATUS_LABEL = "MQL/Interested";

// "HubSpot Deal" — confirmed as id "integration_mm0m57dp", type
// "integration" (settings_str: {"app":"hubspot","entity_type":"deal"}).
// That's monday's own native HubSpot integration column, not a plain
// text/link field — it's driven by monday's HubSpot sync, not writable via
// column_values the way a text column is. Left null on purpose; don't fight
// the native sync. hubspotDealId is still accepted on the request body (see
// QuoteRequestBody) in case a plain text/link column is added later.
const HUBSPOT_DEAL_COLUMN_ID: string | null = null;

const MONDAY_API = "https://api.monday.com/v2";
// monday promotes a new default API version every quarter — bump this
// periodically (see MONDAY-SETUP.md).
const MONDAY_API_VERSION = "2026-07";

interface QuoteRequestBody {
  firstname?: string;
  lastname?: string;
  email: string;
  eventStartDate?: string; // "YYYY-MM-DD"
  eventEndDate?: string; // "YYYY-MM-DD"
  eventLocation?: string;
  expectedAttendance?: string | number;
  clientName?: string; // only send this if the form actually collects one distinct from the contact's name
  notes?: string; // "Extra comments & notes" column — QuoteFormFr's additional-notes field
  hubspotDealId?: string; // passed through from the /api/create-deal response, if it succeeded
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.MONDAY_API_TOKEN) {
    return json({ ok: false, error: "MONDAY_API_TOKEN is not set on this Pages project" }, 500);
  }

  let body: QuoteRequestBody;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Request body must be JSON" }, 400);
  }

  if (!body.email || !isEmail(body.email)) {
    return json({ ok: false, error: "A valid 'email' field is required" }, 400);
  }

  try {
    const itemId = await createItem(env.MONDAY_API_TOKEN, body);
    return json({ ok: true, itemId });
  } catch (err) {
    // Whatever monday's GraphQL API actually said comes back here — read
    // the response body instead of hunting through the automation UI.
    const message = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: message }, 502);
  }
};

async function createItem(token: string, body: QuoteRequestBody): Promise<string> {
  const columnValues: Record<string, unknown> = {};

  // Pass-through fields with a confirmed column.
  for (const [field, config] of Object.entries(MONDAY_COLUMN_MAP)) {
    const raw = (body as unknown as Record<string, unknown>)[field];
    if (raw === undefined || raw === null || raw === "") continue;
    columnValues[config.id] = buildColumnValue(config.type, raw);
  }

  const fullName = contactFullName(body);

  if (CONTACT_NAME_COLUMN_ID) {
    columnValues[CONTACT_NAME_COLUMN_ID] = buildColumnValue("text", fullName);
  }
  if (CLIENT_NAME_COLUMN_ID) {
    // Falls back to the contact's own name if the form has no separate
    // client/company field.
    columnValues[CLIENT_NAME_COLUMN_ID] = buildColumnValue("text", body.clientName || fullName);
  }
  if (EVENT_NAME_COLUMN_ID) {
    columnValues[EVENT_NAME_COLUMN_ID] = buildColumnValue("text", itemName(body));
  }
  if (STATUS_COLUMN_ID) {
    columnValues[STATUS_COLUMN_ID] = { label: STATUS_LABEL };
  }
  if (HUBSPOT_DEAL_COLUMN_ID && body.hubspotDealId) {
    columnValues[HUBSPOT_DEAL_COLUMN_ID] = buildColumnValue("text", body.hubspotDealId);
  }

  const query = `
    mutation CreateRentalItem($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
      create_item(
        board_id: $boardId
        group_id: $groupId
        item_name: $itemName
        column_values: $columnValues
      ) {
        id
      }
    }
  `;

  const res = await fetch(MONDAY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // monday takes the raw token here — no "Bearer " prefix.
      Authorization: token,
      "API-Version": MONDAY_API_VERSION,
    },
    body: JSON.stringify({
      query,
      variables: {
        boardId: MONDAY_BOARD_ID,
        groupId: MONDAY_GROUP_ID,
        itemName: itemName(body),
        columnValues: JSON.stringify(columnValues),
      },
    }),
  });

  const data = await res.json<any>();
  if (!res.ok || data.errors) {
    throw new Error(`monday.com item creation failed (${res.status}): ${JSON.stringify(data.errors ?? data)}`);
  }
  return data.data.create_item.id as string;
}

// Column value shapes are type-specific. Status and the HubSpot Deal column
// are built inline above rather than through here, since status isn't a
// pass-through of form data and the deal-link shape depends on what kind of
// column it turns out to be.
function buildColumnValue(type: MondayColumnType, raw: unknown): unknown {
  switch (type) {
    case "email":
      return { email: String(raw), text: String(raw) };
    case "date":
      return { date: String(raw) }; // expects "YYYY-MM-DD"
    case "numbers":
      return String(raw); // yes, still a string — monday's API expects the number as text
    case "text":
    case "long_text":
    default:
      return String(raw);
  }
}

function contactFullName(body: QuoteRequestBody): string {
  return [body.firstname, body.lastname].filter(Boolean).join(" ") || body.email;
}

function itemName(body: QuoteRequestBody): string {
  const when = body.eventStartDate ? ` – ${body.eventStartDate}` : "";
  return `${contactFullName(body)}${when}`;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
