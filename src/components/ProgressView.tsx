import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { QuizAttempt } from '../types';

interface ProgressViewProps {
  metrics: {
    materialsCount: number;
    quizzesCompleted: number;
    averageScore: number;
    studyTimeHours: string;
    topicsMasteredCount: number;
    masteredTopicsList: string[];
    weakTopicsList: string[];
    topicStats: Record<string, { total: number; correct: number }>;
  };
  attempts: QuizAttempt[];
  onOpenWeakTopics: (topic: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  metrics,
  attempts,
  onOpenWeakTopics,
}) => {
  // Aggregate total questions answered and correct answers
  const totalQuestionsAnswered = attempts.reduce((sum, a) => sum + a.total, 0);
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);

  // Weekly study activity calendar
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeDays = [true, true, true, false, true, false, true]; // Sample activity distribution

  // Quiz score points for SVG line/bar chart
  const recentScorePoints = attempts.slice(-6).map((att) => att.percentage);
  const chartPoints = recentScorePoints.length > 0 ? recentScorePoints : [70, 75, 80, 85, 80];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
          Learning Analytics
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
          Performance & Mastery Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitor your retention curves, topic masteries, and active study time.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Average Score</span>
            <TrendingUp className="w-4 h-4 text-[#800020]" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono-data">
            {metrics.averageScore}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Consistent retention</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Questions Answered</span>
            <HelpCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono-data">
            {totalQuestionsAnswered}
          </div>
          <div className="text-[11px] text-slate-400">
            {totalCorrect} correct answers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Study Time</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono-data">
            {metrics.studyTimeHours}h
          </div>
          <div className="text-[11px] text-slate-400">Recorded active learning</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Mastered Topics</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono-data">
            {metrics.topicsMasteredCount}
          </div>
          <div className="text-[11px] text-slate-400">Accuracy &ge; 80%</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time (SVG Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif-title">
                Quiz Score Progression
              </h2>
              <div className="text-xs text-slate-400">Score percentage over recent attempts</div>
            </div>
            <span className="text-xs font-mono font-semibold text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded">
              Trend: Upward
            </span>
          </div>

          <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
            {chartPoints.map((pct, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[11px] font-mono font-bold text-slate-700 opacity-80 group-hover:opacity-100">
                  {pct}%
                </span>
                <div
                  className="w-full max-w-[42px] bg-[#800020] rounded-t-lg transition-all group-hover:bg-[#5A0016]"
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[10px] text-slate-400">Test {i + 1}</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Active recall intervals significantly improve retention stability across attempts.
          </div>
        </div>

        {/* Weekly Study Activity */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif-title">
                Weekly Study Habit
              </h2>
              <div className="text-xs text-slate-400">Sessions recorded over past 7 days</div>
            </div>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-7 gap-2 py-4">
            {weekDays.map((d, i) => {
              const studied = activeDays[i];
              return (
                <div key={d} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-14 rounded-xl flex items-center justify-center font-mono-data font-bold text-xs transition-all ${
                      studied
                        ? 'bg-[#800020] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {studied ? '✓' : '—'}
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">{d}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-[#F8F6F6] text-xs text-slate-600 flex items-center justify-between">
            <span>Current Study Streak:</span>
            <strong className="text-[#800020]">4 Consecutive Days 🔥</strong>
          </div>
        </div>
      </div>

      {/* Topic Breakdown: Strong vs Weak Topics */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-title">
              Topic Mastery Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Breakdown of accuracy and concept retention per individual syllabus module
            </p>
          </div>

          {metrics.weakTopicsList.length > 0 && (
            <button
              onClick={() => onOpenWeakTopics(metrics.weakTopicsList[0])}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
            >
              <span>Study Weak Topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {Object.keys(metrics.topicStats).length > 0 ? (
            Object.entries(metrics.topicStats).map(([topic, stat]) => {
              const percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              const isMastered = percentage >= 80;
              const isWeak = percentage < 70;

              return (
                <div
                  key={topic}
                  className="p-4 rounded-xl border border-slate-200 bg-[#F8F6F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{topic}</span>
                      {isMastered && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                          Mastered
                        </span>
                      )}
                      {isWeak && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800">
                          Needs Review
                        </span>
                      )}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-md">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isMastered ? 'bg-emerald-600' : isWeak ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-slate-500 font-mono-data">
                      {stat.correct} / {stat.total} ({percentage}%)
                    </div>
                    {isWeak && (
                      <button
                        onClick={() => onOpenWeakTopics(topic)}
                        className="text-xs font-bold text-[#800020] hover:underline whitespace-nowrap"
                      >
                        Remediate
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Take your first quiz to generate topic mastery metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
