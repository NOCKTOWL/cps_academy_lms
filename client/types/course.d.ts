export type Course = {
  documentId: string;
  title: string;
  description: string;
  lessons?: Lesson[];
}