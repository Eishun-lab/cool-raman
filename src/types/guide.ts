export type GuideTab = 'textbook' | 'reference' | 'dictionary' | 'chunks' | 'collocations' | 'phrases' | 'slang' | 'idioms';

export type LevelMode = 'beginner' | 'intermediate' | 'advanced';

export type ItemManualStatus = 'unexplored' | 'learning' | 'mastered';

export interface GuideProgressState {
  missions: string[]; // 🎯 次の授業で使ってみる！（ピン留め項目ID）
  cleared: string[];  // 🟢 過去バージョン互換保持用
  manualStatuses: Record<string, ItemManualStatus>; // ⚪未開拓 / 🟡練習中 / 🟢習得
  missionNotes: Record<string, string>; // 次の授業で何を話すかのネタ出しメモ
}

export interface GuideIndexItem {
  id: string;
  tab: GuideTab;
  category: string;
  title: string;
  keywords: string;
}

export interface RoadmapAcademicBasis {
  officialCanDo: string;
  vocabCount: string;
  grammarScope: string;
}

export interface RoadmapSpeech {
  ko: string;
  reading: string;
  ja: string;
  linguisticPoint: string;
}

export interface RoadmapSlaTips {
  frequentError: string;
  breakthrough: string;
}

export interface RoadmapStep {
  step: number;
  stage: string;
  badge: string;
  timeHours: string;
  stationColor: string;
  academicBasis: RoadmapAcademicBasis;
  representativeSpeech: RoadmapSpeech;
  actionRoutines: string[];
  slaTips: RoadmapSlaTips;
  links: { id: string; label: string; tab?: GuideTab }[];
}


export interface LessonExample {
  ko: string;
  reading: string;
  ja: string;
  note?: string;
}

export interface LessonData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  refLink?: { id: string; label: string; tab: GuideTab };
  concept: {
    title: string;
    description: string;
  };
  rules: {
    title: string;
    items?: { label: string; content: string; sub?: string }[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  };
  examples: LessonExample[];
  pitfall: {
    title: string;
    content: string;
  };
}

export interface QAItem {
  id: string;
  q: string;
  a: string;
  ex1: string;
  ex2: string;
  linkLesson: { id: string; label: string };
}

export interface ColumnCard {
  label: string;
  content: string;
  sub?: string;
}

export interface ColumnData {
  id: string;
  title: string;
  description: string;
  cards: ColumnCard[];
}

export interface GrammarDictItem {
  no: string;
  id: string;
  grammar: string;
  meaning: string;
  connection: string;
  example: string;
  tip: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  linkTextbook?: { id: string; label: string };
}

export interface DialogueLine {
  speaker: 'A' | 'B';
  ko: string;
  reading: string;
  ja: string;
}

export interface ConversationChunkItem {
  no: string;
  id: string;
  category: string;
  expression: string;
  pronunciation: string;
  meaning: string;
  politeness: string;
  usage: string;
  dialogue: DialogueLine[];
}

export interface CollocationItem {
  no: string;
  id: string;
  category: string;
  expression: string;
  pronunciation: string;
  meaning: string;
  trap: string;
  exampleKo: string;
  exampleReading: string;
  exampleJa: string;
  tip: string;
}

/**
 * ① 直感的・感覚先行キラーフレーズ（質問＆自分の答えのペア型）
 */
export interface KillerPhraseItem {
  id: string;
  no: string;
  category: string; // 'friend' | 'emotion' | 'reaction' | 'question_5w1h' | 'daily'
  theme: string;    // テーマ（例: 「友達をつくる」「週末の予定」）
  situationJa: string; // 状況説明
  questionKo: string;   // 質問（相手のセリフ）
  questionReading?: string;
  questionJa: string;
  myAnswerKo: string;    // 自分の答え（まず丸暗記する文）
  myAnswerReading?: string;
  myAnswerJa: string;
  grammarLink?: { id: string; label: string; tab?: GuideTab }; // 感覚→論理のリンク
  tip?: string;
}

/**
 * ③ スラング・新造語・若者言葉
 */
export interface SlangItem {
  id: string;
  no: string;
  term: string;
  reading: string;
  meaning: string;
  origin: string; // 短縮元・由来
  category: 'slang' | 'abbreviation' | 'trend' | 'texting';
  exampleKo: string;
  exampleReading?: string;
  exampleJa: string;
  caution?: string; // 目上NG等の注意
}

/**
 * ④ 身体慣用句 ＆ 重要ことわざ（中級・上級）
 */
export interface IdiomProverbItem {
  id: string;
  no: string;
  type: 'idiom' | 'proverb'; // 身体慣用句 or ことわざ
  korean: string; // 韓国語
  reading: string; // カタカナ発音
  literalJa: string; // 直訳（例：「耳が薄い」）
  meaningJa: string; // 実際の意味（例：「他人の言うことに流されやすい」）
  originOrTip: string; // 由来・イメージ・使い方のコツ
  exampleKo: string;
  exampleReading?: string;
  exampleJa: string;
  category: 'body' | 'mind' | 'life' | 'wisdom'; // 身体・心情・生活・教訓
  level: 'intermediate' | 'advanced';
}

/**
 * ⑤ 👑 上級四字熟語（사자성어）40選
 */
export interface HanjaIdiomItem {
  id: string;
  no: string;
  hangul: string; // ハングル（例：고진감래）
  hanja: string; // 漢字（例：苦盡甘來）
  reading: string; // カタカナ発音
  meaningJa: string; // 日本語の意味（例：苦労の末に楽が来る）
  explanation: string; // 由来と使われ方・TOPIK解説
  exampleKo: string;
  exampleReading?: string;
  exampleJa: string;
  category: 'life' | 'effort' | 'wisdom' | 'relation'; // 人生運命・努力成長・教訓知恵・人間関係
}

/**
 * ⑥ 👑 上級時事・論述・ディスカッション表現（TOPIK 54番・ニュース社説）
 */
export interface AdvancedWritingItem {
  id: string;
  no: string;
  type?: 'topik54' | 'topik53'; // TOPIK 54番自由論述 or TOPIK 53番グラフ統計
  korean: string; // 表現パターン（例：~에 대해 찬반 양론이 팽팽히 맞서고 있다）
  reading: string; // カタカナ発音
  meaningJa: string; // 日本語の意味（例：〜を巡り賛否両論が拮抗している）
  usageTip: string; // 使う場面・作文での配置（序論・本論・結論）
  exampleKo: string;
  exampleJa: string;
  category: 'intro' | 'argument' | 'counter' | 'conclusion' | 'survey' | 'trend' | 'rank' | 'outlook'; // 序論・本論・反論・結論・調査・推移・順位・見通し
}


