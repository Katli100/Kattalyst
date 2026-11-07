(() => {
  const form = document.querySelector('[data-note-form]');
  if (!form) return;
  const senderName = form.elements.namedItem('name');
  const message = form.elements.namedItem('message');
  const submit = form.querySelector('[type="submit"]');
  const label = submit.querySelector('[data-send-label]');
  const receipt = document.querySelector('[data-message-receipt]');
  const page = new URL(window.location.href);
  // The same static files work on GitHub Pages or another HTTPS host.
  // Local previews keep the public site's return URL from the HTML.
  if (page.protocol === 'https:') {
    const next = new URL('contact.html', page);
    next.searchParams.set('message', 'received');
    next.hash = 'leave-a-note';
    form.elements.namedItem('_next').value = next.href;
    const source = new URL('contact.html', page);
    form.elements.namedItem('_url').value = source.href;
  }
  if (page.searchParams.get('message') === 'received') receipt.hidden = false;
  senderName.addEventListener('input', () => senderName.setCustomValidity(''));
  message.addEventListener('input', () => message.setCustomValidity(''));
  form.addEventListener('submit', event => {
    if (!senderName.value.trim()) {
      event.preventDefault();
      senderName.setCustomValidity('Please add your name before sending.');
      senderName.reportValidity();
      return;
    }
    if (!message.value.trim()) {
      event.preventDefault();
      message.setCustomValidity('Please add a message before sending.');
      message.reportValidity();
      return;
    }
    if (!form.checkValidity()) { event.preventDefault(); form.reportValidity(); return; }
    // Native POST lets the delivery service handle its spam checks and response.
    // There is no local-only “sent” state that could hide a failed submission.
    submit.disabled = true;
    label.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
  });
  window.addEventListener('pageshow', () => {
    submit.disabled = false;
    label.textContent = 'Send message';
    form.removeAttribute('aria-busy');
  });
})();
