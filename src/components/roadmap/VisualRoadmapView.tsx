import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Map,
  Target,
  MessageCircle,
  Volume2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  Check,
  Compass,
  FileText,
  Layers,
  ArrowRight,
  Zap,
  Bookmark,
  VolumeX,
} from 'lucide-react';
import { RoadmapStep, GuideTab } from '../../types/guide';
import { ROADMAP_STEPS } from '../../data/roadmap';
import { speechService } from '../../utils/speech';

interface VisualRoadmapViewProps {
  onNavigateToExam?: (examId?: string) => void;
  onNavigateToContent?: (id: string, tab?: GuideTab) => void;
  showPronunciation?: boolean;
}

// 各ステップに対応する推奨模試と教材ステージのマッピング
const STEP_META: Record<
  number,
  {
    examId: string;
    examLabel: string;
    stageLabel: string;
    firstLessonId: string;
    accentGradient: string;
  }
> = {
  1: {
    examId: 'hanken_basic',
    examLabel: 'ハン検 基礎模試（5級準備）',
    stageLabel: '第1章（第1〜10課）入門・土台',
    firstLessonId: 'lesson-1',
    accentGradient: 'from-emerald-600 to-teal-700',
  },
  2: {
    examId: 'hanken_basic',
    examLabel: 'ハン検 基礎模試（5級合格）',
    stageLabel: '第1章（第6〜10課）基本時制',
    firstLessonId: 'lesson-6',
    accentGradient: 'from-sky-600 to-blue-700',
  },
  3: {
    examId: 'topik1',
    examLabel: 'TOPIK I 模試（1級満点）',
    stageLabel: '第2章（第11〜20課）不規則活用',
    firstLessonId: 'lesson-11',
    accentGradient: 'from-amber-600 to-orange-700',
  },
  4: {
    examId: 'topik1',
    examLabel: 'TOPIK I 模試（2級・初級完成）',
    stageLabel: '第3章（第21〜30課）複文・連体形',
    firstLessonId: 'lesson-21',
    accentGradient: 'from-rose-600 to-red-700',
  },
  5: {
    examId: 'hanken_intermediate',
    examLabel: 'ハン検 応用模試（3級挑戦）',
    stageLabel: '第4章（第31〜35課）中級実戦',
    firstLessonId: 'lesson-31',
    accentGradient: 'from-purple-600 to-indigo-700',
  },
  6: {
    examId: 'topik2',
    examLabel: 'TOPIK II 模試（4級・準2級）',
    stageLabel: '第5章（第36〜40課）中上級完成',
    firstLessonId: 'lesson-36',
    accentGradient: 'from-pink-600 to-rose-700',
  },
  7: {
    examId: 'topik2',
    examLabel: 'TOPIK II 模試（5級・上級）',
    stageLabel: '文法大辞典（No.181〜225）高級論理',
    firstLessonId: 'dict-181',
    accentGradient: 'from-cyan-600 to-sky-700',
  },
  8: {
    examId: 'topik2',
    examLabel: 'TOPIK II 模試（6級最上級）',
    stageLabel: '文法大辞典（No.226〜250）格調論述',
    firstLessonId: 'dict-226',
    accentGradient: 'from-amber-500 to-yellow-600',
  },
};

