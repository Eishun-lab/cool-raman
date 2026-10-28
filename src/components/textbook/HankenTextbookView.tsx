import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Volume2,
  Zap,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { LessonData } from '../../types';
import { LESSONS_DATA } from '../../data/lessons';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface HankenTextbookViewProps {
  initialLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  onStartDrillForLesson?: (lesson: LessonData) => void;
  onBackToHome?: () => void;
}

export const HankenTextbookView: React.FC<HankenTextbookViewProps> = ({
  initialLessonId = 'lesson-1',
  onSelectLesson,
  onStartDrillForLesson,
  onBackToHome,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(initialLessonId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
    }
  }, [initialLessonId]);

  // 5級の対象範囲：第1課〜第15課（全15課）
  const grade5Lessons = useMemo(() => {
    return LESSONS_DATA.filter((l) => l.number >= 1 && l.number <= 15);
  }, []);

  const currentLessonIndex = useMemo(() => {
    const idx = grade5Lessons.findIndex((l) => l.id === selectedLessonId);
    return idx >= 0 ? idx : 0;
  }, [selectedLessonId, grade5Lessons]);

  const currentLesson = grade5Lessons[currentLessonIndex] || grade5Lessons[0];
  const prevLesson = currentLessonIndex > 0 ? grade5Lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < grade5Lessons.length - 1 ? grade5Lessons[currentLessonIndex + 1] : null;

  const handleSelectLesson = (lessonId: string) => {
    sound.playTap();
    setSelectedLessonId(lessonId);
    setIsDrawerOpen(false);
    onSelectLesson?.(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-16 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. 上部コントロールバー（戻るボタン ＆ 課切り替えドロワー）              */}
      {/* ===================================================================== */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onBackToHome?.();
          }}
          className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE4DA] text-stone-700 hover:text-[#B84E34] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>5級ホームに戻る</span>
        </button>

        {/* 課選択ドロップダウン */}
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setIsDrawerOpen(!isDrawerOpen);
          }}
          className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE4DA] text-stone-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <span className="font-mono text-[#B84E34]">
            {String(currentLesson.number).padStart(2, '0')} / 15課
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>

      {/* 目次ドロワーモーダル */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-5 space-y-3 max-h-[80vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE4DA] pb-2">
              <h3 className="text-sm font-bold text-[#2A2421]">
                5級 出題カリキュラム（全15課）
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                閉じる
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {grade5Lessons.map((lesson) => {
                const isSelected = lesson.id === currentLesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleSelectLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FAF0EC] text-[#B84E34] font-bold border border-[#F0D5CD]'
                        : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs text-stone-400 font-bold shrink-0">
                        {String(lesson.number).padStart(2, '0')}
                      </span>
                      <span className="text-xs truncate">
                        {lesson.title.replace(/^第\d+課：/, '')}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#B84E34] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. 教科書本文カード（暖かみのある紙風カード）                          */}
      {/* ===================================================================== */}
      <article className="bg-white border border-[#EAE4DA] rounded-3xl p-5 sm:p-7 shadow-[0_2px_12px_rgba(42,36,33,0.04)] space-y-5">
        {/* レッスンタイトル */}
        <div className="space-y-1 border-b border-[#EAE4DA] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
              5級 必修
            </span>
            <span className="text-[11px] font-mono font-bold text-stone-500">
              第{currentLesson.number}課 / 全15課
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#2A2421] tracking-tight pt-1 leading-snug">
            {currentLesson.title}
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed font-normal">
            {currentLesson.subtitle}
          </p>
        </div>

        {/* ① 出題のコア仕組み */}
        {currentLesson.concept && (
          <section className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2421]">
              <span className="text-sm">💡</span>
              <span>出題のコア仕組み（核心ルール）</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-l-4 border-[#B84E34] text-[#2A2421] leading-relaxed text-xs sm:text-sm">
              {currentLesson.concept.description}
            </div>
          </section>
        )}

        {/* ② 公式・使い分け表 */}
        {currentLesson.rules && currentLesson.rules.items && (
          <section className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2421]">
              <span className="text-sm">📐</span>
              <span>{currentLesson.rules.title || '公式ルール＆整理表'}</span>
            </div>
            <div className="space-y-2">
              {currentLesson.rules.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DA] text-xs space-y-1"
                >
                  <div className="font-bold text-[#2A2421]">{item.label}</div>
                  <div className="text-stone-600 leading-relaxed whitespace-pre-wrap font-normal pt-0.5">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ③ 5級 必須単語リスト（タップで音声再生） */}
        {currentLesson.vocabList && currentLesson.vocabList.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2A2421]">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">📝</span>
                <span>5級 必須単語（タップでネイティブ音声）</span>
              </div>
              <span className="text-[10px] text-stone-400 font-normal">タップで再生</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentLesson.vocabList.map((v, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playTap();
                    speechService.speak(v.ko);
                  }}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0EC] border border-[#EAE4DA] hover:border-[#F0D5CD] transition-all cursor-pointer flex items-center justify-between gap-1.5 group"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#2A2421] group-hover:text-[#B84E34] transition-colors truncate">
                      {v.ko}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate font-mono">
                      {v.reading} • {v.ja}
                    </div>
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#B84E34] shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ④ 実戦例文（音声付き） */}
        {currentLesson.examples && currentLesson.examples.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2421]">
              <span className="text-sm">🗣️</span>
              <span>実戦例文（タップで韓国語音声）</span>
            </div>
            <div className="space-y-2">
              {currentLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playTap();
                    speechService.speak(ex.ko);
                  }}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0EC]/60 border border-[#EAE4DA] hover:border-[#F0D5CD] transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-[#B84E34] transition-colors">
                      {ex.ko}
                    </div>
                    {ex.reading && (
                      <div className="text-[11px] text-stone-500 font-mono">
                        {ex.reading}
                      </div>
                    )}
                    <div className="text-xs text-stone-600 font-normal pt-0.5">
                      {ex.ja}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                      speechService.speak(ex.ko);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-[#EAE4DA] text-stone-500 group-hover:text-[#B84E34] shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ⑤ ハン検5級 出題の罠・落とし穴 */}
        {currentLesson.pitfall && (
          <section className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2421]">
              <span className="text-sm">⚠️</span>
              <span>{currentLesson.pitfall.title || 'ハン検5級 頻出トラップ'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF0EC] border-l-4 border-[#B84E34] text-stone-800 text-xs sm:text-sm leading-relaxed">
              {currentLesson.pitfall.content}
            </div>
          </section>
        )}

        {/* ⑥ 直結特訓ドリル開始ボタン */}
        <div className="pt-2 border-t border-[#EAE4DA]">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onStartDrillForLesson?.(currentLesson);
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#B84E34] hover:bg-[#9E3B21] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>第{currentLesson.number}課の即答ドリルを解く</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </article>

      {/* 前後ナビゲーション */}
      <div className="flex items-center justify-between gap-2 px-1">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => handleSelectLesson(prevLesson.id)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EAE4DA] text-stone-700 hover:text-[#B84E34] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>第{prevLesson.number}課</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onBackToHome?.();
          }}
          className="text-xs text-stone-500 hover:text-[#B84E34] font-medium underline cursor-pointer"
        >
          5級ホームに戻る
        </button>

        {nextLesson ? (
          <button
            type="button"
            onClick={() => handleSelectLesson(nextLesson.id)}
            className="px-4 py-2 rounded-xl bg-[#2A2421] text-white hover:bg-stone-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <span>第{nextLesson.number}課へ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
