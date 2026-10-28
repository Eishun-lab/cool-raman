import React, { useState } from 'react';
import {
  Lock,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioSynth';

export const SpeakChallengeView: React.FC<{ userXp: number }> = ({ userXp }) => {
  const [activeTab, setActiveTab] = useState<'league' | 'challenge'>('league');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const leaderboardUsers = [
    { rank: 1, name: '민지 (Minji)', score: 820, avatar: 'MJ', isUser: false },
    { rank: 2, name: '준호 (Junho)', score: 740, avatar: 'JH', isUser: false },
    { rank: 3, name: '英駿高田 (あなた)', score: userXp, avatar: 'ET', isUser: true },
    { rank: 4, name: 'Sarah K.', score: 380, avatar: 'SK', isUser: false },
    { rank: 5, name: 'Kenji T.', score: 290, avatar: 'KT', isUser: false },
  ];

  const handleUnlock = () => {
    sound.playVictory();
    setIsUnlocked(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-32 max-w-md mx-auto px-4 pt-4 space-y-6 select-none animate-fadeIn">
      {/* 1. ヘッダー（スクショ2完全再現） */}
      <header className="space-y-4">
        <h1 className="text-2xl font-black text-white tracking-tight">
          챌린지
        </h1>

        {/* タブ切り替え（리그 / 챌린지） */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('league');
            }}
            className={`text-base font-bold pb-1 transition-colors cursor-pointer relative ${
              activeTab === 'league' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            리그
            {activeTab === 'league' && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('challenge');
            }}
            className={`text-base font-bold pb-1 transition-colors cursor-pointer relative ${
              activeTab === 'challenge' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            챌린지
            {activeTab === 'challenge' && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* 2. リーグ画面（スクショ2完全再現） */}
      {activeTab === 'league' && (
        <div className="space-y-6 pt-4 text-center animate-fadeIn">
          {!isUnlocked ? (
            /* ロック状態のUI */
            <>
              {/* ダミーのランキングシルエット ＆ ロックバッジ */}
              <div className="relative mx-auto max-w-xs bg-[#141A26] border border-[#232B3C] rounded-3xl p-6 shadow-2xl space-y-3 opacity-90">
                {/* 右上のロックシールド */}
                <div className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl bg-[#1B2333] border-2 border-[#2F3C54] flex items-center justify-center text-slate-400 shadow-xl">
                  <Lock className="w-6 h-6" />
                </div>

                {/* ダミー行 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 text-xs font-mono font-bold flex items-center justify-center">
                    AF
                  </div>
                  <div className="h-3.5 bg-slate-800 rounded-full w-32" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 text-xs font-mono font-bold flex items-center justify-center">
                    SR
                  </div>
                  <div className="h-3.5 bg-slate-800 rounded-full w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 text-xs font-mono font-bold flex items-center justify-center">
                    PP
                  </div>
                  <div className="h-3.5 bg-slate-800 rounded-full w-28" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 text-xs font-mono font-bold flex items-center justify-center">
                    GT
                  </div>
                  <div className="h-3.5 bg-slate-800 rounded-full w-20" />
                </div>
              </div>

              {/* テキスト説明 */}
              <div className="space-y-2 pt-2">
                <h2 className="text-lg font-black text-white">
                  리그를 잠금 해제하여<br />경쟁에 참여하세요
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  스피킹 점수를 획득하여 다른 학습자와 경쟁하십시오.
                </p>
              </div>

              {/* 解除ボタン（スクショ2の鮮やかなブルーボタン） */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleUnlock}
                  className="w-full py-4 rounded-2xl bg-[#1652F0] hover:bg-[#1344C8] text-white font-black text-sm shadow-xl active:scale-[0.99] transition-all cursor-pointer"
                >
                  리그 잠금 해제
                </button>
              </div>
            </>
          ) : (
            /* アンロック後のリアルランキング */
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>ブロンズリーグ開催中</span>
                </span>
                <span className="text-[11px] text-slate-400">残り3日</span>
              </div>

              <div className="space-y-2">
                {leaderboardUsers.map((u) => (
                  <div
                    key={u.rank}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      u.isUser
                        ? 'bg-blue-600/20 border-blue-500/50 text-white'
                        : 'bg-[#141A26] border-[#232B3C] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-mono font-black text-sm ${u.rank <= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                        {u.rank}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-xs font-bold text-white flex items-center justify-center font-mono">
                        {u.avatar}
                      </div>
                      <span className="text-xs font-bold text-white">{u.name}</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-blue-300">
                      {u.score} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. チャレンジ画面 */}
      {activeTab === 'challenge' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-400" /> 7日連続スピーキング挑戦
              </span>
              <span className="text-xs font-mono text-slate-400">1 / 7日</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '14%' }} />
            </div>
            <p className="text-xs text-slate-400">
              毎日1レッスン声に出して発音しましょう。達成で限定バッジ獲得！
            </p>
          </div>

          <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 100文スピーキング達成
              </span>
              <span className="text-xs font-mono text-slate-400">12 / 100文</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
            </div>
            <p className="text-xs text-slate-400">
              声に出してアウトプットした文の累計です。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakChallengeView;
