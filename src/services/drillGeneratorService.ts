// ==============================================================================
// ⚡️ HanMoa 課別実戦ドリル ＆ デイリー特訓 生成エンジン
// ==============================================================================

import { LessonData } from '../types';
import { LESSONS_DATA } from '../data/lessons';
import { STAGE_DRILLS, DrillQuestion, QuestDrillData } from '../data/stageMicroDrills';

// 課番号から専用ドリルを生成または取得
export const getDrillForLesson = (lesson: LessonData): QuestDrillData => {
  // ステージ対応ドリルが存在する場合は優先
  const stageMap: Record<number, string> = {
    1: 's1_t0',
    2: 's1_t1',
    3: 's1_t2',
    4: 's1_t3',
    5: 's1_t4',
    11: 's2_t0',
    12: 's2_t1',
    13: 's2_t2',
    21: 's3_t0',
    22: 's3_t1',
    31: 's4_t0',
    32: 's4_t1',
    36: 's5_t0',
  };

  const mappedKey = stageMap[lesson.number];
  if (mappedKey && STAGE_DRILLS[mappedKey]) {
    return STAGE_DRILLS[mappedKey];
  }

  // 例文や落とし穴から自動で高品質な2問ドリルを生成
  const ex0 = lesson.examples[0] || { ko: '한국어 공부해요.', reading: 'ハングゴ コンブヘヨ', ja: '韓国語を勉強します。' };
  const ex1 = lesson.examples[1] || { ko: '내일 만나요.', reading: 'ネイル マンナヨ', ja: '明日会いましょう。' };
  const pitfall = lesson.pitfall;

  const questions: DrillQuestion[] = [
    {
      question: `【例文チェック】「${ex0.ko}」の日本語訳として正しいものはどれですか？`,
      options: [
        ex0.ja.replace(/（.*）/, ''),
        ex1.ja.replace(/（.*）/, ''),
        '昨日友達と会いました。',
        '来週ソウルへ旅行に行きます。',
      ],
      correctIndex: 0,
      explanation: `${ex0.ko}（${ex0.reading}）＝「${ex0.ja}」`,
      audioText: ex0.ko,
    },
    {
      question: `【注意点チェック】第${lesson.number}課のポイントとして正しいものはどれですか？`,
      options: [
        pitfall?.title ? `${pitfall.title}に注意する` : `${lesson.subtitle}のルールを正確に使う`,
        '語末の子音は常に強く息を吐いて激音化させる',
        '過去形はすべて語幹に「-고」を接続する',
        '助詞の은/는と이/가は完全に同じニュアンスで交換可能',
      ],
      correctIndex: 0,
      explanation: pitfall?.content || `${lesson.title}の重要文法ルールです。復習して定着させましょう。`,
      audioText: ex1.ko,
    },
  ];

  return {
    questKey: `lesson_${lesson.number}`,
    title: `第${lesson.number}課：理解度チェックドリル`,
    targetSkill: lesson.subtitle,
    questions,
  };
};

// 今日の3分クイック特訓（全課からランダムに5問抽出）
export const getTodayQuickDrill = (): QuestDrillData => {
  const allQuestions: DrillQuestion[] = [];

  // STAGE_DRILLSから問題を集約
  Object.values(STAGE_DRILLS).forEach((d) => {
    allQuestions.push(...d.questions);
  });

  // 5問シャッフル抽出
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);

  return {
    questKey: 'today_daily_drill',
    title: '今日の3分クイック特訓（実戦5問）',
    targetSkill: '語彙・文法・表現の総合即答力',
    questions: shuffled,
  };
};
