import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  X,
  Type,
  Volume2,
  Zap,
  CheckCircle2,
  List,
  Sparkles,
} from 'lucide-react';
import { LessonData } from '../../types';
import { LESSONS_DATA } from '../../data/lessons';
import {
  HANKEN_GRADES,
  HankenGradeId,
  getHankenGradeConfig,
  getLessonsForGrade,
} from '../../data/hankenConfig';
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
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
    }
  }, [initialLessonId]);

  // 5級〜3級（1〜35課）に対象を限定
  const hankenLessons = useMemo(() => {
    return LESSONS_DATA.filter((l) => l.number <= 35);
  }, []);

  const currentLessonIndex = useMemo(() => {
    const idx = hankenLessons.findIndex((l) => l.id === selectedLessonId);
    return idx >= 0 ? idx : 0;
  }, [selectedLessonId, hankenLessons]);

  const currentLesson = hankenLessons[currentLessonIndex] || hankenLessons[0];

  // 所属するハン検の級を特定
  const currentGrade = useMemo(() => {
    return (
      HANKEN_GRADES.find(
        (g) => currentLesson.number >= g.lessonStart && currentLesson.number <= g.lessonEnd
      ) || HANKEN_GRADES[0]
    );
  }, [currentLesson.number]);

  const prevLesson = currentLessonIndex > 0 ? hankenLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < hankenLessons.length - 1 ? hankenLessons[currentLessonIndex + 1] : null;

  const handleSelectLesson = (lessonId: string) => {
    sound.playTap();
    setSelectedLessonId(lessonId);
    setIsTocOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
    onSelectLesson?.(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5級〜3級範囲の高速全文検索
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return hankenLessons.filter((l) => {
      return (
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.concept?.description?.toLowerCase().includes(q) ||
        l.examples.some((ex) => ex.ko.toLowerCase().includes(q) || ex.ja.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, hankenLessons]);

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. ハン検特化 スマートサブヘッダー (級・目次・検索)                   */}
      {/* ===================================================================== */}
      <header className="sticky top-13 sm:top-14 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE8E3] px-3 sm:px-4 py-2 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* 目次ドロワーを開くトリガー */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setIsTocOpen(!isTocOpen);
            }}
            className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-[#18181B] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
              {currentLesson.number}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-stone-600 block leading-none font-medium">
                {currentGrade.name} 範囲
              </span>
              <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors truncate block mt-0.5">
                {currentLesson.title.replace(/^第\d+課：/, '')}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 group-hover:text-stone-800 shrink-0 transition-transform ${
                isTocOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* ツール群: 文字サイズ切替 & 全文検索 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setIsLargeFont(!isLargeFont);
              }}
              className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                isLargeFont
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-[#EAE8E3] hover:bg-stone-50'
              }`}
              title="文字サイズ切替"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">{isLargeFont ? '大' : '標準'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setIsSearchOpen(!isSearchOpen);
              }}
              className={`p-1.5 rounded-xl border text-stone-600 hover:text-stone-900 transition-colors cursor-pointer ${
                isSearchOpen ? 'bg-stone-100 border-stone-300' : 'bg-white border-[#EAE8E3] hover:bg-stone-50'
              }`}
              title="要点を検索"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 検索入力バー (開いている時) */}
        {isSearchOpen && (
          <div className="mt-2 pt-2 border-t border-stone-200/80 relative animate-fadeIn">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ハン検5級・4級・3級の文法・単語・例文を検索..."
              className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-white border border-[#EAE8E3] text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 translate-y-[-1px] pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 translate-y-[-1px] text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* 検索結果 */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#EAE8E3] rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-stone-100 z-40">
                {searchResults.length > 0 ? (
                  searchResults.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleSelectLesson(l.id)}
                      className="w-full text-left p-2.5 hover:bg-stone-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded font-mono">
                          NO.{l.number}
                        </span>
                        <span className="text-xs font-bold text-stone-900 truncate">{l.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">{l.subtitle}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-stone-400">
                    一致するレッスンが見つかりませんでした
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* 2. 級別目次ドロワー (5級・4級・3級)                                    */}
      {/* ===================================================================== */}
      {isTocOpen && (
        <div className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#EAE8E3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-stone-700" />
                <h3 className="text-sm font-bold text-stone-900">ハン検 出題カリキュラム目次</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTocOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {HANKEN_GRADES.map((g) => {
                const gradeLessons = hankenLessons.filter(
                  (l) => l.number >= g.lessonStart && l.number <= g.lessonEnd
                );

                return (
                  <div key={g.id} className="space-y-1.5">
                    <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                      <span className="text-xs font-bold text-stone-900">
                        {g.name}
                      </span>
                      <span className="text-[10px] text-stone-600 font-mono">
                        第{g.lessonStart}〜{g.lessonEnd}課
                      </span>
                    </div>

                    <div className="space-y-1 pl-1">
                      {gradeLessons.map((l) => {
                        const isCurrent = l.id === selectedLessonId;
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => handleSelectLesson(l.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-[#18181B] text-white font-bold shadow-2xs'
                                : 'text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <span className="truncate flex-1">
                              第{l.number}課 {l.title.replace(/^第\d+課：/, '')}
                            </span>
                            {isCurrent && <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. 本文エリア (Notion風 コールアウト・公式表・落とし穴)               */}
      {/* ===================================================================== */}
      <main ref={contentRef} className="px-3 sm:px-4 pt-4 space-y-5">
        <article className="bg-white border border-[#E8E6DF] rounded-3xl p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          {/* ヘッダー */}
          <div className="border-b border-stone-100 pb-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentGrade.badgeColor}`}>
                {currentGrade.name} 範囲
              </span>
              <span className="text-[10px] font-bold text-stone-600 font-mono">
                LESSON {currentLesson.number} / 35
              </span>
            </div>

            <h1
              className={`font-bold text-stone-900 pt-1 leading-snug tracking-tight ${
                isLargeFont ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
              }`}
            >
              {currentLesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed">
              {currentLesson.subtitle}
            </p>
          </div>

          {/* ① コア仕組み */}
          {currentLesson.concept && (
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <span className="text-sm">💡</span>
                <span>出題のコア仕組みとポイント</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border-l-4 border-amber-400 text-stone-700 leading-relaxed font-normal text-xs sm:text-sm shadow-2xs">
                {currentLesson.concept.description}
              </div>
            </section>
          )}

          {/* ② 公式・ルール表 */}
          {currentLesson.rules && currentLesson.rules.items && (
            <section className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <span className="text-sm">📐</span>
                <span>{currentLesson.rules.title || '公式・文法ルール表'}</span>
              </div>
              <div className="space-y-2">
                {currentLesson.rules.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#F8F9FA] border-l-4 border-blue-400 text-xs sm:text-sm space-y-1 shadow-2xs"
                  >
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{item.label}</span>
                    </div>
                    <div className="text-stone-600 leading-relaxed whitespace-pre-wrap font-normal text-xs pt-0.5">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ③ 音声付き実戦例文 */}
          {currentLesson.examples && currentLesson.examples.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <span className="text-sm">🗣️</span>
                <span>実戦例文（タップで韓国語音声を再生）</span>
              </div>
              <div className="space-y-2">
                {currentLesson.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      sound.playTap();
                      speechService.speak(ex.ko);
                    }}
                    className="p-3.5 rounded-2xl bg-[#FAF9F5] hover:bg-emerald-50/50 border border-[#EAE8E3] hover:border-emerald-300 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-bold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
                        {ex.ko}
                      </div>
                      {ex.reading && (
                        <div className="text-[11px] text-stone-600 font-mono">
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
                      className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-colors shrink-0 cursor-pointer shadow-2xs"
                      title="音声を再生"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ④ 落とし穴・注意点 */}
          {currentLesson.pitfall && (
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <span className="text-sm">⚠️</span>
                <span>{currentLesson.pitfall.title || '試験の注意点・日本人がハマる落とし穴'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FDF6F0] border-l-4 border-rose-400 text-stone-800 text-xs sm:text-sm leading-relaxed font-normal shadow-2xs">
                {currentLesson.pitfall.content}
              </div>
            </section>
          )}

          {/* ⑤ その場で解く特訓問題への誘導バナー */}
          <div className="pt-2 border-t border-stone-100">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#18181B] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-center sm:justify-start">
                  <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  第{currentLesson.number}課の即答ドリル
                </span>
                <p className="text-xs text-stone-300 font-normal">
                  読んだ知識を30秒の四択ドリルで即座に定着させましょう
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onStartDrillForLesson?.(currentLesson);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <span>理解度チェック特訓を解く</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>

        {/* 前後ナビゲーション */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {prevLesson ? (
            <button
              type="button"
              onClick={() => handleSelectLesson(prevLesson.id)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#EAE8E3] text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>第{prevLesson.number}課へ</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setIsTocOpen(true)}
            className="text-xs text-stone-600 hover:text-stone-900 font-medium underline cursor-pointer"
          >
            目次を開く
          </button>

          {nextLesson ? (
            <button
              type="button"
              onClick={() => handleSelectLesson(nextLesson.id)}
              className="px-4 py-2 rounded-xl bg-[#18181B] text-white hover:bg-[#27272A] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <span>第{nextLesson.number}課へ進む</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
};

export default HankenTextbookView;
