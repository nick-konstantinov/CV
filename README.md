# CV — Mikita Kanstantsinau (Nick Konstantinov)

Личное CV / портфолио и небольшое тестовое поверх него: статический
лендинг о себе как разработчике с двуязычным интерфейсом, контактной
формой (письмо автору + копия пользователю) и плавающим AI-чат-виджетом
по CV.

**Демо:** [nick-konstantinov.github.io/CV/src/index.html](https://nick-konstantinov.github.io/CV/src/index.html)

---

## Стек

### Frontend (GitHub Pages, статика)
- HTML5, SCSS (BEM, CSS custom properties в `_varibles.scss`)
- Vanilla JavaScript, без фреймворков
- `sass` CLI для сборки `styles.scss → styles.css`
- Двуязычие (en / ru) через атрибуты `data-lang`, `data-lang-attr-*`
  и собственное событие `languagechange`
- Нативный `<dialog>` для модалки формы, `conic-gradient` + анимация
  для радужного rim'а AI-launcher'а

### Backend (Node.js Web Service, Render)
- `local-server.js` — Express, раздаёт `src/` и подключает обработчики
- `api/contact.js` — отправка писем через **Nodemailer + Gmail SMTP**
  (два письма: автору + копия пользователю)
- `api/chat.js` — прокси к **Groq API** (`llama-3.3-70b-versatile`),
  системный промпт с CV-контекстом + tool `open_contact_form`
- `api/_lib/cors.js` — CORS-allowlist (GH Pages + localhost + сам Render)
- `api/_lib/validate.js` — серверная валидация полей и HTML-escape
- `api/_lib/cvContext.js` — текстовое описание CV для системного промпта

### Инфраструктура / dev tools
- GitHub Pages — раздаёт `src/` из ветки `main`
- Render — Node.js Web Service, бесплатный free tier
- EditorConfig для единообразного форматирования

---

## Как запустить проект

### Только фронт (без формы и без чата с реальным API)
Заглушки в `src/js/config.js` (`contactFormFakeSubmit`, `chatFakeReply`)
включены автоматически, пока в `API_URL` стоит плейсхолдер. Достаточно
открыть статику:

```bash
npm install            # ставит sass, express, nodemailer, dotenv
npm run build:css      # компилирует styles.scss → styles.css
# открыть src/index.html в браузере (file:// тоже работает)
```

Удобнее в watch-режиме:

```bash
npm run watch:css
```

### Локально с настоящим бэкендом

1. Заведите App Password в Gmail:
   `Google Account → Security → 2-Step Verification → App passwords`
   (получите 16-символьный пароль; обычный пароль от аккаунта НЕ подойдёт).
2. Получите бесплатный API-ключ Groq на
   [console.groq.com](https://console.groq.com) — без карты, мгновенно.
3. Скопируйте шаблон env-переменных и заполните:

   ```bash
   cp .env.example .env.local
   # заполнить GMAIL_USER, GMAIL_APP_PASSWORD, GROQ_API_KEY
   ```
4. Запустите локальный сервер:

   ```bash
   npm run dev:local
   # http://localhost:3000
   ```

   Express раздаёт `src/` как корень и подключает `/api/contact`
   и `/api/chat`.

---

## Структура проекта

```
.
├── api/                    Node.js handlers (Vercel-style signature)
│   ├── contact.js          POST /api/contact  — Nodemailer + Gmail SMTP
│   ├── chat.js             POST /api/chat     — Groq proxy с CV-контекстом
│   └── _lib/
│       ├── cors.js         CORS allowlist + preflight
│       ├── validate.js     payload validation + HTML escape
│       └── cvContext.js    plaintext CV для system prompt
├── src/                    фронтенд, раздаётся как корень
│   ├── index.html
│   ├── js/
│   │   ├── config.js       runtime config + автодетект apiBase
│   │   ├── lang.js         i18n + languagechange event
│   │   ├── contact-form.js контроллер модалки и формы
│   │   ├── ai-chat.js      контроллер чат-виджета
│   │   └── ...
│   └── styles/             SCSS sources + скомпилированный styles.css
├── local-server.js         Express-обёртка для local + Render
├── package.json
├── .env.example            шаблон env-переменных
└── .editorconfig
```
