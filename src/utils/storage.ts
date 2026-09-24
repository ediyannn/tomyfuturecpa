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
} from '../types';
import {
  sampleAccountancyMaterial,
  sampleGeneralMaterial,
  sampleAccountancyReviewer,
  sampleAccountancyQuiz,
  sampleGenellePastAttempt,
  sampleAccountancyFlashcardDeck,
  sampleAccountancyActivities,
  sampleHistory,
  initialUser,
  initialPreferences,
  sampleStudyGoals,
  sampleDailyStudyPlan,
} from '../data/sampleData';

const STORAGE_KEYS = {
  MATERIALS: 'studymate_materials',
  ACTIVE_MATERIAL_ID: 'studymate_active_mat_id',
  REVIEWERS: 'studymate_reviewers',
  QUIZZES: 'studymate_quizzes',
  ATTEMPTS: 'studymate_quiz_attempts',
  FLASHCARDS: 'studymate_flashcards',
  ACTIVITIES: 'studymate_activities',
  SESSIONS: 'studymate_sessions',
  USER: 'studymate_user_profile',
  PREFS: 'studymate_user_prefs',
  LEARNING_MODE: 'studymate_learning_mode',
  STUDY_GOALS: 'studymate_study_goals',
  DAILY_PLAN: 'studymate_daily_plan',
  RECORDS_PURGED_FLAG: 'studymate_records_purged_clean_v3',
};

// Automatic one-time cleanup to remove existing sample/dummy records as requested by user
export function ensureRecordsCleaned() {
  try {
    const isPurged = localStorage.getItem(STORAGE_KEYS.RECORDS_PURGED_FLAG);
    if (!isPurged) {
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_MATERIAL_ID, '');
      localStorage.setItem(STORAGE_KEYS.REVIEWERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify({}));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.STUDY_GOALS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.RECORDS_PURGED_FLAG, 'true');
    }
  } catch (err) {
    console.error('Failed to run initial cleanup:', err);
  }
}

// Run immediately on import
ensureRecordsCleaned();

export function clearAllRecords() {
  localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MATERIAL_ID, '');
  localStorage.setItem(STORAGE_KEYS.REVIEWERS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify({}));
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.STUDY_GOALS, JSON.stringify([]));
}

export function getStoredMaterials(): LearningMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredMaterials(materials: LearningMaterial[]) {
  localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
}

export function getActiveMaterialId(): string {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_MATERIAL_ID) || '';
}

export function setActiveMaterialId(id: string) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MATERIAL_ID, id);
}

export function getStoredLearningMode(): LearningMode {
  return (localStorage.getItem(STORAGE_KEYS.LEARNING_MODE) as LearningMode) || 'accountancy';
}

export function saveStoredLearningMode(mode: LearningMode) {
  localStorage.setItem(STORAGE_KEYS.LEARNING_MODE, mode);
}

export function getStoredReviewers(): Reviewer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredReviewers(reviewers: Reviewer[]) {
  localStorage.setItem(STORAGE_KEYS.REVIEWERS, JSON.stringify(reviewers));
}

export function getStoredQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredQuizzes(quizzes: Quiz[]) {
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
}

export function getStoredAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredAttempts(attempts: QuizAttempt[]) {
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
}

export function getStoredFlashcards(): FlashcardDeck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredFlashcards(decks: FlashcardDeck[]) {
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(decks));
}

export function getStoredActivities(): Record<string, ActivitiesCollection> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveStoredActivities(activitiesMap: Record<string, ActivitiesCollection>) {
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activitiesMap));
}

