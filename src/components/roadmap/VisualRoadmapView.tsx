import React, { useState, useMemo, useEffect } from 'react';
import {
  Map,
  Target,
  MessageCircle,
  Volume2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  Check,
  Compass,
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
  Trophy,
  LifeBuoy,
  Lock,
  Unlock,
  Flame,
  X,
  Play,
  RotateCcw,
  Languages,
  MessageSquare,
  Send,
  TrendingUp,
  Briefcase,
  Crown,
  Coffee,
  ShoppingBag,
  Heart,
  Building2,
  PhoneCall,
  MessagesSquare,
  Presentation,
  Tv,
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HorangiMascot } from '../mascot/HorangiMascot';
import { RoadmapStep, GuideTab } from '../../types/guide';
import { ROADMAP_STEPS } from '../../data/roadmap';
import { STAGE_DRILLS, QuestDrillData } from '../../data/stageMicroDrills';
import { speechService } from '../../utils/speech';
import {
  GamificationState,
  getInitialGamificationState,
  saveGamificationState,
  calculateLevelInfo,
} from '../../utils/gamification';

interface VisualRoadmapViewProps {
  onNavigateToExam?: (examId?: string) => void;
  onNavigateToContent?: (id: string, tab?: GuideTab) => void;
  showPronunciation?: boolean;
}

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
    accentGradient: 'from-emerald-500 to-teal-600',
  },
  2: {
    examId: 'hanken_5',
    examLabel: 'ハングル検定 5級 模擬試験',
    stageLabel: '第1章（第6〜10課）基本時制',
    firstLessonId: 'lesson-6',
    accentGradient: 'from-sky-500 to-blue-600',
  },
  3: {
    examId: 'hanken_4',
    examLabel: 'ハングル検定 4級 模擬試験',
    stageLabel: '第2章（第11〜20課）不規則活用',
    firstLessonId: 'lesson-11',
    accentGradient: 'from-amber-500 to-orange-600',
  },
  4: {
    examId: 'topik1',
    examLabel: 'TOPIK I 模擬試験（1・2級）',
    stageLabel: '第3章（第21〜30課）複文・連体形',
    firstLessonId: 'lesson-21',
    accentGradient: 'from-rose-500 to-red-600',
  },
  5: {
    examId: 'hanken_3',
    examLabel: 'ハングル検定 3級 模擬試験',
    stageLabel: '第4章（第31〜35課）中級実戦',
    firstLessonId: 'lesson-31',
    accentGradient: 'from-violet-500 to-purple-600',
  },
  6: {
    examId: 'hanken_pre2',
    examLabel: 'ハングル検定 準2級 模擬試験',
    stageLabel: '第5章（第36〜40課）中上級完成',
    firstLessonId: 'lesson-36',
    accentGradient: 'from-blue-600 to-indigo-700',
  },
  7: {
    examId: 'topik2',
    examLabel: 'TOPIK II 模擬試験（3・4級）',
    stageLabel: '文法大辞典（No.181〜225）高級論理',
    firstLessonId: 'dict-181',
    accentGradient: 'from-teal-600 to-cyan-700',
  },
  8: {
    examId: 'topik2',
    examLabel: 'TOPIK II 模擬試験（5・6級）',
    stageLabel: '文法大辞典（No.226〜250）格調論述',
    firstLessonId: 'dict-226',
    accentGradient: 'from-rose-600 via-pink-600 to-amber-500',
  },
};

const STAGE_QUEST_META: Record<
  number,
  {
    stageName: string;
    scenarioTitle: string;
    themeGradient: string;
    bossLabel: string;
    bossPassScore: number;
  }
> = {
  1: {
    stageName: 'ハングル解読アイランド',
    scenarioTitle: '明洞のカフェで、メニューを指差さずに「아메리카노 하나 주세요」と注文してレシートを受け取れる！',
    themeGradient: 'from-emerald-500 to-teal-600',
    bossLabel: 'ハングル検定 5級 模擬試験',
    bossPassScore: 60,
  },
  2: {
    stageName: '日常会話の骨格アイランド',
    scenarioTitle: '韓国人の友達に「週末は何をしたの？」と聞かれて、自分の予定や過去の行動をスラスラ即答できる！',
    themeGradient: 'from-sky-500 to-blue-600',
    bossLabel: 'ハングル検定 5級 模擬試験',
    bossPassScore: 60,
  },
  3: {
    stageName: '不規則活用・感情表現アイランド',
    scenarioTitle: '服屋で「少し小さいので大きいサイズを見せてください」と要望を伝え、推しにファンレターを書ける！',
    themeGradient: 'from-amber-500 to-orange-600',
    bossLabel: 'ハングル検定 4級 模擬試験',
    bossPassScore: 70,
  },
  4: {
    stageName: '初級完全制覇・自立アイランド',
    scenarioTitle: 'ホテルのチェックインで「荷物を預かってもらえますか？朝食は何時ですか？」と全て韓国語で交渉できる！',
    themeGradient: 'from-rose-500 to-red-600',
    bossLabel: 'TOPIK I 模擬試験（初級完成）',
    bossPassScore: 50,
  },
  5: {
    stageName: '社会・伝言・間接話法アイランド',
    scenarioTitle: '職場で「キム課長から電話があり、会議は午後2時から始めるとのことでした」と正確に報告・伝言できる！',
    themeGradient: 'from-violet-500 to-purple-600',
    bossLabel: 'ハングル検定 3級 模擬試験',
    bossPassScore: 70,
  },
  6: {
    stageName: '論理ディスカッションアイランド',
    scenarioTitle: '若者の流行や就職事情について、賛成・反対の理由を添えて韓国人と20分間議論できる！',
    themeGradient: 'from-blue-600 to-indigo-700',
    bossLabel: 'ハングル検定 準2級 模擬試験',
    bossPassScore: 70,
  },
  7: {
    stageName: 'ビジネス商談・学術小論文アイランド',
    scenarioTitle: 'ビジネス会議で新商品をプレゼンし、相手の反論に対して論理的根拠を示して納得させられる！',
    themeGradient: 'from-teal-600 to-cyan-700',
    bossLabel: 'TOPIK II 模擬試験（中上級）',
    bossPassScore: 40,
  },
  8: {
    stageName: 'ネイティブ・文化的共生アイランド',
    scenarioTitle: 'テレビの時事討論番組を字幕なしで100%理解し、ジョークも含めて現地の人と対等に笑い合える！',
    themeGradient: 'from-rose-600 via-pink-600 to-amber-500',
    bossLabel: 'TOPIK II 模擬試験（最上級）',
    bossPassScore: 70,
  },
};

