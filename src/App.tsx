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
import { LevelCheckModal } from './components/levelCheck/LevelCheckModal';

type MainTab = 'dashboard' | 'levelCheck' | 'textbook' | 'numbers' | 'quiz';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [isLevelCheckModalOpen, setIsLevelCheckModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B2A38] font-sans flex flex-col">
      {/* 🍜 トップヘッダー */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#B84E34] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-all">
              🍜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#1B2A38]">
                  クールラーメン
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
                  Korean Master Hub
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                韓国語 総合テスト ＆ 完全攻略リファレンス大辞典
              </p>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'dashboard', label: 'ホーム', icon: '🏠' },
              { id: 'levelCheck', label: '総合レベル診断', icon: '⏱️' },
              { id: 'textbook', label: '教科書・大辞典', icon: '📖' },
              { id: 'numbers', label: '数字攻略', icon: '🔢' },
              { id: 'quiz', label: '実力テスト', icon: '🎯' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'levelCheck') {
                    setIsLevelCheckModalOpen(true);
                  } else {
                    setActiveTab(tab.id as MainTab);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#B84E34] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
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
                5分総合診断テストと実力テストで、あなたの現在地と弱点を可視化します。
              </p>
            </div>

            {/* 4大コア機能カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* ① 総合診断 */}
              <div
                onClick={() => setIsLevelCheckModalOpen(true)}
                className="group relative bg-gradient-to-br from-[#B84E34] to-[#8f3a24] text-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-all" />
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                    ⏱️
                  </div>
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                    所要時間 5分
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  総合レベル診断テスト
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  語彙・文法・リスニング・会話理解の4領域を5分で徹底測定。
                  レーダーチャートで弱点を即座に分析し、学習ロードマップをご案内します。
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold bg-white text-[#B84E34] px-4 py-2 rounded-xl shadow">
                  <span>今すぐ診断を始める</span>
                </div>
              </div>

              {/* ② 体系教科書＆大辞典 */}
              <div
                onClick={() => setActiveTab('textbook')}
                className="group relative bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl border border-amber-200">
                    📖
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full">
                    全15課 ＋ 8大リファレンス
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
                  完全攻略 教科書＆大辞典
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  初級から上級までの体系文法、コロケーション、紛らわしい表現、キラーフレーズ、
                  新造語・スラング、四字熟語を辞書形式で一発検索・学習できます。
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#B84E34]">
                  <span>教科書を開く ➔</span>
                </div>
              </div>

              {/* ③ 数字完全攻略 */}
              <div
                onClick={() => setActiveTab('numbers')}
                className="group relative bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl border border-emerald-200">
                    🔢
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full">
                    漢数詞 ＆ 固有数詞
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
                  数字完全攻略ガイド
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  韓国語学習者が最もつまずきやすい「漢数詞」「固有数詞」「助数詞」「時間・日付」を
                  一目で判別・即答できるように整理された特化リファレンスです。
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#B84E34]">
                  <span>数字ガイドを見る ➔</span>
                </div>
              </div>

              {/* ④ 実力テスト（クイズ） */}
              <div
                onClick={() => setActiveTab('quiz')}
                className="group relative bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl border border-purple-200">
                    🎯
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full">
                    ランダム四択クイズ
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
                  ジャンル別 実力テスト
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#B84E34]" />
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  必修単語、文法、日常チャンク、キラーフレーズ、四字熟語からランダム出題。
                  ネイティブ音声を聞きながら、テンポよく解いて定着度を確かめられます。
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#B84E34]">
                  <span>クイズに挑戦する ➔</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'textbook' ? (
          <StudyGuideView
            onBackToNote={() => setActiveTab('dashboard')}
            onOpenLevelCheck={() => setIsLevelCheckModalOpen(true)}
          />
        ) : activeTab === 'numbers' ? (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-stone-800">数字完全攻略マスター</h2>
                <p className="text-sm text-stone-500">漢数詞・固有数詞・時刻・日付の完全攻略ガイド</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-bold px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                ホームへ戻る
              </button>
            </div>
            <KoreanNumbersGuideView showPronunciation={true} isLargeFont={false} />
          </div>
        ) : activeTab === 'quiz' ? (
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black text-stone-800">ジャンル別 実力テスト</h2>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-bold px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                ホームへ戻る
              </button>
            </div>
            <ComprehensiveQuizView />
          </div>
        ) : null}
      </main>

      {/* ⏱️ 5分総合レベル診断モーダル */}
      <LevelCheckModal
        isOpen={isLevelCheckModalOpen}
        onClose={() => setIsLevelCheckModalOpen(false)}
        onNavigateToLesson={() => {
          setIsLevelCheckModalOpen(false);
          setActiveTab('textbook');
        }}
      />
    </div>
  );
};

export default App;
