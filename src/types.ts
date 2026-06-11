/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Formula {
  label: string;
  formula: string;
  desc: string;
}

export interface Example {
  problem: string;
  solution: string;
}

export interface PYQReference {
  question: string;
  year: number;
  answer: string;
  explanation: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface SyllabusTopic {
  id: string; // url-friendly topic ID
  name: string;
  theory: string;
  formulas: Formula[];
  examples: Example[];
  pyqs: PYQReference[];
  mistakes: string[];
  faqs: FAQ[];
}

export interface SubjectDetails {
  id: string;
  name: string;
  overview: string;
  trends: string;
  recommendedBooks: string[];
  videoUrl?: string;
  topics: SyllabusTopic[];
}

export interface BranchDetails {
  id: string;
  name: string;
  fullName: string;
  overview: string;
  preparationStrategy: string;
  syllabusOverview: string;
  recommendedBooks: string[];
  subjects: SubjectDetails[];
}

export interface PYQ {
  id: string;
  branch: string;
  year: number;
  subject: string;
  questionNumber: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface NoteItem {
  id: string;
  branch: string;
  subject: string;
  topic: string;
  title: string;
  type: 'Short Note' | 'Revision Note' | 'Handwritten' | 'Formula Sheet';
  fileSize: string;
  dateAdded: string;
  downloadUrl: string; // simple link simulation
  isUserUploaded?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Preparation Strategy' | 'PSU Recruitment' | 'Study Plan' | 'Exam Analysis' | 'Tutorial';
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface MockTest {
  id: string;
  title: string;
  branch: string;
  type: 'Full Length' | 'Subject-wise' | 'Topic-wise';
  subjectName?: string;
  durationMinutes: number;
  questionsCount: number;
  questions: PYQ[];
}

export interface TestResult {
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredAnswers: number;
  dateTaken: string;
  timeSpentSeconds: number;
}
