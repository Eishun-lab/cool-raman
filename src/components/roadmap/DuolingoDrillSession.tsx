import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
  Sparkles,
  Zap,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestDrillData } from '../../data/stageMicroDrills';
import { HorangiMascot } from '../mascot/HorangiMascot';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface DuolingoDrillSessionProps {
  drill: QuestDrillData;
  stepNum: number;
  taskIdx: number;
  streakDays: number;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

export const DuolingoDrillSession: React.FC<DuolingoDrillSessionProps> = ({
  drill,
  stepNum,
  taskIdx,
  streakDays,
  onClose,
  onComplete,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getIsMuted());

  // リザルト画面でのXPカウントアップ演出用
  const [animatedXp, setAnimatedXp] = useState(0);

  const currentQ = drill.questions[questionIndex];
  const isCorrect = selectedOption === currentQ.correctIndex;
  const progressPercent = Math.round(((questionIndex + (isAnswered ? 1 : 0)) / drill.questions.length) * 100);

  // ミュート切り替え
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // 選択肢をタップ
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    sound.playTap();
    setSelectedOption(idx);
  };

  // 「確認する」を押した時の判定処理
  const handleCheck = useCallback(() => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);

    const isCurrentCorrect = selectedOption === currentQ.correctIndex;

    if (isCurrentCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 1);
      // 正解の音声があれば自動発音
      if (currentQ.audioText) {
        setTimeout(() => {
          speechService.speak(currentQ.audioText!);
        }, 200);
      }
    } else {
      sound.playIncorrect();
    }
  }, [selectedOption, isAnswered, currentQ]);

  // 「次へ」を押した時の処理
  const handleNext = useCallback(() => {
    sound.playTap();

    if (questionIndex < drill.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // 全問終了！
      setIsFinished(true);
      sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
      });
      // 完了コールバック呼び出し
      onComplete(score + (isCorrect ? 1 : 0), drill.questions.length);
    }
  }, [questionIndex, drill.questions.length, score, isCorrect, onComplete]);

  // XPカウントアップアニメーション（終了画面）
  useEffect(() => {
    if (!isFinished) return;
    let current = 0;
    const target = 60;
    const interval = setInterval(() => {
      current += 4;
      if (current >= target) {
        setAnimatedXp(target);
        clearInterval(interval);
      } else {
        setAnimatedXp(current);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isFinished]);

  // キーボードショートカット操作 (1, 2, 3, 4 で選択、Enter で確認/次へ)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (!isAnswered) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= currentQ.options.length) {
          handleSelectOption(num - 1);
        } else if (e.key === 'Enter' && selectedOption !== null) {
          handleCheck();
        }
      } else {
        if (e.key === 'Enter') {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isFinished, selectedOption, currentQ.options.length, handleCheck, handleNext]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] text-slate-800 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200">
      {/* ===================================================================== */}
      {/* 🌟 1. 上部ナビゲーションバー（プログレスバー ＆ ストリーク ＆ 音量）   */}
      {/* ===================================================================== */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-stone-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
        {/* 閉じるボタン (X) */}
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all cursor-pointer shrink-0"
          title="特訓を中断して戻る"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* スムーズに進むプログレスバー */}
        <div className="flex-1 max-w-xl mx-auto px-2">
          <div className="w-full bg-stone-200/80 h-3.5 sm:h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-400 ease-out shadow-xs relative overflow-hidden"
              style={{ width: `${progressPercent}%` }}
            >
              {/* 光沢ハイライト */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* 右側：音量トグル ＆ ストリーク表示 */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isMuted ? 'text-stone-400 bg-stone-100' : 'text-[#58CC02] bg-[#F0FDF4]'
            }`}
            title={isMuted ? '効果音をONにする' : '効果音をOFFにする'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{streakDays}日</span>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 🌟 2. メインコンテンツ（ホランイ出題 ＋ 問題カード ＋ 選択肢タイル）    */}
      {/* ===================================================================== */}
      {!isFinished ? (
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center max-w-2xl w-full mx-auto space-y-5 sm:space-y-6">
          {/* ホランイ（マスコット）の感情連動出題 */}
          <div className="flex items-center justify-center">
            <HorangiMascot
              size="md"
              mood={
                !isAnswered
                  ? 'studying'
                  : isCorrect
                  ? 'happy'
                  : 'encouraging'
              }
              message={
                !isAnswered
                  ? '어느 쪽이 맞을까요?'
                  : isCorrect
                  ? '정답! 완벽해요! 🎉'
                  : '괜찮아요! 해설을 확인해봐요!'
              }
              subMessage={
                !isAnswered
                  ? 'どれが正しいかな？'
                  : isCorrect
                  ? '素晴らしい！正解です！'
                  : '大丈夫！解説を読んで覚えよう！'
              }
              showXpBadge={isAnswered && isCorrect}
              xpAmount={60}
              interactive={true}
            />
          </div>

          {/* 問題文カード */}
          <div className="bg-white border-2 border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase text-[#58CC02] tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
                {drill.targetSkill}
              </span>
              <span className="text-xs font-mono font-bold text-stone-400">
                問 {questionIndex + 1} / {drill.questions.length}
              </span>
            </div>

            <p className="text-base sm:text-xl font-black text-[#0F172A] leading-snug">
              {currentQ.question}
            </p>

            {currentQ.audioText && (
              <button
                type="button"
                onClick={() => speechService.speak(currentQ.audioText!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer mt-1 shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span>韓国語の音声を聴く</span>
              </button>
            )}
          </div>

          {/* 選択肢タイル（Duolingo風 太枠3D押し込みタイル） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOpt = optIdx === currentQ.correctIndex;

              let tileClass =
                'bg-white border-2 border-b-4 border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300';

              if (isSelected && !isAnswered) {
                tileClass =
                  'bg-[#F0FDF4] border-2 border-b-4 border-[#58CC02] text-[#58CC02] shadow-xs';
              } else if (isAnswered) {
                if (isCorrectOpt) {
                  tileClass =
                    'bg-emerald-50 border-2 border-b-4 border-emerald-500 text-emerald-950 font-black';
                } else if (isSelected && !isCorrectOpt) {
                  tileClass =
                    'bg-rose-50 border-2 border-b-4 border-rose-400 text-rose-900 line-through opacity-80';
                } else {
                  tileClass = 'bg-stone-50 border-2 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between font-bold text-xs sm:text-sm active:translate-y-0.5 active:border-b-2 ${tileClass}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* キーボードショートカット番号バッジ */}
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                        isSelected && !isAnswered
                          ? 'bg-[#58CC02] text-white border-[#58CC02]'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {optIdx + 1}
                    </span>
                    <span className="truncate">{opt}</span>
                  </div>

                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </main>
      ) : (
        /* =================================================================== */
        /* 🌟 3. 終了リザルト画面（トロフィー ＆ XPロール ＆ 達成演出）        */
        /* =================================================================== */
        <main className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center max-w-md w-full mx-auto space-y-6 animate-in zoom-in-95">
          <HorangiMascot
            size="hero"
            mood="trophy"
            message="특훈 클리어! 대단해요! 🏆"
            subMessage="特訓クリア！お見事です！"
            showXpBadge={true}
            xpAmount={60}
            interactive={true}
          />

          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              クエスト達成！
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-bold">
              {drill.title} を完全マスターしました！
            </p>
          </div>

          {/* 成果サマリーカード */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* 正解数 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400 block mb-1">正解スコア</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                {score} / {drill.questions.length}
              </span>
            </div>

            {/* 獲得XP（ロールアップアニメーション） */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400 block mb-1">獲得経験値</span>
              <span className="text-xl sm:text-2xl font-black text-[#58CC02] font-mono flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                +{animatedXp} XP
              </span>
            </div>
          </div>

          <div className="w-full bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>マップのステップが開通し、進捗バーが更新されました！</span>
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* 🌟 4. Duolingoスタイルの固定ボトムシート（判定 ＆ アクション）       */}
      {/* ===================================================================== */}
      {!isFinished ? (
        <footer
          className={`w-full p-4 sm:p-6 border-t-2 transition-all duration-200 shrink-0 ${
            !isAnswered
              ? 'bg-white border-stone-200'
              : isCorrect
              ? 'bg-emerald-100 border-emerald-300'
              : 'bg-rose-100 border-rose-300'
          }`}
        >
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* 回答前の案内 / 回答後の判定テキスト */}
            <div className="min-w-0 w-full sm:w-auto">
              {!isAnswered ? (
                <p className="text-xs text-stone-400 font-bold hidden sm:block">
                  ※ 数字キー(1〜4)またはタップで選択し、Enterキーで確認できます
                </p>
              ) : isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-950">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black">正解！素晴らしい！</h4>
                    <p className="text-xs text-emerald-800 line-clamp-1">{currentQ.explanation}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-rose-950">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm sm:text-base font-black">
                      正解は: {currentQ.options[currentQ.correctIndex]}
                    </h4>
                    <p className="text-xs text-rose-800 leading-snug">{currentQ.explanation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* アクションボタン（確認する / 次へ進む） */}
            <div className="w-full sm:w-auto shrink-0">
              {!isAnswered ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleCheck}
                  className={`w-full sm:w-44 py-3.5 px-6 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-[#58CC02] hover:bg-[#46A302] text-white shadow-[0_5px_0_#388E00] active:translate-y-1 active:shadow-[0_1px_0_#388E00]'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  確認する
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`w-full sm:w-44 py-3.5 px-6 rounded-2xl font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCorrect
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_5px_0_#047857] active:translate-y-1 active:shadow-[0_1px_0_#047857]'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_5px_0_#9f1239] active:translate-y-1 active:shadow-[0_1px_0_#9f1239]'
                  }`}
                >
                  <span>{questionIndex < drill.questions.length - 1 ? '次へ進む' : '結果を見る'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </footer>
      ) : (
        /* リザルト画面時のボトムボタン */
        <footer className="w-full p-4 sm:p-6 bg-white border-t border-stone-200 shrink-0">
          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 px-6 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-sm sm:text-base shadow-[0_5px_0_#388E00] active:translate-y-1 active:shadow-[0_1px_0_#388E00] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>冒険マップに戻る ➔</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
