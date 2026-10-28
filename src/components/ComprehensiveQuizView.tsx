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

  const categoryConfigs: { key: QuizCategory; label: string }[] = [
    { key: 'all', label: '全ジャンル総合' },
    { key: 'vocab', label: '必修単語' },
    { key: 'grammar', label: '文法・助詞' },
    { key: 'chunks', label: '日常チャンク' },
    { key: 'phrases', label: 'キラーフレーズ' },
    { key: 'hanja', label: '四字熟語' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
      {/* 🌟 Speak風 ミニマル・カテゴリ切り替えバー */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {!isFinished && currentQ ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/90 space-y-5">
          {/* プログレスバー & ヘッダー */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-md border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {currentQ.category}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* プログレスバー */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 問題文 ＆ 音声ボタン */}
          <div className="text-center py-2 space-y-2.5">
            <p className="text-[11px] font-medium tracking-wide text-slate-400">
              意味として最も適切なものを選択してください
            </p>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {currentQ.question}
              </h2>
              <button
                type="button"
                onClick={(e) => handlePlayAudio(currentQ.audioText, e)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer shrink-0 border border-slate-200"
                title="音声を聴く"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 四択選択肢 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle =
                'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnStyle =
                    'bg-rose-50 border-2 border-rose-400 text-rose-900 font-bold';
                } else {
                  btnStyle = 'bg-slate-50 opacity-40 border border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 sm:p-4 rounded-xl text-left font-medium text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${btnStyle}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* アクション＆解説バナー */}
          {isAnswered && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                  : 'bg-rose-50/70 border-rose-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="space-y-1.5 flex-1">
                  <h4
                    className={`font-bold text-sm sm:text-base ${
                      selectedOption === currentQ.correctAnswer
                        ? 'text-emerald-900'
                        : 'text-rose-900'
                    }`}
                  >
                    {selectedOption === currentQ.correctAnswer
                      ? '正解です！'
                      : `正解: ${currentQ.correctAnswer}`}
                  </h4>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">解説・ポイント</span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className={`w-full sm:w-auto px-6 py-2.5 font-bold rounded-xl text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-slate-900 hover:bg-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <span>{currentIndex + 1 === questions.length ? '結果を見る' : '次の問題へ'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : isFinished ? (
        /* 結果発表画面 */
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">特訓完了！</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-normal">
              日々のトレーニングが着実に力になっています
            </p>
          </div>

          {/* スコアカード */}
          <div className="bg-slate-50 rounded-xl p-5 max-w-sm mx-auto border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>+{score * 5} XP 獲得！</span>
            </div>
            <p className="text-4xl font-bold text-slate-900 font-mono">
              {score}{' '}
              <span className="text-xl text-slate-400 font-normal">/ {questions.length}</span>
            </p>
            <p className="text-xs font-medium text-slate-500">
              正答率: {Math.round((score / questions.length) * 100)}%
            </p>
          </div>

          {/* 復習セクション */}
          {reviewList.length > 0 && (
            <div className="text-left space-y-3 max-w-md mx-auto">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-slate-500" />
                復習が必要な問題 ({reviewList.length}問)
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {reviewList.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 mr-2">{r.question}</span>
                      <span className="text-slate-500 font-normal">➔ {r.correctAnswer}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(r.audioText)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer shrink-0"
                      title="音声を再生"
                    >
                      <Volume2 className="w-4 h-4" />
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
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>もう一度特訓する</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ComprehensiveQuizView;
