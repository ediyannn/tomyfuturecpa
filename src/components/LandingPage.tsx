import React from 'react';
import {
  Upload,
  BookOpen,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Layers,
} from 'lucide-react';
import heroImage from '../assets/images/hero_studymate_workspace_1790165726621.jpg';
import reviewerImage from '../assets/images/feature_reviewer_preview_1790165745377.jpg';
import quizImage from '../assets/images/feature_quiz_analytics_1790165761578.jpg';

interface LandingPageProps {
  onStartStudying: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartStudying }) => {
  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F6] text-[#222222]">
      {/* Landing Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#E5E5E5] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#800020] text-white flex items-center justify-center shadow-xs">
              <span className="font-serif-title text-xl font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#800020] font-serif-title">
              StudyMate
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToFeatures}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors hidden sm:block"
            >
              How It Works
            </button>
            <button
              onClick={onStartStudying}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
            >
              Start Studying
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/8 text-[#800020] text-xs font-medium border border-[#800020]/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Personal Study Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight font-serif-title leading-[1.15]">
            Study Smarter. Learn Better.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your learning materials and let AI turn them into personalized reviewers, quizzes,
            flashcards, and learning activities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onStartStudying}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>Start Studying</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#800020] bg-white hover:bg-slate-50 border border-[#800020]/30 rounded-xl transition-colors"
            >
              Learn More
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strict Material Grounding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#800020]" />
              <span>Supports PDF, DOCX, TXT & Images</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>

        {/* Dashboard Visual Preview */}
        <div className="max-w-5xl mx-auto mt-12 rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white p-2 sm:p-3">
          <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-16/9">
            <img
              src={heroImage}
              alt="StudyMate Academic Study Workspace"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white max-w-xl">
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-200 mb-1">
                  Active Learning Workflow
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-title">
                  Upload Material → AI Analysis → Interactive Quizzes → Mastery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features-section" className="py-20 px-6 lg:px-8 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif-title">
              Built for How Students Actually Learn
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              StudyMate doesn&apos;t just spit out generic answers. It anchors directly to your syllabus,
              notes, and textbooks to reinforce active recall and master difficult topics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#F8F6F6] border border-slate-200 hover:border-[#800020]/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif-title">
                  Upload Your Materials
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload your notes, PDFs, documents, or pictures of textbook pages. StudyMate extracts
                  key concepts, definitions, and procedures instantly.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#800020] flex items-center gap-1">
                <span>PDF · DOCX · TXT · Images</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#F8F6F6] border border-slate-200 hover:border-[#800020]/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif-title">
                  AI Study Materials
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatically generate comprehensive summaries, reviewers, high-yield exam sheets, and
                  organized definition sheets directly from your content.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#800020] flex items-center gap-1">
                <span>Tailored length & difficulty</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#F8F6F6] border border-slate-200 hover:border-[#800020]/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif-title">
                  Interactive Quizzes
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate quizzes based strictly on the uploaded learning materials. Practice with
                  multiple-choice, true/false, identification, and guided hints.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#800020] flex items-center gap-1">
                <span>Practice & Exam Modes</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#F8F6F6] border border-slate-200 hover:border-[#800020]/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif-title">
                  Personalized Learning
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track your performance and pinpoint weak topics automatically. The adaptive system
                  recommends targeted drills to eliminate knowledge gaps.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#800020] flex items-center gap-1">
                <span>Smart Topic Remediation</span>
              </div>
            </div>
          </div>

          {/* Detailed visual split showcases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 items-center">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
                Structured Knowledge Extraction
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-title">
                Turn Dense Slides & Textbooks into Clear Reviewers
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                StudyMate parses definitions, step-by-step procedures, formulas, and relational
                diagrams. Reviewers are formatted with clean headers, code syntax blocks, and high-yield
                checklists ready to print or save.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Configurable from quick summaries to comprehensive exam guides</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Downloadable as Markdown or formatted print-ready study notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AI Tutor answers questions without guessing outside your source text</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={reviewerImage}
                alt="Structured study materials and reviewer"
                referrerPolicy="no-referrer"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={quizImage}
                alt="Adaptive quiz analytics and performance"
                referrerPolicy="no-referrer"
                className="w-full h-72 object-cover"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
                Adaptive Performance Engine
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-title">
                Identify Weak Topics & Generate Targeted Practice
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Taking a quiz is just the beginning. StudyMate evaluates every response, highlights why
                incorrect options were wrong, and tracks topic mastery in real time.
              </p>
              <div className="p-4 rounded-xl bg-[#800020]/5 border border-[#800020]/15 space-y-2">
                <div className="text-xs font-bold text-[#800020]">Sample Adaptive Flow:</div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Scored 80% on Database Chapter 3? StudyMate automatically flags weakness in{' '}
                  <span className="font-semibold text-[#800020]">WHERE clause</span> and{' '}
                  <span className="font-semibold text-[#800020]">ORDER BY</span>, and immediately
                  generates 5 focused remediation drill questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-[#800020] text-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-title">
            Ready to master your coursework?
          </h2>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
            Upload your first lecture slides or notes and experience personalized, material-grounded study
            assistance in seconds.
          </p>
          <button
            onClick={onStartStudying}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-[#800020] bg-white hover:bg-rose-50 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch StudyMate Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-[#E5E5E5] text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#800020] font-serif-title text-base">StudyMate</span>
            <span>· Academic Study Platform</span>
          </div>
          <div>Strictly grounded in your uploaded materials · No hallucinated facts</div>
        </div>
      </footer>
    </div>
  );
};
