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
  Share2,
  HelpCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../../utils/speech';
import {
  MockExam,
  MockQuestion,
  ExamType,
  ExamEvaluation,
  SectionBreakdown
} from '../../types/mockExam';
import { ALL_MOCK_EXAMS, getMockExamById } from '../../data/mockExams';

interface MockExamViewProps {
  onNavigateToTextbookLesson?: (lessonId: string) => void;
  onNavigateToDictionary?: (dictId: string) => void;
  onBackToDashboard?: () => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  onNavigateToTextbookLesson,
  onNavigateToDictionary,
  onBackToDashboard,
}) => {
  // 画面状態: 'list' (選択画面) | 'exam' (試験中) | 'result' (結果発表)
  const [viewState, setViewState] = useState<'list' | 'exam' | 'result'>('list');
  const [selectedExamId, setSelectedExamId] = useState<ExamType>('topik1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1200);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

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

  // 試験終了・採点
  const finishExam = () => {
    setShowFinishConfirm(false);
    setViewState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 紙吹雪エフェクト
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // 採点と評価計算
  const evaluation: ExamEvaluation = useMemo(() => {
    let earnedScore = 0;
    let correctCount = 0;
    const sectionMap: Record<string, { earned: number; total: number; label: string }> = {};

    activeExam.questions.forEach((q) => {
      const isCorrect = userAnswers[q.id] === q.correctIndex;
      if (isCorrect) {
        earnedScore += q.score;
        correctCount += 1;
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

    const passed = earnedScore >= (activeExam.passCriteria[0]?.minScore || 60);

    const sectionBreakdowns: SectionBreakdown[] = Object.entries(sectionMap).map(
      ([sectionKey, data]) => ({
        section: sectionKey as any,
        label: data.label,
        earned: data.earned,
        total: data.total,
        percentage: Math.round((data.earned / data.total) * 100) || 0,
      })
    );

    return {
      score: earnedScore,
      totalScore: activeExam.totalScore,
      percentage,
      achievedRank,
      passed,
      sectionBreakdowns,
      correctCount,
      totalCount: activeExam.questionCount,
    };
  }, [activeExam, userAnswers]);

  // 残り時間のフォーマット (分:秒)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 未回答数の計算
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = activeExam.questionCount - answeredCount;

  // ==========================================================================
  // ① 模擬試験 選択画面（トップ一覧）
  // ==========================================================================
  if (viewState === 'list') {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {/* ヘッダー紹介セクション */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5 text-indigo-600" /> TOPIK ＆ ハングル検定 公式完全準拠
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1B2A38] tracking-tight mb-3">
            実戦 模擬試験センター
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            過去問の出題傾向・形式・配点を忠実に再現した実戦ハーフ模試。<br className="hidden sm:inline" />
            音声リスニング、制限時間タイマー、級判定、丁寧な解説と教科書復習リンクを完備しています。
          </p>
        </div>

        {/* 4大模擬試験カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {ALL_MOCK_EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* バッジ行 */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
                    {exam.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{Math.round(exam.timeLimitSeconds / 60)}分 / {exam.questionCount}問</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors mb-1.5">
                  {exam.title}
                </h2>
                <p className="text-xs font-bold text-stone-500 mb-3">{exam.subtitle}</p>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  {exam.overview}
                </p>

                {/* 合格基準プレビュー */}
                <div className="bg-[#FAF7F2] rounded-xl p-3 mb-6 border border-[#E8E2D5]/70 space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-500 flex items-center justify-between">
                    <span>🎯 合格判定ボーダーライン</span>
                    <span>100点満点</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.passCriteria.map((c, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${c.color}`}
                      >
                        {c.level} ({c.minScore}点〜)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 受験開始ボタン */}
              <button
                type="button"
                onClick={() => startExam(exam.id)}
                className="w-full py-3 rounded-2xl bg-[#B84E34] hover:bg-[#a2432c] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>模擬試験を開始する</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
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
                採点後はすぐに詳細な解説と合否判定が表示されます。
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
  // ③ 模擬試験 採点・結果レポート画面（終了後）
  // ==========================================================================
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* 総合スコアカード */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
          {activeExam.title} 判定結果
        </div>

        {/* 合格バッジ */}
        <div>
          <div className="text-3xl sm:text-5xl font-black text-[#1B2A38] tracking-tight">
            {evaluation.score} <span className="text-lg sm:text-2xl font-bold text-stone-400">/ {evaluation.totalScore}点</span>
          </div>
          <div className="text-xs text-stone-500 font-bold mt-1">
            正答数: {evaluation.correctCount} / {evaluation.totalCount}問（正答率 {evaluation.percentage}%）
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
          <button
            type="button"
            onClick={() => setViewState('list')}
            className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all cursor-pointer"
          >
            他の模擬試験を選ぶ
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
