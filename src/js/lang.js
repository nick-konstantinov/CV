// Set available languages
const arrLangs = ['en', 'ru'];

function checkBrowserLang() {
  const navLang = navigator.language.slice(0, 2).toLocaleLowerCase();
  const result = arrLangs.some(elem => {
    return navLang === elem;
  });

  if (result) {
    return navLang;
  }
}

// Set the language when loading the page
let currentLang = localStorage.getItem('language') || checkBrowserLang() || 'en';
const langBtns = document.querySelectorAll('[data-btn]');

// Text for main page
const mainPageText = {
  'first-name': {
    en: 'Mikita',
    ru: 'Никита',
  },
  'last-name': {
    en: 'Kanstantsinau',
    ru: 'Константинов',
  },
  'professional-title': {
    en: 'Frontend Developer',
    ru: 'Фронтенд-разработчик',
  },
  'contacts__title': {
    en: 'Contacts',
    ru: 'Контакты',
  },
  'address__title': {
    en: 'Address:',
    ru: 'Адрес:',
  },
  'address__text': {
    en: 'Gomel, Belarus',
    ru: 'г.Гомель, Беларусь',
  },
  'hard-skill__title': {
    en: 'Hard skills',
    ru: 'Проф. навыки',
  },
  'hard-skill__html-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'hard-skill__css-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'hard-skill__js-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'hard-skill__ts-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'hard-skill__angular-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'soft-skill__title': {
    en: 'Soft skills',
    ru: 'Доп. навыки',
  },
  'soft-skill__git': {
    en: 'Version control (Git)',
    ru: 'Сист. контроля версий (Git)',
  },
  'soft-skill__ps': {
    en: 'Graphics editors (Ps, Figma)',
    ru: 'Граф. редакторы (Ps, Figma)',
  },
  'soft-skill__webpack-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'soft-skill__git-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'soft-skill__ps-time': {
    en: 'yr+',
    ru: 'г+',
  },
  'principles-skill__title': {
    en: 'Principles',
    ru: 'Принципы',
  },
  'languages-title': {
    en: 'Languages',
    ru: 'Языки',
  },
  'languages-text__en-title': {
    en: 'English:',
    ru: 'Английский:',
  },
  'languages-text__en-level': {
    en: 'B1 (Intermediate)',
    ru: 'B1 (Средний уровень)',
  },
  'languages-text__ru-title': {
    en: 'Russian:',
    ru: 'Русский:',
  },
  'languages-text__ru-level': {
    en: 'Native',
    ru: 'Родной',
  },
  'work-examples__title': {
    en: 'Work examples',
    ru: 'Примеры работ',
  },
  'work-examples__subtitle-layout': {
    en: 'Layout',
    ru: 'Верстка',
  },
  'work-examples__subtitle-js': {
    en: 'Web-apps / js',
    ru: 'Веб-прилож. / js',
  },
  'work-examples__subtitle-angular': {
    en: 'Web-apps / angular',
    ru: 'Веб-прилож. / angular',
  },
  'awards-title': {
    en: 'Awards',
    ru: 'Награды',
  },
  'profile-title': {
    en: 'Profile',
    ru: 'Профиль',
  },
  'profile-text': {
    en: 'Angular developer with experience in building user interfaces, admin panels, and customized web platforms. Participate in planning, requirement refinement, and cross-team collaboration. Represent the frontend team in daily stand-ups and take part in releases and code reviews.',
    ru: 'Angular-разработчик с опытом создания интерфейсов, админ-панелей и кастомизации веб-платформ. Участвую в планировании, проработке требований и взаимодействии между командами. Представляю фронтенд на дейликах, участвую в релизах и код-ревью.',
  },
  'detailed-title-key-achievements': {
    en: 'Key achievements',
    ru: 'Ключевые достижения',
  },
  'key-achievements-delivered': {
    en: 'Delivered 40+ features (profiles, chats, eventsы, billing, admin panels).ds',
    ru: 'Реализовал 40+ фич (профили, чаты, мероприятия, биллинг, админки).',
  },
  'key-achievements-fixed': {
    en: 'Fixed 80+ bugs, significantly improving platform stability.',
    ru: 'Исправил 80+ багов, значительно улучшив стабильность платформы.',
  },
  'key-achievements-custom': {
    en: 'Completed 9 customizations of web applications to match the branding of various clients.',
    ru: 'Выполнил 9 кастомизаций веб-приложений под брендинг разных клиентов.',
  },
  'key-achievements-optimized': {
    en: 'Optimized module loading through lazy loading, achieving over a 20% performance improvement.',
    ru: 'Оптимизировал загрузку модулей за счёт lazy-loading (ускорение более 20%).',
  },
  'key-achievements-contributed': {
    en: 'Contributed to frontend migration to a monorepo — reduced code duplication and accelerated integration by 30–40%.',
    ru: 'Участвовал в миграции фронтенда в монорепозиторий - сокращение дублирования кода и ускорение интеграции на 30-40%.',
  },
  'education__title': {
    en: 'Education',
    ru: 'Образование',
  },
  'education__subtitle-higher': {
    en: 'Higher education',
    ru: 'Высшее образование',
  },
  'exp__speciality-name-university': {
    en: '&#171;Organization and Management of Foundry Production&#187; &#47; &#171;Machinery and Foundry Technology&#187; &#47; Bachelor`s degree',
    ru: '&#171;Организация и управление литейным производством&#187; &#47; &#171;Машины и технология литейного производства&#187 &#47; Инженер',
  },
  'exp__institution-name-university': {
    en: 'Gomel State Technical University named after P.O. Sukhoi',
    ru: 'Гомельский государственный технический университет имени П.О.Сухого',
  },
  'exp__subtitle-additional': {
    en: 'Additional education',
    ru: 'Дополнительное образование',
  },
  'exp__date-from-upskill': {
    en: 'December, 2022',
    ru: 'Декабрь, 2022',
  },
  'exp__date-to-upskill': {
    en: 'August, 2023',
    ru: 'Август, 2023',
  },
  'exp__speciality-name-upskill': {
    en: 'Online training course &#171;UpSkill Me&#187; &#47; JS &#47; Front-End',
    ru: 'Онлайн-курс &#171;UpSkill Me&#187; &#47; JS &#47; Front-End',
  },
  'exp__date-it-fundementals': {
    en: 'November, 2022',
    ru: 'Ноябрь, 2022',
  },
  'exp__speciality-name-it-fundementals': {
    en: 'Online training course &#171;IT Fundamentals&#187; &#47; &#171;Basics of Computer Science. Basics of Programming. Math for IT&#187;',
    ru: 'Онлайн курс &#171;IT Fundamentals&#187; «Основы информатики &#47; Основы программирования &#47; Математика для ИТ&#187;',
  },
  'exp__date-from-sl': {
    en: 'March, 2022',
    ru: 'Март, 2022',
  },
  'exp__date-to-sl': {
    en: 'April, 2022',
    ru: 'Апрель, 2022',
  },
  'exp__speciality-name-sl': {
    en: 'Online training course &#171;HTML5&#187; &#47; &#171;CSS3&#187;',
    ru: 'Онлайн курс &#171;HTML5&#187; &#47; &#171;CSS3&#187;',
  },
  'exp__date-from-itc': {
    en: 'July, 2021',
    ru: 'Июль, 2021',
  },
  'exp__date-to-itc': {
    en: 'January, 2022',
    ru: 'Январь, 2022',
  },
  'exp__speciality-name-itc': {
    en: 'Training course &#171;Basic knowledge of programming and algorithm knowledge using C language and JS&#187;',
    ru: 'Обучающие курсы &#171;Базовые знания программирования и алгоритмов с использованием языков C и JS&#187;',
  },
  'exp__institution-name-itc': {
    en: '«IT Class» &#47; Gomel',
    ru: '«IT Class» &#47; Гомель',
  },
  'exp__speciality-name-upk': {
    en: 'Training for the profession of &#171;Computer Operator&#187;',
    ru: 'Обучение профессии &#171;Оператор ЭВМ&#187;',
  },
  'exp__institution-name-upk': {
    en: 'Educational Institution &#171;Inter-School UPK№1&#187; &#47; Gomel',
    ru: 'УО &#171;Межшкольный УПК №1&#187;',
  },
  'detailed-title-work-exp': {
    en: 'Work experience',
    ru: 'Опыт работы',
  },
  'exp__speciality-name-cf': {
    en: 'CommunityTech Group – Middle Front-end developer',
    ru: 'CommunityTech Group – Middle Front-end разработчик',
  },
  'exp__text-cf-end-time': {
    en: 'Present',
    ru: 'по н.в.',
  },
  'exp__text-prjs-title': {
    en: 'Projects:',
    ru: 'Проекты:',
  },
  'exp__text-cf-prjs': {
    en: 'ClubFirst, ClubFirts Ladies, ClubFirst Future, Opora, Future Leaders, AUZ, CTG, VQ, TNE team',
    ru: 'ClubFirst, ClubFirts Ladies, ClubFirst Future, Opora, Фонд Будущих Лидеров, НАУЗ, CTG, VQ, ТНЭ team',
  },
  'exp__text-description-title': {
    en: 'Description:',
    ru: 'Описание:',
  },
  'exp__text-cf-description': {
    en: 'Web applications for business communities',
    ru: 'Веб-приложения для бизнес-сообществ',
  },
  'exp__text-tech-stack-title': {
    en: 'Tech stack:',
    ru: 'Технологический стек',
  },
  'exp__text-cf-team-title': {
    en: 'Team:',
    ru: 'Команда:',
  },
  'exp__text-cf-tech-stack': {
    en: 'Angular, TypeScript, RxJS, NgRX, Angular Material, SCSS, REST API, Swagger, Webpack, Npm, CI/CD Gitlab, Agile, Scrum, Kanban, Jira',
    ru: 'Angular, TypeScript, RxJS, NgRX, Angular Material, SCSS, REST API, Swagger, Webpack, Npm, CI/CD Gitlab, Agile, Scrum, Kanban, Jira',
  },
  'exp__text-team-title': {
    en: 'Team:',
    ru: 'Команда:',
  },
  'exp__text-fl-description-title': {
    en: 'Description:',
    ru: 'Описание:',
  },
  'exp__institution-name-it-fundementals': {
    en: 'EPAM Learn Platform',
    ru: 'EPAM Learn Platform',
  },
  'exp__text-cf-team': {
    en: '14 members',
    ru: '14 человек',
  },
  'exp__text-cf-goal-1': {
    en: 'Designed and implemented user interfaces (profiles, chats, events, bookings, billing) with enhanced validation, error handling, and improved UX.',
    ru: 'Проектировал и реализовывал пользовательские интерфейсы (профили, чаты, мероприятия, бронирования, биллинг) с улучшенной валидацией, обработкой ошибок и удобным UX.',
  },
  'exp__text-cf-goal-2': {
    en: 'Developed and configured admin panels using feature flags and role-based access for flexible functionality management.',
    ru: 'Разрабатывал и настраивал админ-панели с использованием feature-флагов и ролевого доступа, обеспечивая гибкое управление функциональностью.',
  },
  'exp__text-cf-goal-3': {
    en: 'Customized and branded web platforms for multiple clients, adapting UI/UX to corporate identity.',
    ru: 'Выполнил 9 кастомизаций платформы под разных клиентов (UI/UX адаптация, брендирование) с адаптацией под фирменный стиль.',
  },
  'exp__text-cf-goal-4': {
    en: 'Contributed to frontend architecture migration and project integration into a monorepo, improving scalability and maintainability.',
    ru: 'Участвовал в интеграции проектов в монорепозиторий: упрощение разработки, ускорение релизов (30–40%).',
  },
  'exp__text-cf-goal-5': {
    en: 'Actively resolved UI and performance issues.',
    ru: 'Участвовал в code-review, проработке UI-kit и процессов разработки.',
  },
  'exp__text-cf-goal-6': {
    en: 'Represented the frontend team in daily meetings, handled releases, participated in planning and task estimation, and ensured coordination with other teams.',
    ru: 'Представлял фронтенд-команду на дейликах, выполнял релизы, участвовал в планировании, оценке задач, обеспечивал синхронизацию с другими командами.',
  },
  'exp__speciality-name-fl': {
    en: 'Freelance – Front-end developer',
    ru: 'Фриланс – Front-end разработчик',
  },
  'exp__text-fl-prjs-title': {
    en: 'Projects:',
    ru: 'Проекты:',
  },
  'exp__text-cf-description-title': {
    en: 'Description:',
    ru: 'Описание:',
  },
  'exp__text-fl-description': {
    en: 'Website for a company specializing in CCTV installation',
    ru: 'Сайт для компании по установке систем видеонаблюдения',
  },
  'exp__text-fl-tech-stack-title': {
    en: 'Tech stack:',
    ru: 'Технологический стек:',
  },
  'exp__text-fl-goal-1': {
    en: 'Implemented responsive layouts and interactive elements (burger menus, pop-ups, forms with validation).',
    ru: 'Реализовал адаптивную верстку и интерактивные элементы (бургер-меню, поп-апы, формы с валидацией).',
  },
  'exp__institution-name-llc-prom': {
    en: 'LLC &#171;Prompodgotovka&#187; &#47; Gomel',
    ru: 'ООО &#171;Промподготовка&#187; &#47; Гомель',
  },
  'exp__speciality-name-teacher': {
    en: 'Teacher',
    ru: 'Преподаватель',
  },
  'exp__institution-name-pei-prom': {
    en: 'Private Educational Institution &#171;Center for training, advanced training and retraining of workers &#171;Prompodgotovka&ndash;Obrazovanie&#187; &#47; Gomel',
    ru: 'ЧУО &#171;Центр подготовки, повышения квалификации и переподготовки рабочих &#171;Промподготовка&ndash;Образование&#187; &#47; Гомель',
  },
  'exp__speciality-name-centrolit': {
    en: 'Process engineer',
    ru: 'Инженер-технолог',
  },
  'exp__institution-name-centrolit': {
    en: 'OJSC &#171;Gomel Foundry &#171;CENTROLIT&#187; &#47; Gomel',
    ru: 'ОАО &#171;Гомельский литейных завод &#171;ЦЕНТРОЛИТ&#187; &#47; Гомель',
  },
  'references-title': {
    en: 'References',
    ru: 'Рекомендации',
  },
  'references-name-mazina': {
    en: 'Anna Mazina',
    ru: 'Анна Мазина',
  },
  'references-name-company-cf-1': {
    en: 'Project Manager',
    ru: 'Руководитель проектов',
  },
  'references-name-company-cf-2': {
    en: 'Resource owner',
    ru: 'Владелец ресурса',
  },
  'references-name-prozorov': {
    en: 'Andrey Prozorov',
    ru: 'Андей Прозоров',
  },
  'title-key-skills': {
    en: 'Skills',
    ru: 'Навыки',
  },
  'how-i-work__title': {
    en: 'How I work',
    ru: 'Как я работаю',
  },
  'how-i-work__approach-title': {
    en: 'Approach to tasks',
    ru: 'Подход к задачам',
  },
  'how-i-work__approach-1': {
    en: 'Decompose large tasks into small ones with explicit acceptance criteria; validate assumptions as early as possible.',
    ru: 'Большие задачи декомпозирую на маленькие с явными acceptance-критериями; гипотезы проверяю как можно раньше.',
  },
  'how-i-work__approach-2': {
    en: 'Read existing code and look for established patterns in the repo before introducing new abstractions.',
    ru: 'Сначала читаю существующий код и ищу принятые в репо паттерны, и только потом ввожу новые абстракции.',
  },
  'how-i-work__approach-3': {
    en: 'Small commits with clear messages; large changes split into a chain of focused PRs.',
    ru: 'Делаю маленькие коммиты с понятными сообщениями; крупные изменения дроблю на цепочку сфокусированных PR.',
  },
  'how-i-work__approach-4': {
    en: 'For tricky cases — sketch the data flow / sequence diagram first (Figma / Excalidraw), then code.',
    ru: 'В сложных кейсах сперва рисую data flow или sequence-диаграмму (Figma / Excalidraw), а потом сажусь за код.',
  },
  'how-i-work__approach-5': {
    en: 'Code review focused on correctness and business logic, not just style.',
    ru: 'На код-ревью смотрю на корректность и бизнес-логику, а не только на стилистику.',
  },
  'how-i-work__ai-title': {
    en: 'AI in everyday work',
    ru: 'AI в повседневной работе',
  },
  'how-i-work__ai-1': {
    en: '<span class="how-i-work__tag">tools</span> Claude Code, Cursor, ChatGPT — depending on the task: refactors and routine in IDE, research / debugging in chat.',
    ru: '<span class="how-i-work__tag">инструменты</span> Claude Code, Cursor, ChatGPT — в зависимости от задачи: рефакторинг и рутина в IDE, исследование и дебаг в чате.',
  },
  'how-i-work__ai-2': {
    en: '<span class="how-i-work__tag">how</span> Treat AI as a drafting partner: boilerplate, types, tests, exploring unfamiliar APIs, parsing stack traces.',
    ru: '<span class="how-i-work__tag">как</span> Использую AI как соавтора черновика: бойлерплейт, типы, тесты, разбор незнакомого API, парсинг стектрейсов.',
  },
  'how-i-work__ai-3': {
    en: '<span class="how-i-work__tag">limits</span> Never delegate understanding — final decision and review are mine, AI output is verified by types and tests.',
    ru: '<span class="how-i-work__tag">границы</span> Не делегирую AI понимание задачи: финальное решение и ревью — за мной, вывод AI верифицирую типами и тестами.',
  },
  'how-i-work__ai-4': {
    en: '<span class="how-i-work__tag">prompts</span> Iterative prompting with explicit input, output and constraints; small step, check, refine.',
    ru: '<span class="how-i-work__tag">промпты</span> Промптинг итеративный: явные вход, выход и ограничения; маленький шаг — проверка — уточнение.',
  },
  'how-i-work__ai-5': {
    en: '<span class="how-i-work__tag">legacy</span> On legacy code AI helps to quickly map the architecture and produce the first diff for review.',
    ru: '<span class="how-i-work__tag">легаси</span> На легаси AI помогает быстро картографировать архитектуру и собрать первый diff под ревью.',
  },
  'contact-form__cta': {
    en: 'Write to me',
    ru: 'Написать мне',
  },
  'contact-form__name-placeholder': {
    en: 'Your name',
    ru: 'Ваше имя',
  },
  'contact-form__phone-placeholder': {
    en: '+375 ...',
    ru: '+375 ...',
  },
  'contact-form__email-placeholder': {
    en: 'you@example.com',
    ru: 'you@example.com',
  },
  'contact-form__message-placeholder': {
    en: 'Tell me a bit about the project, role or question...',
    ru: 'Расскажите о проекте, вакансии или просто задайте вопрос...',
  },
  'contact-form__close': {
    en: 'Close',
    ru: 'Закрыть',
  },
  'contact-form__title': {
    en: 'Get in touch',
    ru: 'Свяжитесь со мной',
  },
  'contact-form__subtitle': {
    en: 'Drop me a message and I will reply by email. You will also receive a copy of your message for your records.',
    ru: 'Напишите сообщение — отвечу на указанный email, а копию письма с вашим обращением вы получите себе.',
  },
  'contact-form__name-label': {
    en: 'Name',
    ru: 'Имя',
  },
  'contact-form__phone-label': {
    en: 'Phone',
    ru: 'Телефон',
  },
  'contact-form__email-label': {
    en: 'Email',
    ru: 'Email',
  },
  'contact-form__message-label': {
    en: 'Message',
    ru: 'Сообщение',
  },
  'contact-form__submit': {
    en: 'Send message',
    ru: 'Отправить',
  },
  'contact-form__status-sending': {
    en: 'Sending…',
    ru: 'Отправляем…',
  },
  'contact-form__status-success': {
    en: 'Message sent. A copy is on its way to your inbox.',
    ru: 'Сообщение отправлено. Копия письма уже летит на вашу почту.',
  },
  'contact-form__status-error': {
    en: 'Could not send the message. Please try again or email me directly.',
    ru: 'Не удалось отправить сообщение. Попробуйте ещё раз или напишите мне на email.',
  },
  'contact-form__status-validation': {
    en: 'Please fix the highlighted fields.',
    ru: 'Поправьте выделенные поля, пожалуйста.',
  },
  'contact-form__error-name-too-short': {
    en: 'Name should be at least 2 characters.',
    ru: 'Имя должно содержать не менее 2 символов.',
  },
  'contact-form__error-phone-too-short': {
    en: 'Phone looks too short.',
    ru: 'Телефон выглядит слишком коротким.',
  },
  'contact-form__error-phone-invalid': {
    en: 'Phone should contain digits only (optionally starting with +).',
    ru: 'Телефон должен содержать только цифры (можно с + в начале).',
  },
  'contact-form__error-email-required': {
    en: 'Email is required.',
    ru: 'Укажите email.',
  },
  'contact-form__error-email-invalid': {
    en: 'Email looks invalid.',
    ru: 'Email выглядит некорректно.',
  },
  'contact-form__error-message-too-short': {
    en: 'Message should be at least 5 characters.',
    ru: 'Сообщение должно содержать не менее 5 символов.',
  },
  'ai-chat__launcher-aria': {
    en: 'Open AI assistant',
    ru: 'Открыть AI-помощника',
  },
  'ai-chat__close-aria': {
    en: 'Close',
    ru: 'Закрыть',
  },
  'ai-chat__send-aria': {
    en: 'Send',
    ru: 'Отправить',
  },
  'ai-chat__title': {
    en: 'CV Assistant',
    ru: 'CV-помощник',
  },
  'ai-chat__subtitle': {
    en: "Ask about Nick's experience",
    ru: 'Спросите об опыте Никиты',
  },
  'ai-chat__input-label': {
    en: 'Message',
    ru: 'Сообщение',
  },
  'ai-chat__input-placeholder': {
    en: 'Ask anything...',
    ru: 'Спросите что угодно...',
  },
  'ai-chat__greeting': {
    en: "Hi! I am a small AI assistant trained on Nick's CV. Ask me about his experience, stack or how to get in touch.",
    ru: 'Привет! Я небольшой AI-помощник, обученный на резюме Никиты. Спросите об опыте, стеке или о том, как со мной связаться.',
  },
  'ai-chat__suggestion-stack': {
    en: 'What is the main stack?',
    ru: 'Какой основной стек?',
  },
  'ai-chat__suggestion-experience': {
    en: 'Tell me about recent experience',
    ru: 'Расскажи про последний опыт',
  },
  'ai-chat__suggestion-contact': {
    en: 'How can I get in touch?',
    ru: 'Как с ним связаться?',
  },
  'ai-chat__typing': {
    en: 'Assistant is typing',
    ru: 'Помощник печатает',
  },
  'ai-chat__error': {
    en: 'Sorry, I could not reply this time. Please try again or use the contact form.',
    ru: 'Не получилось ответить. Попробуйте ещё раз или воспользуйтесь формой обратной связи.',
  },
};

