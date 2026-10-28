// ==============================================================================
// 🇰🇷 ハングル能力検定試験（ハン検）5級・4級・3級 特化設定 ＆ カリキュラム
// ==============================================================================

import { ExamType } from '../types/mockExam';
import { LESSONS_DATA } from './lessons';
import { LessonData } from '../types';

export type HankenGradeId = 'grade_5' | 'grade_4' | 'grade_3';

export interface HankenGradeConfig {
  id: HankenGradeId;
  examId: ExamType;
  gradeNumber: number; // 5, 4, 3
  name: string; // '5級（入門）'
  shortName: string; // '5級'
  badgeColor: string;
  tag: string; // '入門・初歩'
  targetTitle: string; // 'ハングル検定 5級 合格対策'
  targetSubtitle: string; // 'ハングル文字の仕組み・必須助詞・基本単語480語'
  description: string;
  lessonStart: number;
  lessonEnd: number;
  wordCount: string; // '約480語'
  passScore: number; // 60
  timeLimitMin: number; // 60
  keyGrammar: string[];
}

export const HANKEN_GRADES: HankenGradeConfig[] = [
  {
    id: 'grade_5',
    examId: 'hanken_5',
    gradeNumber: 5,
    name: '5級（入門）',
    shortName: '5級',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    tag: '入門・初歩',
    targetTitle: 'ハン検 5級 合格コース',
    targetSubtitle: 'ハングルの読み書き・発音変化・基本助詞・基本語彙480語',
    description: 'ハングル文字の母音・子音・パッチムの仕組みから、必須助詞（〜は、〜が、〜を）、指定詞（〜です/ではありません）、基本ヘヨ体、数字の完全攻略。',
    lessonStart: 1,
    lessonEnd: 15,
    wordCount: '約480語',
    passScore: 60,
    timeLimitMin: 60,
    keyGrammar: [
      'ハングルの読み方・パッチム・7大音変化',
      '指定詞（-이에요/예요, -이/가 아니에요）',
      '基本助詞（은/는, 이/가, 을/를, 에, 에서, 하고, 와/과）',
      'ヘヨ体現在形（-아요/어요）',
      '存在詞（있어요/없어요）と位置詞',
      '漢数詞（日付・値段・番号）と固有数詞（個数・時間）',
    ],
  },
  {
    id: 'grade_4',
    examId: 'hanken_4',
    gradeNumber: 4,
    name: '4級（初級）',
    shortName: '4級',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    tag: '初級・会話',
    targetTitle: 'ハン検 4級 合格コース',
    targetSubtitle: '過去形・変則活用・願望/義務/理由・日常会話の完成',
    description: '過去形、変則活用（ㄷ, ㅂ, ㅅ, 르, 으）、願望（-고 싶다）、義務・許可、理由（-아서/어서, -(으)니까）、逆接接続を網羅し、日常的な意思疎通を確実にする。',
    lessonStart: 16,
    lessonEnd: 28,
    wordCount: '約1,070語',
    passScore: 60,
    timeLimitMin: 60,
    keyGrammar: [
      '過去形（-았어요/었어요/했어요）',
      '重要変則活用（ㄷ変則、ㅂ変則、ㅅ変則、르変則、으脱落）',
      '願望（-고 싶다 / -고 싶어하다）',
      '義務・許可（-아야/어야 하다, -아/어 도 되다）',
      '理由・原因（-아서/어서, -(으)니까）のニュアンス使い分け',
      '逆接（-지만, -는데/(으)ㄴ데）',
      '可能・不可能（-(으)ㄹ 수 있다/없다, 못）',
    ],
  },
  {
    id: 'grade_3',
    examId: 'hanken_3',
    gradeNumber: 3,
    name: '3級（実戦）',
    shortName: '3級',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    tag: '初中級・実戦',
    targetTitle: 'ハン検 3級 合格コース',
    targetSubtitle: '用言の連体形・間接話法・絶対敬語・使役受動',
    description: 'ハン検の最大の山場。動詞・形容詞の連体形（現在・過去・未来）、平叙文・疑問文・命令文の間接話法、敬語法、慣用句・ことわざを完全マスター。',
    lessonStart: 29,
    lessonEnd: 35,
    wordCount: '約2,000語',
    passScore: 60,
    timeLimitMin: 60,
    keyGrammar: [
      '連体形（動詞現在-는 / 動詞過去-(으)ㄴ / 動詞未来-(으)ㄹ / 形容詞-(으)ㄴ）',
      '間接話法（伝言・引用：-다고 하다, -냐고 하다, -(으)라고 하다, -자고 하다）',
      '絶対敬語法（主体敬語 -(으)시-, 特殊敬語動詞 주무시다, 드시다, 계시다）',
      '使役（-이/히/리/기/우/추-）と受動の構文',
      '頻出の慣用表現・ことわざ・熟語',
      '複文の論理的接続表現',
    ],
  },
];

export const getHankenGradeConfig = (gradeId: HankenGradeId): HankenGradeConfig => {
  return HANKEN_GRADES.find((g) => g.id === gradeId) || HANKEN_GRADES[0];
};

export const getLessonsForGrade = (gradeId: HankenGradeId): LessonData[] => {
  const config = getHankenGradeConfig(gradeId);
  return LESSONS_DATA.filter(
    (l) => l.number >= config.lessonStart && l.number <= config.lessonEnd
  );
};
