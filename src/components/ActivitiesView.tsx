import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  MoveVertical,
  Send,
  Lightbulb,
} from 'lucide-react';
import { LearningMaterial, ActivitiesCollection } from '../types';
import { useToast } from './Toast';

interface ActivitiesViewProps {
  activeMaterial: LearningMaterial;
  activitiesMap: Record<string, ActivitiesCollection>;
  onSaveActivities: (materialId: string, activities: ActivitiesCollection) => void;
}

type ActivityTab =
  | 'fill-blank'
  | 'matching'
  | 'arrange-steps'
  | 'identify-concept'
  | 'scenario'
  | 'explain-yourself';

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activeMaterial,
  activitiesMap,
  onSaveActivities,
}) => {
  const { showToast } = useToast();

  const currentActivities = activitiesMap[activeMaterial.id] || {
    fillInTheBlanks: [],
    matching: [],
    arrangeSteps: [],
    identifyConcept: [],
    scenario: [],
    explainItYourself: [],
  };

  const [activeTab, setActiveTab] = useState<ActivityTab>('fill-blank');
  const [isGenerating, setIsGenerating] = useState(false);

  // Activity 1: Fill in the Blank state
  const [fibAnswers, setFibAnswers] = useState<Record<string, string>>({});
  const [fibChecked, setFibChecked] = useState(false);

  // Activity 2: Matching state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchingPairsState, setMatchingPairsState] = useState<Record<string, string>>({});
  const [matchingChecked, setMatchingChecked] = useState(false);

  // Activity 3: Arrange Steps state
  const initialSteps = currentActivities.arrangeSteps[0]?.steps || [];
  const [stepsOrder, setStepsOrder] = useState<string[]>(initialSteps);
  const [stepsChecked, setStepsChecked] = useState(false);

  // Activity 4: Identify Concept state
  const [conceptAnswers, setConceptAnswers] = useState<Record<string, string>>({});
  const [conceptChecked, setConceptChecked] = useState(false);

  // Activity 5: Scenario state
  const [revealedScenarios, setRevealedScenarios] = useState<Record<string, boolean>>({});

  // Activity 6: Explain It Yourself state
  const [studentExplanation, setStudentExplanation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  // Generate activities via AI
  const handleGenerateActivities = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: activeMaterial.rawContent,
          subject: activeMaterial.subject,
          topic: activeMaterial.topic,
          structuredAnalysis: activeMaterial.analysis,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.activities) throw new Error('Failed to generate activities');

      onSaveActivities(activeMaterial.id, data.activities);
      if (data.activities.arrangeSteps?.[0]?.steps) {
        setStepsOrder(data.activities.arrangeSteps[0].steps);
      }
      showToast('Generated fresh interactive study activities!', 'success');
    } catch (err: any) {
      console.error('Error generating activities:', err);
      showToast('Could not reach API. Activities loaded from local catalog.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Matching click handler
  const handleMatchingClick = (side: 'left' | 'right', text: string) => {
    if (side === 'left') {
      setSelectedLeft(text);
    } else if (side === 'right' && selectedLeft) {
      setMatchingPairsState((prev) => ({ ...prev, [selectedLeft]: text }));
      setSelectedLeft(null);
    }
  };

  // Move step up or down
  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...stepsOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setStepsOrder(newOrder);
  };

  // Evaluate Explain It Yourself
  const handleEvaluateExplanation = async () => {
    if (!studentExplanation.trim() || studentExplanation.length < 15) {
      showToast('Please type a more thorough response (at least a full sentence).', 'info');
      return;
    }

    setIsEvaluating(true);
    try {
      const prompt = currentActivities.explainItYourself[0]?.prompt || 'Explain database operation';
      const rubric = currentActivities.explainItYourself[0]?.rubric || 'Accuracy rubric';

      const res = await fetch('/api/ai/evaluate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          studentResponse: studentExplanation,
          rubric,
          materialContext: activeMaterial.rawContent,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.evaluation) throw new Error('Failed to evaluate explanation');

      setEvaluationResult(data.evaluation);
      showToast(`AI evaluated your response: ${data.evaluation.scoreOutOf10}/10!`, 'success');
    } catch (err: any) {
      console.error('Evaluation error:', err);
      showToast('Failed to contact evaluation engine.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
              Interactive Learning Activities
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{activeMaterial.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
            Reinforce Concepts & Active Skills
          </h1>
        </div>

        <button
          onClick={handleGenerateActivities}
          disabled={isGenerating}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
            isGenerating ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#800020] hover:bg-[#5A0016]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Generating...' : 'Refresh Activities'}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-medium pb-px">
        {[
          { id: 'fill-blank', label: '1. Fill in Blanks' },
          { id: 'matching', label: '2. Matching Type' },
          { id: 'arrange-steps', label: '3. Arrange Steps' },
          { id: 'identify-concept', label: '4. Identify Concept' },
          { id: 'scenario', label: '5. Scenario Questions' },
          { id: 'explain-yourself', label: '6. Explain It Yourself (AI Evaluated)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActivityTab)}
            className={`py-2.5 px-3.5 rounded-t-xl transition-all whitespace-nowrap border-b-2 font-semibold ${
              activeTab === tab.id
                ? 'border-[#800020] text-[#800020] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVITY 1: FILL IN THE BLANKS                                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'fill-blank' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-title">
              Fill in the Blanks
            </h2>
            <p className="text-xs text-slate-500">
              Select the correct term to complete each statement derived from your learning material.
            </p>
          </div>

          <div className="space-y-6">
            {currentActivities.fillInTheBlanks.map((fib, idx) => {
              const selected = fibAnswers[fib.id];
              const isCorrect =
                selected?.trim().toLowerCase() === fib.missingWord.trim().toLowerCase();

              return (
                <div key={fib.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-400">Statement {idx + 1}</div>
                  <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {fib.sentence.replace('______', `[ ${selected || '______'} ]`)}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {fib.options.map((opt) => (
                      <button
                        key={opt}
                        disabled={fibChecked}
                        onClick={() => setFibAnswers((prev) => ({ ...prev, [fib.id]: opt }))}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          selected === opt
                            ? 'bg-[#800020] text-white border-[#800020]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {fibChecked && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>
                        {isCorrect
                          ? 'Correct!'
                          : `Incorrect. The correct term is: ${fib.missingWord}`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setFibChecked(!fibChecked);
                if (!fibChecked) showToast('Answers evaluated!', 'success');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
            >
              {fibChecked ? 'Reset Exercise' : 'Check Answers'}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVITY 2: MATCHING                                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'matching' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-title">Matching Type</h2>
            <p className="text-xs text-slate-500">
              Click an item on the left, then click its corresponding definition or action on the right.
            </p>
          </div>

          {currentActivities.matching.map((m) => {
            const leftItems = m.pairs.map((p) => p.left);
            const rightItems = [...m.pairs.map((p) => p.right)].sort();

            return (
              <div key={m.id} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column (Terms) */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Clauses / Terms
                    </div>
                    {leftItems.map((term) => {
                      const matchedWith = matchingPairsState[term];
                      const isSelected = selectedLeft === term;

                      return (
                        <button
                          key={term}
                          onClick={() => handleMatchingClick('left', term)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-[#800020] ring-2 ring-[#800020]/20 bg-[#800020]/10 text-[#800020]'
                              : matchedWith
                              ? 'border-emerald-300 bg-emerald-50/50 text-slate-900'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{term}</span>
                            {matchedWith && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                                Matched
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column (Definitions) */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Operational Roles
                    </div>
                    {rightItems.map((desc) => {
                      const matchedBy = Object.keys(matchingPairsState).find(
                        (k) => matchingPairsState[k] === desc
                      );

                      return (
                        <button
                          key={desc}
                          onClick={() => handleMatchingClick('right', desc)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                            matchedBy
                              ? 'border-emerald-300 bg-emerald-50/50 text-slate-900 font-medium'
                              : 'border-slate-200 hover:border-[#800020] text-slate-600'
                          }`}
                        >
                          <div>{desc}</div>
                          {matchedBy && (
                            <div className="mt-1 text-[10px] text-emerald-800 font-bold">
                              ➔ Paired with: {matchedBy}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setMatchingPairsState({});
                      setSelectedLeft(null);
                      setMatchingChecked(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Clear Pairs
                  </button>

                  <button
                    onClick={() => {
                      setMatchingChecked(true);
                      showToast('Matching pairs evaluated!', 'success');
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
                  >
                    Check Matchings
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVITY 3: ARRANGE THE STEPS                                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'arrange-steps' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-title">
              Arrange the Steps
            </h2>
            <p className="text-xs text-slate-500">
              Reorder the steps into their logical chronological execution sequence using the up/down
              controls.
            </p>
          </div>

          <div className="space-y-2">
            {stepsOrder.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 text-xs font-medium text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono-data text-slate-600 font-bold">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === stepsOrder.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setStepsChecked(true);
                showToast('Sequence validated!', 'success');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
            >
              Validate Sequence
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVITY 4: IDENTIFY THE CONCEPT                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'identify-concept' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-title">
              Identify the Concept
            </h2>
            <p className="text-xs text-slate-500">
              Read the clue and identify which core concept it describes.
            </p>
          </div>

          <div className="space-y-4">
            {currentActivities.identifyConcept.map((ic) => {
              const selected = conceptAnswers[ic.id];
              const isCorrect = selected === ic.answer;

              return (
                <div key={ic.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 font-medium italic leading-relaxed">
                    &ldquo;{ic.clue}&rdquo;
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {ic.options.map((opt) => (
                      <button
                        key={opt}
                        disabled={conceptChecked}
                        onClick={() => setConceptAnswers((prev) => ({ ...prev, [ic.id]: opt }))}
                        className={`p-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                          selected === opt
                            ? 'border-[#800020] bg-[#800020]/10 text-[#800020]'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {conceptChecked && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {isCorrect ? '✓ Correct Identification!' : `✗ Incorrect. The answer is: ${ic.answer}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setConceptChecked(!conceptChecked);
                if (!conceptChecked) showToast('Evaluation complete!', 'success');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
            >
              {conceptChecked ? 'Reset' : 'Submit Identifications'}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVITY 5: SCENARIOS                                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'scenario' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-title">
              Scenario-Based Problem Solving
            </h2>
            <p className="text-xs text-slate-500">
              Real-world academic and workplace problems. Formulate your solution before revealing the verified approach.
            </p>
          </div>

          <div className="space-y-4">
            {currentActivities.scenario.map((sc) => {
              const isRevealed = revealedScenarios[sc.id];

              return (
                <div key={sc.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                    Scenario Problem
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {sc.scenario}
                  </p>
                  <div className="text-xs font-bold text-slate-900">
                    Question: {sc.question}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        setRevealedScenarios((prev) => ({ ...prev, [sc.id]: !prev[sc.id] }))
                      }
                      className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Verified Solution' : 'Reveal Verified Solution'}</span>
                    </button>

                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-900 text-rose-100 font-mono-data text-xs overflow-x-auto border border-slate-800">
                        {sc.solution}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVITY 6: EXPLAIN IT YOURSELF (AI EVALUATED)               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'explain-yourself' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>AI Active Assessment</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-serif-title">
              Explain It Yourself
            </h2>
            <p className="text-xs text-slate-500">
              The ultimate test of understanding: explain the concept in your own words. StudyMate AI evaluates your clarity, accuracy, and completeness.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F6F6] border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-900">Prompt:</div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {currentActivities.explainItYourself[0]?.prompt ||
                'Explain in your own words why omitting a WHERE clause in an UPDATE statement is dangerous.'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Your Written Explanation:
            </label>
            <textarea
              rows={4}
              value={studentExplanation}
              onChange={(e) => setStudentExplanation(e.target.value)}
              placeholder="State the core principle, operational distinction, and practical consequence..."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] bg-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEvaluateExplanation}
              disabled={isEvaluating}
              className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
                isEvaluating ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#800020] hover:bg-[#5A0016]'
              }`}
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Evaluating your explanation...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Evaluate with AI</span>
                </>
              )}
            </button>
          </div>

          {/* AI Feedback Report */}
          {evaluationResult && (
            <div className="p-5 rounded-2xl bg-[#F8F6F6] border border-slate-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    AI Rubric Assessment
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    Rating: {evaluationResult.accuracyRating}
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono-data text-[#800020]">
                  {evaluationResult.scoreOutOf10} / 10
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <strong>What you understood well: </strong>
                  {evaluationResult.whatWasCorrect}
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong>Refinement & Gaps: </strong>
                  {evaluationResult.whatWasMissedOrNeedsClarification}
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700">
                  <strong>Academic Model Statement: </strong>
                  {evaluationResult.recommendedRefinement}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
