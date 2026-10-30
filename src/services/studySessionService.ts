// ==============================================================================
// 📚 HanMoa 学習セッション ＆ 進捗管理サービス (SkillStackモデル準拠)
// ==============================================================================

export interface WrongQuestionRecord {
  id: string; // 一意キー (例: `drill-lesson-1-q0` または `mock-hanken_5-q3`)
  sourceTitle: string; // 例: "第1課 実践演習" または "5級 模擬試験"
  question: string;
  instruction?: string;
  passage?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioText?: string;
  addedAt: string; // YYYY-MM-DD
}

export interface StudyProgressState {
  lastReadLessonId: string | null;
  readLessonIds: Record<string, boolean>; // lessonId -> true
  clearedDrillLessonIds: Record<string, boolean>; // lessonId -> true
  lastActiveDate: string; // YYYY-MM-DD
  streakDays: number;
  xp: number;
  wrongQuestions: WrongQuestionRecord[]; // 弱点復習リスト
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
        wrongQuestions: parsed.wrongQuestions || [],
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
    wrongQuestions: [],
  };
};

export const saveStudyProgress = (state: StudyProgressState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save study progress', e);
  }
};

/**
 * 間違えた問題を弱点リストに追加（重複は上書き更新）
 */
export const recordWrongQuestion = (record: WrongQuestionRecord): void => {
  const state = getInitialStudyProgress();
  const existingIdx = state.wrongQuestions.findIndex((q) => q.id === record.id);
  if (existingIdx >= 0) {
    state.wrongQuestions[existingIdx] = record;
  } else {
    state.wrongQuestions.unshift(record);
  }
  // 最大100問までに制限
  if (state.wrongQuestions.length > 100) {
    state.wrongQuestions = state.wrongQuestions.slice(0, 100);
  }
  saveStudyProgress(state);
};

/**
 * 復習で正解した問題を弱点リストから解消
 */
export const resolveWrongQuestion = (questionId: string): void => {
  const state = getInitialStudyProgress();
  state.wrongQuestions = state.wrongQuestions.filter((q) => q.id !== questionId);
  saveStudyProgress(state);
};
