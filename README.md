# CV — Mikita Kanstantsinau (Nick Konstantinov)

Личное CV / портфолио и небольшое тестовое поверх него: статический лендинг о себе как разработчике с двуязычным интерфейсом, контактной формой (письмо автору + копия пользователю) и плавающим AI-чат-виджетом по CV.

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
- `local-server.js` — Express, раздаёт `src/` и подключает обработчики; один и тот же сервер используется и локально (`npm run dev:local`), и на Render (`npm start`)
- `api/contact.js` — отправка писем через **Brevo HTTP API**
  (`/v3/smtp/email`); два письма за один POST — автору и копия пользователю
- `api/chat.js` — прокси к **Groq API** (`llama-3.3-70b-versatile`), системный промпт с CV-контекстом + tool `open_contact_form`, который модель может вызвать, если пользователь явно хочет связаться
- `api/_lib/cors.js` — CORS-allowlist (GH Pages + localhost + сам Render)
- `api/_lib/validate.js` — серверная валидация полей и HTML-escape
- `api/_lib/cvContext.js` — текстовое описание CV для системного промпта

### Инфраструктура / dev tools
- **GitHub Pages** — раздаёт `src/` из ветки `main`
- **Render** — Node.js Web Service на бесплатном free tier;
  холодный старт ~30 сек после 15 мин простоя
- **Brevo** — HTTP API для отправки писем (300 шт/день на free)
- EditorConfig для единообразного форматирования

---

## Как запустить проект

### Только фронт (без формы и без чата с реальным API)
Заглушки в `src/js/config.js` (`contactFormFakeSubmit`, `chatFakeReply`)
включаются автоматически, пока `API_URL` равен плейсхолдеру. Достаточно
открыть статику:

```bash
npm install            # ставит sass, express, dotenv
npm run build:css      # компилирует styles.scss → styles.css
# открыть src/index.html в браузере (file:// тоже работает)
```

Удобнее в watch-режиме:

```bash
npm run watch:css
```

### Локально с настоящим бэкендом

1. Получите бесплатный API-ключ Brevo:
   - Регистрация на [brevo.com](https://www.brevo.com) (Free, 300
     писем/день).
   - **Senders, Domains & Dedicated IPs → Senders → Add a sender** —
     добавить свой email, подтвердить ссылкой из inbox.
   - **SMTP & API → API Keys → Generate a new API key** — скопировать
     ключ `xkeysib-...`.
