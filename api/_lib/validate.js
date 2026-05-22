const PHONE_RE = /^\+?[\d\s()\-]{5,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateContact(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'invalid-payload' };
  }

  const name = asString(payload.name);
  const phone = asString(payload.phone);
  const email = asString(payload.email);
  const message = asString(payload.message);
  const website = asString(payload.website);

  if (website) {
    return { ok: false, error: 'spam', field: 'website' };
  }

  if (name.length < 2 || name.length > 200) {
    return { ok: false, error: 'name-invalid', field: 'name' };
  }
  if (!PHONE_RE.test(phone)) {
    return { ok: false, error: 'phone-invalid', field: 'phone' };
  }
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return { ok: false, error: 'email-invalid', field: 'email' };
  }
  if (message.length < 5 || message.length > 5000) {
    return { ok: false, error: 'message-invalid', field: 'message' };
  }

  return {
    ok: true,
    data: { name, phone, email, message },
  };
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { validateContact, escapeHtml };
