import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Hash,
  Brain,
  Sparkles,
  Award,
  ChevronRight,
  Flame,
  Volume2
} from 'lucide-react';
import { StudyGuideView } from './components/StudyGuideView';
import { KoreanNumbersGuideView } from './components/KoreanNumbersGuideView';
import { ComprehensiveQuizView } from './components/ComprehensiveQuizView';
import { MockExamView } from './components/mockExam/MockExamView';
import { VisualRoadmapView } from './components/roadmap/VisualRoadmapView';
import { ExamType } from './types/mockExam';
import hanmoaLogo from './assets/logo.jpg';

type MainTab = 'dashboard' | 'roadmap' | 'textbook' | 'exam' | 'numbers' | 'quiz';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [studyGuideAnchor, setStudyGuideAnchor] = useState<string | undefined>(undefined);
  const [targetExamId, setTargetExamId] = useState<ExamType | undefined>(undefined);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B2A38] font-sans flex flex-col">
      {/* 🍜 トップヘッダー */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] px-3 sm:px-6 h-14 sm:h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          {/* ロゴ */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-xs group-hover:scale-105 transition-all shrink-0 bg-[#FAF7F2]">
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

          {/* ナビゲーション */}
          <nav className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {[
              { id: 'dashboard', label: 'ホーム', icon: '🏠' },
              { id: 'roadmap', label: 'ロードマップ', icon: '🗺️' },
              { id: 'textbook', label: '教科書・大辞典', icon: '📖' },
              { id: 'exam', label: '模擬試験', icon: '🎓' },
              { id: 'numbers', label: '数字攻略', icon: '🔢' },
            ].map(tab => (
              <button
                key={tab.id}
                title={tab.label}
                onClick={() => setActiveTab(tab.id as MainTab)}
                className={`h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 ${
                  activeTab === tab.id
                    ? 'bg-[#B84E34] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <span className="text-sm sm:text-base leading-none shrink-0">{tab.icon}</span>
                <span className="hidden md:inline whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">
        {activeTab === 'dashboard' ? (
          <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
            {/* ヒーローセクション */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> 韓国語を体系的に完全制覇
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1B2A38] tracking-tight mb-4">
                知識を網羅し、<br />テストで実力を証明する。
              </h1>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                入門から上級までの文法・語彙・コロケーション・スラング・数字を完全網羅。
                5分総合診断テストとTOPIK・ハン検模擬試験で、あなたの現在地と実力を証明します。
              </p>
            </div>

            {/* 4大コア機能カード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {/* ① 完全制覇ロードマップ */}
              <div
                onClick={() => setActiveTab('roadmap')}
                className="group relative bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl sm:rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-all" />
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl">
                      🗺️
                    </div>
                    <span className="px-2.5 py-1 bg-white/20 text-white text-[11px] font-bold rounded-full backdrop-blur-sm">
                      クエスト形式
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-1.5">
                    完全制覇ロードマップ
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-white/85 text-xs leading-relaxed mb-4">
                    全8ステージの冒険クエスト！明確なDone定義、WBS作業分解、忙しい日の5分縮小プロトコルを完備。
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-emerald-800 px-3 py-1.5 rounded-xl shadow self-start">
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl">
                      🎓
                    </div>
                    <span className="px-2.5 py-1 bg-white/20 text-white text-[11px] font-bold rounded-full backdrop-blur-sm">
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
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#B84E34] px-3 py-1.5 rounded-xl shadow self-start">
                  <span>模試に挑む ➔</span>
                </div>
              </div>

              {/* ③ 体系教科書＆大辞典 */}
              <div
                onClick={() => setActiveTab('textbook')}
                className="group relative bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl sm:text-2xl border border-amber-200">
                      📖
                    </div>
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[11px] font-bold rounded-full">
                      全40課＋辞書
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                    教科書＆大辞典
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    初級から上級文法、コロケーション、キラーフレーズ、新造語・スラング、四字熟語を一発検索。
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B84E34] self-start">
                  <span>教科書を開く ➔</span>
                </div>
              </div>

              {/* ④ 数字完全攻略 */}
              <div
                onClick={() => setActiveTab('numbers')}
                className="group relative bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl sm:text-2xl border border-emerald-200">
                      🔢
                    </div>
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[11px] font-bold rounded-full">
                      漢数詞・固有数詞
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                    数字完全攻略ガイド
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    漢数詞、固有数詞、助数詞、時間・日付のつまずきを一目で判別・即答できる特化ガイド。
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B84E34] self-start">
                  <span>数字ガイドを見る ➔</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'roadmap' ? (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-4">
            <VisualRoadmapView
              onNavigateToExam={(examId) => {
                if (examId) setTargetExamId(examId as ExamType);
                setActiveTab('exam');
              }}
              onNavigateToContent={(id, tab) => {
                setStudyGuideAnchor(id);
                setActiveTab('textbook');
              }}
            />
          </div>
        ) : activeTab === 'textbook' ? (
          <StudyGuideView
            onBackToNote={() => setActiveTab('dashboard')}
            initialAnchor={studyGuideAnchor}
            onNavigateToExam={(examId) => {
              if (examId) setTargetExamId(examId as ExamType);
              setActiveTab('exam');
            }}
          />
        ) : activeTab === 'numbers' ? (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-800">数字完全攻略マスター</h2>
                <p className="text-xs sm:text-sm text-stone-500">漢数詞・固有数詞・時刻・日付の完全攻略ガイド</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-bold px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl shadow-2xs shrink-0 cursor-pointer"
              >
                ホームへ戻る
              </button>
            </div>
            <KoreanNumbersGuideView showPronunciation={true} isLargeFont={false} />
          </div>
        ) : activeTab === 'exam' ? (
          <div className="py-6">
            <MockExamView
              initialExamId={targetExamId}
              onNavigateToTextbookLesson={(lessonId) => {
                setStudyGuideAnchor(lessonId);
                setActiveTab('textbook');
              }}
              onNavigateToDictionary={(dictId) => {
                setStudyGuideAnchor(dictId);
                setActiveTab('textbook');
              }}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          </div>
        ) : activeTab === 'quiz' ? (
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-3 sm:px-6 mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-800">ジャンル別 実力テスト</h2>
                <p className="text-xs sm:text-sm text-stone-500">四択テストで弱点を即座にあぶり出し定着</p>
              </div>
              <button
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
    </div>
  );
};

export default App;
