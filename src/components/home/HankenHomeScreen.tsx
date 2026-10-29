import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Flame,
  Lock,
  Unlock,
  Target,
  Sparkles,
} from 'lucide-react';
import { LessonData } from '../../types';
import { LESSONS_DATA } from '../../data/lessons';
import { StudyProgressState } from '../../services/studySessionService';
import { sound } from '../../utils/audioSynth';

export type ActiveHankenGrade = 'grade_5' | 'grade_4' | 'grade_3';

interface HankenHomeScreenProps {
  progressState: StudyProgressState;
  onOpenTextbook: (lessonId?: string) => void;
  onStartDrillForLesson: (lesson: LessonData) => void;
  onStartTodayDrill: () => void;
  onStartMockExam: (examId: 'hanken_5' | 'hanken_4' | 'hanken_3') => void;
}

const GRADE_SPECS: Record<
  ActiveHankenGrade,
  {
    name: string;
    levelShort: string;
    tag: string;
    startLesson: number;
    endLesson: number;
    wordCount: string;
    passScore: number;
    timeLimitMin: number;
    examId: 'hanken_5' | 'hanken_4' | 'hanken_3';
    description: string;
  }
> = {
  grade_5: {
    name: 'ハングル検定 5級',
    levelShort: '5級',
    tag: '入門・基礎',
    startLesson: 1,
    endLesson: 15,
    wordCount: '約480語',
    passScore: 60,
    timeLimitMin: 20,
    examId: 'hanken_5',
    description: '文字・発音・基本助詞・日常会話（全15課）',
  },
  grade_4: {
    name: 'ハングル検定 4級',
    levelShort: '4級',
    tag: '初級完成',
    startLesson: 16,
    endLesson: 28,
    wordCount: '約1,070語',
    passScore: 60,
    timeLimitMin: 20,
    examId: 'hanken_4',
    description: '音変化・不規則活用・理由・依頼・日常会話読解（全13課）',
  },
  grade_3: {
    name: 'ハングル検定 3級',
    levelShort: '3級',
    tag: '実戦会話・中級',
    startLesson: 29,
    endLesson: 35,
    wordCount: '約2,000語',
    passScore: 60,
    timeLimitMin: 22,
    examId: 'hanken_3',
    description: '敬語体系・4大間接話法・身体慣用句・複文読解（全7課）',
  },
};

