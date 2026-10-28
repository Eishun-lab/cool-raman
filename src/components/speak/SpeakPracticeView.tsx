import React from 'react';
import {
  Zap,
  Volume2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

export const SpeakPracticeView: React.FC<{ onStartDrill: () => void }> = ({
  onStartDrill,
}) => {
  const savedPhrases = [
    { ko: '괜찮아요!', reading: 'ケンチャナヨ', ja: '大丈夫ですよ！' },
    { ko: '진짜요?! 대박!', reading: 'チンチャヨ？！テバク！', ja: '本当ですか？！すごい！' },
    { ko: '아이스 아메리카노 한 잔 주세요.', reading: 'アイス アメリカーノ ハン ジャン ジュセヨ', ja: 'アイスアメリカーノ1杯ください。' },
    { ko: '밥 먹었어?', reading: 'パン モゴッソ？', ja: 'ご飯食べた？' },
    { ko: '너무 좋아요!', reading: 'ノム チョアヨ！', ja: 'めっちゃいいですね！' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-32 max-w-md mx-auto px-4 pt-4 space-y-6 select-none animate-fadeIn">
      <header className="pb-2 border-b border-slate-800/80">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
          PRACTICE & REVIEW
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          연습（スピーキング反復）
        </h1>
      </header>

      {/* 今日の3分スピード特訓 */}
      <div className="bg-gradient-to-br from-[#1C2333] to-[#121824] border border-[#2A354D] rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span>3分スピード発音ワークアウト</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          即答スピーキング特訓
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          日本語を見て1秒以内に韓国語が口から出るか反射神経をテスト。
        </p>
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onStartDrill();
          }}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#0B0E14] font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          <span>特訓を開始する</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 保存した重要フレーズ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-400" />
            <span>保存した重要フレーズ</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">全5件</span>
        </div>

        <div className="space-y-2">
          {savedPhrases.map((phrase, idx) => (
            <div
              key={idx}
              onClick={() => {
                sound.playTap();
                speechService.speak(phrase.ko);
              }}
              className="p-4 rounded-2xl bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] flex items-center justify-between gap-3 cursor-pointer group transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {phrase.ko}
                </span>
                <span className="text-[11px] font-mono text-slate-400 block">
                  {phrase.reading}
                </span>
                <span className="text-xs text-slate-400 block pt-0.5">
                  {phrase.ja}
                </span>
              </div>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakPracticeView;
