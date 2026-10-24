import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  MessageCircle,
  Headphones,
  Zap,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { LevelCheckQuestion, UserAnswerRecord, LevelCheckResult, SkillCategory } from './types';
import { sampleLevelCheckQuestions } from './data';
import { evaluateLevelCheck } from './evaluator';
import { speechService } from '../../utils/speech';

interface LevelCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLesson?: (lessonNumber: number) => void;
  onNavigateToConversation?: () => void;
  onNavigateToShadowing?: () => void;
}

const TOTAL_TIME_SECONDS = 300; // 5分 = 300秒

export const LevelCheckModal: React.FC<LevelCheckModalProps> = ({
  isOpen,
  onClose,
  onNavigateToLesson,
  onNavigateToConversation,
  onNavigateToShadowing,
}) => {
  // フェーズ: 'intro' (開始前説明) | 'testing' (テスト中) | 'result' (結果画面)
  const [phase, setPhase] = useState<'intro' | 'testing' | 'result'>('intro');
  const [questions, setQuestions] = useState<LevelCheckQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [answers, setAnswers] = useState<UserAnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<LevelCheckResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const answersRef = useRef<UserAnswerRecord[]>([]);
  const timeLeftRef = useRef(TOTAL_TIME_SECONDS);
  const questionsRef = useRef<LevelCheckQuestion[]>([]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // モーダルが開かれたら初期化
  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setSelectedOption(null);
      currentIndexRef.current = 0;
      setCurrentIndex(0);
      answersRef.current = [];
      setAnswers([]);
      setResult(null);
      setShowDetails(false);
      timeLeftRef.current = TOTAL_TIME_SECONDS;
      setTimeLeft(TOTAL_TIME_SECONDS);
    } else {
      speechService.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  // テスト開始ハンドラー
  const handleStartTest = () => {
    const sampled = sampleLevelCheckQuestions();
    questionsRef.current = sampled;
    setQuestions(sampled);
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    answersRef.current = [];
    setAnswers([]);
    setSelectedOption(null);
    timeLeftRef.current = TOTAL_TIME_SECONDS;
    setTimeLeft(TOTAL_TIME_SECONDS);
    setPhase('testing');
    questionStartTimeRef.current = Date.now();

    // 最初の問題がリスニングなら自動で音声を再生
    if (sampled[0]?.audioText) {
      playAudio(sampled[0].audioText);
    }
  };

  // タイマー進行
  useEffect(() => {
    if (phase === 'testing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // 時間切れ！自動終了
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // 音声再生
  const playAudio = (text: string) => {
    speechService.stop();
    speechService.unlockAudio?.();
    setIsPlayingAudio(true);
    speechService.speak(text, {
      rate: 0.85,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  // 選択肢を選択したときのハンドラー
  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null) return; // 二重タップ防止
    speechService.unlockAudio?.(); // iOS Safari オーディオ先行アンロック
    setSelectedOption(optionIndex);

    const cIdx = currentIndexRef.current;
    const currentQ = questionsRef.current[cIdx] || questions[cIdx];
    if (!currentQ) return;

    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000;
    const isCorrect = optionIndex === currentQ.correctIndex;

    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      category: currentQ.category,
      stage: currentQ.stage,
      selectedIndex: optionIndex,
      isCorrect,
      timeTakenSeconds: timeTaken,
    };

    const nextAnswers = [...answersRef.current, record];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    // テンポよく 350ms 後に次の問題へ
    setTimeout(() => {
      speechService.stop();
      const curr = currentIndexRef.current;
      const totalQ = questionsRef.current.length;
      if (curr + 1 < totalQ) {
        const nextIdx = curr + 1;
        currentIndexRef.current = nextIdx;
        setCurrentIndex(nextIdx);
        setSelectedOption(null);
        questionStartTimeRef.current = Date.now();

        // 次の問題がリスニングなら音声を再生
        const nextQ = questionsRef.current[nextIdx];
        if (nextQ?.audioText) {
          playAudio(nextQ.audioText);
        }
      } else {
        // 全問終了！集計へ
        const totalUsedTime = TOTAL_TIME_SECONDS - Math.max(0, timeLeftRef.current - 1);
        const evalResult = evaluateLevelCheck(answersRef.current, Math.max(1, totalUsedTime));
        setResult(evalResult);
        setPhase('result');
      }
    }, 350);
  };

  // 時間切れまたは強制終了
  const handleFinishTest = () => {
    speechService.stop();
    const totalUsedTime = TOTAL_TIME_SECONDS - timeLeft;
    // 未回答の問題は不正解として埋める
    const answeredCount = answers.length;
    const finalAnswers = [...answers];
    for (let i = answeredCount; i < questions.length; i++) {
      const q = questions[i];
      finalAnswers.push({
        questionId: q.id,
        category: q.category,
        stage: q.stage,
        selectedIndex: -1,
        isCorrect: false,
        timeTakenSeconds: 0,
      });
    }
    const evalResult = evaluateLevelCheck(finalAnswers, Math.max(1, totalUsedTime));
    setResult(evalResult);
    setPhase('result');
  };

  // テスト中断
  const handleCancelTest = () => {
    if (phase === 'testing') {
      const ok = window.confirm('テストを中断しますか？\n（現在の回答は保存されません）');
      if (!ok) return;
    }
    speechService.stop();
    onClose();
  };

  // 時間表示フォーマッター (分:秒)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const getCategoryBadge = (cat: SkillCategory) => {
    switch (cat) {
      case 'listening':
        return { label: 'リスニング', icon: Headphones, color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'reading':
        return { label: '読み・発音', icon: Volume2, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'vocab':
        return { label: '単語・表現', icon: MessageCircle, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'grammar':
        return { label: '文法・助詞', icon: BookOpen, color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
  };

  return (
    <div
      data-testid="level-check-modal"
      className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col overflow-hidden text-[#1B2A38] font-sans antialiased"
    >
      {/* ===================== ヘッダー固定バー ===================== */}
      <header className="px-3 sm:px-6 py-2 bg-white border-b border-[#E8E2D5] flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAF0EC] flex items-center justify-center text-[#B84E34]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold font-serif text-[#1B2A38]">5分総合レベル診断</h2>
            <p className="text-[10px] text-[#8A8075]">会話直感力 ＆ 基礎4技能</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {phase === 'testing' && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-xs font-bold transition-colors ${
                timeLeft <= 60
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-[#FAF7F2] text-[#B84E34] border border-[#E2DDD2]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCancelTest}
            className="p-1 text-[#8A8075] hover:text-[#1B2A38] rounded-lg cursor-pointer"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ===================== 進捗プログレスバー（テスト中のみ） ===================== */}
      {phase === 'testing' && (
        <div className="w-full bg-[#E8E2D5] h-1 shrink-0">
          <div
            className="bg-[#B84E34] h-1 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      )}

      {/* ===================== ① 開始前説明（INTRO） ===================== */}
      {phase === 'intro' && (
        <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full flex flex-col justify-center space-y-5">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF0EC] text-[#B84E34] border border-[#F2DED6]">
              <Sparkles className="w-3.5 h-3.5" />
              たった5分であなたの現在地がわかる
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1B2A38]">
              韓国語 総合レベルチェック
            </h1>
            <p className="text-xs sm:text-sm text-[#756D63] leading-relaxed">
              リスニング、読み・発音、単語、文法の4つの基礎力をバランスよく測定し、あなたが次に進むべき教科書の課や学習の処方箋をお届けします。
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#1B2A38] flex items-center gap-1.5 border-b border-[#F0EBE1] pb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>テストの3つの特徴</span>
            </h3>
            <ul className="text-xs text-[#544D45] space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">①</span>
                <span><strong>全16問・均等出題：</strong> 入門から初級完成まで各難易度とスキルを均等にサンプリング。「たまたま知っていた/知らなかった」の偏りを防ぎます。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B84E34] font-bold shrink-0">②</span>
                <span><strong>口頭会話・直感を最重視：</strong> 文法用語は問いません。「耳で聞いて直感でパッと反応できるか」の瞬発力を測ります。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold shrink-0">③</span>
                <span><strong>あなた専用の処方箋：</strong> 「次は教科書の第何課からやるべきか」「直感回路を鍛える会話フレーズ」を具体的に提示します。</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFF9F5] border border-[#F5D5C6] rounded-xl p-3 text-xs text-[#8A422D] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B84E34] shrink-0" />
            <span>音声が流れる問題があります。音量をオンにするかイヤホンのご使用をおすすめします。</span>
          </div>

          <button
            type="button"
            onClick={handleStartTest}
            className="w-full py-3.5 rounded-2xl bg-[#B84E34] hover:bg-[#A0422B] text-white font-bold text-sm sm:text-base transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>5分テストをスタートする</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===================== ② テスト出題中（TESTING） ===================== */}
      {phase === 'testing' && currentQ && (
        <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* スキルバッジ ＆ 問題番号 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {(() => {
                  const badgeInfo = getCategoryBadge(currentQ.category);
                  const Icon = badgeInfo.icon;
                  return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${badgeInfo.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badgeInfo.label}</span>
                    </span>
                  );
                })()}
                <span className="text-[10px] font-bold text-[#8A8075] bg-[#FAF7F2] border border-[#E2DDD2] px-2 py-0.5 rounded-lg">
                  Stage {currentQ.stage}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#8A8075]">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* 音声再生ボタン（リスニング問題） */}
            {currentQ.audioText && (
              <div className="p-3 bg-white border border-[#E8E2D5] rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#FAF0EC] flex items-center justify-center text-[#B84E34] shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#756D63] truncate">
                    韓国語の音声を聞いてください
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => playAudio(currentQ.audioText!)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isPlayingAudio
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-[#B84E34] text-white hover:bg-[#A0422B] shadow-2xs'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? '再生中...' : 'もう一度聞く'}</span>
                </button>
              </div>
            )}

            {/* 問題文 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-2xs space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#1B2A38] leading-relaxed whitespace-pre-wrap">
                {currentQ.question}
              </h3>
              {currentQ.promptSubtitle && (
                <p className="text-xs text-[#8A8075]">{currentQ.promptSubtitle}</p>
              )}
            </div>

            {/* 4つの選択肢 */}
            <div className="space-y-2 pt-1">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                    data-testid={`option-button-${idx}`}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#B84E34] text-white border-[#B84E34] shadow-xs scale-[0.99]'
                        : 'bg-white hover:bg-[#FAF7F2] text-[#1B2A38] border-[#E8E2D5] shadow-2xs active:bg-[#FAF0EC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FAF7F2] text-[#8A8075] border border-[#E2DDD2]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold leading-snug break-words">
                        {opt}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center text-[11px] text-[#948C82] pb-1">
            💡 考え込まず、直感とリズムでパッと選んでみましょう！
          </div>
        </div>
      )}

      {/* ===================== ③ 診断結果レポート（RESULT） ===================== */}
      {phase === 'result' && result && (
        <div className="flex-1 overflow-y-auto px-4 py-5 max-w-lg mx-auto w-full space-y-4">
          {/* 総合レベルカード */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-sm text-center space-y-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF0EC] text-[#B84E34] border border-[#F2DED6]">
              <Award className="w-3.5 h-3.5" />
              <span>{result.badge}</span>
            </span>

            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1B2A38]">
              {result.stageTitle}
            </h2>

            <div className="flex items-center justify-center gap-4 py-2 border-y border-[#F0EBE1]">
              <div>
                <div className="text-[10px] text-[#8A8075] font-bold">正答数</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#B84E34]">
                  {result.totalScore} <span className="text-xs text-[#8A8075]">/ {result.maxScore}</span>
                </div>
              </div>
              <div className="w-px h-8 bg-[#E8E2D5]" />
              <div>
                <div className="text-[10px] text-[#8A8075] font-bold">平均回答時間</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#1B2A38]">
                  {result.averageTimePerQuestion.toFixed(1)} <span className="text-xs text-[#8A8075]">秒/問</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#544D45] text-left leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* 🗣️ 会話・直感力（SLA反射神経）アドバイス */}
          <div className="bg-[#FFF9F5] border border-[#F5D5C6] rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B84E34]">
              <Zap className="w-4 h-4" />
              <span>{result.intuitionEvaluation.title}</span>
            </div>
            <p className="text-xs text-[#6B3A2C] leading-relaxed">
              {result.intuitionEvaluation.description}
            </p>
          </div>

          {/* 4大スキルの達成度バー */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-[#1B2A38] border-b border-[#F0EBE1] pb-1.5">
              📊 4大スキルの現在地
            </h4>
            <div className="space-y-2">
              {[
                { key: 'listening', label: '🎧 リスニング（耳・直感）' },
                { key: 'reading', label: '🗣️ 読み・発音（音韻変化）' },
                { key: 'vocab', label: '💬 単語・表現（瞬発語彙）' },
                { key: 'grammar', label: '🧱 文法・助詞（会話の骨組み）' },
              ].map(({ key, label }) => {
                const stat = result.categoryScores[key as SkillCategory];
                const pct = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#544D45]">
                      <span>{label}</span>
                      <span className="font-mono text-[11px] text-[#B84E34]">
                        {stat.correct} / {stat.total} ({Math.round(pct)}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF7F2] border border-[#E8E2D5] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#B84E34] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* あなた専用のネクストアクション（処方箋リンク） */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-[#1B2A38] border-b border-[#F0EBE1] pb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B84E34]" />
              <span>今日から始めるおすすめ処方箋</span>
            </h4>
            <div className="space-y-2">
              {onNavigateToLesson && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToLesson(result.recommendedLesson);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#FAF0EC] hover:bg-[#F5E5DE] border border-[#F2DED6] text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-[#B84E34]">📖 教科書おすすめレッスン</div>
                    <div className="text-xs font-bold text-[#1B2A38] truncate">
                      第{result.recommendedLesson}課からスタートする
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#B84E34] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              )}

              {onNavigateToConversation && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToConversation();
                  }}
                  className="w-full p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-emerald-800">🗣️ 口を動かす直感トレーニング</div>
                    <div className="text-xs font-bold text-emerald-950 truncate">
                      会話タブの実践チャンク・直感フレーズを開く
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              )}

              {onNavigateToShadowing && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToShadowing();
                  }}
                  className="w-full p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-purple-800">🎙️ 耳とリズムを鍛える</div>
                    <div className="text-xs font-bold text-purple-950 truncate">
                      YouTube / Podcast シャドーイングを開く
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-800 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              )}
            </div>
          </div>

          {/* 回答の解説（トグル開閉） */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full p-3 flex items-center justify-between text-xs font-bold text-[#544D45] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#8A8075]" />
                <span>各問題の正誤と解説を確認する ({questions.length}問)</span>
              </span>
              <ChevronRight
                className={`w-4 h-4 text-[#8A8075] transition-transform ${
                  showDetails ? 'rotate-90' : ''
                }`}
              />
            </button>

            {showDetails && (
              <div className="p-3 border-t border-[#F0EBE1] space-y-3 bg-[#FAF7F2]/50 divide-y divide-[#F0EBE1]">
                {questions.map((q, idx) => {
                  const record = result.records.find((r) => r.questionId === q.id);
                  const isCorrect = record?.isCorrect;
                  return (
                    <div key={q.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#1B2A38]">
                          問{idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold text-[11px] shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 正解
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold text-[11px] shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> 不正解
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#544D45] bg-white p-2 rounded-lg border border-[#EDE7DC] space-y-1">
                        <div>
                          <strong>正解:</strong> {q.options[q.correctIndex]}
                        </div>
                        <div className="text-[#756D63]">{q.explanation}</div>
                        <div className="text-[#B84E34] font-medium pt-0.5">
                          💡 会話のコツ: {q.conversationTip}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* フッター操作ボタン */}
          <div className="flex items-center gap-2 pt-2 pb-4">
            <button
              type="button"
              onClick={handleStartTest}
              className="flex-1 py-3 rounded-xl bg-white border border-[#E2DDD2] hover:bg-[#FAF7F2] text-[#1B2A38] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#B84E34]" />
              <span>もう一度診断する</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#1B2A38] hover:bg-[#2C3E50] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center cursor-pointer active:scale-98"
            >
              完了して閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
