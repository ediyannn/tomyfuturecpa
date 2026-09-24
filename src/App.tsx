import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { MyMaterialsView } from './components/MyMaterialsView';
import { AIReviewerGenerator } from './components/AIReviewerGenerator';
import { QuizView } from './components/QuizView';
import { FlashcardsView } from './components/FlashcardsView';
import { ActivitiesView } from './components/ActivitiesView';
import { AIStudyChat } from './components/AIStudyChat';
import { ProgressView } from './components/ProgressView';
import { StudyHistoryView } from './components/StudyHistoryView';
import { SettingsView } from './components/SettingsView';
import { AccountingProblemSolver } from './components/AccountingProblemSolver';
import { DailyStudyPlanView } from './components/DailyStudyPlanView';
import { UploadMaterialModal } from './components/UploadMaterialModal';
import { WeakTopicsModal } from './components/WeakTopicsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { MobileTabBar } from './components/MobileTabBar';
import { EmptyMaterialState } from './components/EmptyMaterialState';
import { WifiOff } from 'lucide-react';

import {
  LearningMaterial,
  Reviewer,
  Quiz,
  QuizAttempt,
  FlashcardDeck,
  ActivitiesCollection,
  UserProfile,
  UserPreferences,
  StudySessionRecord,
  LearningMode,
  StudyGoal,
  DailyStudyPlan,
} from './types';

import {
  getStoredMaterials,
  saveStoredMaterials,
  getActiveMaterialId,
  setActiveMaterialId,
  getStoredReviewers,
  saveStoredReviewers,
  getStoredQuizzes,
  saveStoredQuizzes,
  getStoredAttempts,
  saveStoredAttempts,
  getStoredFlashcards,
  saveStoredFlashcards,
  getStoredActivities,
  saveStoredActivities,
  getStoredSessions,
  saveStoredSessions,
  getStoredUser,
  saveStoredUser,
  getStoredPreferences,
  saveStoredPreferences,
  getStoredLearningMode,
  saveStoredLearningMode,
  getStoredStudyGoals,
  saveStoredStudyGoals,
  getStoredDailyPlan,
  saveStoredDailyPlan,
  computeStudentMetrics,
  resetToDemoData,
  clearAllRecords,
} from './utils/storage';

