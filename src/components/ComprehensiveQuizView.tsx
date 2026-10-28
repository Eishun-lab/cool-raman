import React, { useState, useEffect } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  Brain,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../utils/speech';
import { sound } from '../utils/audioSynth';
import { ESSENTIAL_VOCAB_DATA } from '../data/koreanVocabularyData';
import { GRAMMAR_DICT_DATA } from '../data/dictionary';
import { CONVERSATION_CHUNKS_DATA } from '../data/chunks';
import { KILLER_PHRASES_DATA } from '../data/killerPhrases';
import { HANJA_IDIOMS_DATA } from '../data/hanjaIdioms';

export type QuizCategory = 'all' | 'vocab' | 'grammar' | 'chunks' | 'phrases' | 'hanja';

interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  reading?: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  audioText: string;
}

export const ComprehensiveQuizView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewList, setReviewList] = useState<QuizQuestion[]>([]);

  // クイズプールを生成
  const generateQuestions = (cat: QuizCategory, count: number = 10) => {
    let pool: { q: string; a: string; audio: string; exp: string; catLabel: string }[] = [];

    if (cat === 'all' || cat === 'vocab') {
      ESSENTIAL_VOCAB_DATA.forEach((v) => {
        pool.push({
          q: v.word,
          a: v.meaning,
          audio: v.word,
          exp: `${v.word}【${v.meaning}】(${v.pos}) ${v.example ? `例: ${v.example.ko}` : ''}`,
          catLabel: '必修単語',
        });
      });
    }

    if (cat === 'all' || cat === 'grammar') {
      GRAMMAR_DICT_DATA.forEach((g) => {
        pool.push({
          q: g.grammar,
          a: g.meaning,
          audio: g.grammar,
          exp: `${g.grammar} : ${g.meaning}（${g.example}）`,
          catLabel: '文法',
        });
      });
    }

    if (cat === 'all' || cat === 'chunks') {
      CONVERSATION_CHUNKS_DATA.forEach((c) => {
        pool.push({
          q: c.expression,
          a: c.meaning,
          audio: c.expression,
          exp: `${c.expression} : ${c.meaning}`,
          catLabel: '日常チャンク',
        });
      });
    }

    if (cat === 'all' || cat === 'phrases') {
      KILLER_PHRASES_DATA.forEach((p) => {
        pool.push({
          q: p.myAnswerKo,
          a: p.myAnswerJa,
          audio: p.myAnswerKo,
          exp: `${p.myAnswerKo} : ${p.myAnswerJa}（場面: ${p.situationJa}）`,
          catLabel: 'キラーフレーズ',
        });
      });
    }

    if (cat === 'all' || cat === 'hanja') {
      HANJA_IDIOMS_DATA.forEach((h) => {
        pool.push({
          q: `${h.hangul} (${h.hanja})`,
          a: h.meaningJa,
          audio: h.hangul,
          exp: `${h.hangul}【${h.hanja}】 : ${h.meaningJa}（${h.explanation}）`,
          catLabel: '四字熟語',
        });
      });
    }

    // シャッフルして指定件数を取り出し
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffledPool.slice(0, count);

    // 各問題にダミーの誤答3つを割り当てて四択を作成
    const generated: QuizQuestion[] = selected.map((item, idx) => {
      const otherAnswers = pool
        .filter((p) => p.a !== item.a)
        .map((p) => p.a);
      const shuffledOthers = [...new Set(otherAnswers)].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [item.a, ...shuffledOthers].sort(() => Math.random() - 0.5);

      return {
        id: `q-${idx}`,
        category: item.catLabel,
        question: item.q,
        correctAnswer: item.a,
        options,
        explanation: item.exp,
        audioText: item.audio,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setReviewList([]);
  };

  useEffect(() => {
    generateQuestions(selectedCategory, 10);
  }, [selectedCategory]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 1);
      speechService.speak(currentQ.audioText);
    } else {
      sound.playIncorrect();
      setReviewList((prev) => [...prev, currentQ]);
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePlayAudio = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playTap();
    speechService.speak(text);
  };

  const categoryConfigs: { key: QuizCategory; label: string; color: string; shadow: string }[] = [
    { key: 'all', label: '🔥 全ジャンル総合', color: '#58CC02', shadow: '#388E00' },
    { key: 'vocab', label: '📖 必修単語', color: '#1CB0F6', shadow: '#1899D6' },
    { key: 'grammar', label: '📐 文法・助詞', color: '#FF9600', shadow: '#CC7A00' },
    { key: 'chunks', label: '💬 日常チャンク', color: '#CE82FF', shadow: '#A855F7' },
    { key: 'phrases', label: '⚡ キラーフレーズ', color: '#FF4B4B', shadow: '#D32F2F' },
    { key: 'hanja', label: '🏛️ 四字熟語', color: '#2DD4BF', shadow: '#0D9488' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
      {/* 🌟 Duolingo 3D カテゴリ切り替えツールバー */}
      <div className="bg-white border-2 border-stone-200/90 rounded-3xl p-2.5 sm:p-3 shadow-[0_3px_0_#E5E7EB]">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categoryConfigs.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setSelectedCategory(cat.key);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white -translate-y-0.5'
                    : 'bg-white border-2 border-stone-200 text-stone-700 shadow-[0_2px_0_#E5E7EB] hover:bg-stone-50'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: cat.color,
                        boxShadow: `0 3px 0 ${cat.shadow}`,
                      }
                    : undefined
                }
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {!isFinished && currentQ ? (
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-[0_4px_0_#E5E7EB] border-2 border-stone-200/90 space-y-6">
          {/* プログレスバー & ヘッダー */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-black rounded-full border border-amber-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                {currentQ.category}
              </span>
              <span className="text-xs font-black text-stone-500 font-mono">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Duolingo グリーンプログレスバー */}
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200 shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-400 to-[#58CC02] h-full rounded-full transition-all duration-300 relative shadow-sm"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30 rounded-t-full" />
              </div>
            </div>
          </div>

          {/* 問題文 ＆ 3D音声ボタン */}
          <div className="text-center py-2 space-y-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-stone-400">
              意味として最も適切なものを選択してください
            </p>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {currentQ.question}
              </h2>
              <button
                type="button"
                onClick={(e) => handlePlayAudio(currentQ.audioText, e)}
                className="p-3 bg-[#1CB0F6] hover:bg-[#1899D6] text-white rounded-2xl shadow-[0_3px_0_#1899D6] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
                title="音声を聴く"
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* 四択選択肢（Duolingo 3D厚みボタン） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle =
                'bg-white border-2 border-stone-200 shadow-[0_3.5px_0_#E5E7EB] text-stone-800 hover:bg-stone-50 active:translate-y-1 active:shadow-none';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-50 border-2 border-[#58CC02] text-emerald-900 shadow-[0_3.5px_0_#388E00] font-black -translate-y-0.5';
                } else if (isSelected) {
                  btnStyle =
                    'bg-rose-50 border-2 border-rose-500 text-rose-900 shadow-[0_3.5px_0_#BE123C] font-black';
                } else {
                  btnStyle = 'bg-stone-50 opacity-40 border-2 border-stone-200 text-stone-400 shadow-none';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl text-left font-black text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#58CC02] flex-shrink-0 ml-2" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Duolingo風 アクション＆解説バナー */}
          {isAnswered && (
            <div
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all space-y-3 ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50/90 border-emerald-300 shadow-[0_3px_0_#A7F3D0]'
                  : 'bg-rose-50/90 border-rose-300 shadow-[0_3px_0_#FECDD3]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {selectedOption === currentQ.correctAnswer ? '🎉' : '💡'}
                </span>
                <div>
                  <h4
                    className={`font-black text-sm ${
                      selectedOption === currentQ.correctAnswer
                        ? 'text-emerald-900'
                        : 'text-rose-900'
                    }`}
                  >
                    {selectedOption === currentQ.correctAnswer
                      ? '정답입니다! 素晴らしい！'
                      : `正解: ${currentQ.correctAnswer}`}
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed mt-0.5">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleNext}
                  className={`px-6 py-3 font-black rounded-2xl text-white transition-all flex items-center gap-2 cursor-pointer active:translate-y-1 active:shadow-none ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-[#58CC02] hover:bg-[#46A302] shadow-[0_3.5px_0_#388E00]'
                      : 'bg-rose-500 hover:bg-rose-600 shadow-[0_3.5px_0_#BE123C]'
                  }`}
                >
                  <span>{currentIndex + 1 === questions.length ? '結果を見る' : '次の問題へ'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : isFinished ? (
        /* 🏆 Duolingo 結果発表画面 */
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_0_#E5E7EB] border-2 border-stone-200/90 text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-[0_3px_0_#FDE68A] border-2 border-amber-200">
            <Award className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">テスト完了！</h2>
            <p className="text-stone-500 text-xs sm:text-sm font-bold">
              日々のトレーニングが着実に力になっています！
            </p>
          </div>

          {/* スコアカード */}
          <div className="bg-slate-50 rounded-2xl p-6 max-w-sm mx-auto border-2 border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-600">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>+{score * 5} XP 獲得！</span>
            </div>
            <p className="text-5xl font-black text-[#58CC02]">
              {score}{' '}
              <span className="text-2xl text-stone-400 font-bold">/ {questions.length}</span>
            </p>
            <p className="text-xs font-black text-stone-600">
              正答率: {Math.round((score / questions.length) * 100)}%
            </p>
          </div>

          {/* 復習セクション */}
          {reviewList.length > 0 && (
            <div className="text-left space-y-3 max-w-md mx-auto">
              <h3 className="text-xs font-black text-stone-700 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-rose-500" />
                間違えた問題の復習 ({reviewList.length}問)
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {reviewList.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-white rounded-2xl border-2 border-stone-200 flex justify-between items-center text-xs shadow-2xs"
                  >
                    <div>
                      <span className="font-black text-slate-900 mr-2">{r.question}</span>
                      <span className="text-stone-500 font-bold">➔ {r.correctAnswer}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(r.audioText)}
                      className="p-2 hover:bg-stone-100 rounded-xl text-[#1CB0F6] cursor-pointer shrink-0"
                      title="音声を再生"
                    >
                      <Volume2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                generateQuestions(selectedCategory, 10);
              }}
              className="px-6 py-3 bg-[#58CC02] hover:bg-[#46A302] text-white font-black rounded-2xl shadow-[0_3.5px_0_#388E00] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>もう一度特訓する</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ComprehensiveQuizView;
