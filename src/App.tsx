import React, { useState } from 'react';
import {
  Home,
  Compass,
  GraduationCap,
  BookOpen,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { MockExamView } from './components/mockExam/MockExamView';
import { VisualRoadmapView } from './components/roadmap/VisualRoadmapView';
import { LibraryHubView } from './components/library/LibraryHubView';
import { ComprehensiveQuizView } from './components/ComprehensiveQuizView';
import { ExamType } from './types/mockExam';
import hanmoaLogo from './assets/logo.jpg';

type MainTab = 'dashboard' | 'roadmap' | 'exam' | 'library' | 'quiz';

const NAV_ITEMS = [
  { id: 'dashboard' as const, label: 'ホーム', icon: Home },
  { id: 'roadmap' as const, label: 'クエスト', icon: Compass },
  { id: 'exam' as const, label: '模擬試験', icon: GraduationCap },
  { id: 'library' as const, label: 'ライブラリ', icon: BookOpen },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [studyGuideAnchor, setStudyGuideAnchor] = useState<string | undefined>(undefined);
  const [librarySubTab, setLibrarySubTab] = useState<'textbook' | 'numbers'>('textbook');
  const [targetExamId, setTargetExamId] = useState<ExamType | undefined>(undefined);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B2A38] font-sans flex flex-col">
      {/* トップヘッダー */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] px-3 sm:px-6 h-14 sm:h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          {/* ロゴ */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-2xs group-hover:scale-105 transition-all shrink-0 bg-[#FAF7F2]">
              <img
                src={hanmoaLogo}
                alt="HanMoa Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-base sm:text-xl tracking-tight text-[#1B2A38] whitespace-nowrap">
                  HanMoa
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD] whitespace-nowrap">
                  All-in-One Hub
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden lg:block leading-tight">
                韓国語 総合学習 ＆ TOPIK・ハン検 模擬試験ハブ
              </p>
            </div>
          </div>

          {/* デスクトップ ナビゲーション */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 shrink-0">
            {NAV_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  title={tab.label}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#B84E34] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 pb-20 md:pb-8">
        {activeTab === 'dashboard' ? (
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
            {/* ヒーローセクション */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD] text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> 韓国語を体系的に完全制覇
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1B2A38] tracking-tight mb-4 leading-tight">
                知識を網羅し、<br />テストで実力を証明する。
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                全8ステージの冒険クエスト・公式模擬試験・逆引きライブラリを完全統合。<br className="hidden sm:inline" />
                受動的な暗記を脱却し、Can-Do診断とマイクロ特訓で最短合格へ導きます。
              </p>
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
                      全6大公式模試
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-1.5">
                    TOPIK・ハン検 模試
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-white/85 text-xs leading-relaxed mb-4">
                    ハン検（5〜準2級）、TOPIK I・IIの本格模試。合否判定とCan-Do学習カルテ（根拠と道筋）を即時発行。
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
              onBackToDashboard={() => setActiveTab('dashboard')}
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
              onBackToDashboard={() => setActiveTab('dashboard')}
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
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-bold px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl shadow-2xs shrink-0 cursor-pointer"
              >
                ホームへ戻る
              </button>
            </div>
            <ComprehensiveQuizView />
          </div>
        ) : null}
      </main>

      {/* モバイル用 固定ボトムナビゲーション (画面下部で親指タップ・全幅利用) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D5] px-2 py-1 flex items-center justify-around shadow-lg">
        {NAV_ITEMS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#B84E34] font-black'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-[#FAF0EC]' : ''}`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[10px] tracking-tight leading-tight mt-0.5 ${isActive ? 'font-black' : ''}`}>
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
