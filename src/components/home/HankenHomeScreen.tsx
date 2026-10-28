import React, { useMemo } from 'react';
import {
  Award,
  BookOpen,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Flame,
  Lock,
  Target,
  Sparkles,
} from 'lucide-react';
import { LessonData } from '../../types';
import { LESSONS_DATA } from '../../data/lessons';
import { StudyProgressState } from '../../services/studySessionService';
import { sound } from '../../utils/audioSynth';

interface HankenHomeScreenProps {
  progressState: StudyProgressState;
  onOpenTextbook: (lessonId?: string) => void;
  onStartDrillForLesson: (lesson: LessonData) => void;
  onStartTodayDrill: () => void;
  onStartMockExam: (examId: 'hanken_5') => void;
}

export const HankenHomeScreen: React.FC<HankenHomeScreenProps> = ({
  progressState,
  onOpenTextbook,
  onStartDrillForLesson,
  onStartTodayDrill,
  onStartMockExam,
}) => {
  // 5級の対象範囲：第1課〜第15課（全15課）
  const grade5Lessons = useMemo(() => {
    return LESSONS_DATA.filter((l) => l.number >= 1 && l.number <= 15);
  }, []);

  // 読了・特訓クリア進捗
  const readLessons = grade5Lessons.filter((l) => !!progressState.readLessonIds[l.id]);
  const clearedDrills = grade5Lessons.filter((l) => !!progressState.clearedDrillLessonIds[l.id]);
  const progressPercent = Math.min(
    100,
    Math.round((readLessons.length / grade5Lessons.length) * 100)
  );

  // ユーザーが「今やるべき1つのレッスン」を自動決定
  const nextTargetLesson = useMemo(() => {
    // 未クリアのドリル、または未読の課
    const unread = grade5Lessons.find((l) => !progressState.readLessonIds[l.id]);
    if (unread) return unread;
    const unclearedDrill = grade5Lessons.find((l) => !progressState.clearedDrillLessonIds[l.id]);
    return unclearedDrill || grade5Lessons[0];
  }, [grade5Lessons, progressState.readLessonIds, progressState.clearedDrillLessonIds]);

  const isAllRead = readLessons.length === grade5Lessons.length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-16 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. 5級チャレンジ・最優先アクションカード（ユーザーの選択肢を1つに集約）   */}
      {/* ===================================================================== */}
      <section className="bg-white border border-[#EAE4DA] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(42,36,33,0.04)] space-y-4">
        {/* ヘッダータグ ＆ 進捗 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B84E34]" />
            <span className="text-[11px] font-bold tracking-wider text-[#B84E34] uppercase">
              5級 合格チャレンジ
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-stone-600">
            {readLessons.length} / 15課 ({progressPercent}%)
          </span>
        </div>

        {/* 核心タイトル ＆ 合格指標 */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#2A2421] tracking-tight">
            ハングル検定 5級
          </h2>
          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
            <span>合格ライン 60点 / 100点</span>
            <span>•</span>
            <span>出題語彙 約480語</span>
            <span>•</span>
            <span>全15課</span>
          </div>
        </div>

        {/* 進捗プログレスバー（ロゴのテラコッタ色） */}
        <div className="w-full bg-[#F4EFEA] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#B84E34] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>

        {/* ★ ユーザーが迷わない「今やるべき1つのアクション」 */}
        <div className="pt-2 space-y-2">
          {!isAllRead ? (
            <>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onStartDrillForLesson(nextTargetLesson);
                }}
                className="w-full py-4 px-6 rounded-2xl bg-[#B84E34] hover:bg-[#9E3B21] text-white text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>第{nextTargetLesson.number}課の特訓を始める</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onOpenTextbook(nextTargetLesson.id);
                  }}
                  className="text-xs text-stone-500 hover:text-[#B84E34] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>第{nextTargetLesson.number}課の要点教科書を読む</span>
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onStartMockExam('hanken_5');
              }}
              className="w-full py-4 px-6 rounded-2xl bg-[#B84E34] hover:bg-[#9E3B21] text-white text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <Award className="w-5 h-5" />
              <span>全課読了！5級 本番模試に挑戦する</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. 5級 公式CBT模擬試験（核心カード）                                 */}
      {/* ===================================================================== */}
      <section className="bg-[#1F1A17] text-white rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[#F59E0B] text-[10px] font-bold">
            <Award className="w-3 h-3" />
            <span>5級 公式CBT模試</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            本番形式 模擬試験（25問・100点）
          </h3>
          <p className="text-xs text-stone-300 font-normal">
            筆記・聞き取り100点満点。60点合格を即時判定。
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onStartMockExam('hanken_5');
          }}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#1F1A17] font-bold text-xs shadow transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
        >
          受験する ➔
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 3. 5級 カリキュラム（全15課・迷わない1列ロードマップ）                 */}
      {/* ===================================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B84E34]" />
            <h3 className="text-sm font-bold text-[#2A2421]">
              5級 出題範囲カリキュラム（全15課）
            </h3>
          </div>
          <span className="text-xs font-mono font-medium text-stone-500">
            合格対象 1〜15課
          </span>
        </div>

        <div className="space-y-2">
          {grade5Lessons.map((lesson) => {
            const isRead = !!progressState.readLessonIds[lesson.id];
            const isCleared = !!progressState.clearedDrillLessonIds[lesson.id];
            const isNext = lesson.id === nextTargetLesson.id;

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  sound.playTap();
                  onOpenTextbook(lesson.id);
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isNext
                    ? 'bg-white border-[#B84E34]/80 shadow-[0_2px_8px_rgba(184,78,52,0.12)] ring-1 ring-[#B84E34]/20'
                    : isRead
                    ? 'bg-white/80 border-[#EAE4DA] hover:border-stone-400'
                    : 'bg-white/50 border-[#EAE4DA] hover:bg-white'
                }`}
              >
                {/* 左側：番号 ＆ タイトル */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                      isCleared
                        ? 'bg-[#FAF0EC] text-[#B84E34]'
                        : isRead
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-stone-100/70 text-stone-400'
                    }`}
                  >
                    {isCleared ? (
                      <CheckCircle2 className="w-4 h-4 text-[#B84E34]" />
                    ) : (
                      String(lesson.number).padStart(2, '0')
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-[#2A2421] truncate">
                        {lesson.title.replace(/^第\d+課：/, '')}
                      </span>
                      {isRead && (
                        <span className="text-[10px] text-stone-400 font-normal shrink-0">
                          読了
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate font-normal">
                      {lesson.subtitle}
                    </p>
                  </div>
                </div>

                {/* 右側：特訓ボタン または 矢印 */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                      onStartDrillForLesson(lesson);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isCleared
                        ? 'bg-[#FAF0EC] text-[#B84E34] hover:bg-[#F2DFD7]'
                        : 'bg-stone-100 hover:bg-[#FAF0EC] hover:text-[#B84E34] text-stone-700'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>特訓</span>
                  </button>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. ロック中の級（5級合格でアンロック）                                 */}
      {/* ===================================================================== */}
      <section className="space-y-2 pt-4 border-t border-[#EAE4DA]">
        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-1">
          次のチャレンジ（ロック中）
        </div>

        {/* 4級 ロックカード */}
        <div className="p-4 rounded-2xl bg-stone-100/60 border border-dashed border-stone-300 flex items-center justify-between opacity-75">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-200/80 flex items-center justify-center text-stone-500">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <span>ハングル検定 4級（初級・不規則活用）</span>
              </div>
              <p className="text-[11px] text-stone-400">
                出題語彙 約1,070語 • 5級合格後に解放
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-stone-400 font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-200">
            🔒 5級合格でアンロック
          </span>
        </div>

        {/* 3級 ロックカード */}
        <div className="p-4 rounded-2xl bg-stone-100/40 border border-dashed border-stone-200 flex items-center justify-between opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-200/50 flex items-center justify-center text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-600">
                ハングル検定 3級（実戦・長文読解）
              </div>
              <p className="text-[11px] text-stone-400">
                出題語彙 約2,000語 • 4級合格後に解放
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-stone-400 font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-200">
            🔒 4級合格でアンロック
          </span>
        </div>
      </section>
    </div>
  );
};
