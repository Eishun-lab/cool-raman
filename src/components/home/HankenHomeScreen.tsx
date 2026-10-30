import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
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
  onStartReview?: () => void;
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
  onStartMockExam,
  onStartReview,
}) => {
  const [activeGrade, setActiveGrade] = useState<ActiveHankenGrade>('grade_5');
  const spec = GRADE_SPECS[activeGrade];

  const wrongCount = progressState.wrongQuestions?.length || 0;

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
    <div className="w-full max-w-xl mx-auto space-y-4 pb-16 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. チャレンジ・最優先アクションカード（Quiet Luxury装丁）               */}
      {/* ===================================================================== */}
      <section className="bg-white border border-[#EAE4DA] rounded-2xl p-5 sm:p-7 shadow-[0_2px_14px_rgba(42,36,33,0.03)] space-y-4 sm:space-y-5">
        {/* ヘッダータグ ＆ 進捗 */}
        <div className="flex items-center justify-between gap-2 border-b border-[#EAE4DA]/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider font-bold px-2 py-0.5 rounded bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
              {spec.levelShort} 必須課程
            </span>
            <span className="text-xs text-stone-400 font-serif-title tracking-wider hidden sm:inline">
              ハングル能力検定試験
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-stone-500">
            {readLessons.length} / {currentGradeLessons.length} 課修了
            <span className="text-stone-400 ml-1.5">({progressPercent}%)</span>
          </span>
        </div>

        {/* 核心タイトル ＆ 合格指標 */}
        <div className="space-y-1.5">
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2A2421] tracking-tight">
            {spec.name}
          </h2>
          <div className="flex items-center gap-2.5 text-xs text-stone-500 font-normal">
            <span>合格基準 {spec.passScore}点 / 100点</span>
            <span className="text-stone-300">|</span>
            <span>出題語彙 {spec.wordCount}</span>
            <span className="text-stone-300">|</span>
            <span>全{currentGradeLessons.length}課</span>
          </div>
        </div>

        {/* 進捗プログレスライン（極細ヘアライン設計） */}
        <div className="w-full bg-[#EAE4DA]/70 h-[3px] rounded-full overflow-hidden">
          <div
            className="bg-[#2A2421] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* ★ ユーザーが迷わない「今やるべき1つのアクション」 */}
        <div className="pt-1 space-y-3">
          {!isAllRead ? (
            <>
              {/* メインCTA：深みのある墨黒ボタン（Quiet Luxury） */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onStartDrillForLesson(nextTargetLesson);
                }}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#1F1A17] hover:bg-[#342D28] text-[#FAF7F2] text-sm sm:text-base font-serif-title tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(31,26,23,0.12)] active:scale-[0.99] group"
              >
                <span>第{nextTargetLesson.number}課の実践演習に進む</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
              </button>

              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onOpenTextbook(nextTargetLesson.id);
                  }}
                  className="text-xs text-stone-500 hover:text-[#B84E34] transition-colors cursor-pointer inline-flex items-center gap-1.5 font-normal tracking-wide"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span>第{nextTargetLesson.number}課の教本を開く</span>
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
              className="w-full py-4 px-6 rounded-xl bg-[#1F1A17] hover:bg-[#342D28] text-[#FAF7F2] text-sm sm:text-base font-serif-title tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(31,26,23,0.12)] active:scale-[0.99]"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>全課修了 — {spec.levelShort} 実戦模試へ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. 弱点復習（未習得問題がある場合のみ表示されるQuiet Luxury導線）       */}
      {/* ===================================================================== */}
      {wrongCount > 0 && (
        <section className="bg-white border border-[#EAE4DA] rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(42,36,33,0.02)] flex items-center justify-between gap-3 animate-fadeIn">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
              <span className="text-[10px] tracking-wider font-bold px-2 py-0.5 rounded bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]">
                弱点修練
              </span>
              <span className="text-xs font-mono font-medium text-stone-500">
                未克服 {wrongCount} 問
              </span>
            </div>
            <p className="text-xs text-stone-500 font-normal truncate">
              演習・模試で間違えた設問を再度解いて克服します。
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onStartReview?.();
            }}
            className="px-4 py-2 rounded-xl bg-white border border-[#2A2421] text-[#2A2421] hover:bg-[#2A2421] hover:text-[#FAF7F2] font-serif-title text-xs tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-2xs active:scale-95"
          >
            復習する ➔
          </button>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 3. 実力測定 総合模擬試験（端正な白地と墨のカード）                      */}
      {/* ===================================================================== */}
      <section className="bg-white border border-[#EAE4DA] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(42,36,33,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider font-bold px-2 py-0.5 rounded bg-[#FAF7F2] text-stone-600 border border-[#EAE4DA]">
              {spec.levelShort} 実戦測定
            </span>
            <span className="text-xs text-stone-400 font-mono">25問 / 100点満点</span>
          </div>
          <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#2A2421]">
            本番形式 総合模擬試験
          </h3>
          <p className="text-xs text-stone-500 font-normal leading-relaxed">
            筆記・聞き取りの到達度と合格ライン（60点）を精密測定します。
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onStartMockExam(spec.examId);
          }}
          className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-white border border-[#2A2421] text-[#2A2421] hover:bg-[#2A2421] hover:text-[#FAF7F2] font-serif-title text-xs tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-2xs active:scale-95"
        >
          模試を受験する ➔
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 3. 履修体系（全課・目次仕立ての美しい1列構成）                          */}
      {/* ===================================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B84E34]" />
            <h3 className="font-serif-title text-sm font-bold text-[#2A2421] tracking-wide">
              {spec.levelShort} 履修体系（全{currentGradeLessons.length}課）
            </h3>
          </div>
          <span className="text-xs font-mono font-normal text-stone-400">
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
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isNext
                    ? 'bg-white border-[#B84E34] shadow-[0_2px_10px_rgba(184,78,52,0.08)] ring-1 ring-[#B84E34]/20'
                    : isRead
                    ? 'bg-white/90 border-[#EAE4DA] hover:border-stone-400'
                    : 'bg-white/50 border-[#EAE4DA]/70 hover:bg-white'
                }`}
              >
                {/* 左側：番号 ＆ タイトル */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-mono font-medium ${
                      isCleared
                        ? 'bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD]'
                        : isRead
                        ? 'bg-stone-100 text-stone-600'
                        : 'bg-stone-100/60 text-stone-400'
                    }`}
                  >
                    {isCleared ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B84E34]" />
                    ) : (
                      String(lesson.number).padStart(2, '0')
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#2A2421] truncate font-serif-title">
                        {lesson.title.replace(/^第\d+課：/, '')}
                      </span>
                      {isRead && (
                        <span className="text-[10px] text-stone-400 font-serif-title shrink-0">
                          読了
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate font-normal pt-0.5">
                      {lesson.subtitle}
                    </p>
                  </div>
                </div>

                {/* 右側：演習ボタン または 矢印 */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                      onStartDrillForLesson(lesson);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-serif-title transition-all cursor-pointer flex items-center gap-1 ${
                      isCleared
                        ? 'bg-[#FAF0EC] text-[#B84E34] hover:bg-[#F2DFD7] border border-[#F0D5CD]'
                        : 'bg-stone-100 hover:bg-[#FAF7F2] text-stone-700 hover:text-[#2A2421] border border-stone-200'
                    }`}
                  >
                    <span>演習</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. 級の切り替え                                                       */}
      {/* ===================================================================== */}
      <section className="space-y-2 pt-4 border-t border-[#EAE4DA]">
        <div className="text-[11px] font-serif-title tracking-wider text-stone-400 uppercase px-1">
          他の級の修練（ワンタップで切り替え）
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  className="p-3.5 rounded-xl bg-white border border-[#EAE4DA] hover:border-[#2A2421]/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-stone-700 border border-[#EAE4DA] flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {otherSpec.levelShort}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-800 font-serif-title truncate">
                        {otherSpec.name}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">
                        全{otherSpec.endLesson - otherSpec.startLesson + 1}課 • {otherSpec.wordCount}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-serif-title text-stone-500 group-hover:text-[#2A2421] transition-colors shrink-0">
                    切り替え ➔
                  </span>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
};
