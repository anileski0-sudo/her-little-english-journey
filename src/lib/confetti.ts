import confetti from 'canvas-confetti';

const COLORS = ['#D9A6A0', '#D6B56C', '#9CA98E', '#9CB5C8', '#F4E8D5', '#C27C74'];

export function softConfetti() {
  try {
    confetti({
      particleCount: 70,
      spread: 75,
      startVelocity: 32,
      gravity: 0.9,
      scalar: 0.9,
      ticks: 160,
      origin: { y: 0.65 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
  } catch {
    /* decorative only */
  }
}

export function bigConfetti() {
  try {
    const end = Date.now() + 1200;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    confetti({ particleCount: 40, spread: 100, shapes: ['star'], scalar: 1.2, colors: ['#D6B56C', '#F0D58C'], origin: { y: 0.5 }, disableForReducedMotion: true });
  } catch {
    /* decorative only */
  }
}