export const HankenHomeScreen: React.FC<HankenHomeScreenProps> = ({
  progressState,
  onOpenTextbook,
  onStartDrillForLesson,
  onStartTodayDrill,
  onStartMockExam,
}) => {
  const [activeGrade, setActiveGrade] = useState<ActiveHankenGrade>('grade_5');
  const spec = GRADE_SPECS[activeGrade];

  // 対象級のレッスン抽出
  const currentGradeLessons = useMemo(() => {
    return LESSONS_DATA.filter(
      (l) => l.number >= spec.startLesson && l.number <= spec.endLesson
    );
  }, [spec]);

  // 読了・特訓クリア進捗
  const readLessons = currentGradeLessons.filter((l) => !!progressState.readLessonIds[l.id]);
  const progressPercent = Math.min(
    100,
    Math.round((readLessons.length / currentGradeLessons.length) * 100)
  );

  // ユーザーが「今やるべき1つのレッスン」を自動決定
  const nextTargetLesson = useMemo(() => {
    const unread = currentGradeLessons.find((l) => !progressState.readLessonIds[l.id]);
    if (unread) return unread;
    const unclearedDrill = currentGradeLessons.find(
      (l) => !progressState.clearedDrillLessonIds[l.id]
    );
    return unclearedDrill || currentGradeLessons[0];
  }, [currentGradeLessons, progressState.readLessonIds, progressState.clearedDrillLessonIds]);

  const isAllRead = readLessons.length === currentGradeLessons.length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-16 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. チャレンジ・最優先アクションカード（ユーザーの選択肢を1つに集約）       */}
      {/* ===================================================================== */}
      <section className="bg-white border border-[#EAE4DA] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(42,36,33,0.04)] space-y-4">
        {/* ヘッダータグ ＆ 進捗 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B84E34]" />
            <span className="text-[11px] font-bold tracking-wider text-[#B84E34] uppercase">
              {spec.levelShort} 合格チャレンジ
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-stone-600">
            {readLessons.length} / {currentGradeLessons.length}課 ({progressPercent}%)
          </span>
        </div>

        {/* 核心タイトル ＆ 合格指標 */}
        <div className="space-y-1">
          <h2 className="font-serif-title text-2xl font-bold text-[#2A2421] tracking-tight">
            {spec.name}
          </h2>
          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
            <span>合格ライン {spec.passScore}点 / 100点</span>
            <span>•</span>
            <span>出題語彙 {spec.wordCount}</span>
            <span>•</span>
            <span>全{currentGradeLessons.length}課</span>
          </div>
        </div>

        {/* 進捗プログレスバー */}
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
                onStartMockExam(spec.examId);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-[#B84E34] hover:bg-[#9E3B21] text-white text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <Award className="w-5 h-5" />
              <span>全課読了！{spec.levelShort} 本番模試に挑戦する</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. 公式CBT模擬試験（核心カード）                                      */}
      {/* ===================================================================== */}
      <section className="bg-[#1F1A17] text-white rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[#F59E0B] text-[10px] font-bold">
            <Award className="w-3 h-3" />
            <span>{spec.levelShort} 公式CBT模試</span>
          </div>
          <h3 className="font-serif-title text-base sm:text-lg font-bold text-white">
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
            onStartMockExam(spec.examId);
          }}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#1F1A17] font-bold text-xs shadow transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
        >
          受験する ➔
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 3. カリキュラム（全課・迷わない1列ロードマップ）                       */}
      {/* ===================================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B84E34]" />
            <h3 className="font-serif-title text-sm font-bold text-[#2A2421]">
              {spec.levelShort} 出題カリキュラム（全{currentGradeLessons.length}課）
            </h3>
          </div>
          <span className="text-xs font-mono font-medium text-stone-500">
            第{spec.startLesson}課 〜 第{spec.endLesson}課
          </span>
        </div>

        <div className="space-y-2">
          {currentGradeLessons.map((lesson) => {
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
      {/* 4. 他の級への切り替え・アンロック                                     */}
      {/* ===================================================================== */}
      <section className="space-y-2 pt-4 border-t border-[#EAE4DA]">
        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-1">
          他の級のチャレンジ（ワンタップで切り替え）
        </div>

        {(['grade_5', 'grade_4', 'grade_3'] as ActiveHankenGrade[])
          .filter((g) => g !== activeGrade)
          .map((g) => {
            const otherSpec = GRADE_SPECS[g];
            return (
              <div
                key={g}
                onClick={() => {
                  sound.playTap();
                  setActiveGrade(g);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-white border border-[#EAE4DA] hover:border-[#B84E34]/50 hover:bg-[#FAF0EC]/20 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF0EC] text-[#B84E34] flex items-center justify-center font-bold text-xs font-mono border border-[#F0D5CD]">
                    {otherSpec.levelShort}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">
                      {otherSpec.name} ({otherSpec.tag})
                    </div>
                    <div className="text-[10px] text-stone-400">
                      第{otherSpec.startLesson}〜{otherSpec.endLesson}課 • 出題語彙 {otherSpec.wordCount}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-[#B84E34] bg-[#FAF0EC] hover:bg-[#F2DFD7] px-3 py-1.5 rounded-xl border border-[#F0D5CD] transition-colors">
                  {otherSpec.levelShort}に挑戦 ➔
                </span>
              </div>
            );
          })}
      </section>
    </div>
  );
};
