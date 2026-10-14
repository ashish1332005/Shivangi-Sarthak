# Shivangi & Sarthak · Wedding Celebration 2026

A wedding invitation and RSVP website for Shivangi and Sarthak's celebration in Pushkar, Rajasthan, on 11–12 November 2026.

## Features

- Cinematic welcome with ambient video and music.
- Wedding invitation featuring the Ganesh prayer and family details.
- Event schedule, dress code, venue information, and travel guidance.
- RSVP form with confirmation experience.

## Run locally

Requirements: Node.js 16 or later.

From the project folder, run:

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

You can also start the server directly with `node server.js`.

## WhatsApp RSVP delivery

The RSVP form sends its details to the server endpoint at `/api/rsvp`. The endpoint delivers the submission to the hosts at **+91 81267 37185** through the WhatsApp Business Platform. It does not open a WhatsApp chat in the guest's browser.

For live delivery, configure these Vercel project environment variables for the Production environment:

- `WHATSAPP_ACCESS_TOKEN`: secret access token with the `whatsapp_business_messaging` permission.
- `WHATSAPP_PHONE_NUMBER_ID`: the WhatsApp Business sender phone number ID from Meta.
- `WHATSAPP_RSVP_TEMPLATE`: the name of a Meta-approved WhatsApp message template.
- `WHATSAPP_TEMPLATE_LANGUAGE`: the template language code, for example `en_US`.
- `WHATSAPP_GRAPH_API_VERSION`: the Graph API version enabled for the Meta app, for example `v23.0`.

Create and get approval for a template whose body has four text placeholders, in this order: guest name, contact number, attendance, and pickup request. The sender must be a WhatsApp Business Platform number; the destination number above is the hosts' receiving number. After adding the variables in Vercel, redeploy the Production deployment. Keep the access token only in Vercel environment settings; never put it in browser code or commit it.
