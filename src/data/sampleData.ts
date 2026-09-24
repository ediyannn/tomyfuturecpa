import {
  LearningMaterial,
  Reviewer,
  Quiz,
  QuizAttempt,
  FlashcardDeck,
  ActivitiesCollection,
  UserProfile,
  UserPreferences,
  StudySessionRecord,
  StudyGoal,
  DailyStudyPlan,
} from '../types';

export const initialUser: UserProfile = {
  name: 'Genelle',
  email: 'genelle.accountancy@university.edu',
  universityOrSchool: 'College of Business & Accountancy',
  gradeOrYear: '3rd Year BSA',
  major: 'Bachelor of Science in Accountancy',
};

export const initialPreferences: UserPreferences = {
  preferredDifficulty: 'Intermediate',
  preferredQuizLength: 10,
  defaultQuestionTypes: ['multiple-choice', 'true-false', 'problem-solving', 'journal-entry'],
  appearance: 'light',
  currentMode: 'accountancy',
};

export const ACCOUNTANCY_SUBJECTS = [
  'Financial Accounting',
  'Intermediate Accounting',
  'Cost Accounting',
  'Management Accounting',
  'Auditing',
  'Taxation',
  'Accounting Information Systems',
  'Business Law',
  'Economics',
  'Finance',
  'Bookkeeping',
  'Accounting Principles',
  'Financial Statements',
  'Partnership Accounting',
  'Corporation Accounting',
  'Government Accounting',
  'Internal Controls',
  'Accounting Standards',
  'Business Mathematics',
  'Statistics',
];

export const GENERAL_KNOWLEDGE_SUBJECTS = [
  'Science',
  'History',
  'Geography',
  'Technology',
  'Computer Science',
  'Mathematics',
  'Literature',
  'General Business',
  'Current Concepts',
  'Language',
  'Arts and Culture',
  'Everyday Knowledge',
];