window.mainPageText = mainPageText;

function changeLangAnimatedGrouped() {
  const groups = document.querySelectorAll('[data-lang-group]');

  groups.forEach(group => {
    const items = Array.from(group.querySelectorAll('[data-lang]'));
    if (group.hasAttribute('data-lang')) items.unshift(group);

    items.forEach((el, index) => {
      const key = el.dataset.lang;
      if (!key || !mainPageText[key]) return;

      el.classList.add('lang-animate');
      el.classList.add('lang-hide');

      setTimeout(() => {
        el.innerHTML = mainPageText[key][currentLang];
        el.classList.remove('lang-hide');
      }, 80 + index * 40);
    });
  });

  document
    .querySelectorAll('[data-lang-attr-placeholder], [data-lang-attr-aria-label], [data-lang-attr-title]')
    .forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (!attr.name.startsWith('data-lang-attr-')) return;
        const targetAttr = attr.name.slice('data-lang-attr-'.length);
        const dict = mainPageText[attr.value];
        if (dict && dict[currentLang]) {
          el.setAttribute(targetAttr, dict[currentLang]);
        }
      });
    });
}

// Change language
changeLangAnimatedGrouped();

function removeActiveClass(arr, activeClass) {
  arr.forEach(elem => {
    elem.classList.remove(activeClass);
  });
}

function checkActiveLangBtn() {
  switch (currentLang) {
    case 'en':
      document.querySelector('[data-btn="en"]').classList.add('lang-menu__btn--active');
      break;
    case 'ru':
      document.querySelector('[data-btn="ru"]').classList.add('lang-menu__btn--active');
      break;
    default:
      document.querySelector('[data-btn="en"]').classList.add('lang-menu__btn--active');
      break;
  }
}

// Check the active class of the language button
checkActiveLangBtn();

// Change language when clicking language buttons
langBtns.forEach(btn => {
  btn.addEventListener('click', (event) => {
    currentLang = event.target.dataset.btn;
    localStorage.setItem('language', currentLang);
    removeActiveClass(langBtns, 'lang-menu__btn--active');
    btn.classList.add('lang-menu__btn--active');
    changeLangAnimatedGrouped();
    document.dispatchEvent(new CustomEvent('languagechange', {detail: {lang: currentLang}}));
  });
});
