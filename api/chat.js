const { applyCors } = require('./_lib/cors');
const { CV_CONTEXT } = require('./_lib/cvContext');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'open_contact_form',
      description:
        'Open the contact form modal on the page. Call this only when the user explicitly wants to write to Nick, send a message, leave contact details or otherwise get in touch via the form.',
      parameters: {
        type: 'object',
        properties: {
          reason: {
            type: 'string',
            description: 'Short reason why the form is being opened (1 sentence).',
          },
        },
        required: [],
      },
    },
  },
];

function systemPrompt(lang) {
  const langName = lang === 'ru' ? 'Russian' : 'English';
  return [
    "You are a helpful AI assistant embedded on Nick Konstantinov's CV website.",
    'You answer questions about Nick (Mikita Kanstantsinau), a Frontend Developer,',
    'based strictly on the CV context below. Keep answers short and concrete —',
    'usually 1-3 sentences, never more than a short paragraph.',
    '',
    `Always answer in ${langName} regardless of the user's input language.`,
    'If a question is clearly outside the CV scope (general programming chat,',
    'random topics), briefly say it is outside what you can help with and',
    'suggest contacting Nick via the form.',
    '',
    'When the user explicitly says they want to write to Nick, send a message,',
    'leave contact details or get in touch, call the open_contact_form tool',
    'instead of just describing the form.',
    '',
    'CV context:',
    CV_CONTEXT,
  ].join('\n');
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && typeof m === 'object')
    .slice(-12)
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.text || m.content || '').slice(0, 4000),
    }))
    .filter((m) => m.content);
}

module.exports = async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method-not-allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'chat-not-configured' });
  }

  const body = req.body || {};
  const lang = body.lang === 'ru' ? 'ru' : 'en';
  const history = normalizeMessages(body.messages);

  if (!history.length) {
    return res.status(400).json({ error: 'no-messages' });
  }

  const payload = {
    model: MODEL,
    messages: [{ role: 'system', content: systemPrompt(lang) }, ...history],
    tools: TOOLS,
    tool_choice: 'auto',
    temperature: 0.5,
    max_tokens: 500,
  };

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('groq upstream error', groqRes.status, errText);
      return res.status(502).json({ error: 'chat-upstream' });
    }

    const data = await groqRes.json();
    const choice = data.choices && data.choices[0];
    if (!choice) {
      return res.status(502).json({ error: 'chat-no-choice' });
    }

    const message = choice.message || {};
    const tools = Array.isArray(message.tool_calls)
      ? message.tool_calls
          .filter((t) => t && t.type === 'function' && t.function)
          .map((t) => ({ name: t.function.name }))
      : [];

    return res.status(200).json({
      reply: typeof message.content === 'string' ? message.content : '',
      tools,
    });
  } catch (err) {
    console.error('chat handler error', err && err.message ? err.message : err);
    return res.status(502).json({ error: 'chat-failed' });
  }
};
