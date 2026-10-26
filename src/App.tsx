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
import hanmoaLogo from './assets/logo.jpg';

type MainTab = 'dashboard' | 'textbook' | 'exam' | 'numbers' | 'quiz';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [studyGuideAnchor, setStudyGuideAnchor] = useState<string | undefined>(undefined);

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

            {/* 3大コア機能カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {/* ① TOPIK・ハン検 模擬試験 */}
              <div
                onClick={() => setActiveTab('exam')}
                className="group relative bg-gradient-to-br from-[#B84E34] to-[#8f3a24] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-all" />
                <div>
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl">
                      🎓
                    </div>
                    <span className="px-2.5 sm:px-3 py-1 bg-white/20 text-white text-[11px] sm:text-xs font-bold rounded-full backdrop-blur-sm">
                      TOPIK ＆ ハン検 4大模試
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                    TOPIK・ハン検 模擬試験
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
                    TOPIK I・II、ハングル検定（4/5級・3/準2級）の制限時間付き本格模擬試験。
                    リスニング音声、自動採点・合否判定、教科書・辞書への復習リンクを完備。
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-white text-[#B84E34] px-3.5 sm:px-4 py-2 rounded-xl shadow self-start">
                  <span>模擬試験に挑む ➔</span>
                </div>
              </div>

              {/* ② 体系教科書＆大辞典 */}
              <div
                onClick={() => setActiveTab('textbook')}
                className="group relative bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl sm:text-2xl border border-amber-200">
                      📖
                    </div>
                    <span className="px-2.5 sm:px-3 py-1 bg-stone-100 text-stone-600 text-[11px] sm:text-xs font-bold rounded-full">
                      全40課 ＋ 8大リファレンス
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
                    完全攻略 教科書＆大辞典
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                    初級から上級までの体系文法、コロケーション、紛らわしい表現、キラーフレーズ、
                    新造語・スラング、四字熟語を辞書形式で一発検索・学習できます。
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#B84E34] self-start">
                  <span>教科書を開く ➔</span>
                </div>
              </div>

              {/* ③ 数字完全攻略 */}
              <div
                onClick={() => setActiveTab('numbers')}
                className="group relative bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl sm:text-2xl border border-emerald-200">
                      🔢
                    </div>
                    <span className="px-2.5 sm:px-3 py-1 bg-stone-100 text-stone-600 text-[11px] sm:text-xs font-bold rounded-full">
                      漢数詞 ＆ 固有数詞
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
                    数字完全攻略ガイド
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                    韓国語学習者が最もつまずきやすい「漢数詞」「固有数詞」「助数詞」「時間・日付」を
                    一目で判別・即答できるように整理された特化リファレンスです。
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#B84E34] self-start">
                  <span>数字ガイドを見る ➔</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'textbook' ? (
          <StudyGuideView
            onBackToNote={() => setActiveTab('dashboard')}
            initialAnchor={studyGuideAnchor}
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
