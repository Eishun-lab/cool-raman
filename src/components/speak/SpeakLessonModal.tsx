import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Mic,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Play,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpeakLesson } from '../../data/speakCurriculum';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface SpeakLessonModalProps {
  lesson: SpeakLesson;
  onClose: () => void;
  onComplete: () => void;
}

export const SpeakLessonModal: React.FC<SpeakLessonModalProps> = ({
  lesson,
  onClose,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const step = lesson.steps[currentStepIndex];
  const totalSteps = lesson.steps.length;

  // ステップ切り替え時に自動で音声再生
  useEffect(() => {
    setHasSpoken(false);
    setIsSuccess(false);

    if (step.type === 'concept' && step.tutorPhraseKo) {
      handlePlayTutorAudio(step.tutorPhraseKo);
    } else if (step.type === 'roleplay' && step.tutorPhraseKo) {
      handlePlayTutorAudio(step.tutorPhraseKo);
    }
  }, [currentStepIndex]);

  const handlePlayTutorAudio = (text: string) => {
    setIsPlayingAudio(true);
    speechService.speak(text);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1800);
  };

  const handleRecordVoice = () => {
    sound.playTap();
    setIsRecording(true);

    // 録音シミュレーションまたはSpeech Recognition
    setTimeout(() => {
      setIsRecording(false);
      setHasSpoken(true);
      setIsSuccess(true);
      sound.playCorrect();
    }, 1500);
  };

  const handleNextStep = () => {
    sound.playTap();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E14] text-white flex flex-col justify-between overflow-y-auto select-none animate-fadeIn">
      {/* 1. ミニマル・プログレスヘッダー */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between shrink-0 max-w-lg mx-auto w-full">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3ステップ プログレスバー */}
        <div className="flex-1 max-w-xs mx-4 flex items-center gap-1.5">
          {lesson.steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                i <= currentStepIndex ? 'bg-blue-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400 font-bold">
          {currentStepIndex + 1}/{totalSteps}
        </span>
      </header>

      {/* 2. メインコンテンツ領域 */}
      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col justify-center">
        {/* STEP 1: ビデオ/音声ミニレッスン */}
        {step.type === 'concept' && (
          <div className="space-y-6 text-center animate-fadeIn">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              <Play className="w-3.5 h-3.5 fill-blue-400" />
              <span>STEP 1: フレーズのニュアンス解説</span>
            </span>

            {/* キーフレーズ */}
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {step.tutorPhraseKo}
              </h2>
              {step.tutorPhraseReading && (
                <p className="text-sm font-mono text-blue-300">
                  {step.tutorPhraseReading}
                </p>
              )}
              <p className="text-lg text-slate-300 font-medium">
                {step.tutorPhraseJa}
              </p>
            </div>

            {/* 音声再生ボタン */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => handlePlayTutorAudio(step.tutorPhraseKo!)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isPlayingAudio
                    ? 'bg-blue-400 text-white scale-105 ring-8 ring-blue-500/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                }`}
              >
                <Volume2 className="w-9 h-9" />
              </button>
            </div>

            {/* 解説カード */}
            <div className="bg-[#141A26] border border-[#232B3C] rounded-2xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
              {step.explanation}
            </div>
          </div>
        )}

        {/* STEP 2: スピーキング反復 */}
        {step.type === 'speaking' && (
          <div className="space-y-6 text-center animate-fadeIn">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Mic className="w-3.5 h-3.5" />
              <span>STEP 2: 声に出して発音しよう</span>
            </span>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 block">{step.subtitle}</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {step.userPromptKo}
              </h2>
              <p className="text-sm text-slate-300">
                {step.userPromptJa}
              </p>
              {step.hint && (
                <p className="text-xs text-amber-300 font-mono pt-1">
                  💡 {step.hint}
                </p>
              )}
            </div>

            {/* マイクボタン */}
            <div className="flex flex-col items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleRecordVoice}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                  isRecording
                    ? 'bg-rose-500 text-white ring-12 ring-rose-500/20 animate-pulse'
                    : isSuccess
                    ? 'bg-emerald-500 text-white ring-8 ring-emerald-500/20'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                {isSuccess ? (
                  <Check className="w-10 h-10 stroke-[3]" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </button>

              <span className="text-xs text-slate-400 font-medium">
                {isRecording
                  ? '聞いています... 🗣️'
                  : isSuccess
                  ? '発音バッチリです！🎉'
                  : 'タップしてマイクに向かって話す'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: 実戦対話ロールプレイ */}
        {step.type === 'roleplay' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STEP 3: 実戦ロールプレイ対話</span>
              </span>
              <p className="text-xs text-slate-400 pt-2">{step.subtitle}</p>
            </div>

            {/* 相手の発言（吹き出し） */}
            <div className="flex items-start gap-3 bg-[#151D2C] border border-[#242F46] rounded-2xl p-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img
                  src={lesson.tutorAvatar}
                  alt={lesson.tutorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{lesson.tutorName}</span>
                  <button
                    type="button"
                    onClick={() => handlePlayTutorAudio(step.tutorPhraseKo!)}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-base font-bold text-white leading-snug">
                  {step.tutorPhraseKo}
                </p>
                <p className="text-xs text-slate-400">
                  {step.tutorPhraseJa}
                </p>
              </div>
            </div>

            {/* あなたの返答（練習） */}
            <div className="bg-[#102447] border border-blue-500/40 rounded-2xl p-4 space-y-2 text-right">
              <span className="text-xs font-bold text-blue-300 block">あなたの返答:</span>
              <p className="text-lg font-black text-white">
                {step.userPromptKo}
              </p>
              <p className="text-xs text-blue-200">
                {step.userPromptJa}
              </p>
            </div>

            {/* マイク入力 */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleRecordVoice}
                className={`py-3 px-6 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                  isSuccess
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isSuccess ? '返答成功！' : '声に出して返答する'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. ボトムアクションバー */}
      <footer className="p-4 sm:p-6 bg-[#0E131E] border-t border-[#1C2333] shrink-0">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-[#0B0E14] font-black text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <span>
              {currentStepIndex < totalSteps - 1
                ? '次のステップへ'
                : 'レッスンを完了する'}
            </span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SpeakLessonModal;
