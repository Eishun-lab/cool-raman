import { LevelCheckResult, StageLevel, UserAnswerRecord, SkillCategory } from './types';

export function evaluateLevelCheck(
  records: UserAnswerRecord[],
  totalTimeSeconds: number
): LevelCheckResult {
  const totalScore = records.filter((r) => r.isCorrect).length;
  const maxScore = records.length;
  const averageTimePerQuestion = records.length > 0 ? totalTimeSeconds / records.length : 0;

  const categoryScores: Record<SkillCategory, { correct: number; total: number }> = {
    listening: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
    vocab: { correct: 0, total: 0 },
    grammar: { correct: 0, total: 0 },
  };

  const stageScores: Record<StageLevel, { correct: number; total: number }> = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 },
  };

  records.forEach((r) => {
    categoryScores[r.category].total += 1;
    if (r.isCorrect) categoryScores[r.category].correct += 1;

    stageScores[r.stage].total += 1;
    if (r.isCorrect) stageScores[r.stage].correct += 1;
  });

  // 総合レベル判定（スコアと各ステージの通過状況から判定）
  let determinedStage: StageLevel = 1;
  let stageTitle = '';
  let badge = '';
  let summary = '';
  let recommendedLesson = 1;

  if (totalScore >= 13) {
    determinedStage = 4;
    badge = '初級完成・会話開花期 / CEFR A2';
    stageTitle = '✨ Level 4: 実戦会話・自動化ステージ';
    summary = '初級の語彙・文法・発音規則はほぼ完全に定着しています！日常会話の大部分をスムーズにやり取りできる実力があります。';
    recommendedLesson = 31; // 第4章（31〜35課）または中級
  } else if (totalScore >= 9) {
    determinedStage = 3;
    badge = '初級の山場突破 / CEFR A1+';
    stageTitle = '🌳 Level 3: 表現拡張・論理接続ステージ';
    summary = '基本文型はマスターし、理由や義務、不規則活用など複数の文を繋げる段階に達しています。語彙の瞬発力を高める時期です。';
    recommendedLesson = 21; // 第3章（21〜30課）
  } else if (totalScore >= 5) {
    determinedStage = 2;
    badge = '初級の骨格 / CEFR A1';
    stageTitle = '🌿 Level 2: 基本パターン自動化ステージ';
    summary = '文字の読みや基本の挨拶・数字は身についています。ヘヨ体や基本時制、場所の助詞の使い分けを口頭で反射的に出せるようにしていきましょう。';
    recommendedLesson = 11; // 第2章（11〜20課）
  } else {
    determinedStage = 1;
    badge = '入門サバイバル / Pre-A1';
    stageTitle = '🌱 Level 1: 音と文字のマッピングステージ';
    summary = '韓国語学習の最高の一歩を踏み出す絶好のタイミングです！まずはハングルの読み方パズルと、耳から覚える基本の挨拶からスタートしましょう。';
    recommendedLesson = 1; // 第1章（1〜10課）
  }

  // 🗣️ 口頭会話・直感力（SLA反射神経）の評価
  let intuitionEvaluation: {
    title: string;
    description: string;
    speedTag: 'instant' | 'moderate' | 'deliberate';
  };

  if (averageTimePerQuestion <= 8) {
    intuitionEvaluation = {
      speedTag: 'instant',
      title: '⚡ 驚異の直感反射神経（直感回路が作動中）',
      description: '頭の中で日本語に翻訳せず、音やイメージで即答できています！この調子で「会話タブの直感フレーズ」や「シャドーイング」を口に出して、身体で覚える学習を継続してください。',
    };
  } else if (averageTimePerQuestion <= 14) {
    intuitionEvaluation = {
      speedTag: 'moderate',
      title: '👍 安定した理解スピード（論理と直感のバランス型）',
      description: '落ち着いて正確に処理できています。ここから会話力を爆発させるには、「理屈を考える時間をゼロにする」ため、基本フレーズを声に出して反復する音読シャドーイングが特効薬になります。',
    };
  } else {
    intuitionEvaluation = {
      speedTag: 'deliberate',
      title: '🧠 知識（論理）先行タイプ（口頭自動化の伸びしろ大）',
      description: '頭の中に文法知識はしっかり入っていますが、一度日本語に訳してから考えているため時間がかかっています。机上の文法勉強は一段落させ、耳から聞いて即座に声に出す「直感トレーニング」へシフトすると、会話の壁を一気に突破できます！',
    };
  }

  return {
    totalScore,
    maxScore,
    totalTimeSeconds,
    averageTimePerQuestion,
    categoryScores,
    stageScores,
    determinedStage,
    stageTitle,
    badge,
    summary,
    intuitionEvaluation,
    recommendedLesson,
    records,
  };
}
