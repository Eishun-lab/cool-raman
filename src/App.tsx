import React, { useState } from 'react';
import {
  Flame,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { HankenHomeScreen } from './components/home/HankenHomeScreen';
import { HankenTextbookView } from './components/textbook/HankenTextbookView';
import { MockExamView } from './components/mockExam/MockExamView';
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

type MainView = 'home' | 'textbook' | 'exam';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<MainView>('home');
  const [targetExamId, setTargetExamId] = useState<ExamType>('hanken_5');
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);

  // 学習進捗（localStorage永続化）
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
  const handleDrillComplete = (score: number) => {
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
    setActiveDrill(null);
  };

  // ホームから教科書を開く
  const handleOpenTextbook = (lessonId?: string) => {
    if (lessonId) {
      handleSelectLesson(lessonId);
    }
    setActiveView('textbook');
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

  // 模試開始
  const handleStartMockExam = (examId: 'hanken_5' | 'hanken_4' | 'hanken_3') => {
    setTargetExamId(examId);
    setActiveView('exam');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2A2421] font-sans flex flex-col antialiased selection:bg-[#FAF0EC] selection:text-[#B84E34]">
      {/* 🌟 伝統工芸の余白・品格に調和した大人のヘッダー */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4DA] px-3.5 sm:px-6 h-14 flex items-center">
        <div className="max-w-xl mx-auto w-full flex items-center justify-between gap-2">
          {/* 左側：ロゴ ＆ アプリ名（または戻るボタン） */}
          <div className="flex items-center gap-2 select-none min-w-0">
            {activeView !== 'home' ? (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setActiveView('home');
                }}
                className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-white border border-[#EAE4DA] text-xs font-bold text-stone-700 hover:text-[#B84E34] transition-all cursor-pointer shadow-2xs shrink-0"
              >
                <ChevronLeft className="w-4 h-4 text-stone-500" />
                <span>ホーム</span>
              </button>
            ) : null}

            <div
              onClick={() => {
                sound.playTap();
                setActiveView('home');
              }}
              className="flex items-center gap-2 cursor-pointer group min-w-0"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#EAE4DA] shadow-2xs group-hover:scale-105 transition-all shrink-0 bg-white">
                <img
                  src={hanmoaLogo}
                  alt="HanMoa Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-serif-title font-bold text-lg tracking-tight text-[#2A2421] shrink-0">
                  HanMoa
                </span>
                {activeView === 'home' && (
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD] whitespace-nowrap">
                    ハン検 特化
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 右側：ストリーク ＆ XP（洗練されたインジケータ） */}
          <div className="flex items-center gap-2 shrink-0 select-none">
            {/* ストリーク（細線・落ち着いた朱色） */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#EAE4DA] text-stone-800 text-xs shadow-2xs"
              title={`${studyProgress.streakDays}日連続学習中`}
            >
              <Flame className="w-3.5 h-3.5 text-[#B84E34]" />
              <span className="font-mono font-bold text-[11px] text-stone-700">
                {studyProgress.streakDays}日
              </span>
            </div>

            {/* XP（落ち着いたアンバーゴールド） */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#EAE4DA] text-stone-800 text-xs shadow-2xs"
              title={`累計経験値: ${studyProgress.xp} XP`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono font-bold text-[11px] text-stone-700">
                {studyProgress.xp} XP
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6">
        {activeView === 'home' && (
          <HankenHomeScreen
            progressState={studyProgress}
            onOpenTextbook={handleOpenTextbook}
            onStartDrillForLesson={handleStartDrillForLesson}
            onStartTodayDrill={handleStartTodayDrill}
            onStartMockExam={handleStartMockExam}
          />
        )}

        {activeView === 'textbook' && (
          <HankenTextbookView
            initialLessonId={selectedLessonId || studyProgress.lastReadLessonId || undefined}
            onSelectLesson={handleSelectLesson}
            onStartDrillForLesson={handleStartDrillForLesson}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'exam' && (
          <MockExamView
            initialExamId={targetExamId}
            onNavigateToTextbookLesson={(lessonId) => {
              handleOpenTextbook(lessonId);
            }}
            onNavigateToDictionary={(dictId) => {
              handleOpenTextbook(dictId);
            }}
            onBackToDashboard={() => setActiveView('home')}
            onNavigateToRoadmap={() => setActiveView('home')}
          />
        )}
      </main>

      {/* ⚡ 実戦特訓ドリル モーダルセッション */}
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
