import React, { useState } from 'react';
import {
  Calculator,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookOpen,
  FileText,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  CornerDownRight,
  PlusCircle,
  Copy,
  Check,
} from 'lucide-react';
import { LearningMaterial, AccountingProblemSolution } from '../types';
import { useToast } from './Toast';

interface AccountingProblemSolverProps {
  activeMaterial?: LearningMaterial;
}

const SAMPLE_PROBLEMS = [
  {
    title: 'Equipment Depreciation & Adjusting Entry',
    text: 'On January 1, a company purchased equipment for ₱100,000 with an estimated useful life of 5 years and salvage value of ₱10,000. Calculate the annual depreciation expense and show the year-end adjusting journal entry.',
  },
  {
    title: 'Ending Capital & Equity Reconciliation',
    text: 'Genelle Services had a beginning capital of ₱200,000 on January 1. During the year, Genelle made an additional investment of ₱50,000, withdrew ₱20,000 for personal use, and earned net income of ₱80,000. What is the ending capital balance?',
  },
  {
    title: 'Accrued Salaries Year-End Adjustment',
    text: 'Employees worked during the last week of December earning ₱15,000 in total wages. The payroll will be disbursed on January 5 of next year. Formulate the adjusting entry required on December 31.',
  },
  {
    title: 'Net Value-Added Tax (VAT) Calculation',
    text: 'A VAT-registered merchant recorded gross taxable sales of ₱1,000,000 (12% Output VAT) and eligible purchases of goods with Input VAT of ₱85,000. Compute the Net VAT Payable to the Bureau of Internal Revenue.',
  },
];

