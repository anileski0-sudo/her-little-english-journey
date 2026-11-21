export type TopicStatus = 'not-started' | 'in-progress' | 'completed';

export const TOPIC_CATEGORIES = [
  'Grammar',
  'Vocabulary',
  'Reading',
  'Sentence Completion',
  'Cloze Test',
  'Translation',
  'Paragraph',
  'Restatement',
  'Phrasal Verbs',
  'Other',
] as const;
export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];

export interface Topic {
  id: string;
  name: string;
  category: TopicCategory;
  description: string;
  status: TopicStatus;
  progress: number; // 0-100
  date: string; // YYYY-MM-DD (planned / study date)
  createdAt: string; // ISO
  completedAt?: string; // YYYY-MM-DD
}

export interface DaySet {
  date: string; // YYYY-MM-DD
  wordIds: string[];
  known: string[];
  practice: string[];
  celebrated?: boolean;
}

export interface ReviewItem {
  wordId: string;
  addedAt: string; // YYYY-MM-DD
  reviewCount: number;
  lastReviewed?: string; // YYYY-MM-DD
}

export const MOODS = ['😊', '🥰', '😌', '🤓', '😴', '😣', '🔥'] as const;
export const MOOD_LABELS: Record<string, string> = {
  '😊': 'Happy',
  '🥰': 'Loved',
  '😌': 'Calm',
  '🤓': 'Focused',
  '😴': 'Tired',
  '😣': 'Stressed',
  '🔥': 'Motivated',
};

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  topics: string;
  minutes: number;
  note: string;
  mood: string;
}

export type ThemeName = 'kraft' | 'rose' | 'sage' | 'blue';

export interface Settings {
  examDate: string | null; // YYYY-MM-DD
  examTime: string; // HH:MM
  dailyWordGoal: number;
  dailyStudyGoal: number; // minutes
  theme: ThemeName;
}

export interface Achievement {
  id: string;
  type: 'topic' | 'badge' | 'daily';
  label: string;
  date: string; // YYYY-MM-DD
}

export interface AppData {
  version: number;
  settings: Settings;
  topics: Topic[];
  days: Record<string, DaySet>;
  learned: Record<string, string>; // wordId -> date learned
  review: ReviewItem[];
  journal: JournalEntry[];
  badges: Record<string, string>; // badgeId -> date earned
  achievements: Achievement[];
}

export interface Word {
  id: string;
  en: string;
  pos: string;
  level: 'B1' | 'B2';
  tr: string;
  ex: string;
  exTr: string;
  syn?: string;
}