function StudyMateApp() {
  const { showToast } = useToast();

  // App navigation state: 'dashboard' | 'materials' | 'solver' | 'study-plan' | 'reviewer' | 'quiz' | 'flashcards' | 'activities' | 'chat' | 'progress' | 'history' | 'settings'
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Learning Mode State (Requirement 1: default to Accountancy for Genelle)
  const [learningMode, setLearningMode] = useState<LearningMode>(getStoredLearningMode);

  // Core Data States
  const [materials, setMaterials] = useState<LearningMaterial[]>(getStoredMaterials);
  const [activeMatId, setActiveMatId] = useState<string>(getActiveMaterialId);
  const [reviewers, setReviewers] = useState<Reviewer[]>(getStoredReviewers);
  const [quizzes, setQuizzes] = useState<Quiz[]>(getStoredQuizzes);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(getStoredAttempts);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(getStoredFlashcards);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, ActivitiesCollection>>(
    getStoredActivities
  );
  const [sessions, setSessions] = useState<StudySessionRecord[]>(getStoredSessions);
  const [user, setUser] = useState<UserProfile>(getStoredUser);
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences);
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>(getStoredStudyGoals);
  const [dailyPlan, setDailyPlan] = useState<DailyStudyPlan>(getStoredDailyPlan);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [weakTopicModalTarget, setWeakTopicModalTarget] = useState<string | null>(null);
  const [chatTopicPrompt, setChatTopicPrompt] = useState<string | undefined>(undefined);

  // Active Material object
  const activeMaterial =
    materials.find((m) => m.id === activeMatId) || materials[0];

  // Calculated metrics
  const metrics = computeStudentMetrics();

  // Handle Mode Switch
  const handleSelectMode = (mode: LearningMode) => {
    setLearningMode(mode);
    saveStoredLearningMode(mode);
    if (mode === 'accountancy') {
      showToast('Switched to Accountancy Mode: Prioritizing PFRS, taxation, and auditing curriculum.', 'info');
    } else {
      showToast('Switched to General Knowledge Mode: Exploring science, history, and humanities.', 'info');
    }
  };

  // Online / Offline State
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('You are back online. Cloud AI models re-enabled!', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline Mode active. All saved study materials and quizzes remain fully accessible!', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle Ctrl+K / Cmd+K global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Material Creation Handler
  const handleMaterialCreated = (newMaterial: LearningMaterial, initialAction?: string) => {
    const updated = [newMaterial, ...materials];
    setMaterials(updated);
    saveStoredMaterials(updated);
    setActiveMatId(newMaterial.id);
    setActiveMaterialId(newMaterial.id);

    // Record session
    const newSession: StudySessionRecord = {
      id: 'sess-' + Date.now(),
      materialId: newMaterial.id,
      materialTitle: newMaterial.title,
      type: 'Reviewer',
      timestamp: 'Just now',
      durationMinutes: 5,
      detail: `Uploaded & analyzed ${newMaterial.title}`,
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);

    if (initialAction) {
      setCurrentView(initialAction);
    } else {
      setCurrentView('reviewer');
    }
  };

  // Material selection
  const handleSelectMaterial = (id: string) => {
    setActiveMatId(id);
    setActiveMaterialId(id);
  };

  // Material deletion
  const handleDeleteMaterial = (id: string) => {
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);
    saveStoredMaterials(updated);
    if (activeMatId === id && updated.length > 0) {
      setActiveMatId(updated[0].id);
      setActiveMaterialId(updated[0].id);
    }
  };

  // Reviewer saving
  const handleSaveReviewer = (newRev: Reviewer) => {
    const updated = [newRev, ...reviewers.filter((r) => r.id !== newRev.id)];
    setReviewers(updated);
    saveStoredReviewers(updated);

    const newSession: StudySessionRecord = {
      id: 'sess-' + Date.now(),
      materialId: newRev.materialId,
      materialTitle: activeMaterial?.title || 'Material',
      type: 'Reviewer',
      timestamp: 'Just now',
      durationMinutes: 10,
      detail: `Generated ${newRev.reviewerType}`,
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);
  };

  // Quiz saving
  const handleSaveQuiz = (newQuiz: Quiz) => {
    const updated = [newQuiz, ...quizzes.filter((q) => q.id !== newQuiz.id)];
    setQuizzes(updated);
    saveStoredQuizzes(updated);
  };

  // Quiz Attempt saving
  const handleSaveAttempt = (attempt: QuizAttempt) => {
    const updated = [attempt, ...attempts];
    setAttempts(updated);
    saveStoredAttempts(updated);

    const newSession: StudySessionRecord = {
      id: 'sess-' + Date.now(),
      materialId: attempt.materialId,
      materialTitle: activeMaterial?.title || 'Material',
      type: 'Quiz',
      timestamp: 'Just now',
      durationMinutes: Math.max(2, Math.round(attempt.timeSpentSeconds / 60)),
      detail: `Completed Quiz (Score: ${attempt.score}/${attempt.total} · ${attempt.percentage}%)`,
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);
  };

  // Flashcards saving
  const handleSaveFlashcards = (deck: FlashcardDeck) => {
    const updated = [deck, ...flashcardDecks.filter((d) => d.id !== deck.id)];
    setFlashcardDecks(updated);
    saveStoredFlashcards(updated);

    const newSession: StudySessionRecord = {
      id: 'sess-' + Date.now(),
      materialId: deck.materialId,
      materialTitle: activeMaterial?.title || 'Material',
      type: 'Flashcards',
      timestamp: 'Just now',
      durationMinutes: 8,
      detail: `Studied ${deck.cards.length} Flashcards`,
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);
  };

  // Activities saving
  const handleSaveActivities = (matId: string, acts: ActivitiesCollection) => {
    const updated = { ...activitiesMap, [matId]: acts };
    setActivitiesMap(updated);
    saveStoredActivities(updated);

    const newSession: StudySessionRecord = {
      id: 'sess-' + Date.now(),
      materialId: matId,
      materialTitle: activeMaterial?.title || 'Material',
      type: 'Activities',
      timestamp: 'Just now',
      durationMinutes: 10,
      detail: `Completed Interactive Learning Activities`,
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);
  };

  // User Profile and Prefs saving
  const handleSaveUser = (u: UserProfile) => {
    setUser(u);
    saveStoredUser(u);
  };

  const handleSavePreferences = (p: UserPreferences) => {
    setPreferences(p);
    saveStoredPreferences(p);
  };

  // Goals & Plan saving
  const handleSaveGoals = (goals: StudyGoal[]) => {
    setStudyGoals(goals);
    saveStoredStudyGoals(goals);
  };

  const handleSavePlan = (plan: DailyStudyPlan) => {
    setDailyPlan(plan);
    saveStoredDailyPlan(plan);
  };

  // Clear all records (clean slate)
  const handleClearAllRecords = () => {
    clearAllRecords();
    setMaterials([]);
    setActiveMatId('');
    setReviewers([]);
    setQuizzes([]);
    setAttempts([]);
    setFlashcardDecks([]);
    setActivitiesMap({});
    setSessions([]);
    setStudyGoals([]);
    setCurrentView('dashboard');
    showToast('All records cleared. Fresh study workspace ready!', 'success');
  };

  // Study History Deletion Handlers
  const handleDeleteSession = (sessionId: string) => {
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    saveStoredSessions(updated);
    showToast('Activity record removed from history.', 'info');
  };

  const handleDeleteSessions = (sessionIds: string[]) => {
    const updated = sessions.filter((s) => !sessionIds.includes(s.id));
    setSessions(updated);
    saveStoredSessions(updated);
    showToast(`${sessionIds.length} record(s) removed from history.`, 'info');
  };

  const handleClearAllSessions = () => {
    setSessions([]);
    saveStoredSessions([]);
    showToast('All study history records cleared.', 'info');
  };

  // Reset demo
  const handleResetData = () => {
    resetToDemoData();
    setMaterials(getStoredMaterials());
    setActiveMatId(getActiveMaterialId());
    setReviewers(getStoredReviewers());
    setQuizzes(getStoredQuizzes());
    setAttempts(getStoredAttempts());
    setFlashcardDecks(getStoredFlashcards());
    setActivitiesMap(getStoredActivities());
    setSessions(getStoredSessions());
    setUser(getStoredUser());
    setPreferences(getStoredPreferences());
    setLearningMode(getStoredLearningMode());
    setStudyGoals(getStoredStudyGoals());
    setDailyPlan(getStoredDailyPlan());
    setCurrentView('dashboard');
    showToast('Reset StudyMate to default Accountancy demo profile for Genelle.', 'info');
  };

  // If user requested Landing view
  if (currentView === 'landing') {
    return <LandingPage onStartStudying={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F6] text-[#222222] flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeMaterial={activeMaterial}
        user={user}
        learningMode={learningMode}
        onSelectMode={handleSelectMode}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          materialsCount={materials.length}
          learningMode={learningMode}
          onSelectMode={handleSelectMode}
        />

        {/* Dynamic Main Workspace Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-5xl overflow-x-hidden">
          {!isOnline && (
            <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Offline Mode:</strong> You're disconnected from the internet. All saved materials, reviewers, flashcards, quizzes, and study history are fully usable!
                </span>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-200/70 text-[10px] font-bold text-amber-900 shrink-0">
                Cached Locally
              </span>
            </div>
          )}
          {currentView === 'dashboard' && (
            <DashboardOverview
              user={user}
              materials={materials}
              activeMaterial={activeMaterial}
              learningMode={learningMode}
              onSelectMode={handleSelectMode}
              metrics={metrics}
              recentAttempts={attempts}
              recentSessions={sessions}
              onNavigate={setCurrentView}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onOpenWeakTopics={(topic) => setWeakTopicModalTarget(topic)}
              onSelectMaterial={handleSelectMaterial}
            />
          )}

          {currentView === 'solver' && (
            <AccountingProblemSolver activeMaterial={activeMaterial} />
          )}

          {currentView === 'study-plan' && (
            <DailyStudyPlanView
              plan={dailyPlan}
              goals={studyGoals}
              onSavePlan={handleSavePlan}
              onSaveGoals={handleSaveGoals}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'materials' && (
            <MyMaterialsView
              materials={materials}
              activeMaterial={activeMaterial}
              onSelectMaterial={handleSelectMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'reviewer' && (
            activeMaterial ? (
              <AIReviewerGenerator
                activeMaterial={activeMaterial}
                reviewers={reviewers}
                onSaveReviewer={handleSaveReviewer}
                onOpenChatWithTopic={(topic) => {
                  setChatTopicPrompt(topic);
                  setCurrentView('chat');
                }}
              />
            ) : (
              <EmptyMaterialState
                title="No Material Selected for Reviewer"
                description="Upload your textbook PDFs, syllabus, or lecture slides to generate comprehensive, structured AI reviewers with key definitions and formula cheatsheets."
                icon="reviewer"
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onNavigate={setCurrentView}
              />
            )
          )}

          {currentView === 'quiz' && (
            activeMaterial ? (
              <QuizView
                activeMaterial={activeMaterial}
                quizzes={quizzes}
                onSaveQuiz={handleSaveQuiz}
                onSaveAttempt={handleSaveAttempt}
                onNavigate={setCurrentView}
                onOpenWeakTopics={(topic) => setWeakTopicModalTarget(topic)}
              />
            ) : (
              <EmptyMaterialState
                title="No Material Selected for Quiz & Exams"
                description="Upload your learning material or syllabus to generate multiple-choice, true/false, identification, and computational exam questions grounded in your course notes."
                icon="quiz"
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onNavigate={setCurrentView}
              />
            )
          )}

          {currentView === 'flashcards' && (
            activeMaterial ? (
              <FlashcardsView
                activeMaterial={activeMaterial}
                decks={flashcardDecks}
                onSaveDeck={handleSaveFlashcards}
              />
            ) : (
              <EmptyMaterialState
                title="No Material Selected for Flashcards"
                description="Upload learning materials to automatically generate 3D flippable flashcards with Leitner-style spaced repetition rating."
                icon="flashcards"
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onNavigate={setCurrentView}
              />
            )
          )}

          {currentView === 'activities' && (
            activeMaterial ? (
              <ActivitiesView
                activeMaterial={activeMaterial}
                activitiesMap={activitiesMap}
                onSaveActivities={handleSaveActivities}
              />
            ) : (
              <EmptyMaterialState
                title="No Material Selected for Learning Activities"
                description="Upload notes or reviewers to generate interactive matching pairs, fill-in-the-blank drills, and concept category sorting exercises."
                icon="activities"
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onNavigate={setCurrentView}
              />
            )
          )}

          {currentView === 'chat' && (
            <AIStudyChat
              activeMaterial={activeMaterial}
              initialTopic={chatTopicPrompt}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              metrics={metrics}
              attempts={attempts}
              onOpenWeakTopics={(topic) => setWeakTopicModalTarget(topic)}
            />
          )}

          {currentView === 'history' && (
            <StudyHistoryView
              sessions={sessions}
              attempts={attempts}
              onReviewAttempt={(_att) => {
                setCurrentView('quiz');
              }}
              onNavigate={setCurrentView}
              onDeleteSession={handleDeleteSession}
              onDeleteSessions={handleDeleteSessions}
              onClearAllSessions={handleClearAllSessions}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              user={user}
              preferences={preferences}
              onSaveUser={handleSaveUser}
              onSavePreferences={handleSavePreferences}
              onResetData={handleResetData}
              onClearRecords={handleClearAllRecords}
            />
          )}
        </main>
      </div>

      {/* iOS/Android Native Bottom Navigation Bar */}
      <MobileTabBar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        materialsCount={materials.length}
        learningMode={learningMode}
      />

      {/* Upload Material Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onMaterialCreated={handleMaterialCreated}
      />

      {/* Adaptive Weak Topics Remediation Modal */}
      {weakTopicModalTarget && (
        <WeakTopicsModal
          isOpen={!!weakTopicModalTarget}
          onClose={() => setWeakTopicModalTarget(null)}
          topic={weakTopicModalTarget}
          subject={activeMaterial?.subject || 'Financial Accounting'}
          materialText={activeMaterial?.rawContent || 'General accounting curriculum standard topic.'}
        />
      )}

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        materials={materials}
        reviewers={reviewers}
        quizzes={quizzes}
        flashcardDecks={flashcardDecks}
        onSelectResult={(view, id) => {
          if (id) handleSelectMaterial(id);
          setCurrentView(view);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <StudyMateApp />
    </ToastProvider>
  );
}

export default App;
