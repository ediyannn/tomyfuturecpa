import React from 'react';
import {
  Search,
  Upload,
  Menu,
  GraduationCap,
  Sparkles,
  BookOpen,
  Globe,
  Calculator,
  Calendar,
} from 'lucide-react';
import { LearningMaterial, UserProfile, LearningMode } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeMaterial?: LearningMaterial;
  user: UserProfile;
  learningMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeMaterial,
  user,
  learningMode,
  onSelectMode,
  onOpenSearch,
  onOpenUpload,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Wordmark & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#800020] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-[#800020] font-serif-title">
                  StudyMate
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold text-[#800020] bg-[#800020]/10 px-1.5 py-0.5 rounded">
                  BSA
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block leading-none">
                For Genelle · Accountancy
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Mode Selector (Requirement 1 & 15: Accountancy | General Knowledge) */}
        <div className="flex items-center bg-[#F8F6F6] p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => onSelectMode('accountancy')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-all ${
              learningMode === 'accountancy'
                ? 'bg-white text-[#800020] shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Accountancy</span>
          </button>

          <button
            onClick={() => onSelectMode('general')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-all ${
              learningMode === 'general'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">General Knowledge</span>
            <span className="sm:hidden">General</span>
          </button>
        </div>

        {/* Search Shortcut */}
        <div className="flex-1 max-w-xs hidden xl:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-[#F8F6F6] hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search topics, standards...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] text-slate-500 bg-white rounded border border-slate-200 shadow-2xs font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Accounting Solver shortcut (if in Accountancy mode) */}
          {learningMode === 'accountancy' && (
            <button
              onClick={() => onNavigate('solver')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              title="Open Accounting Problem Solver"
            >
              <Calculator className="w-3.5 h-3.5 text-[#800020]" />
              <span>Problem Solver</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('study-plan')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
            title="Daily Study Plan"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>Study Plan</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Material</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Profile link */}
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
            title={`${user.name} - Accountancy Student`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#800020]/15 text-[#800020] flex items-center justify-center font-bold text-xs overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : 'G'
              )}
            </div>
            <div className="hidden 2xl:block text-left text-xs">
              <div className="font-semibold text-slate-800 leading-tight">{user.name || 'Genelle'}</div>
              <div className="text-[10px] text-slate-400">Accountancy</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
