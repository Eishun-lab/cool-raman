import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  GraduationCap,
  Flame,
  Zap,
} from 'lucide-react';
import { MockExamView } from './components/mockExam/MockExamView';
import { SkillstackHomeScreen } from './components/home/SkillstackHomeScreen';
import { SkillstackTextbookView } from './components/textbook/SkillstackTextbookView';
import { ModernDrillSession } from './components/roadmap/ModernDrillSession';
import { ExamType } from './types/mockExam';
import { LessonData } from './types';
import { QuestDrillData } from './data/stageMicroDrills';
import hanmoaLogo from './assets/logo.jpg';
import { sound } from './utils/audioSynth';
import {
  StudyProgressState,
  getInitialStudyProgress,
  saveStudyProgress,
} from './services/studySessionService';
import {
  getDrillForLesson,
  getTodayQuickDrill,
} from './services/drillGeneratorService';

type MainTab = 'home' | 'textbook' | 'exam';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [targetExamId, setTargetExamId] = useState<ExamType | undefined>(undefined);
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);

  // 学習進捗状態（localStorage永続化）
  const [studyProgress, setStudyProgress] = useState<StudyProgressState>(getInitialStudyProgress);

  // 実行中の特訓ドリル
  const [activeDrill, setActiveDrill] = useState<QuestDrillData | null>(null);
  const [currentDrillLessonId, setCurrentDrillLessonId] = useState<string | null>(null);

  // レッスン選択・読了ハンドラ
  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setStudyProgress((prev) => {
      const updated: StudyProgressState = {
        ...prev,
        lastReadLessonId: lessonId,
        readLessonIds: {
          ...prev.readLessonIds,
          [lessonId]: true,
        },
      };
      saveStudyProgress(updated);
      return updated;
    });
  };

  // ドリル完了ハンドラ
  const handleDrillComplete = (score: number, _total: number) => {
    setStudyProgress((prev) => {
      const xpGained = score * 20 + 30;
      const updated: StudyProgressState = {
        ...prev,
        xp: prev.xp + xpGained,
        clearedDrillLessonIds: currentDrillLessonId
          ? { ...prev.clearedDrillLessonIds, [currentDrillLessonId]: true }
          : prev.clearedDrillLessonIds,
      };
      saveStudyProgress(updated);
      return updated;
    });
  };

  // ホームから教科書を開く
  const handleOpenTextbook = (lessonId?: string) => {
    if (lessonId) {
      handleSelectLesson(lessonId);
    }
    setActiveTab('textbook');
  };

  // 課の特訓開始
  const handleStartDrillForLesson = (lesson: LessonData) => {
    const drill = getDrillForLesson(lesson);
    setCurrentDrillLessonId(lesson.id);
    setActiveDrill(drill);
  };

  // 今日の特訓開始
  const handleStartTodayDrill = () => {
    const drill = getTodayQuickDrill();
    setCurrentDrillLessonId(null);
    setActiveDrill(drill);
  };

  const currentLevel = Math.floor(studyProgress.xp / 300) + 1;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* 🌟 Speak × Notion風 洗練されたミニマル・ヘッダー */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#EAE8E3] px-3 sm:px-6 h-13 sm:h-14 flex items-center">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-2">
          {/* ロゴ ＆ 言語バッジ */}
          <div
            onClick={() => {
              sound.playTap();
              setActiveTab('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#EAE8E3] shadow-2xs group-hover:scale-105 transition-all shrink-0 bg-white">
              <img
                src={hanmoaLogo}
                alt="HanMoa Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900 whitespace-nowrap">
                HanMoa
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/80 whitespace-nowrap">
                🇰🇷 韓国語
              </span>
            </div>
          </div>

          {/* 右側：Notion風ステータス ＆ ナビゲーション */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* ストリーク（炎） */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#EAE8E3] text-stone-800 font-bold text-xs shadow-2xs"
              title={`${studyProgress.streakDays}日連続学習中！`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{studyProgress.streakDays}日</span>
            </div>

            {/* XP（稲妻） */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#EAE8E3] text-stone-800 font-bold text-xs shadow-2xs"
              title={`累計獲得経験値: ${studyProgress.xp} XP`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{studyProgress.xp} XP</span>
            </div>

            {/* レベル */}
            <div
              className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-xl bg-white border border-[#EAE8E3] text-stone-600 font-bold text-xs shadow-2xs"
              title={`現在のレベル: Lv.${currentLevel}`}
            >
              <span className="text-[10px] text-stone-500 font-mono">Lv.{currentLevel}</span>
            </div>

            {/* デスクトップ用 ナビゲーション（3タブ セグメントコントロール） */}
            <nav className="hidden sm:flex items-center p-0.5 rounded-xl bg-stone-200/50 border border-[#EAE8E3] shadow-2xs shrink-0 ml-1">
              {[
                { id: 'home' as const, label: 'ホーム', icon: Home },
                { id: 'textbook' as const, label: '教科書', icon: BookOpen },
                { id: 'exam' as const, label: '模試', icon: GraduationCap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setActiveTab(tab.id);
                    }}
                    className={`h-7 px-3 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      isActive
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-900 stroke-[2.2]' : 'stroke-2'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 pb-24 sm:pb-12">
        {activeTab === 'home' ? (
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-7">
            <SkillstackHomeScreen
              progressState={studyProgress}
              onOpenTextbook={handleOpenTextbook}
              onStartDrillForLesson={handleStartDrillForLesson}
              onStartTodayDrill={handleStartTodayDrill}
              onNavigateToExam={() => {
                setTargetExamId(undefined);
                setActiveTab('exam');
              }}
            />
          </div>
        ) : activeTab === 'textbook' ? (
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
            <SkillstackTextbookView
              initialLessonId={selectedLessonId || studyProgress.lastReadLessonId || undefined}
              onSelectLesson={handleSelectLesson}
              onStartDrillForLesson={handleStartDrillForLesson}
              onBackToHome={() => setActiveTab('home')}
            />
          </div>
        ) : activeTab === 'exam' ? (
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
            <MockExamView
              initialExamId={targetExamId}
              onNavigateToTextbookLesson={(lessonId) => {
                handleOpenTextbook(lessonId);
              }}
              onNavigateToDictionary={(dictId) => {
                handleOpenTextbook(dictId);
              }}
              onBackToDashboard={() => setActiveTab('home')}
              onNavigateToRoadmap={() => setActiveTab('home')}
            />
          </div>
        ) : null}
      </main>

      {/* 📱 モバイル下部固定ナビゲーションバー（Speak / Apple風 ミニマルフロストバー） */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#EAE8E3] py-1.5 px-6 flex items-center justify-around shadow-[0_-2px_12px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)]">
        {[
          { id: 'home' as const, label: 'ホーム', icon: Home },
          { id: 'textbook' as const, label: '教科書', icon: BookOpen },
          { id: 'exam' as const, label: '模試', icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playTap();
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive ? 'text-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-stone-200/70 text-stone-900 font-bold'
                    : 'bg-transparent text-stone-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-stone-900' : 'font-medium text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ⚡️ 実戦特訓ドリル モーダルセッション */}
      {activeDrill && (
        <ModernDrillSession
          drill={activeDrill}
          onClose={() => {
            setActiveDrill(null);
            setCurrentDrillLessonId(null);
          }}
          onComplete={handleDrillComplete}
        />
      )}
    </div>
  );
};

export default App;
