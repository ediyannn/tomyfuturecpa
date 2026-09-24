import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Layers,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { DailyStudyPlan, StudyGoal, StudyPlanBlock } from '../types';
import { ACCOUNTANCY_SUBJECTS } from '../data/sampleData';
import { useToast } from './Toast';

interface DailyStudyPlanViewProps {
  plan: DailyStudyPlan;
  goals: StudyGoal[];
  onSavePlan: (plan: DailyStudyPlan) => void;
  onSaveGoals: (goals: StudyGoal[]) => void;
  onNavigate: (view: string) => void;
}

export const DailyStudyPlanView: React.FC<DailyStudyPlanViewProps> = ({
  plan,
  goals,
  onSavePlan,
  onSaveGoals,
  onNavigate,
}) => {
  const { showToast } = useToast();

  const [availableHours, setAvailableHours] = useState(plan.availableHours || 2);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    plan.subjects || ['Financial Accounting', 'Taxation']
  );
  const [examDate, setExamDate] = useState(plan.examDate || 'October 15, 2026');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // New goal input states
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalSubject, setNewGoalSubject] = useState('Financial Accounting');
  const [newGoalTarget, setNewGoalTarget] = useState(100);
  const [newGoalUnit, setNewGoalUnit] = useState('%');
  const [newGoalDeadline, setNewGoalDeadline] = useState('This Week');
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Toggle study block completion
  const handleToggleBlock = (blockId: string) => {
    const updatedBlocks = plan.blocks.map((b) =>
      b.id === blockId ? { ...b, completed: !b.completed } : b
    );
    const updatedPlan = { ...plan, blocks: updatedBlocks };
    onSavePlan(updatedPlan);

    const toggled = updatedBlocks.find((b) => b.id === blockId);
    if (toggled?.completed) {
      showToast(`Completed "${toggled.description}"! Great momentum, Genelle!`, 'success');
    }
  };

  // Regenerate plan with AI
  const handleRegeneratePlan = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/ai/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableHours,
          subjects: selectedSubjects,
          examDate,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        onSavePlan(data.plan);
        showToast('Generated fresh daily study schedule!', 'success');
      } else {
        showToast('Could not generate plan, using default structure.', 'info');
      }
    } catch {
      showToast('Error updating plan.', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Toggle goal completion
  const handleToggleGoal = (goalId: string) => {
    const updated = goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            completed: !g.completed,
            currentValue: !g.completed ? g.targetValue : Math.round(g.targetValue * 0.7),
          }
        : g
    );
    onSaveGoals(updated);
  };

  // Add new goal
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: StudyGoal = {
      id: 'goal-' + Date.now(),
      title: newGoalTitle.trim(),
      subject: newGoalSubject,
      targetValue: newGoalTarget,
      currentValue: 0,
      unit: newGoalUnit,
      deadline: newGoalDeadline,
      completed: false,
    };

    const updated = [...goals, newGoal];
    onSaveGoals(updated);
    setNewGoalTitle('');
    setShowAddGoal(false);
    showToast('New study goal added!', 'success');
  };

  const handleDeleteGoal = (goalId: string) => {
    onSaveGoals(goals.filter((g) => g.id !== goalId));
  };

  const completedBlocksCount = plan.blocks.filter((b) => b.completed).length;
  const planProgressPct = Math.round((completedBlocksCount / Math.max(plan.blocks.length, 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
            Time Management & Objectives
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
            Genelle's Daily Study Plan & Goals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize high-yield study blocks based on your available time and track progress toward upcoming Accountancy milestones.
          </p>
        </div>

        {/* Available Hours Pill */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs self-start sm:self-auto">
          <Clock className="w-4 h-4 text-[#800020]" />
          <span className="font-semibold text-slate-700">Target Session:</span>
          <span className="font-bold text-[#800020]">{availableHours} Hours Today</span>
        </div>
      </div>

      {/* Two Column Layout: Plan on Left, Goals on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Time-Blocked Daily Plan */}
        <div className="lg:col-span-2 space-y-5">
          {/* Plan Settings Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#800020]" />
                <span>Today's Time Budget & Subject Focus</span>
              </h2>

              <button
                onClick={handleRegeneratePlan}
                disabled={isRegenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#5A0016] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isRegenerating ? 'Structuring...' : 'Re-optimize Schedule'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Available hours selector */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Available Study Time:
                </label>
                <select
                  value={availableHours}
                  onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-[#F8F6F6] text-xs font-medium focus:outline-none focus:border-[#800020]"
                >
                  <option value={1}>1 Hour (Quick Review)</option>
                  <option value={1.5}>1.5 Hours (Standard)</option>
                  <option value={2}>2 Hours (Recommended)</option>
                  <option value={3}>3 Hours (Deep Focus)</option>
                  <option value={4}>4 Hours (Exam Bootcamp)</option>
                </select>
              </div>

              {/* Primary Focus Subject */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Primary Subject:
                </label>
                <select
                  value={selectedSubjects[0]}
                  onChange={(e) =>
                    setSelectedSubjects([e.target.value, selectedSubjects[1] || 'Taxation'])
                  }
                  className="w-full p-2 rounded-xl border border-slate-200 bg-[#F8F6F6] text-xs font-medium focus:outline-none focus:border-[#800020]"
                >
                  {ACCOUNTANCY_SUBJECTS.slice(0, 8).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Target Exam Date */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Target Exam Date:
                </label>
                <input
                  type="text"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  placeholder="e.g. Midterms Oct 15"
                  className="w-full p-2 rounded-xl border border-slate-200 bg-[#F8F6F6] text-xs font-medium focus:outline-none focus:border-[#800020]"
                />
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Daily Session Progress</span>
                <span className="font-bold text-[#800020]">
                  {completedBlocksCount} of {plan.blocks.length} blocks ({planProgressPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#800020] rounded-full transition-all duration-300"
                  style={{ width: `${planProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Time Blocks List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sequential Study Schedule:
            </h3>

            {plan.blocks.map((block, idx) => (
              <div
                key={block.id}
                className={`p-4 rounded-2xl border transition-all shadow-2xs flex items-start gap-3.5 ${
                  block.completed
                    ? 'bg-emerald-50/50 border-emerald-200 opacity-90'
                    : 'bg-white border-[#E5E5E5] hover:border-slate-300'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleBlock(block.id)}
                  className="mt-0.5 text-slate-400 hover:text-[#800020] transition-colors shrink-0"
                >
                  {block.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] text-[10px] font-bold">
                      {block.durationMinutes} min
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {block.subject}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">·</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {block.activityType}
                    </span>
                  </div>

                  <p
                    className={`text-xs font-semibold ${
                      block.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {block.description}
                  </p>
                </div>

                {/* Quick Launch Action Button */}
                <button
                  onClick={() => {
                    if (block.activityType === 'Concept Review') onNavigate('reviewer');
                    else if (block.activityType === 'Flashcards') onNavigate('flashcards');
                    else if (block.activityType === 'Practice Quiz') onNavigate('quiz');
                    else if (block.activityType === 'Problem Solving') onNavigate('solver');
                    else onNavigate('quiz');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Study Goals (Requirement 13) */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#800020]" />
                <span>Genelle's Study Goals</span>
              </h2>

              <button
                onClick={() => setShowAddGoal(!showAddGoal)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Add New Goal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Goal Drawer */}
            {showAddGoal && (
              <form onSubmit={handleCreateGoal} className="p-3.5 rounded-xl bg-[#F8F6F6] border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-800">New Academic Goal</div>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Master Cost Accounting Overhead Allocation"
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs"
                  required
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newGoalSubject}
                    onChange={(e) => setNewGoalSubject(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    {ACCOUNTANCY_SUBJECTS.slice(0, 8).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    placeholder="Deadline / Term"
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#800020] text-white rounded-lg font-semibold text-xs"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            )}

            {/* Goals List */}
            <div className="space-y-3">
              {goals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentValue / Math.max(goal.targetValue, 1)) * 100));

                return (
                  <div
                    key={goal.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      goal.completed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-[#F8F6F6] border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#800020] bg-white px-2 py-0.5 rounded border border-slate-200">
                            {goal.subject}
                          </span>
                          {goal.deadline && (
                            <span className="text-[10px] text-slate-400">
                              {goal.deadline}
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-xs font-bold leading-snug ${
                            goal.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {goal.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-slate-300 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Progress Bar & Value */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold text-slate-800">
                          {goal.currentValue} / {goal.targetValue} {goal.unit} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            goal.completed ? 'bg-emerald-600' : 'bg-[#800020]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Complete button */}
                    <button
                      onClick={() => handleToggleGoal(goal.id)}
                      className="mt-2 text-[11px] font-semibold text-[#800020] hover:underline flex items-center gap-1"
                    >
                      {goal.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
