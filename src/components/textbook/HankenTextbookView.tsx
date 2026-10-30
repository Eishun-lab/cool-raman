import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Volume2,
  Zap,
  CheckCircle2,
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

/**
 * ルール本文の洗練レンダラー
 * 活用変化（➔）をタップ可能な発音チップに変換し、箇条書きや注意メモを構造化
 */
const RuleContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

  // ペア分割ヘルパー
  const parseConjugationPair = (str: string) => {
    const parts = str.split(/[➔\->]/);
    if (parts.length < 2) return null;
    const from = parts[0].trim();
    const rightFull = parts.slice(1).join('➔').trim();
    const match = rightFull.match(/^([가-힣\s\+\=\-\.A-Za-z0-9]+?)(?:[（\(](.*)[）\)])?$/);
    if (match) {
      return {
        from,
        to: match[1].trim(),
        note: match[2]?.trim() || '',
      };
    }
    return { from, to: rightFull, note: '' };
  };

  return (
    <div className="space-y-2.5 text-xs leading-relaxed">
      {lines.map((line, lIdx) => {
        // 1. 注意書き・例外・会話メモ（【...】や★）
        if (line.startsWith('【') || line.startsWith('★')) {
          const isBracket = line.startsWith('【');
          const bracketEnd = line.indexOf('】');
          const tag = isBracket && bracketEnd > 0 ? line.slice(0, bracketEnd + 1) : '重要ポイント';
          const body = isBracket && bracketEnd > 0 ? line.slice(bracketEnd + 1).trim() : line;

          return (
            <div
              key={lIdx}
              className="p-3.5 rounded-2xl bg-[#FAF0EC]/80 border border-[#F0D5CD] text-stone-800 space-y-1.5"
            >
              <div className="font-bold text-[#B84E34] text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
                <span>{tag}</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-normal text-xs sm:text-[13px]">
                {body}
              </p>
            </div>
          );
        }

        // 2. 活用変化行（➔ または -> を含む）
        if (line.includes('➔') || line.includes('->')) {
          let prefix = '';
          let body = line;
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0 && colonIdx < 35) {
            prefix = line.slice(0, colonIdx).replace(/^[・\s]+/, '').trim();
            body = line.slice(colonIdx + 1).trim();
          }

          // ペア群を分割（スラッシュ、カンマ、読点）
          const rawPairs = body.split(/[\/,、]/).map((p) => p.trim()).filter(Boolean);
          const pairs = rawPairs
            .map((p) => parseConjugationPair(p))
            .filter((p): p is { from: string; to: string; note: string } => p !== null);

          if (pairs.length > 0) {
            return (
              <div key={lIdx} className="space-y-2 pt-1">
                {prefix && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF0EC] text-[#B84E34] font-bold text-[11px] border border-[#F0D5CD]">
                    <span>{prefix}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pairs.map((pair, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => {
                        sound.playTap();
                        speechService.speak(pair.to);
                      }}
                      className="p-2.5 sm:p-3 rounded-2xl bg-white border border-[#EAE4DA] hover:border-[#B84E34]/50 hover:bg-[#FAF0EC]/30 transition-all flex items-center justify-between gap-2 shadow-2xs group cursor-pointer active:scale-[0.99]"
                      title="タップで発音を聴く"
                    >
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="font-serif-kr text-stone-600 text-xs sm:text-sm">
                          {pair.from}
                        </span>
                        <span className="text-[#B84E34] text-xs font-bold">➔</span>
                        <span className="font-serif-kr font-bold text-[#2A2421] group-hover:text-[#B84E34] text-xs sm:text-sm">
                          {pair.to}
                        </span>
                        {pair.note && (
                          <span className="text-[11px] text-stone-500 font-sans">
                            （{pair.note}）
                          </span>
                        )}
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#B84E34] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        }

        // 3. 箇条書き（・で始まり、コロン:がある）
        if (line.startsWith('・') && line.includes(':')) {
          const colonIdx = line.indexOf(':');
          const bulletTitle = line.slice(1, colonIdx).trim();
          const bulletRest = line.slice(colonIdx + 1).trim();

          return (
            <div
              key={lIdx}
              className="p-3 rounded-2xl bg-white border border-[#EAE4DA] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FAF0EC] text-[#B84E34] font-bold text-[11px] border border-[#F0D5CD] shrink-0 self-start sm:self-center">
                {bulletTitle}
              </span>
              <span className="text-stone-800 text-xs sm:text-[13px] leading-relaxed font-normal">
                {bulletRest}
              </span>
            </div>
          );
        }

        // 4. 通常の解説テキスト
        return (
          <p
            key={lIdx}
            className="text-stone-700 leading-relaxed font-normal py-0.5 text-xs sm:text-[13px]"
          >
            {line}
          </p>
        );
      })}
    </div>
  );
};

export const HankenTextbookView: React.FC<HankenTextbookViewProps> = ({
  initialLessonId = 'lesson-1',
  onSelectLesson,
  onStartDrillForLesson,
  onBackToHome: _onBackToHome,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(initialLessonId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
    }
  }, [initialLessonId]);

  // 5級〜3級（全35課）に対象を限定
  const allHankenLessons = useMemo(() => {
    return LESSONS_DATA.filter((l) => l.number >= 1 && l.number <= 35);
  }, []);

  const currentLessonIndex = useMemo(() => {
    const idx = allHankenLessons.findIndex((l) => l.id === selectedLessonId);
    return idx >= 0 ? idx : 0;
  }, [selectedLessonId, allHankenLessons]);

  const currentLesson = allHankenLessons[currentLessonIndex] || allHankenLessons[0];
  const prevLesson = currentLessonIndex > 0 ? allHankenLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allHankenLessons.length - 1
      ? allHankenLessons[currentLessonIndex + 1]
      : null;

  // 級の判定
  const gradeLabel = useMemo(() => {
    if (currentLesson.number <= 15) return '5級 必修';
    if (currentLesson.number <= 28) return '4級 必修';
    return '3級 必修';
  }, [currentLesson.number]);

  const handleSelectLesson = (lessonId: string) => {
    sound.playTap();
    setSelectedLessonId(lessonId);
    setIsDrawerOpen(false);
    onSelectLesson?.(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // テキストのフォーマット整形ヘルパー（改行や句点で段落分け）
  const formatConceptText = (text: string) => {
    const sentences = text.split(/(?<=[。！\n])\s*/).filter(Boolean);
    return sentences.map((s, idx) => (
      <p key={idx} className="leading-relaxed">
        {s}
      </p>
    ));
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-16 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. 上部コントロールバー（課の切り替え・目次ドロワー）                  */}
      {/* ===================================================================== */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
            {gradeLabel}
          </span>
          <span className="text-xs font-mono text-stone-500 font-medium">
            第{currentLesson.number}課 / 全35課
          </span>
        </div>

        {/* 課選択ドロップダウンボタン */}
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setIsDrawerOpen(!isDrawerOpen);
          }}
          className="py-1.5 px-3 rounded-xl bg-white border border-[#EAE4DA] text-stone-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:border-[#B84E34]/40"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#B84E34]" />
          <span>目次から選ぶ</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>

      {/* 目次ドロワーモーダル（5級・4級・3級 グループ別） */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-5 space-y-3 max-h-[82vh] flex flex-col shadow-xl border border-[#EAE4DA]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE4DA] pb-2.5">
              <h3 className="font-serif-title font-bold text-base text-[#2A2421]">
                ハン検 出題カリキュラム目次
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                閉じる
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {[
                { title: '5級 入門カリキュラム（第1〜15課）', range: [1, 15] },
                { title: '4級 初級カリキュラム（第16〜28課）', range: [16, 28] },
                { title: '3級 実戦カリキュラム（第29〜35課）', range: [29, 35] },
              ].map((grp) => {
                const lessons = allHankenLessons.filter(
                  (l) => l.number >= grp.range[0] && l.number <= grp.range[1]
                );
                return (
                  <div key={grp.title} className="space-y-1">
                    <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-1 pt-1">
                      {grp.title}
                    </div>
                    {lessons.map((lesson) => {
                      const isSelected = lesson.id === currentLesson.id;
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => handleSelectLesson(lesson.id)}
                          className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-[#FAF0EC] text-[#B84E34] font-bold border border-[#F0D5CD]'
                              : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-xs text-stone-400 font-bold shrink-0">
                              {String(lesson.number).padStart(2, '0')}
                            </span>
                            <span className="text-xs truncate">
                              {lesson.title.replace(/^第\d+課：/, '')}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#B84E34] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. 教科書本文カード（韓紙の温もりと大人の洗練された書籍デザイン）        */}
      {/* ===================================================================== */}
      <article className="bg-white border border-[#EAE4DA] rounded-2xl p-5 sm:p-7 shadow-[0_2px_14px_rgba(42,36,33,0.03)] space-y-6">
        {/* レッスン表題 */}
        <div className="space-y-1.5 border-b border-[#EAE4DA]/70 pb-4">
          <div className="text-[11px] font-mono tracking-widest text-[#B84E34] uppercase font-bold">
            LESSON {String(currentLesson.number).padStart(2, '0')}
          </div>
          <h1 className="font-serif-title text-xl sm:text-2xl font-bold text-[#2A2421] tracking-tight leading-snug">
            {currentLesson.title.replace(/^第\d+課：/, '')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-normal pt-0.5">
            {currentLesson.subtitle}
          </p>
        </div>

        {/* ① 出題のコア仕組み（核心ルール） */}
        {currentLesson.concept && (
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
              <h2 className="font-serif-title text-xs sm:text-sm font-bold text-[#2A2421] tracking-wide">
                出題のコア仕組み（核心ルール）
              </h2>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-l-2 border-l-[#B84E34] border border-[#EAE4DA] text-[#2A2421] text-xs sm:text-[13px] leading-relaxed space-y-2 font-normal">
              {formatConceptText(currentLesson.concept.description)}
            </div>
          </section>
        )}

        {/* ② 公式・ルール整理表 */}
        {currentLesson.rules && currentLesson.rules.items && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
              <h2 className="font-serif-title text-xs sm:text-sm font-bold text-[#2A2421] tracking-wide">
                {currentLesson.rules.title || '公式ルール＆活用早見表'}
              </h2>
            </div>

            {/* テーブルデータが存在する場合の表レンダリング */}
            {currentLesson.rules.table && (
              <div className="overflow-x-auto rounded-2xl border border-[#EAE4DA] shadow-2xs bg-white">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF0EC] border-b border-[#F0D5CD] text-[#B84E34]">
                      {currentLesson.rules.table.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-3 font-bold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentLesson.rules.table.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b border-[#EAE4DA]/50 last:border-b-0 hover:bg-[#FAF7F2] transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="py-2.5 px-3 text-stone-800 font-serif-kr whitespace-nowrap text-xs"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 各ルールの構造化カード */}
            <div className="space-y-3">
              {currentLesson.rules.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DA] text-xs space-y-2.5 shadow-2xs"
                >
                  <div className="font-serif-title font-bold text-[#2A2421] text-xs sm:text-sm flex items-center gap-2 border-b border-[#EAE4DA]/60 pb-2">
                    <span className="text-[#B84E34] font-mono text-sm">•</span>
                    <span>{item.label}</span>
                  </div>
                  <RuleContentRenderer content={item.content} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ③ 必須単語リスト（タップでネイティブ発音） */}
        {currentLesson.vocabList && currentLesson.vocabList.length > 0 && (
          <section className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
                <h2 className="font-serif-title text-xs sm:text-sm font-bold text-[#2A2421] tracking-wide">
                  {gradeLabel.replace(' 必修', '')} 必須単語
                </h2>
              </div>
              <span className="text-[10px] text-stone-400 font-medium">タップで発音再生</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentLesson.vocabList.map((v, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playTap();
                    speechService.speak(v.ko);
                  }}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0EC] border border-[#EAE4DA] hover:border-[#F0D5CD] transition-all cursor-pointer flex items-center justify-between gap-1.5 group active:scale-[0.98]"
                >
                  <div className="min-w-0">
                    <div className="font-serif-kr font-bold text-sm text-[#2A2421] group-hover:text-[#B84E34] transition-colors truncate">
                      {v.ko}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate font-mono pt-0.5">
                      {v.reading}
                    </div>
                    <div className="text-[11px] text-stone-700 font-medium truncate pt-0.5">
                      {v.ja}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                      speechService.speak(v.ko);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-[#EAE4DA] text-stone-400 group-hover:text-[#B84E34] shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ④ 実戦例文（タップで韓国語音声） */}
        {currentLesson.examples && currentLesson.examples.length > 0 && (
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
              <h2 className="font-serif-title text-xs sm:text-sm font-bold text-[#2A2421] tracking-wide">
                実戦例文（ネイティブ音声付き）
              </h2>
            </div>
            <div className="space-y-2">
              {currentLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playTap();
                    speechService.speak(ex.ko);
                  }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0EC]/60 border border-[#EAE4DA] hover:border-[#F0D5CD] transition-all cursor-pointer group flex items-start justify-between gap-3 active:scale-[0.99]"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="font-serif-kr font-bold text-sm sm:text-base text-[#2A2421] group-hover:text-[#B84E34] transition-colors leading-relaxed">
                      {ex.ko}
                    </div>
                    {ex.reading && (
                      <div className="text-[11px] text-stone-500 font-mono">
                        {ex.reading}
                      </div>
                    )}
                    <div className="text-xs text-stone-700 font-normal pt-0.5 leading-relaxed">
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
                    className="p-2 rounded-xl bg-white border border-[#EAE4DA] text-stone-400 group-hover:text-[#B84E34] shrink-0 shadow-2xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ⑤ 誤答を防ぐ核心の眼（品格ある注意書き） */}
        {currentLesson.pitfall && (
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
              <h2 className="font-serif-title text-xs sm:text-sm font-bold text-[#2A2421] tracking-wide">
                {currentLesson.pitfall.title || '誤答を防ぐ核心の眼'}
              </h2>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF0EC] border border-[#F0D5CD] text-stone-800 text-xs sm:text-[13px] leading-relaxed font-normal">
              {currentLesson.pitfall.content}
            </div>
          </section>
        )}

        {/* ⑥ 直結実践演習ボタン（Quiet Luxury 墨黒ボタン） */}
        <div className="pt-2 border-t border-[#EAE4DA]/70">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onStartDrillForLesson?.(currentLesson);
            }}
            className="w-full py-4 px-6 rounded-xl bg-[#1F1A17] hover:bg-[#342D28] text-[#FAF7F2] font-serif-title text-sm tracking-wide shadow-[0_4px_14px_rgba(31,26,23,0.12)] transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99] group"
          >
            <span>第{currentLesson.number}課の実践演習に進む</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
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
            setIsDrawerOpen(true);
          }}
          className="text-xs text-stone-500 hover:text-[#B84E34] font-medium underline cursor-pointer"
        >
          目次を開く
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
