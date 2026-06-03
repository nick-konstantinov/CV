const SKILLS = [
  // Languages
  { key: 'html', label: 'HTML5', start: '2021-07', color: '#e34f26' },
  { key: 'css', label: 'CSS3', start: '2021-07', color: '#1572b6' },
  { key: 'javascript', label: 'JavaScript', start: '2021-09', color: '#f7df1e' },
  { key: 'typescript', label: 'TypeScript', start: '2024-06', color: '#3178c6' },
  // Frameworks
  { key: 'angular', label: 'Angular 2+', start: '2024-06', color: '#dd0031' },
  { key: 'angular_material', label: 'Angular Material', start: '2024-06', color: '#3f51b5', icon: 'badge' },
  { key: 'react', label: 'React', start: '2025-12', color: '#61dafb' },
  { key: 'nextjs', label: 'Next.js', start: '2025-12', color: '#222222' },
  // State / data
  { key: 'rxjs', label: 'RxJS', start: '2024-06', color: '#b7178c' },
  { key: 'ngrx', label: 'NgRX', start: '2024-06', color: '#ba2bd2' },
  { key: 'redux', label: 'Redux Toolkit / RTK Query', start: '2025-12', color: '#764abc' },
  { key: 'zod', label: 'Zod', start: '2025-12', color: '#3e67b1' },
  // Network / API / mocks
  { key: 'websocket', label: 'WebSocket', start: '2024-06', color: '#00aaff', icon: 'badge' },
  { key: 'swagger', label: 'Swagger', start: '2024-06', color: '#85ea2d' },
  { key: 'msw', label: 'MSW', start: '2025-12', color: '#ff6a33' },
  // Styling / assets / i18n
  { key: 'scss', label: 'SCSS', start: '2023-01', color: '#cc6699' },
  { key: 'tailwind', label: 'Tailwind CSS', start: '2025-12', color: '#06b6d4' },
  { key: 'svgr', label: 'SVGR', start: '2025-12', color: '#ff5722', icon: 'badge' },
  { key: 'next_intl', label: 'next-intl', start: '2025-12', color: '#14213b', icon: 'badge' },
  // Testing
  { key: 'vitest', label: 'Vitest', start: '2025-12', color: '#6e9f18' },
  { key: 'jest', label: 'Jest', start: '2024-06', color: '#c21325' },
  { key: 'rtl', label: 'React Testing Library', start: '2025-12', color: '#e33332' },
  // Tooling
  { key: 'git', label: 'Git', start: '2022-01', color: '#f05032' },
  { key: 'vite', label: 'Vite', start: '2025-12', color: '#646cff' },
  { key: 'webpack', label: 'Webpack', start: '2024-06', color: '#8dd6f9' },
  { key: 'npm', label: 'Npm', start: '2024-06', color: '#cb3837' },
  { key: 'gitlab', label: 'GitLab CI/CD', start: '2024-06', color: '#fc6d26' },
  // Quality
  { key: 'a11y', label: 'Accessibility (a11y)', start: '2024-06', color: '#2a7fff', icon: 'badge' },
  { key: 'web_performance', label: 'Web Performance', start: '2024-06', color: '#ff9800', icon: 'badge' },
  // Design
  { key: 'figma', label: 'Figma', start: '2022-03', color: '#f24e1e' },
  { key: 'photoshop', label: 'Photoshop', start: '2022-03', color: '#31a8ff', icon: 'badge' },
  // AI tools
  { key: 'claude', label: 'Claude', start: '2024-06', color: '#d97757' },
  { key: 'cursor', label: 'Cursor', start: '2024-09', color: '#444444' },
  // Principles / methodologies
  { key: 'bem', label: 'BEM', start: '2022-03', color: '#ff9800', icon: 'badge' },
  { key: 'oop', label: 'OOP', start: '2023-01', color: '#607d8b', icon: 'badge' },
  { key: 'solid', label: 'SOLID', start: '2024-06', color: '#009688', icon: 'badge' },
  { key: 'first', label: 'FIRST', start: '2024-06', color: '#ff5722', icon: 'badge' },
  { key: 'fsd', label: 'FSD', start: '2025-12', color: '#2a7fff', icon: 'badge' },
  { key: 'agile', label: 'Agile (Scrum, Kanban)', start: '2024-06', color: '#8ed6fb', icon: 'badge' },
];

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

(function renderSkills() {
  const list = document.getElementById('skills-list');
  if (!list) return;

  list.innerHTML = SKILLS.map(skill => {
    const icon = skill.icon || skill.key;
    const value = getExperienceValue(skill.start);
    return `
      <li class="skills__item skill--${skill.key}"
          data-skill-value="${value}"
          style="--skill-from: ${hexToRgba(skill.color, 0.45)}; --skill-to: ${hexToRgba(skill.color, 0.2)};">
        <span class="skills__item-bg"></span>
        <img class="skills__item-icon" src="icons/tech/${icon}.svg" alt="" loading="lazy" width="18" height="18" />
        <span class="skills__item-label">${skill.label}</span>
        <span class="skills__item-years"></span>
      </li>`;
  }).join('');

  updateSkillYears(typeof currentLang !== 'undefined' ? currentLang : 'en');
})();

function updateSkillYears(lang) {
  document.querySelectorAll('#skills-list .skills__item').forEach(item => {
    const value = Number(item.dataset.skillValue);
    item.querySelector('.skills__item-years').textContent = `| ${formatExperienceShort(value, lang)}`;
  });
}

document.addEventListener('languagechange', event => {
  updateSkillYears(event.detail.lang);
});

(function setupSkillHover() {
  const list = document.getElementById('skills-list');
  if (!list) return;

  let active = null;
  const setActive = chip => {
    if (active === chip) return;
    if (active) active.classList.remove('skills__item--active');
    active = chip;
    if (active) active.classList.add('skills__item--active');
  };

  list.addEventListener('pointermove', event => {
    const chip = event.target.closest('.skills__item');
    if (chip) setActive(chip); // over a gap -> keep the current chip active
  });
  list.addEventListener('pointerleave', () => setActive(null));
})();
