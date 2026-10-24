export type SkillCategory = 'listening' | 'reading' | 'vocab' | 'grammar';
export type StageLevel = 1 | 2 | 3 | 4;

export interface LevelCheckQuestion {
  id: string;
  category: SkillCategory;
  stage: StageLevel;
  question: string;
  audioText?: string; // リスニング問題用の音声テキスト
  promptSubtitle?: string; // 補足文（例：「音声を聞いて自然な返答を選んでください」）
  options: string[]; // 4つの選択肢
  correctIndex: number; // 正解のインデックス (0-3)
  explanation: string; // 解説
  conversationTip: string; // 口頭会話・直感的なアドバイス
  recommendedLesson: number; // 関連する教科書の課番号
}

export interface UserAnswerRecord {
  questionId: string;
  category: SkillCategory;
  stage: StageLevel;
  selectedIndex: number;
  isCorrect: boolean;
  timeTakenSeconds: number;
}

export interface LevelCheckResult {
  totalScore: number; // 0-16
  maxScore: number; // 16
  totalTimeSeconds: number;
  averageTimePerQuestion: number;
  categoryScores: Record<SkillCategory, { correct: number; total: number }>;
  stageScores: Record<StageLevel, { correct: number; total: number }>;
  determinedStage: StageLevel;
  stageTitle: string;
  badge: string;
  summary: string;
  intuitionEvaluation: {
    title: string;
    description: string;
    speedTag: 'instant' | 'moderate' | 'deliberate';
  };
  recommendedLesson: number;
  records: UserAnswerRecord[];
}
