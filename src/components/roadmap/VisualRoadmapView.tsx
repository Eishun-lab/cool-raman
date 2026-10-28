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
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HorangiMascot } from '../mascot/HorangiMascot';
import { DuolingoDrillSession } from './DuolingoDrillSession';
import { TrailPathCanvas } from './TrailPathCanvas';
import {
  SeoulSubwaySign,
  SeoulLandmarkDeco,
  TreasureChestNode,
  TreasureChestModal,
} from './SeoulSceneryArtwork';
import { SEOUL_WORLD_DISTRICTS, CultureTreasureCard } from '../../data/seoulWorldMap';
import { sound } from '../../utils/audioSynth';
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
  gameState?: GamificationState;
  setGameState?: React.Dispatch<React.SetStateAction<GamificationState>>;
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
  gameState: propGameState,
  setGameState: propSetGameState,
}) => {
  const [viewMode, setViewMode] = useState<RoadmapViewMode>('quest');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [playingStep, setPlayingStep] = useState<number | null>(null);
  const [stationTab, setStationTab] = useState<StationDetailTab>('goal');
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'beginner' | 'advanced'>('all');

  // ゲーミフィケーション状態管理（props または内部ステート）
  const [localGameState, setLocalGameState] = useState<GamificationState>(getInitialGamificationState);
  const gameState = propGameState || localGameState;
  const setGameState = propSetGameState || setLocalGameState;

  // ステージ選択（1〜8）＆表示形式（1ステージ集中 or 全体一覧）
  const [selectedStage, setSelectedStage] = useState<number>(() =>
    Math.min(8, Math.max(1, gameState.unlockedStage))
  );
  const [questDisplayMode, setQuestDisplayMode] = useState<'focused' | 'all'>('focused');
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showAreaMapModal, setShowAreaMapModal] = useState(false);
  const [guideModalTab, setGuideModalTab] = useState<'phrases' | 'grammar' | 'culture' | 'curriculum'>('phrases');

  // クイック特訓ドリル状態
  const [activeDrill, setActiveDrill] = useState<QuestDrillData | null>(null);
  const [drillStepNum, setDrillStepNum] = useState<number>(1);
  const [drillTaskIdx, setDrillTaskIdx] = useState<number>(0);

  // K-カルチャー宝箱モーダル状態
  const [activeTreasureModal, setActiveTreasureModal] = useState<{
    treasure: CultureTreasureCard;
    districtName: string;
  } | null>(null);

  // ロックノードタップ時の案内トースト
  const [lockedHint, setLockedHint] = useState<string | null>(null);

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

  // ドリルの開始（Duolingo式 フルスクリーン特訓セッション）
  const startQuestDrill = (stepNum: number, taskIdx: number) => {
    sound.playTap();
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
  };

  // K-カルチャー宝箱を開く
  const handleOpenTreasureChest = (stepNum: number) => {
    const district = SEOUL_WORLD_DISTRICTS[stepNum];
    if (!district) return;

    const chestKey = `chest_s${stepNum}`;
    const alreadyOpened = !!gameState.completedQuests[chestKey];

    sound.playVictory();
    if (!alreadyOpened) {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
      });
      setGameState((prev) => ({
        ...prev,
        xp: prev.xp + district.treasure.xpReward,
        completedQuests: {
          ...prev.completedQuests,
          [chestKey]: true,
        },
      }));
    }

    setActiveTreasureModal({
      treasure: district.treasure,
      districtName: district.jaName,
    });
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
  const activeDistrict = SEOUL_WORLD_DISTRICTS[activeStep.step] || SEOUL_WORLD_DISTRICTS[1];

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

  // 1つのステージカードをレンダリングする関数（ソウル＆韓国 8大探訪エリア世界観）
  const renderStageCard = (step: RoadmapStep, isSingleView: boolean) => {
    const qMeta = STAGE_QUEST_META[step.step];
    const stepMeta = STEP_META[step.step];
    const district = SEOUL_WORLD_DISTRICTS[step.step] || SEOUL_WORLD_DISTRICTS[1];
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
      <div key={step.step} className="w-full space-y-3">
        {/* 🌟 Duolingo Feather風 ユニット看板（Thematic Unit Banner） */}
        <div
          className={`bg-gradient-to-r ${district.bannerGradient} text-white rounded-3xl p-4 sm:p-5 shadow-md border-b-4 ${district.bannerBorder} relative overflow-hidden`}
        >
          {/* 背景の光彩装飾 */}
          <div className="absolute -right-8 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            {/* 上段：駅番号サイン ＆ エリア切替ドロワー ＆ ガイドブックボタン */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowAreaMapModal(true);
                }}
                className="flex items-center gap-2 bg-black/20 hover:bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 transition-all cursor-pointer group"
                title="全8エリアの探訪マップを開く"
              >
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-slate-900 shadow-xs">
                  {district.stationCode}
                </span>
                <span className="text-xs font-black text-white/95 tracking-wide flex items-center gap-1">
                  <span>{district.koName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:translate-y-0.5 transition-transform" />
                </span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* 🗺️ エリア探訪マップ */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setShowAreaMapModal(true);
                  }}
                  className="px-2.5 sm:px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-black backdrop-blur-md border border-white/20 flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                  title="ソウル8大エリア一覧マップを開く"
                >
                  <Map className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden xs:inline">エリア一覧</span>
                </button>

                {/* 📖 ガイドブックボタン（Duolingo本家スタイル） */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setActiveStepIndex(selectedStage - 1);
                    setShowGuideModal(true);
                  }}
                  className="px-2.5 sm:px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black backdrop-blur-md border border-white/30 flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                  title="エリア探訪ガイドブックを開く"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>ガイド</span>
                </button>
              </div>
            </div>

            {/* 中段：エリア名 ＆ キャッチコピー */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-snug break-keep">
                  Area {step.step}: {district.jaName}
                </h3>
                {isStageCleared && (
                  <span className="text-[10px] font-black bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3" /> 制覇
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed break-keep">
                {district.shortCatch || district.subTitle}
              </p>
            </div>

            {/* 下段：探訪進捗プログレスバー */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex-1 bg-black/25 rounded-full h-2.5 overflow-hidden p-0.5">
                <div
                  className="bg-amber-300 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-black text-white/95 font-mono shrink-0">
                {doneCount} / {totalQuests} 達成 ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* ロック時の案内オーバーレイ */}
        {!isUnlocked ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 text-white flex items-center justify-center text-lg shadow-md mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-stone-800">
              Stage {step.step} は順次解放中です
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
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
            {/* ★ Duolingo Feather風 有機的ベジエ曲線トレイル ＆ 触覚3Dキャンディノード */}
            <TrailPathCanvas
              step={step}
              district={district}
              qMeta={qMeta}
              stepMeta={stepMeta}
              firstIncompleteIdx={firstIncompleteIdx}
              completedQuests={gameState.completedQuests}
              freeExploreMode={gameState.freeExploreMode}
              bossScore={bossScore}
              isBossCleared={isBossCleared}
              isStageCleared={isStageCleared}
              onStartDrill={startQuestDrill}
              onOpenTreasure={handleOpenTreasureChest}
              onNavigateToExam={onNavigateToExam}
            />

            {/* 次のエリアへの誘導・エリアマップドロワー */}
            <div className="pt-2 pb-6 flex flex-col items-center gap-2.5">
              {isStageCleared && selectedStage < 8 && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playVictory();
                    setSelectedStage((prev) => Math.min(8, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full max-w-md py-4 px-6 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-base shadow-[0_6px_0_#388E00] active:translate-y-[4px] active:shadow-[0_2px_0_#388E00] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200" />
                  <span>次のエリア（Area {selectedStage + 1}）へ進む ➔</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowAreaMapModal(true);
                }}
                className="py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Map className="w-3.5 h-3.5 text-[#B84E34]" />
                <span>ソウル全8エリア一覧マップを開く</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* 🎯 選択中ステージのクエスト（Thematic Unit Banner ＆ 3Dノードトレイル） */}
      {renderStageCard(ROADMAP_STEPS[selectedStage - 1], true)}

      {/* ===================================================================== */}
      {/* 🗺️ エリア探訪ガイドブック モーダル（キーフレーズ・文法のコツ・現地カルチャー） */}
      {/* ===================================================================== */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95">
            {/* モーダル上部バー */}
            <div className="p-3.5 sm:p-4 border-b border-stone-100 flex items-center justify-between gap-3 bg-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#B84E34]/10 text-[#B84E34] border border-[#B84E34]/20 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-[#B84E34]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-[#1B2A38] tracking-tight">
                      エリア探訪ガイドブック
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      Area {activeStep.step} / 8
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium truncate max-w-xs sm:max-w-md">
                    {activeDistrict.jaName}（{activeDistrict.koName}）
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center cursor-pointer transition-all"
                title="閉じる"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* エリア（駅）切り替えセレクター */}
            <div className="flex items-center gap-1.5 p-2 px-3 sm:px-4 bg-[#FAF7F2] border-b border-stone-200 overflow-x-auto no-scrollbar">
              <span className="text-xs font-black text-stone-500 shrink-0 flex items-center gap-1 mr-1">
                <Map className="w-3.5 h-3.5 text-[#B84E34]" />
                <span>エリア:</span>
              </span>
              {ROADMAP_STEPS.map((s, idx) => {
                const isSelected = activeStepIndex === idx;
                const dist = SEOUL_WORLD_DISTRICTS[s.step];
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setActiveStepIndex(idx);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#B84E34] text-white shadow-2xs font-black'
                        : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-100'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isSelected ? '#FFFFFF' : s.stationColor }}
                    />
                    <span>{s.step}. {dist?.shortTitle || `Step ${s.step}`}</span>
                  </button>
                );
              })}
            </div>

            {/* タブナビゲーション */}
            <div className="flex items-center gap-1.5 p-2 sm:px-4 bg-stone-100/70 border-b border-stone-200 overflow-x-auto no-scrollbar text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setGuideModalTab('phrases');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'phrases'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>💬 キーフレーズ</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setGuideModalTab('grammar');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'grammar'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>💡 文法のコツ</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setGuideModalTab('culture');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'culture'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🏮 現地カルチャー</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setGuideModalTab('curriculum');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  guideModalTab === 'curriculum'
                    ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-[#B84E34]" />
                <span>🎯 エリア目標 ＆ 設定</span>
              </button>
            </div>

            {/* モーダルコンテンツ（スクロール可能） */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* ① 💬 現地キーフレーズ */}
              {guideModalTab === 'phrases' && (
                <div className="space-y-4">
                  {/* エリア紹介ヘッダー */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-300" />
                        <span>{activeDistrict.stationCode} {activeDistrict.lineName}</span>
                      </span>
                      <span className="text-[11px] text-stone-300 font-mono">
                        ⏱️ 目安時間: {activeStep.timeHours}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <span>{activeDistrict.jaName}</span>
                      <span className="text-xs font-normal text-stone-300">({activeDistrict.koName})</span>
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed font-medium">
                      {activeDistrict.subTitle || activeDistrict.shortCatch}
                    </p>
                  </div>

                  {/* 🌟 必修キーフレーズ（Heroカード） */}
                  <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-[#B84E34]">
                      <span className="flex items-center gap-1.5 font-black">
                        <Sparkles className="w-4 h-4" />
                        <span>このエリアの必修キーフレーズ</span>
                      </span>
                      <span className="text-stone-400 font-normal text-[11px]">ネイティブ発音試聴</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] space-y-2 shadow-2xs">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <p className="font-black text-[#1B2A38] text-lg sm:text-xl tracking-tight leading-snug">
                            {activeStep.representativeSpeech.ko}
                          </p>
                          {showPronunciation && activeStep.representativeSpeech.reading && (
                            <p className="text-xs text-stone-400 font-mono">
                              {activeStep.representativeSpeech.reading}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-stone-700 font-medium pt-1">
                            {activeStep.representativeSpeech.ja}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            sound.playTap();
                            playSpeech(activeStep.representativeSpeech.ko, activeStep.step);
                          }}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs ${
                            playingStep === activeStep.step
                              ? 'bg-[#B84E34] text-white animate-pulse'
                              : 'bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CC] hover:bg-[#F2DED7]'
                          }`}
                          title="発音を聞く"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>

                      {activeStep.representativeSpeech.linguisticPoint && (
                        <div className="pt-2.5 border-t border-stone-100 flex items-start gap-1.5 text-xs text-stone-600 bg-stone-50/70 p-2.5 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="leading-relaxed font-medium">
                            <strong className="text-stone-800">会話のツボ: </strong>
                            {activeStep.representativeSpeech.linguisticPoint}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ☕ リアルな活用シーン（シナリオ） */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                    <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-[#B84E34]" />
                      <span>街中やカフェでのリアルな活用シーン:</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8E2D5] text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                      {activeStep.goalDefinition.userStory}
                    </div>
                  </div>

                  {/* 🎯 このエリアで身につく3つのスキル */}
                  {activeStep.learningExperience.miniMilestones && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                      <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>このエリアを完了するとできるようになること:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {activeStep.learningExperience.miniMilestones.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1 text-xs"
                          >
                            <div className="text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block">
                              {m.milestone}
                            </div>
                            <p className="text-emerald-950 font-medium leading-relaxed">
                              {m.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* クイックアクションバー */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGuideModal(false);
                        startQuestDrill(activeStep.step, 0);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#B84E34] hover:bg-[#a2432c] text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>このエリアの特訓ドリルを始める</span>
                    </button>
                    {onNavigateToContent && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowGuideModal(false);
                          onNavigateToContent(meta.firstLessonId, 'textbook');
                        }}
                        className="py-3 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <BookOpen className="w-4 h-4 text-[#B84E34]" />
                        <span>教科書を開く</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ② 💡 文法のコツ */}
              {guideModalTab === 'grammar' && (
                <div className="space-y-4">
                  {/* 1分でスッキリわかる文法ポイント */}
                  {activeStep.learningExperience.jargonBuster && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>1分でスッキリ！このエリアの文法ポイント:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                        {activeStep.learningExperience.jargonBuster.map((j, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-1.5"
                          >
                            <div className="font-black text-amber-950 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>{j.term}</span>
                            </div>
                            <p className="text-stone-700 leading-relaxed font-medium text-[11px] sm:text-xs">
                              {j.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 日本人あるあるの罠 ＆ 目からウロコの打開策 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-2 shadow-2xs">
                      <div className="font-black text-rose-900 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>日本人がハマりやすい落とし穴:</span>
                      </div>
                      <p className="text-stone-800 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-rose-200/60">
                        {activeStep.slaTips.frequentError}
                      </p>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2 shadow-2xs">
                      <div className="font-black text-emerald-900 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>一発で解決するプロのコツ:</span>
                      </div>
                      <p className="text-stone-800 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-emerald-200/60">
                        {activeStep.slaTips.breakthrough}
                      </p>
                    </div>
                  </div>

                  {/* つまずき防止アドバイス */}
                  {activeStep.learningExperience.commonStumblingBlock && (
                    <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-4 space-y-1.5 text-xs">
                      <div className="font-black text-stone-800 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#B84E34]" />
                        <span>つまずきやすいポイントと乗り越え方:</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed font-medium">
                        {activeStep.learningExperience.commonStumblingBlock}
                      </p>
                    </div>
                  )}

                  {/* 関連する教科書レッスン */}
                  {activeStep.links && activeStep.links.length > 0 && onNavigateToContent && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                      <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#B84E34]" />
                        <span>関連する教科書・解説レッスン:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeStep.links.map((link, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setShowGuideModal(false);
                              onNavigateToContent(link.id, link.tab);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#B84E34]" />
                            <span>{link.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ③ 🏮 現地カルチャー ＆ 流行語 */}
              {guideModalTab === 'culture' && (
                <div className="space-y-4">
                  {activeDistrict && activeDistrict.treasure && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                      {/* 宝箱の流行語ヘッダー */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏮</span>
                          <div>
                            <div className="text-[10px] font-black text-[#B84E34] uppercase tracking-wider">
                              Local Slang & K-Culture
                            </div>
                            <h4 className="text-sm font-black text-stone-900">
                              {activeDistrict.jaName}のリアル流行語
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black">
                          <span>+ {activeDistrict.treasure.xpReward} XP</span>
                        </div>
                      </div>

                      {/* 流行語メインカード */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/80 space-y-3">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-2xl sm:text-3xl font-black text-stone-950 font-serif tracking-tight">
                            {activeDistrict.treasure.slangKo}
                          </span>
                          <span className="text-xs font-bold text-stone-500 font-mono">
                            ({activeDistrict.treasure.slangReading})
                          </span>
                          <span className="text-xs font-black text-[#B84E34] bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-200">
                            {activeDistrict.treasure.meaningJa}
                          </span>
                        </div>

                        <div className="text-xs text-stone-600 bg-white/70 p-2.5 rounded-xl border border-amber-100">
                          <strong className="text-stone-800">元の言葉: </strong>
                          <span className="font-medium">{activeDistrict.treasure.originKo}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                          {activeDistrict.treasure.description}
                        </p>

                        {/* 例文と音声 */}
                        <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 flex-1">
                              <p className="text-xs sm:text-sm font-black text-stone-900">
                                "{activeDistrict.treasure.exampleKo}"
                              </p>
                              <p className="text-xs text-stone-600">
                                {activeDistrict.treasure.exampleJa}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                sound.playTap();
                                playSpeech(activeDistrict.treasure.exampleKo);
                              }}
                              className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                              title="例文の発音を聞く"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* エリアの注目スポット（ランドマーク） */}
                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                          <Map className="w-4 h-4 text-[#B84E34]" />
                          <span>このエリアの注目スポット:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {Object.entries(activeDistrict.landmarks).map(([key, lm]) => (
                            <div
                              key={key}
                              className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5 text-xs"
                            >
                              <span className="text-xl shrink-0">{lm.emoji}</span>
                              <div className="overflow-hidden">
                                <p className="font-black text-stone-900 truncate">{lm.labelJa}</p>
                                <p className="text-[10px] text-stone-400 font-mono truncate">{lm.labelKo}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ④ 🎯 エリア目標 ＆ 設定 */}
              {guideModalTab === 'curriculum' && (
                <div className="space-y-4">
                  {/* ホランイのマスコット応援バナー */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
                    <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300 text-2xl flex items-center justify-center shrink-0">
                      🐯
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5">
                        <span>ホランイのエリア攻略アドバイス</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 border border-amber-300">
                          {activeDistrict.jaName}
                        </span>
                      </h4>
                      <p className="text-[11px] sm:text-xs text-amber-800 font-medium mt-0.5 leading-relaxed">
                        この街のクエストをすべてクリアすると、<strong>「{activeDistrict.shortTitle}マスター」</strong>の称号と特別XPがもらえるよ！
                      </p>
                    </div>
                  </div>

                  {/* 🎯 この街で身につくスキル ＆ ゴール */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 flex-wrap gap-2">
                      <span className="font-black text-stone-900 flex items-center gap-1.5 text-sm">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span>この街でマスターできること（Area {activeStep.step}）</span>
                      </span>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {activeStep.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8E2D5] space-y-1.5">
                        <strong className="text-[#B84E34] font-black flex items-center gap-1">
                          <span>🌟 目指すゴール</span>
                        </strong>
                        <p className="text-stone-800 leading-relaxed font-medium">
                          {activeStep.goalDefinition.purpose}
                        </p>
                      </div>

                      <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-100 space-y-1.5">
                        <strong className="text-sky-900 font-black flex items-center gap-1">
                          <span>🚀 実戦で使えるようになること</span>
                        </strong>
                        <p className="text-sky-950 leading-relaxed font-medium">
                          {activeStep.academicBasis.officialCanDo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-[11px] text-stone-500 border-t border-stone-100 flex-wrap">
                      <span><strong>目標語彙: </strong>{activeStep.academicBasis.vocabCount}</span>
                      <span><strong>文法範囲: </strong>{activeStep.academicBasis.grammarScope}</span>
                    </div>
                  </div>

                  {/* 🏆 クリア条件 ＆ 💡 ホランイの5分レスキュー */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
                      <span className="font-black text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 🏆 エリア制覇の条件
                      </span>
                      <p className="text-emerald-950 leading-relaxed font-medium bg-white/80 p-2.5 rounded-xl border border-emerald-200/50">
                        {activeStep.goalDefinition.doneDefinition}
                      </p>
                      <div className="text-[11px] text-emerald-800 font-bold">
                        🎁 手に入る成果: {activeStep.goalDefinition.deliverable}
                      </div>
                    </div>

                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                      <span className="font-black text-amber-900 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" /> 💡 忙しい日の5分レスキュー
                      </span>
                      <p className="text-stone-700 leading-relaxed font-medium">
                        {activeStep.scopePriority.scopeGuard}
                      </p>
                      <div className="text-[11px] text-amber-900 bg-white/80 p-2 rounded-lg border border-amber-200/50 font-medium">
                        <strong>⚡ スキマ時間メニュー: </strong>{activeStep.learningExperience.riskAndFallback.fallbackProtocol}
                      </div>
                    </div>
                  </div>

                  {/* 🗺️ クエスト攻略ステップ */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5 shadow-2xs text-xs">
                    <span className="font-black text-stone-800 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#58CC02]" />
                      <span>🗺️ この街のクエスト攻略ステップ:</span>
                    </span>
                    <ul className="space-y-1.5 text-stone-700">
                      {activeStep.scopePriority.wbsBreakdown.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#EDE7DC]">
                          <span className="w-4 h-4 rounded-full bg-[#58CC02] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 設定 ＆ 自由解放モード */}
                  <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1.5">
                          {gameState.freeExploreMode ? (
                            <Unlock className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-stone-600" />
                          )}
                          <span>自由解放モード（全ステージ閲覧・挑戦）</span>
                        </h4>
                        <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                          通常は各ステージのボス検定に合格すると次ステージが解禁されます。復習や先取りのために全ステージを解放できます。
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={toggleFreeExplore}
                        className={`px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 shadow-xs ${
                          gameState.freeExploreMode
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {gameState.freeExploreMode ? '自由解放中（ON）' : '順次アンロック（OFF）'}
                      </button>
                    </div>
                  </div>

                  {/* 1枚完結マトリクス表 */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                      <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                        <Table className="w-4 h-4 text-[#B84E34]" />
                        <span>全体マトリクス（Step 1〜8 仕様一覧）</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setMatrixFilter('all')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            matrixFilter === 'all'
                              ? 'bg-[#B84E34] text-white shadow-2xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          すべて
                        </button>
                        <button
                          type="button"
                          onClick={() => setMatrixFilter('beginner')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            matrixFilter === 'beginner'
                              ? 'bg-[#B84E34] text-white shadow-2xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
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
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          中上級 (5〜8)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {filteredSteps.map((step) => {
                        const stepMeta = STEP_META[step.step];
                        return (
                          <div
                            key={step.step}
                            className="bg-stone-50/70 border border-stone-200 rounded-xl p-3 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span
                                  style={{ backgroundColor: step.stationColor }}
                                  className="w-5 h-5 rounded-md text-white font-black text-[10px] flex items-center justify-center shadow-2xs"
                                >
                                  {step.step}
                                </span>
                                <span className="font-black text-stone-900">
                                  Step {step.step}: {step.stage}
                                </span>
                                <span className="text-[10px] text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                                  {step.badge}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {onNavigateToContent && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowGuideModal(false);
                                      onNavigateToContent(stepMeta.firstLessonId, 'textbook');
                                    }}
                                    className="px-2 py-0.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-[11px] font-bold hover:bg-stone-50"
                                  >
                                    教科書
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-stone-700 leading-relaxed font-medium">
                              <strong>Done判定: </strong>{step.goalDefinition.doneDefinition}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🗺️ ソウル 8大探訪エリア ナビゲーション ドロワー                           */}
      {/* ===================================================================== */}
      {showAreaMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div
            className="w-full sm:max-w-xl max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 上部ヘッダー */}
            <div className="p-4 sm:p-5 border-b border-stone-100 bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#B84E34]/10 text-[#B84E34] border border-[#B84E34]/20 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-[#B84E34]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    ソウル 8大探訪エリア一覧
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    地下鉄路線で巡る韓国語完全制覇ロードマップ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAreaMapModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* エリアリスト */}
            <div className="p-3 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
              {ROADMAP_STEPS.map((s) => {
                const dist = SEOUL_WORLD_DISTRICTS[s.step];
                const isSelected = selectedStage === s.step;
                const isAreaUnlocked = gameState.freeExploreMode || s.step <= gameState.unlockedStage;

                let areaDone = 0;
                const qCount = s.scopePriority.wbsBreakdown.length;
                for (let i = 0; i < qCount; i++) {
                  if (gameState.completedQuests[`s${s.step}_t${i}`]) areaDone++;
                }
                const isCleared = areaDone === qCount && qCount > 0;
                const pct = Math.round((areaDone / qCount) * 100);

                return (
                  <div
                    key={s.step}
                    onClick={() => {
                      sound.playTap();
                      setSelectedStage(s.step);
                      setShowAreaMapModal(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300/50 shadow-xs'
                        : isAreaUnlocked
                        ? 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        : 'bg-stone-50/70 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* 駅番号 */}
                      <div
                        style={{ backgroundColor: dist?.lineColor || s.stationColor }}
                        className="w-10 h-10 rounded-2xl text-white font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-2xs"
                      >
                        <span className="text-[10px] opacity-80 leading-none">{dist?.stationCode}</span>
                        <span className="text-sm font-black leading-none">{s.step}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            Area {s.step}: {dist?.jaName}
                          </h4>
                          {isCleared ? (
                            <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                              制覇
                            </span>
                          ) : isSelected ? (
                            <span className="text-[9px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md">
                              現在地
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
                          {dist?.shortCatch}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-stone-700 font-mono">
                        {pct}%
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {areaDone}/{qCount}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🌟 Duolingo式 フルスクリーン特訓セッション（音響・触覚・ボトムシート） */}
      {/* ===================================================================== */}
      {activeDrill && (
        <DuolingoDrillSession
          drill={activeDrill}
          stepNum={drillStepNum}
          taskIdx={drillTaskIdx}
          streakDays={gameState.streakDays}
          onClose={() => setActiveDrill(null)}
          onComplete={(score, total) => {
            awardXP(60, '特訓クリア');
            const totalTasks = ROADMAP_STEPS[drillStepNum - 1].scopePriority.wbsBreakdown.length;
            handleToggleQuest(drillStepNum, drillTaskIdx, totalTasks);
          }}
        />
      )}

      {/* ===================================================================== */}
      {/* 🎁 韓国リアル文化＆流行語 宝箱コレクションモーダル                       */}
      {/* ===================================================================== */}
      {activeTreasureModal && (
        <TreasureChestModal
          treasure={activeTreasureModal.treasure}
          districtName={activeTreasureModal.districtName}
          onClose={() => setActiveTreasureModal(null)}
        />
      )}

      {/* ===================================================================== */}
      {/* 🔒 ロックノードタップ時の案内トースト（無反応・不具合感を防止）            */}
      {/* ===================================================================== */}
      {lockedHint && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-stone-700 max-w-sm text-center">
          <Lock className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{lockedHint}</span>
        </div>
      )}
    </div>
  );
};
