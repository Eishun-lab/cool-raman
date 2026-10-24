import { WordItem, GrammarNote, TestLesson } from '../types';
import { LESSONS_DATA } from '../data/lessons';
import { GRAMMAR_DICT_DATA } from '../data/dictionary';
import { CONFUSING_PAIRS_DATA } from '../data/confusingPairs';
import { CONVERSATION_CHUNKS_DATA } from '../data/chunks';
import { COLLOCATIONS_DATA } from '../data/collocations';
import { ESSENTIAL_VOCAB_DATA } from '../data/koreanVocabularyData';

export interface GuideLinkItem {
  id: string; // e.g. 'dict-1', 'lesson-14', 'vocab-v-1', 'numbers-ch3'
  type: 'dict' | 'lesson' | 'vocab' | 'numbers';
  label: string; // e.g. '📖 第14課: 願望', '🔖 辞書: -고 싶다'
  targetId: string;
  anchor: string; // anchor in StudyGuideView
}

export interface MyLessonExampleMatch {
  lessonId: string;
  lessonTitle: string;
  wordId: string;
  expression: string;
  type: 'correction' | 'vocab';
  studentBefore?: string;
  naturalAfter: string;
  meaning: string;
  cultureNote?: string;
}

// 文法辞書の正規化パターン生成（検索用）
const DICT_PATTERNS = GRAMMAR_DICT_DATA.map((dict) => {
  // No.68 '-보다'（〜より：比較）が動詞 '보다'（見る）に誤判定されるのを防ぐ特別ルール
  if (dict.id === 'dict-68') {
    return {
      dict,
      keywords: ['보다 더', '보다 덜', '생각보다', '어제보다', '나보다', '전보다', '것보다'],
      meaning: dict.meaning,
    };
  }

  const rawParts = dict.grammar.split('/');
  const keywords: string[] = [];
  rawParts.forEach((part) => {
    const clean = part
      .replace(/^[-\s]+/, '')
      .replace(/\(.*?\)/g, '')
      .trim();
    if (clean) {
      keywords.push(clean);
      // '다'で終わる用言型文法は語幹（例: '고 싶다' ➔ '고 싶', 'ㄹ 수 있다' ➔ 'ㄹ 수 있'）を追加
      if (clean.endsWith('다') && clean.length >= 3) {
        const stem = clean.slice(0, -1).trim();
        if (stem.length >= 2) {
          keywords.push(stem);
        }
      }
    }

    // 括弧 (으) を含むパターンの展開 (例: '-(으)ㄹ게요' ➔ ['ㄹ게요', '을게요'])
    if (part.includes('(으)')) {
      const withoutEu = part.replace(/^[-\s]+/, '').replace(/\(으\)/g, '').trim();
      const withEu = part.replace(/^[-\s]+/, '').replace(/\(으\)/g, '을').trim();
      if (withoutEu) {
        keywords.push(withoutEu);
        if (withoutEu.endsWith('다') && withoutEu.length >= 3) keywords.push(withoutEu.slice(0, -1).trim());
      }
      if (withEu) {
        keywords.push(withEu);
        if (withEu.endsWith('다') && withEu.length >= 3) keywords.push(withEu.slice(0, -1).trim());
      }
    }
  });

  return {
    dict,
    keywords: Array.from(new Set(keywords.filter((k) => k.length >= 2))),
    meaning: dict.meaning,
  };
});

// 教科書の重要単元キーワードマッピング
interface LessonKeywordMap {
  lessonId: string;
  lessonNum: number;
  label: string;
  keywords: string[];
}

