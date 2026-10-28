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

  // 学習進捗状態（SkillStack準拠：localStorage永続化）
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col">
      {/* 🌟 洗練されたスティッキー・トップバー（SkillStack / Speakスタイル） */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 h-13 sm:h-14 flex items-center shadow-2xs">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-2">
          {/* ロゴ ＆ 言語バッジ */}
          <div
            onClick={() => {
              sound.playTap();
              setActiveTab('home');
            }}
            className="flex items-center gap-2 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group-hover:scale-105 transition-all shrink-0 bg-white">
              <img
                src={hanmoaLogo}
                alt="HanMoa Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 whitespace-nowrap">
                HanMoa
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 whitespace-nowrap">
                🇰🇷 韓国語
              </span>
            </div>
          </div>

          {/* 右側：ステータス（ストリーク ＆ XP ＆ レベル） ＆ ナビゲーション */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* ストリーク（炎） */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200/90 text-orange-950 font-black text-xs shadow-2xs"
              title={`${studyProgress.streakDays}日連続学習中！`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{studyProgress.streakDays}日</span>
            </div>

            {/* XP（稲妻） */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-950 font-black text-xs shadow-2xs"
              title={`累計獲得経験値: ${studyProgress.xp} XP`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{studyProgress.xp} XP</span>
            </div>

            {/* レベル */}
            <div
              className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs shadow-2xs"
              title={`現在のレベル: Lv.${currentLevel}`}
            >
              <span className="text-[10px] text-slate-600 font-mono">Lv.{currentLevel}</span>
            </div>

            {/* デスクトップ用 ナビゲーション（3タブ セグメントコントロール） */}
            <nav className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 shadow-2xs shrink-0 ml-1">
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
                    className={`h-7 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'stroke-2'}`} />
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
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
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

      {/* 📱 モバイル下部固定ナビゲーションバー（3タブ ミニマルフロストバー） */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-1.5 px-6 flex items-center justify-around shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
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
                isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'bg-transparent text-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-emerald-800' : 'font-medium text-slate-500'
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
