export interface LessonData {
  subject: string;
  id: string;
  title: string;
  description: string;
  difficulty: string;
  content: string;
}

export type Difficulty = 'introduction' | 'easy' | 'medium' | 'hard' | 'hyperHard';