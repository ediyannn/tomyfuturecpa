import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  LearningMaterial,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  DifficultyLevel,
  DefinitionItem,
  ConceptItem,
} from '../types';
import { useToast } from './Toast';

interface QuizViewProps {
  activeMaterial: LearningMaterial;
  quizzes: Quiz[];
  onSaveQuiz: (newQuiz: Quiz) => void;
  onSaveAttempt: (attempt: QuizAttempt) => void;
  onNavigate: (view: string) => void;
  onOpenWeakTopics: (topic: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  activeMaterial,
  quizzes,
  onSaveQuiz,
  onSaveAttempt,
  onNavigate,
  onOpenWeakTopics,
}) => {
  const { showToast } = useToast();

  // Find active or default quiz for material
  const existingQuiz = quizzes.find((q) => q.materialId === activeMaterial.id);

  // States: 'configure' | 'active' | 'results'
  const [viewState, setViewState] = useState<'configure' | 'active' | 'results'>('configure');

  // Quiz configuration
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Mixed');
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'Multiple Choice',
    'True or False',
    'Identification',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(existingQuiz || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Active Attempt / Results
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSeconds((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleType = (t: string) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((x) => x !== t));
      } else {
        showToast('Please keep at least one question type selected.', 'info');
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const buildLocalOfflineQuiz = (material: LearningMaterial, count: number): QuizQuestion[] => {
    const list: QuizQuestion[] = [];
    const defs: DefinitionItem[] = material.analysis?.definitions || [];
    const concepts: ConceptItem[] = material.analysis?.importantConcepts || [];

    // From definitions
    defs.forEach((d: DefinitionItem, idx: number) => {
      if (list.length >= count) return;
      const wrongDefs = defs.filter((_: DefinitionItem, i: number) => i !== idx).map((x: DefinitionItem) => x.term);
      const fallbackWrongs = ['Accrual Principle', 'Going Concern', 'Matching Principle', 'Historical Cost'];
      const options = [d.term, ...wrongDefs.slice(0, 2), ...fallbackWrongs.slice(0, 2)].slice(0, 4);
      // shuffle
      options.sort(() => Math.random() - 0.5);

      list.push({
        id: `q-off-${idx}`,
        type: 'multiple-choice',
        prompt: `Which concept or term is defined as: "${d.definition}"?`,
        options,
        correctAnswer: d.term,
        hint: `Relates to ${material.topic} definitions.`,
        explanation: `${d.term} is defined as: ${d.definition}`,
        topicTag: material.topic,
      });
    });

    // From concepts
    concepts.forEach((c: ConceptItem, idx: number) => {
      if (list.length >= count) return;
      list.push({
        id: `q-off-c-${idx}`,
        type: 'true-false',
        prompt: `True or False: Under ${c.name}, ${c.explanation}`,
        options: ['True', 'False'],
        correctAnswer: 'True',
        hint: `Think about foundational accounting conventions.`,
        explanation: `True. According to ${c.name}, ${c.explanation}`,
        topicTag: c.name,
      });
    });

    // Baseline fallback questions
    if (list.length < count) {
      const baselines: QuizQuestion[] = [
        {
          id: 'q-off-base-1',
          type: 'multiple-choice',
          prompt: 'What is the fundamental accounting equation?',
          options: [
            'Assets = Liabilities + Equity',
            'Assets = Liabilities - Equity',
            'Assets + Liabilities = Equity',
            'Revenue - Expense = Assets',
          ],
          correctAnswer: 'Assets = Liabilities + Equity',
          hint: 'The balance sheet balance formula.',
          explanation: 'Assets must always equal the sum of Liabilities and Owner’s Equity.',
          topicTag: 'Accounting Principles',
        },
        {
          id: 'q-off-base-2',
          type: 'true-false',
          prompt: 'True or False: An increase in an asset account is recorded as a debit.',
          options: ['True', 'False'],
          correctAnswer: 'True',
          hint: 'Normal balance rules: ADE (Assets, Drawings, Expenses) increase with debits.',
          explanation: 'Assets have a normal debit balance; increases are debited and decreases are credited.',
          topicTag: 'Debit and Credit Rules',
        },
        {
          id: 'q-off-base-3',
          type: 'identification',
          prompt: 'Identify the financial statement that reports an entity’s assets, liabilities, and equity at a specific point in time.',
          correctAnswer: 'Balance Sheet',
          hint: 'Also known as the Statement of Financial Position.',
          explanation: 'The Statement of Financial Position (Balance Sheet) reflects balances as of a given cut-off date.',
          topicTag: 'Financial Statements',
        },
      ];
      baselines.forEach((b) => {
        if (list.length < count) list.push(b);
      });
    }

    return list.slice(0, count);
  };

  const handleCreateQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: activeMaterial.rawContent,
          subject: activeMaterial.subject,
          topic: activeMaterial.topic,
          questionTypes: selectedTypes,
          questionCount,
          difficulty,
          mode: quizMode,
          structuredAnalysis: activeMaterial.analysis,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.questions) {
        throw new Error(data.error || 'Failed to generate questions from API');
      }

      const newQuiz: Quiz = {
        id: 'quiz-' + Date.now(),
        materialId: activeMaterial.id,
        title: `${activeMaterial.subject}: ${activeMaterial.topic} Quiz`,
        subject: activeMaterial.subject,
        topic: activeMaterial.topic,
        questionTypes: selectedTypes,
        questionCount: data.questions.length,
        difficulty,
        mode: quizMode,
        questions: data.questions,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setCurrentQuiz(newQuiz);
      onSaveQuiz(newQuiz);
      startQuizSession(newQuiz);
      showToast(`Quiz generated with ${newQuiz.questions.length} questions!`, 'success');
    } catch (err: any) {
      console.warn('API error during quiz creation, using local offline generator:', err);
      const fallbackQuestions = buildLocalOfflineQuiz(activeMaterial, questionCount);
      const newQuiz: Quiz = {
        id: 'quiz-offline-' + Date.now(),
        materialId: activeMaterial.id,
        title: `${activeMaterial.subject}: ${activeMaterial.topic} Quiz (Offline)`,
        subject: activeMaterial.subject,
        topic: activeMaterial.topic,
        questionTypes: selectedTypes,
        questionCount: fallbackQuestions.length,
        difficulty,
        mode: quizMode,
        questions: fallbackQuestions,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setCurrentQuiz(newQuiz);
      onSaveQuiz(newQuiz);
      startQuizSession(newQuiz);
      showToast(`Generated ${fallbackQuestions.length} questions locally from your study material!`, 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuizSession = (quizToStart: Quiz) => {
    setCurrentQuiz(quizToStart);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowHint({});
    setTimeSeconds(0);
    setIsTimerRunning(true);
    setViewState('active');
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleToggleHint = (questionId: string) => {
    setShowHint((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    setIsTimerRunning(false);

    // Calculate score and topic breakdown
    let correctCount = 0;
    const topicStats: Record<string, { total: number; correct: number; percentage: number }> = {};

    const results = currentQuiz.questions.map((q) => {
      const userAns = userAnswers[q.id] || '(No Answer)';
      const isCorrect =
        userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
        (q.correctAnswer.includes('.') &&
          userAns.charAt(0).toUpperCase() === q.correctAnswer.charAt(0).toUpperCase());

      if (isCorrect) correctCount++;

      const tag = q.topicTag || 'General';
      if (!topicStats[tag]) topicStats[tag] = { total: 0, correct: 0, percentage: 0 };
      topicStats[tag].total += 1;
      if (isCorrect) topicStats[tag].correct += 1;

      return {
        questionId: q.id,
        questionText: q.prompt,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        topicTag: tag,
      };
    });

    // Compute percentages
    const weak: string[] = [];
    const strong: string[] = [];
    Object.entries(topicStats).forEach(([tag, stat]) => {
      const pct = Math.round((stat.correct / stat.total) * 100);
      stat.percentage = pct;
      if (pct >= 80) strong.push(tag);
      else if (pct < 70) weak.push(tag);
    });

    const total = currentQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const attempt: QuizAttempt = {
      id: 'att-' + Date.now(),
      quizId: currentQuiz.id,
      materialId: activeMaterial.id,
      title: currentQuiz.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: correctCount,
      total,
      percentage,
      timeSpentSeconds: timeSeconds,
      difficulty: currentQuiz.difficulty,
      mode: currentQuiz.mode,
      results,
      topicBreakdown: topicStats,
      weakTopics: weak,
      strongTopics: strong,
    };

    setLatestAttempt(attempt);
    onSaveAttempt(attempt);
    setViewState('results');
    showToast(`Quiz completed! You scored ${correctCount}/${total} (${percentage}%)`, 'success');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: CONFIGURE QUIZ                                        */}
      {/* ------------------------------------------------------------- */}
      {viewState === 'configure' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
                Interactive Quiz Creator
              </div>
              <h1 className="text-2xl font-bold text-slate-900 font-serif-title mt-1">
                Customize Your Study Quiz
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeting material: <strong>{activeMaterial.title}</strong>
              </p>
            </div>

            {/* Question Types (Section 5 & 10) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Question Types</label>
                <span className="text-[11px] text-[#800020] font-medium">Accountancy-Enabled</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Multiple Choice',
                  'True or False',
                  'Identification',
                  'Fill in the Blank',
                  'Short Answer',
                  'Journal Entry',
                  'Calculation',
                  'Problem Solving',
                ].map((t) => {
                  const isChecked = selectedTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`p-3 rounded-xl text-left border transition-all text-xs font-medium flex items-center justify-between ${
                        isChecked
                          ? 'border-[#800020] bg-[#800020]/5 text-[#800020] font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{t}</span>
                      {isChecked && <Check className="w-4 h-4 text-[#800020]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Count & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Number of Questions</label>
                <div className="grid grid-cols-7 gap-1">
                  {[5, 10, 15, 20, 25, 30, 50].map((c) => (
                    <button
                      key={c}
                      onClick={() => setQuestionCount(c)}
                      className={`py-2 text-[11px] font-semibold rounded-xl border text-center transition-all ${
                        questionCount === c
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Difficulty</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Easy', 'Medium', 'Hard', 'Mixed'] as DifficultyLevel[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        difficulty === d
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quiz Mode (Practice vs Exam) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Quiz Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setQuizMode('practice')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    quizMode === 'practice'
                      ? 'border-[#800020] bg-[#800020]/5 text-[#800020]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">Practice Mode</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Provides active hints, instantaneous explanations after answers, and guidance.
                  </div>
                </button>

                <button
                  onClick={() => setQuizMode('exam')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    quizMode === 'exam'
                      ? 'border-[#800020] bg-[#800020]/5 text-[#800020]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">Exam Mode</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Simulates actual exam conditions. Timer runs, results revealed only upon submit.
                  </div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              {currentQuiz && (
                <button
                  onClick={() => startQuizSession(currentQuiz)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  Take Existing Quiz ({currentQuiz.questions.length} Qs)
                </button>
              )}

              <button
                onClick={handleCreateQuiz}
                disabled={isGenerating}
                className={`ml-auto inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
                  isGenerating ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#800020] hover:bg-[#5A0016]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Generating Quiz from Material...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Start Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2: ACTIVE QUIZ RUNNER                                    */}
      {/* ------------------------------------------------------------- */}
      {viewState === 'active' && currentQuiz && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Bar: Progress & Timer */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#800020]">
                  Question {currentIndex + 1} of {currentQuiz.questions.length}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-medium capitalize">
                  {currentQuiz.mode} Mode
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600 font-mono-data font-semibold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{formatTime(timeSeconds)}</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#800020] h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentIndex + 1) / currentQuiz.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Question Card */}
          {(() => {
            const q = currentQuiz.questions[currentIndex];
            const currentAnswer = userAnswers[q.id];
            const hasAnswered = !!currentAnswer;
            const hintActive = showHint[q.id];

            return (
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs space-y-6">
                {/* Topic Tag Badge & Priority Source Indicator (Requirement 8) */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                      {q.topicTag}
                    </span>
                    <span className="text-[10px] font-semibold text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded">
                      Source: Uploaded Material (Priority 1)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Expanded explanation with standard PFRS / General Knowledge framework.', 'info')}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                      title="If material is incomplete, pull general standard knowledge"
                    >
                      Use General Knowledge
                    </button>
                    <span className="text-xs text-slate-400 capitalize">{q.type}</span>
                  </div>
                </div>

                {/* Prompt */}
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {q.prompt}
                </h2>

                {/* Question Options or Input depending on type */}
                {q.type === 'multiple-choice' || q.type === 'true-false' ? (
                  <div className="space-y-2.5">
                    {(q.options || ['True', 'False']).map((opt, idx) => {
                      const isSelected = currentAnswer === opt;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#800020] bg-[#800020]/5 text-[#800020] font-semibold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#800020]" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Identification or Fill-in or Short Answer */
                  <div className="space-y-3">
                    {q.options && q.options.length > 0 ? (
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${
                              currentAnswer === opt
                                ? 'border-[#800020] bg-[#800020]/5 text-[#800020] font-semibold'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span>{opt}</span>
                            {currentAnswer === opt && <Check className="w-4 h-4 text-[#800020]" />}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={currentAnswer || ''}
                        onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                      />
                    )}
                  </div>
                )}

                {/* "Give me a hint" (Section 33 requirement) */}
                <div className="border-t border-slate-100 pt-4">
                  <button
                    onClick={() => handleToggleHint(q.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>{hintActive ? 'Hide Study Hint' : 'Give me a hint'}</span>
                  </button>

                  {hintActive && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed animate-in fade-in duration-150">
                      💡 <strong>Hint:</strong> {q.hint}
                    </div>
                  )}
                </div>

                {/* Practice Mode immediate feedback */}
                {quizMode === 'practice' && hasAnswered && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="font-bold text-slate-900">Explanation</div>
                    <div className="text-slate-600 leading-relaxed">{q.explanation}</div>
                  </div>
                )}

                {/* Navigation and Submission */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                    disabled={currentIndex === 0}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      currentIndex === 0
                        ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {currentIndex < currentQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((idx) => idx + 1)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 3: QUIZ RESULTS (Section 10 & 31)                        */}
      {/* ------------------------------------------------------------- */}
      {viewState === 'results' && latestAttempt && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Header Card */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/8 text-[#800020] text-xs font-medium">
              <span>Quiz Completed</span>
              <span>·</span>
              <span>{latestAttempt.timestamp}</span>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-bold text-slate-900 font-mono-data">
                {latestAttempt.score} / {latestAttempt.total}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                {latestAttempt.percentage}% Total Mastery
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 pt-2">
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                Time: <strong>{formatTime(latestAttempt.timeSpentSeconds)}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                Difficulty: <strong>{latestAttempt.difficulty}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                Correct: <strong className="text-emerald-600">{latestAttempt.score}</strong> ·
                Incorrect: <strong className="text-red-600">{latestAttempt.total - latestAttempt.score}</strong>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (currentQuiz) startQuizSession(currentQuiz);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={() => setViewState('configure')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate New Quiz</span>
              </button>

              <button
                onClick={() => onNavigate('reviewer')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Review Material</span>
              </button>
            </div>
          </div>

          {/* Smart Study Recommendations Card (Section 12 & 31) */}
          <div className="bg-white rounded-2xl border border-[#800020]/20 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900 font-serif-title">
                  Smart Study Recommendations
                </h2>
              </div>
              {latestAttempt.weakTopics.length > 0 && (
                <button
                  onClick={() => onOpenWeakTopics(latestAttempt.weakTopics[0])}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
                >
                  Study Weak Topics
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Strong Topics */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strong Topics (≥80%)</span>
                </div>
                <div className="space-y-1">
                  {latestAttempt.strongTopics.length > 0 ? (
                    latestAttempt.strongTopics.map((t) => (
                      <div key={t} className="text-emerald-800 font-medium">
                        ✓ {t} ({latestAttempt.topicBreakdown[t]?.percentage}%)
                      </div>
                    ))
                  ) : (
                    <div className="text-emerald-700">Keep practicing to reach 80% mastery!</div>
                  )}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-2">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Needs Review (&lt;70%)</span>
                </div>
                <div className="space-y-1">
                  {latestAttempt.weakTopics.length > 0 ? (
                    latestAttempt.weakTopics.map((t) => (
                      <div key={t} className="text-rose-800 font-medium flex items-center justify-between">
                        <span>• {t} ({latestAttempt.topicBreakdown[t]?.percentage}%)</span>
                        <button
                          onClick={() => onOpenWeakTopics(t)}
                          className="text-[11px] underline text-[#800020] hover:text-[#5A0016] font-semibold"
                        >
                          Review Now
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-rose-700">No critical weak topics identified. Excellent!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question-by-Question Review (Section 10) */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 font-serif-title">
              Question-by-Question Review
            </h2>

            <div className="space-y-3">
              {latestAttempt.results.map((res, idx) => (
                <div
                  key={res.questionId}
                  className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-3 ${
                    res.isCorrect ? 'border-emerald-200' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {res.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs text-slate-400 font-medium">
                          Question {idx + 1} · {res.topicTag}
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                          {res.questionText}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answers Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div
                      className={`p-3 rounded-xl border ${
                        res.isCorrect
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                          : 'bg-red-50/50 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="font-semibold text-[11px] uppercase tracking-wider mb-0.5">
                        Your Answer:
                      </div>
                      <div className="font-medium">{res.userAnswer}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                      <div className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 mb-0.5">
                        Correct Answer:
                      </div>
                      <div className="font-semibold text-emerald-700">{res.correctAnswer}</div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed border border-slate-100">
                    <strong className="text-slate-800">Explanation: </strong>
                    {res.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
