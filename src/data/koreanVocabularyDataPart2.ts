// ==============================================================================
// 韓国語 最重要・必須コア単語 Part 2 (No.501〜1000: 計500語)
// 中級〜中上級 完全網羅マスター
// ==============================================================================
import { EssentialVocabItem } from './koreanVocabularyData';
import { VOCAB_PART2_VERBS } from './vocab/vocabPart2_verbs';
import { VOCAB_PART2_ADJ_ADV } from './vocab/vocabPart2_adj_adv';
import { VOCAB_PART2_NOUNS_1 } from './vocab/vocabPart2_nouns_1';
import { VOCAB_PART2_NOUNS_2 } from './vocab/vocabPart2_nouns_2';

export const VOCAB_PART_2: EssentialVocabItem[] = [
  ...VOCAB_PART2_VERBS,   // No.501〜600 (動詞100語)
  ...VOCAB_PART2_ADJ_ADV, // No.601〜670 (形容詞70語) + No.671〜720 (副詞50語)
  ...VOCAB_PART2_NOUNS_1, // No.721〜855 (名詞135語: 家族・身体30, 食事30, 時間30, 街交通45)
  ...VOCAB_PART2_NOUNS_2, // No.856〜1000 (名詞145語: 家日用品45, 学校仕事50, 感情関係50)
];
