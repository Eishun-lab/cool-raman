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

export const SkillstackHomeScreen: React.FC<SkillstackHomeScreenProps> = ({
  progressState,
  onOpenTextbook,
  onStartDrillForLesson,
  onStartTodayDrill,
  onNavigateToExam,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // 読了数と演習クリア数
  const readCount = Object.keys(progressState.readLessonIds).length;
  const clearedDrillCount = Object.keys(progressState.clearedDrillLessonIds).length;
  const progressPercent = Math.min(100, Math.round((readCount / LESSONS_DATA.length) * 100));

  // 前回の続きのレッスン
  const lastLesson = useMemo(() => {
    return LESSONS_DATA.find((l) => l.id === progressState.lastReadLessonId) || LESSONS_DATA[0];
  }, [progressState.lastReadLessonId]);

  // レベル別レッスン
  const displayedLessons = useMemo(() => {
    if (selectedLevel === 'beginner') {
      return LESSONS_DATA.filter((l) => l.number <= 30);
    }
    if (selectedLevel === 'intermediate') {
      return LESSONS_DATA.filter((l) => l.number >= 31 && l.number <= 35);
    }
    return LESSONS_DATA.filter((l) => l.number >= 36);
  }, [selectedLevel]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-5 pb-24 sm:pb-16 select-none animate-fadeIn">
      {/* ===================================================================== */}
      {/* 1. 合格ターゲット進捗ステータス (SkillStack ホーム最上部準拠)        */}
      {/* ===================================================================== */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-white tracking-tight truncate">
              韓国語マスター進捗
            </span>
            <span className="text-[11px] text-slate-400 font-mono shrink-0">
              ({readCount} / {LESSONS_DATA.length}課 読了)
            </span>
          </div>
          <span className="text-sm font-bold text-emerald-400 font-mono shrink-0">
            {progressPercent}%
          </span>
        </div>

        {/* スタイリッシュな進捗グラデーションバー */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(2, progressPercent)}%` }}
          />
        </div>

        {/* ミニマル統計タグ */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
          <span>連続学習: <b className="text-amber-400">{progressState.streakDays}日</b></span>
          <span>特訓クリア: <b className="text-white">{clearedDrillCount}課</b></span>
          <span>総獲得: <b className="text-emerald-400">{progressState.xp} XP</b></span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 前回の続きから再開バナー (中断セッションのワンタップ再開)          */}
      {/* ===================================================================== */}
      {lastLesson && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 font-mono">
              NO.{lastLesson.number}
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                前回の続きから再開
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                {lastLesson.title.replace(/^第\d+課：/, '')}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onOpenTextbook(lastLesson.id);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>続きを読む</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. 今日の3分クイック特訓カード (SkillStack「今日の10問」準拠)         */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>今日の3分クイック特訓</span>
          </div>
          <p className="text-xs text-slate-600 font-normal">
            全ジャンルから抽出された実戦5問。毎日3分で語彙と文法を即答アウトプット
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onStartTodayDrill();
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
        >
          <span>特訓スタート</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 4. カリキュラム一覧 (全40課：教科書を読む & 特訓する)                */}
      {/* ===================================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">カリキュラム（全40課）</h2>
          </div>

          {/* 初級 / 中級 / 上級 切り替えセグメント */}
          <div className="inline-flex p-0.5 bg-slate-100 border border-slate-200/80 rounded-xl">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setSelectedLevel(level);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === level
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {level === 'beginner' ? '初級 (1-30)' : level === 'intermediate' ? '中級 (31-35)' : '上級 (36-40)'}
              </button>
            ))}
          </div>
        </div>

        {/* レッスンカードリスト */}
        <div className="space-y-2">
          {displayedLessons.map((lesson) => {
            const isRead = !!progressState.readLessonIds[lesson.id];
            const isDrillCleared = !!progressState.clearedDrillLessonIds[lesson.id];

            return (
              <div
                key={lesson.id}
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* レッスン番号 */}
                  <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                    {lesson.number < 10 ? `0${lesson.number}` : lesson.number}
                  </span>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {lesson.title.replace(/^第\d+課：/, '')}
                      </h3>
                      {isDrillCleared ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold shrink-0">
                          特訓クリア
                        </span>
                      ) : isRead ? (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium shrink-0">
                          読了
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500 truncate font-normal">
                      {lesson.subtitle}
                    </p>
                  </div>
                </div>

                {/* アクションボタン2つ: 教科書を読む / 特訓する */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onOpenTextbook(lesson.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>教科書</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onStartDrillForLesson(lesson);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>特訓</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. CBT公式模試センターへの案内バナー                                 */}
      {/* ===================================================================== */}
      <div className="pt-2">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold shrink-0">
              <Award className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                TOPIK・ハン検 CBT模擬試験センター
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                ハン検（5〜1級 全級完備）・TOPIK（I・II）で実力を公式判定
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onNavigateToExam();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap"
          >
            <span>模試に挑む</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
