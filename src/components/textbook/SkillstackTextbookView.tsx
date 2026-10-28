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
} from 'lucide-react';
import { LessonData } from '../../types';
import { LESSONS_DATA } from '../../data/lessons';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface SkillstackTextbookViewProps {
  initialLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  onStartDrillForLesson?: (lesson: LessonData) => void;
  onBackToHome?: () => void;
}

// 5大章の定義
export const TEXTBOOK_CHAPTERS = [
  {
    id: 'chapter-1',
    number: 1,
    title: '入門・ハングルと基本助詞の土台',
    range: '1-10課',
    lessonStart: 1,
    lessonEnd: 10,
    badge: '入門・基礎',
  },
  {
    id: 'chapter-2',
    number: 2,
    title: '初級前半・日常表現の拡大と重要活用',
    range: '11-20課',
    lessonStart: 11,
    lessonEnd: 20,
    badge: '初級前半',
  },
  {
    id: 'chapter-3',
    number: 3,
    title: '初級後半・複文応用と間接話法',
    range: '21-30課',
    lessonStart: 21,
    lessonEnd: 30,
    badge: '初級総決算',
  },
  {
    id: 'chapter-4',
    number: 4,
    title: '中級・実戦会話と使役受身・絶対敬語',
    range: '31-35課',
    lessonStart: 31,
    lessonEnd: 35,
    badge: '中級完成',
  },
  {
    id: 'chapter-5',
    number: 5,
    title: '上級・推量配慮・口語感情・高級論述',
    range: '36-40課',
    lessonStart: 36,
    lessonEnd: 40,
    badge: '上級突破',
  },
];

