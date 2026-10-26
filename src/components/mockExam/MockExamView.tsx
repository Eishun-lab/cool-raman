import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  BookOpen,
  Bookmark,
  FileText,
  Target,
  Check,
  Compass,
  Layers,
  Filter,
  Zap,
  Lock,
  Unlock,
  Trophy,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../../utils/speech';
import {
  getInitialGamificationState,
  saveGamificationState,
} from '../../utils/gamification';
import {
  MockExam,
  MockQuestion,
  ExamType,
  ExamEvaluation,
  SectionBreakdown,
  DiagnosticReport,
  StrengthItem,
  WeaknessItem,
  NextActionItem,
  ExamCategory,
} from '../../types/mockExam';
import { ALL_MOCK_EXAMS, getMockExamById } from '../../data/mockExams';

interface MockExamViewProps {
  initialExamId?: ExamType;
  onNavigateToTextbookLesson?: (lessonId: string) => void;
  onNavigateToDictionary?: (dictId: string) => void;
  onBackToDashboard?: () => void;
  onNavigateToRoadmap?: () => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  initialExamId,
  onNavigateToTextbookLesson,
  onNavigateToDictionary,
  onBackToDashboard,
  onNavigateToRoadmap,
}) => {
  // 画面状態: 'list' (選択画面) | 'exam' (試験中) | 'result' (結果発表)
  const [viewState, setViewState] = useState<'list' | 'exam' | 'result'>('list');
  const [selectedExamId, setSelectedExamId] = useState<ExamType>(initialExamId || 'hanken_5');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hanken' | 'topik'>('all');
  const [rewardInfo, setRewardInfo] = useState<{
    xpGained: number;
    stageUnlocked: boolean;
    newStageNum?: number;
    passed: boolean;
  } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1200);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'prescription' | 'strengths' | 'weaknesses'>('prescription');

  // initialExamIdが変更された場合の同期
  useEffect(() => {
    if (initialExamId) {
      setSelectedExamId(initialExamId);
    }
  }, [initialExamId]);

  const activeExam = useMemo(() => {
    return getMockExamById(selectedExamId) || ALL_MOCK_EXAMS[0];
  }, [selectedExamId]);

  const currentQuestion = activeExam.questions[currentQuestionIndex];

  // タイマー管理
  useEffect(() => {
    if (viewState !== 'exam') return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewState]);

  // 試験開始
  const startExam = (examId: ExamType) => {
    const exam = getMockExamById(examId);
    if (!exam) return;
    setSelectedExamId(examId);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(exam.timeLimitSeconds);
    setRewardInfo(null);
    setViewState('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 選択肢の回答
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // 音声再生
  const playAudio = (text?: string) => {
    if (!text) return;
    setIsAudioPlaying(true);
    speechService.speak(text, {
      onEnd: () => setIsAudioPlaying(false),
      onError: () => setIsAudioPlaying(false),
    });
  };

  // 採点と評価計算（Can-Do到達度と学習カルテ処方箋の自動算出）
  const evaluation: ExamEvaluation = useMemo(() => {
    let earnedScore = 0;
    let correctCount = 0;
    const sectionMap: Record<string, { earned: number; total: number; label: string }> = {};
    const correctQuestions: MockQuestion[] = [];
    const missedQuestions: MockQuestion[] = [];

    activeExam.questions.forEach((q) => {
      const isCorrect = userAnswers[q.id] === q.correctIndex;
      if (isCorrect) {
        earnedScore += q.score;
        correctCount += 1;
        correctQuestions.push(q);
      } else {
        missedQuestions.push(q);
      }

      if (!sectionMap[q.section]) {
        sectionMap[q.section] = { earned: 0, total: 0, label: q.sectionLabel.replace(/[【】]/g, '') };
      }
      sectionMap[q.section].total += q.score;
      if (isCorrect) {
        sectionMap[q.section].earned += q.score;
      }
    });

    const percentage = Math.round((earnedScore / activeExam.totalScore) * 100);

    // 合格ランク判定
    let achievedRank = activeExam.passCriteria.find((c) => earnedScore >= c.minScore);
    if (!achievedRank) {
      achievedRank = activeExam.passCriteria[activeExam.passCriteria.length - 1];
    }

    const passed = earnedScore >= (activeExam.passScore || 60);

    const sectionBreakdowns: SectionBreakdown[] = Object.entries(sectionMap).map(
      ([sectionKey, data]) => ({
        section: sectionKey as any,
        label: data.label,
        earned: data.earned,
        total: data.total,
        percentage: Math.round((data.earned / data.total) * 100) || 0,
      })
    );

    // ========================================================================
    // 診断カルテ（根拠と道筋）：Can-Do到達度、強み、失点根拠、処方箋の自動生成
    // ========================================================================
    
    // 1. 総合到達度サマリー
    let overallCanDoSummary = '';
    if (passed) {
      overallCanDoSummary = `🎉【合格基準到達】得点 ${earnedScore}点（正答率 ${percentage}% / 合格ライン ${activeExam.passScore || 60}点クリア）。${activeExam.title}の要求水準を充足しています。公式Can-Do基準に基づき、基礎知識および実戦運用能力が確立されていると判定されます。`;
    } else {
      const diff = (activeExam.passScore || 60) - earnedScore;
      overallCanDoSummary = `⚠️【要補強判定】得点 ${earnedScore}点（正答率 ${percentage}% / 合格ライン ${activeExam.passScore || 60}点まであと${diff}点）。現時点で重要規則・語彙の定着にムラがあり、特に失点した設問の文法規則・パターンの再確認が必要です。以下のカルテに従って復習を進めてください。`;
    }

    // 2. 現在できること（公的Can-Do達成・あなたの強み）
    const strengths: StrengthItem[] = [];
    
    // 正答率の高いセクションから強みを抽出
    sectionBreakdowns.forEach((sec) => {
      if (sec.percentage >= 60) {
        strengths.push({
          title: `【${sec.label}】の安定した攻略力（正答率 ${sec.percentage}%）`,
          description: `${sec.label}分野の基本パターン・設問形式を確実に正解できています。あなたの強力な得点源です。`,
        });
      }
    });

    // 試験固有のCan-Doから達成度を反映
    if (activeExam.canDoList && activeExam.canDoList.length > 0) {
      const canDoPassedCount = Math.min(
        activeExam.canDoList.length,
        Math.max(1, Math.round((percentage / 100) * activeExam.canDoList.length))
      );
      for (let i = 0; i < canDoPassedCount; i++) {
        strengths.push({
          title: `公的Can-Do到達: ${activeExam.canDoList[i]}`,
          description: `本模擬試験の正答状況から、このスキルの基礎運用能力が客観的に実証されています。`,
        });
      }
    }

    if (strengths.length === 0) {
      strengths.push({
        title: '基礎問題への着手と語彙認識',
        description: '正解できた設問から、初歩的な単語や定型挨拶の聞き取り・識別はできています。',
      });
    }

    // 3. まだ不足していること（失点の根拠と弱点分析）
    const weaknesses: WeaknessItem[] = [];
    missedQuestions.slice(0, 6).forEach((q) => {
      const userChoiceStr = userAnswers[q.id] !== undefined ? `（あなたの回答: ${['①', '②', '③', '④'][userAnswers[q.id]]}）` : '（未回答）';
      weaknesses.push({
        title: `第${q.questionNumber}問 ${q.sectionLabel}`,
        description: q.instruction,
        reason: `${userChoiceStr} 正解は ${['①', '②', '③', '④'][q.correctIndex]} です。${q.explanation}`,
        section: q.section,
        relatedLessonId: q.linkReview?.id,
        relatedDictId: q.linkReview?.tab === 'dictionary' ? q.linkReview.id : undefined,
        lessonLabel: q.linkReview?.label,
      });
    });

    // 4. 次にすべきこと（処方箋 ＆ 教科書・大辞典への一発リンク）
    const nextActions: NextActionItem[] = [];
    const seenLinks = new Set<string>();

    missedQuestions.forEach((q) => {
      if (q.linkReview && !seenLinks.has(q.linkReview.id)) {
        seenLinks.add(q.linkReview.id);
        nextActions.push({
          priority: nextActions.length < 2 ? 'high' : 'medium',
          title: `教科書・大辞典『${q.linkReview.label}』の集中復習`,
          description: `第${q.questionNumber}問で失点した項目の文法公式と例文を再確認し、音読トレーニングを行いましょう。`,
          targetId: q.linkReview.id,
          targetTab: q.linkReview.tab as any,
          actionLabel: `${q.linkReview.label} を開く`,
        });
      }
    });

    // 苦手セクションのアクション
    sectionBreakdowns.forEach((sec) => {
      if (sec.percentage < 60) {
        nextActions.push({
          priority: 'high',
          title: `【${sec.label}】の重点特訓`,
          description: `正答率${sec.percentage}%に留まっています。音声リスニングや基本文法ドリルを繰り返し解いて、瞬時に識別できる耳と目を鍛えましょう。`,
          actionLabel: `${sec.label}の集中復習`,
        });
      }
    });

    if (nextActions.length === 0) {
      nextActions.push({
        priority: 'high',
        title: '上位級・次ステージへの挑戦',
        description: 'この級の十分な実力が証明されました。ロードマップの次の駅（上位級の模擬試験や新文法）へステップアップしましょう！',
        actionLabel: 'ロードマップを確認する',
      });
    }

    const diagnosticReport: DiagnosticReport = {
      overallCanDoSummary,
      strengths,
      weaknesses,
      nextActions,
    };

    return {
      score: earnedScore,
      totalScore: activeExam.totalScore,
      percentage,
      achievedRank,
      passed,
      sectionBreakdowns,
      correctCount,
      totalCount: activeExam.questionCount,
      diagnosticReport,
    };
  }, [activeExam, userAnswers]);

  // 試験終了・採点
  const finishExam = () => {
    setShowFinishConfirm(false);
    setViewState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 🎮 ゲーミフィケーション報酬の付与・ボス撃破＆アンロック判定
    try {
      const state = getInitialGamificationState();
      const passed = evaluation.passed;
      const earnedScore = evaluation.score;

      // 最高スコアの更新
      const prevScore = state.clearedBossExams[activeExam.id] || 0;
      state.clearedBossExams[activeExam.id] = Math.max(prevScore, earnedScore);

      let xpGained = 60; // 完答参加XP
      let stageUnlocked = false;
      let newStageNum = 0;

      if (passed) {
        xpGained = 200; // ボス撃破で+200 XP！

        // ステージアンロックマッピング
        // Stage 1 & 2 boss: hanken_5 -> unlocks Stage 3
        // Stage 3 boss: hanken_4 -> unlocks Stage 4
        // Stage 4 boss: topik1 -> unlocks Stage 5
        // Stage 5 boss: hanken_3 -> unlocks Stage 6
        // Stage 6 boss: hanken_pre2 -> unlocks Stage 7
        // Stage 7 boss: topik2 -> unlocks Stage 8
        let targetStage = state.unlockedStage;
        if (activeExam.id === 'hanken_5') {
          targetStage = Math.max(state.unlockedStage, 3);
        } else if (activeExam.id === 'hanken_4') {
          targetStage = Math.max(state.unlockedStage, 4);
        } else if (activeExam.id === 'topik1') {
          targetStage = Math.max(state.unlockedStage, 5);
        } else if (activeExam.id === 'hanken_3') {
          targetStage = Math.max(state.unlockedStage, 6);
        } else if (activeExam.id === 'hanken_pre2') {
          targetStage = Math.max(state.unlockedStage, 7);
        } else if (activeExam.id === 'topik2') {
          targetStage = Math.max(state.unlockedStage, 8);
        }

        if (targetStage > state.unlockedStage) {
          state.unlockedStage = targetStage;
          stageUnlocked = true;
          newStageNum = targetStage;
        }
      }

      state.xp += xpGained;
      saveGamificationState(state);
      setRewardInfo({ xpGained, stageUnlocked, newStageNum, passed });
    } catch (e) {
      console.error('Failed to update exam gamification state', e);
    }

    // 紙吹雪エフェクト
    confetti({
      particleCount: evaluation.passed ? 120 : 60,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  // 残り時間のフォーマット (分:秒)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 未回答数の計算
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = activeExam.questionCount - answeredCount;

  // 試験リストのフィルタリング
  const hankenExams = ALL_MOCK_EXAMS.filter((e) => e.category === 'hanken');
  const topikExams = ALL_MOCK_EXAMS.filter((e) => e.category === 'topik');

  // ==========================================================================
  // ① 模擬試験 選択画面（トップ一覧：公式検定別の明確な区分）
  // ==========================================================================
  if (viewState === 'list') {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-10">
        {/* ヘッダー紹介セクション */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 text-xs font-black shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#B84E34]" /> 公式検定完全準拠・級別単独模擬試験センター
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1B2A38] tracking-tight">
            実戦 模擬試験センター
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            過去問の出題傾向・形式・配点を級ごとに忠実に再現した公式準拠の模擬試験。<br className="hidden sm:inline" />
            受験後は、<strong>「何ができて、何が不足しているのか」</strong>の根拠と、
            教科書への具体的処方箋を示す<strong>【学習カルテ（Can-Do到達度診断）】</strong>を即座に発行します。
          </p>

          {/* カテゴリ切り替えフィルター */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#B84E34] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              すべて表示（全6試験）
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('hanken')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'hanken'
                  ? 'bg-[#B84E34] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>🏛️ ハングル能力検定（4試験）</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('topik')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'topik'
                  ? 'bg-[#B84E34] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>🎓 TOPIK（2試験）</span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* ① ハングル能力検定試験（ハン検）セクション */}
        {/* ================================================================== */}
        {(categoryFilter === 'all' || categoryFilter === 'hanken') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D5]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD] flex items-center justify-center text-lg">
                  🏛️
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1B2A38]">
                    ハングル能力検定試験（公式準拠・単独級別）
                  </h2>
                  <p className="text-[11px] sm:text-xs text-stone-500">
                    日本国内で最も権威ある検定試験。文字・発音・助詞から敬語・慣用句・四字熟語まで各級独立して実力を測定
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 self-start sm:self-auto">
                5級・4級・3級・準2級 完備
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {hankenExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* バッジ行 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
                          {exam.badge}
                        </span>
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          合格基準: {exam.passScore}点以上
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold shrink-0">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{Math.round(exam.timeLimitSeconds / 60)}分 / {exam.questionCount}問</span>
                      </div>
                    </div>

                    {/* タイトルとサブタイトル */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#1B2A38] group-hover:text-[#B84E34] transition-colors mb-1">
                        {exam.title}
                      </h3>
                      <p className="text-xs font-bold text-stone-500">{exam.subtitle}</p>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {exam.overview}
                    </p>

                    {/* この級で測定する公的Can-Doプレビュー */}
                    <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E2D5]/70 space-y-2">
                      <div className="text-[11px] font-black text-stone-700 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-[#B84E34]" />
                        <span>測定する公式Can-Do（到達能力基準）</span>
                      </div>
                      <ul className="space-y-1.5">
                        {exam.canDoList.slice(0, 3).map((canDo, idx) => (
                          <li key={idx} className="text-[11px] text-stone-600 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{canDo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 受験開始ボタン */}
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => startExam(exam.id)}
                      className="w-full py-3 rounded-2xl bg-[#B84E34] hover:bg-[#a2432c] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>この級の模擬試験を開始する</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* ② TOPIK（韓国語能力試験）セクション */}
        {/* ================================================================== */}
        {(categoryFilter === 'all' || categoryFilter === 'topik') && (
          <section className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D5]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center text-lg">
                  🎓
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1B2A38]">
                    TOPIK（韓国教育省公認・世界共通基準）
                  </h2>
                  <p className="text-[11px] sm:text-xs text-stone-500">
                    留学・就職・永住権基準として世界で通用する公認テスト。聞き取り・読解の実戦運用力を総合判定
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 self-start sm:self-auto border border-indigo-200">
                TOPIK I・II 完備
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {topikExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* バッジ行 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {exam.badge}
                        </span>
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          合格基準: {exam.passScore}点以上
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold shrink-0">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{Math.round(exam.timeLimitSeconds / 60)}分 / {exam.questionCount}問</span>
                      </div>
                    </div>

                    {/* タイトルとサブタイトル */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#1B2A38] group-hover:text-indigo-700 transition-colors mb-1">
                        {exam.title}
                      </h3>
                      <p className="text-xs font-bold text-stone-500">{exam.subtitle}</p>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {exam.overview}
                    </p>

                    {/* この級で測定する公的Can-Doプレビュー */}
                    <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E2D5]/70 space-y-2">
                      <div className="text-[11px] font-black text-stone-700 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-indigo-600" />
                        <span>測定する公式Can-Do（到達能力基準）</span>
                      </div>
                      <ul className="space-y-1.5">
                        {exam.canDoList.slice(0, 3).map((canDo, idx) => (
                          <li key={idx} className="text-[11px] text-stone-600 flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">✓</span>
                            <span>{canDo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 受験開始ボタン */}
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => startExam(exam.id)}
                      className="w-full py-3 rounded-2xl bg-indigo-700 hover:bg-indigo-800 active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>この模擬試験を開始する</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ==========================================================================
  // ② 模擬試験 実施中画面（試験中）
  // ==========================================================================
  if (viewState === 'exam' && currentQuestion) {
    const isAnswered = userAnswers[currentQuestion.id] !== undefined;

    return (
      <div className="min-h-screen bg-[#FAF7F2] pb-24">
        {/* 固定上部コントロールバー */}
        <header className="sticky top-14 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] px-3 sm:px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            {/* 試験タイトルと進捗 */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD] shrink-0">
                {activeExam.badge}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#1B2A38] truncate">
                第 {currentQuestionIndex + 1} / {activeExam.questionCount} 問
              </span>
            </div>

            {/* カウントダウンタイマー */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black text-sm transition-colors ${
                timeLeftSeconds <= 180
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-white border border-[#E2DDD2] text-[#1B2A38]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#B84E34]" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            {/* 終了・採点ボタン */}
            <button
              type="button"
              onClick={() => setShowFinishConfirm(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#B84E34] text-white hover:bg-[#a2432c] shadow-xs transition-all cursor-pointer shrink-0"
            >
              採点する
            </button>
          </div>
        </header>

        {/* メイン問題カード領域 */}
        <main className="max-w-3xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-8 shadow-xs space-y-6">
            {/* 問題ヘッダー */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-800 font-black text-xs flex items-center justify-center">
                  Q{currentQuestionIndex + 1}
                </span>
                <span className="text-xs font-bold text-[#B84E34] bg-[#FAF0EC] px-2 py-0.5 rounded-md">
                  {currentQuestion.sectionLabel}
                </span>
              </div>
              <span className="text-xs text-stone-400 font-bold">配点: {currentQuestion.score}点</span>
            </div>

            {/* 指示文 */}
            <h2 className="text-sm sm:text-base font-extrabold text-[#1B2A38] leading-relaxed">
              {currentQuestion.instruction}
            </h2>

            {/* リスニング音声再生ボタン（音声問題の場合） */}
            {currentQuestion.audioText && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => playAudio(currentQuestion.audioText)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                      isAudioPlaying
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-100'
                    }`}
                    title="音声を再生"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div>
                    <div className="text-xs font-bold text-amber-900">
                      {isAudioPlaying ? '音声再生中...' : 'リスニング音声を再生'}
                    </div>
                    <div className="text-[10px] text-amber-700">
                      ボタンをタップすると韓国語ネイティブ音声が流れます
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* パッセージ・対話文・案内文（ある場合） */}
            {currentQuestion.passage && (
              <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-[#1B2A38] font-sans leading-relaxed whitespace-pre-wrap select-none font-medium">
                {currentQuestion.passage}
              </div>
            )}

            {/* 個別の問い（ある場合） */}
            {currentQuestion.questionText && (
              <p className="text-xs sm:text-sm font-bold text-stone-700 pt-1">
                {currentQuestion.questionText}
              </p>
            )}

            {/* 4つの選択肢 */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQuestion.id] === optIdx;
                const circleNumber = ['①', '②', '③', '④'][optIdx];

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer group active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#FAF0EC] border-[#B84E34] text-[#B84E34] shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#B84E34] text-white'
                          : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                      }`}
                    >
                      {circleNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-normal flex-1 pt-0.5">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 前へ・次へ ボタン */}
          <div className="flex items-center justify-between gap-3 mt-6">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => {
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>前の問題</span>
            </button>

            {currentQuestionIndex < activeExam.questionCount - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-[#B84E34] text-white text-xs font-bold hover:bg-[#a2432c] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>次の問題</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowFinishConfirm(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>採点して結果を見る</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 問題ナンバーパレット（クリックで瞬時に移動） */}
          <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-5 mt-6 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-3">
              <span>📋 解答状況パレット</span>
              <span>
                解答済: {answeredCount} / 未解答: {unansweredCount}
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
              {activeExam.questions.map((q, idx) => {
                const isAns = userAnswers[q.id] !== undefined;
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-[#B84E34] ring-offset-1 font-black'
                        : ''
                    } ${
                      isAns
                        ? 'bg-[#B84E34] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* 採点確認モーダル */}
        {showFinishConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-center text-[#1B2A38]">
                試験を終了して採点しますか？
              </h3>
              <p className="text-xs text-stone-500 text-center leading-relaxed">
                {unansweredCount > 0 ? (
                  <span className="text-rose-600 font-bold">
                    未解答の問題がまだ {unansweredCount} 問あります！
                  </span>
                ) : (
                  'すべての問題に解答済みです。'
                )}
                <br />
                採点後はすぐに詳細な解説と学習カルテ（根拠と道筋）が表示されます。
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFinishConfirm(false)}
                  className="py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  問題に戻る
                </button>
                <button
                  type="button"
                  onClick={finishExam}
                  className="py-2.5 rounded-xl bg-[#B84E34] text-white text-xs font-bold hover:bg-[#a2432c] shadow-sm cursor-pointer"
                >
                  採点する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // ③ 模擬試験 採点・結果レポート画面（終了後：Can-Do学習カルテ完備）
  // ==========================================================================
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* 総合スコアカード */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
          {activeExam.title} 公式判定結果
        </div>

        {/* 合格判定と得点 */}
        <div>
          <div className="text-3xl sm:text-5xl font-black text-[#1B2A38] tracking-tight">
            {evaluation.score} <span className="text-lg sm:text-2xl font-bold text-stone-400">/ {evaluation.totalScore}点</span>
          </div>
          <div className="text-xs text-stone-500 font-bold mt-1">
            正答数: {evaluation.correctCount} / {evaluation.totalCount}問（正答率 {evaluation.percentage}% / 合格ライン {activeExam.passScore}点）
          </div>
        </div>

        {/* 達成ランクバッジ */}
        {evaluation.achievedRank && (
          <div className="inline-block px-5 py-2.5 rounded-2xl shadow-sm text-sm sm:text-base font-black tracking-wide mx-auto">
            <span className={`px-4 py-1.5 rounded-xl ${evaluation.achievedRank.color}`}>
              {evaluation.achievedRank.level}
            </span>
            <p className="text-xs text-stone-600 mt-2 font-normal max-w-md">
              {evaluation.achievedRank.description}
            </p>
          </div>
        )}

        {/* 🎮 ゲーミフィケーション報酬・アンロックカード */}
        {rewardInfo && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-left flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto shadow-2xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-xs flex items-center gap-1 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 fill-white" /> +{rewardInfo.xpGained} XP 獲得！
                </span>
                {rewardInfo.passed && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow-2xs">
                    <Trophy className="w-3.5 h-3.5" /> ボス検定クリア！
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-800">
                {rewardInfo.stageUnlocked ? (
                  <span className="text-emerald-700 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                    おめでとうございます！ロードマップの【Stage {rewardInfo.newStageNum}】が新たにアンロックされました！
                  </span>
                ) : rewardInfo.passed ? (
                  '合格基準を達成しました！蓄積した経験値でレベルアップが近づいています。'
                ) : (
                  '模試完了ボーナスを獲得しました！失点原因を復習して再挑戦しましょう。'
                )}
              </p>
            </div>
            {onNavigateToRoadmap && (
              <button
                type="button"
                onClick={onNavigateToRoadmap}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B84E34] to-orange-600 text-white font-bold text-xs hover:opacity-90 shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
              >
                <span>🗺️ ロードマップを進める</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => startExam(selectedExamId)}
            className="px-5 py-2.5 rounded-xl bg-[#B84E34] text-white text-xs font-bold hover:bg-[#a2432c] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>もう一度解く</span>
          </button>
          {onNavigateToRoadmap && (
            <button
              type="button"
              onClick={onNavigateToRoadmap}
              className="px-5 py-2.5 rounded-xl border border-[#B84E34] bg-orange-50 text-xs font-bold text-[#B84E34] hover:bg-orange-100 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              🗺️ ロードマップへ戻る
            </button>
          )}
          <button
            type="button"
            onClick={() => setViewState('list')}
            className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all cursor-pointer"
          >
            他の級の模擬試験を選ぶ
          </button>
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
            >
              ホームへ戻る
            </button>
          )}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 🎯 【公的Can-Do到達度 ＆ 学習カルテ（根拠と道筋）】特設カード */}
      {/* ====================================================================== */}
      <section className="bg-gradient-to-br from-[#FAF7F2] to-white border-2 border-[#E8E2D5] rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#B84E34] text-white flex items-center justify-center text-xl shadow-xs">
              📋
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1B2A38] flex items-center gap-2">
                公的Can-Do到達度 ＆ 学習カルテ（根拠と道筋）
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                客観的な解答データから「何ができて」「何が不足しているのか」の根拠と次の具体的アクションを提示
              </p>
            </div>
          </div>
        </div>

        {/* 総合評価サマリーボックス */}
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed ${
            evaluation.passed
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          {evaluation.diagnosticReport.overallCanDoSummary}
        </div>

        {/* カルテ内タブ切り替え */}
        <div className="flex items-center gap-2 border-b border-stone-200">
          <button
            type="button"
            onClick={() => setActiveReportTab('prescription')}
            className={`pb-2.5 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeReportTab === 'prescription'
                ? 'border-[#B84E34] text-[#B84E34]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>🎯 次にすべきこと（処方箋）</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100">
              {evaluation.diagnosticReport.nextActions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('strengths')}
            className={`pb-2.5 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeReportTab === 'strengths'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>🟢 現在できること（Can-Do到達）</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
              {evaluation.diagnosticReport.strengths.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('weaknesses')}
            className={`pb-2.5 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeReportTab === 'weaknesses'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>⚠️ まだ不足していること（失点根拠）</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800">
              {evaluation.diagnosticReport.weaknesses.length}
            </span>
          </button>
        </div>

        {/* タブ①: 🎯 次にすべきこと（処方箋） */}
        {activeReportTab === 'prescription' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-600">
              あなたの失点パターンと苦手分野に基づき、復習すべき教科書レッスンと大辞典の学習ルートを優先度順に処方します。
            </p>
            <div className="grid grid-cols-1 gap-3">
              {evaluation.diagnosticReport.nextActions.map((action, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#B84E34]/50 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          action.priority === 'high'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {action.priority === 'high' ? '最優先' : '推奨'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-[#1B2A38]">
                        {action.title}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  {action.targetId && (
                    <button
                      type="button"
                      onClick={() => {
                        if (action.targetTab === 'dictionary' && onNavigateToDictionary) {
                          onNavigateToDictionary(action.targetId!);
                        } else if (onNavigateToTextbookLesson) {
                          onNavigateToTextbookLesson(action.targetId!);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FAF0EC] text-[#B84E34] hover:bg-[#B84E34] hover:text-white border border-[#F0D5CD] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{action.actionLabel} ➔</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* タブ②: 🟢 現在できること（Can-Do到達度・強み） */}
        {activeReportTab === 'strengths' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-600">
              今回の正答状況から客観的に実証された、あなたの定着済みスキルおよび公式Can-Do達成項目です。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evaluation.diagnosticReport.strengths.map((item, i) => (
                <div
                  key={i}
                  className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-emerald-800/80 leading-relaxed pl-6">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* タブ③: ⚠️ まだ不足していること（失点の根拠と弱点分析） */}
        {activeReportTab === 'weaknesses' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-600">
              なぜその問題で失点したのか、回答の選択理由と文法規則・語彙の混同原因を明確に提示します。
            </p>
            <div className="space-y-3">
              {evaluation.diagnosticReport.weaknesses.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-rose-200 rounded-2xl p-4 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center">
                        ❌
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-[#1B2A38]">
                        {item.title}
                      </h4>
                    </div>
                    {item.relatedLessonId && onNavigateToTextbookLesson && (
                      <button
                        type="button"
                        onClick={() => onNavigateToTextbookLesson(item.relatedLessonId!)}
                        className="text-[11px] font-bold text-[#B84E34] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{item.lessonLabel || '復習課'}を開く</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {item.description}
                  </p>
                  <div className="text-xs text-rose-900 bg-rose-50/60 p-2.5 rounded-xl border border-rose-100 leading-relaxed">
                    <strong className="text-rose-700 font-bold">失点の根拠: </strong>
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* セクション別 正答率ブレイクダウン */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#1B2A38] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#B84E34]" /> 分野別 正答率・分析
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {evaluation.sectionBreakdowns.map((sec, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5]/70 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#1B2A38]">{sec.label}</span>
                <span className="text-[#B84E34]">{sec.earned} / {sec.total}点 ({sec.percentage}%)</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#B84E34] h-full rounded-full transition-all duration-500"
                  style={{ width: `${sec.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 全問題 解答・解説・復習一覧 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-[#1B2A38]">
            📝 全問題の解答・解説 ＆ 弱点復習
          </h3>
          <span className="text-xs text-stone-500 font-bold">全{activeExam.questionCount}問</span>
        </div>

        <div className="space-y-4">
          {activeExam.questions.map((q, idx) => {
            const userAns = userAnswers[q.id];
            const isCorrect = userAns === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`bg-white border rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 ${
                  isCorrect ? 'border-stone-200' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* 問題ヘッダー */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '⭕️' : '❌'}
                    </span>
                    <span className="font-bold text-xs text-[#1B2A38]">第{idx + 1}問</span>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {q.sectionLabel}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-stone-400">配点 {q.score}点</span>
                </div>

                {/* 指示文と本文 */}
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-bold text-stone-800">{q.instruction}</p>
                  {q.audioText && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => playAudio(q.audioText)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>音声をもう一度聴く</span>
                      </button>
                    </div>
                  )}
                  {q.passage && (
                    <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8E2D5] text-xs font-mono whitespace-pre-wrap text-stone-700">
                      {q.passage}
                    </div>
                  )}
                </div>

                {/* 選択肢と正誤判定 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrectOpt = optIdx === q.correctIndex;
                    const isUserSelected = optIdx === userAns;

                    let optClass = 'bg-stone-50 text-stone-600 border-stone-200';
                    if (isCorrectOpt) {
                      optClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                    } else if (isUserSelected && !isCorrectOpt) {
                      optClass = 'bg-rose-50 text-rose-800 border-rose-300 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${optClass}`}
                      >
                        <span>{['①', '②', '③', '④'][optIdx]} {opt}</span>
                        {isCorrectOpt && <span className="text-[10px] font-black text-emerald-700">正解</span>}
                        {isUserSelected && !isCorrectOpt && (
                          <span className="text-[10px] font-black text-rose-700">あなたの回答</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 解説と全訳 */}
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 text-xs space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 解説
                  </div>
                  <p className="text-stone-700 leading-relaxed">{q.explanation}</p>
                  {q.translation && (
                    <div className="pt-1.5 border-t border-amber-200/40 text-stone-600 text-[11px] leading-relaxed">
                      <span className="font-bold text-amber-800">全訳: </span>
                      {q.translation}
                    </div>
                  )}
                </div>

                {/* 教科書・辞書への復習リンク */}
                {q.linkReview && (
                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (q.linkReview?.tab === 'textbook' && onNavigateToTextbookLesson) {
                          onNavigateToTextbookLesson(q.linkReview.id);
                        } else if (q.linkReview?.tab === 'dictionary' && onNavigateToDictionary) {
                          onNavigateToDictionary(q.linkReview.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B84E34] hover:text-[#8f3a24] hover:underline cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>教科書・辞書で復習する（{q.linkReview.label}）➔</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
