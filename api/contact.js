const nodemailer = require('nodemailer');
const { applyCors } = require('./_lib/cors');
const { validateContact, escapeHtml } = require('./_lib/validate');

let cachedTransport;

function getTransport() {
  if (cachedTransport) return cachedTransport;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD env vars are required');
  }

  cachedTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    family: 4,
    auth: { user, pass: pass.replace(/\s+/g, '') },
  });
  return cachedTransport;
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

  let transport;
  try {
    transport = getTransport();
  } catch (err) {
    console.error('mail config error', err);
    return res.status(500).json({ error: 'mail-not-configured' });
  }

  const fromAddress = `"CV Contact Form" <${process.env.GMAIL_USER}>`;
  const ownerEmail = process.env.MAIL_OWNER || process.env.GMAIL_USER;

  try {
    await transport.sendMail({
      from: fromAddress,
      to: ownerEmail,
      replyTo: email,
      subject: `New message from CV form — ${name}`,
      html: ownerHtml({ name, phone, email, message }),
      text: ownerText({ name, phone, email, message }),
    });

    await transport.sendMail({
      from: fromAddress,
      to: email,
      replyTo: ownerEmail,
      subject: 'Copy of your message to Nick Konstantinov',
      html: userHtml({ name, phone, email, message }),
      text: userText({ name, phone, email, message }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('mail send error', err && err.message ? err.message : err);
    return res.status(502).json({ error: 'mail-failed' });
  }
};
