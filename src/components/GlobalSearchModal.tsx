import React, { useState, useEffect } from 'react';
import { Search, FileText, HelpCircle, BookOpen, Layers, X, ArrowRight } from 'lucide-react';
import { LearningMaterial, Reviewer, Quiz, FlashcardDeck } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: LearningMaterial[];
  reviewers: Reviewer[];
  quizzes: Quiz[];
  flashcardDecks: FlashcardDeck[];
  onSelectResult: (view: string, id?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  materials,
  reviewers,
  quizzes,
  flashcardDecks,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedMaterials = q
    ? materials.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.topic.toLowerCase().includes(q) ||
          m.analysis.mainTopics.some((t) => t.toLowerCase().includes(q))
      )
    : materials.slice(0, 3);

  const matchedReviewers = q
    ? reviewers.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.topic.toLowerCase().includes(q)
      )
    : reviewers.slice(0, 2);

  const matchedQuizzes = q
    ? quizzes.filter(
        (qz) =>
          qz.title.toLowerCase().includes(q) ||
          qz.subject.toLowerCase().includes(q) ||
          qz.topic.toLowerCase().includes(q)
      )
    : quizzes.slice(0, 2);

  const matchedFlashcards = q
    ? flashcardDecks.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.cards.some((c) => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q))
      )
    : flashcardDecks.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden mt-2 sm:mt-0">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 sm:py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search learning materials, topics, reviewers, quizzes, flashcards..."
            className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="sm:hidden text-xs font-semibold text-[#800020] px-2 py-1"
          >
            Cancel
          </button>
        </div>

        {/* Results Section */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Materials */}
          {matchedMaterials.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Materials & Topics
              </div>
              <div className="space-y-1">
                {matchedMaterials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectResult('materials', m.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#800020]/5 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#800020]/10 text-[#800020] rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-[#800020]">
                          {m.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.subject} · {m.topic}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#800020] transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reviewers */}
          {matchedReviewers.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Study Reviewers
              </div>
              <div className="space-y-1">
                {matchedReviewers.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectResult('reviewer', r.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#800020]/5 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-[#800020]">
                          {r.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {r.reviewerType} · {r.difficulty}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#800020] transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {matchedQuizzes.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Quizzes & Assessments
              </div>
              <div className="space-y-1">
                {matchedQuizzes.map((qz) => (
                  <button
                    key={qz.id}
                    onClick={() => {
                      onSelectResult('quiz', qz.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#800020]/5 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-[#800020]">
                          {qz.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {qz.questionCount} Questions · {qz.difficulty}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#800020] transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flashcards */}
          {matchedFlashcards.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Flashcard Decks
              </div>
              <div className="space-y-1">
                {matchedFlashcards.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectResult('flashcards', f.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#800020]/5 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-[#800020]">
                          {f.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {f.cards.length} Flashcards
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#800020] transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedMaterials.length === 0 &&
            matchedReviewers.length === 0 &&
            matchedQuizzes.length === 0 &&
            matchedFlashcards.length === 0 && (
              <div className="py-10 text-center text-slate-500 text-sm">
                No matching results found for &ldquo;{query}&rdquo;.
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Search grounded in your uploaded materials</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
