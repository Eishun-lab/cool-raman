// ==============================================================================
// 🎮 HanMoa ゲーミフィケーション ＆ クエスト進行エンジン
// ==============================================================================

export interface GamificationState {
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  unlockedStage: number; // 1〜8 (初期値: 1)
  freeExploreMode: boolean; // 自由探索モード（全解放）
  completedQuests: Record<string, boolean>; // "s1_t0" -> true
  clearedBossExams: Record<string, number>; // examId -> highestScore
  todayCompletedMissions: Record<string, boolean>; // missionId -> true
}

const STORAGE_KEY = 'hanmoa_gamification_v2';

export const LEVEL_TIERS = [
  { level: 1, minXp: 0, title: 'ハングル冒険者', badge: '🌱 Lv.1', desc: '文字と発音の旅路がスタート！' },
  { level: 2, minXp: 120, title: '入門サバイバー', badge: '🔤 Lv.2', desc: 'ハングルと基本挨拶を習得！' },
  { level: 3, minXp: 300, title: '初級トラベラー', badge: '☕ Lv.3', desc: '日常短文で意思疎通ができる！' },
  { level: 4, minXp: 600, title: '初級コミュニケーター', badge: '🏰 Lv.4', desc: '旅行や日常会話が自立！' },
  { level: 5, minXp: 1100, title: '中級スピーカー', badge: '🚀 Lv.5', desc: '間接話法と敬語で社会会話！' },
  { level: 6, minXp: 1800, title: '論理ディベーター', badge: '📊 Lv.6', desc: 'ニュースや社会問題で議論可能！' },
  { level: 7, minXp: 2800, title: 'アカデミックプロ', badge: '🎓 Lv.7', desc: '専門商談・論述作文を自在に展開！' },
  { level: 8, minXp: 4200, title: 'ネイティブマスター', badge: '👑 Lv.8', desc: '韓国語の最高峰に到達！' },
];

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitialGamificationState = (): GamificationState => {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // 日付が変わっていたらストリーク判定
      if (parsed.lastActiveDate !== today) {
        const last = new Date(parsed.lastActiveDate || '2000-01-01');
        const curr = new Date(today);
        const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          // 昨日やっていればストリーク+1
          parsed.streakDays = (parsed.streakDays || 0) + 1;
        } else if (diffDays > 1) {
          // 2日以上空いていればストリークリセット
          parsed.streakDays = 1;
        }
        parsed.lastActiveDate = today;
        parsed.todayCompletedMissions = {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return {
        xp: parsed.xp || 0,
        streakDays: Math.max(1, parsed.streakDays || 1),
        lastActiveDate: parsed.lastActiveDate || today,
        unlockedStage: parsed.unlockedStage || 1,
        freeExploreMode: !!parsed.freeExploreMode,
        completedQuests: parsed.completedQuests || {},
        clearedBossExams: parsed.clearedBossExams || {},
        todayCompletedMissions: parsed.todayCompletedMissions || {},
      };
    }
  } catch (e) {
    console.error('Failed to load gamification state', e);
  }

  return {
    xp: 0,
    streakDays: 1,
    lastActiveDate: today,
    unlockedStage: 1,
    freeExploreMode: false,
    completedQuests: {},
    clearedBossExams: {},
    todayCompletedMissions: {},
  };
};

export const saveGamificationState = (state: GamificationState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save gamification state', e);
  }
};

export const calculateLevelInfo = (xp: number) => {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || null;
    }
  }

  const nextTierXp = nextTier ? nextTier.minXp : currentTier.minXp + 2000;
  const prevTierXp = currentTier.minXp;
  const progressPercent = Math.min(
    100,
    Math.round(((xp - prevTierXp) / (nextTierXp - prevTierXp)) * 100)
  );

  return {
    currentTier,
    nextTier,
    progressPercent: Math.max(0, progressPercent),
    neededXp: Math.max(0, nextTierXp - xp),
  };
};
