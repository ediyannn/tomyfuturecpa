import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  HelpCircle,
  Layers,
  Sparkles,
  TrendingUp,
  History,
  Settings,
  X,
  GraduationCap,
  Calculator,
  Calendar,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { LearningMode } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  materialsCount: number;
  learningMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  accountancyOnly?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  materialsCount,
  learningMode,
  onSelectMode,
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'My Materials', icon: FolderOpen, badge: materialsCount },
    { id: 'solver', label: 'Problem Solver', icon: Calculator, accountancyOnly: true },
    { id: 'study-plan', label: 'Daily Study Plan', icon: Calendar },
    { id: 'reviewer', label: 'AI Reviewer', icon: BookOpen },
    { id: 'quiz', label: 'Quiz & Exam', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'activities', label: 'Activities', icon: Sparkles },
    { id: 'chat', label: 'AI Study Tutor', icon: MessageSquare },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'history', label: 'Study History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Desktop / Mobile Drawer Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-[#E5E5E5] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-10 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header for Mobile */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#800020] text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-[#800020] font-serif-title">
              StudyMate
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Mode Toggle inside Sidebar */}
        <div className="px-4 pt-3 pb-1">
          <div className="p-2 rounded-xl bg-[#F8F6F6] border border-slate-200 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Active Mode</span>
              <span className={`font-semibold ${learningMode === 'accountancy' ? 'text-[#800020]' : 'text-indigo-600'}`}>
                {learningMode === 'accountancy' ? 'Accountancy' : 'General'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold">
              <button
                onClick={() => onSelectMode('accountancy')}
                className={`py-1 px-1.5 rounded-lg text-center transition-all ${
                  learningMode === 'accountancy'
                    ? 'bg-white text-[#800020] shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                📚 Accountancy
              </button>
              <button
                onClick={() => onSelectMode('general')}
                className={`py-1 px-1.5 rounded-lg text-center transition-all ${
                  learningMode === 'general'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🌎 General
              </button>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Curriculum Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                  isActive
                    ? 'bg-[#800020]/10 text-[#800020] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#800020]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.accountancyOnly && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    BSA
                  </span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Personalized Student Badge */}
        <div className="p-3.5 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-[#800020]/5 border border-[#800020]/10 text-xs">
            <div className="font-bold text-slate-800 mb-0.5 flex items-center justify-between">
              <span>Genelle</span>
              <span className="text-[10px] font-semibold text-[#800020] bg-[#800020]/10 px-1.5 py-0.2 rounded">
                BSA Student
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              College of Business & Accountancy · PFRS & Auditing Focus
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 py-1 px-2 flex md:hidden items-center justify-around shadow-lg">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'solver', label: 'Solver', icon: Calculator },
          { id: 'study-plan', label: 'Plan', icon: Calendar },
          { id: 'quiz', label: 'Quiz', icon: HelpCircle },
          { id: 'flashcards', label: 'Cards', icon: Layers },
        ].map((btn) => {
          const Icon = btn.icon;
          const active = currentView === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => handleSelect(btn.id)}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
                active ? 'text-[#800020] font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
