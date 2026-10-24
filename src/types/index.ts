export interface WordContrastPair {
  korean: string;
  japanese: string;
  nuance: string;
}

export interface WordEtymologyPart {
  part: string;
  meaning: string;
}

export interface WordCollocation {
  phrase: string;
  meaning: string;
  situation?: string;
}

export interface WordQuickCheck {
  question: string;
  answer: string;
  hint?: string;
}

export interface WordTypeNetwork {
  contrastPairs?: WordContrastPair[]; // ① 類型・対比ペア（違いで覚える）
  etymologyParts?: WordEtymologyPart[]; // ② パーツ分解・語源（漢字・接尾辞）
  collocations?: WordCollocation[]; // ③ リアル生活コロケーション（日常の組み合わせ）
  quickCheck?: WordQuickCheck; // ④ 1秒アウトプットチェック
}

// 単語・表現の3段階（A/B/C）ラベリング
// A: 必修コア（3〜5個厳選・今週必須）
// B: 中級表現（会話拡張・余力確認）
// C: 信仰・文脈（御言葉・祈り・固有語彙ストック）
export type WordLevel = 'A' | 'B' | 'C';

export interface WordItem {
  id: string;
  // ① 単語・表現（目標とする韓国語・発音記号付き）
  expression: string;
  // ② 日本語訳（基本の意味）
  meaning: string;
  // ③ あなたの授業発話 (実用 Before)
  studentBefore: string;
  // ④ 自然なネイティブ表現 (実用 After)
  naturalAfter: string;
  // ⑤ 語源・文化背景 (面白エピソード / TMI)
  cultureNote: string;
  // ⑥ 音声テキスト (読み上げ用ハングル)
  audioText: string;

  // 出題・テスト用補足情報
  situationPrompt?: string; // 状況説明（例: 【先週の近況トークより】...）
  fillBlankSentence?: string; // 穴埋め文（例: 수요일 밤부터 어제까지 ________.）
  correctAnswers?: string[]; // 正解判定候補リスト（空欄に入る語句）
  audioHint?: string; // ヒント音声（キーワードのみ）
  bonusTip?: string; // 次に使えるネイティブ表現（例: 「감기 조심하세요」）
  lessonTag?: string; // レッスン番号やタグ（例: "第2回レッスン"）

  // ⑦ 語彙ネットワーク・類型深掘り情報（定着効果最大化）
  typeNetwork?: WordTypeNetwork;

  // ⑧ 3段階ラベリング (A/B/C)
  level?: WordLevel;

  // ⑨ 長文リーダーからの登録単語フラグ
  fromReader?: boolean;

  // ⑩ カテゴリ種別（添削 Before/After or 一般単語）
  categoryType?: 'correction' | 'vocab';
}

export interface GrammarNoteExample {
  korean: string;
  japanese: string;
  note?: string;
}

export interface GrammarNote {
  id: string;
  title: string;
  subtitle?: string;
  explanation: string;
  examples?: GrammarNoteExample[];
}

export interface AnswerRecord {
  wordId: string;
  userAnswer: string;
  isCorrect: boolean;
  isClose: boolean; // 「惜しい！」判定
  answeredAt: string;
  pinnedForReview: boolean; // ユーザー自身による復習ピン留め
  studentNote?: string; // 先生への質問メモなど
  mastered?: boolean; // 定着済みフラグ（生徒が「覚えた」とマーク）

  // SRS（忘却曲線・間隔反復）用フィールド
  srsStage?: number; // 0: 未学習, 1: 1日後, 2: 3日後, 3: 7日後, 4: 14日後, 5: 30日後 (長期定着)
  lastReviewedAt?: string; // 最終復習日時 (ISO 8601)
  nextReviewDate?: string; // 次回復習予定日 (YYYY-MM-DD)
  intervalDays?: number; // 現在の復習間隔日数
}

export interface TestLesson {
  id: string;
  title: string; // テスト名（例: "第2回レッスン"）
  studentName: string; // 対象生徒名（例: "田中さん"）
  createdAt: string;
  updatedAt: string;
  stage?: number; // 1年ロードマップの現在地（Stage 1〜15、デフォルト 5）
  homework?: string; // 宿題・次回予定メモ
  videoUrl?: string; // 授業動画URL（YouTube限定公開等）
  words: WordItem[];
  grammarNotes?: GrammarNote[];
}

export interface SharePayload {
  title: string;
  studentName?: string;
  stage?: number; // 1年ロードマップの現在地（Stage 1〜15）
  homework?: string; // 宿題・次回予定メモ
  videoUrl?: string; // 授業動画URL（YouTube限定公開等）
  words: WordItem[];
  grammarNotes?: GrammarNote[];
}

export type AppMode = 'student' | 'teacher';

export * from './guide';


// ロードマップのステージ定義（初級〜中級〜上級〜最上級・全30ステージ）
export type RoadmapPhaseId = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7';

export interface RoadmapStage {
  stageNumber: number; // 1〜30
  quarter: RoadmapPhaseId;
  quarterTitle: string; // 【土台期】など
  topikLevel: string; // 1級（初級1）/ CEFR A1 など
  goalTitle: string; // 到達目標
  description: string; // 言語機能の詳細
  grammarScope: string[]; // 必須文法・構文帯（文法書準拠）
  lessonExamples?: string[]; // レッスン対応例
}


// スマート長文リーダー用データモデル
export interface ReaderSentence {
  id: string;
  paragraphIndex: number;
  sentenceIndex: number;
  korean: string;
  japanese?: string;
}

export interface ReaderArticle {
  id: string;
  title: string;
  category?: 'holy_spirit' | 'general' | string; // 'holy_spirit'（聖霊の経緯）など
  categoryLabel?: string;                        // 表示用ラベル（例: '聖霊の経緯'）
  isShared?: boolean;                            // 既存データ互換用フラグ（DB互換性を完全保持）
  studentName?: string;                          // 特定生徒固有の場合に指定（空なら共通教材）
  koreanText: string;
  japaneseText?: string;
  sentences?: { kr: string; jp?: string }[];
  createdAt: string;
  updatedAt: string;
}


