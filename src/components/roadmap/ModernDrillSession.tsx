import React, { useState, useCallback } from 'react';
import {
  X,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestDrillData } from '../../data/stageMicroDrills';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface ModernDrillSessionProps {
  drill: QuestDrillData;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

export const ModernDrillSession: React.FC<ModernDrillSessionProps> = ({
  drill,
  onClose,
  onComplete,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = drill.questions[questionIndex];
  const isCorrect = selectedOption === currentQ?.correctIndex;
  const progressPercent = Math.round(((questionIndex + (isAnswered ? 1 : 0)) / (drill.questions.length || 1)) * 100);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    sound.playTap();
    setSelectedOption(idx);
  };

  const handleCheck = useCallback(() => {
    if (selectedOption === null || isAnswered || !currentQ) return;
    setIsAnswered(true);

    const isCurrentCorrect = selectedOption === currentQ.correctIndex;

    if (isCurrentCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 1);
      if (currentQ.audioText) {
        setTimeout(() => {
          speechService.speak(currentQ.audioText!);
        }, 200);
      }
    } else {
      sound.playIncorrect();
    }
  }, [selectedOption, isAnswered, currentQ]);

  const handleNext = useCallback(() => {
    sound.playTap();

    if (questionIndex < drill.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sound.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onComplete(score + (isCorrect ? 1 : 0), drill.questions.length);
    }
  }, [questionIndex, drill.questions.length, score, isCorrect, onComplete]);

  if (!currentQ && !isFinished) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col justify-between overflow-y-auto animate-fadeIn select-none">
      {/* 1. ミニマル・ヘッダー */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="max-w-2xl w-full mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>

          {/* プログレスバー */}
          <div className="flex-1 max-w-xs mx-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-slate-500">
            {questionIndex + 1} / {drill.questions.length}
          </span>
        </div>
      </header>

      {/* 2. メイン問題領域 */}
      {!isFinished ? (
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-2xl w-full mx-auto space-y-5">
          {/* 問題カード */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {drill.targetSkill}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                QUESTION {questionIndex + 1}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug pt-1">
              {currentQ.question}
            </h3>

            {currentQ.audioText && (
              <button
                type="button"
                onClick={() => speechService.speak(currentQ.audioText!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer mt-1 shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                <span>韓国語の音声を聴く</span>
              </button>
            )}
          </div>

          {/* 選択肢タイル */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOpt = optIdx === currentQ.correctIndex;

              let tileClass =
                'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs';

              if (isSelected && !isAnswered) {
                tileClass =
                  'bg-emerald-50/80 border-2 border-emerald-600 text-emerald-950 shadow-2xs font-semibold';
              } else if (isAnswered) {
                if (isCorrectOpt) {
                  tileClass =
                    'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrectOpt) {
                  tileClass =
                    'bg-rose-50 border-2 border-rose-400 text-rose-900 line-through opacity-80';
                } else {
                  tileClass = 'bg-slate-50 border border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm active:scale-[0.99] ${tileClass}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                        isSelected && !isAnswered
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {optIdx + 1}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
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
        /* 終了リザルト画面 */
        <main className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center max-w-md w-full mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">特訓完了！</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {drill.title} を完了しました
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">正解スコア</span>
              <span className="text-2xl font-bold text-emerald-600 font-mono">
                {score} / {drill.questions.length}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">獲得XP</span>
              <span className="text-2xl font-bold text-amber-600 font-mono flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                +{score * 20 + 20} XP
              </span>
            </div>
          </div>
        </main>
      )}

      {/* 3. ボトムアクションバー */}
      {!isFinished ? (
        <footer
          className={`w-full p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t transition-all shrink-0 ${
            !isAnswered
              ? 'bg-white border-slate-200'
              : isCorrect
              ? 'bg-emerald-50/90 border-emerald-200'
              : 'bg-rose-50/90 border-rose-200'
          }`}
        >
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              {!isAnswered ? (
                <p className="text-xs text-slate-400 font-medium">
                  数字キー(1〜4)またはタップで選択してください
                </p>
              ) : isCorrect ? (
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-800 block">正解！完璧です</span>
                  <p className="text-xs text-slate-700 font-normal leading-relaxed">{currentQ.explanation}</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-rose-800 block">
                    正解: {currentQ.options[currentQ.correctIndex]}
                  </span>
                  <p className="text-xs text-slate-700 font-normal leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            <div className="shrink-0 pt-1 sm:pt-0">
              {!isAnswered ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleCheck}
                  className={`w-full sm:w-36 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  確認する
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`w-full sm:w-36 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs ${
                    isCorrect
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{questionIndex < drill.questions.length - 1 ? '次の問題' : '完了する'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </footer>
      ) : (
        <footer className="w-full p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-white border-t border-slate-200 shrink-0">
          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>学習を続ける</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
