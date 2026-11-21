export const TOPIC_MESSAGES = [
  "You did it! I'm so proud of you! ♡",
  'Look at you! Another step closer to your dream!',
  'You are absolutely amazing!',
  'Your hard work is blooming beautifully. 🌷',
  'One more achievement unlocked!',
  "You're doing better than you think.",
  'Every page you study makes you stronger.',
  'Keep going, my brilliant girl!',
  'Your effort today is your strength tomorrow.',
  'I believe in you, always.',
  'You should be proud of yourself!',
  'Your dreams are worth every little effort.',
];

export const WORD_MESSAGES = [
  "Wonderful! You're doing amazing! ✨",
  'Perfect! Another word in your vocabulary!',
  "You're brilliant! Keep shining! 🌟",
  "That's my superstar! ♡",
  'Excellent! Your vocabulary is growing!',
  "Amazing work! I'm cheering for you!",
  "You're getting better every single day!",
  'Fantastic! Never underestimate yourself!',
  "I'm so proud of your dedication!",
  'You absolutely nailed it!',
  'Great job, beautiful progress!',
  "You're unstoppable!",
  'Incredible! Another little victory!',
  "Look at your progress. Isn't it wonderful?",
  'You are doing such a wonderful job!',
];

export const WALL_MESSAGES = [
  "You don't have to be perfect. You just have to keep going.",
  'Believe in yourself. I already do.',
  'Your dreams are worth every effort.',
  "Take a breath. You're doing better than you think.",
  "A bad study day doesn't mean a bad journey.",
  "You are capable of things you haven't even imagined yet.",
  'One day, all these little efforts will make sense.',
  'You deserve to be proud of yourself.',
  'Keep going. Your future self will thank you.',
  "If you get tired, rest. But don't give up on yourself.",
  'You are my favorite hardworking person.',
  "I believe in you, even on the days you don't believe in yourself.",
  "You are growing, even when it doesn't feel like it.",
  'Every little step matters.',
  'Your future is waiting for the beautiful things you are building.',
];

export const PRACTICE_MESSAGES = [
  "No worries, we'll meet this word again soon. 📚",
  'Saved for practice. Learning takes time, and that is okay.',
  'Good call! Practising is how words stick. ♡',
  'Added to your review list. Little by little!',
];

/**
 * Random picker that keeps the most recently shown messages out of the pool
 * for a while, so the same message doesn't pop up again and again.
 */
const recent = new Map<string[], number[]>();

export function pickMessage(list: string[], rand: () => number = Math.random): string {
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  const memory = Math.min(Math.floor(list.length / 2), 6);
  const history = recent.get(list) ?? [];
  const candidates = list.map((_, i) => i).filter((i) => !history.includes(i));
  const pick = candidates[Math.floor(rand() * candidates.length)];
  recent.set(list, [...history, pick].slice(-memory));
  return list[pick];
}

/** Message of the day: stable for the whole day. */
export function messageOfTheDay(date: string): string {
  let h = 0;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return WALL_MESSAGES[h % WALL_MESSAGES.length];
}