export const sampleAccountancyMaterial: LearningMaterial = {
  id: 'mat-acct-fa-ch5',
  title: 'Financial Accounting: Adjusting Entries & The Accounting Cycle',
  fileName: 'Financial Accounting Chapter 5 - Adjusting Entries.pdf',
  fileType: 'pdf',
  fileSize: '3.2 MB',
  uploadedAt: 'September 23, 2026',
  subject: 'Financial Accounting',
  topic: 'Adjusting Entries & Working Papers',
  mode: 'accountancy',
  description: 'Comprehensive reviewer on accruals, deferrals, depreciation methods, and period-end adjustments.',
  rawContent: `Financial Accounting Chapter 5: Adjusting Entries and the Accounting Cycle
1. Purpose of Adjusting Entries
Adjusting entries are prepared at the end of the accounting period to update balances and enforce the accrual basis of accounting.
They ensure that:
- Revenues are recorded when earned (Revenue Recognition Principle).
- Expenses are recognized when incurred to generate revenue (Matching Principle).
Every adjusting entry affects at least one balance sheet account (asset or liability) and one income statement account (revenue or expense). CASH is NEVER part of an adjusting entry!

2. Types of Adjusting Entries
A. Deferrals (Cash preceded recognition):
   - Prepaid Expenses: Cash paid before expense is incurred. (Debit: Expense, Credit: Prepaid Asset)
   - Unearned Revenues: Cash collected before service is rendered. (Debit: Unearned Revenue [Liability], Credit: Service Revenue)
B. Accruals (Recognition preceded cash):
   - Accrued Revenues: Revenues earned but unbilled and unpaid. (Debit: Accounts Receivable, Credit: Service Revenue)
   - Accrued Expenses: Expenses incurred but unrecorded and unpaid. (Debit: Operating Expense, Credit: Accrued Expense Payable)

3. Depreciation & Amortization
Depreciation allocates the depreciable cost of property, plant, and equipment over its estimated useful economic life.
Straight-Line Depreciation Formula:
Annual Depreciation = (Cost - Residual/Salvage Value) / Useful Life in Years.
Monthly Depreciation = Annual Depreciation / 12.
Adjusting Entry:
Debit: Depreciation Expense - Equipment
Credit: Accumulated Depreciation - Equipment (Contra-Asset account with a normal credit balance).
Book Value = Cost - Accumulated Depreciation.

4. Accounting Equation & Ending Capital
The fundamental accounting equation is:
Assets = Liabilities + Owner's Equity.
Ending Capital Calculation:
Ending Capital = Beginning Capital + Additional Investments + Net Income (or - Net Loss) - Owner's Withdrawals.
Net Income = Total Revenues - Total Expenses.`,
  analysis: {
    mainTopics: [
      'Adjusting Entries',
      'Accrual Basis of Accounting',
      'Prepaid Expenses & Deferrals',
      'Accrued Expenses & Accruals',
      'Straight-Line Depreciation',
      'Accumulated Depreciation (Contra-Asset)',
      'Ending Capital Formula',
    ],
    importantConcepts: [
      {
        name: 'Matching Principle',
        explanation: 'Requires that expenses incurred in generating revenues be recognized in the identical accounting period.',
        importance: 'foundational',
      },
      {
        name: 'No Cash in Adjusting Entries',
        explanation: 'Adjusting journal entries never include the Cash account because cash flows occur either before or after.',
        importance: 'high',
      },
      {
        name: 'Contra-Asset Account',
        explanation: 'Accumulated depreciation is credited to reduce equipment carrying value without directly altering historical cost.',
        importance: 'high',
      },
    ],
    definitions: [
      {
        term: 'Accrual Accounting',
        definition: 'Recording revenues when earned and expenses when incurred, regardless of when cash is received or paid.',
        context: 'PFRS / GAAP Standards',
      },
      {
        term: 'Book Value',
        definition: 'The net value of an asset calculated as its historical acquisition cost minus accumulated depreciation.',
        context: 'Financial Statements',
      },
      {
        term: 'Contra-Asset',
        definition: 'An asset account with a credit balance that offsets the balance of a related asset account.',
        context: 'Balance Sheet Presentation',
      },
    ],
    keyTerms: [
      'Accruals',
      'Deferrals',
      'Depreciation Expense',
      'Accumulated Depreciation',
      'Matching Principle',
      'Prepaid Expense',
      'Unearned Revenue',
      'Ending Capital',
    ],
    importantFacts: [
      'Cash is never debited or credited in an adjusting journal entry.',
      'Accumulated Depreciation is a contra-asset account with a normal credit balance.',
      'Straight-Line Depreciation = (Cost - Salvage Value) / Useful Life.',
      'Ending Capital = Beginning Capital + Investments + Net Income - Withdrawals.',
    ],
    examples: [
      {
        title: 'Depreciation Adjusting Entry for Equipment',
        codeOrDescription: 'Debit: Depreciation Expense - Equipment ₱18,000\nCredit: Accumulated Depreciation - Equipment ₱18,000',
        notes: 'Calculated using (₱100,000 Cost - ₱10,000 Salvage) / 5 years.',
      },
      {
        title: 'Accrued Salaries at Month-End',
        codeOrDescription: 'Debit: Salaries Expense ₱25,000\nCredit: Salaries Payable ₱25,000',
        notes: 'Reflects employee work performed prior to pay date.',
      },
    ],
    procedures: [
      { stepNumber: 1, action: 'Identify Transaction Period', details: 'Determine the cutoff date of the accounting period.' },
      { stepNumber: 2, action: 'Categorize Entry Type', details: 'Identify whether deferral (prepaid/unearned) or accrual (receivable/payable).' },
      { stepNumber: 3, action: 'Calculate Prorated Amount', details: 'Apply depreciation formulas or time-based interest/rent calculations.' },
      { stepNumber: 4, action: 'Post Journal Entry', details: 'Record debit to expense/revenue and credit to asset/liability.' },
    ],
    formulasOrSyntax: [
      { name: 'Straight-Line Depreciation', syntax: 'Annual Depr = (Cost - Residual Value) / Useful Life in Years', description: 'Calculates periodic asset depreciation' },
      { name: 'Ending Capital Equation', syntax: 'Ending Capital = Beg. Capital + Investments + Net Income - Withdrawals', description: 'Computes period-end equity' },
    ],
    relationships: [
      { source: 'Adjusting Entries', target: 'Accrual Accounting', relationship: 'implements' },
      { source: 'Depreciation Expense', target: 'Accumulated Depreciation', relationship: 'paired contra-account' },
      { source: 'Matching Principle', target: 'Expense Recognition', relationship: 'governs timing' },
    ],
    summary: 'Essential accountancy guide for Genelle covering period-end adjustments, accrual vs cash basis, contra-assets, and capital equity reconciliation.',
    pageCount: 6,
  },
};

