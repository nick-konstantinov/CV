(function () {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const modal = document.querySelector('[data-contact-modal]');
  const openBtns = Array.from(document.querySelectorAll('[data-contact-open]'));
  const closeBtns = Array.from(document.querySelectorAll('[data-contact-close]'));
  const submitBtn = form.querySelector('[data-contact-submit]');
  const statusEl = form.querySelector('[data-contact-status]');
  const fields = Array.from(form.querySelectorAll('[data-contact-field]'));
  const honeypot = form.querySelector('[name="website"]');

  function openModal() {
    if (!modal) return;
    setStatus(null);
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.classList.add('no-scroll');
    const first = form.querySelector('input, textarea');
    if (first) setTimeout(() => first.focus(), 50);
  }

  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.classList.remove('no-scroll');
  }

  if (modal) {
    modal.addEventListener('close', () => {
      document.body.classList.remove('no-scroll');
    });
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  const validators = {
    name: (v) => v.trim().length >= 2 || 'too-short',
    phone: (v) => {
      const clean = v.replace(/[\s()\-]/g, '');
      if (clean.length < 5) return 'too-short';
      if (!/^\+?\d+$/.test(clean)) return 'invalid';
      return true;
    },
    email: (v) => {
      if (!v.trim()) return 'required';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'invalid';
    },
    message: (v) => v.trim().length >= 5 || 'too-short',
  };

  const errorKey = (field, kind) => `contact-form__error-${field}-${kind}`;

  function translate(key, fallback) {
    const dict = window.mainPageText && window.mainPageText[key];
    if (!dict) return fallback;
    const lang = localStorage.getItem('language') || 'en';
    return dict[lang] || dict.en || fallback;
  }

  function setStatus(kind, key, fallback) {
    statusEl.classList.remove(
      'contact-form__status--success',
      'contact-form__status--error',
      'contact-form__status--loading',
    );
    delete statusEl.dataset.langKey;
    delete statusEl.dataset.langFallback;

    if (!kind) {
      statusEl.textContent = '';
      return;
    }
    statusEl.classList.add(`contact-form__status--${kind}`);
    statusEl.textContent = translate(key, fallback);
    if (key) {
      statusEl.dataset.langKey = key;
      statusEl.dataset.langFallback = fallback;
    }
  }

  document.addEventListener('languagechange', () => {
    const key = statusEl.dataset.langKey;
    if (!key) return;
    statusEl.textContent = translate(key, statusEl.dataset.langFallback || '');
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    form.classList.toggle('contact-form--loading', loading);
  }

  function showFieldError(name, errorCode) {
    const wrapper = form.querySelector(`[data-contact-field="${name}"]`);
    const input = wrapper.querySelector('input, textarea');
    const errorEl = wrapper.querySelector('[data-contact-error]');

    if (errorCode === true || !errorCode) {
      wrapper.classList.remove('contact-form__field--invalid');
      input.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
      return;
    }

    wrapper.classList.add('contact-form__field--invalid');
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = translate(
      errorKey(name, errorCode),
      `Please check the ${name} field.`,
    );
  }

  function validateAll() {
    let firstInvalid = null;
    fields.forEach((wrapper) => {
      const input = wrapper.querySelector('input, textarea');
      const name = input.name;
      const result = validators[name] ? validators[name](input.value) : true;
      showFieldError(name, result);
      if (result !== true && !firstInvalid) firstInvalid = input;
    });
    return firstInvalid;
  }

  fields.forEach((wrapper) => {
    const input = wrapper.querySelector('input, textarea');
    input.addEventListener('blur', () => {
      const result = validators[input.name]
        ? validators[input.name](input.value)
        : true;
      showFieldError(input.name, result);
    });
    input.addEventListener('input', () => {
      if (wrapper.classList.contains('contact-form__field--invalid')) {
        const result = validators[input.name]
          ? validators[input.name](input.value)
          : true;
        showFieldError(input.name, result);
      }
    });
  });

  async function submitToBackend(payload) {
    const cfg = window.AppConfig || {};

    if (cfg.contactFormFakeSubmit) {
      await new Promise((r) => setTimeout(r, 800));
      return {ok: true};
    }

    const base = cfg.apiBase || '';
    const res = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    let body = null;
    try {
      body = await res.json();
    } catch (_) {
      // ignore — body may be empty
    }

    if (!res.ok) {
      const error = new Error((body && body.error) || `HTTP ${res.status}`);
      error.code = (body && body.code) || 'server';
      throw error;
    }
    return body || {ok: true};
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (honeypot && honeypot.value) {
      setStatus('success', 'contact-form__status-success', 'Message sent. I will get back to you shortly.');
      form.reset();
      return;
    }

    const firstInvalid = validateAll();
    if (firstInvalid) {
      firstInvalid.focus();
      setStatus('error', 'contact-form__status-validation', 'Please fix the highlighted fields.');
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
    };

    setLoading(true);
    setStatus('loading', 'contact-form__status-sending', 'Sending…');

    try {
      await submitToBackend(payload);
      form.reset();
      fields.forEach((wrapper) => {
        wrapper.classList.remove('contact-form__field--invalid');
        const input = wrapper.querySelector('input, textarea');
        input.setAttribute('aria-invalid', 'false');
        wrapper.querySelector('[data-contact-error]').textContent = '';
      });
      setStatus('success', 'contact-form__status-success', 'Message sent. A copy is on its way to your inbox.');
    } catch (err) {
      setStatus('error', 'contact-form__status-error', 'Could not send the message. Please try again or email me directly.');
    } finally {
      setLoading(false);
    }
  });
})();
