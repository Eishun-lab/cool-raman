import { MockExam, ExamType } from '../../types/mockExam';
import { HANKEN_5_EXAM } from './hanken_5';
import { HANKEN_4_EXAM } from './hanken_4';
import { HANKEN_3_EXAM } from './hanken_3';

export * from './hanken_5';
export * from './hanken_4';
export * from './hanken_3';

// ==============================================================================
// 🎓 ハングル能力検定試験（ハン検）5級・4級・3級 特化公式模擬試験
// ==============================================================================
export const ALL_MOCK_EXAMS: MockExam[] = [
  HANKEN_5_EXAM,
  HANKEN_4_EXAM,
  HANKEN_3_EXAM,
];

export const getMockExamById = (id: string): MockExam | undefined => {
  if (id === 'hanken_basic' || id === 'hanken_5') return HANKEN_5_EXAM;
  if (id === 'hanken_4') return HANKEN_4_EXAM;
  if (id === 'hanken_intermediate' || id === 'hanken_3') return HANKEN_3_EXAM;
  return ALL_MOCK_EXAMS.find((e) => e.id === id) || HANKEN_5_EXAM;
};
