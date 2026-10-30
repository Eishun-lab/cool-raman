import React, { useState, useCallback } from 'react';
import {
  X,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WrongQuestionRecord,
  resolveWrongQuestion,
} from '../../services/studySessionService';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface ReviewSessionModalProps {
  questions: WrongQuestionRecord[];
  onClose: () => void;
  onRefresh: () => void;
}

export const ReviewSessionModal: React.FC<ReviewSessionModalProps> = ({
  questions,
  onClose,
  onRefresh,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[questionIndex];
  const isCorrect = selectedOption === currentQ?.correctIndex;
  const progressPercent = Math.round(
    ((questionIndex + (isAnswered ? 1 : 0)) / (questions.length || 1)) * 100
  );

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
      setResolvedCount((prev) => prev + 1);
      // 弱点リストから解消
      resolveWrongQuestion(currentQ.id);
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

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sound.playVictory();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#B84E34', '#FAF0EC', '#2A2421', '#F0D5CD'],
      });
      onRefresh();
    }
  }, [questionIndex, questions.length, onRefresh]);

  if (!currentQ && !isFinished) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] text-[#2A2421] flex flex-col justify-between overflow-hidden animate-fadeIn select-none font-sans">
      {/* 1. ミニマル・ヘッダー */}
      <header className="bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4DA] px-4 sm:px-6 h-14 flex items-center justify-between gap-3 shrink-0">
        <div className="max-w-xl w-full mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white border border-[#EAE4DA] text-xs font-medium text-stone-600 hover:text-[#2A2421] transition-all cursor-pointer shadow-2xs"
            title="復習を終了する"
          >
            <ChevronLeft className="w-4 h-4 text-stone-400" />
            <span>戻る</span>
          </button>

          {/* 中央進捗 */}
          <div className="flex-1 max-w-xs mx-3 flex flex-col items-center gap-1">
            <span className="text-xs font-serif-title text-[#2A2421] tracking-wider font-bold">
              弱点復習 {questionIndex + 1} / {questions.length} 問
            </span>
            <div className="w-full bg-[#EAE4DA] h-[2.5px] rounded-full overflow-hidden">
              <div
                className="bg-[#B84E34] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. メイン問題領域 */}
      {!isFinished ? (
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 max-w-xl w-full mx-auto flex flex-col justify-center space-y-3.5">
          {/* 問題カード */}
          <div className="bg-white border border-[#EAE4DA] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(42,36,33,0.03)] space-y-3.5">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#EAE4DA]/50">
              <span className="text-[10px] tracking-wider font-bold text-[#B84E34] bg-[#FAF0EC] px-2 py-0.5 rounded border border-[#F0D5CD]">
                {currentQ.sourceTitle}
              </span>
              <span className="text-xs text-stone-400 font-mono tracking-widest">
                REVIEW {String(questionIndex + 1).padStart(2, '0')}
              </span>
            </div>

            {currentQ.instruction && (
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                {currentQ.instruction}
              </p>
            )}

            {currentQ.passage && (
              <div className="bg-[#FAF7F2] border border-[#EAE4DA] rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif-kr">
                {currentQ.passage}
              </div>
            )}

            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#2A2421] leading-relaxed pt-0.5">
              {currentQ.question}
            </h3>

            {currentQ.audioText && (
              <button
                type="button"
                onClick={() => speechService.speak(currentQ.audioText!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0EC] text-stone-700 hover:text-[#B84E34] border border-[#EAE4DA] text-xs font-serif-title transition-all cursor-pointer shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-stone-500" />
                <span>音声を再生する</span>
              </button>
            )}

            {/* 選択肢タイル */}
            <div className="space-y-2 pt-1">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrectOpt = optIdx === currentQ.correctIndex;

                let tileClass =
                  'bg-white border border-[#EAE4DA] text-[#2A2421] hover:border-stone-400 shadow-2xs';

                if (isSelected && !isAnswered) {
                  tileClass =
                    'bg-[#FAF0EC] border-2 border-[#B84E34] text-[#2A2421] shadow-2xs font-bold';
                } else if (isAnswered) {
                  if (isCorrectOpt) {
                    tileClass =
                      'bg-[#FAF7F2] border-2 border-stone-800 text-[#2A2421] font-bold';
                  } else if (isSelected && !isCorrectOpt) {
                    tileClass =
                      'bg-stone-50 border-2 border-stone-300 text-stone-400 line-through opacity-75';
                  } else {
                    tileClass = 'bg-stone-50/60 border border-[#EAE4DA] text-stone-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm active:scale-[0.99] ${tileClass}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-mono font-medium flex items-center justify-center shrink-0 border ${
                          isSelected && !isAnswered
                            ? 'bg-[#B84E34] text-white border-[#B84E34]'
                            : 'bg-stone-100 text-stone-600 border-[#EAE4DA]'
                        }`}
                      >
                        {optIdx + 1}
                      </span>
                      <span className="leading-relaxed font-serif-kr text-sm">{opt}</span>
                    </div>

                    {isAnswered && isCorrectOpt && (
                      <CheckCircle2 className="w-5 h-5 text-stone-800 shrink-0 ml-2" />
                    )}
                    {isAnswered && isSelected && !isCorrectOpt && (
                      <XCircle className="w-5 h-5 text-stone-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      ) : (
        /* 完了リザルト */
        <main className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center max-w-md w-full mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EAE4DA] shadow-2xs text-[#B84E34] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="font-serif-title text-2xl font-bold text-[#2A2421]">復習完了</h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              弱点演習を完了しました
            </p>
          </div>

          <div className="bg-white border border-[#EAE4DA] rounded-2xl p-5 w-full text-center shadow-2xs space-y-1">
            <span className="text-[11px] font-serif-title tracking-wider text-stone-400 uppercase block">克服スコア</span>
            <span className="text-3xl font-bold text-[#2A2421] font-mono">
              {resolvedCount} / {questions.length} 問 克服
            </span>
            <p className="text-xs text-stone-500 pt-1">
              正解した問題は弱点リストから解消されました。
            </p>
          </div>
        </main>
      )}

      {/* 3. ボトムアクションバー */}
      {!isFinished ? (
        <footer
          className={`w-full p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))] border-t transition-all shrink-0 ${
            !isAnswered
              ? 'bg-white border-[#EAE4DA]'
              : isCorrect
              ? 'bg-[#FAF7F2] border-[#EAE4DA]'
              : 'bg-[#FAF0EC]/60 border-[#F0D5CD]'
          }`}
        >
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              {!isAnswered ? (
                <p className="text-xs text-stone-400 font-normal tracking-wide">
                  選択肢をタップして解答してください
                </p>
              ) : isCorrect ? (
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-800 font-serif-title block">
                    正解！弱点を克服しました
                  </span>
                  <p className="text-xs text-stone-600 font-normal leading-relaxed">{currentQ.explanation}</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#B84E34] font-serif-title block">
                    正答: {currentQ.options[currentQ.correctIndex]}
                  </span>
                  <p className="text-xs text-stone-600 font-normal leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            <div className="shrink-0 pt-1 sm:pt-0">
              {!isAnswered ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleCheck}
                  className={`w-full sm:w-36 py-3 px-5 rounded-xl font-serif-title text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-[#1F1A17] hover:bg-[#342D28] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-[#EAE4DA]'
                  }`}
                >
                  確認する
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-36 py-3 px-5 rounded-xl font-serif-title text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs bg-[#1F1A17] hover:bg-[#342D28] text-white"
                >
                  <span>{questionIndex < questions.length - 1 ? '次の問題' : '完了する'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </footer>
      ) : (
        <footer className="w-full p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-t border-[#EAE4DA] shrink-0">
          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-5 rounded-xl bg-[#1F1A17] hover:bg-[#342D28] text-white font-serif-title text-sm tracking-wide shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>修練ホームに戻る</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
