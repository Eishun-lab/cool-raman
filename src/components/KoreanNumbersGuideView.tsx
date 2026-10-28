import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Volume2,
  Clock,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Hash,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  SINO_NUMBERS,
  SINO_SITUATIONS,
  SINO_EXAMPLES,
  NATIVE_NUMBERS,
  NATIVE_COUNTERS,
  NATIVE_EXAMPLES,
  CLOCK_PATTERNS,
  TIME_COMPARISONS,
  DAY_PERIODS,
  WEEKDAYS,
  TIME_ADVERBS,
  NATIVE_DAYS,
  PITFALLS,
  PRACTICAL_PHRASES,
  NUMBER_CHAPTERS,
} from '../data/koreanNumbersGuideData';
import { speechService } from '../utils/speech';
import { sound } from '../utils/audioSynth';

interface KoreanNumbersGuideViewProps {
  showPronunciation: boolean;
  isLargeFont?: boolean;
}

export const KoreanNumbersGuideView: React.FC<KoreanNumbersGuideViewProps> = ({
  showPronunciation,
  isLargeFont = false,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<string>('ch1');
  const [searchQuery, setSearchQuery] = useState('');
  const [openSectionMap, setOpenSectionMap] = useState<Record<string, boolean>>({
    'ch1-nums': true,
    'ch1-situations': true,
    'ch1-examples': true,
    'ch2-nums': true,
    'ch2-rules': true,
    'ch2-counters': true,
    'ch2-examples': true,
    'ch3-clock': true,
    'ch3-compare': true,
    'ch3-periods': true,
    'ch4-weekdays': true,
    'ch4-adverbs': true,
    'ch4-days': true,
    'ch5-traps': true,
    'ch6-phrases': true,
  });

  const toggleSection = (key: string) => {
    setOpenSectionMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    sound.playTap();
    // 不要な記号や矢印を取り除いて発音
    const cleanText = text
      .replace(/➔.*$/, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/❌|⭕/g, '')
      .trim();
    if (cleanText) {
      speechService.speak(cleanText);
    }
  };

  // 検索クエリによるフィルタリング（小文字マッチング）
  const q = searchQuery.trim().toLowerCase();

  const filteredSinoNumbers = useMemo(() => {
    if (!q) return SINO_NUMBERS;
    return SINO_NUMBERS.filter(
      (n) =>
        n.num.includes(q) ||
        n.hangul.toLowerCase().includes(q) ||
        n.pronunciation.includes(q) ||
        n.tip.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredSinoSituations = useMemo(() => {
    if (!q) return SINO_SITUATIONS;
    return SINO_SITUATIONS.filter(
      (s) =>
        s.category.includes(q) ||
        s.unit.includes(q) ||
        s.exampleKo.toLowerCase().includes(q) ||
        s.pronunciation.includes(q) ||
        s.meaning.includes(q) ||
        s.tip.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredSinoExamples = useMemo(() => {
    if (!q) return SINO_EXAMPLES;
    return SINO_EXAMPLES.filter(
      (e) =>
        e.sentenceKo.toLowerCase().includes(q) ||
        e.pronunciation.includes(q) ||
        e.translationJa.includes(q) ||
        e.explanation.includes(q)
    );
  }, [q]);

  const filteredNativeNumbers = useMemo(() => {
    if (!q) return NATIVE_NUMBERS;
    return NATIVE_NUMBERS.filter(
      (n) =>
        n.num.includes(q) ||
        n.hangul.toLowerCase().includes(q) ||
        n.pronunciation.includes(q) ||
        (n.formBeforeCounter && n.formBeforeCounter.includes(q)) ||
        n.tip.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredNativeCounters = useMemo(() => {
    if (!q) return NATIVE_COUNTERS;
    return NATIVE_COUNTERS.filter(
      (c) =>
        c.unitJa.includes(q) ||
        c.hangul.toLowerCase().includes(q) ||
        c.pronunciation.includes(q) ||
        c.examples.some((ex) => ex.ko.includes(q) || ex.reading.includes(q)) ||
        c.tip.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredNativeExamples = useMemo(() => {
    if (!q) return NATIVE_EXAMPLES;
    return NATIVE_EXAMPLES.filter(
      (e) =>
        e.sentenceKo.toLowerCase().includes(q) ||
        e.pronunciation.includes(q) ||
        e.translationJa.includes(q) ||
        e.explanation.includes(q)
    );
  }, [q]);

  const filteredClockPatterns = useMemo(() => {
    if (!q) return CLOCK_PATTERNS;
    return CLOCK_PATTERNS.filter(
      (c) =>
        c.timeStr.includes(q) ||
        c.hangul.toLowerCase().includes(q) ||
        c.pronunciation.includes(q) ||
        c.note.includes(q)
    );
  }, [q]);

  const filteredWeekdays = useMemo(() => {
    if (!q) return WEEKDAYS;
    return WEEKDAYS.filter(
      (w) =>
        w.dayJa.includes(q) ||
        w.hangul.toLowerCase().includes(q) ||
        w.pronunciation.includes(q) ||
        w.tip.includes(q)
    );
  }, [q]);

  const filteredNativeDays = useMemo(() => {
    if (!q) return NATIVE_DAYS;
    return NATIVE_DAYS.filter(
      (d) =>
        d.days.includes(q) ||
        d.hangul.toLowerCase().includes(q) ||
        d.pronunciation.includes(q) ||
        d.tip.includes(q)
    );
  }, [q]);

  const filteredPitfalls = useMemo(() => {
    if (!q) return PITFALLS;
    return PITFALLS.filter(
      (p) =>
        p.title.includes(q) ||
        p.summary.includes(q) ||
        p.keyPoint.includes(q) ||
        p.details.some((d) =>
          d.items.some(
            (it) =>
              it.label.includes(q) ||
              it.hangul.toLowerCase().includes(q) ||
              it.meaning.includes(q)
          )
        )
    );
  }, [q]);

  const filteredPhrases = useMemo(() => {
    if (!q) return PRACTICAL_PHRASES;
    return PRACTICAL_PHRASES.filter(
      (p) =>
        p.scene.includes(q) ||
        p.subScene.includes(q) ||
        p.sentenceKo.toLowerCase().includes(q) ||
        p.pronunciation.includes(q) ||
        p.translationJa.includes(q) ||
        p.point.includes(q)
    );
  }, [q]);

  // 章の表示判定（検索中はヒットした章をすべて表示）
  const isSearching = !!q;
  const showCh1 = isSearching || selectedChapter === 'all' || selectedChapter === 'ch1';
  const showCh2 = isSearching || selectedChapter === 'all' || selectedChapter === 'ch2';
  const showCh3 = isSearching || selectedChapter === 'all' || selectedChapter === 'ch3';
  const showCh4 = isSearching || selectedChapter === 'all' || selectedChapter === 'ch4';
  const showCh5 = isSearching || selectedChapter === 'all' || selectedChapter === 'ch5';
  const showCh6 = isSearching || selectedChapter === 'all' || selectedChapter === 'ch6';

  return (
    <div className={`space-y-4 ${isLargeFont ? 'text-[15px]' : ''}`}>
      {/* 🧭 マスターガイド トップバナー */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-linear-to-r from-[#F0F9FF] via-[#F8FAFC] to-[#F0F9FF] border border-[#BAE6FD] shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#1CB0F6] text-white">
            <Hash className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[10px] font-bold text-[#1CB0F6] uppercase tracking-wider block">
              初級〜中級準備段階｜保存・印刷用教材
            </span>
            <h2 className="font-sans font-bold font-bold text-base sm:text-lg text-[#0F172A] leading-tight">
              「数字・時刻・日付・助数詞」完全攻略マスター
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#475569] leading-relaxed">
          韓国語には漢字由来の<strong>「漢数詞（일, 이, 삼...）」</strong>と、固有語の<strong>「固有数詞（하나, 둘, 셋...）」</strong>の2系統が存在します。
          単位やシチュエーションごとの使い分け、時計のハイブリッド構造、発音変化（連音化・鼻音化）を完全整理しました。
        </p>
      </div>

      {/* 🔍 検索 ＆ 章切り替えピル */}
      <div className="space-y-2">
        {/* 検索バー */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="数字・ハングル・単位・日本語訳を検索..."
            className="w-full pl-8 pr-7 py-2 rounded-2xl bg-white border-2 border-stone-200 focus:border-[#1CB0F6] focus:outline-none text-xs text-slate-900 font-bold placeholder-stone-400 shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 章切り替えピルバー */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {NUMBER_CHAPTERS.map((chap) => {
            const isCurrent = selectedChapter === chap.id;
            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => setSelectedChapter(chap.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isCurrent
                    ? 'bg-[#1CB0F6] text-white shadow-xs'
                    : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                }`}
              >
                {chap.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          第1章：漢数詞（일, 이, 삼...）完全マスター
      ======================================================== */}
      {showCh1 && (
        <section className="bg-white border-2 border-stone-200/90 rounded-3xl shadow-[0_3px_0_#E5E7EB] overflow-hidden">
          {/* 章見出し */}
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b-2 border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#1CB0F6] text-white text-[11px] font-black shadow-[0_1.5px_0_#1899D6]">
                  第1章
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                  漢数詞（일, 이, 삼...）完全マスター
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#64748B] hidden sm:inline">
                日付・金額・番号・100以上
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              漢字の音（音読み）に対応する数字です。<strong>100以上の大きな数字はすべて漢数詞</strong>のみで表し、日付・金額・電話番号・分・秒などに幅広く使われます。
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {/* 1. 数字一覧表（0〜1億） */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch1-nums')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1CB0F6]" />
                  1. 漢数詞の数字一覧表（0〜1億・組み合わせ例）
                </h4>
                {openSectionMap['ch1-nums'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch1-nums'] && (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSinoNumbers.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border transition-all ${
                          item.highlight
                            ? 'bg-[#F0F9FF]/60 border-[#BAE6FD]'
                            : 'bg-[#F8FAFC]/60 border-[#E2E8F0]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#64748B] min-w-8">
                              {item.num}
                            </span>
                            <span className="font-bold text-sm sm:text-base text-[#0F172A]">
                              {item.hangul}
                            </span>
                            {showPronunciation && (
                              <span className="text-xs text-[#94A3B8] font-mono">
                                [{item.pronunciation}]
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleSpeak(item.hangul, e)}
                            className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                            title="発音を聞く"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-[#475569] mt-1 leading-relaxed">
                          {item.tip}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. 漢数詞を使う単位・シチュエーション一覧 */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch1-situations')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1CB0F6]" />
                  2. 漢数詞を使う単位・シチュエーション一覧
                </h4>
                {openSectionMap['ch1-situations'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch1-situations'] && (
                <div className="space-y-2">
                  {/* 最重要ルール注意バナー */}
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>【最重要ルール】「6月（유월）」と「10月（시월）」のパッチム脱落に絶対注意！</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      1月〜12月は漢数詞＋「월（ウォル）」ですが、発音しにくい<strong>6月（육월 ❌ ➔ 유월 ⭕）</strong>と<strong>10月（십월 ❌ ➔ 시월 ⭕）</strong>は数字側のパッチムが完全に文字から脱落します！
                      （連音化：1月＝일월 [이뤌]、11月＝십일월 [시비뤌]、12月＝십이월 [시비월]）
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {filteredSinoSituations.map((sit) => (
                      <div
                        key={sit.id}
                        className="p-3 rounded-xl bg-[#F8FAFC]/50 border border-[#E2E8F0] space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-[#1CB0F6]">
                              {sit.category}
                            </span>
                            <span className="text-xs text-[#64748B] font-mono">
                              単位: <strong>{sit.unit}</strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleSpeak(sit.exampleKo, e)}
                            className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                            title="発音を聞く"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-2">
                          <div className="font-bold text-sm sm:text-base text-[#0F172A]">
                            {sit.exampleKo}
                          </div>
                          {showPronunciation && (
                            <div className="text-xs text-[#94A3B8] font-mono">
                              [{sit.pronunciation}]
                            </div>
                          )}
                          <div className="text-xs text-[#475569]">
                            = {sit.meaning}
                          </div>
                        </div>

                        <div className="text-[11px] text-[#475569] leading-relaxed pt-0.5">
                          {sit.tip}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. 漢数詞を使った日常ショート例文（5選） */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch1-examples')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1CB0F6]" />
                  3. 漢数詞を使った日常ショート例文（5選）
                </h4>
                {openSectionMap['ch1-examples'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch1-examples'] && (
                <div className="space-y-2">
                  {filteredSinoExamples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1 hover:border-[#1CB0F6]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="font-bold text-sm sm:text-base text-[#0F172A] flex items-center gap-1.5">
                            <span className="text-xs text-[#1CB0F6] font-mono font-bold">
                              {ex.no}.
                            </span>
                            <span>{ex.sentenceKo}</span>
                          </div>
                          {showPronunciation && (
                            <div className="text-xs text-[#94A3B8] font-mono pl-4">
                              {ex.pronunciation}
                            </div>
                          )}
                          <div className="text-xs text-[#1E293B] pl-4">
                            {ex.translationJa}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(ex.sentenceKo, e)}
                          className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer shrink-0"
                          title="発音を聞く"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#64748B] pl-4 pt-0.5">
                        {ex.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          第2章：固有数詞（하나, 둘, 셋...）完全マスター
      ======================================================== */}
      {showCh2 && (
        <section className="bg-white border-2 border-stone-200/90 rounded-3xl shadow-[0_3px_0_#E5E7EB] overflow-hidden">
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b-2 border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#0F172A] text-white text-[11px] font-bold">
                  第2章
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                  固有数詞（하나, 둘, 셋...）完全マスター
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#64748B] hidden sm:inline">
                個数・人数・年齢・助数詞変形
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              日本語の「ひとつ・ふたつ・みっつ…」にあたる韓国固有の数え方です。<strong>1〜99までしか存在せず</strong>（100以上は漢数詞を使用）、後ろに助数詞がついたときの<strong>変形ルール（1・2・3・4・20）</strong>が最大の鍵です。
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {/* 1. 固有数詞の数字一覧表 */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch2-nums')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
                  1. 固有数詞の数字一覧表（1〜10、20〜90）
                </h4>
                {openSectionMap['ch2-nums'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch2-nums'] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredNativeNumbers.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        item.highlight
                          ? 'bg-[#F0F9FF]/60 border-[#BAE6FD]'
                          : 'bg-[#F8FAFC]/60 border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#64748B] min-w-6">
                            {item.num}
                          </span>
                          <span className="font-bold text-sm sm:text-base text-[#0F172A]">
                            {item.hangul}
                          </span>
                          {showPronunciation && (
                            <span className="text-xs text-[#94A3B8] font-mono">
                              [{item.pronunciation}]
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.formBeforeCounter && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#1CB0F6] text-white text-[10px] font-bold">
                              単位前: {item.formBeforeCounter}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleSpeak(item.hangul, e)}
                            className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                            title="発音を聞く"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#475569] mt-1 leading-relaxed">
                        {item.tip}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. 変形ルールハイライト */}
            <div className="p-3 sm:p-4 space-y-2">
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2">
                <div className="font-bold text-xs sm:text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-800" />
                  <span>超重要！助数詞の前で形が変わる「5つの変形ルール（1・2・3・4・20）」</span>
                </div>
                <div className="text-xs leading-relaxed space-y-1">
                  <div className="font-bold text-rose-800">
                    ⚠️ 初級者が必ずやってしまう誤用：「하나 개 ❌」「둘 명 ❌」「스물 살 ❌」
                  </div>
                  <p className="text-[11px] text-amber-900">
                    後ろに単位（助数詞）が来るとパッチムが脱落し連体形に変化します。11（열한）、12（열두）、23（스물세）のように一の位に来る時もすべて変形します！
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-mono pt-1">
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                    <strong className="text-[#1CB0F6]">1 (하나 ➔ 한)</strong>: 한 개 (1個), 열한 개 (11個)
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                    <strong className="text-[#1CB0F6]">2 (둘 ➔ 두)</strong>: 두 명 (2人), 열두 시 (12時)
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                    <strong className="text-[#1CB0F6]">3 (셋 ➔ 세)</strong>: 세 잔 (3杯), 스물세 살 (23歳)
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                    <strong className="text-[#1CB0F6]">4 (넷 ➔ 네)</strong>: 네 장 (4枚), 열네 마리 (14匹)
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200 sm:col-span-2">
                    <strong className="text-[#1CB0F6]">20 (스물 ➔ 스무)</strong>: 스무 살 (20歳) ※21〜29は스물に戻る（21歳＝스물한 살）
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 固有数詞を使う助数詞（全13種） */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch2-counters')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
                  3. 固有数詞を使う助数詞（全13種）
                </h4>
                {openSectionMap['ch2-counters'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch2-counters'] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredNativeCounters.map((cnt) => (
                    <div
                      key={cnt.id}
                      className="p-3 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0] space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-[#1CB0F6]">
                            {cnt.hangul}
                          </span>
                          <span className="text-xs font-bold text-[#0F172A]">
                            （{cnt.unitJa}）
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(cnt.hangul, e)}
                          className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                          title="発音を聞く"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {cnt.examples.map((ex, i) => (
                          <span
                            key={i}
                            onClick={() => handleSpeak(ex.ko)}
                            className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[11px] text-[#1E293B] hover:border-[#1CB0F6] cursor-pointer transition-colors"
                          >
                            {ex.ko} <span className="text-[#94A3B8]">({ex.reading})</span>
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-[#475569] leading-relaxed pt-0.5">
                        {cnt.tip}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. 固有数詞を使った日常ショート例文（5選） */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch2-examples')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
                  4. 固有数詞を使った日常ショート例文（5選）
                </h4>
                {openSectionMap['ch2-examples'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch2-examples'] && (
                <div className="space-y-2">
                  {filteredNativeExamples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1 hover:border-[#1CB0F6]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="font-bold text-sm sm:text-base text-[#0F172A] flex items-center gap-1.5">
                            <span className="text-xs text-[#1CB0F6] font-mono font-bold">
                              {ex.no}.
                            </span>
                            <span>{ex.sentenceKo}</span>
                          </div>
                          {showPronunciation && (
                            <div className="text-xs text-[#94A3B8] font-mono pl-4">
                              {ex.pronunciation}
                            </div>
                          )}
                          <div className="text-xs text-[#1E293B] pl-4">
                            {ex.translationJa}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(ex.sentenceKo, e)}
                          className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer shrink-0"
                          title="発音を聞く"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#64748B] pl-4 pt-0.5">
                        {ex.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          第3章：時刻・時間のハイブリッド攻略
      ======================================================== */}
      {showCh3 && (
        <section className="bg-white border-2 border-stone-200/90 rounded-3xl shadow-[0_3px_0_#E5E7EB] overflow-hidden">
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b-2 border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[11px] font-bold">
                  第3章
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                  時刻・時間のハイブリッド攻略（最頻出！）
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#64748B] hidden sm:inline">
                時は固有数詞・分は漢数詞
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              1つのフレーズの中に<strong>固有数詞と漢数詞が同居するハイブリッド構造</strong>になっています。待ち合わせや予約の会話が一気にスムーズになります。
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {/* 黄金ルールバナー */}
            <div className="p-3 sm:p-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1.5">
                <div className="font-bold text-xs sm:text-sm text-emerald-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>【黄金ルール】「〜時（시）」＝ 固有数詞 × 「〜分（분）」＝ 漢数詞</span>
                </div>
                <div className="text-xs leading-relaxed space-y-0.5">
                  <div>
                    例: <strong>3時30分</strong> ＝ <span className="font-bold text-[#1CB0F6]">세 시</span>（固有）＋ <span className="font-bold text-[#0F172A]">삼십 분</span>（漢数）または <span className="font-bold text-[#0F172A]">세 시 반</span>（半）
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    〜分前（〜분 전）：3時5分前 ＝ 세 시 오 분 전（＝2時55分）
                  </div>
                </div>
              </div>
            </div>

            {/* 1. 時計の実践読み方（12パターン） */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch3-clock')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  1. 時計の実践読み方（12パターン完全網羅）
                </h4>
                {openSectionMap['ch3-clock'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch3-clock'] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredClockPatterns.map((pat) => (
                    <div
                      key={pat.id}
                      className="p-2.5 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0] space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-emerald-800 min-w-16">
                            {pat.timeStr}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-[#0F172A]">
                            {pat.hangul}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(pat.hangul, e)}
                          className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                          title="発音を聞く"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showPronunciation && (
                        <div className="text-[11px] text-[#94A3B8] font-mono pl-1">
                          [{pat.pronunciation}]
                        </div>
                      )}
                      <div className="text-[11px] text-[#475569] pl-1">
                        {pat.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. 「〜時（時刻）」と「〜時間（期間）」の違い */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch3-compare')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  2. 「〜時（時刻）」と「〜時間（期間・長さ）」の決定的な違い
                </h4>
                {openSectionMap['ch3-compare'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch3-compare'] && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {TIME_COMPARISONS.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-2"
                      >
                        <div className="text-xs font-bold text-[#1CB0F6] border-b border-[#E2E8F0] pb-1">
                          {comp.label}
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-[#64748B]">
                            【時刻】{comp.timePoint.ja}
                          </div>
                          <div className="text-xs font-bold text-[#0F172A]">
                            {comp.timePoint.ko}
                          </div>
                          <div className="text-[11px] text-[#475569]">
                            例: {comp.timePoint.exampleKo} ({comp.timePoint.exampleJa})
                          </div>
                        </div>
                        <div className="space-y-1 pt-1 border-t border-dashed border-[#E2E8F0]">
                          <div className="text-[11px] font-bold text-emerald-800">
                            【期間】{comp.duration.ja}
                          </div>
                          <div className="text-xs font-bold text-[#0F172A]">
                            {comp.duration.ko}
                          </div>
                          <div className="text-[11px] text-[#475569]">
                            例: {comp.duration.exampleKo} ({comp.duration.exampleJa})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. 午前・午後・朝・昼・夜 */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch3-periods')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  3. 午前・午後・朝・昼・夜の組み合わせ表現（時間帯 ＋ 時刻）
                </h4>
                {openSectionMap['ch3-periods'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch3-periods'] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DAY_PERIODS.map((period) => (
                    <div
                      key={period.id}
                      className="p-2.5 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-emerald-900">
                            {period.labelJa}
                          </span>
                          <span className="font-bold text-sm text-[#0F172A]">
                            {period.hangul}
                          </span>
                          {showPronunciation && (
                            <span className="text-xs text-[#94A3B8] font-mono">
                              [{period.pronunciation}]
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(period.example, e)}
                          className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                          title="発音を聞く"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs text-[#1E293B] font-medium">
                        {period.example}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {period.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          第4章：日付・曜日・時間軸の表現マスター
      ======================================================== */}
      {showCh4 && (
        <section className="bg-white border-2 border-stone-200/90 rounded-3xl shadow-[0_3px_0_#E5E7EB] overflow-hidden">
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b-2 border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-700 text-white text-[11px] font-bold">
                  第4章
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                  日付・曜日・時間軸の表現マスター
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#64748B] hidden sm:inline">
                カレンダー・過去・現在・未来・固有日数
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              カレンダーやスケジュールに欠かせない「曜日」「時間軸の副詞（昨日・今日・明日〜去年・今年・来年）」「固有の日数の数え方（1日〜10日間）」を整理します。
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {/* 1. 曜日一覧 */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch4-weekdays')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-700" />
                  1. 曜日一覧（月〜日：월화수목금토일）
                </h4>
                {openSectionMap['ch4-weekdays'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch4-weekdays'] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredWeekdays.map((wd) => (
                    <div
                      key={wd.id}
                      className="p-2.5 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-indigo-900">
                            {wd.dayJa}
                          </span>
                          <span className="font-bold text-sm text-[#0F172A]">
                            {wd.hangul}
                          </span>
                          {showPronunciation && (
                            <span className="text-xs text-[#94A3B8] font-mono">
                              [{wd.pronunciation}]
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(wd.hangul, e)}
                          className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                          title="発音を聞く"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#475569]">
                        {wd.tip}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. 時間軸の副詞一覧 */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch4-adverbs')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-700" />
                  2. 時間軸の副詞一覧（日・週・月・年）
                </h4>
                {openSectionMap['ch4-adverbs'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch4-adverbs'] && (
                <div className="space-y-2">
                  <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                          <th className="py-2 px-2.5 font-bold whitespace-nowrap">単位</th>
                          <th className="py-2 px-2.5 font-bold whitespace-nowrap">一昨日 / 先々〜</th>
                          <th className="py-2 px-2.5 font-bold whitespace-nowrap">昨日 / 1つ前</th>
                          <th className="py-2 px-2.5 font-bold whitespace-nowrap">今日 / 今〜</th>
                          <th className="py-2 px-2.5 font-bold whitespace-nowrap">明日・来〜</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {TIME_ADVERBS.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#F8FAFC]/40 transition-colors">
                            <td className="py-2 px-2.5 font-bold text-[#0F172A] bg-[#F8FAFC]/60 whitespace-nowrap">
                              {row.unit}
                            </td>
                            <td className="py-2 px-2.5">
                              <div className="font-bold text-[#0F172A]">{row.twoPast.ko}</div>
                              <div className="text-[10px] text-[#64748B]">{row.twoPast.ja}</div>
                            </td>
                            <td className="py-2 px-2.5">
                              <div className="font-bold text-[#0F172A]">{row.onePast.ko}</div>
                              <div className="text-[10px] text-[#64748B]">{row.onePast.ja}</div>
                            </td>
                            <td className="py-2 px-2.5 bg-[#F0F9FF]/30">
                              <div className="font-bold text-[#1CB0F6]">{row.present.ko}</div>
                              <div className="text-[10px] text-[#64748B]">{row.present.ja}</div>
                            </td>
                            <td className="py-2 px-2.5">
                              <div className="font-bold text-[#0F172A]">{row.future.ko}</div>
                              <div className="text-[10px] text-[#64748B]">{row.future.ja}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 去年・今年の超重要発音ルール */}
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>【発音の超注意点】「去年（작년）」と「今年（올해）」は文字通りに読まない！</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-900">
                      <li>
                        <strong>去年（작년）：</strong>パッチム「ㄱ」の後ろに「ㄴ」が来て鼻音化し、発音は<strong>[장년 チャンニョン]</strong>になります（文字通り「チャクニョン」と読まない）。
                      </li>
                      <li>
                        <strong>今年（올해）：</strong>パッチム「ㄹ」の後ろで「ㅎ」が弱まり連音化するため、「オルヘ」ではなく<strong>「オレ [오래]」</strong>に近い滑らかな音になります。
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 3. 固有の日数表現（1日〜10日） */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div
                onClick={() => toggleSection('ch4-days')}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-700" />
                  3. 期間（日数）の数え方 ― 固有の日数表現（1日〜10日）
                </h4>
                {openSectionMap['ch4-days'] ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>

              {openSectionMap['ch4-days'] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredNativeDays.map((d) => (
                    <div
                      key={d.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        d.warning
                          ? 'bg-[#F0F9FF]/60 border-[#BAE6FD]'
                          : 'bg-[#F8FAFC]/60 border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-indigo-900 min-w-16">
                            {d.days}
                          </span>
                          <span className="font-bold text-sm text-[#0F172A]">
                            {d.hangul}
                          </span>
                          {showPronunciation && (
                            <span className="text-xs text-[#94A3B8] font-mono">
                              [{d.pronunciation}]
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(d.hangul, e)}
                          className="p-1.5 rounded-xl text-[#1CB0F6] bg-sky-50 hover:bg-sky-100 shadow-2xs transition-all cursor-pointer"
                          title="発音を聞く"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#475569] mt-1">
                        {d.tip}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          第5章：日本人が必ず引っかかる「同音・落とし穴（罠）」5選
      ======================================================== */}
      {showCh5 && (
        <section className="bg-white border-2 border-stone-200/90 rounded-3xl shadow-[0_3px_0_#E5E7EB] overflow-hidden">
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b-2 border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-rose-700 text-white text-[11px] font-bold">
                  第5章
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                  日本人が必ず引っかかる「同音・落とし穴（罠）」5選
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#64748B] hidden sm:inline">
                번・몇・분・助詞変化・0の使い分け
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              同じハングル表記でも前に置く数字（漢数詞 vs 固有数詞）によって意味が180度変わる単位や、綴り・発音の落とし穴を厳選解説します。
            </p>
          </div>

          <div className="p-3 sm:p-4 space-y-3">
            {filteredPitfalls.map((pit) => (
              <div
                key={pit.id}
                className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-2 hover:border-rose-300 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] shrink-0 mt-0.5">
                    罠 {pit.trapNo}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#0F172A]">
                      {pit.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {pit.summary}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pl-2 border-l-2 border-rose-200">
                  {pit.details[0].items.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#0F172A]">{item.label}</strong>
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.hangul)}
                          className="p-0.5 text-[#94A3B8] hover:text-[#1CB0F6] transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-[#1CB0F6]">
                        {item.hangul} <span className="text-[#64748B] font-normal font-mono">[{item.pronunciation}]</span>
                      </div>
                      <div className="text-[#475569]">
                        意味: {item.meaning}
                      </div>
                      {item.note && (
                        <div className="text-[10px] text-[#94A3B8]">
                          {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 font-medium">
                  {pit.keyPoint}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          第6章：実践シチュエーション別フレーズ（全10選）
      ======================================================== */}
      {showCh6 && (
        <section className="bg-white border-2 border-stone-200/90 rounded-3xl shadow-[0_3px_0_#E5E7EB] overflow-hidden">
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b-2 border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#1CB0F6] text-white text-[11px] font-black shadow-[0_1.5px_0_#1899D6]">
                  第6章
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                  実践シチュエーション別フレーズ（全10選）
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#64748B] hidden sm:inline">
                旅行・日常でそのまま使える
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              これまでのルールを総動員し、現地での食事・買い物・移動・待ち合わせでそのまま使える実践フレーズ10選です。
            </p>
          </div>

          <div className="p-3 sm:p-4 space-y-2.5">
            {filteredPhrases.map((ph) => (
              <div
                key={ph.id}
                className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5 hover:border-[#1CB0F6]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#F0F9FF] text-[#1CB0F6] text-[10px] font-bold">
                      {ph.scene}・{ph.subScene}
                    </span>
                    <span className="text-xs text-[#94A3B8] font-mono">
                      No.{ph.no}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(ph.sentenceKo)}
                    className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1CB0F6] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    title="発音を聞く"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="font-bold text-sm sm:text-base text-[#0F172A] leading-snug">
                  {ph.sentenceKo}
                </div>

                {showPronunciation && (
                  <div className="text-xs text-[#94A3B8] font-mono">
                    {ph.pronunciation}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-[#1E293B]">
                  {ph.translationJa}
                </div>

                <div className="text-[11px] text-[#64748B] pt-0.5 border-t border-dashed border-[#E2E8F0]">
                  {ph.point}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
