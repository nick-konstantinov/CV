const { applyCors } = require('./_lib/cors');
const { validateContact, escapeHtml } = require('./_lib/validate');

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendViaBrevo({ from, to, replyTo, subject, html, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    const err = new Error('BREVO_API_KEY is not set');
    err.code = 'mail-not-configured';
    throw err;
  }

  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: from,
      to: [to],
      replyTo,
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Brevo ${res.status}: ${body}`);
    err.code = 'mail-upstream';
    throw err;
  }
  return res.json();
}

function ownerHtml({ name, phone, email, message }) {
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #313340;">
      <h2 style="margin: 0 0 16px; font-weight: 700;">New message from CV form</h2>
      <table style="width:100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr><td style="padding: 6px 0; font-weight:700; width: 110px;">Name</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight:700;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#313340;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 6px 0; font-weight:700;">Phone</td><td style="padding: 6px 0;">${escapeHtml(phone)}</td></tr>
      </table>
      <div style="padding: 16px; background: #f1f1f1; border-radius: 8px; line-height: 1.5;">
        ${safeMessage}
      </div>
      <p style="margin-top: 24px; color: #808080; font-size: 12px;">
        Sent automatically from the CV contact form. Reply directly to this email — it goes back to ${escapeHtml(email)}.
      </p>
    </div>
  `;
}

function ownerText({ name, phone, email, message }) {
  return [
    'New message from CV form',
    '',
    `Name:  ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    '',
    'Message:',
    message,
  ].join('\n');
}

function userHtml({ name, phone, email, message }) {
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #313340;">
      <h2 style="margin: 0 0 16px; font-weight: 700;">Hi ${escapeHtml(name)}, thanks for reaching out!</h2>
      <p style="margin: 0 0 16px; line-height: 1.5;">
        This is an automatic copy of the message you just sent through Nick Konstantinov's CV form.
        Nick will get back to you on this email shortly.
      </p>
      <p style="margin: 0 0 8px; font-weight: 700;">Your message:</p>
      <div style="padding: 16px; background: #f1f1f1; border-radius: 8px; line-height: 1.5;">
        ${safeMessage}
      </div>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 4px 0; color:#808080; width: 100px;">Phone you left</td><td style="padding: 4px 0;">${escapeHtml(phone)}</td></tr>
      </table>
      <p style="margin-top: 24px; color: #808080; font-size: 12px;">
        If you did not send this message, please ignore the email.
      </p>
    </div>
  `;
}

function userText({ name, message, phone }) {
  return [
    `Hi ${name},`,
    '',
    "This is an automatic copy of the message you just sent through Nick Konstantinov's CV form.",
    'Nick will get back to you on this email shortly.',
    '',
    'Your message:',
    message,
    '',
    `Phone you left: ${phone}`,
  ].join('\n');
}

module.exports = async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method-not-allowed' });
  }

  const validation = validateContact(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error, field: validation.field });
  }

  const { name, phone, email, message } = validation.data;

  const senderEmail = process.env.MAIL_SENDER_EMAIL;
  const senderName = process.env.MAIL_SENDER_NAME || 'CV Contact Form';
  const ownerEmail = process.env.MAIL_OWNER || senderEmail;

  if (!senderEmail) {
    console.error('mail config error: MAIL_SENDER_EMAIL is not set');
    return res.status(500).json({ error: 'mail-not-configured' });
  }

  const from = { email: senderEmail, name: senderName };

  try {
    await sendViaBrevo({
      from,
      to: { email: ownerEmail, name: 'CV Owner' },
      replyTo: { email, name },
      subject: `New message from CV form — ${name}`,
      html: ownerHtml({ name, phone, email, message }),
      text: ownerText({ name, phone, email, message }),
    });

    await sendViaBrevo({
      from,
      to: { email, name },
      replyTo: { email: ownerEmail, name: 'Nick Konstantinov' },
      subject: 'Copy of your message to Nick Konstantinov',
      html: userHtml({ name, phone, email, message }),
      text: userText({ name, phone, email, message }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('mail send error', err && err.message ? err.message : err);
    const code = err && err.code === 'mail-not-configured' ? 500 : 502;
    return res.status(code).json({ error: err && err.code ? err.code : 'mail-failed' });
  }
};
