import { MockExam, ExamType } from '../../types/mockExam';
import { HANKEN_5_EXAM } from './hanken_5';
import { HANKEN_4_EXAM } from './hanken_4';
import { HANKEN_3_EXAM } from './hanken_3';
import { HANKEN_PRE2_EXAM } from './hanken_pre2';
import { HANKEN_2_EXAM } from './hanken_2';
import { HANKEN_1_EXAM } from './hanken_1';
import { TOPIK1_MOCK_EXAM } from './topik1';
import { TOPIK2_MOCK_EXAM } from './topik2';

export * from './hanken_5';
export * from './hanken_4';
export * from './hanken_3';
export * from './hanken_pre2';
export * from './hanken_2';
export * from './hanken_1';
export * from './topik1';
export * from './topik2';

// 公式検定基準に準拠した8大単独模擬試験（ハン検 5級・4級・3級・準2級・2級・1級 全級完備 ＋ TOPIK I・II）
export const ALL_MOCK_EXAMS: MockExam[] = [
  HANKEN_5_EXAM,
  HANKEN_4_EXAM,
  HANKEN_3_EXAM,
  HANKEN_PRE2_EXAM,
  HANKEN_2_EXAM,
  HANKEN_1_EXAM,
  TOPIK1_MOCK_EXAM,
  TOPIK2_MOCK_EXAM,
];

export const getMockExamById = (id: string): MockExam | undefined => {
  if (id === 'hanken_basic') return HANKEN_5_EXAM;
  if (id === 'hanken_intermediate') return HANKEN_3_EXAM;
  return ALL_MOCK_EXAMS.find((e) => e.id === id);
};