export const sampleGeneralMaterial: LearningMaterial = {
  id: 'mat-gen-tech-ai',
  title: 'General Knowledge: History of Computing & Artificial Intelligence',
  fileName: 'History of Computing & Modern AI.pdf',
  fileType: 'pdf',
  fileSize: '1.8 MB',
  uploadedAt: 'September 22, 2026',
  subject: 'Technology',
  topic: 'Computing History & AI Milestones',
  mode: 'general',
  description: 'Historical milestones in computing from Ada Lovelace and Alan Turing to modern transformer neural networks.',
  rawContent: `General Knowledge: History of Computing & AI
From Charles Babbage and Ada Lovelace's Analytical Engine to the Turing Test, computing evolved through vacuum tubes, transistors, microprocessors, the Internet, and modern machine learning models. Key milestones include Alan Turing's 1950 paper 'Computing Machinery and Intelligence', the Dartmouth Conference in 1956 where the term 'Artificial Intelligence' was coined, and modern transformer architectures.`,
  analysis: {
    mainTopics: ['Analytical Engine', 'Alan Turing', 'Dartmouth Conference 1956', 'Transistor Revolution', 'Transformers'],
    importantConcepts: [
      {
        name: 'Turing Test',
        explanation: 'A benchmark test of a machine ability to exhibit intelligent behavior indistinguishable from a human.',
        importance: 'foundational',
      },
    ],
    definitions: [
      {
        term: 'Artificial Intelligence',
        definition: 'The simulation of human intelligence processes by computer systems, coined at the 1956 Dartmouth workshop.',
        context: 'Computer Science',
      },
    ],
    keyTerms: ['Turing Test', 'Analytical Engine', 'Transistors', 'Machine Learning'],
    importantFacts: ['Ada Lovelace is recognized as the first computer programmer.', 'The Dartmouth Conference in 1956 founded AI as a discipline.'],
    examples: [],
    procedures: [],
    formulasOrSyntax: [],
    relationships: [],
    summary: 'Broad general knowledge material exploring computing milestones and AI history.',
    pageCount: 4,
  },
};

