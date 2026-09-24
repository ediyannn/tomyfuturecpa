import React from 'react';
import {
  Upload,
  BookOpen,
  HelpCircle,
  FileText,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Globe,
  Calculator,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  LearningMaterial,
  QuizAttempt,
  StudySessionRecord,
  UserProfile,
  LearningMode,
} from '../types';
import { ACCOUNTANCY_SUBJECTS, GENERAL_KNOWLEDGE_SUBJECTS } from '../data/sampleData';

interface DashboardOverviewProps {
  user: UserProfile;
  materials: LearningMaterial[];
  activeMaterial?: LearningMaterial;
  learningMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  metrics: {
    materialsCount: number;
    quizzesCompleted: number;
    averageScore: number;
    studyTimeHours: string;
    topicsMasteredCount: number;
    masteredTopicsList: string[];
    weakTopicsList: string[];
    topicStats?: Record<string, { total: number; correct: number }>;
  };
  recentAttempts: QuizAttempt[];
  recentSessions: StudySessionRecord[];
  onNavigate: (view: string) => void;
  onOpenUpload: () => void;
  onOpenWeakTopics: (topic: string) => void;
  onSelectMaterial: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  materials,
  activeMaterial,
  learningMode,
  onSelectMode,
  metrics,
  recentSessions,
  onNavigate,
  onOpenUpload,
  onOpenWeakTopics,
  onSelectMaterial,
}) => {
  // Determine time-of-day greeting (Sections 2 & 14 & 16)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const primaryWeakTopic = metrics.weakTopicsList[0] || 'Taxation';

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Personalized Hero Header (Requirements 2, 14, 16) */}
      <div className="rounded-3xl bg-white border border-[#E5E5E5] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#800020]/10 text-[#800020]">
              Personalized for Genelle
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Accountancy Student</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-title">
              {getGreeting()}, Genelle! 👋
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-medium mt-1">
              What would you like to study today?
            </p>
            <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020]/10 via-[#800020]/5 to-transparent border border-[#800020]/20 text-[#800020] text-xs sm:text-sm font-semibold shadow-2xs">
              <span>🌟 Future CPA Genelle: Every ledger balanced and concept mastered today brings you one step closer to wearing that CPA pin proudly!</span>
            </div>
          </div>

          {/* Two Prominent Options: Accountancy vs General Knowledge (Requirement 2 & 16) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Accountancy Option */}
            <div
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                learningMode === 'accountancy'
                  ? 'bg-gradient-to-br from-[#800020]/10 via-white to-white border-[#800020]/40 shadow-xs ring-1 ring-[#800020]/20'
                  : 'bg-[#F8F6F6] border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => onSelectMode('accountancy')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#800020] text-white flex items-center justify-center shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                {learningMode === 'accountancy' && (
                  <span className="text-[10px] font-bold text-[#800020] bg-white px-2 py-0.5 rounded-md border border-[#800020]/20">
                    Active Mode
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900">📚 Accountancy</h2>
              <p className="text-xs text-slate-600 mt-0.5 mb-3 leading-relaxed">
                Study your Accountancy subjects (Financial, Taxation, Auditing, Law, and Cost)
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode('accountancy');
                  onNavigate('solver');
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#800020] hover:bg-[#5A0016] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Study Accountancy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* General Knowledge Option */}
            <div
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                learningMode === 'general'
                  ? 'bg-gradient-to-br from-indigo-50 via-white to-white border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                  : 'bg-[#F8F6F6] border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => onSelectMode('general')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Globe className="w-5 h-5" />
                </div>
                {learningMode === 'general' && (
                  <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                    Active Mode
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900">🌎 General Knowledge</h2>
              <p className="text-xs text-slate-600 mt-0.5 mb-3 leading-relaxed">
                Explore and learn other topics: science, history, technology, and literature
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode('general');
                  onNavigate('materials');
                }}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore General Knowledge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick upload trigger banner */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500">
            <span>Have new textbook chapters or lecture slides?</span>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 font-semibold text-[#800020] hover:underline"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Learning Material Now</span>
            </button>
          </div>
        </div>

        {/* Decorative background accent */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#800020]/5 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* 2. Your Progress (Requirement 16) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Your Progress
          </h2>
          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
          >
            <span>Detailed Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Average Score */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Average Score</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-data">
              {metrics.quizzesCompleted > 0 ? `${metrics.averageScore}%` : '—'}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {metrics.quizzesCompleted > 0
                ? metrics.averageScore >= 80
                  ? 'Strong overall retention'
                  : 'Keep practicing to improve'
                : 'Take a quiz to calculate'}
            </div>
          </div>

          {/* Study Time */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Study Time</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-data">
              {parseFloat(metrics.studyTimeHours) > 0 ? `${metrics.studyTimeHours}h` : '0h 0m'}
            </div>
            <div className="text-[11px] text-slate-400">Total active learning</div>
          </div>

          {/* Quizzes Completed */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Quizzes Completed</span>
              <HelpCircle className="w-4 h-4 text-[#800020]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-data">
              {metrics.quizzesCompleted}
            </div>
            <div className="text-[11px] text-slate-400">Practice & exam sessions</div>
          </div>

          {/* Materials */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Materials</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-data">
              {metrics.materialsCount}
            </div>
            <div className="text-[11px] text-slate-400">Course modules uploaded</div>
          </div>
        </div>
      </div>

      {/* 3. Continue Studying & Recommended For You (Requirement 11 & 16) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Continue Studying Card */}
        {activeMaterial ? (
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Continue Studying</span>
                <span className="text-[10px] text-[#800020] font-semibold bg-[#800020]/10 px-2 py-0.5 rounded">
                  {activeMaterial.subject}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                {activeMaterial.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {activeMaterial.description || activeMaterial.analysis.summary}
              </p>
            </div>

            <button
              onClick={() => {
                onSelectMaterial(activeMaterial.id);
                onNavigate('reviewer');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 touch-action-manipulation"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border border-dashed border-slate-300 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Getting Started</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Fresh Slate
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Ready to study, Genelle?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your first textbook chapter, syllabus, or lecture slides to generate comprehensive reviewers and interactive quizzes.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onOpenUpload}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#800020] hover:bg-[#5A0016] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs touch-action-manipulation"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Material</span>
              </button>
              <button
                onClick={() => onNavigate('solver')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 touch-action-manipulation"
              >
                <Calculator className="w-3.5 h-3.5 text-[#800020]" />
                <span className="hidden sm:inline">Try Solver</span>
              </button>
            </div>
          </div>
        )}

        {/* Recommended for You / Study Focus (Requirement 11 & 16) */}
        {metrics.weakTopicsList.length > 0 ? (
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Recommended for You</span>
                </span>
                <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                  Study Focus
                </span>
              </div>
              <h3 className="text-base font-bold text-amber-950">
                {primaryWeakTopic} Practice Drill
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Based on your recent practice attempts, focus on strengthening your knowledge in{' '}
                <span className="font-bold text-amber-950">{primaryWeakTopic}</span>.
              </p>
            </div>

            <button
              onClick={() => onOpenWeakTopics(primaryWeakTopic)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#800020] hover:bg-[#5A0016] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs touch-action-manipulation"
            >
              <span>Practice {primaryWeakTopic}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#800020]/5 via-white to-white p-5 rounded-2xl border border-[#800020]/20 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#800020] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Recommended First Step</span>
                </span>
                <span className="text-[10px] text-[#800020] font-bold bg-[#800020]/10 px-2 py-0.5 rounded">
                  Accounting Practice
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Accounting Problem Solver
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work through depreciation schedules, debit/credit journal entries, or VAT computations with step-by-step guidance.
              </p>
            </div>

            <button
              onClick={() => onNavigate('solver')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#800020] hover:bg-[#5A0016] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs touch-action-manipulation"
            >
              <span>Open Problem Solver</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Quick Actions (Requirement 16) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={onOpenUpload}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#800020]/40 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
          >
            <div className="p-2.5 rounded-xl bg-[#800020]/10 text-[#800020] group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Upload Material</span>
          </button>

          <button
            onClick={() => onNavigate('solver')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#800020]/40 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 group-hover:scale-105 transition-transform">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Problem Solver</span>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#800020]/40 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
          >
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Generate Quiz</span>
          </button>

          <button
            onClick={() => onNavigate('flashcards')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#800020]/40 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
          >
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Create Flashcards</span>
          </button>

          <button
            onClick={() => onNavigate('study-plan')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#800020]/40 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
          >
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Daily Study Plan</span>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#800020]/40 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
          >
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* 5. Accountancy Curriculum Topics Quick Tray (Requirement 1) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#800020]" />
              <span>Accountancy Curriculum Subjects</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted BSA curriculum topics personalized for Genelle
            </p>
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            {ACCOUNTANCY_SUBJECTS.length} Subjects Available
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {ACCOUNTANCY_SUBJECTS.map((subj) => (
            <button
              key={subj}
              onClick={() => {
                onSelectMode('accountancy');
                onNavigate('quiz');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#F8F6F6] hover:bg-[#800020]/10 hover:text-[#800020] text-slate-700 font-medium border border-slate-200 transition-colors text-left flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#800020]" />
              <span>{subj}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Recent Study Activity Feed */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-serif-title">
            Recent Study Journal
          </h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-[#800020] hover:underline"
          >
            View All History
          </button>
        </div>

        {recentSessions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentSessions.slice(0, 4).map((sess) => (
              <div key={sess.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#800020]" />
                  <div>
                    <div className="font-semibold text-slate-800">{sess.detail}</div>
                    <div className="text-[11px] text-slate-400">{sess.materialTitle}</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>{sess.timestamp}</div>
                  <div>{sess.durationMinutes} min session</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No study sessions recorded yet. Start a problem solving session, quiz, or review to record your progress.
          </div>
        )}
      </div>
    </div>
  );
};
