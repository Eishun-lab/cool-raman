import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  GraduationCap,
  BookOpen,
  Sparkles,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { MockExamView } from './components/mockExam/MockExamView';
import { VisualRoadmapView } from './components/roadmap/VisualRoadmapView';
import { LibraryHubView } from './components/library/LibraryHubView';
import { ComprehensiveQuizView } from './components/ComprehensiveQuizView';
import { HorangiMascot } from './components/mascot/HorangiMascot';
import { ExamType } from './types/mockExam';
import hanmoaLogo from './assets/logo.jpg';
import {
  GamificationState,
  getInitialGamificationState,
  saveGamificationState,
  calculateLevelInfo,
} from './utils/gamification';
import { sound } from './utils/audioSynth';

type MainTab = 'dashboard' | 'roadmap' | 'exam' | 'library' | 'quiz';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('roadmap');
  const [studyGuideAnchor, setStudyGuideAnchor] = useState<string | undefined>(undefined);
  const [librarySubTab, setLibrarySubTab] = useState<'textbook' | 'numbers'>('textbook');
  const [targetExamId, setTargetExamId] = useState<ExamType | undefined>(undefined);

  // ゲーミフィケーション状態管理（最上位で一元管理）
  const [gameState, setGameState] = useState<GamificationState>(getInitialGamificationState);

  useEffect(() => {
    saveGamificationState(gameState);
  }, [gameState]);

  const levelInfo = useMemo(() => calculateLevelInfo(gameState.xp), [gameState.xp]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col">
      {/* 🌟 Duolingo本家スタイル 一体型スティッキートップバー */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 h-13 sm:h-14 flex items-center shadow-2xs">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-2">
          {/* ロゴ ＆ 言語バッジ */}
          <div
            onClick={() => setActiveTab('roadmap')}
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

          {/* 右側：Duolingo式 ステータス（ストリーク ＆ XP ＆ レベル） ＆ ナビゲーション */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* ストリーク（炎） */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200/90 text-orange-950 font-black text-xs shadow-2xs"
              title={`${gameState.streakDays}日連続学習中！`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{gameState.streakDays}</span>
            </div>

            {/* XP（ジェム/稲妻） */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-950 font-black text-xs shadow-2xs"
              title={`累計獲得経験値: ${gameState.xp} XP`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{gameState.xp}</span>
            </div>

            {/* ランク/レベル */}
            <div
              className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs shadow-2xs"
              title={`現在のランク: ${levelInfo.currentTier.title}`}
            >
              <span className="text-xs">{levelInfo.currentTier.badge}</span>
              <span className="text-[10px] text-slate-600 font-mono">Lv.{Math.floor(gameState.xp / 300) + 1}</span>
            </div>

            {/* デスクトップ用 ナビゲーション（Speak/Apple風 ミニマル・セグメントコントロール） */}
            <nav className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 shadow-2xs shrink-0">
              {[
                { id: 'roadmap' as const, label: 'クエスト', icon: Compass },
                { id: 'exam' as const, label: '模試', icon: GraduationCap },
                { id: 'library' as const, label: '教科書', icon: BookOpen },
                { id: 'quiz' as const, label: '特訓', icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      if (tab.id === 'library') setLibrarySubTab('textbook');
                      setActiveTab(tab.id);
                    }}
                    className={`h-7 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
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
      <main className="flex-1 pb-32 sm:pb-12">
        {activeTab === 'dashboard' ? (
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
            {/* 🐯 Duolingo風 ウェルカムバナー */}
            <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 mb-6 sm:mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <HorangiMascot
                  size="md"
                  mood="cheering"
                  showMessage={false}
                  interactive={true}
                />
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0EC] text-[#B84E34] text-[11px] font-black border border-[#F0D5CD]">
                    <Sparkles className="w-3 h-3" />
                    <span>오늘도 화이팅!（今日もファイト！）</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1B2A38]">
                    韓国語の冒険へようこそ！
                  </h2>
                  <p className="text-xs text-stone-500">
                    30秒の特訓と模擬試験で、楽しく着実に実力を伸ばしましょう。
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className="px-5 py-3 rounded-2xl bg-[#B84E34] hover:bg-[#a2432c] text-white text-xs sm:text-sm font-black shadow-[0_4px_0_#853420] active:translate-y-1 active:shadow-[0_1px_0_#853420] transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>今日のクエストを始める ➔</span>
              </button>
            </div>

            {/* 3大コアピラー カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {/* ① クエストロードマップ */}
              <div
                onClick={() => setActiveTab('roadmap')}
                className="group relative bg-gradient-to-br from-[#1B2A38] to-[#2E4256] text-white rounded-2xl sm:rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-all" />
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Compass className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-1 bg-white/15 text-white text-[11px] font-bold rounded-full backdrop-blur-sm border border-white/20">
                      全8ステージ
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-1.5">
                    クエストロードマップ
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed mb-4">
                    ハングル文字から最上級まで順次解放！明確なDone定義、WBS作業分解、忙しい日の5分縮小プロトコルを完備。
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#1B2A38] px-3.5 py-1.5 rounded-xl shadow self-start">
                  <span>マップを開く ➔</span>
                </div>
              </div>

              {/* ② TOPIK・ハン検 模擬試験 */}
              <div
                onClick={() => {
                  setTargetExamId(undefined);
                  setActiveTab('exam');
                }}
                className="group relative bg-gradient-to-br from-[#B84E34] to-[#8f3a24] text-white rounded-2xl sm:rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-all" />
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-1 bg-white/20 text-white text-[11px] font-bold rounded-full backdrop-blur-sm border border-white/20">
                      全8大公式模試
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-1.5">
                    TOPIK・ハン検 模試
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-white/85 text-xs leading-relaxed mb-4">
                    ハン検（5〜1級 全級完備）、TOPIK I・IIの本格模試。合否判定とCan-Do学習カルテ（根拠と道筋）を即時発行。
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#B84E34] px-3.5 py-1.5 rounded-xl shadow self-start">
                  <span>模試に挑む ➔</span>
                </div>
              </div>

              {/* ③ 逆引きライブラリ */}
              <div
                onClick={() => {
                  setLibrarySubTab('textbook');
                  setActiveTab('library');
                }}
                className="group relative bg-white border border-stone-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#FAF0EC] text-[#B84E34] flex items-center justify-center border border-[#F0D5CD]">
                      <BookOpen className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[11px] font-bold rounded-full border border-stone-200">
                      文法大辞典・数字
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                    逆引きライブラリ
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    40課の体系文法、250項目の表現大辞典、漢数詞・固有数詞特化ガイドを一元化。特訓や模試から直結検索。
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B84E34] self-start">
                  <span>ライブラリを見る ➔</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'roadmap' ? (
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
            <VisualRoadmapView
              gameState={gameState}
              setGameState={setGameState}
              onNavigateToExam={(examId) => {
                if (examId) setTargetExamId(examId as ExamType);
                setActiveTab('exam');
              }}
              onNavigateToContent={(id, tab) => {
                setStudyGuideAnchor(id);
                setLibrarySubTab('textbook');
                setActiveTab('library');
              }}
            />
          </div>
        ) : activeTab === 'exam' ? (
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
            <MockExamView
              initialExamId={targetExamId}
              onNavigateToTextbookLesson={(lessonId) => {
                setStudyGuideAnchor(lessonId);
                setLibrarySubTab('textbook');
                setActiveTab('library');
              }}
              onNavigateToDictionary={(dictId) => {
                setStudyGuideAnchor(dictId);
                setLibrarySubTab('textbook');
                setActiveTab('library');
              }}
              onBackToDashboard={() => setActiveTab('roadmap')}
              onNavigateToRoadmap={() => setActiveTab('roadmap')}
            />
          </div>
        ) : activeTab === 'library' ? (
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
            <LibraryHubView
              initialAnchor={studyGuideAnchor}
              initialSubTab={librarySubTab}
              onNavigateToExam={(examId) => {
                if (examId) setTargetExamId(examId as ExamType);
                setActiveTab('exam');
              }}
              onBackToDashboard={() => setActiveTab('roadmap')}
            />
          </div>
        ) : activeTab === 'quiz' ? (
          <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-800">ジャンル別 実力テスト</h2>
                <p className="text-xs sm:text-sm text-stone-500">四択テストで弱点を即座にあぶり出し定着</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className="text-xs font-bold px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl shadow-2xs shrink-0 cursor-pointer"
              >
                探訪マップへ戻る
              </button>
            </div>
            <ComprehensiveQuizView />
          </div>
        ) : null}
      </main>

      {/* 📱 モバイル下部固定ナビゲーションバー（Speak/Apple風 クリーン・フロストバー） */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-1 px-3 flex items-center justify-around shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
        {[
          { id: 'roadmap' as const, label: 'クエスト', icon: Compass },
          { id: 'exam' as const, label: '模試', icon: GraduationCap },
          { id: 'library' as const, label: '教科書', icon: BookOpen },
          { id: 'quiz' as const, label: '特訓', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playTap();
                if (tab.id === 'library') {
                  setLibrarySubTab('textbook');
                }
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
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
    </div>
  );
};

export default App;
