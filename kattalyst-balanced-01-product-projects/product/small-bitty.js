const button = document.querySelector('.label-toggle');
const [seated, lifted] = document.querySelectorAll('#label-preview img');
button.addEventListener('click', () => {
  const showLifted = lifted.hidden;
  lifted.hidden = !showLifted;
  seated.hidden = showLifted;
  button.textContent = showLifted ? 'Put the label back' : 'Lift a magnetic label';
  document.querySelector('#label-note').textContent = showLifted
    ? 'Look to the left of the slots for the lifted cream label and its exposed round mount.'
    : 'This lower-angle view shows the labels seated beside their slots.';
  button.setAttribute('aria-pressed', String(showLifted));
});

button.disabled = false;
