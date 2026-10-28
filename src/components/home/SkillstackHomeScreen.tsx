import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Zap,
  BookmarkCheck,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Flame,
  Check,
} from 'lucide-react';
import { LessonData } from '../../types';
import { LESSONS_DATA } from '../../data/lessons';
import { StudyProgressState } from '../../services/studySessionService';
import { sound } from '../../utils/audioSynth';

interface SkillstackHomeScreenProps {
  progressState: StudyProgressState;
  onOpenTextbook: (lessonId?: string) => void;
  onStartDrillForLesson: (lesson: LessonData) => void;
  onStartTodayDrill: () => void;
  onNavigateToExam: () => void;
}

// 5大章の体系定義（Speak / Notion式 カリキュラム設計）
export const CHAPTER_DEFINITIONS = [
  {
    id: 1,
    title: '第1章 入門・ハングルと基本助詞の土台',
    range: '第1課 〜 第10課',
    lessonStart: 1,
    lessonEnd: 10,
    description: '文字・母音子音・パッチムの仕組みから、自己紹介や必須助詞（〜は、〜が、〜を）の完全定着。',
    tag: '入門・基礎',
  },
  {
    id: 2,
    title: '第2章 初級前半・日常表現と重要活用',
    range: '第11課 〜 第20課',
    lessonStart: 11,
    lessonEnd: 20,
    description: 'ヘヨ体・過去形・変則活用・数詞。韓国旅行や日常会話で意思疎通できる文法力を構築。',
    tag: '初級前半',
  },
  {
    id: 3,
    title: '第3章 初級後半・複文応用と間接話法',
    range: '第21課 〜 第30課',
    lessonStart: 21,
    lessonEnd: 30,
    description: '理由・逆接・仮定などの接続表現と「〜と言っていました」の間接話法。複文を自然に操る。',
    tag: '初級総決算',
  },
  {
    id: 4,
    title: '第4章 中級・実戦会話と使役受身・絶対敬語',
    range: '第31課 〜 第35課',
    lessonStart: 31,
    lessonEnd: 35,
    description: '使役・受身・格式体・ビジネスや人間関係に応じた絶対敬語。ハン検3級〜準2級レベルへ。',
    tag: '中級突破',
  },
  {
    id: 5,
    title: '第5章 上級・推量配慮・高級論述',
    range: '第36課 〜 第40課',
    lessonStart: 36,
    lessonEnd: 40,
    description: '微妙な感情のニュアンス、口語縮約、新聞・論説文の書き言葉文型。ハン検2級・1級・TOPIK高級へ。',
    tag: '上級マスター',
  },
];