export const SkillstackTextbookView: React.FC<SkillstackTextbookViewProps> = ({
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

  const currentLessonIndex = useMemo(() => {
    const idx = LESSONS_DATA.findIndex((l) => l.id === selectedLessonId);
    return idx >= 0 ? idx : 0;
  }, [selectedLessonId]);

  const currentLesson = LESSONS_DATA[currentLessonIndex] || LESSONS_DATA[0];

  const currentChapter = useMemo(() => {
    return (
      TEXTBOOK_CHAPTERS.find(
        (ch) =>
          currentLesson.number >= ch.lessonStart && currentLesson.number <= ch.lessonEnd
      ) || TEXTBOOK_CHAPTERS[0]
    );
  }, [currentLesson.number]);

  const prevLesson = currentLessonIndex > 0 ? LESSONS_DATA[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < LESSONS_DATA.length - 1 ? LESSONS_DATA[currentLessonIndex + 1] : null;

  const handleSelectLesson = (lessonId: string) => {
    sound.playTap();
    setSelectedLessonId(lessonId);
    setIsTocOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
    onSelectLesson?.(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 全40課からの高速全文検索
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return LESSONS_DATA.filter((l) => {
      return (
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.concept?.description?.toLowerCase().includes(q) ||
        l.examples.some((ex) => ex.ko.toLowerCase().includes(q) || ex.ja.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-24 sm:pb-16 select-none animate-fadeIn">
      {/* ===================================================================== */}
      {/* 1. SkillStack風 スマートヘッダー (目次・文字サイズ・検索)            */}
      {/* ===================================================================== */}
      <header className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-5 py-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* 目次ドロワーを開くトリガー */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setIsTocOpen(!isTocOpen);
            }}
            className="flex items-center gap-1.5 min-w-0 flex-1 text-left cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
              {currentLesson.number}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-600 block leading-none font-medium">
                {currentChapter.badge}
              </span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate block">
                {currentLesson.title.replace(/^第\d+課：/, '')}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 group-hover:text-slate-800 shrink-0 transition-transform ${
                isTocOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* ツール群: 文字サイズ切替 & 全文検索 */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setIsLargeFont(!isLargeFont);
              }}
              className={`px-2 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                isLargeFont
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
              className={`p-1.5 rounded-xl border text-slate-600 hover:text-slate-900 transition-colors cursor-pointer ${
                isSearchOpen ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
              title="教科書を検索"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 検索入力バー (開いている時) */}
        {isSearchOpen && (
          <div className="mt-2 pt-2 border-t border-slate-100 relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="文法・例文・キーワードを検索..."
              className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 translate-y-[-1px] pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 translate-y-[-1px] text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* 検索結果ドロップダウン */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100 z-40">
                {searchResults.length > 0 ? (
                  searchResults.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleSelectLesson(l.id)}
                      className="w-full text-left p-2.5 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                          NO.{l.number}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">{l.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{l.subtitle}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400">
                    一致するレッスンが見つかりませんでした
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* 2. 目次ドロワー (SkillStack TextbookTableOfContents 準拠)            */}
      {/* ===================================================================== */}
      {isTocOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">教科書 目次（全40課）</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTocOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {TEXTBOOK_CHAPTERS.map((ch) => {
                const chapterLessons = LESSONS_DATA.filter(
                  (l) => l.number >= ch.lessonStart && l.number <= ch.lessonEnd
                );

                return (
                  <div key={ch.id} className="space-y-1.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">
                        第{ch.number}章：{ch.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{ch.range}</span>
                    </div>

                    <div className="space-y-1 pl-1">
                      {chapterLessons.map((l) => {
                        const isCurrent = l.id === selectedLessonId;
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => handleSelectLesson(l.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-slate-900 text-white font-bold'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate flex-1">
                              第{l.number}課 {l.subtitle}
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
      {/* 3. 教科書 本文エリア (SkillStack TextbookSectionContent 準拠)        */}
      {/* ===================================================================== */}
      <main ref={contentRef} className="px-3 sm:px-6 pt-4 space-y-5">
        {/* レッスン表紙カード */}
        <article className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
          {/* 章・課ヘッダー */}
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                第{currentChapter.number}章 {currentChapter.badge}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                LESSON {currentLesson.number} / 40
              </span>
            </div>

            <h1
              className={`font-bold text-slate-900 pt-1 leading-snug ${
                isLargeFont ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
              }`}
            >
              {currentLesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              {currentLesson.subtitle}
            </p>
          </div>

          {/* ① コア概念・仕組み */}
          {currentLesson.concept && (
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-[10px]">
                  💡
                </span>
                <span>仕組みとコアの考え方</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 leading-relaxed font-normal text-xs sm:text-sm">
                {currentLesson.concept.description}
              </div>
            </section>
          )}

          {/* ② 公式・ルール表 */}
          {currentLesson.rules && currentLesson.rules.items && (
            <section className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-[10px]">
                  📐
                </span>
                <span>{currentLesson.rules.title || '公式・文法ルール表'}</span>
              </div>
              <div className="space-y-2">
                {currentLesson.rules.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm space-y-1 shadow-2xs"
                  >
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap pl-3 font-normal text-xs">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ③ 実戦例文 (ネイティブ音声つき) */}
          {currentLesson.examples && currentLesson.examples.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-[10px]">
                  🗣️
                </span>
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
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                        {ex.ko}
                      </div>
                      {ex.reading && (
                        <div className="text-[11px] text-slate-400 font-mono">
                          {ex.reading}
                        </div>
                      )}
                      <div className="text-xs text-slate-600 font-normal pt-0.5">
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
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-colors shrink-0 cursor-pointer"
                      title="音声を再生"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ④ 日本人がハマる落とし穴・注意点 */}
          {currentLesson.pitfall && (
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center text-[10px]">
                  ⚠️
                </span>
                <span>{currentLesson.pitfall.title || '試験の注意点・日本人がハマる落とし穴'}</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 text-rose-950 text-xs sm:text-sm leading-relaxed font-normal">
                {currentLesson.pitfall.content}
              </div>
            </section>
          )}

          {/* ⑤ その場で解く特訓問題への誘導バナー */}
          <div className="pt-2 border-t border-slate-100">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-center sm:justify-start">
                  <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  第{currentLesson.number}課のアウトプット
                </span>
                <p className="text-xs text-slate-300 font-normal">
                  読んだ知識を30秒の即答ドリルですぐに定着させましょう
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onStartDrillForLesson?.(currentLesson);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <span>理解度チェック特訓を解く</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>

        {/* 4. 前後ナビゲーション */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {prevLesson ? (
            <button
              type="button"
              onClick={() => handleSelectLesson(prevLesson.id)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
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
            className="text-xs text-slate-500 hover:text-slate-900 font-medium underline cursor-pointer"
          >
            目次を開く
          </button>

          {nextLesson ? (
            <button
              type="button"
              onClick={() => handleSelectLesson(nextLesson.id)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
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
