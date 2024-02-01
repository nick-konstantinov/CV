"use strict";

const arrLangs = ['en', 'ru'];
let currentLang = localStorage.getItem('language') || checkBrowserLang() || 'en';
const langBtns = document.querySelectorAll('[data-btn]');

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
        en: 'Software Development Engineer',
        ru: 'Инженер-разработчик программного обеспечения',
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
        en: 'Sulaberidze st., Batumi, Georgia',
        ru: 'ул. Сулаберидзе, Батуми, Грузия',
    },
    'hard-skill__title': {
        en: 'Hard skills',
        ru: 'Проф. навыки',
    },
    'hard-skill__angular': {
        en: 'Angular (basic knowledge)',
        ru: 'Angular (базовые знания)',
    },
    'soft-skill__title': {
        en: 'Soft skills',
        ru: 'Доп. навыки',
    },
    'soft-skill__git': {
        en: 'Version control (Git)',
        ru: 'Система контроля версий (Git)',
    },
    'soft-skill__ps': {
        en: 'Graphics editors (Ps, Figma)',
        ru: 'Граф. редакторы (Ps, Figma)',
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
        en: 'A2 (Pre-Intermediate)',
        ru: 'A2 (Пред. средний уровень)',
    },
    'languages-text__ru-title': {
        en: 'Russian:',
        ru: 'Русский:',
    },
    'languages-text__ru-level': {
        en: 'Native',
        ru: 'Родной',
    },
    'awards-title': {
        en: 'Awards',
        ru: 'Награды',
    },
    'profile-title': {
        en: 'Profile',
        ru: 'Профиль',
    },
    'profile-text-path1': {
        en: 'Hello, I&#180;m software development engineer. I&#180;m interested animating static artist or designer templates to life. And also, I like to create convenient and interactive interfaces for websites and applications.',
        ru: 'Привет, я инженер-разработчик программного обеспечения. Мне интересно оживлять статичные шаблоны художников или дизайнеров. А также создавать удобные и интерактивные интерфейсы сайтов и приложений.',
    },
    'profile-text-path2': {
        en: 'Many years of experience as a teacher allowed me to develop communication skills and the ability to clearly convey my thoughts and ideas, and my experience as an engineer allowed me to find effective solutions to complex problems. As a chief engineer, I successfully led a team of specialists, distributing tasks and responsibilities. My strengths are: the ability to work in a team, involvement in the process of working on a project and the ability to put myself in the shoes of the customer or end user in order to improve the product I create.',
        ru: 'Многолетний опыт работы преподавателем позволил мне развить навыки коммуникации и умение четко доносить свои мысли и идеи, а опыт работы инженером  - находить эффективные решения сложных задач. Будучи главным инженером я успешно руководил командой специалистов, распределяя задания и обязанности. Мои сильные стороны: умение работать в команде, вовлеченность в процесс работы над проектом и способность поставить себя на место заказчика или конечного пользователя чтобы улучшить продукт, который я создаю.',
    },
    'profile-text-path3': {
        en: 'At the moment, my goal is to become a successful frontend developer who can handle complex tasks on different projects. To do this, I continue studying hard and every day I either learn something new and hone knowledge in practice.',
        ru: 'На данный момент моя цель — стать успешным фронтенд-разработчиком, способным решать сложные задачи в разных проектах. Для этого я продолжаю усердно учиться и каждый день изучаю что-то новое и оттачиваю знания на практике.',
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
        en: 'Work expirience',
        ru: 'Опыт работы',
    },
    'exp__speciality-name-chief': {
        en: 'Chief Engineer',
        ru: 'Главный инженер',
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
    'exp__institution-name-centrolit': {
        en: 'Process engineer',
        ru: 'Инженер-технолог',
    },
    'exp__institution-name-pei-prom': {
        en: 'OJSC &#171;Gomel Foundry &#171;CENTROLIT&#187; &#47; Gomel',
        ru: 'ОАО &#171;Гомельский литейных завод &#171;ЦЕНТРОЛИТ&#187; &#47; Гомель',
    },
    'references-title': {
        en: 'References',
        ru: 'Рекомендации',
    },
    'references-name-chernenkov': {
        en: 'Andrian Chernenkov',
        ru: 'А.Н. Черненков',
    },
    'references-name-company-lls': {
        en: 'LLC &#171;Prompodgotovka&#187; &#47; Director',
        ru: 'ООО &#171;Промподготовка&#187; &#47; Директор',
    },
    'references-name-shetsov': {
        en: 'Stanislav Shevtsov',
        ru: 'С.А. Шевцов',
    },
    'references-name-company-pei': {
        en: 'PEI &#171;Prompodgotovka&ndash;Obrazovanie&#187; &#47; Director',
        ru: 'ЧУО &#171;Промподготовка&ndash;Образование&#187; &#47; Директор',
    },
}

function changeLang() {
    for (const key in mainPageText) {
        const elem = document.querySelector(`[data-lang=${key}]`);
        if (elem) {
            elem.innerHTML = mainPageText[key][currentLang];
        }

    }
}

changeLang();

langBtns.forEach(btn => {
    btn.addEventListener('click', (event)=>{
        currentLang = event.target.dataset.btn;
        localStorage.setItem('language', currentLang);
        removeActiveClass(langBtns, 'lang-btn_active');
        btn.classList.add('lang-btn_active');
        changeLang();
    });
});

function removeActiveClass (arr, activeClass) {
    arr.forEach(elem => {
        elem.classList.remove(activeClass);
    });
}

function checkActiveLangBtn() {
    switch (currentLang) {
        case 'en':
            document.querySelector('[data-btn="en"]').classList.add('lang-btn_active');
        break;
        case 'ru':
            document.querySelector('[data-btn="ru"]').classList.add('lang-btn_active');
        break;
        default:
            document.querySelector('[data-btn="en"]').classList.add('lang-btn_active');
        break;
    }
}

checkActiveLangBtn();

function checkBrowserLang() {
    const navLang = navigator.language.slice(0, 2).toLocaleLowerCase();
    const result = arrLangs.some(elem => {
        return navLang === elem;
    });

    if (result) {
        return navLang;
    }
}
