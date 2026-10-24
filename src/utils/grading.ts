/**
 * 韓国語テスト採点・あいまい一致判定ユーティリティ (v2.0 パターンプラクティス対応)
 */

export type MatchQuality = 'exact' | 'candidate_exact' | 'close' | 'incorrect' | 'empty';

export interface GradeResult {
  isExact: boolean; // 正解
  isClose: boolean; // 惜しい！
  matchQuality: MatchQuality;
  feedbackMessage: string;
  normalizedInput: string;
  matchedAnswer: string;
}

// 文字列の正規化（トリム、余分な空白・記号の除去）
export function normalizeKorean(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\.,\?!~「」『』\(\)\[\]［］]/g, '') // 句読点・記号除去
    .replace(/\s+/g, '') // 空白除去
    .trim();
}

// レーベンシュタイン距離計算（類似度判定）
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * 文法活用の自然な表記揺れを自動展開する（ヘヨ体 / ハムニダ体 / 縮約形）
 * 例: "가게 되었어요" -> ["가게 되었어요", "가게 됐어요", "가게 되었습니다"]
 */
export function expandGrammarVariants(candidates: string[]): string[] {
  const expanded = new Set<string>();

  for (const cand of candidates) {
    const trimmed = cand.trim();
    if (!trimmed) continue;
    expanded.add(trimmed);

    // 1. 되었어요 <-> 됐어요 の相互展開
    if (trimmed.includes('되었어요')) {
      expanded.add(trimmed.replace(/되었어요/g, '됐어요'));
      expanded.add(trimmed.replace(/되었어요/g, '되었습니다'));
    } else if (trimmed.includes('됐어요')) {
      expanded.add(trimmed.replace(/됐어요/g, '되었어요'));
      expanded.add(trimmed.replace(/됐어요/g, '됐습니다'));
    }

    // 2. 過去形 -았/었어요 <-> -았/었습니다
    if (trimmed.endsWith('았어요')) {
      expanded.add(trimmed.slice(0, -3) + '았습니다');
    } else if (trimmed.endsWith('었어요')) {
      expanded.add(trimmed.slice(0, -3) + '었습니다');
    } else if (trimmed.endsWith('했어요')) {
      expanded.add(trimmed.slice(0, -3) + '했습니다');
    } else if (trimmed.endsWith('았습니다')) {
      expanded.add(trimmed.slice(0, -4) + '았어요');
    } else if (trimmed.endsWith('었습니다')) {
      expanded.add(trimmed.slice(0, -4) + '었어요');
    } else if (trimmed.endsWith('했습니다')) {
      expanded.add(trimmed.slice(0, -4) + '했어요');
    }

    // 3. 現在形 -아요/어요 <-> -ㅂ니다/습니다
    if (trimmed.endsWith('아요') && !trimmed.endsWith('았어요')) {
      expanded.add(trimmed.slice(0, -2) + '습니다');
    } else if (trimmed.endsWith('어요') && !trimmed.endsWith('었어요')) {
      expanded.add(trimmed.slice(0, -2) + '습니다');
    }
  }

  return Array.from(expanded);
}

export function gradeAnswer(userAnswer: string, rawCandidates: string[]): GradeResult {
  const cleanedInput = userAnswer.trim();
  const normalizedInput = normalizeKorean(userAnswer);

  // 空候補の除外と文法揺れの自動展開
  const baseCandidates = rawCandidates.map((c) => c.trim()).filter(Boolean);
  const candidates = expandGrammarVariants(baseCandidates);
  const primaryAnswer = baseCandidates[0] || candidates[0] || '';

  if (!cleanedInput) {
    return {
      isExact: false,
      isClose: false,
      matchQuality: 'empty',
      feedbackMessage: '答えを入力してね！',
      normalizedInput,
      matchedAnswer: primaryAnswer
    };
  }

  // 1. 完全一致チェック（表記通り）
  for (const candidate of candidates) {
    if (cleanedInput === candidate) {
      return {
        isExact: true,
        isClose: false,
        matchQuality: 'exact',
        feedbackMessage: '🎉 完璧です！その通り！',
        normalizedInput,
        matchedAnswer: candidate
      };
    }
  }

  // 2. スペース・記号無視の正規化一致（分かち書き違いなど）
  for (const candidate of candidates) {
    if (normalizedInput === normalizeKorean(candidate)) {
      return {
        isExact: true,
        isClose: false,
        matchQuality: 'candidate_exact',
        feedbackMessage: '🎉 大正解！自然な表現です！',
        normalizedInput,
        matchedAnswer: candidate
      };
    }
  }

  // 3. 「惜しい！」精密判定
  let bestCandidate = primaryAnswer;
  let minDistance = Infinity;

  for (const candidate of candidates) {
    const normCand = normalizeKorean(candidate);
    const dist = levenshteinDistance(normalizedInput, normCand);
    if (dist < minDistance) {
      minDistance = dist;
      bestCandidate = candidate;
    }

    // 長さの比率を計算（短い入力での安易な部分一致誤判定を徹底防止）
    const lenRatio = normalizedInput.length / normCand.length;

    // ① 入力文字数が正解の75%以上あり、かつ正解に含まれる場合（語尾や助詞の抜け）
    if (lenRatio >= 0.75 && normCand.includes(normalizedInput)) {
      return {
        isExact: false,
        isClose: true,
        matchQuality: 'close',
        feedbackMessage: '👏 あと少し！語尾や助詞を確認してみよう！',
        normalizedInput,
        matchedAnswer: candidate
      };
    }

    // ② ユーザー入力が正解を含んでおり、余計な文字が1〜2文字の場合
    if (normCand.length >= 3 && normalizedInput.includes(normCand) && (normalizedInput.length - normCand.length) <= 2) {
      return {
        isExact: false,
        isClose: true,
        matchQuality: 'close',
        feedbackMessage: '👏 ほぼ正解です！余分な文字をチェックしてみてね！',
        normalizedInput,
        matchedAnswer: candidate
      };
    }
  }

  // レーベンシュタイン距離によるタイポ判定（文字長に応じた厳格閾値）
  const normBest = normalizeKorean(bestCandidate);
  const inputLen = normalizedInput.length;
  const targetLen = normBest.length;

  // 3文字以上の単語で、かつ長さの差が1以内で、距離が1の場合（1文字タイポ）
  if (targetLen >= 3 && Math.abs(inputLen - targetLen) <= 1 && minDistance === 1) {
    return {
      isExact: false,
      isClose: true,
      matchQuality: 'close',
      feedbackMessage: '👏 すごく惜しい！あと1文字でした！',
      normalizedInput,
      matchedAnswer: bestCandidate
    };
  }

  // 6文字以上の長文で距離2の場合
  if (targetLen >= 6 && Math.abs(inputLen - targetLen) <= 1 && minDistance === 2) {
    return {
      isExact: false,
      isClose: true,
      matchQuality: 'close',
      feedbackMessage: '👏 とても惜しいです！あと一歩！',
      normalizedInput,
      matchedAnswer: bestCandidate
    };
  }

  // 4. 不正解（温かい励まし）
  return {
    isExact: false,
    isClose: false,
    matchQuality: 'incorrect',
    feedbackMessage: '🌱 ナイスチャレンジ！解説で違いを確認してみよう！',
    normalizedInput,
    matchedAnswer: bestCandidate
  };
}
