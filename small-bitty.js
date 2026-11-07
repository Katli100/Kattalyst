const button = document.querySelector('.label-toggle');
const [seated, lifted] = document.querySelectorAll('#label-preview img');
button.addEventListener('click', () => {
  const showLifted = lifted.hidden;
  lifted.hidden = !showLifted;
  seated.hidden = showLifted;
  button.textContent = showLifted ? 'Put the label back' : 'Lift a magnetic label';
  document.querySelector('#label-note').textContent = showLifted
    ? 'The label lifts off its magnetic mount. You can put it back or swap it for a different icon.'
    : 'The magnetic labels sit beside the slots. Try lifting one to see how it separates.';
  button.setAttribute('aria-pressed', String(showLifted));
});

button.disabled = false;
