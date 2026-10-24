import { AnswerRecord, WordItem } from '../types';

/**
 * エビングハウスの忘却曲線に基づく間隔反復（Spaced Repetition System: SRS）の復習間隔日数
 * Stage 0: 即時・未学習 (0日)
 * Stage 1: 翌日復習 (+1日)
 * Stage 2: 3日後 (+3日)
 * Stage 3: 1週間後 (+7日)
 * Stage 4: 2週間後 (+14日)
 * Stage 5: 1ヶ月後・長期定着 (+30日)
 */
export const SRS_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
export const SRS_MAX_STAGE = SRS_INTERVAL_DAYS.length - 1; // 5

/**
 * Dateオブジェクトを 'YYYY-MM-DD' 形式にフォーマット
 */
export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 今日の日付を 'YYYY-MM-DD' で取得
 */
export function getTodayYMD(): string {
  return formatDateToYMD(new Date());
}

/**
 * 指定日付に日数を加算した 'YYYY-MM-DD' を返す
 */
export function addDaysToYMD(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDateToYMD(result);
}

export interface SrsCalculationResult {
  srsStage: number;
  intervalDays: number;
  nextReviewDate: string;
  lastReviewedAt: string;
  mastered: boolean;
  pinnedForReview: boolean;
}

/**
 * 単語の学習結果（「覚えた(mastered)」または「もう一度(review)」）に基づいて
 * 忘却曲線の次回復習ステージ・復習日を計算する
 */
export function calculateNextReview(
  currentRecord?: Partial<AnswerRecord>,
  isMastered: boolean = false,
  baseDate: Date = new Date()
): SrsCalculationResult {
  const nowIso = baseDate.toISOString();

  if (isMastered) {
    // 現在のステージを特定（既存レコードからのフォールバック含む）
    let currentStage = currentRecord?.srsStage;
    if (currentStage === undefined || currentStage === null) {
      // 過去に既に定着マークされていた場合はStage 1から進行、未定着ならStage 0
      currentStage = currentRecord?.mastered ? 1 : 0;
    }

    // ステージを1段階アップ（最大Stage 5）
    const nextStage = Math.min(SRS_MAX_STAGE, currentStage + 1);
    const intervalDays = SRS_INTERVAL_DAYS[nextStage];
    const nextReviewDate = addDaysToYMD(baseDate, intervalDays);

    return {
      srsStage: nextStage,
      intervalDays,
      nextReviewDate,
      lastReviewedAt: nowIso,
      mastered: true,
      pinnedForReview: false
    };
  } else {
    // 「もう一度（復習）」の場合: ステージをリセット（即日〜翌日復習対象）
    const nextStage = 0;
    const intervalDays = 0;
    // 今日中に再度復習させるため、nextReviewDateは今日の日付
    const nextReviewDate = formatDateToYMD(baseDate);

    return {
      srsStage: nextStage,
      intervalDays,
      nextReviewDate,
      lastReviewedAt: nowIso,
      mastered: false,
      pinnedForReview: true
    };
  }
}

/**
 * 指定した単語が今日復習すべき対象（Due for Review）かどうかを判定する
 */
export function isWordDueForReview(
  record?: Partial<AnswerRecord>,
  todayStr: string = getTodayYMD()
): boolean {
  // レコードが全くない場合は未学習のため学習対象
  if (!record) {
    return true;
  }

  // 1. 「もう一度（要復習★）」がついている単語は最優先で復習
  if (record.pinnedForReview) {
    return true;
  }

  // 2. 次回復習日が明示されている場合
  if (record.nextReviewDate) {
    // 復習予定日が今日以前（<= todayStr）なら復習期日到来
    return record.nextReviewDate <= todayStr;
  }

  // 3. まだ一度も解答・学習されていない単語は学習対象
  if (!record.answeredAt && record.srsStage === undefined) {
    return true;
  }

  // 4. 定着していない単語は復習対象
  if (!record.mastered) {
    return true;
  }

  // 5. 過去の旧レコード（mastered=true だが nextReviewDate が未計算）の場合
  // answeredAt から3日以上経過していれば復習候補に含める
  if (record.answeredAt) {
    try {
      const answeredDate = new Date(record.answeredAt);
      const diffMs = new Date().getTime() - answeredDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays >= 3;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * 単語リストから今日復習すべき単語をフィルタリングして抽出する
 */
export function getDueWordsForToday(
  words: WordItem[],
  records: Record<string, Partial<AnswerRecord>>,
  todayStr: string = getTodayYMD()
): WordItem[] {
  return words.filter((word) => isWordDueForReview(records[word.id], todayStr));
}

/**
 * SRSステージの表示情報（バッジ用テキストやカラー）
 */
export function getSrsStageInfo(stage?: number): {
  stage: number;
  label: string;
  shortLabel: string;
  intervalDays: number;
  isGraduated: boolean;
  colorClass: string;
} {
  const safeStage = stage !== undefined && stage >= 0 ? Math.min(SRS_MAX_STAGE, stage) : 0;
  const intervalDays = SRS_INTERVAL_DAYS[safeStage];

  switch (safeStage) {
    case 5:
      return {
        stage: 5,
        label: '長期定着 (30日後)',
        shortLabel: '長期定着',
        intervalDays,
        isGraduated: true,
        colorClass: 'bg-[#E3EFE6] text-[#2D5A3A] border-[#C2DDC8]'
      };
    case 4:
      return {
        stage: 4,
        label: '定着進行中 (14日後)',
        shortLabel: 'Stage 4',
        intervalDays,
        isGraduated: false,
        colorClass: 'bg-[#E8F2EB] text-[#346642] border-[#CDE1D3]'
      };
    case 3:
      return {
        stage: 3,
        label: '定着初期 (7日後)',
        shortLabel: 'Stage 3',
        intervalDays,
        isGraduated: false,
        colorClass: 'bg-[#EEF6F8] text-[#2B5768] border-[#CFE4EB]'
      };
    case 2:
      return {
        stage: 2,
        label: '短期記憶 (3日後)',
        shortLabel: 'Stage 2',
        intervalDays,
        isGraduated: false,
        colorClass: 'bg-[#FFF8E6] text-[#8C6D1F] border-[#F2E0B6]'
      };
    case 1:
      return {
        stage: 1,
        label: '翌日復習 (1日後)',
        shortLabel: 'Stage 1',
        intervalDays,
        isGraduated: false,
        colorClass: 'bg-[#FAF0EC] text-[#B84E34] border-[#F2DED6]'
      };
    default:
      return {
        stage: 0,
        label: '未学習 / 要復習',
        shortLabel: '未定着',
        intervalDays: 0,
        isGraduated: false,
        colorClass: 'bg-[#F2ECE1] text-[#756D63] border-[#E2DDD2]'
      };
  }
}
