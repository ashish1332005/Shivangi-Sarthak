const RECIPIENT = "918126737185";
const MAX_FIELD_LENGTH = 500;

function cleanText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const fullName = cleanText(req.body?.fullName);
  const contact = cleanText(req.body?.contact, "Not provided") || "Not provided";
  const attendance = cleanText(req.body?.attendance);
  const pickup = cleanText(req.body?.pickup);

  if (!fullName || !attendance || !pickup) {
    return res.status(400).json({ error: "Please complete the required RSVP fields." });
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_RSVP_TEMPLATE;
  const language = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US";
  const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION;

  if (!token || !phoneNumberId || !templateName || !graphVersion) {
    console.error("WhatsApp RSVP endpoint is missing required environment configuration.");
    return res.status(503).json({ error: "RSVP messaging is not configured yet. Please contact the hosts." });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${encodeURIComponent(graphVersion)}/${encodeURIComponent(phoneNumberId)}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: RECIPIENT,
          type: "template",
          template: {
            name: templateName,
            language: { code: language },
            components: [{
              type: "body",
              parameters: [fullName, contact, attendance, pickup].map((text) => ({
                type: "text",
                text
              }))
            }]
          }
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("WhatsApp RSVP delivery failed:", response.status, details.slice(0, 1000));
      return res.status(502).json({ error: "WhatsApp could not receive the RSVP. Please try again or contact the hosts." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("WhatsApp RSVP request failed:", error.message);
    return res.status(502).json({ error: "WhatsApp could not receive the RSVP. Please try again or contact the hosts." });
  }
};
