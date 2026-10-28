import React from 'react';
import {
  Flame,
  Zap,
  Award,
  CheckCircle2,
  Calendar,
  Settings,
} from 'lucide-react';

export const SpeakProfileView: React.FC<{ streak: number; xp: number }> = ({
  streak,
  xp,
}) => {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-32 max-w-md mx-auto px-4 pt-4 space-y-6 select-none animate-fadeIn">
      <header className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            MY PROFILE
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            프로필（マイページ）
          </h1>
        </div>
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </header>

      {/* ユーザーカード */}
      <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 flex items-center gap-4 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xl font-black text-white shadow-lg">
          🇰🇷
        </div>
        <div>
          <h2 className="text-base font-bold text-white">韓国語スピーカー</h2>
          <span className="text-xs text-blue-400 font-medium">初級スピーキングコース 受講中</span>
        </div>
      </div>

      {/* 統計リボン */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141A26] border border-[#232B3C] rounded-2xl p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> 連続学習
          </span>
          <span className="text-2xl font-black text-white font-mono">{streak} 日</span>
        </div>

        <div className="bg-[#141A26] border border-[#232B3C] rounded-2xl p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> 獲得経験値
          </span>
          <span className="text-2xl font-black text-white font-mono">{xp} XP</span>
        </div>
      </div>

      {/* 学習方針・マインドセット */}
      <div className="bg-blue-950/30 border border-blue-500/20 rounded-2xl p-4 space-y-1.5 text-xs text-slate-300 leading-relaxed">
        <span className="font-bold text-blue-300 block">💡 スピーク式スピーキング学習法:</span>
        <p>
          資格試験の丸暗記ではなく、「実際に声に出して会話する」ことだけにフォーカスします。1日3分の反復で、口から自然に韓国語が飛び出す感覚を身につけましょう。
        </p>
      </div>
    </div>
  );
};

export default SpeakProfileView;