const LESSON_KEYWORDS: LessonKeywordMap[] = [
  { lessonId: 'lesson-1', lessonNum: 1, label: '第1課: 発音・パッチム', keywords: ['パッチム', '連音化', '母音', '子音', '읽기'] },
  { lessonId: 'lesson-2', lessonNum: 2, label: '第2課: -예요/이에요', keywords: ['예요', '이에요', '아니에요', '입니다', '입니까'] },
  { lessonId: 'lesson-3', lessonNum: 3, label: '第3課: 指示詞・存在', keywords: ['이것', '그것', '저것', '여기', '저기', '거기'] },
  { lessonId: 'lesson-4', lessonNum: 4, label: '第4課: -있어요/없어요', keywords: ['있어요', '없어요', '있다', '없다', '있었어요', '없었어요'] },
  { lessonId: 'lesson-5', lessonNum: 5, label: '第5課: 基本助詞', keywords: ['은/는', '이/가', '을/를', '에서', '에게', '한테', '하고', '와/과'] },
  { lessonId: 'lesson-6', lessonNum: 6, label: '第6課: ヘヨ体現在', keywords: ['아요', '어요', '해요', 'ヘヨ体', '해요体'] },
  { lessonId: 'lesson-7', lessonNum: 7, label: '第7課: 日常動詞活用', keywords: ['가요', '와요', '먹어요', '마셔요', '봐요', '해요'] },
  { lessonId: 'lesson-8', lessonNum: 8, label: '第8課: 疑問詞', keywords: ['누구', '무엇', '뭐', '어디', '언제', '어떻게', '왜', '얼마'] },
  { lessonId: 'lesson-9', lessonNum: 9, label: '第9課: 過去形 -았/었어요', keywords: ['았어요', '었어요', '했어요', '過去形', '〜ました'] },
  { lessonId: 'lesson-10', lessonNum: 10, label: '第10課: 否定表現', keywords: ['안 ', '지 않아요', '지 않다', '못 ', '否定'] },
  { lessonId: 'lesson-11', lessonNum: 11, label: '第11課: 希望 -고 싶다', keywords: ['고 싶어요', '고 싶다', '고 싶어해요', '〜したい'] },
  { lessonId: 'lesson-12', lessonNum: 12, label: '第12課: 進行形 -고 있다', keywords: ['고 있어요', '고 있다', '〜している'] },
  { lessonId: 'lesson-13', lessonNum: 13, label: '第13課: 意志 -(으)ㄹ게요', keywords: ['ㄹ게요', '을게요', '〜しますね'] },
  { lessonId: 'lesson-14', lessonNum: 14, label: '第14課: 予定 -(으)ㄹ 거예요', keywords: ['ㄹ 거예요', '을 거예요', '〜する予定', '未来'] },
  { lessonId: 'lesson-15', lessonNum: 15, label: '第15課: 可能 -(으)ㄹ 수 있다', keywords: ['ㄹ 수 있어요', '을 수 있어요', 'ㄹ 수 없', '〜できる'] },
  { lessonId: 'lesson-16', lessonNum: 16, label: '第16課: 許可・禁止', keywords: ['아도 돼요', '어도 돼요', '해도 돼요', '면 안 돼요', '〜してもいい'] },
  { lessonId: 'lesson-17', lessonNum: 17, label: '第17課: 義務 -아/어야 하다', keywords: ['아야 해요', '어야 해요', '해야 해요', '아야 돼요', '어야 돼요', '해야 돼요', '〜しなければ'] },
  { lessonId: 'lesson-18', lessonNum: 18, label: '第18課: 経験 -아/어 보다', keywords: ['아 봤어요', '어 봤어요', '해 봤어요', '아 보다', '〜したことがある', '〜してみる'] },
  { lessonId: 'lesson-19', lessonNum: 19, label: '第19課: 理由 -아서/어서', keywords: ['아서', '어서', '해서', '으니까', '기 때문에', '〜ので', '〜から'] },
  { lessonId: 'lesson-20', lessonNum: 20, label: '第20課: 順序・同時', keywords: ['고 나서', '으면서', '면서', '기 전에', 'ㄴ 후에', '〜したあと', '〜しながら'] },
  { lessonId: 'lesson-21', lessonNum: 21, label: '第21課: 条件 -(으)면', keywords: ['면', '으면', '〜なら', '〜たら'] },
  { lessonId: 'lesson-22', lessonNum: 22, label: '第22課: 逆接 -지만 / -는데', keywords: ['지만', '는데', '은데', 'ㄴ데', '〜けれど'] },
  { lessonId: 'lesson-23', lessonNum: 23, label: '第23課: 目的 -(으)러 / -(으)려고', keywords: ['러 가요', '으러 가요', '려고 해요', '으려고 해요', '〜しに', '〜しようと'] },
  { lessonId: 'lesson-24', lessonNum: 24, label: '第24課: 時 -(으)ㄹ 때', keywords: ['ㄹ 때', '을 때', '자마자', '〜する時', '〜するとすぐ'] },
  { lessonId: 'lesson-25', lessonNum: 25, label: '第25課: 推量・予想', keywords: [' 것 같아요', ' 것 같아', 'ㄹ 텐데', '〜だと思う', '〜のようだ'] },
  { lessonId: 'lesson-26', lessonNum: 26, label: '第26課: 比較・選択', keywords: ['보다', '더 ', '제일', '가장', '거나', '〜より', '一番'] },
  { lessonId: 'lesson-27', lessonNum: 27, label: '第27課: 変則活用', keywords: ['ㄷ変則', 'ㅂ変則', 'ㅅ変則', '르変則', 'ㅎ変則', '으脱落', 'ㄹ脱落'] },
  { lessonId: 'lesson-28', lessonNum: 28, label: '第28課: 連体形', keywords: ['는 ', '은 ', 'ㄴ ', '을 ', 'ㄹ ', '連体形'] },
  { lessonId: 'lesson-29', lessonNum: 29, label: '第29課: 敬語・尊敬表現', keywords: ['시-', '세요', '으세요', '드리다', '계시다', '드시다', '말씀'] },
  { lessonId: 'lesson-30', lessonNum: 30, label: '第30課: 間接話法', keywords: ['다고 해요', '다고 하', '대요', '냐고', '라고', '자고', '間接話法'] },
];

