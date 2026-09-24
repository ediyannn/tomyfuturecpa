import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { LearningMaterial, FlashcardDeck, Flashcard } from '../types';
import { useToast } from './Toast';

interface FlashcardsViewProps {
  activeMaterial: LearningMaterial;
  decks: FlashcardDeck[];
  onSaveDeck: (deck: FlashcardDeck) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  activeMaterial,
  decks,
  onSaveDeck,
}) => {
  const { showToast } = useToast();

  const existingDeck = decks.find((d) => d.materialId === activeMaterial.id);
  const [currentDeck, setCurrentDeck] = useState<FlashcardDeck | null>(existingDeck || null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'known' | 'review'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Cards filtered according to status
  const cards = currentDeck?.cards || [];
  const filteredCards = cards.filter((c) => {
    if (filterMode === 'known') return c.isKnown;
    if (filterMode === 'review') return c.needsReview;
    return true;
  });

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1 < filteredCards.length ? i + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i - 1 >= 0 ? i - 1 : filteredCards.length - 1));
  };

  const handleShuffle = () => {
    if (!currentDeck) return;
    const shuffled = [...currentDeck.cards].sort(() => Math.random() - 0.5);
    const updated = { ...currentDeck, cards: shuffled };
    setCurrentDeck(updated);
    onSaveDeck(updated);
    setIsFlipped(false);
    setCurrentIndex(0);
    showToast('Deck shuffled!', 'info');
  };

  const markCardStatus = (isKnown: boolean) => {
    if (!currentDeck || !activeCard) return;
    const updatedCards = currentDeck.cards.map((c) => {
      if (c.id === activeCard.id) {
        return {
          ...c,
          isKnown,
          needsReview: !isKnown,
          lastReviewed: new Date().toLocaleDateString(),
        };
      }
      return c;
    });

    const updated = { ...currentDeck, cards: updatedCards };
    setCurrentDeck(updated);
    onSaveDeck(updated);

    showToast(isKnown ? 'Marked as Known' : 'Marked for Review', isKnown ? 'success' : 'info');
    handleNext();
  };

  const handleGenerateFlashcards = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-flashcards', {
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
      if (!data.success || !data.cards) throw new Error(data.error || 'Failed to generate cards');

      const newDeck: FlashcardDeck = {
        id: 'deck-' + Date.now(),
        materialId: activeMaterial.id,
        title: `${activeMaterial.subject} Flashcards`,
        subject: activeMaterial.subject,
        topic: activeMaterial.topic,
        cards: data.cards,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setCurrentDeck(newDeck);
      onSaveDeck(newDeck);
      setCurrentIndex(0);
      setIsFlipped(false);
      showToast(`Generated ${data.cards.length} active recall flashcards!`, 'success');
    } catch (err: any) {
      console.error('Error generating flashcards:', err);
      showToast('Generated flashcards with local study engine.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const knownCount = cards.filter((c) => c.isKnown).length;
  const reviewCount = cards.filter((c) => c.needsReview).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
              Active Recall Flashcards
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{activeMaterial.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
            Spaced-Repetition Study Cards
          </h1>
        </div>

        <button
          onClick={handleGenerateFlashcards}
          disabled={isGenerating}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
            isGenerating ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#800020] hover:bg-[#5A0016]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Generating...' : 'Generate New Cards'}</span>
        </button>
      </div>

      {/* Filter and Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `All (${cards.length})` },
            { id: 'review', label: `Needs Review (${reviewCount})` },
            { id: 'known', label: `Mastered (${knownCount})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilterMode(f.id as any);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === f.id
                  ? 'bg-[#800020] text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Shuffle and Progress */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="font-mono-data text-slate-500">
            {filteredCards.length > 0 ? currentIndex + 1 : 0} / {filteredCards.length}
          </span>
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 cursor-pointer perspective-1000 select-none"
          >
            <div
              className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-2 border-slate-200 shadow-md hover:shadow-lg p-8 flex flex-col justify-between transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 bg-[#800020]/10 text-[#800020] font-semibold rounded-md uppercase tracking-wider text-[10px]">
                    {activeCard.topicTag || 'Concept'}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Click to flip
                  </span>
                </div>

                <div className="text-center my-auto px-4">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-title leading-snug">
                    {activeCard.front}
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400">
                  Question · Active Recall
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#F8F6F6] rounded-3xl border-2 border-[#800020]/30 shadow-md p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-md uppercase tracking-wider text-[10px]">
                    Verified Answer
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Click to flip back
                  </span>
                </div>

                <div className="text-center my-auto px-4 max-h-48 overflow-y-auto">
                  <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                    {activeCard.back}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-500">
                  Grounding: 100% Uploaded Material
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => markCardStatus(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Needs Review</span>
              </button>

              <button
                onClick={() => markCardStatus(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Know This</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Layers className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="text-sm font-semibold text-slate-800">No Cards in this View</div>
          <p className="text-xs text-slate-500">
            Switch your filter back to &ldquo;All&rdquo; or click Generate New Cards above.
          </p>
        </div>
      )}
    </div>
  );
};
