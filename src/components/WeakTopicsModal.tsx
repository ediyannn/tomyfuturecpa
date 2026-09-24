import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { QuizQuestion, WeakTopicRemedy } from '../types';
import { useToast } from './Toast';

interface WeakTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  subject: string;
  materialText: string;
}

export const WeakTopicsModal: React.FC<WeakTopicsModalProps> = ({
  isOpen,
  onClose,
  topic,
  subject,
  materialText,
}) => {
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [remedy, setRemedy] = useState<WeakTopicRemedy | null>(null);
  const [activeTab, setActiveTab] = useState<'remedy' | 'practice'>('remedy');

  // Practice state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    if (isOpen && topic) {
      loadTopicRemedy(topic);
    }
  }, [isOpen, topic]);

  const loadTopicRemedy = async (targetTopic: string) => {
    setIsLoading(true);
    setAnswers({});
    setShowExplanations(false);
    setActiveTab('remedy');

    try {
      const response = await fetch('/api/ai/weak-topic-remedy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakTopic: targetTopic,
          subject,
          materialText,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.remedy) {
        throw new Error(data.error || 'Failed to fetch remedy');
      }

      setRemedy({
        topic: targetTopic,
        subject,
        materialId: '',
        explanation: data.remedy.explanation,
        practiceQuestions: data.remedy.practiceQuestions || [],
      });
    } catch (err: any) {
      console.error('Error in loadTopicRemedy:', err);
      showToast('Loaded offline adaptive lesson for ' + targetTopic, 'info');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const scoreCount = remedy?.practiceQuestions.reduce((acc, q) => {
    const isCorrect =
      answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    return acc + (isCorrect ? 1 : 0);
  }, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* iOS/Android Pull-down Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-[#F8F6F6] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#800020]">
                Targeted Adaptive Remediation
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif-title">
                Review & Practice: {topic}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 touch-action-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('remedy')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'remedy'
                ? 'border-[#800020] text-[#800020]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Targeted Explanation</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'practice'
                ? 'border-[#800020] text-[#800020]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>5 Practice Drill Questions</span>
            {remedy && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-100 rounded-full font-mono">
                {remedy.practiceQuestions.length}
              </span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#800020]/20 border-t-[#800020] rounded-full animate-spin mx-auto" />
              <div className="text-sm font-semibold text-slate-800">
                AI analyzing your weak points in {topic}...
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generating clear explanations and 5 targeted drill questions strictly grounded in your
                material.
              </p>
            </div>
          ) : remedy ? (
            <>
              {/* TAB 1: EXPLANATION */}
              {activeTab === 'remedy' && (
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 font-medium">
                    🎯 <strong>Adaptive Goal:</strong> Master the operational mechanics of{' '}
                    <strong>{topic}</strong> so you don&apos;t lose points on upcoming exams.
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                    {remedy.explanation.split('\n\n').map((block, i) => {
                      if (block.startsWith('### ')) {
                        return (
                          <h3 key={i} className="text-base font-bold text-slate-900 font-serif-title">
                            {block.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (block.startsWith('#### ')) {
                        return (
                          <h4 key={i} className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                            {block.replace('#### ', '')}
                          </h4>
                        );
                      }
                      if (block.startsWith('```')) {
                        const code = block.replace(/```[a-z]*\n?/g, '').trim();
                        return (
                          <pre
                            key={i}
                            className="bg-slate-900 text-rose-100 p-4 rounded-xl font-mono-data text-xs overflow-x-auto border border-slate-800"
                          >
                            <code>{code}</code>
                          </pre>
                        );
                      }
                      return <p key={i}>{block}</p>;
                    })}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveTab('practice')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
                    >
                      <span>Take 5 Practice Drill Questions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: 5 PRACTICE QUESTIONS */}
              {activeTab === 'practice' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-slate-600">
                      Answer all 5 targeted questions to test your refined understanding:
                    </div>
                    {showExplanations && (
                      <div className="font-bold text-sm text-[#800020] font-mono-data">
                        Score: {scoreCount} / {remedy.practiceQuestions.length}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {remedy.practiceQuestions.map((q, idx) => {
                      const selected = answers[q.id];
                      const isCorrect =
                        selected?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border transition-all ${
                            showExplanations
                              ? isCorrect
                                ? 'border-emerald-300 bg-emerald-50/40'
                                : 'border-red-300 bg-red-50/40'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-800 mb-2">
                            {idx + 1}. {q.prompt}
                          </div>

                          <div className="space-y-1.5">
                            {q.options?.map((opt, optIdx) => {
                              const isOptionSelected = selected === opt;
                              return (
                                <button
                                  key={optIdx}
                                  disabled={showExplanations}
                                  onClick={() =>
                                    setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                                  }
                                  className={`w-full p-2.5 text-xs text-left rounded-lg border transition-all flex items-center justify-between ${
                                    isOptionSelected
                                      ? 'border-[#800020] bg-[#800020]/10 text-[#800020] font-semibold'
                                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isOptionSelected && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#800020]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {showExplanations && (
                            <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                              <div>
                                <strong className="text-slate-800">Correct: </strong>
                                <span className="text-emerald-700 font-semibold">
                                  {q.correctAnswer}
                                </span>
                              </div>
                              <div>{q.explanation}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission buttons */}
                  <div className="pt-2 flex items-center justify-between">
                    {showExplanations ? (
                      <button
                        onClick={() => {
                          setAnswers({});
                          setShowExplanations(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Practice Drill</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowExplanations(true);
                          showToast(`Drill complete! ${scoreCount} out of 5 correct.`, 'success');
                        }}
                        disabled={Object.keys(answers).length < remedy.practiceQuestions.length}
                        className={`ml-auto inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
                          Object.keys(answers).length < remedy.practiceQuestions.length
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-[#800020] hover:bg-[#5A0016]'
                        }`}
                      >
                        <span>Check Answers</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Unable to load targeted remedy. Please try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Close Drill
          </button>
        </div>
      </div>
    </div>
  );
};