// 数字・単位の判定キーワード
const NUMBER_KEYWORDS = [
  '원', '만 원', '천 원', '몇 시', '시 반', '시간', '분', '초',
  '개', '명', '분', '살', '마리', '잔', '권', '대', '장', '병', '켤레', '번',
  '월', '일', '년', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일',
  '어제', '오늘', '내일', '모레', '하루', '이틀', '사흘', '나흘',
  '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열',
  '스물', '스무', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십', '백', '천', '만',
];

/**
 * 授業ノートの単語・添削カードから関連するバイブル項目（教科書・辞書・単語・数字）を自動検出
 */
export function findGuideLinksForWord(item: WordItem): GuideLinkItem[] {
  const links: GuideLinkItem[] = [];
  const textToSearch = [
    item.naturalAfter,
    item.expression,
    item.meaning,
    item.cultureNote,
    item.studentBefore,
  ]
    .filter(Boolean)
    .join(' ');

  if (!textToSearch.trim()) return [];

  // ① 文法辞書 (GRAMMAR_DICT_DATA: 80選) のマッチング
  for (const { dict, keywords } of DICT_PATTERNS) {
    const isMatched = keywords.some((kw) => textToSearch.includes(kw));
    if (isMatched) {
      links.push({
        id: `dict-${dict.id}`,
        type: 'dict',
        label: `🔖 No.${dict.no} ${dict.grammar.split('/')[0].trim()}`,
        targetId: dict.id,
        anchor: dict.id,
      });
      if (links.length >= 2) break; // 辞書は最大2件
    }
  }

  // ② 教科書 (LESSONS_DATA: 30課) のマッチング
  for (const map of LESSON_KEYWORDS) {
    const isMatched = map.keywords.some((kw) => textToSearch.includes(kw));
    if (isMatched) {
      links.push({
        id: `lesson-${map.lessonId}`,
        type: 'lesson',
        label: `📖 ${map.label}`,
        targetId: map.lessonId,
        anchor: map.lessonId,
      });
      if (links.filter((l) => l.type === 'lesson').length >= 1) break; // 教科書は最大1件
    }
  }

  // ③ 重要単語300選 (ESSENTIAL_VOCAB_DATA) のマッチング
  const expClean = item.expression.trim();
  const natClean = (item.naturalAfter || '').trim();
  const matchedVocab = ESSENTIAL_VOCAB_DATA.find(
    (v) =>
      v.word === expClean ||
      v.word === natClean ||
      (v.presentForm && (expClean.includes(v.presentForm) || natClean.includes(v.presentForm)))
  );
  if (matchedVocab) {
    links.push({
      id: `vocab-${matchedVocab.id}`,
      type: 'vocab',
      label: `🔤 重要単語: ${matchedVocab.word} (${matchedVocab.meaning})`,
      targetId: matchedVocab.id,
      anchor: matchedVocab.id,
    });
  }

  // ④ 数字・時刻・単位ガイドのマッチング
  const hasNumberMatch = NUMBER_KEYWORDS.some((kw) => textToSearch.includes(kw));
  if (hasNumberMatch && !links.some((l) => l.type === 'numbers')) {
    links.push({
      id: 'numbers-guide',
      type: 'numbers',
      label: '🔢 数字・時刻・助数詞マスター',
      targetId: 'numbers-guide',
      anchor: 'numbers-guide',
    });
  }

  // 最大3件までに制限してスッキリ表示
  return links.slice(0, 3);
}

