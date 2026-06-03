function getExperienceValue(start) {
  const [year, month] = String(start).split('-').map(Number);
  const now = new Date();
  const months = Math.max(0, (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month));
  return Math.floor(months / 6) / 2;
}

// Russian plural for the full word: год / года / лет.
function pluralYearsRu(value) {
  if (!Number.isInteger(value)) return 'года';
  if (value % 100 >= 11 && value % 100 <= 14) return 'лет';
  const last = value % 10;
  if (last === 1) return 'год';
  if (last >= 2 && last <= 4) return 'года';
  return 'лет';
}

// Long form for headings: "2.5+ years" / "2.5+ года".
function formatExperienceLong(value, lang) {
  return lang === 'ru' ? `${value}+ ${pluralYearsRu(value)}` : `${value}+ years`;
}

// Short form for skill chips: "2.5+ yr" / "2.5+ г".
function formatExperienceShort(value, lang) {
  return lang === 'ru' ? `${value}+ г` : `${value}+ yr`;
}
