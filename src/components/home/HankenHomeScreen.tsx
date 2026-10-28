import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  Check,
  Target,
} from 'lucide-react';
import { LessonData } from '../../types';
import {
  HANKEN_GRADES,
  HankenGradeId,
  getHankenGradeConfig,
  getLessonsForGrade,
} from '../../data/hankenConfig';
import { StudyProgressState } from '../../services/studySessionService';
import { sound } from '../../utils/audioSynth';

interface HankenHomeScreenProps {
  progressState: StudyProgressState;
  onOpenTextbook: (lessonId?: string) => void;
  onStartDrillForLesson: (lesson: LessonData) => void;
  onStartTodayDrill: () => void;
  onStartMockExam: (examId: 'hanken_5' | 'hanken_4' | 'hanken_3') => void;
}

export const HankenHomeScreen: React.FC<HankenHomeScreenProps> = ({
  progressState,
  onOpenTextbook,
  onStartDrillForLesson,
  onStartTodayDrill,
  onStartMockExam,
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState<HankenGradeId>('grade_5');

  const gradeConfig = useMemo(() => getHankenGradeConfig(selectedGradeId), [selectedGradeId]);
  const gradeLessons = useMemo(() => getLessonsForGrade(selectedGradeId), [selectedGradeId]);

  // 当該級の進捗計算
  const readLessonsInGrade = gradeLessons.filter((l) => !!progressState.readLessonIds[l.id]);
  const clearedDrillsInGrade = gradeLessons.filter((l) => !!progressState.clearedDrillLessonIds[l.id]);
  const gradeProgressPercent = Math.min(
    100,
    Math.round((readLessonsInGrade.length / (gradeLessons.length || 1)) * 100)
  );

  // 前回の続きのレッスン（当該級の中で最初に見つかる未完了レッスン、または直近の課）
  const resumeLesson = useMemo(() => {
    const unread = gradeLessons.find((l) => !progressState.readLessonIds[l.id]);
    return unread || gradeLessons[0];
  }, [gradeLessons, progressState.readLessonIds]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24 select-none animate-fadeIn font-sans">
      {/* ===================================================================== */}
      {/* 1. 級切り替えセグメント（5級 / 4級 / 3級 特化）                        */}
      {/* ===================================================================== */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            受験目標の級を選択
          </span>
          <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            ハングル検定特化
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-stone-200/50 rounded-2xl border border-[#EAE8E3]">
          {HANKEN_GRADES.map((g) => {
            const isSelected = selectedGradeId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setSelectedGradeId(g.id);
                }}
                className={`py-2.5 px-3 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                <div className="text-sm font-black tracking-tight">{g.shortName}</div>
                <div className="text-[10px] text-stone-500 font-medium">{g.tag}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. 選択した級の 合格ターゲット・サマリーカード                         */}
      {/* ===================================================================== */}
      <section className="bg-white border border-[#E8E6DF] rounded-3xl p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        {/* カード上部：タグ ＆ 進捗率 */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${gradeConfig.badgeColor}`}>
            {gradeConfig.name} 出題基準
          </span>
          <span className="text-xs font-bold text-stone-600 font-mono">
            {readLessonsInGrade.length} / {gradeLessons.length} 課 読了 ({gradeProgressPercent}%)
          </span>
        </div>

        {/* コース名 ＆ 説明 */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {gradeConfig.targetTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-normal">
            {gradeConfig.targetSubtitle}
          </p>
        </div>

        {/* 進捗ライン */}
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(4, gradeProgressPercent)}%` }}
          />
        </div>

        {/* 試験スペック3大指標 */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-100 text-center text-xs">
          <div className="py-1">
            <span className="text-[10px] text-stone-400 block font-medium">合格ライン</span>
            <span className="font-bold text-stone-800 font-mono">{gradeConfig.passScore}点 / 100点</span>
          </div>
          <div className="py-1">
            <span className="text-[10px] text-stone-400 block font-medium">出題語彙目安</span>
            <span className="font-bold text-stone-800 font-mono">{gradeConfig.wordCount}</span>
          </div>
          <div className="py-1">
            <span className="text-[10px] text-stone-400 block font-medium">試験時間</span>
            <span className="font-bold text-stone-800 font-mono">{gradeConfig.timeLimitMin}分</span>
          </div>
        </div>

        {/* 2大アクション：前回の続きから再開 ＆ 今日の3分特訓 */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onOpenTextbook(resumeLesson.id);
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>第{resumeLesson.number}課から学習する</span>
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
            <span>今日の3分頻出特訓</span>
          </button>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. CBT本番模擬試験への直通カード                                      */}
      {/* ===================================================================== */}
      <section className="bg-gradient-to-r from-stone-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[10px] font-bold border border-white/10">
            <Award className="w-3.5 h-3.5" />
            <span>本番形式 CBT模擬試験</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {gradeConfig.name} 公式模試に挑戦
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal max-w-sm">
            本番同様の配点（筆記・聞き取り100点満点）で60点合格ラインを即時判定。弱点診断カルテを発行します。
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onStartMockExam(gradeConfig.examId as 'hanken_5' | 'hanken_4' | 'hanken_3');
          }}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-2 whitespace-nowrap self-stretch sm:self-center justify-center"
        >
          <span>模試をスタート ➔</span>
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 4. 出題カリキュラム一覧（全課リスト ＆ 即答ドリル）                   */}
      {/* ===================================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900" />
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">
              {gradeConfig.shortName} 出題範囲カリキュラム（全{gradeLessons.length}課）
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono font-medium">
            第{gradeConfig.lessonStart}課 〜 第{gradeConfig.lessonEnd}課
          </span>
        </div>

        {/* 出題重要ポイントまとめコールアウト */}
        <div className="bg-[#FAF9F5] border border-[#EAE8E3] rounded-2xl p-4 text-xs space-y-2">
          <span className="font-bold text-stone-900 block">
            💡 {gradeConfig.name} の最重要頻出テーマ:
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-stone-600 text-[11px]">
            {gradeConfig.keyGrammar.map((point, idx) => (
              <li key={idx} className="flex items-center gap-1.5 truncate">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* レッスン行リスト */}
        <div className="space-y-2">
          {gradeLessons.map((lesson) => {
            const isRead = !!progressState.readLessonIds[lesson.id];
            const isDrillCleared = !!progressState.clearedDrillLessonIds[lesson.id];

            return (
              <div
                key={lesson.id}
                className="bg-white border border-[#EAE8E3] hover:border-stone-300 rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* ナンバー ＆ タイトル ＆ ステータス */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
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

                {/* 2大アクション：教科書を読む ＆ 特訓する */}
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
                    <span>要点</span>
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
    </div>
  );
};

export default HankenHomeScreen;
