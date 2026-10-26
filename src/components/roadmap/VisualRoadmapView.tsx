import React, { useState, useMemo } from 'react';
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
  AlertCircle,
  ShieldCheck,
  Calendar,
  HelpCircle,
  Table,
  CheckCircle2,
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
    examId: 'hanken_5',
    examLabel: 'ハングル検定 5級 模擬試験',
    stageLabel: '第1章（第1〜10課）入門・土台',
    firstLessonId: 'lesson-1',
    accentGradient: 'from-emerald-600 to-teal-700',
  },
  2: {
    examId: 'hanken_5',
    examLabel: 'ハングル検定 5級 模擬試験',
    stageLabel: '第1章（第6〜10課）基本時制',
    firstLessonId: 'lesson-6',
    accentGradient: 'from-sky-600 to-blue-700',
  },
  3: {
    examId: 'hanken_4',
    examLabel: 'ハングル検定 4級 模擬試験',
    stageLabel: '第2章（第11〜20課）不規則活用',
    firstLessonId: 'lesson-11',
    accentGradient: 'from-amber-600 to-orange-700',
  },
  4: {
    examId: 'topik1',
    examLabel: 'TOPIK I 模擬試験（1・2級）',
    stageLabel: '第3章（第21〜30課）複文・連体形',
    firstLessonId: 'lesson-21',
    accentGradient: 'from-rose-600 to-red-700',
  },
  5: {
    examId: 'hanken_3',
    examLabel: 'ハングル検定 3級 模擬試験',
    stageLabel: '第4章（第31〜35課）中級実戦',
    firstLessonId: 'lesson-31',
    accentGradient: 'from-purple-600 to-indigo-700',
  },
  6: {
    examId: 'hanken_pre2',
    examLabel: 'ハングル検定 準2級 模擬試験',
    stageLabel: '第5章（第36〜40課）中上級完成',
    firstLessonId: 'lesson-36',
    accentGradient: 'from-pink-600 to-rose-700',
  },
  7: {
    examId: 'topik2',
    examLabel: 'TOPIK II 模擬試験（3・4級）',
    stageLabel: '文法大辞典（No.181〜225）高級論理',
    firstLessonId: 'dict-181',
    accentGradient: 'from-cyan-600 to-sky-700',
  },
  8: {
    examId: 'topik2',
    examLabel: 'TOPIK II 模擬試験（5・6級）',
    stageLabel: '文法大辞典（No.226〜250）格調論述',
    firstLessonId: 'dict-226',
    accentGradient: 'from-amber-500 to-yellow-600',
  },
};

type RoadmapViewMode = 'matrix' | 'focus' | 'list';
type StationDetailTab = 'goal' | 'scope' | 'experience' | 'speech';

