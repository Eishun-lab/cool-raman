import React, { useState } from 'react';
import { SpeakHomeScreen } from './components/speak/SpeakHomeScreen';
import { SpeakLessonModal } from './components/speak/SpeakLessonModal';
import { SpeakFreeTalkView } from './components/speak/SpeakFreeTalkView';
import { SpeakPracticeView } from './components/speak/SpeakPracticeView';
import { SpeakProfileView } from './components/speak/SpeakProfileView';
import { SpeakBottomNav, SpeakTabType } from './components/speak/SpeakBottomNav';
import { ModernDrillSession } from './components/roadmap/ModernDrillSession';
import { SpeakLesson } from './data/speakCurriculum';
import { QuestDrillData } from './data/stageMicroDrills';
import {
  StudyProgressState,
  getInitialStudyProgress,
  saveStudyProgress,
} from './services/studySessionService';
import { getTodayQuickDrill } from './services/drillGeneratorService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SpeakTabType>('home');
  const [activeLesson, setActiveLesson] = useState<SpeakLesson | null>(null);
  const [activeDrill, setActiveDrill] = useState<QuestDrillData | null>(null);

  // 学習進捗（ストリーク・XP）
  const [studyProgress, setStudyProgress] = useState<StudyProgressState>(getInitialStudyProgress);

  // レッスン完了ハンドラ
  const handleLessonComplete = () => {
    setStudyProgress((prev) => {
      const updated: StudyProgressState = {
        ...prev,
        xp: prev.xp + 50,
        streakDays: Math.max(1, prev.streakDays),
      };
      saveStudyProgress(updated);
      return updated;
    });
    setActiveLesson(null);
  };

  // ドリル完了ハンドラ
  const handleDrillComplete = (score: number) => {
    setStudyProgress((prev) => {
      const updated: StudyProgressState = {
        ...prev,
        xp: prev.xp + score * 20 + 20,
      };
      saveStudyProgress(updated);
      return updated;
    });
    setActiveDrill(null);
  };

  // 今日の特訓
  const handleStartTodayDrill = () => {
    const drill = getTodayQuickDrill();
    setActiveDrill(drill);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* メイン画面ルーティング */}
      {activeTab === 'home' && (
        <SpeakHomeScreen
          currentStreak={studyProgress.streakDays}
          onStartLesson={(lesson) => setActiveLesson(lesson)}
          onOpenFreeTalk={() => setActiveTab('freetalk')}
        />
      )}

      {activeTab === 'freetalk' && (
        <SpeakFreeTalkView onBackToHome={() => setActiveTab('home')} />
      )}

      {activeTab === 'practice' && (
        <SpeakPracticeView onStartDrill={handleStartTodayDrill} />
      )}

      {activeTab === 'challenge' && (
        <SpeakPracticeView onStartDrill={handleStartTodayDrill} />
      )}

      {activeTab === 'profile' && (
        <SpeakProfileView
          streak={studyProgress.streakDays}
          xp={studyProgress.xp}
        />
      )}

      {/* 📱 Speak本家スタイルのフローティング・ボトムナビ */}
      <SpeakBottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* 🎙️ Speakスピーキング・レッスンモーダル */}
      {activeLesson && (
        <SpeakLessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
        />
      )}

      {/* ⚡ クイック特訓モーダル */}
      {activeDrill && (
        <ModernDrillSession
          drill={activeDrill}
          onClose={() => setActiveDrill(null)}
          onComplete={(score) => handleDrillComplete(score)}
        />
      )}
    </div>
  );
};

export default App;