export const sampleAccountancyReviewer: Reviewer = {
  id: 'rev-acct-fa',
  materialId: sampleAccountancyMaterial.id,
  title: 'Financial Accounting: Adjusting Entries & Accounting Cycle Comprehensive Reviewer',
  subject: 'Financial Accounting',
  topic: 'Adjusting Entries & Working Papers',
  reviewerType: 'Detailed Reviewer',
  difficulty: 'Intermediate',
  length: 'Comprehensive',
  createdAt: 'September 23, 2026',
  contentMarkdown: `# Financial Accounting: Adjusting Entries & The Accounting Cycle

## 1. Core Principles & Framework
The accrual basis of accounting recognizes the financial effects of transactions, events, and circumstances in the periods in which they occur, regardless of when cash is collected or paid.

> **Crucial Rule:** Cash is **never** included in an adjusting journal entry. Adjusting entries serve to update accounts to reflect the passage of time or unrecorded transactions.

---

## 2. Straight-Line Depreciation
When a business acquires long-term property, plant, and equipment, the acquisition cost must be systematically allocated over its useful life.

### Mathematical Formulation
$$\\text{Annual Depreciation} = \\frac{\\text{Cost} - \\text{Salvage Value}}{\\text{Useful Life in Years}}$$

$$\\text{Monthly Depreciation} = \\frac{\\text{Annual Depreciation}}{12}$$

### Standard Adjusting Journal Entry
| Account Title | Debit (₱) | Credit (₱) |
| :--- | :--- | :--- |
| **Depreciation Expense — Equipment** | ₱18,000 | |
| **Accumulated Depreciation — Equipment** | | ₱18,000 |

*Accumulated Depreciation* is a **contra-asset account** with a normal credit balance, reported on the Statement of Financial Position as a deduction from the asset cost.

---

## 3. The Equity Reconciliation Equation
$$\\text{Ending Capital} = \\text{Beginning Capital} + \\text{Investments} + \\text{Net Income} - \\text{Withdrawals}$$

Where:
- $\\text{Net Income} = \\text{Total Revenues} - \\text{Total Expenses}$
- Withdrawals reduce owner equity directly without appearing in the Income Statement.`,
};

export const sampleAccountancyQuiz: Quiz = {
  id: 'quiz-acct-fa-practice',
  materialId: sampleAccountancyMaterial.id,
  title: 'Financial Accounting: Adjusting Entries & Problem Solving',
  subject: 'Financial Accounting',
  topic: 'Adjusting Entries & Equity Equations',
  questionTypes: ['Multiple Choice', 'True or False', 'Problem Solving', 'Journal Entry'],
  questionCount: 6,
  difficulty: 'Intermediate',
  mode: 'practice',
  learningMode: 'accountancy',
  createdAt: 'September 23, 2026',
  questions: [
    {
      id: 'q-acct-1',
      type: 'multiple-choice',
      prompt: 'Which account is NEVER debited or credited in a year-end adjusting journal entry?',
      options: ['A. Depreciation Expense', 'B. Accounts Payable', 'C. Cash', 'D. Unearned Service Revenue'],
      correctAnswer: 'C. Cash',
      hint: 'Adjusting entries bring non-cash accruals and deferrals up to date.',
      explanation: 'Cash transactions are recorded in real-time when cash changes hands. Adjusting entries strictly update accrued and deferred items without involving Cash.',
      topicTag: 'Adjusting Entries',
    },
    {
      id: 'q-acct-2',
      type: 'problem-solving',
      prompt: 'Calculate the ending owner\'s capital based on the provided year-end data for Genelle Services.',
      givenData: [
        { label: 'Beginning Capital', value: '₱200,000' },
        { label: 'Additional Investment', value: '₱50,000' },
        { label: 'Owner Withdrawals', value: '₱20,000' },
        { label: 'Net Income', value: '₱80,000' },
      ],
      options: ['A. ₱290,000', 'B. ₱310,000', 'C. ₱350,000', 'D. ₱270,000'],
      correctAnswer: 'B. ₱310,000',
      hint: 'Ending Capital = Beginning Capital + Investments + Net Income - Withdrawals.',
      explanation: 'Ending Capital = ₱200,000 + ₱50,000 + ₱80,000 - ₱20,000 = ₱310,000.',
      topicTag: 'Owner Equity',
    },
    {
      id: 'q-acct-3',
      type: 'problem-solving',
      prompt: 'On January 1, a company bought office equipment for ₱100,000 with an estimated 5-year useful life and ₱10,000 salvage value. What is the depreciation expense on December 31?',
      givenData: [
        { label: 'Equipment Acquisition Cost', value: '₱100,000' },
        { label: 'Residual / Salvage Value', value: '₱10,000' },
        { label: 'Estimated Useful Life', value: '5 Years' },
      ],
      options: ['A. ₱20,000', 'B. ₱18,000', 'C. ₱15,000', 'D. ₱22,000'],
      correctAnswer: 'B. ₱18,000',
      hint: 'Annual Depreciation = (Cost - Salvage Value) / Useful Life.',
      explanation: '(₱100,000 - ₱10,000) / 5 years = ₱90,000 / 5 = ₱18,000 annual depreciation expense.',
      topicTag: 'Depreciation',
    },
    {
      id: 'q-acct-4',
      type: 'true-false',
      prompt: 'Accumulated Depreciation is reported as a liability on the Statement of Financial Position because it has a normal credit balance.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      hint: 'Think about its relationship to the equipment asset account.',
      explanation: 'False. Accumulated Depreciation is a contra-asset account, not a liability. It is deducted directly from Property, Plant, and Equipment on the balance sheet.',
      topicTag: 'Contra-Asset',
    },
    {
      id: 'q-acct-5',
      type: 'journal-entry',
      prompt: 'Which journal entry correctly records accrued salaries of ₱15,000 owed to accounting assistants at the end of December?',
      options: [
        'A. Debit: Salaries Expense ₱15,000; Credit: Cash ₱15,000',
        'B. Debit: Salaries Expense ₱15,000; Credit: Salaries Payable ₱15,000',
        'C. Debit: Salaries Payable ₱15,000; Credit: Salaries Expense ₱15,000',
        'D. Debit: Prepaid Salaries ₱15,000; Credit: Salaries Payable ₱15,000',
      ],
      correctAnswer: 'B. Debit: Salaries Expense ₱15,000; Credit: Salaries Payable ₱15,000',
      hint: 'An accrued expense increases an expense and establishes a liability payable.',
      explanation: 'Debit Salaries Expense to recognize the cost incurred, and credit Salaries Payable to record the liability.',
      topicTag: 'Adjusting Entries',
    },
    {
      id: 'q-acct-6',
      type: 'identification',
      prompt: 'Name the fundamental accounting principle that requires expenses to be recognized in the same period as the revenues they helped earn.',
      options: ['A. Conservatism Principle', 'B. Matching Principle', 'C. Cost Principle', 'D. Materiality Principle'],
      correctAnswer: 'B. Matching Principle',
      hint: 'Requires matching effort (expense) with accomplishment (revenue).',
      explanation: 'The Matching Principle dictates that expenses incurred to generate revenue must be recognized in the identical reporting period.',
      topicTag: 'Accounting Standards',
    },
  ],
};

