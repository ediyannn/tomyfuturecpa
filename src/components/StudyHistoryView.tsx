import React, { useState } from 'react';
import {
  History,
  HelpCircle,
  BookOpen,
  Layers,
  Sparkles,
  Search,
  ArrowRight,
  Clock,
  Calendar,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Calculator,
  RotateCcw,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { StudySessionRecord, QuizAttempt } from '../types';

interface StudyHistoryViewProps {
  sessions: StudySessionRecord[];
  attempts: QuizAttempt[];
  onReviewAttempt: (attempt: QuizAttempt) => void;
  onNavigate: (view: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onDeleteSessions?: (sessionIds: string[]) => void;
  onClearAllSessions?: () => void;
}

export const StudyHistoryView: React.FC<StudyHistoryViewProps> = ({
  sessions,
  attempts,
  onReviewAttempt,
  onNavigate,
  onDeleteSession,
  onDeleteSessions,
  onClearAllSessions,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal dialog states
  const [itemToDelete, setItemToDelete] = useState<StudySessionRecord | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);

  const filteredSessions = sessions.filter((s) => {
    if (filterType !== 'all' && s.type.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.materialTitle.toLowerCase().includes(q) ||
        s.detail.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.timestamp.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Toggle selection for a single item
  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Select all filtered items
  const handleSelectAll = () => {
    if (selectedIds.length === filteredSessions.length && filteredSessions.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSessions.map((s) => s.id));
    }
  };

  // Execute single item deletion
  const confirmDeleteSingle = () => {
    if (itemToDelete && onDeleteSession) {
      onDeleteSession(itemToDelete.id);
      setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Execute batch deletion
  const confirmBatchDelete = () => {
    if (selectedIds.length > 0 && onDeleteSessions) {
      onDeleteSessions(selectedIds);
      setSelectedIds([]);
      setIsBatchDeleteModalOpen(false);
      setIsSelectionMode(false);
    }
  };

  // Execute clear all
  const confirmClearAll = () => {
    if (onClearAllSessions) {
      onClearAllSessions();
      setSelectedIds([]);
      setIsClearAllModalOpen(false);
      setIsSelectionMode(false);
    }
  };

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHours = (totalStudyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-16 sm:pb-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#800020] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Activity Records</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title mt-0.5">
            Study History & Activity Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, organize, or remove completed quizzes, reviewer readings, and study sessions.
          </p>
        </div>

        {sessions.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) setSelectedIds([]);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isSelectionMode
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{isSelectionMode ? 'Cancel Selection' : 'Select Records'}</span>
            </button>

            <button
              onClick={() => setIsClearAllModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-colors"
              title="Clear all history records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Total Entries</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{sessions.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Logged activities</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Time Tracked</div>
          <div className="text-xl font-bold text-[#800020] mt-0.5">
            {totalStudyMinutes >= 60 ? `${totalHours} hrs` : `${totalStudyMinutes} mins`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Study duration</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Quiz Attempts</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{attempts.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Evaluated quizzes</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Filtered Results</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{filteredSessions.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {filterType === 'all' ? 'All types' : filterType}
          </div>
        </div>
      </div>

      {/* Batch Selection Banner */}
      {isSelectionMode && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 font-medium hover:text-slate-200 transition-colors"
            >
              {selectedIds.length === filteredSessions.length && filteredSessions.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>
                {selectedIds.length === filteredSessions.length && filteredSessions.length > 0
                  ? 'Deselect All'
                  : `Select All (${filteredSessions.length})`}
              </span>
            </button>
            <span className="text-slate-500">|</span>
            <span className="font-semibold text-emerald-300">
              {selectedIds.length} of {filteredSessions.length} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedIds.length === 0}
              onClick={() => setIsBatchDeleteModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 disabled:hover:bg-rose-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
            <button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedIds([]);
              }}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Close selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Type filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'Quiz', 'Reviewer', 'Flashcards', 'Activities', 'Problem Solver', 'AI Tutor'].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-[#800020] text-white shadow-2xs'
                    : 'bg-[#F8F6F6] text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'All Activities' : type}
              </button>
            )
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material or detail..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#800020] bg-[#F8F6F6]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* History Feed */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] divide-y divide-slate-100 overflow-hidden shadow-2xs">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((sess) => {
            const isQuiz = sess.type === 'Quiz';
            const matchedAttempt = isQuiz ? attempts[0] : null;
            const isSelected = selectedIds.includes(sess.id);

            return (
              <div
                key={sess.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected ? 'bg-[#800020]/5' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Selection Checkbox */}
                  {isSelectionMode ? (
                    <button
                      type="button"
                      onClick={() => toggleSelectItem(sess.id)}
                      className="mt-1 text-slate-400 hover:text-[#800020] transition-colors shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#800020]" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[#800020]/10 text-[#800020] shrink-0 mt-0.5">
                      {sess.type === 'Quiz' && <HelpCircle className="w-5 h-5" />}
                      {sess.type === 'Reviewer' && <BookOpen className="w-5 h-5" />}
                      {sess.type === 'Flashcards' && <Layers className="w-5 h-5" />}
                      {sess.type === 'Activities' && <Sparkles className="w-5 h-5" />}
                      {sess.type === 'AI Tutor' && <Sparkles className="w-5 h-5" />}
                      {sess.type === 'Problem Solver' && <Calculator className="w-5 h-5" />}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {sess.detail}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {sess.type}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-medium text-slate-700">
                        Material: {sess.materialTitle}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{sess.durationMinutes} mins</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{sess.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isQuiz && matchedAttempt && (
                    <button
                      onClick={() => onReviewAttempt(matchedAttempt)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#800020] bg-[#800020]/8 hover:bg-[#800020]/15 rounded-lg transition-colors"
                    >
                      Review Attempt
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (sess.type === 'Problem Solver') onNavigate('solver');
                      else onNavigate(sess.type.toLowerCase());
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Open study tool"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Individual Delete Button */}
                  <button
                    onClick={() => setItemToDelete(sess)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete record from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <History className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="font-semibold text-slate-800">No matching activity records</div>
            <p>
              {searchQuery || filterType !== 'all'
                ? 'Try clearing the search query or selecting "All Activities".'
                : 'Complete quizzes, read reviewers, or study flashcards to build your study journal.'}
            </p>
          </div>
        )}
      </div>

      {/* 1. Modal: Confirm Single Item Deletion */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 font-serif-title">
                Remove from History?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove this record from your study history?
              </p>
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-left font-medium text-slate-700">
                <div>{itemToDelete.detail}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {itemToDelete.materialTitle} · {itemToDelete.timestamp}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setItemToDelete(null)}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSingle}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Confirm Batch Deletion */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 font-serif-title">
                Delete {selectedIds.length} Selected Records?
              </h3>
              <p className="text-xs text-slate-500">
                This will permanently remove the {selectedIds.length} selected activity records
                from your study history.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBatchDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors"
              >
                Delete {selectedIds.length} Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Confirm Clear All History */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 font-serif-title">
                Clear All Study History?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will clear all {sessions.length} activity entries from your study journal. Your
                learning materials, saved reviewers, and quizzes will not be affected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsClearAllModalOpen(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors"
              >
                Clear All History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudyHistoryView;
