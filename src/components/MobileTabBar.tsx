import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Calculator,
  MessageSquare,
  Menu,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { LearningMode } from '../types';

interface MobileTabBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenMenu: () => void;
  materialsCount: number;
  learningMode: LearningMode;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentView,
  onNavigate,
  onOpenMenu,
  materialsCount,
  learningMode,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'materials',
      label: 'Materials',
      icon: FolderOpen,
      badge: materialsCount > 0 ? materialsCount : undefined,
    },
    {
      id: learningMode === 'accountancy' ? 'solver' : 'reviewer',
      label: learningMode === 'accountancy' ? 'Solver' : 'Reviewer',
      icon: learningMode === 'accountancy' ? Calculator : BookOpen,
      isSpecial: true,
    },
    {
      id: 'chat',
      label: 'AI Tutor',
      icon: MessageSquare,
    },
    {
      id: '__menu__',
      label: 'More',
      icon: Menu,
      isAction: true,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/92 backdrop-blur-xl border-t border-slate-200/80 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] shadow-[0_-6px_25px_rgba(0,0,0,0.06)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={onOpenMenu}
                className="flex flex-col items-center justify-center py-1 px-2.5 min-w-[54px] min-h-[48px] rounded-2xl text-slate-500 active:bg-slate-100 transition-transform active:scale-95 touch-action-manipulation"
              >
                <div className="relative p-1">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[58px] min-h-[48px] rounded-2xl transition-transform active:scale-95 touch-action-manipulation ${
                  isActive ? 'text-[#800020]' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-10 h-10 -mt-3 rounded-2xl flex items-center justify-center shadow-md transition-all ${
                    isActive
                      ? 'bg-[#800020] text-white ring-2 ring-[#800020]/20 scale-105'
                      : 'bg-gradient-to-tr from-[#800020] to-[#A00028] text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-tight mt-0.5 ${
                    isActive ? 'text-[#800020]' : 'text-slate-600'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[54px] min-h-[48px] rounded-2xl transition-transform active:scale-95 touch-action-manipulation ${
                isActive ? 'text-[#800020]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative p-1">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-bold bg-[#800020] text-white rounded-full min-w-[16px] text-center">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#800020]" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'font-bold text-[#800020]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
