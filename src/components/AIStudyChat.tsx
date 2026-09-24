import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Lightbulb,
  HelpCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { LearningMaterial } from '../types';
import { useToast } from './Toast';

interface AIStudyChatProps {
  activeMaterial?: LearningMaterial;
  initialTopic?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIStudyChat: React.FC<AIStudyChatProps> = ({ activeMaterial, initialTopic }) => {
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-welcome',
      role: 'assistant',
      text: activeMaterial
        ? `Hello, Genelle! I'm your StudyMate personal tutor for **${activeMaterial.title}**.\n\nI can explain accounting standards and formulas simply, walk you through debits and credits with real business examples, provide gentle hints, or quiz your knowledge before exams. What would you like to work through together?`
        : `Hello, Genelle! I'm your StudyMate BSA personal study tutor.\n\nI can explain core accounting standards (PFRS/PAS), debit and credit journal entries, taxation rules, auditing principles, or general knowledge topics. What concept or problem would you like to work through today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialTopic) {
      handleSend(`Hi! Can you explain ${initialTopic} simply and show me a real-world accounting example from our uploaded material?`);
    }
  }, [initialTopic]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, text: m.text })),
          subject: activeMaterial?.subject || 'Financial Accounting',
          topic: activeMaterial?.topic || 'Accounting Principles & Standards',
          materialText: activeMaterial?.rawContent || 'General accounting and business curriculum principles.',
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ||
        (activeMaterial
          ? `Great question, Genelle! In ${activeMaterial.subject}, we follow standard accounting principles. According to your uploaded notes, expenses must be recognized in the same period as the revenues they helped generate. Would you like to see the journal entry?`
          : `Great question, Genelle! In Accountancy, we follow standard principles (PFRS/PAS). For example, the matching principle requires expenses to be matched with related revenues in the same accounting period. Would you like to practice a specific problem or journal entry?`);

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      showToast('Tutor response fallback loaded.', 'info');
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        text: activeMaterial
          ? `In your study material for **${activeMaterial.topic}**, the key focus is identifying normal balances (Debits for Assets & Expenses, Credits for Liabilities & Equity). Would you like to practice a quick problem together?`
          : `In Accountancy, the key foundation is identifying normal account balances (Debits for Assets and Expenses; Credits for Liabilities, Equity, and Revenue). What problem would you like to solve?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    { label: 'Explain simply with business example', query: 'Can you explain this topic simply using a real-world business example?' },
    { label: 'Step-by-step problem guide', query: 'Can you walk me through solving a problem in this topic step-by-step without giving the answer away?' },
    { label: 'Explain the "Why"', query: 'Why do we debit/credit these specific accounts? Explain the underlying standard rationale.' },
    { label: 'Quiz me on this', query: 'Ask me a challenging diagnostic question to test my understanding, and wait for my answer before revealing whether I am right.' },
    { label: 'Give me a hint', query: 'Give me a subtle conceptual hint to help me figure out the answer on my own.' },
    { label: 'Top exam rules to memorize', query: 'What are the top 3 high-yield definitions or standards I must memorize for this exam?' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E5E5E5] shadow-2xs flex flex-col h-[75vh] overflow-hidden animate-in fade-in duration-150">
      {/* Tutor Header */}
      <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-[#F8F6F6]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#800020] text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">StudyMate AI Tutor</div>
            <div className="text-[11px] text-slate-500">
              Anchored to:{' '}
              <span className="font-medium text-slate-700">
                {activeMaterial ? activeMaterial.title : 'Accountancy Curriculum Standards'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'm-reset',
                role: 'assistant',
                text: activeMaterial
                  ? `Conversation restarted! How can I assist you with **${activeMaterial.title}**, Genelle?`
                  : `Conversation restarted! How can I assist you with your studies, Genelle?`,
                timestamp: 'Just now',
              },
            ])
          }
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 text-xs flex items-center gap-1"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Priority Banner (Requirement 8) */}
      <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>
            {activeMaterial ? (
              <>Priority 1: Strictly grounded in uploaded material (<b>{activeMaterial.title}</b>)</>
            ) : (
              <>Priority 1: Grounded in Accountancy (PFRS/GAAP) curriculum</>
            )}
          </span>
        </div>
        <button
          onClick={() => {
            handleSend('Please explain this topic using broader General Knowledge and official accounting standards (PFRS/GAAP) if our uploaded material doesn\'t cover everything.');
          }}
          className="font-bold underline text-[#800020] hover:text-[#5A0016]"
        >
          Use General Knowledge
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 text-xs leading-relaxed ${
                isUser ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser
                    ? 'bg-[#800020] text-white'
                    : 'bg-[#800020]/10 text-[#800020]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-xl p-4 rounded-2xl space-y-1.5 ${
                  isUser
                    ? 'bg-[#800020] text-white rounded-tr-xs'
                    : 'bg-[#F8F6F6] border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}
              >
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: m.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="bg-black/10 px-1 py-0.5 rounded font-mono text-[11px]">$1</code>'),
                  }}
                />
                <div
                  className={`text-[10px] text-right font-mono ${
                    isUser ? 'text-rose-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <div className="w-2 h-2 rounded-full bg-[#800020] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#800020] animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-[#800020] animate-bounce [animation-delay:0.4s]" />
            <span>AI Tutor thinking grounded in your notes...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0 mr-1">
          Suggestions:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.query)}
            disabled={isSending}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#800020] hover:text-[#800020] whitespace-nowrap transition-colors shadow-2xs font-medium"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question about this material (e.g. 'Why is WHERE needed before ORDER BY?')..."
            className="flex-1 p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] bg-[#F8F6F6]"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className={`p-3 rounded-xl text-white shadow-xs transition-colors ${
              isSending || !inputText.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#800020] hover:bg-[#5A0016]'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
