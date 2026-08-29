export type QuizQuestion = {
  documentId: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type Quiz = {
  documentId: string;
  title: string;
  quiz_questions?: QuizQuestion[];
};

export type Course = {
  documentId: string;
  title: string;
  description: string;
  lessons?: Lesson[];
  quizzes?: Quiz[];
};