export const AccountingProblemSolver: React.FC<AccountingProblemSolverProps> = ({
  activeMaterial,
}) => {
  const { showToast } = useToast();

  const [problemText, setProblemText] = useState(SAMPLE_PROBLEMS[0].text);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<AccountingProblemSolution | null>(null);

  // Progressive Disclosure controls
  const [showHint, setShowHint] = useState(false);
  const [showFullSolution, setShowFullSolution] = useState(false);
  const [studentAttempt, setStudentAttempt] = useState('');
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      showToast('Problem image uploaded! Click "Analyze & Solve".', 'info');
    }
  };

  const handleSolve = async () => {
    if (!problemText.trim() && !imagePreview) {
      showToast('Please type a problem or upload an image first.', 'info');
      return;
    }

    setIsSolving(true);
    setShowHint(false);
    setShowFullSolution(false);
    setShowPracticeAnswer(false);

    try {
      const res = await fetch('/api/ai/solve-accounting-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText,
          imageBase64: imagePreview,
          mimeType: imageFile?.type || 'image/jpeg',
          materialContext: activeMaterial?.rawContent || '',
        }),
      });

      const data = await res.json();
      if (data.success && data.solution) {
        setSolution(data.solution);
        showToast('Problem analyzed! Review the concept and given data.', 'success');
      } else {
        showToast(data.error || 'Failed to analyze accounting problem.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to accounting solver engine.', 'error');
    } finally {
      setIsSolving(false);
    }
  };

  const handleCopySolution = () => {
    if (!solution) return;
    const textToCopy = `Accounting Problem Breakdown
What is Asked: ${solution.whatIsAsked}
Relevant Concept: ${solution.relevantConcept}
Formula/Method: ${solution.methodOrFormula}

Steps:
${solution.stepByStepSolution.map((s) => `${s.stepNumber}. ${s.title}: ${s.calculation} (${s.explanation})`).join('\n')}

${solution.journalEntry ? `Journal Entry:\n` + solution.journalEntry.map((j) => `${j.account} | Dr: ${j.debit || '-'} | Cr: ${j.credit || '-'}`).join('\n') : ''}

Why It's Correct: ${solution.explanationOfCorrectness}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Solution copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#800020]/10 text-[#800020]">
              Accountancy Mode Exclusive
            </span>
            <span className="text-xs text-slate-400">Step-by-Step Learning Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title mt-1">
            Accounting Problem Solver
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Type or photograph any accounting problem. StudyMate analyzes the given data, highlights the underlying accounting standard, and guides you through calculations and journal entries.
          </p>
        </div>

        {/* Quick Material Context Badge */}
        {activeMaterial && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs self-start sm:self-auto">
            <BookOpen className="w-3.5 h-3.5 text-[#800020]" />
            <span className="truncate max-w-[180px]">Context: <b>{activeMaterial.title}</b></span>
          </div>
        )}
      </div>

      {/* Input Stage */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-[#800020]" />
            <span>Enter Accounting Problem, Transaction, or Case Study</span>
          </label>

          {/* Quick sample problem pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
            <span className="text-slate-400 mr-1 hidden sm:inline">Try an example:</span>
            {SAMPLE_PROBLEMS.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setProblemText(sp.text);
                  setImagePreview(null);
                  setImageFile(null);
                  setSolution(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#800020]/10 hover:text-[#800020] text-slate-700 font-medium transition-colors whitespace-nowrap"
              >
                {sp.title.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={3}
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          placeholder="Example: On January 1, a company purchased equipment for ₱100,000 with a 5-year useful life and ₱10,000 salvage value. Calculate depreciation and show the journal entry..."
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] bg-[#F8F6F6] font-mono leading-relaxed"
        />

        {/* Image upload row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{imageFile ? 'Change Photo / Diagram' : 'Upload Problem Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Photo loaded</span>
                </span>
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-[11px] text-slate-400 hover:text-red-500 underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSolve}
            disabled={isSolving || (!problemText.trim() && !imagePreview)}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5A0016] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
          >
            {isSolving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Accounting Principles...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Analyze & Solve Problem</span>
              </>
            )}
          </button>
        </div>

        {imagePreview && (
          <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200 max-w-sm">
            <img
              src={imagePreview}
              alt="Uploaded accounting problem"
              className="max-h-36 rounded-lg object-contain mx-auto"
            />
          </div>
        )}
      </div>

      {/* Solution Stage */}
      {solution && (
        <div className="space-y-6">
          {/* Top Analytical Cards: What is Asked + Relevant Standard + Given Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. What the Problem is Asking */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#800020] flex items-center gap-1">
                <span>1. Objective</span>
              </div>
              <h2 className="text-xs font-bold text-slate-700">What is the problem asking?</h2>
              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {solution.whatIsAsked}
              </p>
            </div>

            {/* 2. Relevant Accounting Concept */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Accounting Standard</span>
              </div>
              <h2 className="text-xs font-bold text-slate-700">Relevant Standard / Concept</h2>
              <p className="text-xs text-indigo-950 font-medium bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                {solution.relevantConcept}
              </p>
            </div>

            {/* 3. Method & Formula */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" />
                <span>3. Method / Formula</span>
              </div>
              <h2 className="text-xs font-bold text-slate-700">Governing Equation</h2>
              <p className="text-xs text-slate-800 font-mono bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                {solution.methodOrFormula}
              </p>
            </div>
          </div>

          {/* Given Information Table */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                4
              </span>
              <span>Given Information Extracted from Problem:</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {solution.givenInfo.map((g, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8F6F6] border border-slate-200">
                  <div className="text-[11px] text-slate-500">{g.label}</div>
                  <div className="text-sm font-bold text-[#800020] mt-0.5 font-mono">{g.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Principle: Active Student Thinking Area */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold text-amber-950">
                    Genelle's Practice Scratchpad (Active Recall)
                  </h2>
                  <p className="text-xs text-amber-800">
                    Try solving it on paper or typing your work below before revealing the full solution.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Hint and Show Solution */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/70 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showHint ? 'Hide Hint' : 'Show me a Hint'}</span>
                </button>

                <button
                  onClick={() => setShowFullSolution(!showFullSolution)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 ${
                    showFullSolution
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-[#800020] text-white hover:bg-[#5A0016]'
                  }`}
                >
                  {showFullSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showFullSolution ? 'Hide Solution' : 'Show Solution'}</span>
                </button>
              </div>
            </div>

            {/* Hint Reveal */}
            {showHint && (
              <div className="p-3.5 rounded-xl bg-white border border-amber-300/80 text-xs text-amber-950 space-y-1 animate-in fade-in duration-150">
                <div className="font-bold flex items-center gap-1 text-amber-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tutor's Guiding Hint:</span>
                </div>
                <p className="leading-relaxed">{solution.hint}</p>
              </div>
            )}

            {/* Student Scratchpad Input */}
            <div>
              <textarea
                rows={2}
                value={studentAttempt}
                onChange={(e) => setStudentAttempt(e.target.value)}
                placeholder="Type your intermediate calculations or journal entry draft here..."
                className="w-full p-3 rounded-xl border border-amber-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Full Step-by-Step Solution & Journal Entry (Controlled by Show Solution button) */}
          {showFullSolution && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Step-by-step breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
                      5
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Step-by-Step Mathematical Derivation</h2>
                  </div>

                  <button
                    onClick={handleCopySolution}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Solution'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {solution.stepByStepSolution.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-xl bg-[#F8F6F6] border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] font-bold text-xs">
                          Step {step.stepNumber}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200 font-mono text-xs font-bold text-slate-900 text-center sm:text-left">
                        {step.calculation}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pl-1">
                        {step.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Journal Entry (Section 4 Requirement: "Show the journal entry when applicable") */}
              {solution.journalEntry && solution.journalEntry.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                      6
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">General Journal Entry</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-4">Date / Account Titles & Explanation</th>
                          <th className="py-2.5 px-4 text-right">Debit (Dr.)</th>
                          <th className="py-2.5 px-4 text-right">Credit (Cr.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {solution.journalEntry.map((entry, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className={`py-2 px-4 ${entry.credit ? 'pl-8 text-slate-700' : 'font-bold text-slate-900'}`}>
                              {entry.account}
                            </td>
                            <td className="py-2 px-4 text-right font-bold text-slate-900">
                              {entry.debit || '-'}
                            </td>
                            <td className="py-2 px-4 text-right font-bold text-[#800020]">
                              {entry.credit || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 7. Why the Answer is Correct & Key Pitfalls */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-700 text-white flex items-center justify-center text-xs font-bold">
                    7
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">Conceptual Explanation & Standards Validation</h2>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
                  {solution.explanationOfCorrectness}
                </p>
              </div>

              {/* 8. Similar Practice Problem (Requirement 4: "Provide a similar practice problem") */}
              {solution.similarPracticeProblem && (
                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        8
                      </span>
                      <h2 className="text-sm font-bold text-emerald-950">
                        Reinforcement: Similar Practice Problem for Genelle
                      </h2>
                    </div>

                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Active Practice
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium bg-[#F8F6F6] p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                    {solution.similarPracticeProblem.problemText}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 italic">
                      Hint: {solution.similarPracticeProblem.hint}
                    </span>

                    <button
                      onClick={() => setShowPracticeAnswer(!showPracticeAnswer)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      {showPracticeAnswer ? 'Hide Solution' : 'Check Practice Solution'}
                    </button>
                  </div>

                  {showPracticeAnswer && (
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-950 text-xs border border-emerald-200 space-y-1 font-mono leading-relaxed animate-in fade-in duration-150">
                      <div className="font-bold text-emerald-900 font-sans">Practice Problem Solution:</div>
                      <div>{solution.similarPracticeProblem.solution}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
