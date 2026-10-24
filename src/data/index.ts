import { GuideIndexItem } from '../types';
import { LESSONS_DATA } from './lessons';
import { QA_DATA, COLUMNS_DATA } from './reference';
import { GRAMMAR_DICT_DATA } from './dictionary';
import { CONVERSATION_CHUNKS_DATA } from './chunks';
import { COLLOCATIONS_DATA } from './collocations';
import { CONFUSING_PAIRS_DATA } from './confusingPairs';
import { KILLER_PHRASES_DATA } from './killerPhrases';
import { SLANG_DATA } from './slang';
import { IDIOMS_PROVERBS_DATA } from './idioms';
import { HANJA_IDIOMS_DATA } from './hanjaIdioms';
import { ADVANCED_WRITING_DATA } from './advancedWriting';

export * from './roadmap';
export * from './lessons';
export * from './reference';
export * from './dictionary';
export * from './chunks';
export * from './collocations';
export * from './confusingPairs';
export * from './killerPhrases';
export * from './slang';
export * from './idioms';
export * from './hanjaIdioms';
export * from './advancedWriting';

export const GUIDE_INDEX: GuideIndexItem[] = [
  // 【道筋・ロードマップ】
  {
    id: 'sec-roadmap',
    tab: 'textbook',
    category: '学習の道筋',
    title: '韓国語 完全制覇ロードマップ（0〜800時間+の学習航海図）',
    keywords: 'ロードマップ 時間 初級 中級 上級 勉強法 ステップ 何時間',
  },


  // 【教科書編】15課
  ...LESSONS_DATA.map((lesson) => ({
    id: lesson.id,
    tab: 'textbook' as const,
    category: `教科書 第${lesson.number}課`,
    title: lesson.title,
    keywords: `${lesson.title} ${lesson.subtitle} ${lesson.concept.description}`,
  })),

  // 【参考書編】Q&A 10選
  ...QA_DATA.map((qa, index) => ({
    id: qa.id,
    tab: 'reference' as const,
    category: `参考書 Q${index + 1}`,
    title: qa.q,
    keywords: `${qa.q} ${qa.a}`,
  })),

  // 【参考書編】特別コラム
  ...COLUMNS_DATA.map((col) => ({
    id: col.id,
    tab: 'reference' as const,
    category: '特別コラム',
    title: col.title,
    keywords: `${col.title} ${col.description}`,
  })),

  // 【参考書編】似ていて紛らわしい表現 36選
  ...CONFUSING_PAIRS_DATA.map((pair) => ({
    id: pair.id,
    tab: 'reference' as const,
    category: `使い分け No.${pair.no}（${pair.partTitle}）`,
    title: `${pair.pairTitle}（${pair.theme}）`,
    keywords: `${pair.pairTitle} ${pair.theme} ${pair.coreDifference} ${pair.trap} ${pair.exA.ko} ${pair.exA.ja} ${pair.exB.ko} ${pair.exB.ja} ${pair.tip}`,
  })),

  // 【辞書編】130選（初級80＋中級50）
  ...GRAMMAR_DICT_DATA.map((dict) => ({
    id: dict.id,
    tab: 'dictionary' as const,
    category: `辞書 No.${dict.no}`,
    title: `${dict.grammar}（${dict.meaning}）`,
    keywords: `${dict.grammar} ${dict.meaning} ${dict.connection} ${dict.tip} ${dict.example}`,
  })),

  // 【会話チャンク編】50選
  ...CONVERSATION_CHUNKS_DATA.map((chunk) => ({
    id: chunk.id,
    tab: 'chunks' as const,
    category: `会話 No.${chunk.no}（${chunk.category}）`,
    title: `${chunk.expression} — ${chunk.meaning}`,
    keywords: `${chunk.expression} ${chunk.pronunciation} ${chunk.meaning} ${chunk.politeness} ${chunk.usage} ${chunk.category} ${chunk.dialogue.map(d => `${d.ko} ${d.ja}`).join(' ')}`,
  })),

  // 【助詞コロケーション・イディオム編】50選
  ...COLLOCATIONS_DATA.map((colo) => ({
    id: colo.id,
    tab: 'collocations' as const,
    category: `助詞 No.${colo.no}（${colo.category}）`,
    title: `${colo.expression} — ${colo.meaning}`,
    keywords: `${colo.expression} ${colo.pronunciation} ${colo.meaning} ${colo.trap} ${colo.tip} ${colo.category} ${colo.exampleKo} ${colo.exampleJa}`,
  })),

  // 【直感キラーフレーズ編】80選
  ...KILLER_PHRASES_DATA.map((phrase) => ({
    id: phrase.id,
    tab: 'chunks' as const,
    category: `フレーズ No.${phrase.no}（${phrase.theme}）`,
    title: `${phrase.situationJa}（${phrase.myAnswerJa}）`,
    keywords: `${phrase.situationJa} ${phrase.myAnswerKo} ${phrase.myAnswerJa} ${phrase.questionKo} ${phrase.questionJa} ${phrase.theme} ${phrase.tip || ''}`,
  })),

  // 【若者言葉・スラング・SNS新造語編】60選
  ...SLANG_DATA.map((slang) => ({
    id: slang.id,
    tab: 'slang' as const,
    category: `スラング No.${slang.no}（${slang.category === 'texting' ? 'チャット略語' : slang.category === 'trend' ? '新造語' : slang.category === 'abbreviation' ? '縮約語' : '俗語'}）`,
    title: `${slang.term} — ${slang.meaning}`,
    keywords: `${slang.term} ${slang.reading} ${slang.meaning} ${slang.origin} ${slang.exampleKo} ${slang.exampleJa} ${slang.caution || ''}`,
  })),

  // 【身体慣用句・重要ことわざ編（中級・上級）】40選
  ...IDIOMS_PROVERBS_DATA.map((item) => ({
    id: item.id,
    tab: 'chunks' as const,
    category: `${item.type === 'idiom' ? '身体慣用句' : '重要ことわざ'} No.${item.no}`,
    title: `${item.korean}（${item.literalJa} ➔ ${item.meaningJa}）`,
    keywords: `${item.korean} ${item.reading} ${item.literalJa} ${item.meaningJa} ${item.originOrTip} ${item.exampleKo} ${item.exampleJa}`,
  })),

  // 【上級四字熟語編（5-6級）】40選
  ...HANJA_IDIOMS_DATA.map((item) => ({
    id: item.id,
    tab: 'reference' as const,
    category: `四字熟語 No.${item.no}（${item.hanja}）`,
    title: `${item.hangul}（${item.hanja} : ${item.meaningJa}）`,
    keywords: `${item.hangul} ${item.hanja} ${item.reading} ${item.meaningJa} ${item.explanation} ${item.exampleKo} ${item.exampleJa}`,
  })),

  // 【上級時事・論述・統計表現編（TOPIK 53・54番）】40選
  ...ADVANCED_WRITING_DATA.map((item) => ({
    id: item.id,
    tab: 'reference' as const,
    category: `${item.type === 'topik53' ? '53番 統計要約' : '54番 自由論述'} No.${item.no}（${
      item.category === 'intro' ? '序論' :
      item.category === 'argument' ? '本論' :
      item.category === 'counter' ? '反論' :
      item.category === 'conclusion' ? '結論' :
      item.category === 'survey' ? '調査概要' :
      item.category === 'trend' ? '推移増減' :
      item.category === 'rank' ? '順位比較' : '展望原因'
    }）`,
    title: `${item.korean}（${item.meaningJa}）`,
    keywords: `${item.korean} ${item.reading} ${item.meaningJa} ${item.usageTip} ${item.exampleKo} ${item.exampleJa}`,
  })),
];

