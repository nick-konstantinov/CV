const cards = document.querySelectorAll('.work-examples__card');
const supportsHover = window.matchMedia('(hover: hover)').matches;

cards.forEach(card => {
  const link = card.querySelector('.work-examples__link');

  const MAX_TILT = 30;

  const setTilt = (x, y) => {
    const rect = card.getBoundingClientRect();
    const px = (x - rect.left) / rect.width - 0.5;
    const py = (y - rect.top) / rect.height - 0.5;

    link.style.setProperty('--rx', `${-py * MAX_TILT}deg`);
    link.style.setProperty('--ry', `${px * MAX_TILT}deg`);
  };

  const reset = () => {
    link.style.setProperty('--rx', '0deg');
    link.style.setProperty('--ry', '0deg');
  };

  if (supportsHover) {
    card.addEventListener('mousemove', e => {
      setTilt(e.clientX, e.clientY);
    });

    card.addEventListener('mouseleave', reset);
  }

  card.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    card.classList.add('is-active');
    setTilt(touch.clientX, touch.clientY);
  }, { passive: true });

  card.addEventListener('touchend', () => {
    card.classList.remove('is-active');
    reset();
  });
});
