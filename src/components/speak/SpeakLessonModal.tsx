import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  Mic,
  RotateCcw,
  Play,
  Pause,
  RotateCw,
  Flag,
  Bookmark,
  CheckCircle2,
  Sparkles,
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

type LessonPhase = 'intro' | 'video_welcome' | 'video_phrase' | 'speaking';

export const SpeakLessonModal: React.FC<SpeakLessonModalProps> = ({
  lesson,
  onClose,
  onComplete,
}) => {
  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [cantSpeakNow, setCantSpeakNow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '0.8x' | '1.2x'>('1x');
  const [langMode, setLangMode] = useState<'ko' | 'ja'>('ko');
  const [speakingSubStep, setSpeakingSubStep] = useState<1 | 2>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [seekProgress, setSeekProgress] = useState(40);

  // フェーズ移行時にネイティブ音声を自動発話
  useEffect(() => {
    if (phase === 'video_welcome') {
      speechService.speak('안녕하세요! 환영합니다!');
    } else if (phase === 'video_phrase') {
      speechService.speak('No problem! 아무 문제없을 거예요!');
    } else if (phase === 'speaking') {
      speechService.speak(speakingSubStep === 1 ? 'No problem!' : '문제없어!');
    }
  }, [phase, speakingSubStep]);

  // マスコットイントロタップ
  const handleTapIntro = () => {
    sound.playTap();
    setPhase('video_welcome');
  };

  // ビデオイントロから次へ
  const handleNextVideoStep = () => {
    sound.playTap();
    if (phase === 'video_welcome') {
      setPhase('video_phrase');
    } else if (phase === 'video_phrase') {
      setPhase('speaking');
    }
  };

  // スピーキング録音
  const handleRecord = () => {
    sound.playTap();
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasSpoken(true);
      sound.playCorrect();
    }, 1400);
  };

  // スピーキングステップ進行
  const handleNextSpeaking = () => {
    sound.playTap();
    if (speakingSubStep === 1) {
      setSpeakingSubStep(2);
      setHasSpoken(false);
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
    <div className="fixed inset-0 z-50 bg-black text-white font-sans flex flex-col justify-between select-none overflow-hidden animate-fadeIn">
      {/* ===================================================================== */}
      {/* PHASE 1: スピークマスコット・導入画面（スクショ1完全再現）            */}
      {/* ===================================================================== */}
      {phase === 'intro' && (
        <div
          onClick={handleTapIntro}
          className="flex-1 flex flex-col items-center justify-between py-16 px-6 cursor-pointer"
        >
          {/* 上部スペース */}
          <div />

          {/* 中央：吹き出し ＆ 青マスコット */}
          <div className="flex flex-col items-center space-y-8 animate-fadeIn">
            {/* 吹き出し */}
            <div className="px-6 py-4 rounded-3xl bg-[#1E2430] border border-[#2B3547] text-white text-base sm:text-lg font-bold text-center leading-snug shadow-xl max-w-xs">
              유창함은 소리 내어 말하는<br />것에서 시작됩니다
            </div>

            {/* 青いSpeakマスコット（アニメーション付き） */}
            <div className="relative flex flex-col items-center">
              <div className="w-28 h-32 rounded-[44px] bg-gradient-to-b from-[#3582FF] via-[#1E5EFF] to-[#1249C7] flex flex-col items-center justify-center shadow-[0_12px_35px_rgba(30,94,255,0.4)] animate-bounce duration-1000 relative">
                {/* 目 */}
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-4 bg-white rounded-full" />
                  <div className="w-2.5 h-4 bg-white rounded-full" />
                </div>
                {/* 手を振る */}
                <div className="absolute -right-2 top-8 w-6 h-6 bg-[#2B76FF] rounded-full rotate-12" />
              </div>
              {/* マスコットの影 */}
              <div className="w-20 h-3 bg-blue-900/40 rounded-full blur-xs mt-3" />
            </div>
          </div>

          {/* 下部：タップして続ける */}
          <div className="text-xs text-slate-400 font-medium tracking-wider">
            탭하여 계속하기
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHASE 2 & 3: 講師ビデオレッスン（スクショ2 & 3完全再現）              */}
      {/* ===================================================================== */}
      {(phase === 'video_welcome' || phase === 'video_phrase') && (
        <div
          onClick={handleNextVideoStep}
          className="relative flex-1 flex flex-col justify-between py-8 px-4 cursor-pointer overflow-hidden bg-white text-slate-900 animate-fadeIn"
        >
          {/* 上部タイトル（Welcome 👋 または No problem!） */}
          <div className="text-center pt-8 z-10 animate-fadeIn">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#333333] tracking-tight">
              {phase === 'video_welcome' ? 'Welcome 👋' : 'No problem!'}
            </h1>
          </div>

          {/* 中央：講師（実写スクショ画像を全画面美麗レンダリング） */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={phase === 'video_welcome' ? '/tutor_welcome.png' : '/tutor_phrase.png'}
              alt="Speak Tutor"
              className="w-full h-full object-contain sm:object-cover scale-105 transition-transform duration-500"
            />
          </div>

          {/* 下部：半透明字幕ピル（안녕하세요! 환영합니다! / 아무 문제없을 거예요!） */}
          <div className="z-10 flex flex-col items-center gap-3 pb-8">
            <div className="px-5 py-2.5 rounded-2xl bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-lg">
              {phase === 'video_welcome'
                ? '안녕하세요! 환영합니다!'
                : '아무 문제없을 거예요!'}
            </div>

            <span className="text-[11px] text-slate-700 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
              画面をタップして進む ➔
            </span>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHASE 4: 本番スピーキング・ワークアウト画面（スクショ4完全再現）        */}
      {/* ===================================================================== */}
      {phase === 'speaking' && (
        <div className="relative flex-1 flex flex-col justify-between bg-gradient-to-b from-[#1E2430] via-[#0A0D14] to-[#0A0D14] text-white p-4 animate-fadeIn">
          {/* 1. 最上部ヘッダー（✕ ＆ 今は話せないトグルスイッチ） */}
          <header className="flex items-center justify-between px-1 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 今は話せないトグル */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                지금은 말할 수 없어요
              </span>
              <button
                type="button"
                onClick={() => setCantSpeakNow(!cantSpeakNow)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  cantSpeakNow ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 ${
                    cantSpeakNow ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </header>

          {/* 2. 中央のダークスピーキングカード（スクショ4完全再現） */}
          <div className="my-auto max-w-sm w-full mx-auto space-y-4">
            <div className="bg-[#1C2333]/90 backdrop-blur-md border border-[#2B374E] rounded-[32px] p-6 shadow-2xl relative space-y-6">
              {/* カード上部：通報フラグ / 青いスピーキングバッジ / ブックマーク */}
              <div className="flex items-center justify-between">
                <button type="button" className="text-slate-500 hover:text-white cursor-pointer">
                  <Flag className="w-4 h-4" />
                </button>

                {/* 青いピルバッジ */}
                <div className="px-3.5 py-1 rounded-full bg-[#1652F0] text-white text-xs font-bold shadow-md">
                  이제 스피킹 하세요...
                </div>

                <button type="button" className="text-slate-500 hover:text-white cursor-pointer">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* メインフレーズ */}
              <div className="text-center space-y-2 py-4">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {speakingSubStep === 1 ? 'No problem!' : '문제없어!'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {langMode === 'ko'
                    ? speakingSubStep === 1 ? '문제없어!' : 'No problem!'
                    : '問題ないよ！大丈夫！'}
                </p>
              </div>

              {/* カード下部アクション：다시하기（もう一度） */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleRecord}
                  className={`px-4 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : hasSpoken
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#283349] text-blue-400 hover:bg-[#32405C]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {isRecording ? '聞いています...' : hasSpoken ? '発音クリア！' : '다시하기'}
                  </span>
                </button>
              </div>
            </div>

            {/* ステップカウンター */}
            <div className="text-center text-xs text-slate-500 font-mono font-bold">
              {speakingSubStep}/2
            </div>

            {/* 次へ進むボタン */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleNextSpeaking}
                className="w-full py-3.5 rounded-2xl bg-[#1652F0] hover:bg-[#1344C8] text-white font-black text-sm shadow-lg cursor-pointer transition-all"
              >
                {speakingSubStep === 1 ? '다음 단계로 ➔' : '레슨 완료하기 🎉'}
              </button>
            </div>
          </div>

          {/* 3. 最下部プレイヤーコントロールバー（スクショ4完全再現） */}
          <footer className="max-w-sm w-full mx-auto space-y-4 pb-2">
            {/* プログレスシークバー */}
            <div className="w-full bg-slate-700/60 h-1 rounded-full relative overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${seekProgress}%` }}
              />
            </div>

            {/* コントロールボタン群（한/A, ↶, ⏸, ↷, 1x） */}
            <div className="flex items-center justify-between text-slate-300">
              {/* 言語・字幕切り替え */}
              <button
                type="button"
                onClick={() => setLangMode(langMode === 'ko' ? 'ja' : 'ko')}
                className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer px-2 py-1 rounded"
              >
                한 / {langMode === 'ko' ? 'A' : '日'}
              </button>

              {/* 巻き戻し */}
              <button
                type="button"
                onClick={() => sound.playTap()}
                className="p-2 text-slate-300 hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* 再生/一時停止ボタン（中央の大きな円形） */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setIsPlaying(!isPlaying);
                }}
                className="w-13 h-13 rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>

              {/* 早送り */}
              <button
                type="button"
                onClick={() => sound.playTap()}
                className="p-2 text-slate-300 hover:text-white cursor-pointer"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* 再生速度 */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setPlaybackSpeed(playbackSpeed === '1x' ? '1.2x' : playbackSpeed === '1.2x' ? '0.8x' : '1x');
                }}
                className="text-xs font-mono font-bold text-slate-400 hover:text-white cursor-pointer px-2 py-1 rounded"
              >
                {playbackSpeed}
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default SpeakLessonModal;
