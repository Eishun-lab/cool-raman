import { MockExam, ExamType } from '../../types/mockExam';
import { TOPIK1_MOCK_EXAM } from './topik1';
import { TOPIK2_MOCK_EXAM } from './topik2';
import { HANKEN_BASIC_MOCK_EXAM } from './hanken_basic';
import { HANKEN_INTERMEDIATE_MOCK_EXAM } from './hanken_intermediate';

export * from './topik1';
export * from './topik2';
export * from './hanken_basic';
export * from './hanken_intermediate';

export const ALL_MOCK_EXAMS: MockExam[] = [
  TOPIK1_MOCK_EXAM,
  TOPIK2_MOCK_EXAM,
  HANKEN_BASIC_MOCK_EXAM,
  HANKEN_INTERMEDIATE_MOCK_EXAM,
];

export const getMockExamById = (id: ExamType): MockExam | undefined => {
  return ALL_MOCK_EXAMS.find((e) => e.id === id);
};
