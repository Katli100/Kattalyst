const stage = document.querySelector('.pull-stage');
const modes = [...document.querySelectorAll('[data-mode]')];
const ends = ['left', 'right'].map((id, index) => ({
  plug: document.querySelector('#' + id),
  readout: document.querySelector('#' + id + 'Read'),
  direction: index === 0 ? -1 : 1,
  length: 0
}));
const [left, right] = ends;
const steps = [...document.querySelectorAll("[data-end]")];
const cable = document.querySelector('#cables');
const notes = {
  independent: 'Pull either end. The other end stays where it is.',
  linked: 'Pull either end and both lengths change together.',
  fixed: 'The computer end stays at 0 cm. Only the device end changes.'
};
let mode = 'independent';
let drag;

function position(end) {
  return 300 + end.direction * (114 + end.length * 4.2);
}

function draw() {
  cable.setAttribute('d', `M ${position(left)} 92 H ${position(right)}`);
  for (const end of ends) {
    end.plug.style.left = position(end) / 6 + '%';
    end.plug.setAttribute('aria-valuenow', end.length);
    end.plug.setAttribute('aria-valuetext', end.length + (end.length === 1 ? ' centimeter' : ' centimeters'));
    end.readout.textContent = end.length + ' cm';
  }
  for (const step of steps) {
    const end = step.dataset.end === 'left' ? left : right;
    const delta = Number(step.dataset.delta);
    const unavailable = (mode === 'fixed' && end === left) || end.length + delta < 0 || end.length + delta > 30;
    step.setAttribute('aria-disabled', String(unavailable));
  }
}

function adjust(end, length) {
  if (mode === 'fixed' && end === left) return;
  end.length = Math.min(30, Math.max(0, length));
  if (mode === 'linked') left.length = right.length = end.length;
  draw();
}

for (const end of ends) {
  end.plug.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || (mode === 'fixed' && end === left)) return;
    end.plug.setPointerCapture(event.pointerId);
    drag = { end, pointerId: event.pointerId, start: event.clientX, length: end.length };
  });
  end.plug.addEventListener('pointermove', event => {
    if (drag?.end !== end || drag.pointerId !== event.pointerId) return;
    const distance = (event.clientX - drag.start) * (600 / 4.2) / stage.clientWidth;
    adjust(end, drag.length + Math.round(end.direction * distance));
  });
  end.plug.addEventListener('lostpointercapture', () => {
    if (drag?.end === end) drag = undefined;
  });
  end.plug.addEventListener('keydown', event => {
    const values = { ArrowRight: end.length + 1, ArrowUp: end.length + 1,
      ArrowLeft: end.length - 1, ArrowDown: end.length - 1, Home: 0, End: 30 };
    if (!Object.hasOwn(values, event.key)) return;
    event.preventDefault();
    adjust(end, values[event.key]);
  });
}

for (const step of steps) {
  step.addEventListener('click', () => {
    if (step.getAttribute('aria-disabled') === 'true') return;
    const end = step.dataset.end === 'left' ? left : right;
    adjust(end, end.length + Number(step.dataset.delta));
  });
}

for (const button of modes) {
  button.addEventListener('click', () => {
    if (mode === button.dataset.mode) return;
    mode = button.dataset.mode;
    for (const option of modes) option.setAttribute('aria-pressed', String(option === button));
    left.plug.setAttribute('aria-disabled', String(mode === 'fixed'));
    left.length = right.length = 0;
    document.querySelector('#modeNote').textContent = notes[mode] + ' Changing the layout resets both lengths.';
    draw();
  });
}

draw();
