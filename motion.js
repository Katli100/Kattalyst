const motion = matchMedia('(prefers-reduced-motion: reduce)');
const field = document.querySelector('.color-field');
let frame = 0;
function paint() {
  frame = 0;
  const progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
  field.style.setProperty('--drift', motion.matches ? '0' : String(progress));
}
function queuePaint() {
  if (!frame) frame = requestAnimationFrame(paint);
}
window.addEventListener('scroll', queuePaint, { passive: true });
window.addEventListener('resize', queuePaint);
motion.addEventListener('change', queuePaint);
paint();
