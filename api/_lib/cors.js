const DEFAULT_ORIGINS = [
  'https://nick-konstantinov.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGIN || '';
  const parsed = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length ? parsed : DEFAULT_ORIGINS;
}

function applyCors(req, res) {
  const allowed = getAllowedOrigins();
  const origin = req.headers.origin || '';

  if (allowed.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { applyCors };
