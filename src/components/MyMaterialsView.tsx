import React, { useState } from 'react';
import {
  FolderOpen,
  Upload,
  FileText,
  BookOpen,
  HelpCircle,
  Layers,
  Sparkles,
  Trash2,
  Search,
  CheckCircle2,
  Calendar,
  Layers as LayersIcon,
} from 'lucide-react';
import { LearningMaterial } from '../types';
import { useToast } from './Toast';

interface MyMaterialsViewProps {
  materials: LearningMaterial[];
  activeMaterial?: LearningMaterial;
  onSelectMaterial: (id: string) => void;
  onDeleteMaterial: (id: string) => void;
  onOpenUpload: () => void;
  onNavigate: (view: string) => void;
}

export const MyMaterialsView: React.FC<MyMaterialsViewProps> = ({
  materials,
  activeMaterial,
  onSelectMaterial,
  onDeleteMaterial,
  onOpenUpload,
  onNavigate,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['all', ...Array.from(new Set(materials.map((m) => m.subject)))];

  const filtered = materials.filter((m) => {
    if (selectedSubject !== 'all' && m.subject !== selectedSubject) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q) ||
        m.analysis.mainTopics.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
            Knowledge Base
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
            My Learning Materials
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your uploaded textbooks, lecture slides, reviewer notes, and course files.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Subject pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                selectedSubject === subj
                  ? 'bg-[#800020] text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {subj === 'all' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search materials or topics..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#800020] bg-[#F8F6F6]"
          />
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {filtered.map((mat) => {
          const isActive = activeMaterial?.id === mat.id;

          return (
            <div
              key={mat.id}
              className={`bg-white rounded-2xl border p-6 transition-all shadow-2xs space-y-4 ${
                isActive ? 'border-[#800020]/40 ring-1 ring-[#800020]/20' : 'border-[#E5E5E5]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#800020]/10 text-[#800020] shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900">{mat.title}</h2>
                      {isActive && (
                        <span className="text-[10px] font-semibold text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded-md">
                          Active Target
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Analyzed
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span>Subject: {mat.subject}</span>
                      <span>·</span>
                      <span>Topic: {mat.topic}</span>
                      <span>·</span>
                      <span>File: {mat.fileName}</span>
                      <span>·</span>
                      <span>{mat.fileSize}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{mat.uploadedAt}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                      {mat.description || mat.analysis.summary}
                    </p>
                  </div>
                </div>

                {/* Switch Target / Delete */}
                <div className="flex items-center gap-2 self-end sm:self-start">
                  {!isActive && (
                    <button
                      onClick={() => {
                        onSelectMaterial(mat.id);
                        showToast(`Activated ${mat.title} for study sessions!`, 'info');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Set Active
                    </button>
                  )}
                  {materials.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete material "${mat.title}"?`)) {
                          onDeleteMaterial(mat.id);
                          showToast('Material removed.', 'info');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Extracted Topics Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mr-1">
                  Topics:
                </span>
                {mat.analysis.mainTopics.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 bg-[#F8F6F6] text-slate-700 rounded-md font-medium text-[11px] border border-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Actions Grid */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => {
                    onSelectMaterial(mat.id);
                    onNavigate('reviewer');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-[#F8F6F6] hover:bg-[#800020]/5 hover:border-[#800020]/40 font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Reviewer</span>
                </button>

                <button
                  onClick={() => {
                    onSelectMaterial(mat.id);
                    onNavigate('quiz');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-[#F8F6F6] hover:bg-[#800020]/5 hover:border-[#800020]/40 font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Create Quiz</span>
                </button>

                <button
                  onClick={() => {
                    onSelectMaterial(mat.id);
                    onNavigate('flashcards');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-[#F8F6F6] hover:bg-[#800020]/5 hover:border-[#800020]/40 font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Flashcards</span>
                </button>

                <button
                  onClick={() => {
                    onSelectMaterial(mat.id);
                    onNavigate('activities');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-[#F8F6F6] hover:bg-[#800020]/5 hover:border-[#800020]/40 font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Activities</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center mx-auto">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                {materials.length === 0 ? 'No learning materials uploaded yet' : 'No matching materials found'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {materials.length === 0
                  ? 'Upload your textbook PDFs, syllabus, or lecture slides to automatically generate reviewers, problem solvers, and practice quizzes.'
                  : 'Try adjusting your search query or subject filters.'}
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your First Material</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