// Genelle's realistic performance breakdown as requested in Prompt Section 11:
// Financial Accounting — 85%
// Auditing — 72%
// Taxation — 60%  <-- Needs study focus!
// Economics — 90%
export const sampleGenellePastAttempt: QuizAttempt = {
  id: 'att-genelle-tax-1',
  quizId: 'quiz-tax-review',
  materialId: sampleAccountancyMaterial.id,
  title: 'Taxation: Value-Added Tax & Deductions Diagnostic',
  timestamp: 'Yesterday at 5:15 PM',
  score: 6,
  total: 10,
  percentage: 60,
  timeSpentSeconds: 320,
  difficulty: 'Intermediate',
  mode: 'practice',
  results: [
    { questionId: 'q-tax-1', questionText: 'What is the standard standard output VAT rate in the Philippines?', userAnswer: '12%', correctAnswer: '12%', isCorrect: true, explanation: 'Under the Tax Code, standard rate is 12%.', topicTag: 'Taxation' },
    { questionId: 'q-tax-2', questionText: 'Input VAT from capital goods purchases exceeding ₱1M must be amortized over how many months?', userAnswer: '12 months', correctAnswer: '60 months (or useful life, whichever is shorter)', isCorrect: false, explanation: 'Under previous rules it was 60 months.', topicTag: 'Taxation' },
    { questionId: 'q-tax-3', questionText: 'Calculate Net VAT Payable given Output VAT of ₱120,000 and Input VAT of ₱85,000.', userAnswer: '₱35,000', correctAnswer: '₱35,000', isCorrect: true, explanation: 'Net VAT = Output VAT ₱120,000 - Input VAT ₱85,000 = ₱35,000.', topicTag: 'Taxation' },
    { questionId: 'q-tax-4', questionText: 'Which entity is exempt from VAT under the threshold rule?', userAnswer: 'Gross sales below ₱3,000,000', correctAnswer: 'Gross sales below ₱3,000,000', isCorrect: true, explanation: 'Small proprietors below ₱3M threshold may opt for percentage tax.', topicTag: 'Taxation' },
    { questionId: 'q-tax-5', questionText: 'Is zero-rated VAT the same as VAT-exempt?', userAnswer: 'Yes', correctAnswer: 'No', isCorrect: false, explanation: 'Zero-rated allows refund/credit of input VAT, while VAT-exempt does not allow input VAT recovery.', topicTag: 'Taxation' },
    { questionId: 'q-tax-6', questionText: 'In Financial Accounting, how is interest revenue recognized?', userAnswer: 'Time-proportionate basis', correctAnswer: 'Time-proportionate basis', isCorrect: true, explanation: 'Effective interest rate method over time.', topicTag: 'Financial Accounting' },
    { questionId: 'q-tax-7', questionText: 'In Auditing, what is the auditor primary responsibility regarding fraud?', userAnswer: 'Obtain reasonable assurance', correctAnswer: 'Obtain reasonable assurance', isCorrect: true, explanation: 'Auditors obtain reasonable assurance financial statements are free of material misstatement.', topicTag: 'Auditing' },
    { questionId: 'q-tax-8', questionText: 'Calculate audit sample deviation rate when 3 errors are found in 50 sampled vouchers.', userAnswer: '6%', correctAnswer: '6%', isCorrect: true, explanation: '3 / 50 = 6%.', topicTag: 'Auditing' },
    { questionId: 'q-tax-9', questionText: 'Which market structure features a single seller with high barriers to entry?', userAnswer: 'Monopoly', correctAnswer: 'Monopoly', isCorrect: true, explanation: 'Monopolies have exclusive market control.', topicTag: 'Economics' },
    { questionId: 'q-tax-10', questionText: 'What constitutes taxable compensation income?', userAnswer: 'Only basic salary', correctAnswer: 'All remuneration for services including bonuses and allowances', isCorrect: false, explanation: 'Compensation income encompasses all benefits and remuneration unless de minimis.', topicTag: 'Taxation' },
  ],
  topicBreakdown: {
    'Financial Accounting': { total: 1, correct: 1, percentage: 85 },
    'Auditing': { total: 2, correct: 1, percentage: 72 },
    'Taxation': { total: 5, correct: 3, percentage: 60 },
    'Economics': { total: 2, correct: 2, percentage: 90 },
  },
  weakTopics: ['Taxation'],
  strongTopics: ['Economics', 'Financial Accounting'],
};

