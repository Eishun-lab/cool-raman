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
} from 'lucide-react';
import confetti from 'canvas-confetti';
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
    icon: string;
    stageName: string;
    scenarioIcon: string;
    scenarioTitle: string;
    themeGradient: string;
    bossLabel: string;
    bossPassScore: number;
  }
> = {
  1: {
    icon: '🔤',
    stageName: 'ハングル解読アイランド',
    scenarioIcon: '☕',
    scenarioTitle: '明洞のカフェで、メニューを指差さずに「아메리카노 하나 주세요」と注文してレシートを受け取れる！',
    themeGradient: 'from-emerald-500 to-teal-600',
    bossLabel: 'ハングル検定 5級 模擬試験',
    bossPassScore: 60,
  },
  2: {
    icon: '🦴',
    stageName: '日常会話の骨格アイランド',
    scenarioIcon: '🛍️',
    scenarioTitle: '韓国人の友達に「週末は何をしたの？」と聞かれて、自分の予定や過去の行動をスラスラ即答できる！',
    themeGradient: 'from-sky-500 to-blue-600',
    bossLabel: 'ハングル検定 5級 模擬試験',
    bossPassScore: 60,
  },
  3: {
    icon: '🧗',
    stageName: '不規則活用・感情表現アイランド',
    scenarioIcon: '💌',
    scenarioTitle: '服屋で「少し小さいので大きいサイズを見せてください」と要望を伝え、推しにファンレターを書ける！',
    themeGradient: 'from-amber-500 to-orange-600',
    bossLabel: 'ハングル検定 4級 模擬試験',
    bossPassScore: 70,
  },
  4: {
    icon: '🏰',
    stageName: '初級完全制覇・自立アイランド',
    scenarioIcon: '🏨',
    scenarioTitle: 'ホテルのチェックインで「荷物を預かってもらえますか？朝食は何時ですか？」と全て韓国語で交渉できる！',
    themeGradient: 'from-rose-500 to-red-600',
    bossLabel: 'TOPIK I 模擬試験（初級完成）',
    bossPassScore: 50,
  },
  5: {
    icon: '🚀',
    stageName: '社会・伝言・間接話法アイランド',
    scenarioIcon: '🏢',
    scenarioTitle: '職場で「キム課長から電話があり、会議は午後2時から始めるとのことでした」と正確に報告・伝言できる！',
    themeGradient: 'from-violet-500 to-purple-600',
    bossLabel: 'ハングル検定 3級 模擬試験',
    bossPassScore: 70,
  },
  6: {
    icon: '📊',
    stageName: '論理ディスカッションアイランド',
    scenarioIcon: '🗣️',
    scenarioTitle: '若者の流行や就職事情について、賛成・反対の理由を添えて韓国人と20分間議論できる！',
    themeGradient: 'from-blue-600 to-indigo-700',
    bossLabel: 'ハングル検定 準2級 模擬試験',
    bossPassScore: 70,
  },
  7: {
    icon: '🎓',
    stageName: 'ビジネス商談・学術小論文アイランド',
    scenarioIcon: '💼',
    scenarioTitle: 'ビジネス会議で新商品をプレゼンし、相手の反論に対して論理的根拠を示して納得させられる！',
    themeGradient: 'from-teal-600 to-cyan-700',
    bossLabel: 'TOPIK II 模擬試験（中上級）',
    bossPassScore: 40,
  },
  8: {
    icon: '👑',
    stageName: 'ネイティブ・文化的共生アイランド',
    scenarioIcon: '🌟',
    scenarioTitle: 'テレビの時事討論番組を字幕なしで100%理解し、ジョークも含めて現地の人と対等に笑い合える！',
    themeGradient: 'from-rose-600 via-pink-600 to-amber-500',
    bossLabel: 'TOPIK II 模擬試験（最上級）',
    bossPassScore: 70,
  },
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

  return (
    <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-3xl p-3 sm:p-7 shadow-xs space-y-6">
      {/* ===================================================================== */}
      {/* 🎮 ゲーミフィケーション HUD（ステータスバー：連続日数・XP・レベル）    */}
      {/* ===================================================================== */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* レベル・XP表示 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B84E34] to-[#8f3a24] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
            {levelInfo.currentTier.badge.split(' ')[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
                {levelInfo.currentTier.badge}
              </span>
              <span className="text-sm font-black text-[#1B2A38]">
                {levelInfo.currentTier.title}
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">
                ({gameState.xp} XP)
              </span>
            </div>
            {/* 次のレベルまでのXPプログレスバー */}
            <div className="flex items-center gap-2">
              <div className="w-32 sm:w-44 bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#B84E34] h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-stone-500">
                次まで あと{levelInfo.neededXp}XP
              </span>
            </div>
          </div>
        </div>

        {/* ストリーク ＆ 解放ステージ ＆ モード切り替え */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* ストリーク（火） */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 font-bold text-xs shadow-2xs">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>{gameState.streakDays}日 連続学習</span>
          </div>

          {/* ステージ進捗 */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>解放: {gameState.freeExploreMode ? '全8ステージ' : `${gameState.unlockedStage} / 8`}</span>
          </div>

          {/* 自由探索モードトグル */}
          <button
            type="button"
            onClick={toggleFreeExplore}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gameState.freeExploreMode
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
            title="ロックを無視してすべてのステージを自由に閲覧・挑戦できます"
          >
            {gameState.freeExploreMode ? <Unlock className="w-3.5 h-3.5 text-indigo-600" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{gameState.freeExploreMode ? '自由解放中' : '順次アンロック'}</span>
          </button>
        </div>
      </div>

      {/* 🧭 ロードマップ ヘッダー ＆ 表示モード切替 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EDE7DC]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1B2A38] tracking-tight flex items-center gap-2">
            <span>🗺️ 韓国語 完全制覇ロードマップ</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            受動的な読書を脱却！30秒クイック特訓とボス検定で、能動的にステージを進めよう
          </p>
        </div>

        {/* 3大表示モード切り替えタブ */}
        <div className="flex items-center gap-1 self-start md:self-auto bg-stone-200/70 p-1 rounded-2xl text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('quest')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'quest'
                ? 'bg-white text-[#B84E34] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>冒険クエストマップ</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-white text-[#B84E34] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>1枚俯瞰シート</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('focus')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'focus'
                ? 'bg-white text-[#B84E34] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>駅別フォーカス</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 🌟 モード①：Duolingo風 冒険クエストマップ（アンロック・即答ドリル完備） */}
      {/* ===================================================================== */}
      {viewMode === 'quest' && (
        <div className="space-y-8 max-w-4xl mx-auto py-2">
          {/* 8大ステージカード（一本の冒険ロード） */}
          <div className="space-y-10 relative">
            {ROADMAP_STEPS.map((step, sIdx) => {
              const qMeta = STAGE_QUEST_META[step.step];
              const stepMeta = STEP_META[step.step];
              const totalQuests = step.scopePriority.wbsBreakdown.length;
              
              // アンロック判定
              const isUnlocked = gameState.freeExploreMode || step.step <= gameState.unlockedStage;
              
              // 完了クエスト数
              let doneCount = 0;
              for (let i = 0; i < totalQuests; i++) {
                if (gameState.completedQuests[`s${step.step}_t${i}`]) {
                  doneCount++;
                }
              }
              const isStageCleared = doneCount === totalQuests && totalQuests > 0;
              const progressPercent = Math.round((doneCount / totalQuests) * 100);

              // ボス撃破スコア
              const bossScore = gameState.clearedBossExams[stepMeta.examId];
              const isBossCleared = bossScore !== undefined && bossScore >= qMeta.bossPassScore;

              return (
                <div key={step.step} className="space-y-4">
                  {/* ステージメインカード */}
                  <div
                    className={`bg-white border-2 rounded-3xl p-5 sm:p-8 transition-all relative overflow-hidden ${
                      !isUnlocked
                        ? 'border-stone-200 bg-stone-50/70 opacity-80'
                        : isStageCleared
                        ? 'border-emerald-400 ring-2 ring-emerald-200/60 shadow-md'
                        : 'border-stone-200 shadow-sm hover:shadow-xl'
                    }`}
                  >
                    {/* ロックオーバーレイ（ロック中の場合） */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-stone-100/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-14 h-14 rounded-3xl bg-stone-800 text-white flex items-center justify-center text-2xl shadow-lg">
                          <Lock className="w-7 h-7" />
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-stone-800">
                          ステージ {step.step} はロックされています
                        </h4>
                        <p className="text-xs text-stone-500 max-w-sm">
                          前のステージのボス検定（{ROADMAP_STEPS[step.step - 2]?.stage}）をクリアするか、上部の「自由解放モード」をONにすると即座にプレイできます。
                        </p>
                        <button
                          type="button"
                          onClick={toggleFreeExplore}
                          className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>スキップして今すぐ解放する</span>
                        </button>
                      </div>
                    )}

                    {/* ステージヘッダー */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${qMeta.themeGradient} text-white flex items-center justify-center text-2xl shadow-sm shrink-0`}
                        >
                          {qMeta.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700">
                              ステージ {step.step} / 8
                            </span>
                            <span className="text-xs font-black text-[#B84E34] bg-[#FAF0EC] px-2.5 py-0.5 rounded-full border border-[#F0D5CD]">
                              {step.badge}
                            </span>
                            {isStageCleared && (
                              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>クエスト全制覇！</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg sm:text-2xl font-black text-[#1B2A38] mt-1">
                            {qMeta.stageName}
                          </h4>
                          <span className="text-xs font-mono text-stone-500">
                            ⏱️ 想定時間: {step.timeHours}（タイムボックス: {step.scopePriority.timeboxWeeks}）
                          </span>
                        </div>
                      </div>

                      {/* クエスト進捗プログレス */}
                      <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 sm:w-48 shrink-0 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-stone-700">クエスト進捗</span>
                          <span className={isStageCleared ? 'text-emerald-700' : 'text-[#B84E34]'}>
                            {doneCount} / {totalQuests} 達成 ({progressPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isStageCleared ? 'bg-emerald-500' : 'bg-[#B84E34]'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ☕ リアルな達成シナリオ（一目でわかるユーザー体験ゴール） */}
                    <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 my-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-2xs border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                        {qMeta.scenarioIcon}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider">
                          🎯 このステージをクリアしたあなたの姿
                        </span>
                        <p className="text-sm sm:text-base font-black text-[#1B2A38] leading-snug">
                          {qMeta.scenarioTitle}
                        </p>
                        <p className="text-xs text-stone-600 pt-0.5">
                          {step.goalDefinition.purpose}
                        </p>
                      </div>
                    </div>

                    {/* ⭐️ アクティブ・クエスト（タップしてチェック ＆ 30秒クイック特訓ボタン） */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-black text-[#1B2A38] flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>必須クエスト（解いて進める能動アクティブ特訓）</span>
                        </span>
                        <span className="text-xs text-stone-400">⚡️ 特訓クリアで自動達成</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {step.scopePriority.wbsBreakdown.map((task, tIdx) => {
                          const isDone = !!gameState.completedQuests[`s${step.step}_t${tIdx}`];
                          const hasDrill = !!STAGE_DRILLS[`s${step.step}_t${tIdx}`];

                          return (
                            <div
                              key={tIdx}
                              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isDone
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs'
                                  : 'bg-[#FAF7F2] border-stone-200 hover:border-stone-300 text-stone-800'
                              }`}
                            >
                              {/* チェックとタイトル */}
                              <div
                                onClick={() => handleToggleQuest(step.step, tIdx, totalQuests)}
                                className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                              >
                                <div
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
                                    isDone
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white border-2 border-stone-300 text-transparent hover:border-[#B84E34]'
                                  }`}
                                >
                                  ✓
                                </div>
                                <span
                                  className={`text-xs sm:text-sm font-bold leading-snug ${
                                    isDone ? 'line-through text-emerald-800/80' : 'text-stone-800'
                                  }`}
                                >
                                  {task}
                                </span>
                              </div>

                              {/* アクションボタン（30秒特訓 ＆ 教科書リンク） */}
                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                {hasDrill && (
                                  <button
                                    type="button"
                                    onClick={() => startQuestDrill(step.step, tIdx)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                                      isDone
                                        ? 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                                        : 'bg-[#B84E34] hover:bg-[#a2432c] text-white active:scale-95'
                                    }`}
                                  >
                                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                                    <span>{isDone ? 'もう一度特訓' : '30秒クイック特訓'}</span>
                                  </button>
                                )}
                                {onNavigateToContent && (
                                  <button
                                    type="button"
                                    onClick={() => onNavigateToContent(stepMeta.firstLessonId, 'textbook')}
                                    className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                                    title="教科書の該当課を開く"
                                  >
                                    <BookOpen className="w-3.5 h-3.5 text-[#B84E34]" />
                                    <span className="hidden sm:inline">教科書</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* スコープ拡大防止原則 */}
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
                        <span className="text-rose-600 font-black shrink-0">🛑 挫折を防ぐ制約:</span>
                        <span>{step.scopePriority.scopeGuard}</span>
                      </div>
                    </div>

                    {/* 🗣️ Duolingo風 モデルセリフ（大きな文字 ＆ ネイティブ音声） */}
                    <div className="bg-[#FAF0EC]/50 border border-[#F2DED7] rounded-2xl p-4 sm:p-5 space-y-3 my-4">
                      <div className="flex items-center justify-between text-xs font-black text-[#B84E34]">
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4" />
                          <span>ステージ代表フレーズ（音声を真似して声に出そう！）</span>
                        </span>
                        <span className="text-stone-400 font-normal text-[11px]">ネイティブ発音</span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#F0D5CC] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-lg sm:text-xl font-black text-[#1B2A38] leading-snug">
                            {step.representativeSpeech.ko}
                          </p>
                          {showPronunciation && step.representativeSpeech.reading && (
                            <p className="text-xs sm:text-sm text-stone-400 font-mono">
                              {step.representativeSpeech.reading}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-stone-700 font-bold pt-0.5">
                            {step.representativeSpeech.ja}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => playSpeech(step.representativeSpeech.ko, step.step)}
                          className={`px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer shrink-0 shadow-xs ${
                            playingStep === step.step
                              ? 'bg-[#B84E34] text-white animate-pulse'
                              : 'bg-[#FAF0EC] text-[#B84E34] border-[#F0D5CD] hover:bg-[#F2DED7]'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{playingStep === step.step ? '再生中...' : '音声を聴く'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 🛟 忙しい日の「5分縮小プロトコル」 */}
                    <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 flex items-start gap-3 my-4">
                      <div className="w-9 h-9 rounded-xl bg-white text-[#B84E34] border border-rose-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                        🛟
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-xs sm:text-sm font-black text-rose-900 block">
                          忙しくて倒れそうな日はこれだけ！「5分縮小プロトコル」
                        </strong>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                          {step.learningExperience.riskAndFallback.fallbackProtocol}
                        </p>
                      </div>
                    </div>

                    {/* 🏆 ボス検定（模擬試験：撃破ステータス ＆ 直行ボタン） */}
                    <div className="bg-gradient-to-br from-[#FAF7F2] to-amber-50/40 border-2 border-[#E8E2D5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-black text-[#B84E34]">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <span>ステージボス検定</span>
                          </span>
                          {isBossCleared && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                              🏆 撃破済み！（最高スコア: {bossScore}点）
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm sm:text-base font-black text-[#1B2A38]">
                          {qMeta.bossLabel}
                        </h5>
                        <p className="text-xs text-stone-500">
                          合格基準: {qMeta.bossPassScore}点以上クリアで次のステージがアンロック！
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onNavigateToExam && (
                          <button
                            type="button"
                            onClick={() => onNavigateToExam(stepMeta.examId)}
                            className="px-4 py-2.5 rounded-xl bg-[#B84E34] hover:bg-[#a2432c] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Award className="w-4 h-4" />
                            <span>{isBossCleared ? 'ボスに再挑戦 ➔' : 'ボス戦（模試）に挑む ➔'}</span>
                          </button>
                        )}
                        {onNavigateToContent && (
                          <button
                            type="button"
                            onClick={() => onNavigateToContent(stepMeta.firstLessonId, 'textbook')}
                            className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4 text-[#B84E34]" />
                            <span>教科書</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ステージ間の道（Winding Road Connector） */}
                  {sIdx < ROADMAP_STEPS.length - 1 && (
                    <div className="flex flex-col items-center justify-center py-2 space-y-1">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-[#B84E34] to-amber-500 rounded-full" />
                      <div className="px-3 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-[11px] font-bold text-stone-600 flex items-center gap-1">
                        <span>↓ 次のステージへ進む（ステージ {sIdx + 2}）</span>
                      </div>
                      <div className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-[#B84E34] rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 📊 モード②：1枚完結！全体俯瞰マトリクスシート（Master Matrix Sheet）   */}
      {/* ===================================================================== */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-[#B84E34]" />
                <span>「フェーズ × 学習項目 × Done定義 × リスク対策」全体見渡しシート</span>
              </div>
              <p className="text-[11px] text-stone-500">
                目標の曖昧さ・スコープの広がりすぎ・多忙による挫折を未然に防ぐための学習者専用シートです。
              </p>
            </div>

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

          <div className="space-y-4">
            {filteredSteps.map((step) => {
              const meta = STEP_META[step.step];

              return (
                <div
                  key={step.step}
                  className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs hover:border-[#B84E34]/40 hover:shadow-md transition-all space-y-4"
                >
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

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs">
                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
                      <div className="font-black text-[#B84E34] flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        <span>① 目的 ＆ 順序の必然性</span>
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
                      </div>
                    </div>

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
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🚇 モード③：駅別フォーカス（メトロレール ＆ 1駅深掘りマガジン）       */}
      {/* ===================================================================== */}
      {viewMode === 'focus' && (
        <div className="space-y-6">
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
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
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

            {stationTab === 'scope' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
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

            {stationTab === 'experience' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
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

                  <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200/80 space-y-3">
                    <div className="space-y-1">
                      <span className="font-black text-rose-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" /> よくあるつまずきポイント
                      </span>
                      <p className="text-stone-700 leading-relaxed text-[11px]">
                        {activeStep.learningExperience.commonStumblingBlock}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-rose-200/60 bg-white/80 p-3 rounded-xl border border-rose-200/50 space-y-1">
                      <div className="font-black text-[#B84E34] flex items-center gap-1.5 text-xs">
                        <LifeBuoy className="w-4 h-4" />
                        <span>忙しい日の「5分縮小プロトコル」</span>
                      </div>
                      <p className="text-stone-800 text-[11px] font-medium leading-relaxed">
                        {activeStep.learningExperience.riskAndFallback.fallbackProtocol}
                      </p>
                    </div>
                  </div>
                </div>

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

            {stationTab === 'speech' && (
              <div className="space-y-4">
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
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ⚡️ 30秒クイック特訓ドリル モーダル                                    */}
      {/* ===================================================================== */}
      {activeDrill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                  ⚡️
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
              <div className="space-y-4">
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
                          <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            ⭕️ 正解
                          </span>
                        )}
                        {drillIsAnswered && isSelected && !isCorrectOpt && (
                          <span className="text-[11px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            ❌ 不正解
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
                      💡 <strong>解説: </strong>{activeDrill.questions[drillQuestionIndex].explanation}
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
              /* ドリル終了結果画面 */
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-sm">
                  🎉
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-[#1B2A38]">
                    特訓クリア！クエスト達成！
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    正解数: {drillScore} / {activeDrill.questions.length}問 ｜ 経験値 <strong>+60 XP</strong> 獲得！
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs font-bold text-emerald-800">
                  ✨ クエストが「クリア済み」に更新され、進捗バーが伸びました！
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
