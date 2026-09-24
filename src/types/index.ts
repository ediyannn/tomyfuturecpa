export type LearningMode = 'accountancy' | 'general';

export type FileType = 'pdf' | 'docx' | 'txt' | 'image';

export interface ConceptItem {
  name: string;
  explanation: string;
  importance: 'high' | 'medium' | 'foundational';
}

export interface DefinitionItem {
  term: string;
  definition: string;
  context?: string;
}

export interface ExampleItem {
  title: string;
  codeOrDescription: string;
  notes: string;
}

export interface ProcedureItem {
  stepNumber: number;
  action: string;
  details: string;
}

export interface FormulaSyntaxItem {
  name: string;
  syntax: string;
  description: string;
}

export interface RelationshipItem {
  source: string;
  target: string;
  relationship: string;
}

export interface StructuredAnalysis {
  mainTopics: string[];
  importantConcepts: ConceptItem[];
  definitions: DefinitionItem[];
  keyTerms: string[];
  importantFacts: string[];
  examples: ExampleItem[];
  procedures: ProcedureItem[];
  formulasOrSyntax: FormulaSyntaxItem[];
  relationships: RelationshipItem[];
  summary: string;
  pageCount?: number;
}

export interface LearningMaterial {
  id: string;
  title: string;
  fileName: string;
  fileType: FileType;
  fileSize: string;
  uploadedAt: string;
  subject: string;
  topic: string;
  mode?: LearningMode;
  description?: string;
  rawContent: string;
  imageUrl?: string;
  analysis: StructuredAnalysis;
}

export type ReviewerType =
  | 'Quick Summary'
  | 'Detailed Reviewer'
  | 'Exam Reviewer'
  | 'Key Concepts'
  | 'Definitions'
  | 'Question & Answer Reviewer'
  | 'CPA Board Exam Reviewer'
  | 'Accounting Journal & Ledger Guide';

export type DifficultyLevel =
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Mixed'
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'CPA-style Practice';

export type ReviewerLength = 'Short' | 'Medium' | 'Comprehensive';

export interface Reviewer {
  id: string;
  materialId: string;
  title: string;
  subject: string;
  topic: string;
  reviewerType: ReviewerType;
  difficulty: DifficultyLevel;
  length: ReviewerLength;
  contentMarkdown: string;
  createdAt: string;
}

export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'identification'
  | 'fill-blank'
  | 'matching'
  | 'short-answer'
  | 'problem-solving'
  | 'journal-entry'
  | 'calculation'
  | 'scenario';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  givenData?: Array<{ label: string; value: string }>;
  correctAnswer: string;
  hint: string;
  explanation: string;
  topicTag: string;
  matchingPairs?: MatchingPair[];
  journalSolution?: Array<{ account: string; debit?: string; credit?: string }>;
}

export interface Quiz {
  id: string;
  materialId: string;
  title: string;
  subject: string;
  topic: string;
  questionTypes: string[];
  questionCount: number;
  difficulty: DifficultyLevel;
  mode: 'practice' | 'exam';
  learningMode?: LearningMode;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResultItem {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  topicTag: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  materialId: string;
  title: string;
  timestamp: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
  difficulty: DifficultyLevel;
  mode: 'practice' | 'exam';
  results: QuizResultItem[];
  topicBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  weakTopics: string[];
  strongTopics: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topicTag: string;
  isKnown?: boolean;
  needsReview?: boolean;
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  materialId: string;
  title: string;
  subject: string;
  topic: string;
  learningMode?: LearningMode;
  cards: Flashcard[];
  createdAt: string;
}

export interface ActivitiesCollection {
  fillInTheBlanks: Array<{
    id: string;
    sentence: string;
    missingWord: string;
    hint: string;
    options: string[];
  }>;
  matching: Array<{
    id: string;
    title: string;
    pairs: MatchingPair[];
  }>;
  arrangeSteps: Array<{
    id: string;
    title: string;
    description?: string;
    steps: string[];
  }>;
  identifyConcept: Array<{
    id: string;
    clue: string;
    answer: string;
    options: string[];
  }>;
  scenario: Array<{
    id: string;
    scenario: string;
    question: string;
    solution: string;
  }>;
  explainItYourself: Array<{
    id: string;
    prompt: string;
    rubric: string;
  }>;
}

export interface UserProfile {
  name: string;
  email: string;
  universityOrSchool: string;
  gradeOrYear: string;
  major: string;
  avatarUrl?: string;
}

export interface UserPreferences {
  preferredDifficulty: DifficultyLevel;
  preferredQuizLength: number;
  defaultQuestionTypes: string[];
  appearance: 'light' | 'dark';
  currentMode: LearningMode;
}

export interface StudySessionRecord {
  id: string;
  materialId: string;
  materialTitle: string;
  type: 'Quiz' | 'Reviewer' | 'Flashcards' | 'Activities' | 'AI Tutor' | 'Problem Solver' | 'Exam';
  timestamp: string;
  durationMinutes: number;
  detail: string;
}

export interface WeakTopicRemedy {
  topic: string;
  subject: string;
  materialId: string;
  explanation: string;
  practiceQuestions: QuizQuestion[];
}

export interface AccountingProblemSolution {
  whatIsAsked: string;
  relevantConcept: string;
  givenInfo: Array<{ label: string; value: string }>;
  methodOrFormula: string;
  stepByStepSolution: Array<{
    stepNumber: number;
    title: string;
    calculation: string;
    explanation: string;
  }>;
  journalEntry?: Array<{
    account: string;
    debit?: string;
    credit?: string;
  }>;
  explanationOfCorrectness: string;
  hint: string;
  similarPracticeProblem: {
    problemText: string;
    hint: string;
    solution: string;
  };
}

export interface StudyGoal {
  id: string;
  title: string;
  subject: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}

export interface StudyPlanBlock {
  id: string;
  durationMinutes: number;
  subject: string;
  activityType: 'Concept Review' | 'Problem Solving' | 'Flashcards' | 'Practice Quiz' | 'Review Mistakes';
  description: string;
  completed: boolean;
}

export interface DailyStudyPlan {
  id: string;
  date: string;
  availableHours: number;
  subjects: string[];
  examDate?: string;
  blocks: StudyPlanBlock[];
}