export const sampleAccountancyFlashcardDeck: FlashcardDeck = {
  id: 'deck-acct-core',
  materialId: sampleAccountancyMaterial.id,
  title: 'Accountancy Mastery: Core Rules & Standards',
  subject: 'Financial Accounting',
  topic: 'Accounting Principles & Equations',
  learningMode: 'accountancy',
  createdAt: 'September 23, 2026',
  cards: [
    {
      id: 'fc-acct-1',
      front: 'What is the fundamental accounting equation?',
      back: 'Assets = Liabilities + Owner\'s Equity (or Shareholders\' Equity). Every transaction maintains this equality.',
      topicTag: 'Accounting Principles',
      isKnown: true,
    },
    {
      id: 'fc-acct-2',
      front: 'What is depreciation?',
      back: 'The systematic allocation of the depreciable amount of a tangible asset over its estimated useful economic life. It represents cost allocation, not asset valuation.',
      topicTag: 'Financial Accounting',
      needsReview: true,
    },
    {
      id: 'fc-acct-3',
      front: 'What are the normal balances for ASSETS, EXPENSES, and WITHDRAWALS?',
      back: 'Debit (Dr.) balance. Increases are recorded as Debits; decreases are recorded as Credits (DEAD: Debits increase Expenses, Assets, Drawings).',
      topicTag: 'Bookkeeping',
      isKnown: true,
    },
    {
      id: 'fc-acct-4',
      front: 'What are the normal balances for LIABILITIES, EQUITY, and REVENUE?',
      back: 'Credit (Cr.) balance. Increases are recorded as Credits; decreases are recorded as Debits (CLER: Credits increase Liabilities, Equity, Revenue).',
      topicTag: 'Bookkeeping',
      isKnown: true,
    },
    {
      id: 'fc-acct-5',
      front: 'What is the formula for Ending Capital?',
      back: 'Ending Capital = Beginning Capital + Additional Investments + Net Income (or - Net Loss) - Owner\'s Withdrawals.',
      topicTag: 'Financial Statements',
      isKnown: true,
    },
    {
      id: 'fc-acct-6',
      front: 'What is a Contra-Asset account?',
      back: 'An asset account with a normal credit balance that offsets its companion asset account on the balance sheet (e.g., Accumulated Depreciation, Allowance for Doubtful Accounts).',
      topicTag: 'Financial Accounting',
      needsReview: true,
    },
  ],
};

