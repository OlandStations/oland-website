// functions/api/create-ticket.ts
//
// Cloudflare Pages Function — saves a "Send us a message" contact-form
// submission (the /contact-1 page, NOT the quote-request form) as a HubSpot
// Ticket, tagged with which of the three inquiry types the visitor picked.
//
// Route:  POST /api/create-ticket
// Called: from the contact-1 page's message form, REPLACING the current
//         mailto: draft logic entirely — this is the only thing that runs
//         on submit now, no client email app involved.
//
// Why a Ticket and not a Deal/Contact-only: HubSpot Tickets are the CRM
// object meant for "someone contacted us," they show up in the normal
// HubSpot inbox/tickets views your team already uses, and — this is the
// whole reason for building this endpoint the way it is — a HubSpot
// **workflow** (built in the HubSpot UI, no code) can watch for new tickets
// and branch on the inquiry-type property to notify different people. This
// function's only job is: get the submission into HubSpot, reliably, as a
// real record. The is-it-Troubleshooting-or-Marketing email routing is
// entirely a HubSpot-side workflow, configured separately — see
// CONTACT-FORM-SETUP.md.
//
// Requires the SAME Cloudflare Pages secret already set for create-deal.ts:
//   HUBSPOT_PRIVATE_APP_TOKEN
// but that Private App needs one MORE scope added (it currently only has
// contact/deal scopes) — see CONTACT-FORM-SETUP.md for exactly which one
// and how to add it without regenerating the token.

export interface Env {
  HUBSPOT_PRIVATE_APP_TOKEN: string;
}

// The custom ticket property that stores which of the three options the
// visitor picked. Confirmed via GET /crm/v3/properties/tickets — the
// property labelled "Inquiry Type" has internal name "inquiry_type" (no
// suffix appended) with options "General Inquiry" / "Marketing" /
// "Troubleshooting", in that order.
const INQUIRY_TYPE_PROPERTY = "inquiry_type";

// Ticket pipeline + starting stage. Confirmed via GET
// /crm/v3/pipelines/tickets — this portal has exactly one ticket pipeline,
// "Support Pipeline" (id "0"), with its first stage "New" (id "1").
const TICKET_PIPELINE_ID = "0";
const TICKET_STAGE_ID = "1";

const HUBSPOT_API = "https://api.hubapi.com";
// HubSpot's documented default association type id for Ticket → Contact.
// Left as-is (same pattern as create-deal.ts's DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID) —
// if ticket creation ever fails specifically on the `associations` field,
// that's the first thing to re-verify via
// GET /crm/v4/associations/tickets/contacts/labels.
const TICKET_TO_CONTACT_ASSOCIATION_TYPE_ID = 16;

interface ContactFormRequestBody {
  // The real component may use firstname/lastname, or a single combined
  // "name" field — send whichever it actually has, this function accepts
  // either (see buildFullName below). Don't guess a split that isn't there.
  firstname?: string;
  lastname?: string;
  name?: string;
  email: string;
  message: string;
  inquiryType: string; // "General Inquiry" | "Marketing" | "Troubleshooting"
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.HUBSPOT_PRIVATE_APP_TOKEN) {
    return json({ ok: false, error: "HUBSPOT_PRIVATE_APP_TOKEN is not set on this Pages project" }, 500);
  }

  let body: ContactFormRequestBody;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Request body must be JSON" }, 400);
  }

  if (!body.email || !isEmail(body.email)) {
    return json({ ok: false, error: "A valid 'email' field is required" }, 400);
  }
  if (!body.message || !body.message.trim()) {
    return json({ ok: false, error: "A non-empty 'message' field is required" }, 400);
  }
  if (!body.inquiryType || !body.inquiryType.trim()) {
    return json({ ok: false, error: "An 'inquiryType' field is required" }, 400);
  }

  const token = env.HUBSPOT_PRIVATE_APP_TOKEN;

  try {
    // 1. Upsert the contact by email — same reasoning as create-deal.ts:
    //    self-contained, doesn't race against anything else.
    const contactId = await upsertContact(token, body);

    // 2. Create the ticket, associated to the contact in the same call.
    //    No dedupe here on purpose — unlike the quote form's deal, every
    //    contact-form submission is its own inquiry and should become its
    //    own ticket, even from a repeat visitor.
    const ticketId = await createTicket(token, contactId, body);

    return json({ ok: true, ticketId, contactId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: message }, 502);
  }
};

async function upsertContact(token: string, body: ContactFormRequestBody): Promise<string> {
  const { firstname, lastname } = splitName(body);
  const res = await hubspotFetch(token, "/crm/v3/objects/contacts/batch/upsert", {
    method: "POST",
    body: JSON.stringify({
      inputs: [
        {
          id: body.email,
          idProperty: "email",
          properties: {
            email: body.email,
            firstname,
            lastname,
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

async function createTicket(token: string, contactId: string, body: ContactFormRequestBody): Promise<string> {
  const properties: Record<string, string> = {
    subject: ticketSubject(body),
    content: body.message,
    hs_pipeline: TICKET_PIPELINE_ID,
    hs_pipeline_stage: TICKET_STAGE_ID,
    [INQUIRY_TYPE_PROPERTY]: body.inquiryType,
  };

  const res = await hubspotFetch(token, "/crm/v3/objects/tickets", {
    method: "POST",
    body: JSON.stringify({
      properties,
      associations: [
        {
          to: { id: contactId },
          types: [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: TICKET_TO_CONTACT_ASSOCIATION_TYPE_ID },
          ],
        },
      ],
    }),
  });

  const data = await res.json<any>();
  if (!res.ok) {
    throw new Error(`HubSpot ticket creation failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data.id as string;
}

function splitName(body: ContactFormRequestBody): { firstname: string; lastname: string } {
  if (body.firstname || body.lastname) {
    return { firstname: body.firstname ?? "", lastname: body.lastname ?? "" };
  }
  // Single combined "name" field — send the whole thing as firstname rather
  // than guessing a split, same approach used for the French quote form.
  return { firstname: body.name ?? "", lastname: "" };
}

function buildFullName(body: ContactFormRequestBody): string {
  const { firstname, lastname } = splitName(body);
  return [firstname, lastname].filter(Boolean).join(" ") || body.email;
}

function ticketSubject(body: ContactFormRequestBody): string {
  return `${body.inquiryType} — ${buildFullName(body)}`;
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