const STAGE_ICONS: Record<number, React.FC<{ className?: string }>> = {
  1: Languages,
  2: MessageSquare,
  3: Sparkles,
  4: Compass,
  5: Send,
  6: TrendingUp,
  7: Briefcase,
  8: Crown,
};

const SCENARIO_ICONS: Record<number, React.FC<{ className?: string }>> = {
  1: Coffee,
  2: ShoppingBag,
  3: Heart,
  4: Building2,
  5: PhoneCall,
  6: MessagesSquare,
  7: Presentation,
  8: Tv,
};

type RoadmapViewMode = 'quest' | 'matrix' | 'focus';
type StationDetailTab = 'goal' | 'scope' | 'experience' | 'speech';

export const VisualRoadmapView: React.FC<VisualRoadmapViewProps> = ({
  onNavigateToExam,
  onNavigateToContent,
  showPronunciation = true,
}) => {
  const [viewMode, setViewMode] = useState<RoadmapViewMode>('quest');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [playingStep, setPlayingStep] = useState<number | null>(null);
  const [stationTab, setStationTab] = useState<StationDetailTab>('goal');
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'beginner' | 'advanced'>('all');

  // ゲーミフィケーション状態管理
  const [gameState, setGameState] = useState<GamificationState>(getInitialGamificationState);

  // ステージ選択（1〜8）＆表示形式（1ステージ集中 or 全体一覧）
  const [selectedStage, setSelectedStage] = useState<number>(() =>
    Math.min(8, Math.max(1, gameState.unlockedStage))
  );
  const [questDisplayMode, setQuestDisplayMode] = useState<'focused' | 'all'>('focused');
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideModalTab, setGuideModalTab] = useState<'goal' | 'matrix' | 'sla' | 'settings'>('goal');

  // クイック特訓ドリルモーダル状態
  const [activeDrill, setActiveDrill] = useState<QuestDrillData | null>(null);
  const [drillStepNum, setDrillStepNum] = useState<number>(1);
  const [drillTaskIdx, setDrillTaskIdx] = useState<number>(0);
  const [drillQuestionIndex, setDrillQuestionIndex] = useState(0);
  const [drillSelectedOption, setDrillSelectedOption] = useState<number | null>(null);
  const [drillIsAnswered, setDrillIsAnswered] = useState(false);
  const [drillScore, setDrillScore] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);

  // レベル情報
  const levelInfo = useMemo(() => calculateLevelInfo(gameState.xp), [gameState.xp]);

  // ステート保存
  useEffect(() => {
    saveGamificationState(gameState);
  }, [gameState]);

  // 音声再生
  const playSpeech = (koText: string, stepNum?: number) => {
    if (stepNum && playingStep === stepNum) {
      speechService.stop();
      setPlayingStep(null);
      return;
    }
    if (stepNum) setPlayingStep(stepNum);
    speechService.speak(koText, {
      onEnd: () => setPlayingStep(null),
      onError: () => setPlayingStep(null),
    });
  };

  // XP獲得と報酬演出
  const awardXP = (amount: number, reason: string) => {
    setGameState((prev) => {
      const nextXP = prev.xp + amount;
      return { ...prev, xp: nextXP };
    });
  };

  // クエスト完了のトグル
  const handleToggleQuest = (stepNum: number, taskIdx: number, totalTasks: number) => {
    const key = `s${stepNum}_t${taskIdx}`;
    const nextState = !gameState.completedQuests[key];

    setGameState((prev) => {
      const updatedQuests = { ...prev.completedQuests, [key]: nextState };
      const nextXP = nextState ? prev.xp + 50 : Math.max(0, prev.xp - 50);

      // ステージ全クエスト制覇判定
      let stageAllClear = true;
      for (let i = 0; i < totalTasks; i++) {
        if (!updatedQuests[`s${stepNum}_t${i}`]) {
          stageAllClear = false;
          break;
        }
      }

      // 次のステージのアンロック（ステージクリア時）
      let nextUnlocked = prev.unlockedStage;
      if (stageAllClear && stepNum >= prev.unlockedStage && stepNum < 8) {
        nextUnlocked = stepNum + 1;
      }

      return {
        ...prev,
        xp: nextXP,
        unlockedStage: nextUnlocked,
        completedQuests: updatedQuests,
      };
    });

    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  // ドリルの開始
  const startQuestDrill = (stepNum: number, taskIdx: number) => {
    const key = `s${stepNum}_t${taskIdx}`;
    const drill = STAGE_DRILLS[key];
    if (!drill) {
      // ドリル未定義の場合は手動完了へ誘導
      handleToggleQuest(stepNum, taskIdx, ROADMAP_STEPS[stepNum - 1].scopePriority.wbsBreakdown.length);
      return;
    }
    setActiveDrill(drill);
    setDrillStepNum(stepNum);
    setDrillTaskIdx(taskIdx);
    setDrillQuestionIndex(0);
    setDrillSelectedOption(null);
    setDrillIsAnswered(false);
    setDrillScore(0);
    setDrillFinished(false);
  };

  // ドリルの選択肢回答
  const handleDrillAnswer = (optionIdx: number) => {
    if (!activeDrill || drillIsAnswered) return;
    setDrillSelectedOption(optionIdx);
    setDrillIsAnswered(true);

    const currentQ = activeDrill.questions[drillQuestionIndex];
    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      setDrillScore((prev) => prev + 1);
      if (currentQ.audioText) {
        playSpeech(currentQ.audioText);
      }
    }
  };

  // ドリルの次へ or 終了
  const handleNextDrillQuestion = () => {
    if (!activeDrill) return;
    if (drillQuestionIndex < activeDrill.questions.length - 1) {
      setDrillQuestionIndex((prev) => prev + 1);
      setDrillSelectedOption(null);
      setDrillIsAnswered(false);
    } else {
      setDrillFinished(true);
      // ドリル完了報酬
      awardXP(60, 'ドリルクリア');
      // クエストを完了にする
      const totalTasks = ROADMAP_STEPS[drillStepNum - 1].scopePriority.wbsBreakdown.length;
      handleToggleQuest(drillStepNum, drillTaskIdx, totalTasks);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    }
  };

  // 自由探索モード（全解放）の切り替え
  const toggleFreeExplore = () => {
    setGameState((prev) => ({
      ...prev,
      freeExploreMode: !prev.freeExploreMode,
    }));
  };

  const activeStep = ROADMAP_STEPS[activeStepIndex];
  const meta = STEP_META[activeStep.step];

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

  const filteredSteps = useMemo(() => {
    if (matrixFilter === 'beginner') {
      return ROADMAP_STEPS.filter((s) => s.step <= 4);
    }
    if (matrixFilter === 'advanced') {
      return ROADMAP_STEPS.filter((s) => s.step >= 5);
    }
    return ROADMAP_STEPS;
  }, [matrixFilter]);

  // 1つのステージカードをレンダリングする関数（集中モード or 一覧モードで共用）
  const renderStageCard = (step: RoadmapStep, isSingleView: boolean) => {
    const qMeta = STAGE_QUEST_META[step.step];
    const stepMeta = STEP_META[step.step];
    const StageIcon = STAGE_ICONS[step.step] || Sparkles;
    const ScenarioIcon = SCENARIO_ICONS[step.step] || Coffee;
    const totalQuests = step.scopePriority.wbsBreakdown.length;
    const isUnlocked = gameState.freeExploreMode || step.step <= gameState.unlockedStage;

    let doneCount = 0;
    for (let i = 0; i < totalQuests; i++) {
      if (gameState.completedQuests[`s${step.step}_t${i}`]) {
        doneCount++;
      }
    }
    const isStageCleared = doneCount === totalQuests && totalQuests > 0;
    const progressPercent = Math.round((doneCount / totalQuests) * 100);
    const bossScore = gameState.clearedBossExams[stepMeta.examId];
    const isBossCleared = bossScore !== undefined && bossScore >= qMeta.bossPassScore;

    // 最初の未完了クエストインデックス
    const firstIncompleteIdx = step.scopePriority.wbsBreakdown.findIndex(
      (_, idx) => !gameState.completedQuests[`s${step.step}_t${idx}`]
    );

    return (
      <div key={step.step} className="w-full space-y-4">
        {/* ステージヘッダーカード */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-3.5 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${qMeta.themeGradient} text-white flex items-center justify-center shadow-xs shrink-0`}
              >
                <StageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                    Stage {step.step} / 8
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black text-[#B84E34] bg-[#FAF0EC] px-2 py-0.5 rounded-full border border-[#F0D5CD]">
                    {step.badge}
                  </span>
                  {isStageCleared && (
                    <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 制覇
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#1B2A38] tracking-tight truncate mt-0.5">
                  {qMeta.stageName}
                </h3>
              </div>
            </div>

            {/* 進捗プログレス */}
            <div className="text-right shrink-0">
              <span className={`text-xs sm:text-sm font-black ${isStageCleared ? 'text-emerald-700' : 'text-[#B84E34]'}`}>
                {doneCount} / {totalQuests}
              </span>
              <div className="w-16 sm:w-20 bg-stone-200 rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isStageCleared ? 'bg-emerald-500' : 'bg-[#B84E34]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ロック時の案内オーバーレイ */}
        {!isUnlocked ? (
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 text-white flex items-center justify-center text-lg shadow-md mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-stone-800">
              Stage {step.step} は順次解放中です
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              前のステージ（Stage {step.step - 1}）のボス検定に合格するか、「自由解放」で即座に挑戦できます。
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {step.step > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedStage(step.step - 1)}
                  className="px-4 py-2 rounded-xl bg-[#B84E34] text-white text-xs font-bold hover:bg-[#a2432c] transition-all cursor-pointer shadow-xs"
                >
                  Stage {step.step - 1} へ戻る
                </button>
              )}
              <button
                type="button"
                onClick={toggleFreeExplore}
                className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-all cursor-pointer"
              >
                自由解放をONにする
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ★ ユーザー要望：今日やることは決まっているわけだから、そこだけでいい（Hero Card） */}
            <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10.5px] font-black uppercase tracking-wider">
                      <Zap className="w-3 h-3 fill-amber-600 text-amber-600" />
                      {firstIncompleteIdx !== -1
                        ? `今日のNEXT STEP : 第 ${firstIncompleteIdx + 1} 問`
                        : 'ステージ全特訓クリア！'}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500 font-mono">
                      {doneCount}/{totalQuests} 達成
                    </span>
                  </div>

                  {firstIncompleteIdx !== -1 ? (
                    <>
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-black text-[#1B2A38] leading-snug">
                          {step.scopePriority.wbsBreakdown[firstIncompleteIdx]}
                        </h3>
                        <p className="text-xs text-stone-600 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#B84E34] shrink-0" />
                          <span className="truncate">{qMeta.scenarioTitle}</span>
                        </p>
                      </div>

                      {/* Duolingo風 3D立体プッシュボタン */}
                      <button
                        type="button"
                        onClick={() => startQuestDrill(step.step, firstIncompleteIdx)}
                        className="w-full py-3.5 px-5 rounded-2xl bg-[#B84E34] hover:bg-[#a2432c] text-white font-black text-sm sm:text-base cursor-pointer transition-all duration-100 shadow-[0_5px_0_#853420] active:translate-y-1 active:shadow-[0_1px_0_#853420] flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300 text-amber-300 animate-bounce" />
                        <span>30秒特訓をスタート (+60 XP)</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-black text-emerald-900 leading-snug">
                          全クエスト制覇！次はボス検定（模試）です！
                        </h3>
                        <p className="text-xs text-stone-600">
                          【{qMeta.bossLabel}】（合格基準: {qMeta.bossPassScore}点以上）で次のステージが解放されます。
                        </p>
                      </div>

                      {onNavigateToExam && (
                        <button
                          type="button"
                          onClick={() => onNavigateToExam(stepMeta.examId)}
                          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#B84E34] hover:opacity-95 text-white font-black text-sm sm:text-base cursor-pointer transition-all duration-100 shadow-[0_5px_0_#853420] active:translate-y-1 active:shadow-[0_1px_0_#853420] flex items-center justify-center gap-2"
                        >
                          <Trophy className="w-5 h-5 text-amber-200 animate-bounce" />
                          <span>{isBossCleared ? 'ボス検定に再挑戦 ➔' : 'ボス検定（模試）に挑む ➔'}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* 🐯 Duolingo風 マスコット（ホランイ / Horangi） */}
                <div className="shrink-0 flex flex-col items-center pt-1 sm:pt-0">
                  <HorangiMascot
                    size="md"
                    mood={firstIncompleteIdx !== -1 ? 'cheering' : 'trophy'}
                    message={
                      firstIncompleteIdx !== -1
                        ? gameState.streakDays > 1
                          ? `🔥 ${gameState.streakDays}日連続！`
                          : '오늘도 화이팅!'
                        : '축하해요! 제패!'
                    }
                    subMessage={
                      firstIncompleteIdx !== -1
                        ? gameState.streakDays > 1
                          ? 'この調子で1問解こう！'
                          : '今日も一歩進めよう！'
                        : 'ボス検定に挑戦しよう！'
                    }
                    interactive={true}
                  />
                </div>
              </div>
            </div>

            {/* ★ Duolingo風 冒険ステップトレイル（縦に並ぶ触覚ノード） */}
            <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs">
              <div className="text-center mb-2">
                <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
                  QUEST PATH
                </span>
              </div>

              <div className="relative py-4 flex flex-col items-center gap-7">
                {/* 背景の縦方向コネクター線 */}
                <div className="absolute top-6 bottom-14 left-1/2 w-1.5 -translate-x-1/2 bg-stone-100 rounded-full" />

                {step.scopePriority.wbsBreakdown.map((task, tIdx) => {
                  const isDone = !!gameState.completedQuests[`s${step.step}_t${tIdx}`];
                  const isCurrent = tIdx === firstIncompleteIdx;
                  const isLocked = !isDone && !isCurrent && !gameState.freeExploreMode;
                  // S字交互配置
                  const offsets = [
                    'translate-x-0',
                    'translate-x-6 sm:translate-x-8',
                    'translate-x-10 sm:translate-x-12',
                    'translate-x-4 sm:translate-x-6',
                    '-translate-x-6 sm:-translate-x-8',
                  ];
                  const offsetClass = offsets[tIdx % offsets.length];

                  return (
                    <div
                      key={tIdx}
                      className={`relative flex flex-col items-center z-10 transition-transform ${offsetClass}`}
                    >
                      {/* 現在地の場合の浮遊吹き出しバッジ ＆ ソナー発光リング ＆ ミニホランイ */}
                      {isCurrent && (
                        <>
                          <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-[#B84E34] text-white text-[10.5px] font-black shadow-md animate-bounce whitespace-nowrap z-20 flex items-center gap-1 ring-2 ring-white">
                            <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                            <span>ここから！</span>
                          </div>

                          {/* ソナーのように広がる発光パルスリング */}
                          <div className="absolute top-0 w-14 h-14 sm:w-16 sm:h-16 rounded-3xl border-2 border-[#B84E34] animate-sonar-ping pointer-events-none" />

                          {/* ミニマスコットがノードの隣から手を振る */}
                          <div className="absolute -left-12 sm:-left-14 -top-2 z-20 hidden xs:block">
                            <HorangiMascot size="sm" mood="cheering" showMessage={false} interactive={true} />
                          </div>
                        </>
                      )}

                      {/* 3D立体ノードボタン */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isLocked) startQuestDrill(step.step, tIdx);
                        }}
                        disabled={isLocked}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center font-black transition-all cursor-pointer relative ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-[0_5px_0_#047857] hover:bg-emerald-600 active:translate-y-1 active:shadow-[0_1px_0_#047857]'
                            : isCurrent
                            ? 'bg-[#B84E34] text-white shadow-[0_5px_0_#853420] ring-4 ring-[#B84E34]/30 hover:bg-[#a2432c] active:translate-y-1 active:shadow-[0_1px_0_#853420]'
                            : 'bg-stone-200 text-stone-400 shadow-[0_4px_0_#a8a29e] cursor-not-allowed opacity-80'
                        }`}
                        title={task}
                      >
                        {isDone ? (
                          <div className="relative flex items-center justify-center">
                            <Check className="w-6 h-6 stroke-[3]" />
                            <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300 absolute -top-1 -right-1 animate-star-spin" />
                          </div>
                        ) : isCurrent ? (
                          <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
                        ) : (
                          <Lock className="w-5 h-5 text-stone-400" />
                        )}
                      </button>

                      {/* ノード下部のミニタイトル */}
                      <span className="text-[11px] font-bold text-stone-700 mt-2 max-w-[140px] text-center leading-tight">
                        {task.replace(/^[①-⑤\d\.\s]+/, '')}
                      </span>
                    </div>
                  );
                })}

                {/* ボス検定ノード */}
                <div className="relative flex flex-col items-center z-10 mt-3">
                  <button
                    type="button"
                    onClick={() => onNavigateToExam && onNavigateToExam(stepMeta.examId)}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-3xl flex items-center justify-center font-black transition-all cursor-pointer shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309] ${
                      isBossCleared
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-4 ring-amber-300'
                        : 'bg-gradient-to-br from-[#1B2A38] to-[#2E4256] text-white'
                    }`}
                    title={qMeta.bossLabel}
                  >
                    <Trophy className="w-7 h-7 text-amber-300" />
                  </button>
                  <div className="text-center mt-2 space-y-0.5">
                    <span className="text-xs font-black text-[#1B2A38] block">{qMeta.bossLabel}</span>
                    <span className="text-[10px] text-stone-500 font-bold block">
                      {isBossCleared ? `撃破済 (${bossScore}点)` : `合格ライン: ${qMeta.bossPassScore}点`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 前後Stage切り替えフッター */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={selectedStage <= 1}
                onClick={() => {
                  setSelectedStage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  selectedStage <= 1
                    ? 'text-stone-300 border border-stone-200 cursor-not-allowed'
                    : 'text-stone-700 border border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>前のStage</span>
              </button>

              <span className="text-xs font-black text-stone-400">
                Stage {selectedStage} / 8
              </span>

              <button
                type="button"
                disabled={selectedStage >= 8}
                onClick={() => {
                  setSelectedStage((prev) => Math.min(8, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  selectedStage >= 8
                    ? 'text-stone-300 border border-stone-200 cursor-not-allowed'
                    : 'text-stone-700 border border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <span>次のStage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* ===================================================================== */}
      {/* 🌟 メインヘッダー：ステージカルーセル ＆ 1ボタン学習ガイド              */}
      {/* ===================================================================== */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-2 sm:p-2.5 shadow-2xs flex items-center justify-between gap-2">
        {/* ステージ切り替えカルーセル */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
          {ROADMAP_STEPS.map((s) => {
            const isSelected = s.step === selectedStage;
            const isUnlocked = gameState.freeExploreMode || s.step <= gameState.unlockedStage;
            const bossScore = gameState.clearedBossExams[STEP_META[s.step]?.examId];
            const isBossCleared = bossScore !== undefined && bossScore >= STAGE_QUEST_META[s.step]?.bossPassScore;
            const PillIcon = STAGE_ICONS[s.step] || Sparkles;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setSelectedStage(s.step)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#B84E34] text-white shadow-2xs ring-2 ring-[#B84E34]/30'
                    : isUnlocked
                    ? 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                    : 'bg-stone-100/60 border border-stone-200/50 text-stone-400'
                }`}
              >
                <PillIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#B84E34]'}`} />
                <span className="whitespace-nowrap">Stage {s.step}</span>
                {isBossCleared ? (
                  <Trophy className="w-3 h-3 text-amber-300" />
                ) : !isUnlocked ? (
                  <Lock className="w-3 h-3 text-stone-400" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* 右側：ストリーク ＆ 単一の「学習ガイド」ボタン */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>{gameState.streakDays}日</span>
          </div>

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="目標定義・WBS・1枚シート・SLA母語干渉分析・設定を一括確認"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="whitespace-nowrap">学習ガイド</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 🎯 選択中ステージのクエスト（今日やること Hero ＆ 3Dノードトレイル）    */}
      {/* ===================================================================== */}
      {renderStageCard(ROADMAP_STEPS[selectedStage - 1], true)}

      {/* ===================================================================== */}
      {/* 📖 学習ガイド ＆ ロードマップ仕様書 モーダル（全情報を1つに集約）       */}
      {/* ===================================================================== */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95">
            {/* モーダル上部バー */}
            <div className="p-3.5 sm:p-4 border-b border-stone-100 flex items-center justify-between gap-3 bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#B84E34]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#1B2A38]">
                    学習ガイド ＆ ロードマップ仕様
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    目標Done定義・全体マトリクス・SLA母語干渉・設定
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* タブナビゲーション */}
            <div className="flex items-center gap-1.5 p-2 sm:px-4 bg-stone-100/70 border-b border-stone-200 overflow-x-auto no-scrollbar text-xs font-bold">
              <button
                type="button"
                onClick={() => setGuideModalTab('goal')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'goal'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>① ゴール ＆ Done定義</span>
              </button>
              <button
                type="button"
                onClick={() => setGuideModalTab('matrix')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'matrix'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>② 1枚完結シート</span>
              </button>
              <button
                type="button"
                onClick={() => setGuideModalTab('sla')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'sla'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>③ 駅別SLA解説</span>
              </button>
              <button
                type="button"
                onClick={() => setGuideModalTab('settings')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'settings'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>④ 設定 ＆ 進捗解放</span>
              </button>
            </div>

            {/* モーダルコンテンツ（スクロール可能） */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* ① ゴール ＆ Done定義 */}
              {guideModalTab === 'goal' && (
                <div className="space-y-4">
                  {/* ステージ切り替えセレクタ */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100 flex-wrap">
                    <span className="text-xs font-black text-stone-700 flex items-center gap-1">
                      <Compass className="w-4 h-4 text-[#B84E34]" />
                      <span>確認するStageを選択:</span>
                    </span>
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      {ROADMAP_STEPS.map((s) => (
                        <button
                          key={s.step}
                          type="button"
                          onClick={() => setActiveStepIndex(s.step - 1)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeStepIndex === s.step - 1
                              ? 'bg-[#B84E34] text-white shadow-2xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          Step {s.step}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 目的 ＆ Done定義 */}
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

                  {/* ユーザー行動ストーリー */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                    <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#B84E34]" />
                      <span>説明できるストーリー例（学習完了後の具体的行動シナリオ）:</span>
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D5]">
                      {activeStep.goalDefinition.userStory}
                    </p>
                  </div>

                  {/* スコープ防止 ＆ 5分縮小プロトコル */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                      <span className="font-black text-amber-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        スコープ拡大防止原則（挫折防止）
                      </span>
                      <p className="text-stone-700 leading-relaxed">
                        {activeStep.scopePriority.scopeGuard}
                      </p>
                    </div>

                    <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80 space-y-2">
                      <span className="font-black text-rose-900 flex items-center gap-1.5">
                        <LifeBuoy className="w-4 h-4 text-rose-600" />
                        忙しい日の「5分縮小プロトコル」
                      </span>
                      <p className="text-stone-800 leading-relaxed font-medium">
                        {activeStep.learningExperience.riskAndFallback.fallbackProtocol}
                      </p>
                    </div>
                  </div>

                  {/* 象徴モデル会話 ＆ ネイティブ音声再生 */}
                  <div className="bg-[#FAF0EC]/50 border border-[#F2DED7] rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#B84E34]">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" />
                        <span>代表モデル会話フレーズ（音声試聴）</span>
                      </span>
                      <span className="text-stone-400 font-normal text-[11px]">TOPIK / 話す基準</span>
                    </div>
                    <div className="flex items-start justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#F0D5CC]">
                      <div className="space-y-1">
                        <p className="font-black text-[#1B2A38] text-base">
                          {activeStep.representativeSpeech.ko}
                        </p>
                        {showPronunciation && activeStep.representativeSpeech.reading && (
                          <p className="text-xs text-stone-400 font-mono">
                            {activeStep.representativeSpeech.reading}
                          </p>
                        )}
                        <p className="text-xs text-stone-700">
                          {activeStep.representativeSpeech.ja}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => playSpeech(activeStep.representativeSpeech.ko, activeStep.step)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs ${
                          playingStep === activeStep.step
                            ? 'bg-[#B84E34] text-white animate-pulse'
                            : 'bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CC] hover:bg-[#F2DED7]'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ② 1枚完結シート */}
              {guideModalTab === 'matrix' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E2D5]">
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                        <Table className="w-4 h-4 text-[#B84E34]" />
                        <span>「フェーズ × 学習項目 × Done定義 × リスク対策」マトリクス</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        目標のブレ・教材の浮気・多忙による挫折を未然に防ぐ全体見渡しシート
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setMatrixFilter('all')}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          matrixFilter === 'all'
                            ? 'bg-[#B84E34] text-white shadow-2xs'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        すべて (1〜8)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMatrixFilter('beginner')}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          matrixFilter === 'beginner'
                            ? 'bg-[#B84E34] text-white shadow-2xs'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        初級 (1〜4)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMatrixFilter('advanced')}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          matrixFilter === 'advanced'
                            ? 'bg-[#B84E34] text-white shadow-2xs'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        中上級 (5〜8)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredSteps.map((step) => {
                      const meta = STEP_META[step.step];
                      return (
                        <div
                          key={step.step}
                          className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                style={{ backgroundColor: step.stationColor }}
                                className="w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-2xs"
                              >
                                {step.step}
                              </span>
                              <span className="text-sm sm:text-base font-black text-[#1B2A38]">
                                Step {step.step}: {step.stage}
                              </span>
                              <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                                {step.badge}
                              </span>
                              <span className="text-xs font-mono font-bold text-[#B84E34] bg-[#FAF0EC] px-2 py-0.5 rounded-full border border-[#F0D5CD]">
                                ⏱️ {step.timeHours}（{step.scopePriority.timeboxWeeks}）
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {onNavigateToExam && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowGuideModal(false);
                                    onNavigateToExam(meta.examId);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#B84E34] text-white text-xs font-bold hover:bg-[#a2432c] flex items-center gap-1 cursor-pointer"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>模試へ</span>
                                </button>
                              )}
                              {onNavigateToContent && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowGuideModal(false);
                                    onNavigateToContent(meta.firstLessonId, 'textbook');
                                  }}
                                  className="px-2.5 py-1 rounded-lg border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-[#B84E34]" />
                                  <span>教科書</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D5] space-y-1.5">
                              <span className="font-black text-[#B84E34] block">① 目的 ＆ 順序の必然性</span>
                              <p className="text-stone-700 leading-relaxed">{step.goalDefinition.purpose}</p>
                              <p className="text-[11px] text-stone-500 pt-1 border-t border-[#E8E2D5]">
                                {step.learningExperience.whyThisOrder}
                              </p>
                            </div>

                            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/70 space-y-1.5">
                              <span className="font-black text-amber-900 block">② Must作業タスク</span>
                              <ul className="space-y-0.5 text-stone-700">
                                {step.scopePriority.wbsBreakdown.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-amber-700 font-bold">✓</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/70 space-y-1.5">
                              <span className="font-black text-emerald-900 block">③ Done完了判定</span>
                              <p className="text-emerald-950 font-medium bg-white/80 p-2 rounded-lg border border-emerald-200/50">
                                {step.goalDefinition.doneDefinition}
                              </p>
                              <p className="text-[11px] text-stone-600">{step.goalDefinition.userStory}</p>
                            </div>

                            <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200/70 space-y-1.5">
                              <span className="font-black text-rose-900 block">④ 5分縮小プロトコル</span>
                              <p className="text-stone-700 text-[11px] bg-white/80 p-2 rounded-lg border border-rose-200/50">
                                {step.learningExperience.riskAndFallback.fallbackProtocol}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ③ 駅別SLA解説 */}
              {guideModalTab === 'sla' && (
                <div className="space-y-4">
                  {/* メトロ路線図駅セレクタ */}
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 pb-1">
                    <span className="flex items-center gap-1.5">
                      <Map className="w-3.5 h-3.5 text-[#B84E34]" />
                      <span>メトロ路線図（タップで駅切り替え）</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={activeStepIndex === 0}
                        className="w-7 h-7 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-stone-700 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono px-1">
                        {activeStepIndex + 1} / {ROADMAP_STEPS.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={activeStepIndex === ROADMAP_STEPS.length - 1}
                        className="w-7 h-7 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-stone-700 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto pb-2 scrollbar-thin">
                    <div className="flex items-center gap-2 min-w-[600px] py-2">
                      {ROADMAP_STEPS.map((s, idx) => (
                        <button
                          key={s.step}
                          type="button"
                          onClick={() => setActiveStepIndex(idx)}
                          className={`flex-1 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            idx === activeStepIndex
                              ? 'bg-[#B84E34] text-white border-[#B84E34] shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <div className="text-[10px] font-mono opacity-80">Step {s.step}</div>
                          <div className="text-xs font-black truncate">{s.stage}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SLA母語干渉 ＆ 打開策 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-1.5">
                      <div className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>日本語話者の頻出誤用の罠 (SLA母語干渉):</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {activeStep.slaTips.frequentError}
                      </p>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1.5">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                        <span>認知言語学的ブレイクスルー (打開策):</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {activeStep.slaTips.breakthrough}
                      </p>
                    </div>
                  </div>

                  {/* 用語の噛み砕き解説 */}
                  {activeStep.learningExperience.jargonBuster && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 shadow-2xs text-xs">
                      <span className="font-black text-stone-800 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#B84E34]" />
                        <span>初心者向け用語の噛み砕き補足:</span>
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

              {/* ④ 設定 ＆ 進捗解放 */}
              {guideModalTab === 'settings' && (
                <div className="space-y-4">
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                    <h4 className="text-sm font-black text-stone-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#B84E34]" />
                      <span>現在の学習レベル ＆ 獲得経験値</span>
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84E34] to-[#8f3a24] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                        {levelInfo.currentTier.badge}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#1B2A38] text-sm">{levelInfo.currentTier.title}</span>
                          <span className="text-stone-500 font-mono">{gameState.xp} XP</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#B84E34] h-full rounded-full transition-all duration-500"
                            style={{ width: `${levelInfo.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 自由探索モード切り替え */}
                  <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                          {gameState.freeExploreMode ? (
                            <Unlock className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-stone-600" />
                          )}
                          <span>自由解放モード（全ステージ閲覧・挑戦）</span>
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          通常は各ステージのボス検定に合格すると次ステージが解禁されます。復習や先取り学習のために全ステージを即座に解放できます。
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={toggleFreeExplore}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 shadow-xs ${
                          gameState.freeExploreMode
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {gameState.freeExploreMode ? '自由解放中（ON）' : '順次アンロック（OFF）'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 30秒クイック特訓ドリル モーダル                                      */}
      {/* ===================================================================== */}
      {activeDrill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                  <Zap className="w-4 h-4 text-amber-600" />
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-[#1B2A38]">
                    30秒クイック特訓: {activeDrill.title}
                  </h4>
                  <span className="text-[11px] text-stone-500 font-bold">
                    {drillFinished ? '特訓完了！' : `第 ${drillQuestionIndex + 1} / ${activeDrill.questions.length} 問`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrill(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 問題コンテンツ */}
            {!drillFinished ? (
              <div className="space-y-3.5">
                {/* 🐯 Duolingo風 マスコット感情リアクション（回答前・正解・不正解で動的に変化） */}
                <div className="flex justify-center -mb-1">
                  <HorangiMascot
                    size="md"
                    mood={
                      !drillIsAnswered
                        ? 'studying'
                        : drillSelectedOption === activeDrill.questions[drillQuestionIndex].correctIndex
                        ? 'happy'
                        : 'encouraging'
                    }
                    message={
                      !drillIsAnswered
                        ? '어느 쪽이 맞을까요?'
                        : drillSelectedOption === activeDrill.questions[drillQuestionIndex].correctIndex
                        ? '정답! 완벽해요! 🎉'
                        : '괜찮아요! 해설을 확인해봐요!'
                    }
                    subMessage={
                      !drillIsAnswered
                        ? 'どれが正しいかな？'
                        : drillSelectedOption === activeDrill.questions[drillQuestionIndex].correctIndex
                        ? '素晴らしい！正解です！'
                        : '大丈夫！解説をチェックしよう！'
                    }
                    showXpBadge={drillIsAnswered && drillSelectedOption === activeDrill.questions[drillQuestionIndex].correctIndex}
                    xpAmount={60}
                    interactive={true}
                  />
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#B84E34] tracking-wider">
                    TARGET SKILL: {activeDrill.targetSkill}
                  </span>
                  <p className="text-sm sm:text-base font-black text-[#1B2A38] leading-snug">
                    {activeDrill.questions[drillQuestionIndex].question}
                  </p>
                  {activeDrill.questions[drillQuestionIndex].audioText && (
                    <button
                      type="button"
                      onClick={() => playSpeech(activeDrill.questions[drillQuestionIndex].audioText!)}
                      className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>音声を聴く</span>
                    </button>
                  )}
                </div>

                {/* 選択肢ボタン */}
                <div className="space-y-2">
                  {activeDrill.questions[drillQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = drillSelectedOption === optIdx;
                    const isCorrectOpt = optIdx === activeDrill.questions[drillQuestionIndex].correctIndex;

                    let btnClass = 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300';
                    if (drillIsAnswered) {
                      if (isCorrectOpt) {
                        btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrectOpt) {
                        btnClass = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={drillIsAnswered}
                        onClick={() => handleDrillAnswer(optIdx)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm font-bold cursor-pointer ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {drillIsAnswered && isCorrectOpt && (
                          <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" /> 正解
                          </span>
                        )}
                        {drillIsAnswered && isSelected && !isCorrectOpt && (
                          <span className="text-[11px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <X className="w-3 h-3 text-rose-700" /> 不正解
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 解説と次へボタン */}
                {drillIsAnswered && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-2 animate-in fade-in">
                    <p className="text-stone-700 leading-relaxed font-medium">
                      <strong className="text-[#B84E34]">解説: </strong>{activeDrill.questions[drillQuestionIndex].explanation}
                    </p>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleNextDrillQuestion}
                        className="px-4 py-2 rounded-xl bg-[#B84E34] text-white text-xs font-bold hover:bg-[#a2432c] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <span>{drillQuestionIndex < activeDrill.questions.length - 1 ? '次の問題へ' : '結果を見る'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ドリル終了結果画面（トロフィーマスコット） */
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
                <div className="flex justify-center">
                  <HorangiMascot
                    size="lg"
                    mood="trophy"
                    message="특훈 클리어! 축하합니다! 🏆"
                    subMessage="特訓クリア！クエスト達成！"
                    showXpBadge={true}
                    xpAmount={60}
                    interactive={true}
                  />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-[#1B2A38]">
                    特訓クリア！クエスト達成！
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    正解数: {drillScore} / {activeDrill.questions.length}問 ｜ 経験値 <strong>+60 XP</strong> 獲得！
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>クエストが「クリア済み」に更新され、進捗バーが伸びました！</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDrill(null)}
                  className="w-full py-3 rounded-2xl bg-[#B84E34] text-white text-xs sm:text-sm font-bold hover:bg-[#a2432c] shadow-md transition-all cursor-pointer"
                >
                  冒険マップに戻る
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
