// functions/api/create-deal.ts
//
// Cloudflare Pages Function — creates (or finds) a HubSpot deal for a quote
// request and links it to the contact.
//
// Route:  POST /api/create-deal
// Called: from QuoteForm.tsx, right after it posts to HubSpot's public
//         Forms API (that part is untouched — this is an extra fetch()).
//
// This function does its OWN contact upsert rather than trusting that the
// public Forms submission has already landed in HubSpot by the time this
// runs, so there's no race between the two requests.
//
// Requires one Cloudflare Pages secret:
//   HUBSPOT_PRIVATE_APP_TOKEN
// See SETUP.md (shipped alongside this file) for how to create the private
// app, set the secret, and test this before wiring it to the real form.

export interface Env {
  HUBSPOT_PRIVATE_APP_TOKEN: string;
}

// Matched against the portal's actual custom deal properties (GET
// /crm/v3/properties/deals) — none of them are named event_start_date /
// event_end_date / event_location / expected_attendance, so this isn't a
// literal guess:
//   - "first_date" (label "first-date", type date) -> eventStartDate
//   - "end_date" (label "end-date", type date, description "Final date
//     that the event needs the stations.") -> eventEndDate
//   - "number_of_attendees" (label "number of attendees", type string)
//     -> expectedAttendance
//   - no property matching "event location" exists on this portal at all
//     -> eventLocation intentionally left unmapped below; createDeal()
//     skips writing any field whose map entry is missing.
const DEAL_PROPERTY_MAP: Partial<
  Record<"eventStartDate" | "eventEndDate" | "eventLocation" | "expectedAttendance", string>
> = {
  eventStartDate: "first_date",
  eventEndDate: "end_date",
  expectedAttendance: "number_of_attendees",
};

const HUBSPOT_API = "https://api.hubapi.com";
const DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID = 3; // HubSpot default, HUBSPOT_DEFINED category

interface QuoteRequestBody {
  firstname?: string;
  lastname?: string;
  email: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventLocation?: string;
  expectedAttendance?: string | number;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.HUBSPOT_PRIVATE_APP_TOKEN) {
    return json({ ok: false, error: "HUBSPOT_PRIVATE_APP_TOKEN is not set on this Pages project" }, 500);
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

  const token = env.HUBSPOT_PRIVATE_APP_TOKEN;

  try {
    // 1. Upsert the contact by email — self-contained, doesn't depend on
    //    the public Forms submission having landed first.
    const contactId = await upsertContact(token, body);

    // 2. Dedupe: does this contact already have a deal? Resubmits and
    //    double-clicks shouldn't create a second one.
    const existingDealId = await findExistingDeal(token, contactId);
    if (existingDealId) {
      return json({ ok: true, duplicate: true, dealId: existingDealId, contactId });
    }

    // 3. Create the deal, associated to the contact in the same call.
    const dealId = await createDeal(token, contactId, body);

    return json({ ok: true, duplicate: false, dealId, contactId });
  } catch (err) {
    // Bubble up whatever HubSpot actually said. That's the whole point of
    // moving this out of Make: a real, readable error instead of a popup.
    const message = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: message }, 502);
  }
};

async function upsertContact(token: string, body: QuoteRequestBody): Promise<string> {
  const res = await hubspotFetch(token, "/crm/v3/objects/contacts/batch/upsert", {
    method: "POST",
    body: JSON.stringify({
      inputs: [
        {
          id: body.email,
          idProperty: "email",
          properties: {
            email: body.email,
            firstname: body.firstname ?? "",
            lastname: body.lastname ?? "",
          },
        },
      ],
    }),
  });

  const data = await res.json<any>();
  if (!res.ok) {
    throw new Error(`HubSpot contact upsert failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data.results[0].id as string;
}

async function findExistingDeal(token: string, contactId: string): Promise<string | null> {
  const res = await hubspotFetch(
    token,
    `/crm/v4/objects/contacts/${contactId}/associations/deals`,
    { method: "GET" }
  );
  const data = await res.json<any>();
  if (!res.ok) {
    throw new Error(`HubSpot association lookup failed (${res.status}): ${JSON.stringify(data)}`);
  }
  const results = data.results ?? [];
  return results.length > 0 ? String(results[0].toObjectId) : null;
}

async function createDeal(token: string, contactId: string, body: QuoteRequestBody): Promise<string> {
  const properties: Record<string, string> = {
    dealname: dealName(body),
  };
  // "first_date" / "end_date" are HubSpot `date`-type properties, which
  // (like the Forms API date-picker fields above) want midnight-UTC epoch
  // milliseconds, not the raw "YYYY-MM-DD" string.
  if (body.eventStartDate && DEAL_PROPERTY_MAP.eventStartDate) {
    properties[DEAL_PROPERTY_MAP.eventStartDate] = toHubSpotDateProperty(body.eventStartDate);
  }
  if (body.eventEndDate && DEAL_PROPERTY_MAP.eventEndDate) {
    properties[DEAL_PROPERTY_MAP.eventEndDate] = toHubSpotDateProperty(body.eventEndDate);
  }
  if (body.eventLocation && DEAL_PROPERTY_MAP.eventLocation) {
    properties[DEAL_PROPERTY_MAP.eventLocation] = body.eventLocation;
  }
  if (
    DEAL_PROPERTY_MAP.expectedAttendance &&
    body.expectedAttendance !== undefined &&
    body.expectedAttendance !== ""
  ) {
    properties[DEAL_PROPERTY_MAP.expectedAttendance] = String(body.expectedAttendance);
  }

  const res = await hubspotFetch(token, "/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify({
      properties,
      associations: [
        {
          to: { id: contactId },
          types: [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID },
          ],
        },
      ],
    }),
  });

  const data = await res.json<any>();
  if (!res.ok) {
    throw new Error(`HubSpot deal creation failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data.id as string;
}

/** HubSpot `date`-type CRM properties want midnight-UTC epoch milliseconds. */
function toHubSpotDateProperty(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return "";
  return String(Date.UTC(y, m - 1, d));
}

function dealName(body: QuoteRequestBody): string {
  const who = [body.firstname, body.lastname].filter(Boolean).join(" ") || body.email;
  const when = body.eventStartDate ? ` – ${body.eventStartDate}` : "";
  return `Quote request – ${who}${when}`;
}

function hubspotFetch(token: string, path: string, init: RequestInit): Promise<Response> {
  return fetch(`${HUBSPOT_API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
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
