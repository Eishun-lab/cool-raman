import React from 'react';
import {
  Play,
  Mic,
  MessageCircle,
  MoreHorizontal,
  Flame,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { SpeakUnit, SpeakLesson, SPEAK_UNITS } from '../../data/speakCurriculum';
import { sound } from '../../utils/audioSynth';

interface SpeakHomeScreenProps {
  currentStreak: number;
  onStartLesson: (lesson: SpeakLesson) => void;
  onOpenFreeTalk: () => void;
}

export const SpeakHomeScreen: React.FC<SpeakHomeScreenProps> = ({
  currentStreak,
  onStartLesson,
  onOpenFreeTalk,
}) => {
  const currentUnit = SPEAK_UNITS[0];
  const activeLesson = currentUnit.lessons[0];
  const nextUnit = SPEAK_UNITS[1];
  const nextLesson = nextUnit.lessons[0];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-32 select-none relative overflow-x-hidden">
      {/* 🌟 Speak本家スタイル 一体型トップバー */}
      <header className="sticky top-0 z-40 bg-[#0A0D14]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        {/* コースセレクター */}
        <button
          type="button"
          onClick={() => sound.playTap()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B26] border border-[#232936] text-xs font-bold text-slate-100 hover:bg-[#1E2535] transition-all cursor-pointer"
        >
          <span className="text-sm">🇰🇷</span>
          <span>韓国語スピーキング</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* ストリーク（炎） */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B26] border border-[#232936] text-xs font-bold text-slate-200">
          <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-slate-400'}`} />
          <span>{currentStreak}</span>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-md mx-auto px-4 pt-4 space-y-6">
        {/* ===================================================================== */}
        {/* 1. ユニット1 ヘッダー                                                 */}
        {/* ===================================================================== */}
        <div className="space-y-1 text-left px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            유닛 {currentUnit.unitNumber}（ユニット {currentUnit.unitNumber}）
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {currentUnit.titleKo}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {currentUnit.titleJa}
          </p>
        </div>

        {/* ===================================================================== */}
        {/* 2. 講師アバター付き レッスン導入吹き出しバブル                         */}
        {/* ===================================================================== */}
        <div className="flex justify-center pt-2">
          <div className="relative inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#1643A0] text-white shadow-lg border border-[#2257C5]/40 max-w-xs">
            {/* アバター */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 shrink-0">
              <img
                src={activeLesson.tutorAvatar}
                alt={activeLesson.tutorName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* プロンプト */}
            <span className="text-sm font-bold tracking-tight">
              {activeLesson.bubblePrompt}
            </span>

            {/* 下向きポインタ */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1643A0] rotate-45 border-r border-b border-[#2257C5]/40" />
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. Speak本家そのままの メインアクティブカード (Royal Blue)            */}
        {/* ===================================================================== */}
        <div className="relative rounded-[32px] bg-gradient-to-b from-[#1249C7] via-[#0E3EAF] to-[#0A308B] p-6 text-white shadow-2xl border border-blue-400/20 overflow-hidden space-y-6">
          {/* 背景の微妙なグロー光 */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* 右上のその他メニュー */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* メインフレーズ */}
          <div className="text-center space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
              {activeLesson.keyPhrase}
            </h2>
            <p className="text-sm text-blue-100/90 font-medium pt-0.5">
              {activeLesson.keyPhraseJa}
            </p>
          </div>

          {/* 3つの学習ステップ アイコンノード (動画解説・発音練習・実戦会話) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
            {/* 1. ビデオ/音声レッスン (アクティブ) */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-white text-[#1249C7] flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer">
                <Play className="w-7 h-7 fill-[#1249C7] ml-1" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight">
                비디오 레슨
              </span>
            </div>

            {/* 2. スピーキング練習 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-blue-900/60 border border-white/10 text-white/70 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-white/70 tracking-tight">
                스피킹
              </span>
            </div>

            {/* 3. 実戦会話ロールプレイ */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-blue-900/60 border border-white/10 text-white/70 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-white/70 tracking-tight">
                실전 대화
              </span>
            </div>
          </div>

          {/* 開始ボタン (시작하기 - 純白のボールドCTA) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onStartLesson(activeLesson);
              }}
              className="w-full py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#0F3AA3] font-black text-base shadow-lg active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>시작하기（はじめる）</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. ユニット区切り線（ドットライン）                                   */}
        {/* ===================================================================== */}
        <div className="flex items-center justify-center gap-3 py-6 text-slate-500">
          <div className="w-16 border-b border-dotted border-slate-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            유닛 {nextUnit.unitNumber}
          </span>
          <div className="w-16 border-b border-dotted border-slate-700" />
        </div>

        {/* ユニット2 タイトル */}
        <div className="text-center space-y-0.5">
          <h3 className="text-base font-bold text-slate-400">
            {nextUnit.titleKo}
          </h3>
          <p className="text-xs text-slate-500">
            {nextUnit.titleJa}
          </p>
        </div>

        {/* ===================================================================== */}
        {/* 5. 次のレッスンバブル（未解放・非アクティブ状態）                    */}
        {/* ===================================================================== */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onStartLesson(nextLesson);
            }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#1B2232] hover:bg-[#222B3E] border border-slate-800 text-slate-300 shadow-md transition-all cursor-pointer max-w-xs"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 shrink-0 opacity-80">
              <img
                src={nextLesson.tutorAvatar}
                alt={nextLesson.tutorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-200 block">
                {nextLesson.bubblePrompt}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {nextLesson.keyPhrase}
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* 6. 右下固定 フローティング AIチューター オーブ (Speak AI Mascot)      */}
      {/* ===================================================================== */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onOpenFreeTalk();
          }}
          className="relative w-15 h-15 rounded-full bg-gradient-to-tr from-[#1E5EFF] via-[#3582FF] to-[#60A5FA] shadow-[0_8px_25px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
          title="AIと韓国語で自由に会話する（フリートーク）"
        >
          {/* 光のパルス */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25 pointer-events-none" />

          {/* AIの目（Speakキャラクターの顔） */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-3.5 bg-white rounded-full group-hover:scale-110 transition-transform" />
            <div className="w-2.5 h-3.5 bg-white rounded-full group-hover:scale-110 transition-transform" />
          </div>

          {/* ミニバッジ */}
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-black text-white shadow">
            AI
          </span>
        </button>
      </div>
    </div>
  );
};

export default SpeakHomeScreen;
