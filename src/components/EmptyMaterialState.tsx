import React from 'react';
import {
  Upload,
  BookOpen,
  Calculator,
  Sparkles,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface EmptyMaterialStateProps {
  title: string;
  description: string;
  icon?: 'reviewer' | 'quiz' | 'flashcards' | 'activities';
  onOpenUpload: () => void;
  onNavigate: (view: string) => void;
}

export const EmptyMaterialState: React.FC<EmptyMaterialStateProps> = ({
  title,
  description,
  icon = 'reviewer',
  onOpenUpload,
  onNavigate,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'quiz':
        return <HelpCircle className="w-8 h-8 text-[#800020]" />;
      case 'flashcards':
        return <Layers className="w-8 h-8 text-indigo-600" />;
      case 'activities':
        return <Sparkles className="w-8 h-8 text-purple-600" />;
      default:
        return <BookOpen className="w-8 h-8 text-[#800020]" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-center animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center mx-auto shadow-2xs">
          {getIcon()}
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-title">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#800020] hover:bg-[#5A0016] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Learning Material</span>
          </button>

          <button
            onClick={() => onNavigate('solver')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4 text-[#800020]" />
            <span>Accounting Problem Solver</span>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="pt-4 border-t border-slate-100 text-left">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            What you can upload:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
            <div className="p-2.5 rounded-xl bg-[#F8F6F6] border border-slate-200">
              📄 <b>Textbook PDFs</b> & Syllabi
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F6F6] border border-slate-200">
              📸 <b>Photos of notes</b> or problem sets
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F6F6] border border-slate-200">
              📝 <b>Copied lecture notes</b> or slides
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
