(function () {
  const API_URL = 'https://cv-backend-srac.onrender.com';

  const PLACEHOLDER = 'https://YOUR-PROJECT.onrender.com';

  function detectApiBase() {
    const host = window.location.hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.onrender.com') ||
      host.endsWith('.vercel.app')
    ) {
      return '';
    }
    return API_URL;
  }

  const apiBase = detectApiBase();
  const backendReady = apiBase === '' || apiBase !== PLACEHOLDER;

  window.AppConfig = {
    apiBase: apiBase,
    contactFormFakeSubmit: !backendReady,
    chatFakeReply: !backendReady,
  };
})();