export const VisualRoadmapView: React.FC<VisualRoadmapViewProps> = ({
  onNavigateToExam,
  onNavigateToContent,
  showPronunciation = true,
}) => {
  // 表示モード: 'focus' (路線図＋1駅フォーカス) | 'list' (全駅スクロール一括展開)
  const [viewMode, setViewMode] = useState<'focus' | 'list'>('focus');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [playingStep, setPlayingStep] = useState<number | null>(null);
  const [openAllListDetails, setOpenAllListDetails] = useState<Record<number, boolean>>({});

  const activeStep = ROADMAP_STEPS[activeStepIndex];
  const meta = STEP_META[activeStep.step];

  // 音声再生
  const playSpeech = (koText: string, stepNum: number) => {
    if (playingStep === stepNum) {
      speechService.stop();
      setPlayingStep(null);
      return;
    }
    setPlayingStep(stepNum);
    speechService.speak(koText, {
      onEnd: () => setPlayingStep(null),
      onError: () => setPlayingStep(null),
    });
  };

  const handleNextStep = () => {
    if (activeStepIndex < ROADMAP_STEPS.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-3xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* 🧭 ロードマップ ヘッダーバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE7DC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B84E34] text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-[#1B2A38] tracking-tight">
                韓国語 完全制覇ロードマップ
              </h2>
              <span className="text-[10px] font-bold text-[#B84E34] bg-[#FAF0EC] px-2 py-0.5 rounded-full border border-[#F0D5CD]">
                公的シラバス ＆ SLA準拠
              </span>
            </div>
            <p className="text-xs text-stone-500">
              入門（0h）からネイティブ最上級（C2 / 1,800h+）までの科学的8大ステーション
            </p>
          </div>
        </div>

        {/* 表示切替トグル */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-200/60 p-1 rounded-xl text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('focus')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'focus'
                ? 'bg-white text-[#B84E34] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>路線図フォーカス</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#B84E34] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>全駅スクロール</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 🚆 ① 動的メトロ路線図ナビゲーター（8大ステーションのレール） */}
      {/* ===================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
          <span className="flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-[#B84E34]" />
            <span>メトロ路線図（駅をタップして切り替え）</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className="w-7 h-7 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-stone-700 shadow-2xs transition-all cursor-pointer"
              title="前の駅へ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5">
              {activeStepIndex + 1} / {ROADMAP_STEPS.length}
            </span>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={activeStepIndex === ROADMAP_STEPS.length - 1}
              className="w-7 h-7 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-stone-700 shadow-2xs transition-all cursor-pointer"
              title="次の駅へ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 路線図レール横スクロールコンテナ */}
        <div className="overflow-x-auto pb-3 pt-2 scrollbar-thin">
          <div className="relative min-w-[760px] px-4 py-3 flex items-center justify-between">
            {/* レール背景ライン */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1.5 bg-stone-200 rounded-full z-0" />
            {/* 進捗ハイライトライン（現在選択中の駅まで色が伸びるアニメーション） */}
            <div
              className="absolute left-8 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-emerald-500 via-[#B84E34] to-amber-500 rounded-full transition-all duration-500 z-0"
              style={{
                width: `calc(${(activeStepIndex / (ROADMAP_STEPS.length - 1)) * 100}% - 32px)`,
              }}
            />

            {/* 各駅ノード */}
            {ROADMAP_STEPS.map((step, idx) => {
              const isCurrent = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;
              const stationColor = step.stationColor || '#B84E34';

              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className="relative z-10 flex flex-col items-center cursor-pointer group select-none shrink-0"
                  style={{ width: `${100 / ROADMAP_STEPS.length}%` }}
                >
                  {/* 駅マーカー（ナンバリングサークル） */}
                  <div
                    style={{
                      backgroundColor: isCurrent ? stationColor : isPassed ? stationColor : '#FFFFFF',
                      borderColor: stationColor,
                      color: isCurrent || isPassed ? '#FFFFFF' : stationColor,
                    }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm border-2 transition-all duration-300 shadow-xs ${
                      isCurrent
                        ? 'scale-125 ring-4 ring-offset-2 ring-stone-300 shadow-md animate-pulse'
                        : 'group-hover:scale-110 opacity-90'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : step.step}
                  </div>

                  {/* 駅名・級バッジ */}
                  <div className="mt-2 text-center space-y-0.5">
                    <div
                      className={`text-[11px] font-black transition-colors ${
                        isCurrent ? 'text-[#B84E34]' : 'text-stone-700 group-hover:text-stone-900'
                      }`}
                    >
                      {step.stage}
                    </div>
                    <div className="text-[9.5px] font-bold text-stone-500 line-clamp-1 max-w-[90px]">
                      {step.badge.split('/')[0].trim()}
                    </div>
                    <span className="inline-block text-[9px] font-mono text-stone-400">
                      {step.timeHours.split('〜')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4大ステージ ショートカットピル */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {[
            { label: '🟢 入門・土台', stepIdx: 0, desc: 'Step 1〜2（5級準備）' },
            { label: '🟡 初級突破', stepIdx: 2, desc: 'Step 3〜4（4級/TOPIK I）' },
            { label: '🟣 中級飛躍', stepIdx: 4, desc: 'Step 5〜6（3級/準2級）' },
            { label: '🟠 上級完成', stepIdx: 6, desc: 'Step 7〜8（2級/1級/6級）' },
          ].map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveStepIndex(cat.stepIdx)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                activeStepIndex >= cat.stepIdx && activeStepIndex < cat.stepIdx + 2
                  ? 'bg-white border-[#B84E34] text-[#B84E34] shadow-xs ring-1 ring-[#B84E34]/20'
                  : 'bg-white/60 border-stone-200/80 text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <div className="font-bold text-[11px]">{cat.label}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{cat.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 🌟 ② フォーカスモード：選択した駅の洗練マガジンカード（文字は全保持） */}
      {/* ===================================================================== */}
      {viewMode === 'focus' ? (
        <div
          key={activeStep.step}
          className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 transition-all animate-in fade-in duration-300"
        >
          {/* 駅カード ヘッダー行 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  style={{ backgroundColor: activeStep.stationColor }}
                  className="text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-2xs"
                >
                  Step {activeStep.step}
                </span>
                <span className="text-lg sm:text-2xl font-black text-[#1B2A38]">
                  {activeStep.stage}
                </span>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {activeStep.badge}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-500 font-mono">
                <span>⏱️ 想定学習時間: <strong className="text-stone-800">{activeStep.timeHours}</strong></span>
                <span>•</span>
                <span>📚 語彙目標: <strong className="text-stone-800">{activeStep.academicBasis.vocabCount.split('（')[0]}</strong></span>
              </div>
            </div>

            {/* クイックアクションボタン（模試 ＆ 教科書直結） */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onNavigateToExam && (
                <button
                  type="button"
                  onClick={() => onNavigateToExam(meta.examId)}
                  className="px-4 py-2 rounded-xl bg-[#B84E34] hover:bg-[#a2432c] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>この級の模擬試験に挑む ➔</span>
                </button>
              )}
              {onNavigateToContent && (
                <button
                  type="button"
                  onClick={() => onNavigateToContent(meta.firstLessonId, 'textbook')}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B84E34]" />
                  <span>該当課へ行く</span>
                </button>
              )}
            </div>
          </div>

          {/* 🎯 セクション 1: 公式Can-Do到達目標（何ができるようになるか） */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B84E34]">
              <Target className="w-4 h-4" />
              <span>到達指標 (公式Can-Do達成基準 ＆ 何ができるか)</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
              <p className="font-medium">{activeStep.academicBasis.officialCanDo}</p>
            </div>

            {/* 語彙・文法範囲の2分割ピル */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-700 flex items-center gap-1">
                  <span>📚 累積語彙規模:</span>
                </span>
                <p className="text-stone-600 leading-relaxed">{activeStep.academicBasis.vocabCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-700 flex items-center gap-1">
                  <span>🔖 出題文法・活用範囲:</span>
                </span>
                <p className="text-stone-600 leading-relaxed">{activeStep.academicBasis.grammarScope}</p>
              </div>
            </div>
          </div>

          {/* 🗣️ セクション 2: 代表的象徴モデルセリフ（音声再生つきシャドーイング） */}
          <div className="bg-[#FAF0EC]/40 border border-[#F2DED7] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#B84E34]">
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span>該当級の象徴的モデルセリフ（発音・シャドーイング）</span>
              </span>
              <span className="text-stone-400 font-normal text-[11px]">
                TOPIK 말하기 / 面接基準
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 bg-white p-4 rounded-xl border border-[#F0D5CC] shadow-2xs">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-black text-[#1B2A38] text-base sm:text-lg leading-snug">
                  {activeStep.representativeSpeech.ko}
                </p>
                {showPronunciation && activeStep.representativeSpeech.reading && (
                  <p className="text-xs text-stone-400 font-mono">
                    {activeStep.representativeSpeech.reading}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-stone-700 font-medium pt-0.5">
                  {activeStep.representativeSpeech.ja}
                </p>
              </div>
              <button
                type="button"
                onClick={() => playSpeech(activeStep.representativeSpeech.ko, activeStep.step)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs ${
                  playingStep === activeStep.step
                    ? 'bg-[#B84E34] text-white animate-pulse'
                    : 'bg-[#FAF0EC] hover:bg-[#F2DED7] text-[#B84E34] border border-[#F0D5CC]'
                }`}
                title="ネイティブ音声を聴く"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* 言語学的評価ポイント */}
            <div className="text-xs text-stone-600 leading-relaxed bg-white/60 p-3 rounded-xl border border-[#F0D5CC]/60">
              <strong className="text-[#B84E34]">💡 言語学的評価点: </strong>
              <span>{activeStep.representativeSpeech.linguisticPoint}</span>
            </div>
          </div>

          {/* 🧠 セクション 3: SLA科学的学習法 ＆ 日本語話者の誤用分析の罠 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* ⚠️ 誤用分析の罠（負の転移） */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                <span>⚠️ 日本語話者の頻出誤用の罠 (SLA):</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                {activeStep.slaTips.frequentError}
              </p>
            </div>

            {/* 💡 科学的突破法（ブレイクスルー） */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1.5">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                <span>💡 認知言語学的ブレイクスルー (打開策):</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                {activeStep.slaTips.breakthrough}
              </p>
            </div>
          </div>

          {/* 🏃‍♂️ セクション 4: 毎日の最短突破アクションルーティン */}
          {activeStep.actionRoutines && activeStep.actionRoutines.length > 0 && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#B84E34]" />
                <span>この駅を最短突破するための3大アクションルーティン:</span>
              </span>
              <ul className="space-y-2">
                {activeStep.actionRoutines.map((routine, rIdx) => (
                  <li key={rIdx} className="text-xs text-stone-700 flex items-start gap-2 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      {rIdx + 1}
                    </span>
                    <span>{routine}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 🔗 セクション 5: 直結教材リンク */}
          {activeStep.links && activeStep.links.length > 0 && (
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="text-xs font-bold text-stone-500">
                📖 この駅を攻略するための直結教材:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {activeStep.links.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => onNavigateToContent && onNavigateToContent(link.id, link.tab)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF0EC] border border-stone-200 hover:border-[#B84E34] text-xs font-bold text-[#B84E34] shadow-2xs transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ===================================================================== */
        /* 📜 ② リストモード：全8駅を一括スクロール（従来の読書重視レイアウト） */
        /* ===================================================================== */
        <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 via-[#B84E34] to-amber-500 before:rounded-full">
          {ROADMAP_STEPS.map((step) => {
            const stationColor = step.stationColor || '#B84E34';
            const stepMeta = STEP_META[step.step];
            const isDetailOpen = !!openAllListDetails[step.step];

            return (
              <div key={step.step} className="relative group">
                {/* 駅マーカー */}
                <div
                  style={{ backgroundColor: stationColor }}
                  className="absolute -left-[27px] sm:-left-[31px] top-3.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ring-4 ring-white shadow-xs shrink-0 select-none z-10"
                >
                  {step.step}
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-stone-300 transition-all p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        style={{ color: stationColor, backgroundColor: `${stationColor}15` }}
                        className="text-xs font-black px-2.5 py-0.5 rounded-md"
                      >
                        Step {step.step}: {step.stage}
                      </span>
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                        {step.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-stone-500">⏱️ {step.timeHours}</span>
                      {onNavigateToExam && (
                        <button
                          type="button"
                          onClick={() => onNavigateToExam(stepMeta.examId)}
                          className="px-2.5 py-1 rounded-lg bg-[#B84E34] text-white text-[11px] font-bold hover:bg-[#a2432c] transition-all cursor-pointer"
                        >
                          模試 ➔
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Can-Do */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                    {step.academicBasis.officialCanDo}
                  </p>

                  {/* 代表セリフ */}
                  <div className="p-3 bg-[#FAF0EC]/40 border border-[#F2DED7] rounded-xl flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-[#1B2A38]">{step.representativeSpeech.ko}</p>
                      <p className="text-xs text-stone-500">{step.representativeSpeech.ja}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => playSpeech(step.representativeSpeech.ko, step.step)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#F0D5CC] text-[#B84E34] flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 詳細開閉 */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAllListDetails((prev) => ({
                        ...prev,
                        [step.step]: !prev[step.step],
                      }))
                    }
                    className="text-xs font-bold text-[#B84E34] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isDetailOpen ? 'SLA分析とアクションを閉じる' : 'SLA分析とアクションを表示'}</span>
                    {isDetailOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isDetailOpen && (
                    <div className="space-y-2 pt-1 border-t border-stone-100 text-xs text-stone-700">
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                        <strong className="text-amber-900">⚠️ 誤用の罠: </strong>
                        <span>{step.slaTips.frequentError}</span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <strong className="text-emerald-900">💡 科学的突破法: </strong>
                        <span>{step.slaTips.breakthrough}</span>
                      </div>
                      {step.actionRoutines && (
                        <ul className="space-y-1 pl-1">
                          {step.actionRoutines.map((act, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