export const SkillstackHomeScreen: React.FC<SkillstackHomeScreenProps> = ({
  progressState,
  onOpenTextbook,
  onStartDrillForLesson,
  onStartTodayDrill,
  onNavigateToExam,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);

  // 読了数と演習クリア数
  const readCount = Object.keys(progressState.readLessonIds).length;
  const clearedDrillCount = Object.keys(progressState.clearedDrillLessonIds).length;
  const progressPercent = Math.min(100, Math.round((readCount / LESSONS_DATA.length) * 100));

  // 前回の続きのレッスン（未読・最後に読んだ課）
  const currentFocusLesson = useMemo(() => {
    return LESSONS_DATA.find((l) => l.id === progressState.lastReadLessonId) || LESSONS_DATA[0];
  }, [progressState.lastReadLessonId]);

  // 選択中チャプターのレッスン一覧
  const currentChapter = useMemo(() => {
    return CHAPTER_DEFINITIONS.find((c) => c.id === selectedChapterId) || CHAPTER_DEFINITIONS[0];
  }, [selectedChapterId]);

  const chapterLessons = useMemo(() => {
    return LESSONS_DATA.filter(
      (l) => l.number >= currentChapter.lessonStart && l.number <= currentChapter.lessonEnd
    );
  }, [currentChapter]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-20 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. Speak風 今日のフォーカスカード（Hero Focus Session）               */}
      {/* ===================================================================== */}
      <section className="bg-white border border-[#E8E6DF] rounded-3xl p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        {/* カード上部：タグ ＆ 全体進捗率 */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>今進めるレッスン</span>
          </div>
          <span className="text-xs font-bold text-stone-500 font-mono">
            {readCount} / {LESSONS_DATA.length} 課 完了 ({progressPercent}%)
          </span>
        </div>

        {/* メインタイトル ＆ レッスン名 */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
            第{currentFocusLesson.number}課
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-snug">
            {currentFocusLesson.title.replace(/^第\d+課：/, '')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed pt-0.5 font-normal">
            {currentFocusLesson.subtitle}
          </p>
        </div>

        {/* 洗練された細身のプログレスバー */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(3, progressPercent)}%` }}
          />
        </div>

        {/* アクションボタン（Speak式：明確な2択） */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onOpenTextbook(currentFocusLesson.id);
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>教科書を開く</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onStartTodayDrill();
            }}
            className="py-3 px-5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/90 text-stone-800 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>今日の3分特訓（5問）</span>
          </button>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. Notion風 ミニマル・スタッツリボン                                   */}
      {/* ===================================================================== */}
      <section className="grid grid-cols-3 gap-2 px-1 text-center">
        <div className="bg-white/80 border border-[#EAE8E3] rounded-2xl p-3 shadow-2xs">
          <span className="text-[10px] text-stone-500 block font-medium">連続学習</span>
          <span className="text-sm sm:text-base font-bold text-stone-900 font-mono flex items-center justify-center gap-1 mt-0.5">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 inline" />
            {progressState.streakDays}日
          </span>
        </div>

        <div className="bg-white/80 border border-[#EAE8E3] rounded-2xl p-3 shadow-2xs">
          <span className="text-[10px] text-stone-500 block font-medium">特訓クリア</span>
          <span className="text-sm sm:text-base font-bold text-stone-900 font-mono mt-0.5 block">
            {clearedDrillCount} <span className="text-xs text-stone-500 font-normal">/ 40課</span>
          </span>
        </div>

        <div className="bg-white/80 border border-[#EAE8E3] rounded-2xl p-3 shadow-2xs">
          <span className="text-[10px] text-stone-500 block font-medium">累計獲得</span>
          <span className="text-sm sm:text-base font-bold text-stone-900 font-mono flex items-center justify-center gap-1 mt-0.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
            {progressState.xp} <span className="text-[10px] text-stone-500 font-normal">XP</span>
          </span>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. Notion風 カリキュラム目次（全5章・40課）                            */}
      {/* ===================================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900" />
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">カリキュラム体系</h3>
          </div>
          <span className="text-xs text-stone-500 font-mono font-medium">全5章・40課</span>
        </div>

        {/* チャプター選択タブ（Notion風ピルコントロール） */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CHAPTER_DEFINITIONS.map((ch) => {
            const isSelected = selectedChapterId === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setSelectedChapterId(ch.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#18181B] text-white shadow-2xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-[#EAE8E3] hover:bg-stone-50'
                }`}
              >
                <span>{ch.tag}</span>
                <span className={`text-[10px] ml-1.5 font-mono ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  ({ch.lessonStart}-{ch.lessonEnd})
                </span>
              </button>
            );
          })}
        </div>

        {/* 選択されたチャプターの概要カード */}
        <div className="bg-[#FAF9F5] border border-[#EAE8E3] rounded-2xl p-4 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900">{currentChapter.title}</span>
            <span className="text-[11px] text-stone-500 font-mono">{currentChapter.range}</span>
          </div>
          <p className="text-stone-500 text-[11px] leading-relaxed font-normal">
            {currentChapter.description}
          </p>
        </div>

        {/* レッスンリスト（Notionのドキュメント行風） */}
        <div className="space-y-2">
          {chapterLessons.map((lesson) => {
            const isRead = !!progressState.readLessonIds[lesson.id];
            const isDrillCleared = !!progressState.clearedDrillLessonIds[lesson.id];

            return (
              <div
                key={lesson.id}
                className="bg-white border border-[#EAE8E3] hover:border-stone-300 rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* 左側：ナンバー ＆ タイトル ＆ ステータス */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  {/* ステータスサークル */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                      isDrillCleared
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isRead
                        ? 'bg-stone-100 text-stone-700 border border-stone-200'
                        : 'bg-stone-50 text-stone-500 border border-stone-200/80'
                    }`}
                  >
                    {isDrillCleared ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <span>{lesson.number < 10 ? `0${lesson.number}` : lesson.number}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-emerald-800 transition-colors">
                        {lesson.title.replace(/^第\d+課：/, '')}
                      </h4>
                      {isDrillCleared ? (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.2 rounded font-bold shrink-0">
                          特訓済
                        </span>
                      ) : isRead ? (
                        <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded font-medium shrink-0">
                          読了
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate font-normal">
                      {lesson.subtitle}
                    </p>
                  </div>
                </div>

                {/* 右側：洗練されたミニマルアクション（教科書 / 特訓） */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onOpenTextbook(lesson.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                    <span>教科書</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onStartDrillForLesson(lesson);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>特訓</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. CBT公式模試センターへの案内カード（Speak風 ミニマルバナー）         */}
      {/* ===================================================================== */}
      <section className="pt-2">
        <div className="bg-white border border-[#EAE8E3] rounded-3xl p-5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-stone-700" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                TOPIK・ハン検 CBT模擬試験センター
              </h4>
              <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
                全8大試験。合否判定とCan-Do学習カルテを即時発行
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onNavigateToExam();
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <span>模試に挑む</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default SkillstackHomeScreen;
