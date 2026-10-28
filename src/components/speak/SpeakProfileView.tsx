import React, { useState } from 'react';
import {
  Settings,
  Crown,
  MessageSquare,
  Clock,
  BookOpen,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../utils/audioSynth';

interface SpeakProfileViewProps {
  streak: number;
  xp: number;
}

export const SpeakProfileView: React.FC<SpeakProfileViewProps> = ({
  streak,
  xp,
}) => {
  const [spokenCount, setSpokenCount] = useState(xp > 0 ? Math.floor(xp / 10) : 12);
  const [studyMinutes, setStudyMinutes] = useState(xp > 0 ? Math.floor(xp / 20) : 4);
  const [isPremium, setIsPremium] = useState(false);

  const handleStartTrial = () => {
    sound.playVictory();
    setIsPremium(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-32 max-w-md mx-auto px-4 pt-4 space-y-6 select-none animate-fadeIn">
      {/* 1. 設定アイコン（スクショ1完全再現） */}
      <header className="flex justify-end">
        <button
          type="button"
          onClick={() => sound.playTap()}
          className="w-10 h-10 rounded-full bg-[#161B26] border border-[#232B3C] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* 2. ユーザープロフィール情報（スクショ1完全再現） */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight">
          英駿高田
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          hgfhn0102@gmail.com
        </p>
        <div className="pt-1 text-[11px] text-slate-500 font-medium space-y-0.5">
          <p>2026. 10. 29.에 가입함</p>
          <p>{isPremium ? '프리미엄 플러스 회원' : '무료 회원'}</p>
        </div>
      </div>

      {/* 3. プレミアムアップグレードカード（スクショ1完全再現） */}
      <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-6 text-center space-y-3.5 shadow-xl">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
          <Crown className="w-5 h-5 fill-blue-400 text-blue-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white">
            {isPremium ? '프리미엄 멤버십 이용 중' : '프리미엄 회원 되기'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            {isPremium
              ? '모든 레슨과 AI 프리톡을 무제한으로 학습하고 있습니다!'
              : '스픽의 모든 레슨과 기능을 무제한으로 누려보세요!'}
          </p>
        </div>

        {!isPremium && (
          <button
            type="button"
            onClick={handleStartTrial}
            className="w-full py-4 rounded-2xl bg-[#1652F0] hover:bg-[#1344C8] text-white font-black text-sm shadow-xl active:scale-[0.99] transition-all cursor-pointer"
          >
            무료체험 시작하기!
          </button>
        )}
      </div>

      {/* 4. 학습 하이라이트（学習ハイライト）（スクショ1完全再現） */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 text-center tracking-tight">
          학습 하이라이트
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* 말한 문장（話した文章） */}
          <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 space-y-2 shadow-lg">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 fill-purple-400" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                말한 문장
              </span>
              <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                {spokenCount}
              </span>
            </div>
          </div>

          {/* 공부한 시간（勉強した時間） */}
          <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 space-y-2 shadow-lg">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                공부한 시간
              </span>
              <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                {studyMinutes > 0 ? `${studyMinutes}분` : '0초'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 어휘 및 표현（語彙および表現）（スクショ1完全再現） */}
      <section className="pt-1">
        <div
          onClick={() => sound.playTap()}
          className="bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] rounded-3xl p-5 flex items-center justify-between shadow-lg cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-base shrink-0">
              A
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">어휘 및 표현</h4>
              <p className="text-xs text-slate-400">레슨 중 마주친 단어와 문장 모음</p>
            </div>
          </div>
          <button
            type="button"
            className="w-7 h-7 rounded-full text-slate-500 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default SpeakProfileView;