export const sampleAccountancyActivities: ActivitiesCollection = {
  fillInTheBlanks: [
    {
      id: 'fib-acct-1',
      sentence: 'The fundamental accounting equation states that Assets = Liabilities + ______.',
      missingWord: 'Equity',
      hint: 'Represents owner residual claim.',
      options: ['Equity', 'Revenue', 'Expenses', 'Cash'],
    },
    {
      id: 'fib-acct-2',
      sentence: 'Accumulated Depreciation is classified as a ______ account with a normal credit balance.',
      missingWord: 'contra-asset',
      hint: 'Offsets the equipment asset.',
      options: ['contra-asset', 'liability', 'equity', 'expense'],
    },
  ],
  matching: [
    {
      id: 'm-acct-1',
      title: 'Match Account Titles with Normal Balances & Classes',
      pairs: [
        { left: 'Prepaid Rent', right: 'Asset (Normal Debit)' },
        { left: 'Unearned Service Fees', right: 'Liability (Normal Credit)' },
        { left: 'Accumulated Depreciation', right: 'Contra-Asset (Normal Credit)' },
        { left: 'Depreciation Expense', right: 'Expense (Normal Debit)' },
      ],
    },
  ],
  arrangeSteps: [
    {
      id: 'as-acct-1',
      title: 'Chronological Accounting Cycle Steps',
      description: 'Order the phases of the accounting cycle in their proper sequence:',
      steps: [
        '1. Analyze Business Source Documents',
        '2. Journalize Transactions in General Journal',
        '3. Post Journal Entries to General Ledger Accounts',
        '4. Prepare Unadjusted Trial Balance',
        '5. Journalize and Post Adjusting Entries',
        '6. Prepare Adjusted Trial Balance & Financial Statements',
      ],
    },
  ],
  identifyConcept: [
    {
      id: 'ic-acct-1',
      clue: 'I state that revenue must be recognized in the accounting period in which the performance obligation is satisfied, regardless of cash receipt timing.',
      answer: 'Revenue Recognition Principle',
      options: ['Revenue Recognition Principle', 'Cost Principle', 'Matching Principle', 'Going Concern Assumption'],
    },
  ],
  scenario: [
    {
      id: 'sc-acct-1',
      scenario: 'Genelle is preparing adjustments on December 31 for a client. The client paid ₱60,000 for a 1-year fire insurance policy on October 1, debiting Prepaid Insurance.',
      question: 'What is the adjusting entry on December 31?',
      solution: '3 months expired (Oct, Nov, Dec). Monthly premium = ₱60,000 / 12 = ₱5,000. 3 months = ₱15,000.\nDebit: Insurance Expense ₱15,000\nCredit: Prepaid Insurance ₱15,000.',
    },
  ],
  explainItYourself: [
    {
      id: 'eiy-acct-1',
      prompt: 'Explain to a business owner why depreciation does not represent a reserve of cash to replace machinery.',
      rubric: 'Must articulate that depreciation is cost allocation of historical expenditure across periods, not an accumulation of liquid cash assets.',
    },
  ],
};

