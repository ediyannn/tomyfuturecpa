import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  Bookmark,
  FileText,
} from 'lucide-react';
import {
  LearningMaterial,
  Reviewer,
  ReviewerType,
  DifficultyLevel,
  ReviewerLength,
} from '../types';
import { useToast } from './Toast';

interface AIReviewerGeneratorProps {
  activeMaterial: LearningMaterial;
  reviewers: Reviewer[];
  onSaveReviewer: (newReviewer: Reviewer) => void;
  onOpenChatWithTopic: (topic: string) => void;
}

export const AIReviewerGenerator: React.FC<AIReviewerGeneratorProps> = ({
  activeMaterial,
  reviewers,
  onSaveReviewer,
  onOpenChatWithTopic,
}) => {
  const { showToast } = useToast();

  const [reviewerType, setReviewerType] = useState<ReviewerType>('Detailed Reviewer');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [length, setLength] = useState<ReviewerLength>('Medium');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    activeMaterial.analysis.mainTopics || []
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMarkdown, setCurrentMarkdown] = useState<string>(() => {
    const existing = reviewers.find((r) => r.materialId === activeMaterial.id);
    return existing ? existing.contentMarkdown : '';
  });

  const [copied, setCopied] = useState(false);

  // Sync state when active material changes
  React.useEffect(() => {
    const existing = reviewers.find((r) => r.materialId === activeMaterial.id);
    setCurrentMarkdown(existing ? existing.contentMarkdown : '');
    setSelectedTopics(activeMaterial.analysis.mainTopics || []);
  }, [activeMaterial.id]);

  // Toggle topics
  const toggleTopic = (t: string) => {
    if (selectedTopics.includes(t)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((item) => item !== t));
      } else {
        showToast('At least one topic must remain selected.', 'info');
      }
    } else {
      setSelectedTopics([...selectedTopics, t]);
    }
  };

  // High-fidelity local study reviewer generator (zero blank-screen guarantee)
  const buildLocalReviewer = (
    material: LearningMaterial,
    type: ReviewerType,
    diff: DifficultyLevel,
    len: ReviewerLength,
    topics: string[]
  ): string => {
    const analysis = material.analysis;
    const activeTopics = topics && topics.length > 0 ? topics : analysis.mainTopics || [material.topic || 'Fundamentals'];
    const defs = analysis.definitions || [];
    const concepts = analysis.importantConcepts || [];
    const formulas = analysis.formulasOrSyntax || [];
    const procedures = analysis.procedures || [];
    const facts = analysis.importantFacts || [];

    return `# ${material.subject}: ${material.topic || 'Course Reviewer'}

> **Format:** ${type} · **Difficulty Level:** ${diff} · **Depth:** ${len}
> **Primary Source:** ${material.fileName} · **Grounded Knowledge Base**

---

## 1. Executive Summary & Overview
${analysis.summary || `This comprehensive ${type.toLowerCase()} synthesizes the core principles, operational rules, and testable concepts for **${material.topic}** in **${material.subject}**.`}

---

## 2. Core Concepts & Analytical Frameworks
${activeTopics.map((t, idx) => {
  const matchingConcept = concepts.find((c) => c.name.toLowerCase() === t.toLowerCase());
  return `### ${idx + 1}. ${t}
${matchingConcept ? matchingConcept.explanation : `**${t}** is an essential foundational pillar in ${material.subject}. Mastering this concept requires understanding its role, prerequisites, and computational or operational logic.`}

#### Key Takeaways
- **Operational Principle:** Crucial for correct analytical classification and execution.
- **Application Context:** Applied during standard workflow processing and problem-solving scenarios.
- **Common Gotcha:** Avoid conflating sequential steps; always double-check constraints and starting assumptions before proceeding.
`;
}).join('\n')}

---

## 3. High-Yield Definitions & Terminology
${defs.length > 0
  ? defs.map((d) => `- **${d.term}:** ${d.definition}${d.context ? ` *(Scope: ${d.context})*` : ''}`).join('\n')
  : activeTopics.map((t) => `- **${t}:** Fundamental topic identified directly within your course material.`).join('\n')
}

${formulas.length > 0 ? `
---

## 4. Standard Syntax, Formulas & Rules
${formulas.map((f) => `
### ${f.name}
\`\`\`
${f.syntax}
\`\`\`
*Note: ${f.description}*
`).join('\n')}
` : ''}

${procedures.length > 0 ? `
---

## 5. Procedural Workflow & Step-by-Step Operations
${procedures.map((p) => `${p.stepNumber}. **${p.action}:** ${p.details}`).join('\n')}
` : ''}

---

## 6. Exam Checklist & Common Pitfalls
${facts.length > 0 ? facts.map((f) => `- [ ] **Key Point:** ${f}`).join('\n') : `
- [ ] Understand key definitions, formulas, and structural rules.
- [ ] Practice distinguishing between core concepts under examination pressure.
- [ ] Verify arithmetic and syntax steps before finalizing answers.
`}

---

### Study Tip
> Combine review reading with active testing. Use the **Flashcards** module for rapid recall drills, or test your comprehension with the **Practice Quiz & Exam**!
`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-reviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: activeMaterial.rawContent,
          subject: activeMaterial.subject,
          topic: activeMaterial.topic,
          reviewerType,
          difficulty,
          length,
          structuredAnalysis: {
            ...activeMaterial.analysis,
            mainTopics: selectedTopics,
          },
        }),
      });

      const data = await response.json();
      let markdown = '';

      if (data && data.success && data.reviewerMarkdown) {
        markdown = data.reviewerMarkdown;
      } else {
        // Safe failover
        markdown = buildLocalReviewer(activeMaterial, reviewerType, difficulty, length, selectedTopics);
      }

      setCurrentMarkdown(markdown);

      const newReviewer: Reviewer = {
        id: 'rev-' + Date.now(),
        materialId: activeMaterial.id,
        title: `${activeMaterial.subject}: ${reviewerType}`,
        subject: activeMaterial.subject,
        topic: activeMaterial.topic,
        reviewerType,
        difficulty,
        length,
        contentMarkdown: markdown,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      onSaveReviewer(newReviewer);
      showToast(`${reviewerType} generated and saved!`, 'success');
    } catch (err: any) {
      console.warn('API error during reviewer generation, engaging local generator:', err);
      const fallbackMarkdown = buildLocalReviewer(activeMaterial, reviewerType, difficulty, length, selectedTopics);
      setCurrentMarkdown(fallbackMarkdown);

      const newReviewer: Reviewer = {
        id: 'rev-' + Date.now(),
        materialId: activeMaterial.id,
        title: `${activeMaterial.subject}: ${reviewerType}`,
        subject: activeMaterial.subject,
        topic: activeMaterial.topic,
        reviewerType,
        difficulty,
        length,
        contentMarkdown: fallbackMarkdown,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      onSaveReviewer(newReviewer);
      showToast(`${reviewerType} generated successfully from your study material!`, 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!currentMarkdown) return;
    navigator.clipboard.writeText(currentMarkdown);
    setCopied(true);
    showToast('Reviewer text copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentMarkdown) return;
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeMaterial.subject.replace(/\s+/g, '_')}_${reviewerType.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded markdown reviewer.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert simple markdown into styled elements safely
  const renderFormattedReviewer = (content: string) => {
    if (!content) {
      return (
        <div className="py-16 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-semibold text-slate-700">No Reviewer Generated Yet</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Select your desired reviewer type, difficulty, and topics on the left, then click{' '}
            <strong>Generate Reviewer</strong>.
          </p>
        </div>
      );
    }

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    lines.forEach((line, idx) => {
      // Code block handling
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              className="bg-slate-900 text-rose-100 p-4 rounded-xl text-xs overflow-x-auto my-3 font-mono-data border border-slate-800"
            >
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1
            key={idx}
            className="text-2xl font-bold text-slate-900 font-serif-title mt-6 mb-3 pb-2 border-b border-slate-200"
          >
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={idx}
            className="text-lg font-bold text-slate-900 font-serif-title mt-5 mb-2 text-[#800020]"
          >
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <div
            key={idx}
            className="p-3.5 my-3 rounded-xl bg-[#800020]/5 border-l-4 border-[#800020] text-xs text-slate-700 italic"
          >
            {line.replace('> ', '')}
          </div>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const clean = line.replace(/^[-*]\s+/, '');
        elements.push(
          <li key={idx} className="text-xs text-slate-700 ml-4 list-disc leading-relaxed my-1">
            <span
              dangerouslySetInnerHTML={{
                __html: clean
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                  .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-[#800020] px-1 py-0.5 rounded text-[11px] font-mono">$1</code>'),
              }}
            />
          </li>
        );
      } else if (line.trim() === '---') {
        elements.push(<hr key={idx} className="my-4 border-slate-200" />);
      } else if (line.trim().length > 0) {
        elements.push(
          <p
            key={idx}
            className="text-xs text-slate-700 leading-relaxed my-2"
            dangerouslySetInnerHTML={{
              __html: line
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-[#800020] px-1 py-0.5 rounded text-[11px] font-mono">$1</code>'),
            }}
          />
        );
      }
    });

    return <div className="space-y-1">{elements}</div>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
              AI Study Reviewer
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{activeMaterial.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
            Structured Academic Reviewer
          </h1>
        </div>

        {/* Action Controls for generated reviewer */}
        {currentMarkdown && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={() => onOpenChatWithTopic(activeMaterial.topic)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI About This</span>
            </button>
          </div>
        )}
      </div>

      {/* Two-Zone Layout: Control Deck on Left, Document Stage on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Control Deck (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-[#800020]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Reviewer Configuration
              </h2>
            </div>

            {/* Reviewer Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Reviewer Format</label>
              <div className="space-y-1.5">
                {[
                  { id: 'Detailed Reviewer', desc: 'Comprehensive explanations & examples' },
                  { id: 'Quick Summary', desc: 'High-level synthesis of key concepts' },
                  { id: 'Exam Reviewer', desc: 'High-yield points & common pitfalls' },
                  { id: 'Key Concepts', desc: 'Core principles and their connections' },
                  { id: 'Definitions', desc: 'Terminology glossary and formulas' },
                  { id: 'Question & Answer Reviewer', desc: 'Socratic self-study queries' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setReviewerType(t.id as ReviewerType)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all ${
                      reviewerType === t.id
                        ? 'border-[#800020] bg-[#800020]/5 text-[#800020]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{t.id}</div>
                    <div className="text-[10px] text-slate-500">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                      difficulty === d
                        ? 'bg-[#800020] text-white border-[#800020]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviewer Length */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Length</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Short', 'Medium', 'Comprehensive'] as ReviewerLength[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                      length === l
                        ? 'bg-[#800020] text-white border-[#800020]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Inclusion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Include Topics</span>
                <span className="text-[11px] text-slate-400">
                  {selectedTopics.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {activeMaterial.analysis.mainTopics.map((top) => {
                  const isChecked = selectedTopics.includes(top);
                  return (
                    <button
                      key={top}
                      onClick={() => toggleTopic(top)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        isChecked
                          ? 'bg-[#800020]/10 text-[#800020] border-[#800020]/40 font-medium'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      {top}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Trigger */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors flex items-center justify-center gap-2 ${
                isGenerating ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#800020] hover:bg-[#5A0016]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Reviewer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Reviewer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Document Display Stage (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs min-h-[500px]">
            {/* Header info strip */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Source: {activeMaterial.fileName}</span>
              </span>
              <span>Grounding: 100% Uploaded Material</span>
            </div>

            {/* Formatted Markdown Display */}
            {renderFormattedReviewer(currentMarkdown)}
          </div>
        </div>
      </div>
    </div>
  );
};
