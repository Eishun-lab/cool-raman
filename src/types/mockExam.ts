// ==============================================================================
// 🎓 TOPIK（韓国語能力試験）＆ ハングル検定 模擬試験 型定義
// ==============================================================================

export type ExamType = 'topik1' | 'topik2' | 'hanken_basic' | 'hanken_intermediate';

export type ExamSection = 'listening' | 'vocab' | 'grammar' | 'reading' | 'pronunciation';

export interface PassCriterion {
  level: string;        // 例: "TOPIK 2級", "TOPIK 1級", "ハン検4級"
  minScore: number;     // 必要得点
  color: string;        // バッジ色
  description: string;  // 判定基準説明
}

export interface MockQuestion {
  id: string;
  questionNumber: number;
  section: ExamSection;
  sectionLabel: string; // 例: "【聞き取り】", "【語彙・文法】", "【発音・表記】", "【読解】"
  instruction: string;  // 指示文（例: "音声を聞いて、質問に対する最も自然な答えを選んでください。"）
  audioText?: string;   // 音声再生テキスト（韓国語）
  passage?: string;     // 本文・対話文・案内文
  questionText?: string;// 小問（例: "何についての会話ですか？"）
  options: string[];    // 4択
  correctIndex: number; // 0, 1, 2, 3
  score: number;        // 配点（1問あたり4〜5点）
  explanation: string;  // 日本語解説
  translation?: string; // 全訳
  linkReview?: {
    label: string;      // 例: "第11課: 過去形"
    tab: 'textbook' | 'dictionary' | 'reference' | 'chunks' | 'collocations';
    id: string;         // 例: "lesson-11", "dict-23"
  };
}

export interface MockExam {
  id: ExamType;
  title: string;
  badge: string;
  subtitle: string;
  targetLevel: string;
  timeLimitSeconds: number; // 制限時間（秒単位、例: 1200秒＝20分）
  totalScore: number;       // 100点満点
  questionCount: number;    // 問題数（20問）
  passCriteria: PassCriterion[];
  overview: string;
  questions: MockQuestion[];
}

export interface UserExamSession {
  examId: ExamType;
  startedAt: number;
  completedAt?: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, number>; // questionId -> selectedIndex
  isFinished: boolean;
}

export interface SectionBreakdown {
  section: ExamSection;
  label: string;
  earned: number;
  total: number;
  percentage: number;
}

export interface ExamEvaluation {
  score: number;
  totalScore: number;
  percentage: number;
  achievedRank?: PassCriterion;
  passed: boolean;
  sectionBreakdowns: SectionBreakdown[];
  correctCount: number;
  totalCount: number;
}