export function getStoredSessions(): StudySessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredSessions(sessions: StudySessionRecord[]) {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getStoredStudyGoals(): StudyGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_GOALS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredStudyGoals(goals: StudyGoal[]) {
  localStorage.setItem(STORAGE_KEYS.STUDY_GOALS, JSON.stringify(goals));
}

export function getStoredDailyStudyPlan(): DailyStudyPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_PLAN);
    if (!raw) {
      return {
        id: 'plan-custom',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        availableHours: 2,
        subjects: ['Financial Accounting', 'Taxation'],
        blocks: [
          {
            id: 'b-1',
            subject: 'Financial Accounting',
            description: 'Adjusting Entries & Depreciations',
            activityType: 'Concept Review',
            durationMinutes: 45,
            completed: false,
          },
          {
            id: 'b-2',
            subject: 'Financial Accounting',
            description: 'Journal Entries & Calculations',
            activityType: 'Problem Solving',
            durationMinutes: 45,
            completed: false,
          },
          {
            id: 'b-3',
            subject: 'Taxation',
            description: 'VAT & Conceptual Questions',
            activityType: 'Practice Quiz',
            durationMinutes: 30,
            completed: false,
          },
        ],
      };
    }
    return JSON.parse(raw);
  } catch {
    return sampleDailyStudyPlan;
  }
}

export function saveStoredDailyStudyPlan(plan: DailyStudyPlan) {
  localStorage.setItem(STORAGE_KEYS.DAILY_PLAN, JSON.stringify(plan));
}

export const getStoredDailyPlan = getStoredDailyStudyPlan;
export const saveStoredDailyPlan = saveStoredDailyStudyPlan;

export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return initialUser;
    return JSON.parse(raw);
  } catch {
    return initialUser;
  }
}

export function saveStoredUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
    if (!raw) return initialPreferences;
    return JSON.parse(raw);
  } catch {
    return initialPreferences;
  }
}

export function saveStoredPreferences(prefs: UserPreferences) {
  localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
}

export function resetToDemoData() {
  localStorage.clear();
  const initialMats = [sampleAccountancyMaterial, sampleGeneralMaterial];
  saveStoredMaterials(initialMats);
  setActiveMaterialId(sampleAccountancyMaterial.id);
  saveStoredLearningMode('accountancy');
  saveStoredReviewers([sampleAccountancyReviewer]);
  saveStoredQuizzes([sampleAccountancyQuiz]);
  saveStoredAttempts([sampleGenellePastAttempt]);
  saveStoredFlashcards([sampleAccountancyFlashcardDeck]);
  saveStoredActivities({ [sampleAccountancyMaterial.id]: sampleAccountancyActivities });
  saveStoredSessions(sampleHistory);
  saveStoredStudyGoals(sampleStudyGoals);
  saveStoredDailyStudyPlan(sampleDailyStudyPlan);
  saveStoredUser(initialUser);
  saveStoredPreferences(initialPreferences);
}

// Compute aggregate metrics for dashboard & progress from genuine user data
export function computeStudentMetrics() {
  const materials = getStoredMaterials();
  const attempts = getStoredAttempts();
  const sessions = getStoredSessions();

  const totalQuizzes = attempts.length;
  // Calculate average score strictly from actual attempts
  const avgScore =
    totalQuizzes > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes)
      : 0;

  // Calculate study time strictly from recorded sessions
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const hours = (totalMinutes / 60).toFixed(1);

  // Topic mastery aggregator
  const topicStats: Record<string, { total: number; correct: number }> = {};

  attempts.forEach((att) => {
    Object.entries(att.topicBreakdown || {}).forEach(([topic, stat]) => {
      if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
      topicStats[topic].total += stat.total;
      topicStats[topic].correct += stat.correct;
    });
  });

  const topicsMastered: string[] = [];
  const weakTopics: string[] = [];

  Object.entries(topicStats).forEach(([topic, stat]) => {
    const pct = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
    if (pct >= 80) {
      topicsMastered.push(topic);
    } else if (pct < 70) {
      weakTopics.push(topic);
    }
  });

  return {
    materialsCount: materials.length,
    quizzesCompleted: totalQuizzes,
    averageScore: avgScore,
    studyTimeHours: hours,
    topicsMasteredCount: topicsMastered.length,
    masteredTopicsList: topicsMastered,
    weakTopicsList: weakTopics,
    topicStats,
  };
}
