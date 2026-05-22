(function () {
  const launcher = document.querySelector('[data-ai-launcher]');
  const panel = document.querySelector('[data-ai-panel]');
  if (!launcher || !panel) return;

  const closeBtn = panel.querySelector('[data-ai-close]');
  const messagesEl = panel.querySelector('[data-ai-messages]');
  const suggestionsEl = panel.querySelector('[data-ai-suggestions]');
  const form = panel.querySelector('[data-ai-form]');
  const input = panel.querySelector('[data-ai-input]');
  const sendBtn = panel.querySelector('[data-ai-send]');

  const state = {
    messages: [],
    pending: false,
  };

  function getLang() {
    return localStorage.getItem('language') || 'en';
  }

  function translate(key, fallback) {
    const dict = window.mainPageText && window.mainPageText[key];
    if (!dict) return fallback;
    return dict[getLang()] || dict.en || fallback;
  }

  function renderMessage(message) {
    const el = document.createElement('div');
    el.className = `ai-chat__message ai-chat__message--${message.role}`;
    el.textContent = message.text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function renderTyping() {
    const el = document.createElement('div');
    el.className = 'ai-chat__message ai-chat__message--typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    el.setAttribute('aria-label', translate('ai-chat__typing', 'Assistant is typing'));
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function renderGreeting() {
    messagesEl.innerHTML = '';
    const greeting = translate(
      'ai-chat__greeting',
      "Hi! I am a small AI assistant trained on Nick's CV. Ask me about his experience, stack or how to get in touch.",
    );
    const el = document.createElement('div');
    el.className = 'ai-chat__message ai-chat__message--assistant';
    el.textContent = greeting;
    el.dataset.langKey = 'ai-chat__greeting';
    messagesEl.appendChild(el);
  }

  function renderSuggestions() {
    suggestionsEl.innerHTML = '';
    const keys = [
      'ai-chat__suggestion-stack',
      'ai-chat__suggestion-experience',
      'ai-chat__suggestion-contact',
    ];
    keys.forEach((key) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-chat__suggestion';
      btn.dataset.langKey = key;
      btn.textContent = translate(key, key);
      btn.addEventListener('click', () => {
        input.value = btn.textContent;
        form.requestSubmit();
      });
      suggestionsEl.appendChild(btn);
    });
  }

  function hideSuggestions() {
    suggestionsEl.style.display = 'none';
  }

  function fakeReply(userText) {
    const lang = getLang();
    const t = userText.toLowerCase();

    const replies = {
      en: {
        stack: 'Main stack: Angular 2+, TypeScript, RxJS, NgRX, Angular Material, SCSS, REST + Swagger, Webpack, GitLab CI/CD. Comfortable with Agile (Scrum, Kanban).',
        experience: 'Middle Front-end at CommunityTech Group since 06.2024 — 14-person team, 40+ delivered features, 80+ fixed bugs, 9 client UI customizations, ~20% perf gain through lazy-loading, monorepo migration. Before that — freelance, full-stack landing pages (HTML/CSS/JS/PHP).',
        contact: 'Easiest way — the "Write to me" button in the top-right corner: it opens a form, you will get a copy of your message and Nick will reply on email. Telegram and email are also in the Contacts block.',
        ai: 'Nick uses Claude Code, Cursor and ChatGPT as a drafting partner: routine, types, tests, exploring unfamiliar APIs, parsing stack traces. He never delegates understanding — final decision is his and AI output is verified by types and tests.',
        default: "I'm running in offline-demo mode for now — once the backend is wired up I'll be able to give richer answers. Try asking about stack, experience or how to get in touch.",
      },
      ru: {
        stack: 'Основной стек: Angular 2+, TypeScript, RxJS, NgRX, Angular Material, SCSS, REST + Swagger, Webpack, GitLab CI/CD. Уверенно в Agile (Scrum, Kanban).',
        experience: 'Middle Front-end в CommunityTech Group с 06.2024 — команда 14 человек, 40+ выкаченных фич, 80+ исправленных багов, 9 кастомизаций UI под клиентов, ~20% ускорение через lazy-loading, миграция в монорепозиторий. До этого — фриланс и лендинги (HTML/CSS/JS/PHP).',
        contact: 'Проще всего — кнопкой «Написать мне» в правом верхнем углу: откроется форма, копия письма прилетит вам, Никита ответит на email. Telegram и почта есть в блоке «Контакты».',
        ai: 'Никита использует Claude Code, Cursor и ChatGPT как соавтора черновика: рутина, типы, тесты, разбор незнакомого API и стектрейсов. Понимание задачи AI не делегируется — финальное решение и ревью за человеком, ответы AI верифицируются типами и тестами.',
        default: 'Сейчас работаю в офлайн-демо режиме — после подключения бэкенда смогу отвечать содержательнее. Попробуйте спросить про стек, опыт или как связаться.',
      },
    };

    const dict = replies[lang] || replies.en;

    if (/stack|стек|technolog|технолог/.test(t)) return dict.stack;
    if (/experience|опыт|работ|achieve|достиж/.test(t)) return dict.experience;
    if (/contact|связ|форм|email|почт|телеграм|telegram/.test(t)) return dict.contact;
    if (/\bai\b|искусств|нейро|claude|gpt|cursor/.test(t)) return dict.ai;
    return dict.default;
  }

  async function sendUserMessage(text) {
    if (!text.trim() || state.pending) return;

    state.pending = true;
    sendBtn.disabled = true;
    input.disabled = true;

    state.messages.push({role: 'user', text});
    renderMessage({role: 'user', text});
    hideSuggestions();

    const typing = renderTyping();

    try {
      const cfg = window.AppConfig || {};
      let reply;

      if (cfg.chatFakeReply) {
        await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
        reply = fakeReply(text);
      } else {
        const base = cfg.apiBase || '';
        const res = await fetch(`${base}/api/chat`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            lang: getLang(),
            messages: state.messages,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        reply = body.reply || translate('ai-chat__error', 'Sorry, I could not reply this time.');
      }

      typing.remove();
      state.messages.push({role: 'assistant', text: reply});
      renderMessage({role: 'assistant', text: reply});
    } catch (err) {
      typing.remove();
      const errorText = translate(
        'ai-chat__error',
        'Sorry, I could not reply this time. Please try again or use the contact form.',
      );
      state.messages.push({role: 'assistant', text: errorText});
      renderMessage({role: 'assistant', text: errorText});
    } finally {
      state.pending = false;
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendUserMessage(text);
  });

  function openPanel() {
    panel.classList.add('ai-chat__panel--open');
    launcher.classList.add('ai-chat__launcher--hidden');
    launcher.setAttribute('aria-expanded', 'true');
    if (!messagesEl.childElementCount) {
      renderGreeting();
      renderSuggestions();
    }
    setTimeout(() => input.focus(), 100);
  }

  function closePanel() {
    panel.classList.remove('ai-chat__panel--open');
    launcher.classList.remove('ai-chat__launcher--hidden');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  launcher.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('ai-chat__panel--open')) {
      closePanel();
    }
  });

  document.addEventListener('languagechange', () => {
    panel.querySelectorAll('[data-lang-key]').forEach((el) => {
      const key = el.dataset.langKey;
      const dict = window.mainPageText && window.mainPageText[key];
      if (dict) el.textContent = dict[getLang()] || dict.en || el.textContent;
    });
  });
})();