export const sampleStudyGoals: StudyGoal[] = [
  {
    id: 'goal-1',
    title: 'Complete Financial Accounting Chapter 5',
    subject: 'Financial Accounting',
    targetValue: 100,
    currentValue: 80,
    unit: '%',
    deadline: 'This Friday',
    completed: false,
  },
  {
    id: 'goal-2',
    title: 'Score at least 80% on my Auditing practice quizzes',
    subject: 'Auditing',
    targetValue: 80,
    currentValue: 72,
    unit: '% Score',
    deadline: 'Midterms',
    completed: false,
  },
  {
    id: 'goal-3',
    title: 'Study for 1 hour every day',
    subject: 'Daily Routine',
    targetValue: 7,
    currentValue: 5,
    unit: 'Days/Week',
    deadline: 'Weekly Goal',
    completed: false,
  },
];

export const sampleDailyStudyPlan: DailyStudyPlan = {
  id: 'dsp-today',
  date: 'Today',
  availableHours: 2,
  subjects: ['Financial Accounting', 'Taxation'],
  examDate: 'October 15, 2026',
  blocks: [
    {
      id: 'b-1',
      durationMinutes: 30,
      subject: 'Financial Accounting',
      activityType: 'Concept Review',
      description: 'Review adjusting entries & contra-asset rules for PPE',
      completed: true,
    },
    {
      id: 'b-2',
      durationMinutes: 30,
      subject: 'Taxation',
      activityType: 'Problem Solving',
      description: 'Practice 12% Value-Added Tax calculations & input tax credits',
      completed: false,
    },
    {
      id: 'b-3',
      durationMinutes: 20,
      subject: 'Financial Accounting',
      activityType: 'Flashcards',
      description: 'Active spaced recall for journal entry normal balances',
      completed: false,
    },
    {
      id: 'b-4',
      durationMinutes: 30,
      subject: 'Taxation',
      activityType: 'Practice Quiz',
      description: 'Diagnostic exam practice questions on gross sales deductions',
      completed: false,
    },
    {
      id: 'b-5',
      durationMinutes: 10,
      subject: 'Taxation',
      activityType: 'Review Mistakes',
      description: 'Remediate missed questions and note tricky edge cases',
      completed: false,
    },
  ],
};

export const sampleHistory: StudySessionRecord[] = [
  {
    id: 'sess-genelle-1',
    materialId: sampleAccountancyMaterial.id,
    materialTitle: sampleAccountancyMaterial.title,
    type: 'Problem Solver',
    timestamp: 'Today at 3:40 PM',
    durationMinutes: 25,
    detail: 'Solved Equipment Depreciation & Straight-Line Journal Entry',
  },
  {
    id: 'sess-genelle-2',
    materialId: sampleAccountancyMaterial.id,
    materialTitle: sampleAccountancyMaterial.title,
    type: 'Quiz',
    timestamp: 'Today at 2:15 PM',
    durationMinutes: 18,
    detail: 'Completed Adjusting Entries Practice Quiz (Score: 5/6 · 83%)',
  },
  {
    id: 'sess-genelle-3',
    materialId: sampleAccountancyMaterial.id,
    materialTitle: sampleAccountancyMaterial.title,
    type: 'Reviewer',
    timestamp: 'Yesterday at 4:30 PM',
    durationMinutes: 35,
    detail: 'Studied Detailed Reviewer: Adjusting Entries & Equity Equation',
  },
  {
    id: 'sess-genelle-4',
    materialId: sampleAccountancyMaterial.id,
    materialTitle: sampleAccountancyMaterial.title,
    type: 'Flashcards',
    timestamp: 'Yesterday at 11:00 AM',
    durationMinutes: 15,
    detail: 'Reviewed 6 Accountancy Core Cards (5 Mastered, 1 Review)',
  },
];
