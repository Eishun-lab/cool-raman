// ==============================================================================
// 📚 HanMoa 学習セッション ＆ 進捗管理サービス (SkillStackモデル準拠)
// ==============================================================================

export interface StudyProgressState {
  lastReadLessonId: string | null;
  readLessonIds: Record<string, boolean>; // lessonId -> true
  clearedDrillLessonIds: Record<string, boolean>; // lessonId -> true
  lastActiveDate: string; // YYYY-MM-DD
  streakDays: number;
  xp: number;
}

const STORAGE_KEY = 'hanmoa_study_progress_v3';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitialStudyProgress = (): StudyProgressState => {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // 日付変更時のストリーク計算
      if (parsed.lastActiveDate !== today) {
        const last = new Date(parsed.lastActiveDate || '2000-01-01');
        const curr = new Date(today);
        const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          parsed.streakDays = (parsed.streakDays || 1) + 1;
        } else if (diffDays > 1) {
          parsed.streakDays = 1;
        }
        parsed.lastActiveDate = today;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return {
        lastReadLessonId: parsed.lastReadLessonId || 'lesson-1',
        readLessonIds: parsed.readLessonIds || { 'lesson-1': true },
        clearedDrillLessonIds: parsed.clearedDrillLessonIds || {},
        lastActiveDate: parsed.lastActiveDate || today,
        streakDays: Math.max(1, parsed.streakDays || 1),
        xp: parsed.xp || 120,
      };
    }
  } catch (e) {
    console.error('Failed to load study progress', e);
  }

  // デフォルト初期値
  return {
    lastReadLessonId: 'lesson-1',
    readLessonIds: { 'lesson-1': true },
    clearedDrillLessonIds: {},
    lastActiveDate: today,
    streakDays: 1,
    xp: 120,
  };
};

export const saveStudyProgress = (state: StudyProgressState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save study progress', e);
  }
};