/**
 * 授業ノートの文法コラムから関連するバイブル項目を自動検出
 */
export function findGuideLinksForGrammar(note: GrammarNote): GuideLinkItem[] {
  const links: GuideLinkItem[] = [];
  const textToSearch = [
    note.title,
    note.subtitle,
    note.explanation,
    ...(note.examples?.map((ex) => `${ex.korean} ${ex.japanese}`) || []),
  ].join(' ');

  // ① 文法辞書
  for (const { dict, keywords } of DICT_PATTERNS) {
    if (keywords.some((kw) => textToSearch.includes(kw))) {
      links.push({
        id: `dict-${dict.id}`,
        type: 'dict',
        label: `🔖 No.${dict.no} ${dict.grammar.split('/')[0].trim()}`,
        targetId: dict.id,
        anchor: dict.id,
      });
      if (links.length >= 2) break;
    }
  }

  // ② 教科書
  for (const map of LESSON_KEYWORDS) {
    if (map.keywords.some((kw) => textToSearch.includes(kw))) {
      links.push({
        id: `lesson-${map.lessonId}`,
        type: 'lesson',
        label: `📖 ${map.label}`,
        targetId: map.lessonId,
        anchor: map.lessonId,
      });
      break;
    }
  }

  return links.slice(0, 3);
}

/**
 * 【バイブル ➔ ノート逆引き】
 * マスターバイブルの各単元（教科書・辞書・単語）について、生徒の全レッスンノートから実例を逆引き検索
 */
