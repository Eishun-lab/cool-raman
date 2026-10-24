import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, Sparkles, Award, ArrowRight, Brain, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../utils/speech';
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
      ESSENTIAL_VOCAB_DATA.forEach(v => {
        pool.push({
          q: v.word,
          a: v.meaning,
          audio: v.word,
          exp: `${v.word}【${v.meaning}】(${v.pos}) ${v.example ? `例: ${v.example.ko}` : ''}`,
          catLabel: '必修単語'
        });
      });
    }

    if (cat === 'all' || cat === 'grammar') {
      GRAMMAR_DICT_DATA.forEach(g => {
        pool.push({
          q: g.grammar,
          a: g.meaning,
          audio: g.grammar,
          exp: `${g.grammar} : ${g.meaning}（${g.example}）`,
          catLabel: '文法'
        });
      });
    }

    if (cat === 'all' || cat === 'chunks') {
      CONVERSATION_CHUNKS_DATA.forEach(c => {
        pool.push({
          q: c.expression,
          a: c.meaning,
          audio: c.expression,
          exp: `${c.expression} : ${c.meaning}`,
          catLabel: '日常チャンク'
        });
      });
    }

    if (cat === 'all' || cat === 'phrases') {
      KILLER_PHRASES_DATA.forEach(p => {
        pool.push({
          q: p.myAnswerKo,
          a: p.myAnswerJa,
          audio: p.myAnswerKo,
          exp: `${p.myAnswerKo} : ${p.myAnswerJa}（場面: ${p.situationJa}）`,
          catLabel: 'キラーフレーズ'
        });
      });
    }

    if (cat === 'all' || cat === 'hanja') {
      HANJA_IDIOMS_DATA.forEach(h => {
        pool.push({
          q: `${h.hangul} (${h.hanja})`,
          a: h.meaningJa,
          audio: h.hangul,
          exp: `${h.hangul}【${h.hanja}】 : ${h.meaningJa}（${h.explanation}）`,
          catLabel: '四字熟語'
        });
      });
    }

    // シャッフルして指定件数を取り出し
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffledPool.slice(0, count);

    // 各問題にダミーの誤答3つを割り当てて四択を作成
    const generated: QuizQuestion[] = selected.map((item, idx) => {
      const otherAnswers = pool
        .filter(p => p.a !== item.a)
        .map(p => p.a);
      const shuffledOthers = [...new Set(otherAnswers)].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [item.a, ...shuffledOthers].sort(() => Math.random() - 0.5);

      return {
        id: `q-${idx}`,
        category: item.catLabel,
        question: item.q,
        correctAnswer: item.a,
        options,
        explanation: item.exp,
        audioText: item.audio
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
      setScore(prev => prev + 1);
      speechService.speak(currentQ.audioText);
    } else {
      setReviewList(prev => [...prev, currentQ]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePlayAudio = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechService.speak(text);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* カテゴリ切り替えフィルター */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {[
          { key: 'all', label: '🔥 全ジャンル総合' },
          { key: 'vocab', label: '📖 必修単語' },
          { key: 'grammar', label: '📐 文法・助詞' },
          { key: 'chunks', label: '💬 日常チャンク' },
          { key: 'phrases', label: '⚡ キラーフレーズ' },
          { key: 'hanja', label: '🏛️ 四字熟語' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key as QuizCategory)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === cat.key
                ? 'bg-[#B84E34] text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {!isFinished && currentQ ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-200">
          {/* プログレスバー & ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
              {currentQ.category}
            </span>
            <span className="text-sm font-medium text-stone-500">
              問題 {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-[#B84E34] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* 問題文 */}
          <div className="text-center my-6">
            <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
              意味として最も適切なものを選択
            </p>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
                {currentQ.question}
              </h2>
              <button
                onClick={(e) => handlePlayAudio(currentQ.audioText, e)}
                className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full transition-all"
                title="音声を再生"
              >
                <Volume2 className="w-6 h-6 text-[#B84E34]" />
              </button>
            </div>
          </div>

          {/* 四択選択肢 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-8">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                } else {
                  btnStyle = 'bg-stone-50 opacity-40 border-stone-200 text-stone-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-left font-medium text-base transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* 解説 ＆ 次へボタン */}
          {isAnswered && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs font-bold text-amber-800 mb-1">💡 ワンポイント解説</p>
              <p className="text-sm text-stone-700">{currentQ.explanation}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#B84E34] hover:bg-[#9e3f28] text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <span>{currentIndex + 1 === questions.length ? '結果を見る' : '次の問題へ'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : isFinished ? (
        /* 結果画面 */
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-stone-200 text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-extrabold text-stone-800 mb-2">テスト完了！</h2>
          <p className="text-stone-500 text-sm mb-6">お疲れ様でした。実力を定期的にチェックしましょう！</p>

          <div className="bg-stone-50 rounded-2xl p-6 mb-8 max-w-sm mx-auto border border-stone-200">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">正解スコア</p>
            <p className="text-5xl font-black text-[#B84E34]">
              {score} <span className="text-2xl text-stone-400 font-semibold">/ {questions.length}</span>
            </p>
            <p className="text-xs text-stone-500 mt-2">
              正答率: {Math.round((score / questions.length) * 100)}%
            </p>
          </div>

          {reviewList.length > 0 && (
            <div className="text-left mb-8">
              <h3 className="text-base font-bold text-stone-700 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-rose-500" />
                間違えた問題の復習 ({reviewList.length}問)
              </h3>
              <div className="space-y-2">
                {reviewList.map(r => (
                  <div key={r.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-bold text-stone-800 mr-2">{r.question}</span>
                      <span className="text-stone-500 text-xs">➔ {r.correctAnswer}</span>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(r.audioText)}
                      className="p-1.5 hover:bg-stone-200 rounded-full"
                    >
                      <Volume2 className="w-4 h-4 text-[#B84E34]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={() => generateQuestions(selectedCategory, 10)}
              className="px-6 py-3 bg-[#B84E34] hover:bg-[#9e3f28] text-white font-bold rounded-2xl shadow transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>もう一度挑戦する</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
