import React, { useState, useEffect } from 'react';
import {
  User,
  Sliders,
  Moon,
  Sun,
  RotateCcw,
  Download,
  Check,
  Save,
  Trash2,
  Wifi,
  WifiOff,
  Smartphone,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, UserPreferences, DifficultyLevel } from '../types';
import { useToast } from './Toast';

interface SettingsViewProps {
  user: UserProfile;
  preferences: UserPreferences;
  onSaveUser: (user: UserProfile) => void;
  onSavePreferences: (prefs: UserPreferences) => void;
  onResetData: () => void;
  onClearRecords: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  preferences,
  onSaveUser,
  onSavePreferences,
  onResetData,
  onClearRecords,
}) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<UserProfile>(user);
  const [prefsData, setPrefsData] = useState<UserPreferences>(preferences);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('StudyMate installed to your device!', 'success');
      }
      setDeferredPrompt(null);
    } else {
      showToast(
        'To install on iOS Safari: tap Share and "Add to Home Screen". On desktop: click the install icon in your address bar.',
        'info'
      );
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser(formData);
    showToast('Profile updated successfully!', 'success');
  };

  const handleSavePrefs = () => {
    onSavePreferences(prefsData);
    showToast('Study preferences saved!', 'success');
  };

  const handleExportData = () => {
    const backup = {
      user: formData,
      preferences: prefsData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymate_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('StudyMate data exported.', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
          Account & Customization
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif-title">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your student profile, default quiz parameters, and study preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <User className="w-5 h-5 text-[#800020]" />
          <h2 className="text-base font-bold text-slate-900 font-serif-title">Student Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          {/* Avatar / Profile Picture Picker */}
          <div className="flex items-center gap-4 pb-2 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-[#800020]/15 text-[#800020] flex items-center justify-center font-bold text-lg overflow-hidden border border-slate-200 shrink-0">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                formData.name ? formData.name.charAt(0).toUpperCase() : 'G'
              )}
            </div>
            <div className="space-y-1 flex-1">
              <label className="font-semibold text-slate-700 block">Profile Picture / Avatar</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData({ ...formData, avatarUrl: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#800020]/10 file:text-[#800020] hover:file:bg-[#800020]/25 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400">Upload an image file (JPG, PNG) to replace the default initial.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800020] bg-[#F8F6F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800020] bg-[#F8F6F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">University / School</label>
              <input
                type="text"
                value={formData.universityOrSchool}
                onChange={(e) => setFormData({ ...formData, universityOrSchool: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800020] bg-[#F8F6F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Major / Year</label>
              <input
                type="text"
                value={formData.gradeOrYear}
                onChange={(e) => setFormData({ ...formData, gradeOrYear: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800020] bg-[#F8F6F6]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Study Preferences */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-[#800020]" />
          <h2 className="text-base font-bold text-slate-900 font-serif-title">
            Study & Quiz Defaults
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Default Quiz Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Easy', 'Medium', 'Hard', 'Mixed'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setPrefsData({ ...prefsData, preferredDifficulty: d })}
                  className={`py-2 rounded-xl border text-center font-medium transition-all ${
                    prefsData.preferredDifficulty === d
                      ? 'bg-[#800020] text-white border-[#800020]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Default Question Count</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setPrefsData({ ...prefsData, preferredQuizLength: num })}
                  className={`py-2 rounded-xl border text-center font-medium transition-all ${
                    prefsData.preferredQuizLength === num
                      ? 'bg-[#800020] text-white border-[#800020]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSavePrefs}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#5A0016] rounded-xl shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* Offline Access & PWA Installation Card */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 font-serif-title">
                Offline Mode & App Installation
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    <span>Online & Synced</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span>Offline Mode Active</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              StudyMate stores your materials and study modules locally for uninterrupted offline learning.
            </p>
          </div>

          <button
            type="button"
            onClick={handleInstallPWA}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#800020] bg-[#800020]/10 hover:bg-[#800020]/20 rounded-xl transition-all self-start sm:self-auto border border-[#800020]/20"
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App to Device</span>
          </button>
        </div>

        {/* Offline Features Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[#F8F6F6] border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Offline Access</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All uploaded notes, generated reviewers, flashcard decks, quizzes, and your study history remain fully accessible without internet.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F6F6] border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <HardDrive className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Persistent Local Storage</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Quiz attempts, streak counters, and daily study plans are stored safely inside your browser's private offline cache.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F6F6] border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Smartphone className="w-4 h-4 text-[#800020] shrink-0" />
              <span>Mobile PWA Experience</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Works like a native iOS/Android app. Add to your home screen for full-screen view with no browser search bars.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 font-serif-title">
            Data Management
          </h2>
          <div className="text-xs text-slate-400">
            Export your study logs or restore initial sample curriculum data
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors touch-action-manipulation"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Study Data (JSON)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all uploaded materials, quizzes, study sessions, and history? This will give you a clean slate.')) {
                  onClearRecords();
                  showToast('All records removed. Fresh study environment ready!', 'success');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors touch-action-manipulation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove All Records</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset materials, quizzes, and history back to sample demo data?')) {
                  onResetData();
                  showToast('Reset to demo state.', 'info');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors touch-action-manipulation"
              title="Restore demo content if needed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Samples</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