export function findMyLessonExamplesForGuide(
  guideId: string,
  guideType: 'lesson' | 'textbook' | 'dict' | 'vocab' | 'numbers' | 'chunk' | 'colo' | string,
  allLessons: TestLesson[] = []
): MyLessonExampleMatch[] {
  if (!allLessons || allLessons.length === 0) return [];

  const results: MyLessonExampleMatch[] = [];

  // 検索条件の構築
  let targetKeywords: string[] = [];

  if (guideType === 'lesson' || guideType === 'textbook') {
    const cleanLessonId = guideId.startsWith('lesson-') ? guideId : `lesson-${guideId}`;
    const map = LESSON_KEYWORDS.find((m) => m.lessonId === cleanLessonId || m.lessonId === guideId);
    if (map) {
      targetKeywords = map.keywords;
    } else {
      const lesson = LESSONS_DATA.find((l) => l.id === cleanLessonId || l.id === guideId);
      if (lesson) {
        targetKeywords = [lesson.title, ...(lesson.rules.items?.map((i) => i.label) || [])];
      }
    }
  } else if (guideType === 'dict') {
    const cleanDictId = guideId.startsWith('dict-') ? guideId : `dict-${guideId}`;
    const pat = DICT_PATTERNS.find((p) => p.dict.id === cleanDictId || p.dict.id === guideId);
    if (pat) {
      targetKeywords = pat.keywords;
    }
  } else if (guideType === 'vocab') {
    const v = ESSENTIAL_VOCAB_DATA.find((item) => item.id === guideId);
    if (v) {
      targetKeywords = [v.word, v.presentForm || '', v.pastForm || ''].filter(Boolean);
    }
  } else if (guideType === 'pair') {
    const pair = CONFUSING_PAIRS_DATA.find((item) => item.id === guideId);
    if (pair) {
      const rawTerms = pair.pairTitle.split(/\s+vs\s+|\s*\/\s*/);
      const kws: string[] = [];
      rawTerms.forEach((term) => {
        const clean = term.replace(/^[-\s]+/, '').replace(/\(.*?\)/g, '').trim();
        if (clean.length >= 2) {
          kws.push(clean);
          // 重要単語データにあれば現在形・過去形も検索対象にする
          const matchedV = ESSENTIAL_VOCAB_DATA.find((v) => v.word === clean);
          if (matchedV) {
            if (matchedV.presentForm) kws.push(matchedV.presentForm);
            if (matchedV.pastForm) kws.push(matchedV.pastForm);
          } else if (clean.endsWith('다') && clean.length >= 3) {
            kws.push(clean.slice(0, -1));
          }
        }
      });
      targetKeywords = Array.from(new Set(kws.filter((k) => k.length >= 2)));
    }
  } else if (guideType === 'chunk') {
    const chunk = CONVERSATION_CHUNKS_DATA.find((item) => item.id === guideId);
    if (chunk && chunk.expression) {
      targetKeywords = chunk.expression
        .split('/')
        .map((s) => s.replace(/[?!.~]/g, '').trim())
        .filter((s) => s.length >= 2);
    }
  } else if (guideType === 'colo') {
    const colo = COLLOCATIONS_DATA.find((item) => item.id === guideId);
    if (colo && colo.expression) {
      const kws: string[] = [];
      colo.expression.split('/').forEach((s) => {
        const clean = s.trim();
        if (clean.length >= 2) {
          kws.push(clean);
          if (clean.endsWith('다') && clean.length >= 4) {
            kws.push(clean.slice(0, -1));
          }
        }
      });
      targetKeywords = kws;
    }
  } else if (guideType === 'numbers') {
    targetKeywords = NUMBER_KEYWORDS;
  }

  if (targetKeywords.length === 0) return [];

  // 全レッスンノートの語彙・添削を走査
  for (const lesson of allLessons) {
    if (!lesson.words) continue;
    for (const w of lesson.words) {
      const natural = w.naturalAfter || w.expression || '';
      const before = w.studentBefore || '';
      const text = `${natural} ${before} ${w.meaning || ''}`;

      const isMatch = targetKeywords.some((kw) => text.includes(kw));
      if (isMatch) {
        const isCorrection = Boolean(w.studentBefore || w.naturalAfter);
        results.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          wordId: w.id,
          expression: natural,
          type: isCorrection ? 'correction' : 'vocab',
          studentBefore: w.studentBefore,
          naturalAfter: natural,
          meaning: w.meaning,
          cultureNote: w.cultureNote,
        });

        // 多すぎて圧迫しないよう最大3件まで
        if (results.length >= 3) {
          return results;
        }
      }
    }
  }

  return results;
}