2. Получите бесплатный API-ключ Groq на
   [console.groq.com](https://console.groq.com) — без карты, мгновенно.
3. Скопируйте шаблон env-переменных и заполните:

   ```bash
   cp .env.example .env.local
   ```

   В `.env.local` нужно заполнить:

   ```
   BREVO_API_KEY=xkeysib-...
   MAIL_SENDER_EMAIL=your.account@gmail.com   # верифицированный sender
   MAIL_SENDER_NAME=CV Contact Form
   MAIL_OWNER=your.account@gmail.com          # куда падают письма из формы
   GROQ_API_KEY=gsk_...
   ALLOWED_ORIGIN=https://nick-konstantinov.github.io,http://localhost:3000,http://127.0.0.1:3000
   ```
4. Запустите локальный сервер:

   ```bash
   npm run dev:local
   # http://localhost:3000
   ```

   Express раздаёт `src/` как корень и подключает `/api/contact`
   и `/api/chat`.

---

### Особенности Render Free Tier
- Сервис «засыпает» после 15 минут неактивности.
- Первый запрос после сна — 20-40 секунд (cold start).
- Холодный URL для прогрева: `/health` → `{"ok":true}`.

---

## Структура проекта

```
.
├── api/                    Node.js handlers (Vercel-style signature)
│   ├── contact.js          POST /api/contact  — Brevo HTTP API
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

---

## AI в разработке

### AI-инструменты, использованные при разработке

- **Claude Code** — основной агент, в котором велась часть работ: декомпозиция тестового на шаги, генерация и инкрементальные правки HTML / SCSS / JS, написание `api/contact.js`, `api/chat.js` и сопутствующей валидации/CORS, оформление коммитов, отладка деплоя на Render.
- **JetBrains WebStorm** — основная IDE, без вшитого AI; использовалась для финальной правки, форматирования, проверки в браузере и ручной подгонки CSS-значений.

### Что делалось с помощью ИИ

Крупные блоки, целиком сгенерированные AI и доведённые вручную:
- Скелет `api/contact.js` и серверная валидация в `api/_lib/validate.js` — AI выдал базовую структуру с двумя письмами и HTML-escape; дальше дорабатывал руками (см. список ниже).
- `api/chat.js` — Groq-прокси с системным промптом и tool
  `open_contact_form`. AI собрал и формат сообщений, и обработку
  `tool_calls`, дальше я тюнил CV-контекст и сужал инструкции.
- HTML / SCSS / JS контактной модалки (`<dialog>`, focus trap, локализованные состояния) — каркас сгенерён AI, поведение «состояние не теряется при случайном закрытии» доводилось вручную.
- AI-чат-виджет: разметка, layout, suggestion chips, typing-dots, работа в offline-демо режиме без бэка.
- README, тексты коммитов, оформление структуры.

### Что пришлось исправлять вручную

Длинный список «вещей, которые AI с первого раза не угадал»:

- **Кнопка `Write to me` в шапке.** Высота, паддинги по горизонтали через `inline-flex` (40px, чтобы совпадала с круглыми лэнг-кнопками), расчёт `right: 12.5rem`, чтобы зазор от CTA до `En` визуально совпадал с зазором `En ↔ Ru`.
- **Переводы пропускали кнопку и плейсхолдеры.** Изначально `changeLangAnimatedGrouped()` искал только потомков `[data-lang-group]` и не понимал атрибутов. Дописал ему 1) включение самого group-узла,  если у него тоже стоит `data-lang`, 2) отдельный проход по `data-lang-attr-placeholder` / `aria-label` / `title`.
- **Статус формы «висел» между открытиями модалки.** Пришлось завести `dataset.langKey / langFallback` и чистить статус в `openModal()`, при этом не сбрасывая введённые в поля данные (нативный `<dialog>` оставляет их сам, только надо не вызывать `form.reset()`).
- **Фоновый скролл под модалкой.** Нативный `<dialog>` его не блокирует под Windows / некоторыми браузерами стабильно — добавил утилитный `body.no-scroll`, который переключается в open/close.
- **AI-launcher сливался с тёмным фоном.** Сначала круглая кнопка была того же цвета, что body (`--color-dark`). Сменил фон на белый с тёмной иконкой, добавил двойной shadow и `isolation: isolate`, чтобы `::before/::after` с `z-index: -1` корректно рисовались под кнопкой, не уходя за `body`.
- **Радужный rim.** Несколько подходов: сначала всегда крутящийся градиент → визуально шумно; в итоге оставил «появляется и крутится только на hover», два слоя (`::before` — резкий кольцом 4px, `::after` — мягкий blur'нутый glow). `inset: -4/-10px`, оба с `conic-gradient` в фирменных Google-цветах.
- **Положение AI-виджета.** На широких экранах `position: fixed; right: 2.4rem` уводил кнопку в правый край viewport, отдельно от `.canvas`. Заменил на SCSS-переменную `$ai-chat-edge: max(0.5rem, calc((100vw - 1100px) / 2 + 0.5rem))` — зашита ширина canvas (1100px) и гарантировано, что кнопка прижимается к canvas даже на 4K.
- **`config.js` для двух сред разом.** Чтобы один и тот же `src/js/config.js` работал и локально (same-origin), и на Render-проде (same-origin), и на GH Pages (cross-origin абсолютным URL), завернул всё в IIFE c автодетектом по `location.hostname` (`localhost`, `*.onrender.com`, `*.vercel.app` → same-origin; всё остальное → `API_URL`).
- **Миграция Nodemailer → Brevo.** Сам факт, что Render Free Tier  блокирует исходящий SMTP, ни один AI заранее не подсветил — выяснил по логам Render (`Connection timeout` на 587), после чего переписал `api/contact.js` с Nodemailer-транспорта на HTTP-POST в `https://api.brevo.com/v3/smtp/email`. AI помогал с маппингом полей (`sender`, `to`, `replyTo`, `htmlContent`, `textContent`) и обработкой ошибок (`mail-not-configured` / `mail-upstream` / `mail-failed`).
