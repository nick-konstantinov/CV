require('dotenv').config({ path: '.env.local' });

const express = require('express');
const path = require('path');

const contactHandler = require('./api/contact');
const chatHandler = require('./api/chat');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'src')));

app.all('/api/contact', (req, res) => contactHandler(req, res));
app.all('/api/chat', (req, res) => chatHandler(req, res));

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Local dev server running at http://localhost:${PORT}`);
});