export const VisualRoadmapView: React.FC<VisualRoadmapViewProps> = ({
  onNavigateToExam,
  onNavigateToContent,
  showPronunciation = true,
}) => {
  // 表示モード: 'matrix' (1枚完結マトリクス表) | 'focus' (路線図＋1駅フォーカス) | 'list' (全駅スクロール)
  const [viewMode, setViewMode] = useState<RoadmapViewMode>('matrix');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [playingStep, setPlayingStep] = useState<number | null>(null);
  const [stationTab, setStationTab] = useState<StationDetailTab>('goal');
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'beginner' | 'advanced'>('all');
  const [expandedScopeInMatrix, setExpandedScopeInMatrix] = useState<Record<number, boolean>>({});

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

  // マトリクス表示用フィルタリング
  const filteredSteps = useMemo(() => {
    if (matrixFilter === 'beginner') {
      return ROADMAP_STEPS.filter((s) => s.step <= 4);
    }
    if (matrixFilter === 'advanced') {
      return ROADMAP_STEPS.filter((s) => s.step >= 5);
    }
    return ROADMAP_STEPS;
  }, [matrixFilter]);

  return (
    <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-3xl p-3 sm:p-6 shadow-xs space-y-6">
      {/* 🧭 ロードマップ ヘッダーバー */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#EDE7DC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B84E34] text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black text-[#1B2A38] tracking-tight">
                韓国語 完全制覇ロードマップ
              </h2>
              <span className="text-[10px] font-black text-[#B84E34] bg-[#FAF0EC] px-2.5 py-0.5 rounded-full border border-[#F0D5CD]">
                ブレない軸 ＆ 挫折防止設計
              </span>
            </div>
            <p className="text-xs text-stone-500">
              ゴール・Done定義・WBS作業分解・つまずき予見・忙しい日の5分縮小プロトコル完備
            </p>
          </div>
        </div>

        {/* 3大表示モード切り替えタブ */}
        <div className="flex items-center gap-1 self-start md:self-auto bg-stone-200/60 p-1 rounded-2xl text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-white text-[#B84E34] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>📊 全体俯瞰マトリクス</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('focus')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'focus'
                ? 'bg-white text-[#B84E34] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🚇 駅別フォーカス</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#B84E34] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📜 全駅リスト</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 📊 モード①：1枚完結！全体俯瞰マトリクスシート（Master Matrix Sheet）   */}
      {/* 「フェーズ（期間）× 学習項目（Must分解）× Done定義 × リスク対策」を横断 */}
      {/* ===================================================================== */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          {/* マトリクス説明 ＆ フィルター */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-[#B84E34]" />
                <span>1枚で見渡せる「フェーズ × 学習項目 × Done定義 × リスク対策」マトリクス</span>
              </div>
              <p className="text-[11px] text-stone-500">
                目標の曖昧さ・スコープの広がりすぎ・多忙による挫折を未然に防ぐための学習者専用シートです。
              </p>
            </div>

            {/* 段階フィルター */}
            <div className="flex items-center gap-1 shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMatrixFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  matrixFilter === 'all'
                    ? 'bg-[#B84E34] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                すべて (Step 1〜8)
              </button>
              <button
                type="button"
                onClick={() => setMatrixFilter('beginner')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  matrixFilter === 'beginner'
                    ? 'bg-[#B84E34] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                初級 (Step 1〜4)
              </button>
              <button
                type="button"
                onClick={() => setMatrixFilter('advanced')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  matrixFilter === 'advanced'
                    ? 'bg-[#B84E34] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                中上級 (Step 5〜8)
              </button>
            </div>
          </div>

          {/* 大判マトリクスカード群（PC: 4列グリッド、スマホ: 縦積みカード） */}
          <div className="space-y-4">
            {filteredSteps.map((step) => {
              const meta = STEP_META[step.step];
              const isScopeOpen = !!expandedScopeInMatrix[step.step];

              return (
                <div
                  key={step.step}
                  className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs hover:border-[#B84E34]/40 hover:shadow-md transition-all space-y-4"
                >
                  {/* フェーズヘッダー */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        style={{ backgroundColor: step.stationColor }}
                        className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs"
                      >
                        {step.step}
                      </span>
                      <span className="text-base sm:text-lg font-black text-[#1B2A38]">
                        Step {step.step}: {step.stage}
                      </span>
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                        {step.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#B84E34] bg-[#FAF0EC] px-2.5 py-0.5 rounded-full border border-[#F0D5CD]">
                        ⏱️ {step.timeHours}（タイムボックス: {step.scopePriority.timeboxWeeks}）
                      </span>
                    </div>

                    {/* クイックアクション */}
                    <div className="flex items-center gap-2 shrink-0">
                      {onNavigateToExam && (
                        <button
                          type="button"
                          onClick={() => onNavigateToExam(meta.examId)}
                          className="px-3 py-1.5 rounded-xl bg-[#B84E34] hover:bg-[#a2432c] text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>模試に挑む ➔</span>
                        </button>
                      )}
                      {onNavigateToContent && (
                        <button
                          type="button"
                          onClick={() => onNavigateToContent(meta.firstLessonId, 'textbook')}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#B84E34]" />
                          <span>教科書</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4大マトリクスブロック（横並びグリッド） */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs">
                    {/* ① 【目的 ＆ 順序の必然性】 */}
                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
                      <div className="font-black text-[#B84E34] flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        <span>① 目的 ＆ なぜこの順序か</span>
                      </div>
                      <div className="space-y-2 text-stone-700 leading-relaxed">
                        <div>
                          <strong className="text-stone-900 font-bold block text-[11px] mb-0.5">【学ぶ目的】</strong>
                          <p>{step.goalDefinition.purpose}</p>
                        </div>
                        <div className="pt-1.5 border-t border-[#E8E2D5]/60">
                          <strong className="text-stone-900 font-bold block text-[11px] mb-0.5">【順序の必然性】</strong>
                          <p className="text-stone-600">{step.learningExperience.whyThisOrder}</p>
                        </div>
                      </div>
                    </div>

                    {/* ② 【学習項目（Must分解WBS ＆ スコープ制約）】 */}
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70 space-y-2">
                      <div className="font-black text-amber-900 flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>② Must分解 ＆ 制約</span>
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full font-bold">
                          挫折防止
                        </span>
                      </div>
                      <div className="space-y-2 text-stone-700 leading-relaxed">
                        <div>
                          <strong className="text-amber-950 font-bold block text-[11px] mb-1">【Must作業タスク（WBS）】</strong>
                          <ul className="space-y-1 pl-1">
                            {step.scopePriority.wbsBreakdown.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                                <span className="text-amber-700 font-bold shrink-0">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-amber-200/50">
                          <strong className="text-rose-700 font-bold block text-[11px] mb-0.5">🛑 広げすぎない制約:</strong>
                          <p className="text-[11px] text-stone-600 bg-white/70 p-1.5 rounded-lg border border-amber-200/40">
                            {step.scopePriority.scopeGuard}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ③ 【Done定義 ＆ 具体的行動ストーリー】 */}
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/70 space-y-2">
                      <div className="font-black text-emerald-900 flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>③ Done定義 ＆ ストーリー</span>
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold">
                          完了基準
                        </span>
                      </div>
                      <div className="space-y-2 text-stone-700 leading-relaxed">
                        <div>
                          <strong className="text-emerald-950 font-bold block text-[11px] mb-0.5">【完了判定の基準】</strong>
                          <p className="font-medium text-emerald-900 bg-white/80 p-2 rounded-xl border border-emerald-200/60 text-[11px]">
                            {step.goalDefinition.doneDefinition}
                          </p>
                        </div>
                        <div className="pt-1.5 border-t border-emerald-200/50">
                          <strong className="text-stone-900 font-bold block text-[11px] mb-0.5">🎬 行動シナリオ例:</strong>
                          <p className="text-stone-600 text-[11px]">{step.goalDefinition.userStory}</p>
                        </div>
                        <div className="pt-1 text-[11px] text-stone-500">
                          <strong>📦 成果物: </strong>{step.goalDefinition.deliverable}
                        </div>
                      </div>
                    </div>

                    {/* ④ 【つまずき予見 ＆ 5分縮小プロトコル】 */}
                    <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200/70 space-y-2">
                      <div className="font-black text-rose-900 flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>④ つまずき ＆ 5分回避策</span>
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.2 rounded-full font-bold">
                          習慣継続
                        </span>
                      </div>
                      <div className="space-y-2 text-stone-700 leading-relaxed">
                        <div>
                          <strong className="text-rose-950 font-bold block text-[11px] mb-0.5">⚠️ 事前に知っておく壁:</strong>
                          <p className="text-[11px] text-stone-600">{step.learningExperience.commonStumblingBlock}</p>
                        </div>
                        <div className="pt-2 border-t border-rose-200/50">
                          <strong className="text-[#B84E34] font-black block text-[11px] mb-1">
                            🛡️ 忙しい日の5分縮小プロトコル:
                          </strong>
                          <p className="text-[11px] text-stone-700 bg-white/80 p-2 rounded-xl border border-rose-200/50 font-medium">
                            {step.learningExperience.riskAndFallback.fallbackProtocol}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 象徴モデルセリフ行（音声再生ボタンつき） */}
                  <div className="bg-[#FAF0EC]/30 border border-[#F2DED7] rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#B84E34] bg-[#FAF0EC] px-2 py-0.5 rounded-md border border-[#F0D5CD]">
                          🗣️ この駅の象徴セリフ
                        </span>
                        <span className="font-black text-[#1B2A38] text-xs sm:text-sm truncate">
                          {step.representativeSpeech.ko}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 pl-1">{step.representativeSpeech.ja}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => playSpeech(step.representativeSpeech.ko, step.step)}
                      className={`px-3 py-1.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        playingStep === step.step
                          ? 'bg-[#B84E34] text-white animate-pulse'
                          : 'bg-white text-[#B84E34] border-[#F0D5CC] hover:bg-[#FAF0EC]'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{playingStep === step.step ? '再生中...' : 'ネイティブ音声を聴く'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🚆 モード②：駅別フォーカス（メトロ路線図 ＆ 1駅深掘りマガジン）      */}
      {/* ===================================================================== */}
      {viewMode === 'focus' && (
        <div className="space-y-6">
          {/* レールナビゲーター */}
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
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1.5 bg-stone-200 rounded-full z-0" />
                <div
                  className="absolute left-8 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-emerald-500 via-[#B84E34] to-amber-500 rounded-full transition-all duration-500 z-0"
                  style={{
                    width: `calc(${(activeStepIndex / (ROADMAP_STEPS.length - 1)) * 100}% - 32px)`,
                  }}
                />

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

          {/* 選択中の駅のフォーカスマガジンカード */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-300">
            {/* ヘッダー行 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
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
                  <span>📅 目安期間: <strong className="text-stone-800">{activeStep.scopePriority.timeboxWeeks}</strong></span>
                </div>
              </div>

              {/* クイックアクション */}
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
                    <span>教科書へ</span>
                  </button>
                )}
              </div>
            </div>

            {/* 駅カード内タブナビゲーション */}
            <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setStationTab('goal')}
                className={`pb-2 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  stationTab === 'goal'
                    ? 'border-[#B84E34] text-[#B84E34]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>1. ゴール ＆ Done定義</span>
              </button>
              <button
                type="button"
                onClick={() => setStationTab('scope')}
                className={`pb-2 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  stationTab === 'scope'
                    ? 'border-[#B84E34] text-[#B84E34]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. スコープ制御 ＆ WBS</span>
              </button>
              <button
                type="button"
                onClick={() => setStationTab('experience')}
                className={`pb-2 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  stationTab === 'experience'
                    ? 'border-[#B84E34] text-[#B84E34]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>3. 学習体験 ＆ 縮小プロトコル</span>
              </button>
              <button
                type="button"
                onClick={() => setStationTab('speech')}
                className={`pb-2 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  stationTab === 'speech'
                    ? 'border-[#B84E34] text-[#B84E34]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>4. 象徴セリフ ＆ SLA分析</span>
              </button>
            </div>

            {/* タブ①: ゴール ＆ Done定義 */}
            {stationTab === 'goal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
                    <span className="font-black text-[#B84E34] flex items-center gap-1.5">
                      <Target className="w-4 h-4" /> 目的（なぜ学ぶのかの核）
                    </span>
                    <p className="text-stone-800 leading-relaxed font-medium">
                      {activeStep.goalDefinition.purpose}
                    </p>
                    <div className="pt-2 border-t border-[#E8E2D5] text-[11px] text-stone-500">
                      <strong>公的Can-Do基準: </strong>{activeStep.academicBasis.officialCanDo}
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
                    <span className="font-black text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Done定義（完了基準）
                    </span>
                    <p className="text-emerald-950 leading-relaxed font-medium bg-white/80 p-2.5 rounded-xl border border-emerald-200/50">
                      {activeStep.goalDefinition.doneDefinition}
                    </p>
                    <div className="text-[11px] text-emerald-800">
                      <strong>手元に残る成果物: </strong>{activeStep.goalDefinition.deliverable}
                    </div>
                  </div>
                </div>

                {/* 具体的行動ストーリー例 */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                    <span>🎬 説明できるストーリー例（学習完了後の具体的行動シナリオ）:</span>
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D5]">
                    {activeStep.goalDefinition.userStory}
                  </p>
                </div>
              </div>
            )}

            {/* タブ②: スコープ制御 ＆ WBS */}
            {stationTab === 'scope' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Must */}
                  <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-rose-900">🔥 Must（必須の骨格）</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">最優先</span>
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {activeStep.scopePriority.must.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-stone-800 leading-normal">
                          <span className="text-rose-600 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Should */}
                  <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-900">⭐ Should（日常の展開）</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">推奨</span>
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {activeStep.scopePriority.should.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-stone-700 leading-normal">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Could */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-stone-700">💤 Could（今は捨てる）</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-stone-200 text-stone-600 font-bold">後回し</span>
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {activeStep.scopePriority.could.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-stone-500 leading-normal">
                          <span className="text-stone-400 font-bold shrink-0">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Must作業分解 WBS ＆ スコープ制約 */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                  <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#B84E34]" />
                    <span>Mustを達成するための作業分解タスク（WBS）:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeStep.scopePriority.wbsBreakdown.map((task, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] text-stone-800 font-medium flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#FAF0EC] text-[#B84E34] text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex items-start gap-2">
                    <span className="text-amber-700 font-black shrink-0">🛑 スコープ拡大防止原則:</span>
                    <span className="text-stone-700">{activeStep.scopePriority.scopeGuard}</span>
                  </div>
                </div>
              </div>
            )}

            {/* タブ③: 学習体験 ＆ 縮小プロトコル */}
            {stationTab === 'experience' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  {/* なぜこの順番か ＆ ミニマイルストーン */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-3">
                    <div className="space-y-1">
                      <span className="font-black text-[#B84E34] flex items-center gap-1.5">
                        <Compass className="w-4 h-4" /> なぜこの順番で学ぶのか
                      </span>
                      <p className="text-stone-700 leading-relaxed font-medium">
                        {activeStep.learningExperience.whyThisOrder}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E8E2D5] space-y-1.5">
                      <strong className="text-stone-900 font-bold block text-[11px]">
                        🎉 ドーパミンが出るミニ到達目標（マイルストーン）:
                      </strong>
                      <div className="space-y-1 pl-1">
                        {activeStep.learningExperience.miniMilestones.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-stone-700">
                            <span className="px-2 py-0.5 rounded-md bg-stone-200/70 font-mono font-bold text-stone-800 text-[10px] shrink-0">
                              {m.milestone}
                            </span>
                            <span>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* つまずき予見 ＆ 5分縮小プロトコル */}
                  <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200/80 space-y-3">
                    <div className="space-y-1">
                      <span className="font-black text-rose-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" /> よくあるつまずきポイント（事前に壁を予見）
                      </span>
                      <p className="text-stone-700 leading-relaxed text-[11px]">
                        {activeStep.learningExperience.commonStumblingBlock}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-rose-200/60 bg-white/80 p-3 rounded-xl border border-rose-200/50 space-y-1">
                      <div className="font-black text-[#B84E34] flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>忙しい日の「5分縮小プロトコル」</span>
                      </div>
                      <p className="text-stone-800 text-[11px] font-medium leading-relaxed">
                        {activeStep.learningExperience.riskAndFallback.fallbackProtocol}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 初心者向け用語補足 */}
                {activeStep.learningExperience.jargonBuster && (
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 shadow-2xs text-xs">
                    <span className="font-black text-stone-800 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#B84E34]" />
                      <span>初心者にもわかる用語の噛み砕き補足:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {activeStep.learningExperience.jargonBuster.map((j, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                          <strong className="text-stone-900 font-bold block">{j.term}</strong>
                          <p className="text-stone-600 text-[11px] leading-relaxed">{j.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* タブ④: 象徴モデルセリフ ＆ SLA分析 */}
            {stationTab === 'speech' && (
              <div className="space-y-4">
                {/* モデルセリフカード */}
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

                  <div className="text-xs text-stone-600 leading-relaxed bg-white/60 p-3 rounded-xl border border-[#F0D5CC]/60">
                    <strong className="text-[#B84E34]">💡 言語学的評価点: </strong>
                    <span>{activeStep.representativeSpeech.linguisticPoint}</span>
                  </div>
                </div>

                {/* SLA分析 誤用の罠と打開策 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <span>⚠️ 日本語話者の頻出誤用の罠 (SLA):</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      {activeStep.slaTips.frequentError}
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1.5">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                      <span>💡 認知言語学的ブレイクスルー (打開策):</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      {activeStep.slaTips.breakthrough}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 🔗 直結教材リンク行 */}
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
        </div>
      )}

      {/* ===================================================================== */}
      {/* 📜 モード③：全駅スクロールリスト（従来のリニア閲覧ビュー）             */}
      {/* ===================================================================== */}
      {viewMode === 'list' && (
        <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 via-[#B84E34] to-amber-500 before:rounded-full">
          {ROADMAP_STEPS.map((step) => {
            const stationColor = step.stationColor || '#B84E34';
            const stepMeta = STEP_META[step.step];

            return (
              <div key={step.step} className="relative group">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D5]">
                      <strong className="text-stone-800 block text-[11px] mb-0.5">🎯 Done定義:</strong>
                      <p className="text-stone-700">{step.goalDefinition.doneDefinition}</p>
                    </div>
                    <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-200/60">
                      <strong className="text-rose-900 block text-[11px] mb-0.5">🛡️ 5分縮小プロトコル:</strong>
                      <p className="text-stone-700">{step.learningExperience.riskAndFallback.fallbackProtocol}</p>
                    </div>
                  </div>

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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
