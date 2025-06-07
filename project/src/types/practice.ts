export interface Exercise {
  id: string;
  type: 'escolha' | 'numero';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface PracticeData {
  subject: string;
  id: string;
  title: string;
  description: string;
  difficulty: string;
  exercises: Exercise[];
}

export interface PracticeProgress {
  currentExercise: number;
  totalExercises: number;
  correctAnswers: number;
  completed: boolean;
  score: number;
}