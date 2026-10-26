import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Search,
  BookOpen,
  HelpCircle,
  Bookmark,
  Map,
  X,
  ArrowUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MessageCircle,
  Link2,
  Type,
  Eye,
  EyeOff,
  Volume2,
  Target,
  CheckCircle2,
  Plus,
  Check,
  Lock,
  Compass,
  Clock,
  Award,
} from 'lucide-react';
import { GuideTab, GuideProgressState, ItemManualStatus, LevelMode } from '../types/guide';
import {
  GUIDE_INDEX,
  ROADMAP_STEPS,
  LESSONS_DATA,
  QA_DATA,
  COLUMNS_DATA,
  GRAMMAR_DICT_DATA,
  CONVERSATION_CHUNKS_DATA,
  CONVERSATION_CATEGORIES,
  COLLOCATIONS_DATA,
  COLLOCATION_CATEGORIES,
  CONFUSING_PAIRS_DATA,
  CONFUSING_PARTS,
  KILLER_PHRASES_DATA,
  KILLER_PHRASE_CATEGORIES,
  SLANG_DATA,
  IDIOMS_PROVERBS_DATA,
  HANJA_IDIOMS_DATA,
  ADVANCED_WRITING_DATA,
} from '../data';

import {
  ESSENTIAL_VOCAB_DATA,
  VOCAB_CATEGORIES,
} from '../data/koreanVocabularyData';
import { KoreanNumbersGuideView } from './KoreanNumbersGuideView';
import { TestLesson, WordItem } from '../types';
import { findMyLessonExamplesForGuide } from '../utils/guideMatcher';
import { speechService } from '../utils/speech';

// 教科書 4大ステージ（章）定義
const TEXTBOOK_STAGES = [
  {
    id: 'stage-1',
    range: '1-10' as const,
    chapter: '第1章',
    badge: '入門・基礎',
    title: 'ハングルと文法・助詞の土台',
    desc: '読み方パズル・存在詞・ヘヨ体・基本助詞',
    target: 'TOPIK I 1級準備',
    lessonsCount: 10,
    firstLessonId: 'lesson-1',
  },
  {
    id: 'stage-2',
    range: '11-20' as const,
    chapter: '第2章',
    badge: '初級前半',
    title: '日常表現の拡大と重要活用',
    desc: '過去形・否定・変則活用・数字・願望・可能表現',
    target: '日常会話基礎',
    lessonsCount: 10,
    firstLessonId: 'lesson-11',
  },
  {
    id: 'stage-3',
    range: '21-30' as const,
    chapter: '第3章',
    badge: '初級後半・総決算',
    title: '複文・応用と間接話法の基礎',
    desc: '理由・逆接・推量・間接話法4大パターン',
    target: 'TOPIK I 2級・ハン検4級合格',
    lessonsCount: 10,
    firstLessonId: 'lesson-21',
  },
  {
    id: 'stage-4',
    range: '31-35' as const,
    chapter: '第4章',
    badge: '中級への架け橋',
    title: '実戦会話・使役受身・論理複文',
    desc: '間接話法短縮形・使役受身・絶対敬語・中級因果推量',
    target: 'TOPIK II 3〜4級・ハン検3級直結',
    lessonsCount: 5,
    firstLessonId: 'lesson-31',
  },
  {
    id: 'stage-5',
    range: '36-40' as const,
    chapter: '第5章',
    badge: '中級完成・上級突破',
    title: '推量・状態・口語感情・高級論述',
    desc: '推量配慮・動作持続・感情終結語尾・TOPIK論述総決算',
    target: 'TOPIK II 4〜6級・ネイティブ実戦会話',
    lessonsCount: 5,
    firstLessonId: 'lesson-36',
  },
];

// 辞書 6大テーマブロック定義（初級4ブロック＋中級2ブロック）
const DICT_BLOCKS = [
  {
    id: 'block-1',
    range: '1-20' as const,
    label: 'No.01〜20',
    title: '基本願望・意志・義務',
    desc: '-고 싶다, -아/어야 하다, -(으)ㄹ게요 など',
    firstDictId: 'dict-1',
  },
  {
    id: 'block-2',
    range: '21-40' as const,
    label: 'No.21〜40',
    title: '能力・推量・許可・禁止',
    desc: '-(으)ㄹ 수 있다, -(으)ㄹ 줄 알다, -아/어도 되다 など',
    firstDictId: 'dict-21',
  },
  {
    id: 'block-3',
    range: '41-60' as const,
    label: 'No.41〜60',
    title: '時・順序・完了・理由・目的',
    desc: '-(으)ㄹ 때, -자마자, 順序・完了・理由・目的 など',
    firstDictId: 'dict-41',
  },
  {
    id: 'block-4',
    range: '61-80' as const,
    label: 'No.61〜80',
    title: '比較・条件・感嘆・終結',
    desc: '-(으)면, -より, 条件・反語・感嘆・終結 など',
    firstDictId: 'dict-61',
  },
  {
    id: 'block-5',
    range: '81-100' as const,
    label: 'No.81〜100',
    title: '【中級】原因・結果・対比・深化',
    desc: '-느라고, -는 바람에, -기는커녕, -기 마련이다 など',
    firstDictId: 'dict-81',
  },
  {
    id: 'block-6',
    range: '101-130' as const,
    label: 'No.101〜130',
    title: '【中級】高度な論理・慣用・語尾',
    desc: '-는 한편, -다시피, -기 무섭게, -고자 など',
    firstDictId: 'dict-101',
  },
  {
    id: 'block-7',
    range: '131-155' as const,
    label: 'No.131〜155',
    title: '【中級】因果深化・対比・比喩極限',
    desc: '-는 바람에, -탓에, -느니 차라리, -기는커녕 など',
    firstDictId: 'dict-131',
  },
  {
    id: 'block-8',
    range: '156-180' as const,
    label: 'No.156〜180',
    title: '【中上級】客観推論・必然道理・回想終結',
    desc: '-는 모양이다, -기 마련이다, -ㄹ 리가 없다, -더군요 など',
    firstDictId: 'dict-156',
  },
  {
    id: 'block-9',
    range: '181-200' as const,
    label: 'No.181〜200',
    title: '【上級】格調高い文語・接続・感情',
    desc: '-거니와, -을세라, -을망정, -다시피, -아/어 마지않다 など',
    firstDictId: 'dict-181',
  },
  {
    id: 'block-10',
    range: '201-225' as const,
    label: 'No.201〜225',
    title: '【上級】論理展開・限定・背水・終結',
    desc: '-에 비추어 볼 때, -는 한편, -은/는 고사하고, -을 리 만무하다 など',
    firstDictId: 'dict-201',
  },
  {
    id: 'block-11',
    range: '226-250' as const,
    label: 'No.226〜250',
    title: '【最上級】TOPIK最高峰・ビジネス・格調論述',
    desc: '-다시피, -기 짝이 없다, -아/어 마지않다, -을 턱이 만무하다 など',
    firstDictId: 'dict-226',
  },
];

// 若者スラング カテゴリー定義
const SLANG_CATEGORIES = [
  { id: 'trend', label: '🔥 新造語・トレンド' },
  { id: 'texting', label: '📱 チャット略語' },
  { id: 'slang', label: '🗣️ 俗語・口語' },
  { id: 'abbreviation', label: '✂️ 縮約語・文化' },
];

// ❓ Q&A テーマカテゴリー定義
const QA_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'particles', label: '📍 助詞・使い分け' },
  { id: 'grammar_diff', label: '🧩 重要文法・活用' },
  { id: 'speech', label: '🗣️ 語尾・敬語・タメ口' },
  { id: 'pronunciation', label: '🎧 発音・音変化' },
  { id: 'numbers', label: '🔢 数字・助数詞' },
  { id: 'conversation', label: '💬 会話・副詞・疑問詞' },
] as const;

const getQACategory = (qaId: string): string => {
  if (['qa-1', 'qa-2', 'qa-3', 'qa-22', 'qa-23', 'qa-35', 'qa-43'].includes(qaId)) return 'particles';
  if (['qa-9', 'qa-10', 'qa-20', 'qa-21', 'qa-36', 'qa-40'].includes(qaId)) return 'pronunciation';
  if (['qa-7', 'qa-11', 'qa-15', 'qa-26', 'qa-29', 'qa-41', 'qa-42'].includes(qaId)) return 'speech';
  if (['qa-17', 'qa-27', 'qa-37', 'qa-46'].includes(qaId)) return 'numbers';
  if (['qa-12', 'qa-16', 'qa-19', 'qa-44', 'qa-45', 'qa-47'].includes(qaId)) return 'conversation';
  return 'grammar_diff';
};

// 🔖 文法辞書 目的別カテゴリー定義
const GRAMMAR_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'reason', label: '💡 理由・原因' },
  { id: 'desire', label: '✨ 希望・願望' },
  { id: 'ability', label: '🎯 可能・不可能' },
  { id: 'obligation', label: '⚠️ 義務・許可・禁止' },
  { id: 'condition', label: '🔀 条件・仮定' },
  { id: 'time', label: '⏱️ 時・順序' },
  { id: 'conjecture', label: '🔮 推量・推測' },
  { id: 'contrast', label: '⚖️ 対比・逆接' },
  { id: 'quotation', label: '💬 伝聞・引用' },
] as const;

const getGrammarCategory = (item: { grammar: string; meaning: string; tip?: string }): string => {
  const text = `${item.grammar} ${item.meaning} ${item.tip || ''}`;
  if (text.includes('理由') || text.includes('原因') || text.includes('から') || text.includes('ので') || text.includes('せいで') || text.includes('おかげで')) return 'reason';
  if (text.includes('たい') || text.includes('たがる') || text.includes('望む') || text.includes('願う') || text.includes('ほしい')) return 'desire';
  if (text.includes('できる') || text.includes('できない') || text.includes('可能') || text.includes('不可能') || text.includes('仕方') || text.includes('すべ')) return 'ability';
  if (text.includes('なければならない') || text.includes('てもいい') || text.includes('てはいけない') || text.includes('ないで') || text.includes('義務') || text.includes('禁止') || text.includes('許可') || text.includes('べき')) return 'obligation';
  if (text.includes('ば') || text.includes('たら') || text.includes('なら') || text.includes('仮定') || text.includes('条件') || text.includes('としても')) return 'condition';
  if (text.includes('とき') || text.includes('前に') || text.includes('後で') || text.includes('ながら') || text.includes('やいなや') || text.includes('順序') || text.includes('最中') || text.includes('間')) return 'time';
  if (text.includes('ようだ') || text.includes('だろう') || text.includes('推測') || text.includes('推量') || text.includes('そう') || text.includes('みたい') || text.includes('はず')) return 'conjecture';
  if (text.includes('が、') || text.includes('けど') || text.includes('けれど') || text.includes('どころか') || text.includes('反面') || text.includes('対比') || text.includes('逆接') || text.includes('のに')) return 'contrast';
  if (text.includes('そうだ') || text.includes('と言う') || text.includes('引用') || text.includes('伝聞') || text.includes('間接話法') || text.includes('って')) return 'quotation';
  return 'other';
};

const GUIDE_PROGRESS_STORAGE_KEY = 'study_guide_progress_v2';
const LEGACY_GUIDE_PROGRESS_STORAGE_KEY = 'study_guide_progress_v1';

interface StudyGuideViewProps {
  onBackToNote: () => void;
  initialAnchor?: string;
  allLessons?: TestLesson[];
  onJumpToNote?: (lessonId: string, wordId?: string) => void;
  onAddWordToVocab?: (newWord: WordItem) => void;
  existingWords?: WordItem[];
  onOpenShadowing?: () => void;
}

export const StudyGuideView: React.FC<StudyGuideViewProps> = ({
  onBackToNote,
  initialAnchor,
  allLessons,
  onJumpToNote,
  onAddWordToVocab,
  existingWords,
  onOpenShadowing,
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('textbook');
  const [searchQuery, setSearchQuery] = useState('');

  // 🧭 生徒・講師の現在地・ステータス（⚪未開拓 / 🟡練習中 / 🟢習得）・次回ミッションの永続化管理
  const [guideProgress, setGuideProgress] = useState<GuideProgressState>(() => {
    try {
      // v2ストレージを優先、なければv1から移行
      const raw = localStorage.getItem(GUIDE_PROGRESS_STORAGE_KEY) || localStorage.getItem(LEGACY_GUIDE_PROGRESS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const manualStatuses: Record<string, ItemManualStatus> =
          parsed.manualStatuses && typeof parsed.manualStatuses === 'object'
            ? { ...parsed.manualStatuses }
            : {};

        // 過去のcleared配列がある場合は互換性のためmasteredとして引き継ぎ
        if (Array.isArray(parsed.cleared)) {
          parsed.cleared.forEach((id: string) => {
            if (!manualStatuses[id]) {
              manualStatuses[id] = 'mastered';
            }
          });
        }

        return {
          missions: Array.isArray(parsed.missions) ? parsed.missions : [],
          cleared: Array.isArray(parsed.cleared) ? parsed.cleared : [],
          manualStatuses,
          missionNotes: parsed.missionNotes && typeof parsed.missionNotes === 'object' ? parsed.missionNotes : {},
        };
      }
    } catch {
      // ignore
    }
    return { missions: [], cleared: [], manualStatuses: {}, missionNotes: {} };
  });

  const saveGuideProgress = (updater: (prev: GuideProgressState) => GuideProgressState) => {
    setGuideProgress((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(GUIDE_PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // 🎯 次の授業で使ってみる（ピン留め）トグル
  const toggleMission = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveGuideProgress((prev) => {
      const isMission = prev.missions.includes(id);
      const nextMissions = isMission
        ? prev.missions.filter((m) => m !== id)
        : [...prev.missions, id];
      return { ...prev, missions: nextMissions };
    });
  };

  // ⚪未開拓 → 🟡練習中 → 🟢習得 → ⚪未開拓 のワンタップ切り替え
  const cycleItemStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = getItemStatus(id);
    const nextStatus: ItemManualStatus =
      current === 'unexplored' ? 'learning' : current === 'learning' ? 'mastered' : 'unexplored';

    saveGuideProgress((prev) => {
      const nextManual = { ...prev.manualStatuses, [id]: nextStatus };
      let nextCleared = prev.cleared;
      let nextMissions = prev.missions;
      if (nextStatus === 'mastered') {
        if (!nextCleared.includes(id)) nextCleared = [...nextCleared, id];
        nextMissions = nextMissions.filter((m) => m !== id);
      } else {
        nextCleared = nextCleared.filter((c) => c !== id);
      }
      return {
        ...prev,
        manualStatuses: nextManual,
        cleared: nextCleared,
        missions: nextMissions,
      };
    });
  };

  // 講師・生徒が手動でステータス（⚪未開拓 / 🟡練習中 / 🟢習得）を直接指定
  const setItemManualStatus = (id: string, status: ItemManualStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveGuideProgress((prev) => {
      const nextManual = { ...prev.manualStatuses, [id]: status };
      let nextCleared = prev.cleared;
      let nextMissions = prev.missions;
      if (status === 'mastered') {
        if (!nextCleared.includes(id)) nextCleared = [...nextCleared, id];
        nextMissions = nextMissions.filter((m) => m !== id);
      } else {
        nextCleared = nextCleared.filter((c) => c !== id);
      }
      return {
        ...prev,
        manualStatuses: nextManual,
        cleared: nextCleared,
        missions: nextMissions,
      };
    });
  };

  // 🟢 実戦クリア（過去互換トグル）
  const toggleCleared = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = getItemStatus(id);
    const nextStatus: ItemManualStatus = current === 'mastered' ? 'unexplored' : 'mastered';
    setItemManualStatus(id, nextStatus, e);
  };

  // 💡 次回ミッションのネタ出しメモ更新
  const updateMissionNote = (id: string, note: string) => {
    saveGuideProgress((prev) => ({
      ...prev,
      missionNotes: { ...prev.missionNotes, [id]: note },
    }));
  };

  // 現在地ステータスによる絞り込みフィルター
  const [statusFilter, setStatusFilter] = useState<'all' | 'mission' | 'learning' | 'mastered' | 'touched' | 'unexplored'>('all');
  // 現在地・次回ミッションダッシュボードの詳細開閉（デフォルトは閉じて1行スリムバーのみ表示）
  const [showDashboard, setShowDashboard] = useState(false);

  // 1秒めくりへの追加フィードバック管理
  const [addedFeedbackIds, setAddedFeedbackIds] = useState<Record<string, boolean>>({});

  // 文字サイズ調整（標準 or 拡大）
  const [isLargeFont, setIsLargeFont] = useState<boolean>(() => {
    try {
      return localStorage.getItem('study_guide_large_font') === 'true';
    } catch {
      return false;
    }
  });

  const toggleFontSize = () => {
    setIsLargeFont((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('study_guide_large_font', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // スクロール連動ツールバー表示/非表示（下スクロールで自動収納、上スクロールまたは最下部で表示）
  const [showBars, setShowBars] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement?.scrollHeight || document.body.scrollHeight;
          const isAtBottom = windowHeight + currentScrollY >= documentHeight - 50;

          if (currentScrollY < 40 || isAtBottom) {
            setShowBars(true);
          } else if (currentScrollY > lastScrollY.current + 8) {
            setShowBars(false);
          } else if (currentScrollY < lastScrollY.current - 8) {
            setShowBars(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ロードマップの開閉管理（初期状態は閉じた状態ですっきりと）
  const [showRoadmap, setShowRoadmap] = useState(false);
  // 各ロードマップステップのSLA・誤用分析アコーディオン開閉
  const [openRoadmapDetails, setOpenRoadmapDetails] = useState<Record<number, boolean>>({});
  const [expandAllRoadmapDetails, setExpandAllRoadmapDetails] = useState(false);

  const toggleRoadmapDetail = (stepNum: number) => {
    setOpenRoadmapDetails((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const toggleAllRoadmapDetails = () => {
    const nextState = !expandAllRoadmapDetails;
    setExpandAllRoadmapDetails(nextState);
    const newMap: Record<number, boolean> = {};
    ROADMAP_STEPS.forEach((s) => {
      newMap[s.step] = nextState;
    });
    setOpenRoadmapDetails(newMap);
  };

  // 1課集中読書モードで開いているレッスンのID（nullの場合は目次一覧）
  const [readingLessonId, setReadingLessonId] = useState<string | null>(null);

  // 🔰 初級バイブル vs 🌿 中級ステップアップ vs 👑 上級マスタークラウン の完全棲み分けステート
  const [levelMode, setLevelMode] = useState<LevelMode>(() => {
    try {
      return (localStorage.getItem('study_guide_level_mode') as LevelMode) || 'beginner';
    } catch {
      return 'beginner';
    }
  });

  // 📚 各タブの「上のカテゴリーやタブ」の収納（折りたたみ）開閉ステート（初期状態は閉じてコンテンツに集中）
  const [showRefNav, setShowRefNav] = useState(false);
  const [showDictNav, setShowDictNav] = useState(false);
  const [showConversationNav, setShowConversationNav] = useState(false);
  const [showColoNav, setShowColoNav] = useState(false);

  // 教科書の範囲選択（初期表示は第1章 1-10課にして情報過多を防止）
  const [lessonRange, setLessonRange] = useState<'all' | '1-10' | '11-20' | '21-30' | '31-35' | '36-40'>('1-10');

  // 辞書の範囲選択（デフォルトで '1-20' にしてスクロール地獄を防止）
  const [dictRange, setDictRange] = useState<'all' | '1-20' | '21-40' | '41-60' | '61-80' | '81-100' | '101-130' | '131-155' | '156-180' | '181-200' | '201-225' | '226-250'>('1-20');

  // 参考書タブ：似ていて紛らわしい表現 90選 vs 疑問Q&A 47選 vs 特別コラム 6選 vs 👑四字熟語 40選 vs 👑時事論述・統計 40選
  const [refSubTab, setRefSubTab] = useState<'pairs' | 'qa' | 'columns' | 'hanja' | 'writing'>('pairs');

  // 会話タブ内のサブタブ（直感フレーズ 80選 vs 実践チャンク 60選 vs 💡身体慣用句・ことわざ 100選 vs 🔥若者スラング 60選）
  const [conversationSubTab, setConversationSubTab] = useState<'phrases' | 'chunks' | 'idioms' | 'slang'>('phrases');

  // レベル切り替えハンドラー（範囲やサブタブも適切に同期）
  const changeLevelMode = (mode: LevelMode) => {
    setLevelMode(mode);
    try {
      localStorage.setItem('study_guide_level_mode', mode);
    } catch {
      // ignore
    }
    if (mode === 'beginner') {
      if (lessonRange === '31-35' || lessonRange === 'all') setLessonRange('1-10');
      if (['81-100', '101-130', '131-155', '156-180', '181-200', '201-225'].includes(dictRange)) setDictRange('1-20');
      if (conversationSubTab === 'slang' || conversationSubTab === 'idioms') setConversationSubTab('phrases');
      if (refSubTab === 'hanja' || refSubTab === 'writing') setRefSubTab('pairs');
    } else if (mode === 'intermediate') {
      setLessonRange('31-35');
      if (['181-200', '201-225', '226-250'].includes(dictRange)) setDictRange('81-100');
      else if (dictRange === '1-20') setDictRange('81-100');
      setConversationSubTab('idioms');
      if (refSubTab === 'hanja' || refSubTab === 'writing') setRefSubTab('pairs');
    } else if (mode === 'advanced') {
      setActiveTab('reference');
      setRefSubTab('hanja');
      setDictRange('181-200');
    }
  };

  const [confusingCategory, setConfusingCategory] = useState<string>('all');
  const [confusingSearch, setConfusingSearch] = useState<string>('');
  const [openPairs, setOpenPairs] = useState<Record<string, boolean>>({});
  const [expandAllPairs, setExpandAllPairs] = useState(false);

  // 重要単語のページネーション
  const VOCAB_PAGE_SIZE = 25;
  const [vocabPage, setVocabPage] = useState(1);

  // 教科書のインライン開閉管理（初期状態はすべて閉じて極細目次を維持）
  const [openLessons, setOpenLessons] = useState<Record<string, boolean>>({});

  // 参考書Q&Aの開閉・カテゴリー・検索管理
  const [openQAs, setOpenQAs] = useState<Record<string, boolean>>({});
  const [qaCategory, setQaCategory] = useState<string>('all');
  const [qaSearch, setQaSearch] = useState<string>('');
  const [expandAllQAs, setExpandAllQAs] = useState(false);

  // 特別コラムの開閉・一括管理（デフォルトは閉じて目次形式）
  const [openColumns, setOpenColumns] = useState<Record<string, boolean>>({});
  const [expandAllColumns, setExpandAllColumns] = useState(false);

  // 👑 上級四字熟語 40選の管理ステート
  const [hanjaCategory, setHanjaCategory] = useState<'all' | 'life' | 'effort' | 'wisdom' | 'relation'>('all');
  const [hanjaSearch, setHanjaSearch] = useState<string>('');
  const [openHanjas, setOpenHanjas] = useState<Record<string, boolean>>({});
  const [expandAllHanjas, setExpandAllHanjas] = useState(false);

  // 👑 上級時事・論述・統計表現 40選の管理ステート
  const [writingCategory, setWritingCategory] = useState<'all' | 'intro' | 'argument' | 'counter' | 'conclusion' | 'survey' | 'trend' | 'rank' | 'outlook'>('all');
  const [writingSearch, setWritingSearch] = useState<string>('');
  const [openWritings, setOpenWritings] = useState<Record<string, boolean>>({});
  const [expandAllWritings, setExpandAllWritings] = useState(false);

  // 辞書の開閉管理（初期状態は閉じた状態）
  const [openDicts, setOpenDicts] = useState<Record<string, boolean>>({});
  const [grammarCategory, setGrammarCategory] = useState<string>('all');
  const [grammarSearch, setGrammarSearch] = useState<string>('');

  // 会話チャンクの開閉管理（初期状態は閉じた状態）
  const [openChunks, setOpenChunks] = useState<Record<string, boolean>>({});
  const [expandAllChunks, setExpandAllChunks] = useState(false);

  // 助詞コロケーションの開閉管理（初期状態は閉じた状態）
  const [openColos, setOpenColos] = useState<Record<string, boolean>>({});
  const [expandAllColos, setExpandAllColos] = useState(false);

  // 直感フレーズのカテゴリー選択
  const [selectedPhraseCategory, setSelectedPhraseCategory] = useState<string>('all');
  // 直感フレーズの逆翻訳モード（和文→韓国語想起トレーニング）
  const [isReverseMode, setIsReverseMode] = useState<boolean>(false);
  // 逆翻訳モードで開いたフレーズID一覧
  const [revealedPhrases, setRevealedPhrases] = useState<Record<string, boolean>>({});
  // 直感フレーズの開閉管理
  const [openPhrases, setOpenPhrases] = useState<Record<string, boolean>>({});
  const [expandAllPhrases, setExpandAllPhrases] = useState(false);

  // 💡 身体慣用句 ＆ 重要ことわざ（中級・40選）の管理ステート
  const [idiomType, setIdiomType] = useState<'all' | 'idiom' | 'proverb'>('all');
  const [idiomSearch, setIdiomSearch] = useState<string>('');
  const [openIdioms, setOpenIdioms] = useState<Record<string, boolean>>({});
  const [expandAllIdioms, setExpandAllIdioms] = useState(false);

  // 若者スラング・新造語の開閉＆検索管理
  const [selectedSlangCategory, setSelectedSlangCategory] = useState<string>('all');
  const [slangSearch, setSlangSearch] = useState<string>('');
  const [openSlangs, setOpenSlangs] = useState<Record<string, boolean>>({});
  const [expandAllSlangs, setExpandAllSlangs] = useState(false);


  // 1課集中読書モードの計算
  const readingLessonIndex = useMemo(() => {
    if (!readingLessonId) return -1;
    return LESSONS_DATA.findIndex((l) => l.id === readingLessonId);
  }, [readingLessonId]);

  const readingLesson = readingLessonIndex >= 0 ? LESSONS_DATA[readingLessonIndex] : null;
  const prevLesson = readingLessonIndex > 0 ? LESSONS_DATA[readingLessonIndex - 1] : null;
  const nextLesson =
    readingLessonIndex >= 0 && readingLessonIndex < LESSONS_DATA.length - 1
      ? LESSONS_DATA[readingLessonIndex + 1]
      : null;

  // 1課集中読書モード内のステップ選択（'all' | 'concept' | 'rules' | 'examples' | 'pitfall'）
  const [lessonStepTab, setLessonStepTab] = useState<'all' | 'concept' | 'rules' | 'examples' | 'pitfall'>('all');

  // カタカナ発音の表示 ON/OFF（デフォルトON、ワンタップで切替可能）
  const [showPronunciation, setShowPronunciation] = useState<boolean>(() => {
    try {
      return localStorage.getItem('study_guide_show_pronunciation') !== 'false';
    } catch {
      return true;
    }
  });

  const togglePronunciation = () => {
    setShowPronunciation((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('study_guide_show_pronunciation', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // 辞書タブ内のサブタブ（文法逆引き vs 重要単語 vs 数字・単位）
  const [dictSubTab, setDictSubTab] = useState<'grammar' | 'vocab' | 'numbers'>('grammar');
  // 重要単語のカテゴリー選択
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<string>('all');
  // 重要単語の絞り込み検索
  const [vocabSearchQuery, setVocabSearchQuery] = useState('');

  // ボトムシート詳細表示（辞書・会話・助詞・重要単語）
  const [bottomSheetItem, setBottomSheetItem] = useState<{
    type: 'dict' | 'chunk' | 'colo' | 'vocab';
    id: string;
  } | null>(null);

  // ボトムシート表示中アイテムの計算
  const currentBottomSheetData = useMemo(() => {
    if (!bottomSheetItem) return null;
    if (bottomSheetItem.type === 'dict') {
      const idx = GRAMMAR_DICT_DATA.findIndex((d) => d.id === bottomSheetItem.id);
      if (idx === -1) return null;
      return {
        type: 'dict' as const,
        item: GRAMMAR_DICT_DATA[idx],
        index: idx,
        total: GRAMMAR_DICT_DATA.length,
        prevId: idx > 0 ? GRAMMAR_DICT_DATA[idx - 1].id : null,
        nextId: idx < GRAMMAR_DICT_DATA.length - 1 ? GRAMMAR_DICT_DATA[idx + 1].id : null,
      };
    }
    if (bottomSheetItem.type === 'chunk') {
      const idx = CONVERSATION_CHUNKS_DATA.findIndex((c) => c.id === bottomSheetItem.id);
      if (idx === -1) return null;
      return {
        type: 'chunk' as const,
        item: CONVERSATION_CHUNKS_DATA[idx],
        index: idx,
        total: CONVERSATION_CHUNKS_DATA.length,
        prevId: idx > 0 ? CONVERSATION_CHUNKS_DATA[idx - 1].id : null,
        nextId: idx < CONVERSATION_CHUNKS_DATA.length - 1 ? CONVERSATION_CHUNKS_DATA[idx + 1].id : null,
      };
    }
    if (bottomSheetItem.type === 'colo') {
      const idx = COLLOCATIONS_DATA.findIndex((c) => c.id === bottomSheetItem.id);
      if (idx === -1) return null;
      return {
        type: 'colo' as const,
        item: COLLOCATIONS_DATA[idx],
        index: idx,
        total: COLLOCATIONS_DATA.length,
        prevId: idx > 0 ? COLLOCATIONS_DATA[idx - 1].id : null,
        nextId: idx < COLLOCATIONS_DATA.length - 1 ? COLLOCATIONS_DATA[idx + 1].id : null,
      };
    }
    if (bottomSheetItem.type === 'vocab') {
      const idx = ESSENTIAL_VOCAB_DATA.findIndex((v) => v.id === bottomSheetItem.id);
      if (idx === -1) return null;
      return {
        type: 'vocab' as const,
        item: ESSENTIAL_VOCAB_DATA[idx],
        index: idx,
        total: ESSENTIAL_VOCAB_DATA.length,
        prevId: idx > 0 ? ESSENTIAL_VOCAB_DATA[idx - 1].id : null,
        nextId: idx < ESSENTIAL_VOCAB_DATA.length - 1 ? ESSENTIAL_VOCAB_DATA[idx + 1].id : null,
      };
    }
    return null;
  }, [bottomSheetItem]);

  // 会話チャンクのカテゴリー選択（デフォルトで全て表示）
  const [selectedChunkCategory, setSelectedChunkCategory] = useState<string>('all');

  // 助詞コロケーションのカテゴリー選択（デフォルトで全て表示）
  const [selectedColoCategory, setSelectedColoCategory] = useState<string>('all');

  // 全て展開 / 全て折りたたみのトグル
  const [expandAllLessons, setExpandAllLessons] = useState(false);
  const [expandAllDicts, setExpandAllDicts] = useState(false);

  // 初回マウント時またはアンカー指定時の処理
  useEffect(() => {
    if (initialAnchor) {
      if (initialAnchor.startsWith('lesson-')) {
        setActiveTab('textbook');
        setReadingLessonId(initialAnchor);
        setLessonRange('all');
        setOpenLessons((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('qa-')) {
        setActiveTab('reference');
        setOpenQAs((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('dict-')) {
        setActiveTab('dictionary');
        setDictSubTab('grammar');
        setDictRange('all');
        setOpenDicts((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('vocab-')) {
        setActiveTab('dictionary');
        setDictSubTab('vocab');
        setSelectedVocabCategory('all');
        setVocabSearchQuery('');
        setBottomSheetItem({ type: 'vocab', id: initialAnchor });
      } else if (initialAnchor.startsWith('numbers')) {
        setActiveTab('dictionary');
        setDictSubTab('numbers');
      } else if (initialAnchor.startsWith('phrase-')) {
        setActiveTab('chunks');
        setConversationSubTab('phrases');
        setSelectedPhraseCategory('all');
        setOpenPhrases((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('chunk-')) {
        setActiveTab('chunks');
        setConversationSubTab('chunks');
        setSelectedChunkCategory('all');
        setOpenChunks((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('colo-')) {
        setActiveTab('collocations');
        setSelectedColoCategory('all');
        setOpenColos((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('slang-')) {
        setActiveTab('chunks');
        setConversationSubTab('slang');
        setSelectedSlangCategory('all');
        setOpenSlangs((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('idiom-') || initialAnchor.startsWith('proverb-')) {
        setActiveTab('chunks');
        setConversationSubTab('idioms');
        setLevelMode('intermediate');
        setOpenIdioms((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('hanja-')) {
        setActiveTab('reference');
        setRefSubTab('hanja');
        setLevelMode('advanced');
        setOpenHanjas((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('writing-')) {
        setActiveTab('reference');
        setRefSubTab('writing');
        setLevelMode('advanced');
        setOpenWritings((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('pair-')) {
        setActiveTab('reference');
        setRefSubTab('pairs');
        setConfusingCategory('all');
        setConfusingSearch('');
        setOpenPairs((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('qa-')) {
        setActiveTab('reference');
        setRefSubTab('qa');
        setOpenQAs((prev) => ({ ...prev, [initialAnchor]: true }));
      } else if (initialAnchor.startsWith('col-') || initialAnchor.startsWith('column-')) {
        setActiveTab('reference');
        setRefSubTab('columns');
      } else {
        const found = GUIDE_INDEX.find((item) => item.id === initialAnchor);
        if (found) {
          setActiveTab(found.tab === 'phrases' || found.tab === 'slang' ? 'chunks' : found.tab);
          if (found.tab === 'phrases') {
            setConversationSubTab('phrases');
          } else if (found.tab === 'slang') {
            setConversationSubTab('slang');
          }
        }
      }
      setTimeout(() => {
        const el = document.getElementById(initialAnchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  }, [initialAnchor]);

  const scrollTo = (id: string, tab?: GuideTab) => {
    const targetTab = tab === 'phrases' || tab === 'slang' ? 'chunks' : tab;
    if (targetTab && targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
    // 該当の課やQ&Aを展開
    if (id.startsWith('phrase-')) {
      setActiveTab('chunks');
      setConversationSubTab('phrases');
      setOpenPhrases((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('slang-')) {
      setActiveTab('chunks');
      setConversationSubTab('slang');
      setSelectedSlangCategory('all');
      setOpenSlangs((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('idiom-') || id.startsWith('proverb-')) {
      setActiveTab('chunks');
      setConversationSubTab('idioms');
      setLevelMode('intermediate');
      setOpenIdioms((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('hanja-')) {
      setActiveTab('reference');
      setRefSubTab('hanja');
      setLevelMode('advanced');
      setOpenHanjas((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('writing-')) {
      setActiveTab('reference');
      setRefSubTab('writing');
      setLevelMode('advanced');
      setOpenWritings((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('lesson-')) {
      setReadingLessonId(id);
      setLessonRange('all');
      setOpenLessons((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('qa-')) {
      setActiveTab('reference');
      setRefSubTab('qa');
      setOpenQAs((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('pair-')) {
      setActiveTab('reference');
      setRefSubTab('pairs');
      setConfusingCategory('all');
      setConfusingSearch('');
      setOpenPairs((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('col-') || id.startsWith('column-')) {
      setActiveTab('reference');
      setRefSubTab('columns');
    } else if (id.startsWith('dict-')) {
      setDictSubTab('grammar');
      setDictRange('all');
      setOpenDicts((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('vocab-')) {
      setDictSubTab('vocab');
      setSelectedVocabCategory('all');
      setVocabSearchQuery('');
      setBottomSheetItem({ type: 'vocab', id });
    } else if (id.startsWith('chunk-')) {
      setConversationSubTab('chunks');
      setSelectedChunkCategory('all');
      setOpenChunks((prev) => ({ ...prev, [id]: true }));
    } else if (id.startsWith('colo-')) {
      setSelectedColoCategory('all');
      setOpenColos((prev) => ({ ...prev, [id]: true }));
    }


    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // 全バイブル項目の授業ノート実例マップを一括計算
  const myExamplesMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof findMyLessonExamplesForGuide>> = {};
    if (!allLessons || allLessons.length === 0) return map;
    LESSONS_DATA.forEach((l) => {
      map[l.id] = findMyLessonExamplesForGuide(l.id, 'lesson', allLessons);
    });
    GRAMMAR_DICT_DATA.forEach((d) => {
      map[d.id] = findMyLessonExamplesForGuide(d.id, 'dict', allLessons);
    });
    CONFUSING_PAIRS_DATA.forEach((p) => {
      map[p.id] = findMyLessonExamplesForGuide(p.id, 'pair', allLessons);
    });
    ESSENTIAL_VOCAB_DATA.forEach((v) => {
      map[v.id] = findMyLessonExamplesForGuide(v.id, 'vocab', allLessons);
    });
    KILLER_PHRASES_DATA.forEach((p) => {
      map[p.id] = findMyLessonExamplesForGuide(p.id, 'chunk', allLessons);
    });
    CONVERSATION_CHUNKS_DATA.forEach((c) => {
      map[c.id] = findMyLessonExamplesForGuide(c.id, 'chunk', allLessons);
    });
    COLLOCATIONS_DATA.forEach((c) => {
      map[c.id] = findMyLessonExamplesForGuide(c.id, 'colo', allLessons);
    });
    return map;
  }, [allLessons]);

  // 項目の現在地ステータス判定（手動指定優先: 🟢mastered / 🟡learning / ⚪unexplored）
  // 未指定かつ授業実例がある場合はデフォルトで 'learning'（🟡 授業で触れた）
  const getItemStatus = (id: string): ItemManualStatus => {
    if (guideProgress.manualStatuses[id]) {
      return guideProgress.manualStatuses[id];
    }
    if (guideProgress.cleared.includes(id)) {
      return 'mastered';
    }
    if ((myExamplesMap[id]?.length || 0) > 0) {
      return 'learning';
    }
    return 'unexplored';
  };

  const matchesStatusFilter = (id: string): boolean => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'mission') return guideProgress.missions.includes(id);
    const st = getItemStatus(id);
    if (statusFilter === 'learning') return st === 'learning';
    if (statusFilter === 'mastered') return st === 'mastered';
    if (statusFilter === 'touched') return st === 'mastered' || st === 'learning';
    if (statusFilter === 'unexplored') return st === 'unexplored';
    return true;
  };

  // 現在地メーター集計（手動ステータス＆授業実例を集計）
  const progressStats = useMemo(() => {
    const isMastered = (id: string) => getItemStatus(id) === 'mastered';
    const isTouched = (id: string) => getItemStatus(id) !== 'unexplored';

    const lessonTouched = LESSONS_DATA.filter((l) => isTouched(l.id)).length;
    const dictTouched = GRAMMAR_DICT_DATA.filter((d) => isTouched(d.id)).length;
    const pairTouched = CONFUSING_PAIRS_DATA.filter((p) => isTouched(p.id)).length;
    const vocabTouched = ESSENTIAL_VOCAB_DATA.filter((v) => isTouched(v.id)).length;

    // 全アイテム中でのマスター（🟢実戦クリア）数
    const allRegisteredIds = new Set([
      ...LESSONS_DATA.map((l) => l.id),
      ...GRAMMAR_DICT_DATA.map((d) => d.id),
      ...CONFUSING_PAIRS_DATA.map((p) => p.id),
      ...ESSENTIAL_VOCAB_DATA.map((v) => v.id),
      ...KILLER_PHRASES_DATA.map((p) => p.id),
      ...CONVERSATION_CHUNKS_DATA.map((c) => c.id),
      ...COLLOCATIONS_DATA.map((c) => c.id),
      ...guideProgress.cleared,
      ...Object.keys(guideProgress.manualStatuses),
    ]);
    const totalCleared = Array.from(allRegisteredIds).filter((id) => isMastered(id)).length;
    const totalLearning = Array.from(allRegisteredIds).filter((id) => getItemStatus(id) === 'learning').length;
    const totalMissions = guideProgress.missions.length;
    const totalTouched = lessonTouched + dictTouched + pairTouched + vocabTouched;

    return {
      lessonTouched,
      dictTouched,
      pairTouched,
      vocabTouched,
      totalCleared,
      totalLearning,
      totalMissions,
      totalTouched,
    };
  }, [guideProgress.manualStatuses, guideProgress.cleared, guideProgress.missions, myExamplesMap]);

  // ピン留めされている「🎯 次の授業で使ってみるミッション」の詳細情報解決
  const activeMissionDetails = useMemo(() => {
    return guideProgress.missions.map((id) => {
      if (id.startsWith('phrase-')) {
        const item = KILLER_PHRASES_DATA.find((p) => p.id === id);
        if (item) return { id, tab: 'chunks' as GuideTab, badge: `🗣️ フレーズ No.${item.no}`, title: item.theme, sub: item.situationJa };
      }
      if (id.startsWith('lesson-')) {
        const item = LESSONS_DATA.find((l) => l.id === id);
        if (item) return { id, tab: 'textbook' as GuideTab, badge: `📖 第${item.number}課`, title: item.title, sub: item.subtitle };
      }
      if (id.startsWith('dict-')) {
        const item = GRAMMAR_DICT_DATA.find((d) => d.id === id);
        if (item) return { id, tab: 'dictionary' as GuideTab, badge: `🔖 文法 No.${item.no}`, title: item.grammar, sub: item.meaning };
      }
      if (id.startsWith('pair-')) {
        const item = CONFUSING_PAIRS_DATA.find((p) => p.id === id);
        if (item) return { id, tab: 'reference' as GuideTab, badge: `💡 使い分け No.${item.no}`, title: item.pairTitle, sub: item.theme };
      }
      if (id.startsWith('vocab-')) {
        const item = ESSENTIAL_VOCAB_DATA.find((v) => v.id === id);
        if (item) return { id, tab: 'dictionary' as GuideTab, badge: `🔤 単語 No.${item.no}`, title: `${item.word} (${item.presentForm || ''})`, sub: item.meaning };
      }
      if (id.startsWith('chunk-')) {
        const item = CONVERSATION_CHUNKS_DATA.find((c) => c.id === id);
        if (item) return { id, tab: 'chunks' as GuideTab, badge: `💬 会話 No.${item.no}`, title: item.expression, sub: item.meaning };
      }
      if (id.startsWith('colo-')) {
        const item = COLLOCATIONS_DATA.find((c) => c.id === id);
        if (item) return { id, tab: 'collocations' as GuideTab, badge: `🔗 助詞 No.${item.no}`, title: item.expression, sub: item.meaning };
      }
      if (id.startsWith('slang-')) {
        const item = SLANG_DATA.find((s) => s.id === id);
        if (item) return { id, tab: 'chunks' as GuideTab, badge: `🔥 スラング No.${item.no}`, title: item.term, sub: item.meaning };
      }
      return { id, tab: 'textbook' as GuideTab, badge: '🎯 ミッション', title: id, sub: '' };
    });
  }, [guideProgress.missions]);


  // 1秒めくり（単語帳）に追加済みかどうかの判定＆追加ハンドラ
  const isWordInVocab = (expression: string): boolean => {
    if (!existingWords) return false;
    const clean = expression.trim();
    return existingWords.some(
      (w) => w.expression.trim() === clean || (w.naturalAfter && w.naturalAfter.trim() === clean)
    );
  };

  const handleAddGuideItemToVocab = (
    itemId: string,
    expression: string,
    meaning: string,
    reading?: string,
    exampleSentence?: string,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    if (!onAddWordToVocab) return;
    const cleanExpr = expression.trim();
    const newWord: WordItem = {
      id: `guide_${itemId}_${Date.now()}`,
      expression: reading ? `${cleanExpr} [${reading}]` : cleanExpr,
      meaning: meaning.trim(),
      studentBefore: '',
      naturalAfter: exampleSentence || cleanExpr,
      cultureNote: 'バイブルから自主トレ（1秒めくり）用に仕入れた表現',
      audioText: cleanExpr.replace(/\s*\(.*?\)/g, ''),
      lessonTag: 'バイブル仕入れ',
      categoryType: 'vocab',
    };
    onAddWordToVocab(newWord);
    setAddedFeedbackIds((prev) => ({ ...prev, [itemId]: true }));
  };

  const displayedLessons = useMemo(() => {
    let list = LESSONS_DATA;
    if (levelMode === 'beginner') {
      if (lessonRange === '1-10') list = LESSONS_DATA.slice(0, 10);
      else if (lessonRange === '11-20') list = LESSONS_DATA.slice(10, 20);
      else if (lessonRange === '21-30') list = LESSONS_DATA.slice(20, 30);
      else list = LESSONS_DATA.slice(0, 30);
    } else {
      if (statusFilter === 'all') {
        if (lessonRange === '1-10') list = LESSONS_DATA.slice(0, 10);
        else if (lessonRange === '11-20') list = LESSONS_DATA.slice(10, 20);
        else if (lessonRange === '21-30') list = LESSONS_DATA.slice(20, 30);
        else if (lessonRange === '31-35') list = LESSONS_DATA.slice(30, 35);
        else if (lessonRange === '36-40') list = LESSONS_DATA.slice(35, 40);
      }
    }
    return list.filter((l) => matchesStatusFilter(l.id));
  }, [lessonRange, statusFilter, levelMode, guideProgress, myExamplesMap]);

  const displayedDicts = useMemo(() => {
    let list = GRAMMAR_DICT_DATA;

    // 検索または目的別カテゴリーが指定されている場合は全体から絞り込み
    if (grammarCategory !== 'all' || grammarSearch.trim()) {
      if (grammarCategory !== 'all') {
        list = list.filter((d) => getGrammarCategory(d) === grammarCategory);
      }
      if (grammarSearch.trim()) {
        const q = grammarSearch.trim().toLowerCase();
        list = list.filter(
          (d) =>
            d.grammar.toLowerCase().includes(q) ||
            d.meaning.toLowerCase().includes(q) ||
            d.example.toLowerCase().includes(q) ||
            d.tip.toLowerCase().includes(q) ||
            d.connection.toLowerCase().includes(q)
        );
      }
    } else if (statusFilter === 'all') {
      if (dictRange === '1-20') list = GRAMMAR_DICT_DATA.slice(0, 20);
      else if (dictRange === '21-40') list = GRAMMAR_DICT_DATA.slice(20, 40);
      else if (dictRange === '41-60') list = GRAMMAR_DICT_DATA.slice(40, 60);
      else if (dictRange === '61-80') list = GRAMMAR_DICT_DATA.slice(60, 80);
      else if (dictRange === '81-100') list = GRAMMAR_DICT_DATA.slice(80, 100);
      else if (dictRange === '101-130') list = GRAMMAR_DICT_DATA.slice(100, 130);
      else if (dictRange === '131-155') list = GRAMMAR_DICT_DATA.slice(130, 155);
      else if (dictRange === '156-180') list = GRAMMAR_DICT_DATA.slice(155, 180);
      else if (dictRange === '181-200') list = GRAMMAR_DICT_DATA.slice(180, 200);
      else if (dictRange === '201-225') list = GRAMMAR_DICT_DATA.slice(200, 225);
      else if (dictRange === '226-250') list = GRAMMAR_DICT_DATA.slice(225, 250);
      else if (dictRange === 'all') {
        if (levelMode === 'beginner') list = list.slice(0, 80);
        else if (levelMode === 'intermediate') list = list.slice(0, 180);
      }
    }
    return list.filter((d) => matchesStatusFilter(d.id));
  }, [dictRange, grammarCategory, grammarSearch, statusFilter, levelMode, guideProgress, myExamplesMap]);

  // 参考書Q&Aのフィルター
  const filteredQAs = useMemo(() => {
    let list = QA_DATA;
    if (qaCategory !== 'all') {
      list = list.filter((qa) => getQACategory(qa.id) === qaCategory);
    }
    if (qaSearch.trim()) {
      const q = qaSearch.trim().toLowerCase();
      list = list.filter(
        (qa) =>
          qa.q.toLowerCase().includes(q) ||
          qa.a.toLowerCase().includes(q) ||
          qa.ex1.toLowerCase().includes(q) ||
          qa.ex2.toLowerCase().includes(q)
      );
    }
    return list;
  }, [qaCategory, qaSearch]);

  const displayedPhrases = useMemo(() => {
    let list = KILLER_PHRASES_DATA;
    if (selectedPhraseCategory !== 'all') {
      list = list.filter((p) => p.category === selectedPhraseCategory);
    }
    return list.filter((p) => matchesStatusFilter(p.id));
  }, [selectedPhraseCategory, statusFilter, guideProgress, myExamplesMap]);

  const displayedChunks = useMemo(() => {
    let list = CONVERSATION_CHUNKS_DATA;
    if (selectedChunkCategory !== 'all') {
      list = list.filter((chunk) => chunk.category === selectedChunkCategory);
    }
    return list.filter((c) => matchesStatusFilter(c.id));
  }, [selectedChunkCategory, statusFilter, guideProgress, myExamplesMap]);

  const displayedCollocations = useMemo(() => {
    let list = COLLOCATIONS_DATA;
    if (selectedColoCategory !== 'all') {
      list = list.filter((c) => c.category === selectedColoCategory);
    }
    return list.filter((c) => matchesStatusFilter(c.id));
  }, [selectedColoCategory, statusFilter, guideProgress, myExamplesMap]);

  const displayedSlangs = useMemo(() => {
    let list = SLANG_DATA;
    if (selectedSlangCategory !== 'all') {
      list = list.filter((s) => s.category === selectedSlangCategory);
    }
    if (slangSearch.trim()) {
      const q = slangSearch.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.term.toLowerCase().includes(q) ||
          s.reading.toLowerCase().includes(q) ||
          s.meaning.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.exampleKo.toLowerCase().includes(q) ||
          s.exampleJa.includes(q) ||
          (s.caution && s.caution.toLowerCase().includes(q))
      );
    }
    return list.filter((s) => matchesStatusFilter(s.id));
  }, [selectedSlangCategory, slangSearch, statusFilter, guideProgress, myExamplesMap]);

  // 💡 身体慣用句 ＆ 重要ことわざ（40選）のフィルター
  const displayedIdioms = useMemo(() => {
    let list = IDIOMS_PROVERBS_DATA;
    if (idiomType !== 'all') {
      list = list.filter((item) => item.type === idiomType);
    }
    if (idiomSearch.trim()) {
      const q = idiomSearch.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.korean.toLowerCase().includes(q) ||
          item.reading.toLowerCase().includes(q) ||
          item.literalJa.toLowerCase().includes(q) ||
          item.meaningJa.toLowerCase().includes(q) ||
          item.originOrTip.toLowerCase().includes(q) ||
          item.exampleKo.toLowerCase().includes(q) ||
          item.exampleJa.includes(q)
      );
    }
    return list.filter((item) => matchesStatusFilter(item.id));
  }, [idiomType, idiomSearch, statusFilter, guideProgress, myExamplesMap]);

  // 👑 上級四字熟語（40選）のフィルター
  const displayedHanjas = useMemo(() => {
    let list = HANJA_IDIOMS_DATA;
    if (hanjaCategory !== 'all') {
      list = list.filter((item) => item.category === hanjaCategory);
    }
    if (hanjaSearch.trim()) {
      const q = hanjaSearch.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.hangul.toLowerCase().includes(q) ||
          item.hanja.toLowerCase().includes(q) ||
          item.reading.toLowerCase().includes(q) ||
          item.meaningJa.toLowerCase().includes(q) ||
          item.explanation.toLowerCase().includes(q) ||
          item.exampleKo.toLowerCase().includes(q) ||
          item.exampleJa.includes(q)
      );
    }
    return list.filter((item) => matchesStatusFilter(item.id));
  }, [hanjaCategory, hanjaSearch, statusFilter, guideProgress, myExamplesMap]);

  // 👑 上級時事・論述表現（20選）のフィルター
  const displayedWritings = useMemo(() => {
    let list = ADVANCED_WRITING_DATA;
    if (writingCategory !== 'all') {
      list = list.filter((item) => item.category === writingCategory);
    }
    if (writingSearch.trim()) {
      const q = writingSearch.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.korean.toLowerCase().includes(q) ||
          item.reading.toLowerCase().includes(q) ||
          item.meaningJa.toLowerCase().includes(q) ||
          item.usageTip.toLowerCase().includes(q) ||
          item.exampleKo.toLowerCase().includes(q) ||
          item.exampleJa.includes(q)
      );
    }
    return list.filter((item) => matchesStatusFilter(item.id));
  }, [writingCategory, writingSearch, statusFilter, guideProgress, myExamplesMap]);


  const displayedVocabs = useMemo(() => {
    let list = ESSENTIAL_VOCAB_DATA;
    if (selectedVocabCategory === 'noun_all') {
      list = list.filter((v) => v.pos === '名詞');
    } else if (selectedVocabCategory !== 'all') {
      list = list.filter((v) => v.category === selectedVocabCategory);
    }
    if (vocabSearchQuery.trim()) {
      const q = vocabSearchQuery.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.word.toLowerCase().includes(q) ||
          v.pronunciation.includes(q) ||
          v.meaning.includes(q) ||
          (v.presentForm && v.presentForm.includes(q))
      );
    }
    return list.filter((v) => matchesStatusFilter(v.id));
  }, [selectedVocabCategory, vocabSearchQuery, statusFilter, guideProgress, myExamplesMap]);

  // カテゴリーや検索クエリが変化したら1ページ目に戻す
  useEffect(() => {
    setVocabPage(1);
  }, [selectedVocabCategory, vocabSearchQuery, statusFilter]);

  const totalVocabPages = Math.max(1, Math.ceil(displayedVocabs.length / VOCAB_PAGE_SIZE));
  const paginatedVocabs = useMemo(() => {
    const start = (vocabPage - 1) * VOCAB_PAGE_SIZE;
    return displayedVocabs.slice(start, start + VOCAB_PAGE_SIZE);
  }, [displayedVocabs, vocabPage]);

  // 似ていて紛らわしい表現 36選のフィルター
  const filteredConfusingPairs = useMemo(() => {
    let list = CONFUSING_PAIRS_DATA;
    if (confusingCategory !== 'all') {
      list = list.filter((p) => p.part === confusingCategory);
    }
    if (confusingSearch.trim()) {
      const q = confusingSearch.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.pairTitle.toLowerCase().includes(q) ||
          p.theme.toLowerCase().includes(q) ||
          p.coreDifference.toLowerCase().includes(q) ||
          p.trap.toLowerCase().includes(q) ||
          p.exA.ko.toLowerCase().includes(q) ||
          p.exA.ja.includes(q) ||
          p.exB.ko.toLowerCase().includes(q) ||
          p.exB.ja.includes(q) ||
          p.tip.toLowerCase().includes(q)
      );
    }
    return list.filter((p) => matchesStatusFilter(p.id));
  }, [confusingCategory, confusingSearch, statusFilter, guideProgress, myExamplesMap]);

  const togglePair = (id: string) => {
    setOpenPairs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleExpandAllPairs = () => {
    const nextState = !expandAllPairs;
    setExpandAllPairs(nextState);
    const newMap: Record<string, boolean> = {};
    CONFUSING_PAIRS_DATA.forEach((p) => {
      newMap[p.id] = nextState;
    });
    setOpenPairs(newMap);
  };

  const toggleQA = (id: string) => {
    setOpenQAs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleExpandAllQAs = () => {
    const nextState = !expandAllQAs;
    setExpandAllQAs(nextState);
    const newMap: Record<string, boolean> = {};
    QA_DATA.forEach((qa) => {
      newMap[qa.id] = nextState;
    });
    setOpenQAs(newMap);
  };

  const toggleColumn = (id: string) => {
    setOpenColumns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleExpandAllColumns = () => {
    const nextState = !expandAllColumns;
    setExpandAllColumns(nextState);
    const newMap: Record<string, boolean> = {};
    COLUMNS_DATA.forEach((col) => {
      newMap[col.id] = nextState;
    });
    setOpenColumns(newMap);
  };

  const handleToggleExpandAll = () => {
    const nextState = !expandAllLessons;
    setExpandAllLessons(nextState);
    const newOpenMap: Record<string, boolean> = {};
    LESSONS_DATA.forEach((lesson) => {
      newOpenMap[lesson.id] = nextState;
    });
    setOpenLessons(newOpenMap);
  };

  const handleToggleExpandAllDicts = () => {
    const nextState = !expandAllDicts;
    setExpandAllDicts(nextState);
    const newOpenMap: Record<string, boolean> = {};
    GRAMMAR_DICT_DATA.forEach((item) => {
      newOpenMap[item.id] = nextState;
    });
    setOpenDicts(newOpenMap);
  };

  const handleToggleExpandAllPhrases = () => {
    const nextState = !expandAllPhrases;
    setExpandAllPhrases(nextState);
    const newOpenMap: Record<string, boolean> = {};
    KILLER_PHRASES_DATA.forEach((phrase) => {
      newOpenMap[phrase.id] = nextState;
    });
    setOpenPhrases(newOpenMap);
  };

  const toggleRevealPhrase = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRevealedPhrases((prev) => {
      const nextVal = !prev[id];
      if (nextVal) {
        const item = KILLER_PHRASES_DATA.find((p) => p.id === id);
        if (item) {
          speechService.speak(item.myAnswerKo);
        }
      }
      return { ...prev, [id]: nextVal };
    });
  };

  const handleToggleExpandAllChunks = () => {
    const nextState = !expandAllChunks;
    setExpandAllChunks(nextState);
    const newOpenMap: Record<string, boolean> = {};
    CONVERSATION_CHUNKS_DATA.forEach((chunk) => {
      newOpenMap[chunk.id] = nextState;
    });
    setOpenChunks(newOpenMap);
  };

  const handleToggleExpandAllColos = () => {
    const nextState = !expandAllColos;
    setExpandAllColos(nextState);
    const newOpenMap: Record<string, boolean> = {};
    COLLOCATIONS_DATA.forEach((colo) => {
      newOpenMap[colo.id] = nextState;
    });
    setOpenColos(newOpenMap);
  };

  const handleToggleExpandAllSlangs = () => {
    const nextState = !expandAllSlangs;
    setExpandAllSlangs(nextState);
    const newOpenMap: Record<string, boolean> = {};
    SLANG_DATA.forEach((slang) => {
      newOpenMap[slang.id] = nextState;
    });
    setOpenSlangs(newOpenMap);
  };


  // リアルタイム検索フィルター
  const filteredIndex = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return GUIDE_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  // 一覧行用のステータスバッジ ＆ ワンタップ🎯次回ミッションピン留めボタン（授業ノート風の極小シンプル表示）
  const renderItemStatusBadgeAndPin = (id: string) => {
    const status = getItemStatus(id);
    const exCount = myExamplesMap[id]?.length || 0;
    const isMission = guideProgress.missions.includes(id);

    return (
      <div className="flex items-center gap-1 shrink-0 font-sans">
        {exCount > 0 && (
          <span
            className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF4FA] text-[#1E3A5F] border border-[#CFE0F0] whitespace-nowrap hidden sm:inline-flex items-center"
            title={`授業実例 ${exCount}件`}
          >
            📖{exCount}
          </span>
        )}

        {/* ワンタップで ⚪未開拓 → 🟡練習中 → 🟢習得 を切り替える極小ステータスボタン */}
        <button
          type="button"
          onClick={(e) => cycleItemStatus(id, e)}
          aria-label="ステータス切り替え"
          title={`現在のステータス: ${
            status === 'mastered'
              ? '🟢 習得・実戦クリア'
              : status === 'learning'
              ? '🟡 練習中'
              : '⚪ 未開拓'
          }（タップで切り替え）`}
          className="p-1 rounded-full cursor-pointer transition-transform active:scale-95 flex items-center justify-center"
        >
          {status === 'mastered' && (
            <span className="w-5 h-5 rounded-full bg-[#EEF4F0] text-[#3A5A40] border border-[#DCE6DE] flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </span>
          )}
          {status === 'learning' && (
            <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-300 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </span>
          )}
          {status === 'unexplored' && (
            <span className="w-5 h-5 rounded-full border border-transparent hover:border-[#E2DDD2] bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D5CEC5]" />
            </span>
          )}
        </button>

        {/* 🎯 次回ミッションピン留め */}
        <button
          type="button"
          onClick={(e) => toggleMission(id, e)}
          title={isMission ? '次回ミッションから外す' : '🎯 次の授業で使ってみる（ピン留め）'}
          aria-label={isMission ? '次回ミッションから外す' : '次の授業で使ってみる'}
          className={`p-1 rounded-lg transition-all cursor-pointer shrink-0 ${
            isMission
              ? 'bg-[#FAF0EC] text-[#B84E34] border border-[#F2DED6]'
              : 'text-[#C2B9B0] opacity-0 group-hover:opacity-100 hover:text-[#B84E34] hover:bg-[#FAF7F2]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  // 詳細展開・ボトムシート共通：手動ステータスセレクター ＆ アクションバー ＆ 📖自分の授業実例アルバム
  const renderActionAndMyAlbum = (
    id: string,
    vocabCandidate?: {
      expression: string;
      meaning: string;
      reading?: string;
      exampleSentence?: string;
    }
  ) => {
    const status = getItemStatus(id);
    const isMission = guideProgress.missions.includes(id);
    const myExamples = myExamplesMap[id] || [];
    const noteText = guideProgress.missionNotes[id] || '';
    const alreadyInVocab =
      addedFeedbackIds[id] || (vocabCandidate ? isWordInVocab(vocabCandidate.expression) : false);

    return (
      <div className="space-y-2.5 pt-2 border-t border-[#EDE7DC] font-sans">
        {/* ① 講師・生徒の手動ステータス切り替えピル ＆ アクションボタンバー */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 3段階 手動ステータスセレクター */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D5] text-[11px] font-bold">
            <span className="text-[#756D63] px-1 hidden sm:inline">ステータス:</span>
            <button
              type="button"
              onClick={(e) => setItemManualStatus(id, 'unexplored', e)}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                status === 'unexplored'
                  ? 'bg-white text-[#544D45] shadow-2xs border border-[#D5CEC5]'
                  : 'text-[#8A8075] hover:text-[#1B2A38]'
              }`}
            >
              ⚪ 未開拓
            </button>
            <button
              type="button"
              onClick={(e) => setItemManualStatus(id, 'learning', e)}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                status === 'learning'
                  ? 'bg-amber-100 text-amber-900 shadow-2xs border border-amber-300'
                  : 'text-[#8A8075] hover:text-amber-800'
              }`}
            >
              🟡 練習中
            </button>
            <button
              type="button"
              onClick={(e) => setItemManualStatus(id, 'mastered', e)}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                status === 'mastered'
                  ? 'bg-emerald-600 text-white shadow-2xs border border-emerald-600'
                  : 'text-[#8A8075] hover:text-emerald-700'
              }`}
            >
              🟢 実戦クリア！
            </button>
          </div>

          {/* 🎯 次の授業で使うピン留め */}
          <button
            type="button"
            onClick={(e) => toggleMission(id, e)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
              isMission
                ? 'bg-[#B84E34] text-white border-[#B84E34] shadow-xs'
                : 'bg-white text-[#544D45] hover:text-[#B84E34] hover:border-[#B84E34] border-[#E2DDD2]'
            }`}
          >
            <span>{isMission ? '🎯 次回ミッション中' : '🎯 次の授業で使う'}</span>
          </button>

          {vocabCandidate && onAddWordToVocab && (
            <button
              type="button"
              disabled={alreadyInVocab}
              onClick={(e) =>
                handleAddGuideItemToVocab(
                  id,
                  vocabCandidate.expression,
                  vocabCandidate.meaning,
                  vocabCandidate.reading,
                  vocabCandidate.exampleSentence,
                  e
                )
              }
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer border whitespace-nowrap sm:ml-auto ${
                alreadyInVocab
                  ? 'bg-[#FAF7F2] text-[#8A8075] border-[#E8E2D5] cursor-default'
                  : 'bg-[#FAF0EC] text-[#B84E34] hover:bg-[#F5E3DC] border-[#F0D5CD]'
              }`}
            >
              {alreadyInVocab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>1秒めくり追加済</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>自分のテスト(1秒めくり)に追加</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* ② 🎯次回ミッション設定時の「ネタ出しヒント＆メモ」 */}
        {isMission && (
          <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
            <label className="block text-[11px] sm:text-xs font-bold text-[#B84E34]">
              💡 次の授業で先生に何を話す？（エピソードメモ）
            </label>
            <input
              type="text"
              value={noteText}
              onChange={(e) => updateMissionNote(id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="例：週末に映画を見た話 / 来月旅行に行きたい..."
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82]"
            />
          </div>
        )}

        {/* ③ 📖 あなたが授業で実際に話したフレーズ（自分の言葉アルバム） */}
        {myExamples.length > 0 ? (
          <div className="p-3 bg-gradient-to-br from-[#FAF7F0] to-[#FFFDF9] border border-[#E8DFD1] rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-[#1E3A5F] flex items-center gap-1 min-w-0 truncate">
                <span className="shrink-0">📖</span>
                <span className="truncate">あなたが授業で実際に話したフレーズ ({myExamples.length}件)</span>
              </span>
              <span className="text-[10px] text-[#8C7E72] shrink-0 whitespace-nowrap hidden sm:inline">タップで該当ノートへ</span>
            </div>
            <div className="space-y-1.5">
              {myExamples.map((ex) => (
                <button
                  key={ex.wordId}
                  type="button"
                  onClick={() => {
                    setBottomSheetItem(null);
                    if (onJumpToNote) {
                      onJumpToNote(ex.lessonId, ex.wordId);
                    }
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-[#E8E2D5] hover:border-[#B84E34] hover:bg-[#FAF0EC]/40 transition-colors cursor-pointer group flex items-start justify-between gap-2"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#8C7E72] px-1.5 py-0.2 bg-[#FAF7F2] rounded border border-[#EDE7DC]">
                        {ex.lessonTitle}
                      </span>
                      <span className="text-[10px] text-[#B84E34] font-medium">
                        {ex.type === 'correction' ? '会話添削' : '重要語句'}
                      </span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-[#1B2A38] group-hover:text-[#B84E34] transition-colors truncate">
                      {ex.expression}
                    </div>
                    <div className="text-[11px] text-[#6B635B] truncate">
                      {ex.meaning}
                    </div>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#948C82] group-hover:text-[#B84E34] rotate-180 shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#FAF7F2]/80 border border-dashed border-[#DFD8CC] rounded-xl flex items-center justify-between gap-2 text-xs text-[#756D63]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#948C82] shrink-0" />
              <span>
                まだあなたの授業実例がありません。<strong>「🎯 次の授業で使ってみる」</strong>にピン留めして、先生との会話で使ってみましょう！
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // レッスン本文（コア概念・公式・例文・落とし穴）のレンダリング関数
  const renderLessonContent = (
    lesson: (typeof LESSONS_DATA)[0],
    stepTab: 'all' | 'concept' | 'rules' | 'examples' | 'pitfall' = 'all'
  ) => {
    const firstEx = lesson.examples[0];
    return (
      <div className="space-y-4">
        {/* ① 本課のコアコンセプト */}
        {(stepTab === 'all' || stepTab === 'concept') && (
          <div className="p-3.5 bg-[#FAF7F2]/80 rounded-xl text-[#3A332C] leading-relaxed border-l-3 border-[#B84E34] space-y-1.5">
            <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
              {lesson.concept.title}
            </div>
            <p className={`whitespace-pre-line ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
              {lesson.concept.description}
            </p>
          </div>
        )}

        {/* ② 公式・接続ルール */}
        {(stepTab === 'all' || stepTab === 'rules') && (
          <div className="space-y-2.5">
            <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
              {lesson.rules.title}
            </div>
            {lesson.rules.items && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lesson.rules.items.map((rule, rIndex) => (
                  <div key={rIndex} className="p-3 bg-white/90 rounded-xl border border-[#EDE7DC] space-y-1">
                    <strong className={`text-[#B84E34] block ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                      {rule.label}
                    </strong>
                    <div className={`text-[#423B33] whitespace-pre-line leading-relaxed ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                      {rule.content}
                    </div>
                    {rule.sub && <div className={`text-[#756D63] ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>{rule.sub}</div>}
                  </div>
                ))}
              </div>
            )}

            {lesson.rules.table && (
              <div className="overflow-x-auto rounded-xl border border-[#EDE7DC] bg-white text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#EDE7DC] text-[#756D63]">
                      {lesson.rules.table.headers.map((h, hIndex) => (
                        <th key={hIndex} className="py-2 px-2.5 font-bold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE7DC]">
                    {lesson.rules.table.rows.map((row, rIndex) => (
                      <tr key={rIndex} className="hover:bg-white/50 transition-colors">
                        {row.map((cell, cIndex) => (
                          <td
                            key={cIndex}
                            className={`py-2 px-2.5 whitespace-nowrap ${cIndex === 0 ? 'font-bold text-[#1B2A38]' : 'font-mono'}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ③ 日常会話のリアル例文3選 */}
        {(stepTab === 'all' || stepTab === 'examples') && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className={`font-bold text-[#B84E34] flex items-center gap-1.5 ${isLargeFont ? 'text-base' : 'text-sm sm:text-base'}`}>
                <span>③ 日常会話のリアル例文3選</span>
              </div>
              {/* カタカナ発音表示ON/OFFトグル */}
              <button
                type="button"
                onClick={togglePronunciation}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  showPronunciation
                    ? 'bg-[#FAF0EC] text-[#B84E34] border border-[#E8D0C7]'
                    : 'bg-[#EDE7DC] text-[#756D63]'
                }`}
                title={showPronunciation ? 'カタカナ発音を非表示にする' : 'カタカナ発音を表示する'}
              >
                {showPronunciation ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{showPronunciation ? '発音ON' : '発音OFF'}</span>
              </button>
            </div>

            <div className="space-y-3 divide-y divide-[#EDE7DC] bg-[#FAF7F2]/60 rounded-xl p-3.5 border border-[#EDE7DC]/70">
              {lesson.examples.map((ex, exIndex) => (
                <div key={exIndex} className={exIndex > 0 ? 'pt-2.5' : ''}>
                  <div className={`font-bold text-[#1B2A38] tracking-tight ${isLargeFont ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                    {ex.ko}
                  </div>
                  {showPronunciation && (
                    <div className={`text-[#8A8075] font-mono mt-0.5 ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                      {ex.reading}
                    </div>
                  )}
                  <div className={`text-[#423B33] mt-0.5 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
                    {ex.ja}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ④ 初心者が絶対間違える落とし穴 */}
        {(stepTab === 'all' || stepTab === 'pitfall') && (
          <div className="p-3.5 bg-amber-50/70 border-l-3 border-amber-500 rounded-r-xl space-y-1 text-amber-950">
            <div className={`font-bold flex items-center gap-1.5 text-amber-900 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
              <span>⚠️ 落とし穴注意:</span>
              <span>{lesson.pitfall.title}</span>
            </div>
            <p className={`leading-relaxed ${isLargeFont ? 'text-base' : 'text-sm'}`}>
              {lesson.pitfall.content}
            </p>
          </div>
        )}

        {/* 辞書リンク */}
        {lesson.refLink && (stepTab === 'all' || stepTab === 'rules') && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => scrollTo(lesson.refLink!.id, lesson.refLink!.tab)}
              className="inline-flex items-center gap-1 text-xs text-[#B84E34] hover:underline font-bold cursor-pointer"
            >
              <span>🔗 {lesson.refLink.label}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 🎯 次回ミッション・🟢 実戦クリア・📖 あなたの授業実例アルバム */}
        {renderActionAndMyAlbum(
          lesson.id,
          firstEx
            ? {
                expression: firstEx.ko,
                meaning: firstEx.ja,
                reading: firstEx.reading,
              }
            : undefined
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B2A38] font-sans selection:bg-[#F0D5CD] selection:text-[#B84E34] pb-28">
      {/* ===================== 上部固定ツールバー（極薄1段・スクロール連動自動収納） ===================== */}
      <header
        className={`sticky top-[56px] sm:top-[64px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] px-2.5 sm:px-6 py-2 transition-transform duration-300 transform-gpu ${
          showBars ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          transform: showBars ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
          WebkitTransform: showBars ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
          willChange: 'transform',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
          {/* ホームに戻るボタン（スマホではコンパクト表示、PCではフルテキスト） */}
          <button
            type="button"
            onClick={onBackToNote}
            title="ホームへ戻る"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-xl border border-[#E2DDD2] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#1B2A38] transition-all shadow-2xs cursor-pointer shrink-0 active:scale-95 h-8"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B84E34]" />
            <span className="hidden sm:inline">ホームへ戻る</span>
            <span className="sm:hidden text-xs">ホーム</span>
          </button>

          {/* リアルタイムインデックス検索バー（十分な横幅を確保） */}
          <div className="relative flex-1 min-w-[120px] max-w-sm sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="教科書・辞書・会話を検索..."
              className="w-full pl-7 pr-7 py-1 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors h-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 rounded cursor-pointer"
                title="検索をクリア"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* 検索ドロップダウン */}
            {searchQuery.trim() && (
              <div
                data-testid="search-results-dropdown"
                className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E8E2D5] rounded-xl shadow-lg p-1.5 z-50 divide-y divide-[#F2ECE1] max-h-72 overflow-y-auto"
              >
                {filteredIndex.length > 0 ? (
                  filteredIndex.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        scrollTo(item.id, item.tab);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#B84E34]">
                        <span>{item.category}</span>
                        <span className="text-[10px] text-[#948C82] bg-[#FAF7F2] px-1.5 py-0.5 rounded">
                          {item.tab === 'textbook'
                            ? '教科書'
                            : item.tab === 'reference'
                            ? '参考書'
                            : item.tab === 'dictionary'
                            ? '辞書'
                            : item.tab === 'chunks'
                            ? '会話'
                            : '助詞'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#1B2A38] mt-0.5">{item.title}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-center text-xs text-[#948C82]">
                    一致する項目が見つかりませんでした
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🧭 学習メニュー・進捗詳細 統合ツールボタン（1つのツールボタンに集約） */}
          <button
            type="button"
            onClick={() => setShowDashboard(!showDashboard)}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl border transition-all cursor-pointer shrink-0 text-xs font-bold h-8 ${
              showDashboard
                ? 'bg-[#B84E34] text-white border-[#B84E34] shadow-xs'
                : 'bg-white text-[#756D63] hover:text-[#1B2A38] border-[#E2DDD2]'
            }`}
            title="学習メニュー・ツール（章選択・進捗・ミッション・文字サイズ）"
          >
            <Compass className={`w-3.5 h-3.5 ${showDashboard ? 'text-white' : 'text-[#B84E34]'}`} />
            <span>進捗詳細</span>
            {(progressStats.totalCleared > 0 || activeMissionDetails.length > 0) && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                showDashboard ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {progressStats.totalCleared > 0 ? progressStats.totalCleared : `🎯${activeMissionDetails.length}`}
              </span>
            )}
            {showDashboard ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* レベル切り替えタブ（🔰 初級 | 🌿 中級 | 👑 上級） */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 mt-1.5 pt-1.5 border-t border-[#E8E2D5]/70">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold text-[#8A8075] shrink-0">難易度:</span>
            <div className="inline-flex p-0.5 bg-[#EAE4D9]/80 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => changeLevelMode('beginner')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  levelMode === 'beginner'
                    ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                    : 'text-[#6B635B] hover:text-[#1B2A38]'
                }`}
                title="初級モード：第1〜30課・基本文法80選・日常会話（中級以上を隠す）"
              >
                🔰 初級
              </button>
              <button
                type="button"
                onClick={() => changeLevelMode('intermediate')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  levelMode === 'intermediate'
                    ? 'bg-[#1E3A5F] text-white shadow-2xs font-extrabold'
                    : 'text-[#6B635B] hover:text-[#1B2A38]'
                }`}
                title="中級モード：第4章・中級文法100選・身体慣用句40選・スラング60選"
              >
                🌿 中級
              </button>
              <button
                type="button"
                onClick={() => changeLevelMode('advanced')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  levelMode === 'advanced'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-2xs font-extrabold'
                    : 'text-[#6B635B] hover:text-[#1B2A38]'
                }`}
                title="上級モード：四字熟語40選・時事論述20選・TOPIK 5-6級高級文法"
              >
                👑 上級
              </button>
            </div>
          </div>
          <div className="text-[10px] text-[#8A8075] truncate hidden sm:block">
            {levelMode === 'beginner' && 'ハングル基礎・日常基本文法（1-2級）'}
            {levelMode === 'intermediate' && '実践複文・身体慣用句・スラング（3-4級）'}
            {levelMode === 'advanced' && '時事論述・四字熟語・TOPIK高級（5-6級）'}
          </div>
        </div>
      </header>

      {/* ===================== メインコンテンツ領域 ===================== */}
      <main className="max-w-4xl mx-auto px-2.5 sm:px-6 pt-2 sm:pt-2.5">
        {/* ===================== 🧭 統合学習ダッシュボード（1つのアイコンに集約・収納式） ===================== */}
        {!readingLesson && (
          <section
            data-testid="guide-progress-dashboard"
            className={`${showDashboard ? 'block mb-3.5 p-3 sm:p-4 bg-white border border-[#E8E2D5] rounded-2xl shadow-sm space-y-3' : 'hidden'}`}
          >
            {/* ① 表紙タイトル ＆ レベル切り替え ＆ 文字サイズ（ツール統合） ＆ 閉じるボタン */}
            <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="text-xs sm:text-sm font-serif font-bold text-[#1B2A38] tracking-tight whitespace-nowrap truncate">
                  {levelMode === 'beginner'
                    ? '韓国語初級マスターバイブル'
                    : levelMode === 'intermediate'
                    ? '韓国語中級ステップアップ'
                    : '韓国語上級マスタークラウン'}
                </h1>
                <div className="inline-flex p-0.5 bg-[#EAE4D9]/80 rounded-lg shrink-0">
                  <button
                    type="button"
                    onClick={() => changeLevelMode('beginner')}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      levelMode === 'beginner'
                        ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    🔰 初級
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLevelMode('intermediate')}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      levelMode === 'intermediate'
                        ? 'bg-[#1E3A5F] text-white shadow-2xs font-extrabold'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    🌿 中級
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLevelMode('advanced')}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      levelMode === 'advanced'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-2xs font-extrabold'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    👑 上級
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* ツール：文字サイズ切り替えボタン */}
                <button
                  type="button"
                  onClick={toggleFontSize}
                  title={isLargeFont ? '文字サイズ：標準に戻す' : '文字サイズ：大きくする'}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all cursor-pointer text-xs font-bold ${
                    isLargeFont
                      ? 'bg-[#FAF0EC] text-[#B84E34] border-[#B84E34] shadow-2xs'
                      : 'bg-[#FAF7F2] text-[#756D63] hover:text-[#1B2A38] border-[#E2DDD2]'
                  }`}
                >
                  <Type className="w-3 h-3 text-[#B84E34]" />
                  <span className="text-[11px]">{isLargeFont ? '大' : '標準'}</span>
                </button>

                {/* 閉じるボタン */}
                <button
                  type="button"
                  onClick={() => setShowDashboard(false)}
                  className="p-1 text-[#948C82] hover:text-[#1B2A38] rounded-lg cursor-pointer"
                  title="メニューを閉じる"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ② 📚 教科書 章選択 ＆ すべて開く/閉じる */}
            {activeTab === 'textbook' && (
              <div className="bg-[#FAF7F2] p-2 sm:p-2.5 rounded-xl border border-[#EDE7DC] space-y-1.5 shadow-2xs">
                {/* ヘッダー行: 章を選択タイトル + すべて開く/閉じる */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#B84E34]" />
                    <span className="text-xs font-bold text-[#1B2A38]">章を選択</span>
                    <span className="text-[10px] text-[#756D63] bg-white px-1.5 py-0.5 rounded border border-[#EDE7DC]">
                      {lessonRange === 'all' ? `全${LESSONS_DATA.length}課` : `${lessonRange}課`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleExpandAll}
                    className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#B84E34] hover:bg-[#FAF0EC] cursor-pointer whitespace-nowrap border border-[#E8E2D5] bg-white shadow-2xs"
                  >
                    {expandAllLessons ? 'すべて閉じる' : 'すべて開く'}
                  </button>
                </div>

                {/* セグメントピル（横スクロール可能 & スッキリ1行） */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 pt-0.5 -mx-0.5 px-0.5">
                  {/* 全課ボタン */}
                  <button
                    type="button"
                    onClick={() => setLessonRange('all')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                      lessonRange === 'all'
                        ? 'bg-[#1B2A38] text-white border-[#1B2A38] shadow-xs'
                        : 'bg-white text-[#756D63] border-[#EDE7DC] hover:text-[#1B2A38] hover:border-[#B84E34]'
                    }`}
                  >
                    <span>{levelMode === 'beginner' ? '全30課（初級）を表示' : `全${LESSONS_DATA.length}課を表示`}</span>
                  </button>

                  {/* 第1章〜第4章ボタン（初級モード時は第4章を完全非表示） */}
                  {TEXTBOOK_STAGES
                    .filter((stg) => levelMode !== 'beginner' || (stg.id !== 'stage-4' && stg.id !== 'stage-5'))
                    .map((stg) => {
                      const isCurrent = lessonRange === stg.range;
                      const isStage4 = stg.id === 'stage-4';
                      const isStage5 = stg.id === 'stage-5';
                      return (
                        <button
                          key={stg.id}
                          type="button"
                          onClick={() => {
                            setLessonRange(stg.range);
                            if (isStage5 && levelMode !== 'advanced') setLevelMode('advanced');
                            else if (isStage4 && levelMode === 'beginner') setLevelMode('intermediate');
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 shrink-0 ${
                            isCurrent
                              ? isStage5
                                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-xs'
                                : isStage4
                                ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                                : 'bg-[#B84E34] text-white border-[#B84E34] shadow-xs'
                              : 'bg-white text-[#1B2A38] border-[#EDE7DC] hover:border-[#B84E34]'
                          }`}
                        >
                          <span>{stg.chapter}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                            isCurrent
                              ? 'bg-white/20 text-white'
                              : isStage5
                              ? 'bg-amber-100 text-amber-800'
                              : isStage4
                              ? 'bg-blue-100 text-[#1E3A5F]'
                              : 'bg-[#FAF0EC] text-[#B84E34]'
                          }`}>
                            {stg.range}課
                          </span>
                        </button>
                      );
                    })}
                </div>

                {/* 選択中の章の要約ミニバナー（1行で情報密度を高める） */}
                {(() => {
                  const currentStage = TEXTBOOK_STAGES.find((s) => s.range === lessonRange);
                  if (lessonRange === 'all') {
                    return (
                      <div className="bg-white/80 px-2 py-1 rounded-lg border border-[#EDE7DC] text-[10px] text-[#756D63] flex items-center justify-between">
                        <span className="font-bold text-[#1B2A38]">全35課一覧</span>
                        <span className="truncate">入門ハングルから中級複文・使役受身まで完全網羅</span>
                      </div>
                    );
                  }
                  if (currentStage) {
                    const isStage4 = currentStage.id === 'stage-4';
                    return (
                      <div className="bg-white/80 px-2 py-1 rounded-lg border border-[#EDE7DC] text-[10px] flex items-center justify-between gap-1">
                        <span className={`font-bold shrink-0 ${isStage4 ? 'text-[#1E3A5F]' : 'text-[#B84E34]'}`}>
                          {currentStage.title}
                        </span>
                        <span className="text-[#756D63] truncate">
                          {currentStage.desc}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {/* ③ ピン留めされたミッション（ネタ準備） */}
            {activeMissionDetails.length > 0 && (
              <div className="p-2.5 bg-[#FFF9F5] border border-[#F5D5C6] rounded-xl space-y-2">
                <div className="text-[11px] font-bold text-[#B84E34] flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>次回ミッション（授業で使いたいフレーズ）</span>
                </div>
                {activeMissionDetails.map((m) => (
                  <div key={m.id} className="p-2 bg-white rounded-lg border border-[#EDE7DC] space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          scrollTo(m.id, m.tab);
                          setShowDashboard(false);
                        }}
                        className="flex items-center gap-1.5 min-w-0 flex-1 text-left group cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-[#B84E34] bg-[#FAF0EC] px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                          {m.badge}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#1B2A38] group-hover:text-[#B84E34] truncate">
                          {m.title}
                        </span>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => toggleCleared(m.id, e)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                          title="授業で先生に実際に使えたらタップ！"
                        >
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>実戦クリア！</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleMission(m.id, e)}
                          className="p-1 text-[#948C82] hover:text-[#1B2A38] rounded cursor-pointer shrink-0"
                          title="ミッションから外す"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-[#B84E34] shrink-0 whitespace-nowrap">💡 ネタ準備:</span>
                      <input
                        type="text"
                        value={guideProgress.missionNotes[m.id] || ''}
                        onChange={(e) => updateMissionNote(m.id, e.target.value)}
                        placeholder="次の授業でこの表現を使って先生に何を話す？（例：週末食べたもの、来月の予定）"
                        className="w-full px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E2DDD2] focus:border-[#B84E34] focus:bg-white focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ④ 学習ステータスで絞り込み */}
            <div className="space-y-1.5 pt-0.5">
              <div className="text-[11px] font-bold text-[#756D63]">📊 学習ステータスで絞り込み</div>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'all', label: 'すべて表示' },
                  { id: 'mission', label: `🎯 次回ミッション ${progressStats.totalMissions}` },
                  { id: 'mastered', label: `🟢 実戦クリア ${progressStats.totalCleared}` },
                  { id: 'learning', label: `🟡 練習中 ${progressStats.totalLearning}` },
                  { id: 'unexplored', label: '⚪ 未開拓' },
                ].map((f) => {
                  const isCurrent = statusFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setStatusFilter(f.id as any)}
                      className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isCurrent
                          ? 'bg-[#1B2A38] text-white shadow-2xs'
                          : 'bg-[#FAF7F2] text-[#6B635B] hover:text-[#1B2A38] border border-[#E8E2D5]'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* 4大領域進捗カード */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1.5 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setActiveTab('textbook')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5] text-left cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-[#756D63]">📖 教科書30課</div>
                  <div className="text-xs font-bold font-mono text-[#1B2A38] mt-0.5">
                    {progressStats.lessonTouched} / {LESSONS_DATA.length}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('dictionary');
                    setDictSubTab('grammar');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5] text-left cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-[#756D63]">🔖 文法{GRAMMAR_DICT_DATA.length}選</div>
                  <div className="text-xs font-bold font-mono text-[#1B2A38] mt-0.5">
                    {progressStats.dictTouched} / {GRAMMAR_DICT_DATA.length}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reference')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5] text-left cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-[#756D63]">💡 使い分け{CONFUSING_PAIRS_DATA.length}選</div>
                  <div className="text-xs font-bold font-mono text-[#1B2A38] mt-0.5">
                    {progressStats.pairTouched} / {CONFUSING_PAIRS_DATA.length}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('dictionary');
                    setDictSubTab('vocab');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5] text-left cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-[#756D63]">🔤 単語{ESSENTIAL_VOCAB_DATA.length}選</div>
                  <div className="text-xs font-bold font-mono text-[#1B2A38] mt-0.5">
                    {progressStats.vocabTouched} / {ESSENTIAL_VOCAB_DATA.length}
                  </div>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 【第1部：教科書編】道筋ロードマップ ＋ 30レッスン                */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'textbook' && (
          <div>
            {readingLesson ? (
              <div className="space-y-4">
                {/* 1課集中モード ナビゲーションバー */}
                <div className="flex items-center justify-between bg-white border border-[#E8E2D5] rounded-xl p-2.5 sm:p-3 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setReadingLessonId(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#B84E34] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>目次一覧に戻る</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#756D63] font-mono">
                      {readingLessonIndex + 1} / {LESSONS_DATA.length} 課
                    </span>
                  </div>
                </div>

                {/* 1課集中カード（本文全体） */}
                <article
                  id={readingLesson.id}
                  className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-5"
                >
                  {/* ヘッダー情報 */}
                  <div className="border-b border-[#F2ECE1] pb-3.5">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#948C82] font-mono font-bold">
                          LESSON {readingLesson.number}
                        </span>
                      </div>
                      {readingLesson.refLink && (
                        <button
                          type="button"
                          onClick={() => scrollTo(readingLesson.refLink!.id, readingLesson.refLink!.tab)}
                          className="flex items-center gap-1 text-xs font-bold text-[#B84E34] bg-[#FAF0EC] hover:bg-[#F5E6DF] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>{readingLesson.refLink.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <h2 className={`font-serif font-bold text-[#1B2A38] ${isLargeFont ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                      {readingLesson.title}
                    </h2>
                    <p className={`text-[#756D63] mt-1 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
                      {readingLesson.subtitle}
                    </p>

                    {/* ステップ切り替えタブ（仕組み・公式・例文・落とし穴） */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
                      {[
                        { id: 'all', label: 'すべて表示' },
                        { id: 'concept', label: '① 仕組み' },
                        { id: 'rules', label: '② 公式表' },
                        { id: 'examples', label: '③ 例文(3)' },
                        { id: 'pitfall', label: '⚠️ 落とし穴' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setLessonStepTab(tab.id as any)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                            lessonStepTab === tab.id
                              ? 'bg-[#B84E34] text-white shadow-xs'
                              : 'bg-[#FAF7F2] text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 本文（①コア概念・②公式・③例文3選・④落とし穴・辞書リンク） */}
                  {renderLessonContent(readingLesson, lessonStepTab)}

                  {/* 課のナビゲーション（前へ / 目次へ / 次へ） */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE1] text-xs sm:text-sm">
                    {prevLesson ? (
                      <button
                        type="button"
                        onClick={() => {
                          setReadingLessonId(prevLesson.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 text-[#756D63] hover:text-[#B84E34] font-medium cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>第{prevLesson.number}課へ</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setReadingLessonId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs text-[#756D63] hover:text-[#1B2A38] underline cursor-pointer"
                    >
                      目次一覧
                    </button>

                    {nextLesson ? (
                      <button
                        type="button"
                        onClick={() => {
                          setReadingLessonId(nextLesson.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 text-[#B84E34] hover:underline font-bold cursor-pointer"
                      >
                        <span>第{nextLesson.number}課へ進む</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </article>
              </div>
            ) : (
              <div className="space-y-2.5">

                {/* 30課 授業ノート風の超シンプル1枚シート目次リスト */}
                <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                  {displayedLessons.map((lesson) => {
                    const isOpen = !!openLessons[lesson.id];
                    return (
                      <div key={lesson.id} id={lesson.id} className="scroll-mt-28">
                        <div
                          onClick={() => setReadingLessonId(lesson.id)}
                          className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-baseline gap-2 flex-1 min-w-0">
                            <span className="text-[11px] font-sans font-bold text-[#948C82] w-5 text-right shrink-0">
                              {lesson.number}.
                            </span>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <h2 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                {lesson.title}
                              </h2>
                              <p className="text-xs text-[#6B635B] font-sans truncate">
                                {lesson.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            {renderItemStatusBadgeAndPin(lesson.id)}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReadingLessonId(lesson.id);
                              }}
                              className="p-1 text-[#948C82] group-hover:text-[#B84E34] rounded transition-colors cursor-pointer"
                              aria-label={`第${lesson.number}課を読む`}
                              title="読む"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* インライン展開時 */}
                        {isOpen && (
                          <div className="p-4 sm:p-5 pt-3 border-t border-[#F0EBE1] space-y-4 bg-[#FAF7F2]/30">
                            {renderLessonContent(lesson)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 🔰 初級コンプリート案内バナー（中級への架け橋） */}
                {levelMode === 'beginner' && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-[#FAF7F2] border border-emerald-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎉</span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-emerald-900">
                          初級マスターバイブル（全30課）コンプリート！
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                          ハングルから複文・間接話法まで、初級の重要骨格はすべて揃いました。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-200/60 flex-wrap">
                      <span className="text-[10px] text-emerald-700">
                        さらに高度な表現・中級ステップアップへ挑戦する準備ができています。
                      </span>
                      <button
                        type="button"
                        onClick={() => changeLevelMode('intermediate')}
                        className="px-3 py-1.5 rounded-xl bg-[#1E3A5F] hover:bg-[#152840] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <span>🌿 中級モードを開く</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 🗺️ 完全制覇ロードマップ（地下鉄路線図風タイムライン・タップで開閉） */}
                <section
                  id="sec-roadmap"
                  className="scroll-mt-24 bg-white border border-[#E8E2D5] rounded-2xl p-3 sm:p-4 shadow-2xs transition-all mt-4"
                >
                  <div
                    onClick={() => setShowRoadmap(!showRoadmap)}
                    className="flex items-center justify-between gap-2 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF0EC] text-[#B84E34] flex items-center justify-center shrink-0 shadow-2xs">
                        <Map className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="text-xs sm:text-sm font-serif font-bold text-[#1B2A38]">
                            韓国語 完全制覇ロードマップ
                          </h2>
                          <span className="text-[10px] font-bold text-[#B84E34] bg-[#FAF0EC] px-1.5 py-0.2 rounded-full whitespace-nowrap">
                            TOPIK・ハン検・SLA準拠
                          </span>
                        </div>
                        <p className="text-[11px] text-[#756D63] font-sans truncate">
                          文字からネイティブ級（C2）までの8大ステーション
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#B84E34] font-bold shrink-0 whitespace-nowrap bg-[#FAF0EC] hover:bg-[#F5E5DF] px-2.5 py-1.5 rounded-xl transition-colors">
                      <span>{showRoadmap ? '閉じる' : '開く'}</span>
                      {showRoadmap ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {showRoadmap && (
                    <div className="pt-3.5 border-t border-[#F2ECE1] mt-3 space-y-4">
                      {/* イントロ＆一括開閉バー */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE7DC] text-xs">
                        <div className="text-[#544D45] leading-relaxed">
                          <span className="font-bold text-[#1B2A38]">🚆 公的シラバス（国立国語院・TOPIK・ハン検）準拠: </span>
                          日本語話者の強みを活かし、最速（約800〜1,100時間）で最上級へ到達する8段階科学的ルートです。
                        </div>
                        <button
                          type="button"
                          onClick={toggleAllRoadmapDetails}
                          className="self-end sm:self-center text-[11px] font-bold text-[#B84E34] hover:underline whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-[#EDE7DC] shadow-2xs"
                        >
                          <span>{expandAllRoadmapDetails ? '全詳細を閉じる' : '全詳細を展開'}</span>
                          {expandAllRoadmapDetails ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* 路線図タイムライン本体 */}
                      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-rose-500 before:rounded-full">
                        {ROADMAP_STEPS.map((step) => {
                          const stationColor = step.stationColor || '#B84E34';
                          const isDetailOpen = !!openRoadmapDetails[step.step];

                          return (
                            <div key={step.step} className="relative group">
                              {/* 駅マーカー（ナンバリングサークル） */}
                              <div
                                style={{ backgroundColor: stationColor }}
                                className="absolute -left-[27px] sm:-left-[31px] top-3.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px] sm:text-xs ring-4 ring-white shadow-xs shrink-0 select-none z-10"
                              >
                                {step.step}
                              </div>

                              {/* ステップカード */}
                              <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-2xs hover:border-[#D9CFBF] transition-all overflow-hidden">
                                {/* ① ヘッダー行 */}
                                <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#FAF7F2] to-white border-b border-[#F2ECE1] flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                    <span
                                      style={{ color: stationColor, borderColor: `${stationColor}30`, backgroundColor: `${stationColor}10` }}
                                      className="text-[11px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap flex items-center gap-1"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stationColor }} />
                                      Step {step.step}: {step.stage}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#1B2A38] bg-white px-2 py-0.5 rounded-md border border-[#EDE7DC] shadow-2xs whitespace-nowrap">
                                      {step.badge}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-mono text-[#756D63] font-bold shrink-0">
                                    ⏱️ {step.timeHours}
                                  </div>
                                </div>

                                {/* カード本文領域 */}
                                <div className="p-3 sm:p-3.5 space-y-2.5">
                                  {/* ② 到達基準 (Can-Do) */}
                                  <div className="space-y-1">
                                    <div className="text-[10.5px] font-bold text-[#756D63] flex items-center gap-1">
                                      <Target className="w-3.5 h-3.5 text-[#B84E34] shrink-0" />
                                      <span>到達指標 (公式Can-Do達成基準)</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-[#1B2A38] leading-relaxed font-sans pl-3 border-l-2 border-[#B84E34]/30">
                                      {step.academicBasis.officialCanDo}
                                    </p>
                                  </div>

                                  {/* ③ 累積語彙 & 出題文法（2分割ミニカード） */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE7DC]">
                                    <div className="flex items-start gap-1">
                                      <span className="font-bold text-[#1B2A38] shrink-0">📚 累積語彙:</span>
                                      <span className="text-[#544D45] leading-snug">{step.academicBasis.vocabCount}</span>
                                    </div>
                                    <div className="flex items-start gap-1 sm:border-l sm:border-[#EDE7DC] sm:pl-2">
                                      <span className="font-bold text-[#1B2A38] shrink-0">🔖 出題文法:</span>
                                      <span className="text-[#544D45] leading-snug">{step.academicBasis.grammarScope}</span>
                                    </div>
                                  </div>

                                  {/* ④ 象徴的モデルセリフ（スピーチカード） */}
                                  <div className="bg-[#FAF0EC]/30 rounded-xl p-3 border border-[#F2DED7] space-y-1.5">
                                    <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-[#B84E34]">
                                      <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>該当級の象徴的モデルセリフ</span>
                                      </span>
                                      <span className="text-[#8A8075] font-normal text-[10px]">
                                        TOPIK 말하기 / 面接基準
                                      </span>
                                    </div>

                                    <div className="flex items-start justify-between gap-2">
                                      <div className="space-y-0.5 min-w-0 flex-1">
                                        <p className="font-bold text-[#1B2A38] text-sm sm:text-base leading-snug">
                                          {step.representativeSpeech.ko}
                                        </p>
                                        {showPronunciation && step.representativeSpeech.reading && (
                                          <p className="text-[11px] text-[#8A8075] font-mono">
                                            {step.representativeSpeech.reading}
                                          </p>
                                        )}
                                        <p className="text-xs text-[#544D45]">
                                          {step.representativeSpeech.ja}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => speechService.speak(step.representativeSpeech.ko)}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CC] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                                        title="ネイティブ発音を聴く"
                                        aria-label="発音再生"
                                      >
                                        <Volume2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* 言語学的評価点 */}
                                    <div className="pt-1.5 border-t border-[#F0D5CC]/50 text-[11px] text-[#6B635B] leading-relaxed">
                                      <span className="font-bold text-[#B84E34]">💡 言語学的評価点: </span>
                                      <span>{step.representativeSpeech.linguisticPoint}</span>
                                    </div>
                                  </div>

                                  {/* ⑤ SLA科学的アクション ＆ 誤用分析（アコーディオン式でスッキリ開閉） */}
                                  <div className="pt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => toggleRoadmapDetail(step.step)}
                                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-bold text-[#1B2A38] flex items-center justify-between transition-colors cursor-pointer"
                                    >
                                      <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                                        <span>🧠 SLA科学的学習法 ＆ 誤用分析の罠</span>
                                        <span className="text-[10px] font-normal text-slate-500">
                                          ({isDetailOpen ? '閉じる' : '3アクション＋母語干渉対策'})
                                        </span>
                                      </span>
                                      {isDetailOpen ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                      )}
                                    </button>

                                    {isDetailOpen && (
                                      <div className="mt-2 space-y-2 pt-0.5">
                                        {/* 最短突破アクション */}
                                        {step.actionRoutines && step.actionRoutines.length > 0 && (
                                          <div className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                                            <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                                              <span>🏃 最短突破の科学的アクション (SLA):</span>
                                            </span>
                                            <ul className="space-y-1.5">
                                              {step.actionRoutines.map((act, aIdx) => (
                                                <li key={aIdx} className="text-xs text-emerald-950 flex items-start gap-1.5 leading-relaxed">
                                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                                  <span>{act}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {/* 誤用分析 & 突破法 */}
                                        {step.slaTips && (
                                          <div className="p-2.5 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-1.5 text-xs">
                                            <div className="flex items-start gap-1">
                                              <span className="font-bold text-amber-900 shrink-0 whitespace-nowrap">⚠️ 誤用分析の罠:</span>
                                              <span className="text-amber-950 leading-relaxed">{step.slaTips.frequentError}</span>
                                            </div>
                                            <div className="flex items-start gap-1 pt-1.5 border-t border-amber-200/60">
                                              <span className="font-bold text-emerald-900 shrink-0 whitespace-nowrap">💡 科学的突破法:</span>
                                              <span className="text-emerald-950 leading-relaxed">{step.slaTips.breakthrough}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* ⑥ アプリ内直結リンク（ピルタグスタイル） */}
                                  {step.links && step.links.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#F2ECE1]">
                                      <span className="text-[10px] font-bold text-[#8A8075] shrink-0 mr-0.5">直結教材:</span>
                                      {step.links.map((link) => (
                                        <button
                                          key={link.id}
                                          type="button"
                                          onClick={() => scrollTo(link.id, link.tab)}
                                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] hover:bg-[#FAF0EC] border border-[#E2DDD2] hover:border-[#B84E34] text-[11px] text-[#B84E34] font-medium transition-all cursor-pointer shadow-2xs"
                                        >
                                          <span>▶ {link.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 【第2部：参考書編】使い分けバイブル60選 ＆ Q&A 10選 ＆ 特別コラム */}
        {/* ------------------------------------------------------------- */}
        {/* 【第2部：参考書編】使い分けバイブル60選 ＆ Q&A 10選 ＆ 特別コラム */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'reference' && (
          <div className="space-y-2.5">
            {/* 💡 参考書 カテゴリーバー（収納式：タップで展開/折りたたみ） */}
            <div className="bg-white border border-[#E8E2D5] rounded-xl shadow-2xs overflow-hidden transition-all">
              {/* 普段表示される極薄1行バー */}
              <div className="p-2 sm:px-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowRefNav(!showRefNav)}
                  aria-expanded={showRefNav}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A38] hover:text-[#B84E34] transition-colors cursor-pointer min-w-0"
                  title="タップしてカテゴリーやサブタブを切り替える"
                >
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#FAF0EC] text-[#B84E34] shrink-0">
                    {refSubTab === 'pairs' ? '使い分け' : refSubTab === 'qa' ? 'Q&A' : refSubTab === 'columns' ? 'コラム' : refSubTab === 'hanja' ? '四字熟語' : '論述・統計'}
                  </span>
                  <span className="truncate text-xs font-serif">
                    {refSubTab === 'pairs'
                      ? `使い分け · ${CONFUSING_PARTS.find((p) => p.id === confusingCategory)?.label || 'すべて'}`
                      : refSubTab === 'qa'
                      ? `よくある質問 (${QA_DATA.length}選)`
                      : refSubTab === 'columns'
                      ? `コラム講義 (${COLUMNS_DATA.length}選)`
                      : refSubTab === 'hanja'
                      ? `四字熟語 (${HANJA_IDIOMS_DATA.length}選)`
                      : `時事論述・統計表現 (${ADVANCED_WRITING_DATA.length}選)`}
                  </span>
                  {showRefNav ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#B84E34] shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#948C82] shrink-0" />
                  )}
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  {refSubTab === 'pairs' && (
                    <button
                      type="button"
                      onClick={handleToggleExpandAllPairs}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                    >
                      {expandAllPairs ? 'すべて閉じる' : 'すべて開く'}
                    </button>
                  )}
                  {refSubTab === 'hanja' && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = !expandAllHanjas;
                        setExpandAllHanjas(next);
                        const m: Record<string, boolean> = {};
                        HANJA_IDIOMS_DATA.forEach((h) => { m[h.id] = next; });
                        setOpenHanjas(m);
                      }}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                    >
                      {expandAllHanjas ? 'すべて閉じる' : 'すべて開く'}
                    </button>
                  )}
                  {refSubTab === 'writing' && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = !expandAllWritings;
                        setExpandAllWritings(next);
                        const m: Record<string, boolean> = {};
                        ADVANCED_WRITING_DATA.forEach((w) => { m[w.id] = next; });
                        setOpenWritings(m);
                      }}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                    >
                      {expandAllWritings ? 'すべて閉じる' : 'すべて開く'}
                    </button>
                  )}
                </div>
              </div>

              {/* タップ時のみ展開される収納エリア（サブタブ3種または5種 ＆ 品詞ピル） */}
              <div className={`${showRefNav ? 'block border-t border-[#F0EBE1] p-2 bg-[#FAF7F2]/60 space-y-2' : 'hidden'}`}>
                {/* 分割セグメントサブタブ */}
                <div className={`grid ${levelMode === 'advanced' ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-3'} gap-1 bg-[#F2ECE1] p-1 rounded-xl text-[11px] sm:text-xs font-bold`}>
                  <button
                    type="button"
                    onClick={() => {
                      setRefSubTab('pairs');
                      setShowRefNav(false);
                    }}
                    className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal ${
                      refSubTab === 'pairs'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    💡 使い分け ({CONFUSING_PAIRS_DATA.length}選)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRefSubTab('qa');
                      setShowRefNav(false);
                    }}
                    className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal ${
                      refSubTab === 'qa'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    ❓ 疑問Q&A ({QA_DATA.length}選)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRefSubTab('columns');
                      setShowRefNav(false);
                    }}
                    className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal ${
                      refSubTab === 'columns'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    📰 特別コラム ({COLUMNS_DATA.length}選)
                  </button>
                  {levelMode === 'advanced' && (
                    <button
                      type="button"
                      onClick={() => {
                        setRefSubTab('hanja');
                        setShowRefNav(false);
                      }}
                      className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal flex items-center justify-center gap-1 ${
                        refSubTab === 'hanja'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                          : 'text-[#6B635B] hover:text-[#1B2A38]'
                      }`}
                    >
                      <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-amber-100 text-amber-900">上級</span>
                      <span>👑 四字熟語 ({HANJA_IDIOMS_DATA.length}選)</span>
                    </button>
                  )}
                  {levelMode === 'advanced' && (
                    <button
                      type="button"
                      onClick={() => {
                        setRefSubTab('writing');
                        setShowRefNav(false);
                      }}
                      className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal flex items-center justify-center gap-1 ${
                        refSubTab === 'writing'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                          : 'text-[#6B635B] hover:text-[#1B2A38]'
                      }`}
                    >
                      <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-amber-100 text-amber-900">上級</span>
                      <span>✍️ 時事論述・統計 ({ADVANCED_WRITING_DATA.length}選)</span>
                    </button>
                  )}
                </div>

                {/* 品詞ピル（使い分けタブの場合） */}
                {refSubTab === 'pairs' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[10px] font-bold text-[#8A8075] shrink-0">品詞絞り込み:</span>
                    {CONFUSING_PARTS.map((p) => {
                      const isCurrent = confusingCategory === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setConfusingCategory(p.id);
                            setShowRefNav(false);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            isCurrent
                              ? 'bg-[#B84E34] text-white shadow-xs'
                              : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ① 💡 似ていて紛らわしい表現・単語 60選 */}
            {refSubTab === 'pairs' && (
              <div className="space-y-2">
                {/* 検索バー */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={confusingSearch}
                    onChange={(e) => setConfusingSearch(e.target.value)}
                    placeholder="表現・テーマ・単語を検索..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                  />
                  {confusingSearch && (
                    <button
                      type="button"
                      onClick={() => setConfusingSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              {/* 36ペア 授業ノート風の1枚シートリスト */}
              <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                {filteredConfusingPairs.map((pair) => {
                  const isOpen = !!openPairs[pair.id];
                  return (
                    <div
                      key={pair.id}
                      id={pair.id}
                      className="scroll-mt-28 transition-all"
                    >
                      {/* シンプルな2行リスト行 */}
                      <div
                        onClick={() => togglePair(pair.id)}
                        className="p-3 sm:px-4 flex items-center justify-between gap-2 cursor-pointer select-none hover:bg-[#FAF7F2]/60 transition-colors group"
                      >
                        <div className="flex items-baseline gap-2 min-w-0 flex-1">
                          <span className="text-[11px] font-sans font-bold text-[#948C82] w-5 text-right shrink-0">
                            {pair.no}.
                          </span>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                              {pair.pairTitle}
                            </h3>
                            <div className="text-xs text-[#6B635B] font-sans truncate">
                              {pair.theme}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0">
                          {renderItemStatusBadgeAndPin(pair.id)}
                          <span className="text-[#948C82] p-1">
                            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </span>
                        </div>
                      </div>

                      {/* アコーディオン開いた詳細エリア */}
                      {isOpen && (
                        <div className="p-4 sm:p-5 pt-3 border-t border-[#F2ECE1] space-y-4 bg-white">
                          {/* ① 🎯 核心ニュアンスの違い */}
                          <div className="p-3 sm:p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D5] space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B84E34]">
                              <span>🎯 核心ニュアンスの違い</span>
                            </div>
                            <p className={`text-[#3A332C] leading-relaxed ${isLargeFont ? 'text-base' : 'text-xs sm:text-sm'}`}>
                              {pair.coreDifference}
                            </p>
                          </div>

                          {/* ② ⚠️ 日本人が陥る罠 */}
                          <div className="p-3 sm:p-3.5 bg-[#FFF9F5] rounded-xl border border-[#F2D7CE] space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C04828]">
                              <span>⚠️ 日本人が陥る罠・勘違い</span>
                            </div>
                            <p className={`text-[#5A3A31] leading-relaxed ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs'}`}>
                              {pair.trap}
                            </p>
                          </div>

                          {/* ③ 例文比較（A vs B） */}
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-[#1B2A38] block">
                              📝 リアル使い分け例文
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {/* 例文A */}
                              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D5] space-y-1.5 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-[#B84E34] uppercase tracking-wider">
                                      表現 A
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => speechService.speak(pair.exA.ko)}
                                      className="p-1 rounded-md text-[#B84E34] hover:bg-[#FAF0EC] transition-colors cursor-pointer"
                                      title="発音を聞く"
                                    >
                                      <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                    {pair.exA.ko}
                                  </div>
                                  {showPronunciation && pair.exA.reading && (
                                    <div className="text-[11px] text-[#8A8075] font-mono">
                                      [{pair.exA.reading}]
                                    </div>
                                  )}
                                </div>
                                <div className={`text-[#544D45] pt-1 border-t border-[#E8E2D5]/60 ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                  {pair.exA.ja}
                                </div>
                              </div>

                              {/* 例文B */}
                              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D5] space-y-1.5 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-[#1B2A38] uppercase tracking-wider">
                                      表現 B
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => speechService.speak(pair.exB.ko)}
                                      className="p-1 rounded-md text-[#B84E34] hover:bg-[#FAF0EC] transition-colors cursor-pointer"
                                      title="発音を聞く"
                                    >
                                      <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                    {pair.exB.ko}
                                  </div>
                                  {showPronunciation && pair.exB.reading && (
                                    <div className="text-[11px] text-[#8A8075] font-mono">
                                      [{pair.exB.reading}]
                                    </div>
                                  )}
                                </div>
                                <div className={`text-[#544D45] pt-1 border-t border-[#E8E2D5]/60 ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                  {pair.exB.ja}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ④ ❌ よくあるNG例 */}
                          <div className="p-3 sm:p-3.5 bg-[#FFF5F5] rounded-xl border border-[#F8D2D2] space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D32F2F]">
                              <span>❌ やってしまいがちなNG例</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="font-bold text-[#B71C1C] flex items-center gap-1">
                                <span className="line-through">{pair.ngExample.wrong}</span>
                              </div>
                              <div className="text-[#6D2828] text-[11px] leading-relaxed">
                                {pair.ngExample.description}
                              </div>
                              <div className="text-[#2E7D32] font-bold bg-white/80 p-1.5 rounded-lg border border-[#C8E6C9] mt-1 flex items-center gap-1">
                                <span>⭕ 正しい表現:</span>
                                <span>{pair.ngExample.correct}</span>
                              </div>
                            </div>
                          </div>

                          {/* ⑤ 💡 1秒で迷わないコツ */}
                          <div className="p-3 sm:p-3.5 bg-linear-to-r from-[#FAF0EC] to-[#FAF7F2] rounded-xl border border-[#F0D5CD] space-y-1">
                            <div className="flex items-center gap-1 text-xs font-bold text-[#B84E34]">
                              <span>💡 1秒で迷わないコツ</span>
                            </div>
                            <p className={`font-bold text-[#1B2A38] leading-relaxed ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                              {pair.tip}
                            </p>
                          </div>

                          {/* ⑥ 🎯次回ミッション・🟢実戦クリア・＋1秒めくり追加・📖授業実例 */}
                          {renderActionAndMyAlbum(pair.id, {
                            expression: pair.exA.ko,
                            meaning: pair.exA.ja,
                            reading: pair.exA.reading,
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ② 初級の疑問 Q&A */}
          {refSubTab === 'qa' && (
            <div className="space-y-2.5">
              {/* Q&A 検索バー */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={qaSearch}
                  onChange={(e) => setQaSearch(e.target.value)}
                  placeholder="質問・回答・キーワードを検索..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                />
                {qaSearch && (
                  <button
                    type="button"
                    onClick={() => setQaSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* テーマ別絞り込みピル */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {QA_CATEGORIES.map((cat) => {
                  const isCurrent = qaCategory === cat.id;
                  const count = cat.id === 'all'
                    ? QA_DATA.length
                    : QA_DATA.filter((qa) => getQACategory(qa.id) === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setQaCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-[#B84E34] text-white shadow-xs'
                          : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-[#FAF0EC] text-[#B84E34]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ヘッダー＆一括開閉バー */}
              <div className="flex items-center justify-between text-xs px-1 text-[#756D63]">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#B84E34]" />
                  <span className="font-bold text-[#1B2A38]">
                    初級の疑問 Q&A（全{QA_DATA.length}選 · {filteredQAs.length}件表示）
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleExpandAllQAs}
                  className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap bg-white border border-[#E8E2D5] shadow-2xs"
                >
                  {expandAllQAs ? 'すべて閉じる' : 'すべて開く'}
                </button>
              </div>

              {/* Q&A リスト */}
              {filteredQAs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E2D5] p-8 text-center text-xs text-[#8A8075]">
                  一致するQ&Aが見つかりませんでした。別のキーワードをお試しください。
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredQAs.map((qa) => {
                    const isOpen = !!openQAs[qa.id];
                    const catLabel = QA_CATEGORIES.find((c) => c.id === getQACategory(qa.id))?.label.replace(/^[^\s]+\s*/, '') || '文法';
                    return (
                      <div
                        key={qa.id}
                        id={qa.id}
                        className="scroll-mt-28 bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs overflow-hidden transition-all"
                      >
                        <div
                          onClick={() => toggleQA(qa.id)}
                          className="p-3 sm:px-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#FAF7F2]/60 transition-colors"
                        >
                          <div className="flex items-baseline gap-2 min-w-0 flex-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF0EC] text-[#B84E34] shrink-0">
                              {catLabel}
                            </span>
                            <h3 className={`font-serif font-bold text-[#1B2A38] hover:text-[#B84E34] flex-1 leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
                              {qa.q}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                scrollTo(qa.linkLesson.id, 'textbook');
                              }}
                              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#B84E34] bg-[#FAF0EC] hover:bg-[#F5E6DF] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <span>{qa.linkLesson.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            <span className="text-[#948C82] p-1">
                              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-3.5 sm:p-5 pt-1 border-t border-[#F2ECE1] space-y-3 bg-[#FAF7F2]/20">
                            <div className="sm:hidden">
                              <button
                                type="button"
                                onClick={() => scrollTo(qa.linkLesson.id, 'textbook')}
                                className="flex items-center gap-1 text-xs font-bold text-[#B84E34] bg-[#FAF0EC] px-2.5 py-1 rounded-lg"
                              >
                                <span>💡 {qa.linkLesson.label}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="p-3 sm:p-3.5 bg-[#FAF7F2] rounded-xl text-[#3A332C] leading-relaxed border border-[#E8E2D5] space-y-1">
                              <div className={`font-bold text-[#B84E34] ${isLargeFont ? 'text-sm' : 'text-xs'}`}>💡 氷解アンサー:</div>
                              <p className={`whitespace-pre-line text-[#2E2822] ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>{qa.a}</p>
                            </div>

                            <div className={`space-y-1 bg-white p-3 rounded-xl border border-[#EDE7DC] font-mono text-xs ${isLargeFont ? 'text-sm' : 'text-[11px] sm:text-xs'}`}>
                              <div className="text-[#1B2A38]">・{qa.ex1}</div>
                              <div className="text-[#1B2A38]">・{qa.ex2}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ③ 特別コラム集（目次型アコーディオン収納） */}
          {refSubTab === 'columns' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs px-1 text-[#756D63]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B84E34]" />
                  <h3 className="font-bold text-[#1B2A38]">
                    特別コラム（初級から中級へ羽ばたくブースター）全{COLUMNS_DATA.length}講義
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleToggleExpandAllColumns}
                  className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap bg-white border border-[#E8E2D5] shadow-2xs"
                >
                  {expandAllColumns ? 'すべて閉じる' : 'すべて開く'}
                </button>
              </div>

              <div className="space-y-2">
                {COLUMNS_DATA.map((col) => {
                  const isOpen = !!openColumns[col.id];
                  return (
                    <div
                      key={col.id}
                      id={col.id}
                      className="scroll-mt-28 bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs overflow-hidden transition-all"
                    >
                      <div
                        onClick={() => toggleColumn(col.id)}
                        className="p-3 sm:px-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#FAF7F2]/60 transition-colors"
                      >
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className={`font-serif font-bold text-[#1B2A38] hover:text-[#B84E34] ${isLargeFont ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
                              {col.title}
                            </h4>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FAF0EC] text-[#B84E34] shrink-0">
                              カード{col.cards.length}枚
                            </span>
                          </div>
                          <p className="text-[11px] text-[#756D63] truncate">
                            {col.description}
                          </p>
                        </div>
                        <span className="text-[#948C82] p-1 shrink-0">
                          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="p-3.5 sm:p-4 pt-1 border-t border-[#F2ECE1] space-y-3 bg-[#FAF7F2]/30">
                          <p className={`text-[#544D45] leading-relaxed ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                            {col.description}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {col.cards.map((card, cIdx) => (
                              <div key={cIdx} className="p-2.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1 shadow-2xs">
                                <strong className={`text-[#1B2A38] block ${isLargeFont ? 'text-sm' : 'text-xs'}`}>{card.label}</strong>
                                <div className={`text-[#423B33] leading-relaxed ${isLargeFont ? 'text-sm' : 'text-xs'}`}>{card.content}</div>
                                {card.sub && <div className={`text-[#756D63] mt-0.5 ${isLargeFont ? 'text-xs' : 'text-[10.5px]'}`}>{card.sub}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ④ 👑 上級四字熟語（사자성어 40選） */}
          {refSubTab === 'hanja' && (
            <div className="space-y-2">
              {/* 検索バー ＆ カテゴリーピル */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={hanjaSearch}
                    onChange={(e) => setHanjaSearch(e.target.value)}
                    placeholder="四字熟語・漢字・意味・由来を検索..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                  />
                  {hanjaSearch && (
                    <button
                      type="button"
                      onClick={() => setHanjaSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* カテゴリーピル */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                  <span className="text-[10px] font-bold text-[#8A8075] shrink-0">分野別:</span>
                  {[
                    { id: 'all', label: `すべて (${HANJA_IDIOMS_DATA.length})` },
                    { id: 'life', label: '人生・運命' },
                    { id: 'effort', label: '努力・成長' },
                    { id: 'wisdom', label: '教訓・知恵' },
                    { id: 'relation', label: '人間関係' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setHanjaCategory(cat.id as any)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        hanjaCategory === cat.id
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                          : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 四字熟語一覧カード */}
              <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                {displayedHanjas.length === 0 ? (
                  <div className="p-8 text-center text-[#948C82] text-xs">
                    一致する四字熟語が見つかりませんでした
                  </div>
                ) : (
                  displayedHanjas.map((item) => {
                    const isOpen = !!openHanjas[item.id];
                    return (
                      <div key={item.id} id={item.id} className="scroll-mt-24">
                        <div
                          onClick={() => setOpenHanjas((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                        >
                          <div className="flex items-baseline gap-2 flex-1 min-w-0">
                            <span className="text-[11px] font-sans font-bold text-amber-700/80 w-6 text-right shrink-0">
                              {item.no}.
                            </span>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-bold text-[#1B2A38] group-hover:text-amber-800 transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                  {item.hangul}
                                </h3>
                                <span className="text-xs font-serif font-bold text-amber-800/80 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                                  {item.hanja}
                                </span>
                                {showPronunciation && (
                                  <span className="text-[11px] text-[#8A8075] font-mono">
                                    {item.reading}
                                  </span>
                                )}
                              </div>
                              <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                {item.meaningJa}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speechService.speak(item.hangul);
                              }}
                              className="p-1 rounded-md text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="発音を聞く"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            {renderItemStatusBadgeAndPin(item.id)}
                            <span className="text-[#948C82] p-1">
                              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-3.5 sm:p-4 pt-2 border-t border-[#F0EBE1] space-y-3 bg-[#FCFAF7]/40">
                            <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-[#544D45] space-y-1">
                              <div className="font-bold text-amber-900 flex items-center gap-1">
                                <span>💡 由来・TOPIK解説:</span>
                              </div>
                              <p className="leading-relaxed text-[#423B33]">{item.explanation}</p>
                            </div>

                            <div className="p-3 sm:p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#756D63]">🗣️ 実際の例文:</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speechService.speak(item.exampleKo);
                                  }}
                                  className="p-1 rounded-md text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                  title="例文の発音を聞く"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                {item.exampleKo}
                              </div>
                              {showPronunciation && item.exampleReading && (
                                <div className={`text-[#8A8075] font-mono ${isLargeFont ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                                  {item.exampleReading}
                                </div>
                              )}
                              <div className={`text-[#423B33] pt-0.5 border-t border-[#F0D5CD]/40 ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                                訳: {item.exampleJa}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ⑤ 👑 上級時事・論述表現（TOPIK 54番 20選） */}
          {refSubTab === 'writing' && (
            <div className="space-y-2">
              {/* 検索バー ＆ カテゴリーピル */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={writingSearch}
                    onChange={(e) => setWritingSearch(e.target.value)}
                    placeholder="論述表現・キーワード・意味を検索..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                  />
                  {writingSearch && (
                    <button
                      type="button"
                      onClick={() => setWritingSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* カテゴリーピル */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                  <span className="text-[10px] font-bold text-[#8A8075] shrink-0">分野・構成:</span>
                  {[
                    { id: 'all', label: `すべて (${ADVANCED_WRITING_DATA.length})` },
                    { id: 'survey', label: '📊 調査概要' },
                    { id: 'trend', label: '📈 増減推移' },
                    { id: 'rank', label: '🏆 順位比較' },
                    { id: 'outlook', label: '🔮 展望原因' },
                    { id: 'intro', label: '✍️ 序論・提起' },
                    { id: 'argument', label: '💡 本論・展開' },
                    { id: 'counter', label: '⚖️ 反論・対比' },
                    { id: 'conclusion', label: '🎯 結論・提言' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setWritingCategory(cat.id as any)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        writingCategory === cat.id
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                          : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 時事論述一覧カード */}
              <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                {displayedWritings.length === 0 ? (
                  <div className="p-8 text-center text-[#948C82] text-xs">
                    一致する表現が見つかりませんでした
                  </div>
                ) : (
                  displayedWritings.map((item) => {
                    const isOpen = !!openWritings[item.id];
                    return (
                      <div key={item.id} id={item.id} className="scroll-mt-24">
                        <div
                          onClick={() => setOpenWritings((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                        >
                          <div className="flex items-baseline gap-2 flex-1 min-w-0">
                            <span className="text-[11px] font-sans font-bold text-amber-700/80 w-6 text-right shrink-0">
                              {item.no}.
                            </span>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-bold text-[#1B2A38] group-hover:text-amber-800 transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                  {item.korean}
                                </h3>
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded">
                                  {item.type === 'topik53' ? '53番 ' : '54番 '}
                                  {item.category === 'intro' ? '序論' : item.category === 'argument' ? '本論' : item.category === 'counter' ? '反論' : item.category === 'conclusion' ? '結論' : item.category === 'survey' ? '調査概要' : item.category === 'trend' ? '増減推移' : item.category === 'rank' ? '順位比較' : '展望原因'}
                                </span>
                              </div>
                              <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                {item.meaningJa}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speechService.speak(item.korean);
                              }}
                              className="p-1 rounded-md text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="発音を聞く"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            {renderItemStatusBadgeAndPin(item.id)}
                            <span className="text-[#948C82] p-1">
                              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-3.5 sm:p-4 pt-2 border-t border-[#F0EBE1] space-y-3 bg-[#FCFAF7]/40">
                            <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-[#544D45]">
                              <span className="font-bold text-amber-900 mr-1.5">✍️ 作文での配置・使われ方:</span>
                              <span>{item.usageTip}</span>
                            </div>

                            <div className="p-3 sm:p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#756D63]">🗣️ 論文・論述での実例:</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speechService.speak(item.exampleKo);
                                  }}
                                  className="p-1 rounded-md text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                  title="例文の発音を聞く"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                {item.exampleKo}
                              </div>
                              <div className={`text-[#423B33] pt-0.5 border-t border-[#F0D5CD]/40 ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                                訳: {item.exampleJa}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

        {/* ------------------------------------------------------------- */}
        {/* 【第3部：辞書編】文法逆引き180選 ＆ 重要単語1000選              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'dictionary' && (
          <div className="space-y-2.5">
            {/* 🔖 辞書 カテゴリーバー（収納式：タップで展開/折りたたみ） */}
            <div className="bg-white border border-[#E8E2D5] rounded-xl shadow-2xs overflow-hidden transition-all">
              {/* 普段表示される極薄1行バー */}
              <div className="p-2 sm:px-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowDictNav(!showDictNav)}
                  aria-expanded={showDictNav}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A38] hover:text-[#B84E34] transition-colors cursor-pointer min-w-0"
                  title="タップして辞書カテゴリーや範囲を切り替える"
                >
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#FAF0EC] text-[#B84E34] shrink-0">
                    {dictSubTab === 'grammar' ? '文法' : dictSubTab === 'vocab' ? '単語' : '数字'}
                  </span>
                  <span className="truncate text-xs font-serif">
                    {dictSubTab === 'grammar'
                      ? `文法 (${dictRange === 'all' ? `全${GRAMMAR_DICT_DATA.length}選` : DICT_BLOCKS.find((b) => b.range === dictRange)?.label || '全選'})`
                      : dictSubTab === 'vocab'
                      ? `必須単語 (${VOCAB_CATEGORIES.find((c) => c.id === selectedVocabCategory)?.label || 'すべて'})`
                      : '数字・時刻の攻略'}
                  </span>
                  {showDictNav ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#B84E34] shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#948C82] shrink-0" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  {dictSubTab === 'grammar' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setDictRange((prev) => (prev === 'all' ? '1-20' : 'all'));
                        }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          dictRange === 'all'
                            ? 'bg-[#B84E34] text-white shadow-xs'
                            : 'text-[#B84E34] hover:bg-[#FAF0EC]'
                        }`}
                      >
                        {levelMode === 'beginner' ? '初級全80選を表示' : levelMode === 'intermediate' ? '中級全180選を表示' : `全${GRAMMAR_DICT_DATA.length}選を表示`}
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleExpandAllDicts}
                        className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                      >
                        {expandAllDicts ? 'すべて閉じる' : 'すべて開く'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* タップ時のみ展開される収納エリア（サブタブ3種 ＆ ブロック/カテゴリー） */}
              <div className={`${showDictNav ? 'block border-t border-[#F0EBE1] p-2 bg-[#FAF7F2]/60 space-y-2' : 'hidden'}`}>
                {/* 3分割セグメントサブタブ */}
                <div className="grid grid-cols-3 gap-1 bg-[#F2ECE1] p-1 rounded-xl text-[11px] sm:text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setDictSubTab('grammar');
                      setShowDictNav(false);
                    }}
                    className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal ${
                      dictSubTab === 'grammar'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    文法逆引き ({GRAMMAR_DICT_DATA.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDictSubTab('vocab');
                      setShowDictNav(false);
                    }}
                    className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal ${
                      dictSubTab === 'vocab'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    重要単語 ({ESSENTIAL_VOCAB_DATA.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDictSubTab('numbers');
                      setShowDictNav(false);
                    }}
                    className={`py-2 px-1 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal ${
                      dictSubTab === 'numbers'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    数字・単位
                  </button>
                </div>

                {/* 文法サブタブの場合：ブロック切り替えボタン */}
                {dictSubTab === 'grammar' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#756D63] px-1 font-bold">
                      <span>文法ブロックを選択:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDictRange('all');
                          setShowDictNav(false);
                        }}
                        className="text-[#B84E34] hover:underline"
                      >
                        全項目を一括表示
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                      {DICT_BLOCKS
                        .filter((blk) => {
                          if (levelMode === 'beginner') {
                            return ['1-20', '21-40', '41-60', '61-80'].includes(blk.range);
                          }
                          if (levelMode === 'intermediate') {
                            return ['1-20', '21-40', '41-60', '61-80', '81-100', '101-130', '131-155', '156-180'].includes(blk.range);
                          }
                          return true;
                        })
                        .map((blk) => {
                        const isCurrent = dictRange === blk.range;
                        const isIntermediate = ['81-100', '101-130', '131-155', '156-180'].includes(blk.range);
                        const isAdvanced = ['181-200', '201-225', '226-250'].includes(blk.range);
                        return (
                          <button
                            key={blk.id}
                            type="button"
                            onClick={() => {
                              setDictRange(blk.range);
                              if (isAdvanced && levelMode !== 'advanced') setLevelMode('advanced');
                              else if (isIntermediate && levelMode === 'beginner') setLevelMode('intermediate');
                              setOpenDicts((prev) => ({ ...prev, [blk.firstDictId]: true }));
                              setShowDictNav(false);
                            }}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer truncate text-left border flex items-center justify-between gap-1 ${
                              isCurrent
                                ? isAdvanced
                                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-xs'
                                  : isIntermediate
                                  ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                                  : 'bg-[#1B2A38] text-white border-[#1B2A38] shadow-xs'
                                : 'bg-white text-[#6B635B] hover:text-[#1B2A38] border-[#E8E2D5]'
                            }`}
                          >
                            <span className="truncate">{blk.label}</span>
                            <span className={`text-[9px] px-1 py-0.2 rounded font-bold shrink-0 ${
                              isAdvanced
                                ? isCurrent ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                                : isIntermediate
                                ? isCurrent ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-900'
                                : isCurrent ? 'bg-white/20 text-white' : 'bg-[#FAF0EC] text-[#B84E34]'
                            }`}>
                              {isAdvanced ? '上級' : isIntermediate ? '中級' : '初級'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 単語サブタブの場合：単語カテゴリー */}
                {dictSubTab === 'vocab' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[10px] font-bold text-[#8A8075] shrink-0">カテゴリー:</span>
                    {VOCAB_CATEGORIES.map((cat) => {
                      const isCurrent = selectedVocabCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedVocabCategory(cat.id);
                            setShowDictNav(false);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            isCurrent
                              ? 'bg-[#B84E34] text-white shadow-xs'
                              : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                          }`}
                        >
                          {cat.label} ({cat.count})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ① 文法逆引き辞書 (180選) */}
            {dictSubTab === 'grammar' && (
              <div className="space-y-2.5">
                {/* 文法 検索バー */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={grammarSearch}
                    onChange={(e) => setGrammarSearch(e.target.value)}
                    placeholder="文法名・意味・接続ルールを検索..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                  />
                  {grammarSearch && (
                    <button
                      type="button"
                      onClick={() => setGrammarSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 目的・意味別 絞り込みピル */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {GRAMMAR_CATEGORIES.map((cat) => {
                    const isCurrent = grammarCategory === cat.id;
                    const count = cat.id === 'all'
                      ? GRAMMAR_DICT_DATA.length
                      : GRAMMAR_DICT_DATA.filter((d) => getGrammarCategory(d) === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setGrammarCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-[#B84E34] text-white shadow-xs'
                            : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] px-1 py-0.2 rounded-full ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-[#FAF0EC] text-[#B84E34]'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 件数表示 ＆ リセットバー */}
                <div className="flex items-center justify-between text-xs px-1 text-[#756D63]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#1B2A38]">
                      {grammarCategory !== 'all' || grammarSearch.trim()
                        ? `絞り込み結果: ${displayedDicts.length}項目`
                        : dictRange === 'all'
                        ? `全${GRAMMAR_DICT_DATA.length}項目を表示中`
                        : `${DICT_BLOCKS.find((b) => b.range === dictRange)?.label || ''} (${displayedDicts.length}項目)`}
                    </span>
                  </div>
                  {(grammarCategory !== 'all' || grammarSearch.trim()) && (
                    <button
                      type="button"
                      onClick={() => {
                        setGrammarCategory('all');
                        setGrammarSearch('');
                      }}
                      className="text-[#B84E34] hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      条件をクリア
                    </button>
                  )}
                </div>

                {/* 辞書 授業ノート風の1枚シートリスト */}
                {displayedDicts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E8E2D5] p-8 text-center text-xs text-[#8A8075]">
                    一致する文法が見つかりませんでした。別のキーワードをお試しください。
                  </div>
                ) : (
                  <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                  {displayedDicts.map((item) => {
                    const isOpen = !!openDicts[item.id];
                    return (
                      <div key={item.id} id={item.id} className="scroll-mt-24">
                        <div
                          onClick={() => setBottomSheetItem({ type: 'dict', id: item.id })}
                          className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                        >
                          <div className="flex items-baseline gap-2 flex-1 min-w-0">
                            <span className="text-[11px] font-sans font-bold text-[#948C82] w-6 text-right shrink-0">
                              {item.no}.
                            </span>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                {item.grammar}
                              </h3>
                              <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                {item.meaning}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            {renderItemStatusBadgeAndPin(item.id)}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBottomSheetItem({ type: 'dict', id: item.id });
                              }}
                              className="p-1 text-[#948C82] group-hover:text-[#B84E34] rounded transition-colors cursor-pointer"
                              aria-label="詳細"
                              title="詳細を見る"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-3.5 sm:p-4 pt-2 border-t border-[#F0EBE1] space-y-2.5 bg-[#FAF7F2]/30">
                            {item.linkTextbook && (
                              <div className="sm:hidden">
                                <button
                                  type="button"
                                  onClick={() => scrollTo(item.linkTextbook!.id, 'textbook')}
                                  className="flex items-center gap-1 text-xs font-bold text-[#B84E34] bg-[#FAF0EC] px-2.5 py-1 rounded-lg"
                                >
                                  <span>💡 {item.linkTextbook.label}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            <div className={`text-[#423B33] ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                              <strong>接続:</strong> <span className="font-mono text-[#B84E34] font-medium">{item.connection}</span>
                            </div>

                            <div className={`p-3 bg-white rounded-xl font-mono text-emerald-950 border border-[#E2DDD2] leading-relaxed ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                              {item.example}
                            </div>

                            <div className={`text-[#544D45] leading-relaxed pt-0.5 ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                              💡 <strong>ポイント:</strong> {item.tip}
                            </div>

                            {renderActionAndMyAlbum(item.id, {
                              expression: item.grammar,
                              meaning: item.meaning,
                              exampleSentence: item.example,
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

            {/* ② 重要単語 (300選：動詞・形容詞・名詞カテゴリー別) */}
            {dictSubTab === 'vocab' && (
              <div className="space-y-2.5">
                {/* 検索バー ＆ カテゴリー選択ピル */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={vocabSearchQuery}
                      onChange={(e) => setVocabSearchQuery(e.target.value)}
                      placeholder="単語・発音・意味を検索..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                    />
                    {vocabSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setVocabSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs px-0.5 text-[#756D63]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#1B2A38]">
                        {displayedVocabs.length === 0
                          ? '0語'
                          : `${(vocabPage - 1) * VOCAB_PAGE_SIZE + 1}〜${Math.min(vocabPage * VOCAB_PAGE_SIZE, displayedVocabs.length)}語 / 全${displayedVocabs.length}語`}
                      </span>
                      {totalVocabPages > 1 && (
                        <span className="text-[11px] text-[#B84E34] font-bold">
                          （{vocabPage} / {totalVocabPages} ページ）
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 300単語 授業ノート風の1枚シートリスト (25語/ページ) */}
                <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                  {paginatedVocabs.map((vocab) => (
                    <div
                      key={vocab.id}
                      id={vocab.id}
                      onClick={() => setBottomSheetItem({ type: 'vocab', id: vocab.id })}
                      className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                    >
                      <div className="flex items-baseline gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-sans font-bold text-[#948C82] w-6 text-right shrink-0">
                          {vocab.no}.
                        </span>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                              {vocab.word}
                            </h3>
                            {vocab.presentForm && (
                              <span className="text-xs font-medium text-[#B84E34]">
                                {vocab.presentForm}
                              </span>
                            )}
                          </div>
                          <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                            {vocab.meaning}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        {renderItemStatusBadgeAndPin(vocab.id)}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBottomSheetItem({ type: 'vocab', id: vocab.id });
                          }}
                          className="p-1 text-[#948C82] group-hover:text-[#B84E34] rounded transition-colors cursor-pointer"
                          aria-label="詳細"
                          title="詳細を見る"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ページネーションコントロール */}
                {totalVocabPages > 1 && (
                  <div className="flex items-center justify-between gap-1 p-2 bg-white border border-[#E8E2D5] rounded-xl shadow-2xs">
                    <button
                      type="button"
                      disabled={vocabPage <= 1}
                      onClick={() => {
                        setVocabPage((p) => Math.max(1, p - 1));
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-[#FAF7F2] text-[#1B2A38] hover:bg-[#FAF0EC] hover:text-[#B84E34] border border-[#E8E2D5] shrink-0"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">前へ</span>
                    </button>

                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 justify-center flex-1">
                      {Array.from({ length: totalVocabPages }, (_, i) => i + 1).map((pageNum) => {
                        const isCurrent = pageNum === vocabPage;
                        const shouldShow =
                          totalVocabPages <= 7 ||
                          pageNum === 1 ||
                          pageNum === totalVocabPages ||
                          Math.abs(pageNum - vocabPage) <= 1;

                        if (!shouldShow) {
                          if (pageNum === 2 && vocabPage > 3) {
                            return <span key="ellipsis-start" className="px-0.5 text-xs text-[#948C82]">…</span>;
                          }
                          if (pageNum === totalVocabPages - 1 && vocabPage < totalVocabPages - 2) {
                            return <span key="ellipsis-end" className="px-0.5 text-xs text-[#948C82]">…</span>;
                          }
                          return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setVocabPage(pageNum)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? 'bg-[#B84E34] text-white shadow-xs'
                                : 'text-[#756D63] hover:text-[#1B2A38] hover:bg-[#FAF7F2]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={vocabPage >= totalVocabPages}
                      onClick={() => {
                        setVocabPage((p) => Math.min(totalVocabPages, p + 1));
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-[#FAF7F2] text-[#1B2A38] hover:bg-[#FAF0EC] hover:text-[#B84E34] border border-[#E8E2D5] shrink-0"
                    >
                      <span className="hidden xs:inline">次へ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ③ 数字・時刻・単位の完全攻略マスター */}
            {dictSubTab === 'numbers' && (
              <KoreanNumbersGuideView
                showPronunciation={showPronunciation}
                isLargeFont={isLargeFont}
              />
            )}
          </div>
        )}

        {/* ===================== 会話タブ（直感フレーズ ＆ 実践チャンク ＆ スラング） ===================== */}
        {activeTab === 'chunks' && (
          <div className="space-y-2.5">
            {/* 💬 会話 カテゴリーバー（収納式：タップで展開/折りたたみ） */}
            <div className="bg-white border border-[#E8E2D5] rounded-xl shadow-2xs overflow-hidden transition-all">
              {/* 普段表示される極薄1行バー */}
              <div className="p-2 sm:px-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowConversationNav(!showConversationNav)}
                  aria-expanded={showConversationNav}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A38] hover:text-[#B84E34] transition-colors cursor-pointer min-w-0"
                  title="タップして会話カテゴリーやサブタブを切り替える"
                >
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#FAF0EC] text-[#B84E34] shrink-0">
                    {conversationSubTab === 'phrases' ? '直感' : conversationSubTab === 'chunks' ? 'チャンク' : conversationSubTab === 'idioms' ? '慣用句' : 'スラング'}
                  </span>
                  <span className="truncate text-xs font-serif">
                    {conversationSubTab === 'phrases'
                      ? `キラーフレーズ (${KILLER_PHRASE_CATEGORIES.find((c) => c.id === selectedPhraseCategory)?.label || 'すべて'})`
                      : conversationSubTab === 'chunks'
                      ? `口語チャンク (${selectedChunkCategory === 'all' ? 'すべて' : selectedChunkCategory})`
                      : conversationSubTab === 'idioms'
                      ? `慣用句・ことわざ (${idiomType === 'all' ? 'すべて' : idiomType === 'idiom' ? '身体慣用句' : 'ことわざ'})`
                      : `最新スラング (${SLANG_CATEGORIES.find((c) => c.id === selectedSlangCategory)?.label || 'すべて'})`}
                  </span>
                  {showConversationNav ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#B84E34] shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#948C82] shrink-0" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  {conversationSubTab === 'phrases' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsReverseMode(!isReverseMode)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                          isReverseMode
                            ? 'bg-[#1B2A38] text-white border-[#1B2A38]'
                            : 'bg-white text-[#B84E34] hover:bg-[#FAF0EC] border-[#E8E2D5]'
                        }`}
                      >
                        {isReverseMode ? '🎴 逆翻訳モード中' : '🎴 逆翻訳モード'}
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleExpandAllPhrases}
                        className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                      >
                        {expandAllPhrases ? 'すべて閉じる' : 'すべて開く'}
                      </button>
                    </>
                  )}
                  {conversationSubTab === 'chunks' && (
                    <button
                      type="button"
                      onClick={handleToggleExpandAllChunks}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                    >
                      {expandAllChunks ? 'すべて閉じる' : 'すべて開く'}
                    </button>
                  )}
                  {conversationSubTab === 'idioms' && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = !expandAllIdioms;
                        setExpandAllIdioms(next);
                        const m: Record<string, boolean> = {};
                        IDIOMS_PROVERBS_DATA.forEach((i) => { m[i.id] = next; });
                        setOpenIdioms(m);
                      }}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                    >
                      {expandAllIdioms ? 'すべて閉じる' : 'すべて開く'}
                    </button>
                  )}
                  {conversationSubTab === 'slang' && (
                    <button
                      type="button"
                      onClick={handleToggleExpandAllSlangs}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                    >
                      {expandAllSlangs ? 'すべて閉じる' : 'すべて開く'}
                    </button>
                  )}
                </div>
              </div>

              {/* タップ時のみ展開される収納エリア（サブタブ ＆ 各カテゴリーピル） */}
              <div className={`${showConversationNav ? 'block border-t border-[#F0EBE1] p-2 bg-[#FAF7F2]/60 space-y-2' : 'hidden'}`}>
                {/* セグメントサブタブ（初級時は2つ、中級・上級時は4つ） */}
                <div className={`grid ${levelMode === 'beginner' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-1 bg-[#F2ECE1] p-1 rounded-xl text-[11px] sm:text-xs font-bold`}>
                  <button
                    type="button"
                    onClick={() => {
                      setConversationSubTab('phrases');
                      setShowConversationNav(false);
                    }}
                    className={`py-2 px-0.5 sm:px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal flex items-center justify-center gap-1 ${
                      conversationSubTab === 'phrases'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-[#FAF0EC] text-[#B84E34]">初級</span>
                    <span>🗣️ 直感フレーズ ({KILLER_PHRASES_DATA.length}選)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConversationSubTab('chunks');
                      setShowConversationNav(false);
                    }}
                    className={`py-2 px-0.5 sm:px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal flex items-center justify-center gap-1 ${
                      conversationSubTab === 'chunks'
                        ? 'bg-white text-[#B84E34] shadow-xs'
                        : 'text-[#6B635B] hover:text-[#1B2A38]'
                    }`}
                  >
                    <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-[#FAF0EC] text-[#B84E34]">初級</span>
                    <span>💬 実践チャンク ({CONVERSATION_CHUNKS_DATA.length}選)</span>
                  </button>
                  {levelMode !== 'beginner' && (
                    <button
                      type="button"
                      onClick={() => {
                        setConversationSubTab('idioms');
                        setShowConversationNav(false);
                      }}
                      className={`py-2 px-0.5 sm:px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal flex items-center justify-center gap-1 ${
                        conversationSubTab === 'idioms'
                          ? 'bg-[#1E3A5F] text-white shadow-xs'
                          : 'text-[#6B635B] hover:text-[#1B2A38]'
                      }`}
                    >
                      <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                        conversationSubTab === 'idioms' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-900'
                      }`}>中級</span>
                      <span>💡 慣用句 ({IDIOMS_PROVERBS_DATA.length}選)</span>
                    </button>
                  )}
                  {levelMode !== 'beginner' && (
                    <button
                      type="button"
                      onClick={() => {
                        setConversationSubTab('slang');
                        setShowConversationNav(false);
                      }}
                      className={`py-2 px-0.5 sm:px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap tracking-tighter sm:tracking-normal flex items-center justify-center gap-1 ${
                        conversationSubTab === 'slang'
                          ? 'bg-[#1E3A5F] text-white shadow-xs'
                          : 'text-[#6B635B] hover:text-[#1B2A38]'
                      }`}
                    >
                      <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                        conversationSubTab === 'slang' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-900'
                      }`}>中級</span>
                      <span>🔥 スラング ({SLANG_DATA.length}選)</span>
                    </button>
                  )}
                </div>

                {/* 慣用句・ことわざの場合のカテゴリーピル */}
                {conversationSubTab === 'idioms' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[10px] font-bold text-[#8A8075] shrink-0">種別:</span>
                    {[
                      { id: 'all', label: `すべて (${IDIOMS_PROVERBS_DATA.length})` },
                      { id: 'idiom', label: `身体慣用句 (25)` },
                      { id: 'proverb', label: `重要ことわざ (15)` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setIdiomType(tab.id as any);
                          setShowConversationNav(false);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          idiomType === tab.id
                            ? 'bg-[#1E3A5F] text-white shadow-xs'
                            : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* 直感フレーズの場合のカテゴリーピル */}
                {conversationSubTab === 'phrases' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[10px] font-bold text-[#8A8075] shrink-0">カテゴリー:</span>
                    {KILLER_PHRASE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedPhraseCategory(cat.id);
                          setShowConversationNav(false);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedPhraseCategory === cat.id
                            ? 'bg-[#B84E34] text-white shadow-xs'
                            : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* 実践チャンクの場合のカテゴリーピル */}
                {conversationSubTab === 'chunks' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[10px] font-bold text-[#8A8075] shrink-0">カテゴリー:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChunkCategory('all');
                        setShowConversationNav(false);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        selectedChunkCategory === 'all'
                          ? 'bg-[#B84E34] text-white shadow-xs'
                          : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                      }`}
                    >
                      全カテゴリー ({CONVERSATION_CHUNKS_DATA.length})
                    </button>
                    {CONVERSATION_CATEGORIES.map((cat) => {
                      const count = CONVERSATION_CHUNKS_DATA.filter((c) => c.category === cat).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedChunkCategory(cat);
                            setShowConversationNav(false);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            selectedChunkCategory === cat
                              ? 'bg-[#B84E34] text-white shadow-xs'
                              : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 若者スラングの場合のカテゴリーピル */}
                {conversationSubTab === 'slang' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[10px] font-bold text-[#8A8075] shrink-0">カテゴリー:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlangCategory('all');
                        setShowConversationNav(false);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        selectedSlangCategory === 'all'
                          ? 'bg-[#1E3A5F] text-white shadow-xs'
                          : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                      }`}
                    >
                      全カテゴリー ({SLANG_DATA.length})
                    </button>
                    {SLANG_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedSlangCategory(cat.id);
                          setShowConversationNav(false);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedSlangCategory === cat.id
                            ? 'bg-[#1E3A5F] text-white shadow-xs'
                            : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ① 🗣️ 直感キラーフレーズ 80選（感覚先行 ＆ 逆翻訳モード） */}
            {conversationSubTab === 'phrases' && (
              <div className="space-y-2">

                {/* 80フレーズ 授業ノート風の1枚シートリスト */}
                <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                  {displayedPhrases.map((phrase) => {
                    const isOpen = !!openPhrases[phrase.id];
                    const isRevealed = !!revealedPhrases[phrase.id];
                    return (
                      <div key={phrase.id} id={phrase.id} className="scroll-mt-24">
                        <div
                          onClick={() => {
                            setOpenPhrases((prev) => ({ ...prev, [phrase.id]: !prev[phrase.id] }));
                          }}
                          className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                        >
                          <div className="flex items-baseline gap-2 flex-1 min-w-0">
                            <span className="text-[11px] font-sans font-bold text-[#948C82] w-6 text-right shrink-0">
                              {phrase.no}.
                            </span>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                {phrase.situationJa}
                              </h3>
                              <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                {phrase.myAnswerJa}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            {renderItemStatusBadgeAndPin(phrase.id)}
                            <span className="text-[#948C82] p-1">
                              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                          </div>
                        </div>

                        {/* 展開された詳細コンテンツ */}
                        {isOpen && (
                          <div className="p-3.5 sm:p-5 pt-2 border-t border-[#F0EBE1] space-y-3.5 bg-white">
                            {/* ① 相手からの質問 (Question) */}
                            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE7DC] space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#756D63] flex items-center gap-1">
                                  <span>🗣️ 相手の質問・言葉:</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speechService.speak(phrase.questionKo);
                                  }}
                                  className="p-1 rounded-md text-[#B84E34] hover:bg-[#FAF0EC] transition-colors cursor-pointer"
                                  title="発音を聞く"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                {phrase.questionKo}
                              </div>
                              {showPronunciation && phrase.questionReading && (
                                <div className="text-[11px] text-[#8A8075] font-mono">
                                  [{phrase.questionReading}]
                                </div>
                              )}
                              <div className="text-xs text-[#544D45] pt-0.5 border-t border-[#E8E2D5]/60">
                                訳: {phrase.questionJa}
                              </div>
                            </div>

                            {/* ② あなたの返答 (My Answer) - まず丸暗記する本番フレーズ！ */}
                            <div className="p-3.5 bg-gradient-to-r from-[#FAF0EC]/80 via-[#FFFDF9] to-[#FAF0EC]/40 rounded-xl border border-[#F0D5CD] space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#B84E34] flex items-center gap-1">
                                  <span>🎯 あなたの返答（感覚先行で丸暗記！）:</span>
                                </span>
                                {(!isReverseMode || isRevealed) && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      speechService.speak(phrase.myAnswerKo);
                                    }}
                                    className="p-1 rounded-md text-[#B84E34] hover:bg-[#FAF0EC] transition-colors cursor-pointer"
                                    title="発音を聞く"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              {isReverseMode && !isRevealed ? (
                                <div className="space-y-2 py-1">
                                  <div className={`text-[#1B2A38] font-bold ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                    「{phrase.myAnswerJa}」
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => toggleRevealPhrase(phrase.id, e)}
                                    className="w-full py-2.5 px-3 rounded-xl bg-[#1B2A38] hover:bg-[#2C3E50] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                                    <span>❓ タップして韓国語を表示・答え合わせ＆発音</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className={`font-bold text-[#1B2A38] tracking-tight ${isLargeFont ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                                    {phrase.myAnswerKo}
                                  </div>
                                  {showPronunciation && phrase.myAnswerReading && (
                                    <div className="text-xs text-[#8A8075] font-mono">
                                      [{phrase.myAnswerReading}]
                                    </div>
                                  )}
                                  <div className={`text-[#423B33] font-medium pt-1 border-t border-[#F0D5CD]/60 ${isLargeFont ? 'text-base' : 'text-xs sm:text-sm'}`}>
                                    訳: {phrase.myAnswerJa}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* ③ 感覚 → 論理（文法解説リンク＆ポイント） */}
                            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE7DC] space-y-1.5">
                              {phrase.grammarLink && (
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-[#1B2A38]">
                                    📖 この会話で使われている文法の理屈:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => scrollTo(phrase.grammarLink!.id, phrase.grammarLink!.tab)}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#B84E34] bg-white hover:bg-[#FAF0EC] px-2.5 py-1 rounded-lg border border-[#E8E2D5] transition-colors cursor-pointer"
                                  >
                                    <span>{phrase.grammarLink.label}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              {phrase.tip && (
                                <p className={`text-[#544D45] leading-relaxed pt-1 text-xs sm:text-sm`}>
                                  💡 <strong>解説:</strong> {phrase.tip}
                                </p>
                              )}
                            </div>

                            {/* ④ 🎯次回ミッション・🟢実戦クリア・＋1秒めくり追加・📖授業実例 */}
                            {renderActionAndMyAlbum(phrase.id, {
                              expression: phrase.myAnswerKo,
                              meaning: phrase.myAnswerJa,
                              reading: phrase.myAnswerReading,
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ② 💬 実践口語・会話表現チャンク厳選（50選） */}
            {conversationSubTab === 'chunks' && (
              <div className="space-y-2">
                {/* チャンク 授業ノート風の1枚シート一覧 */}

                {/* チャンク 授業ノート風の1枚シート一覧 */}
                <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                  {displayedChunks.map((chunk) => {
                    const isOpen = !!openChunks[chunk.id];
                    return (
                      <div key={chunk.id} id={chunk.id} className="scroll-mt-24">
                        <div
                          onClick={() => setBottomSheetItem({ type: 'chunk', id: chunk.id })}
                          className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                        >
                          <div className="flex items-baseline gap-2 flex-1 min-w-0">
                            <span className="text-[11px] font-sans font-bold text-[#948C82] w-6 text-right shrink-0">
                              {chunk.no}.
                            </span>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                {chunk.expression}
                              </h3>
                              <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                {chunk.meaning}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            {renderItemStatusBadgeAndPin(chunk.id)}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBottomSheetItem({ type: 'chunk', id: chunk.id });
                              }}
                              className="p-1 text-[#948C82] group-hover:text-[#B84E34] rounded transition-colors cursor-pointer"
                              aria-label="詳細"
                              title="詳細を見る"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* 展開された詳細コンテンツ */}
                        {isOpen && (
                          <div className="p-3.5 sm:p-4 pt-2 border-t border-[#F0EBE1] space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE7DC]">
                              <div className="text-xs text-[#B84E34] font-medium">
                                発音: <strong>{chunk.pronunciation}</strong>
                              </div>
                              <div className="text-xs text-[#544D45]">
                                丁寧度: <strong className="text-[#1B2A38]">{chunk.politeness}</strong>
                              </div>
                            </div>

                            <div className={`p-3 bg-white rounded-xl border border-[#E8E2D5] text-[#3A332C] leading-relaxed ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                              <strong className="text-[#1B2A38] mr-1.5">💡 実践ニュアンス:</strong>
                              {chunk.usage}
                            </div>

                            {/* 2往復ミニ会話 */}
                            <div className="space-y-2 bg-[#FCFAF7] p-3 sm:p-3.5 rounded-xl border border-[#EDE7DC]">
                              <div className="text-xs font-bold text-[#756D63]">🗣️ AとBのリアルな2往復ミニ会話:</div>
                              {chunk.dialogue.map((line, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                  <span
                                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      line.speaker === 'A' ? 'bg-[#1B2A38] text-white' : 'bg-[#B84E34] text-white'
                                    }`}
                                  >
                                    {line.speaker}
                                  </span>
                                  <div className="flex-1 space-y-0.5">
                                    <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>{line.ko}</div>
                                    <div className={`text-[#8A8075] font-mono ${isLargeFont ? 'text-xs sm:text-sm' : 'text-xs'}`}>{line.reading}</div>
                                    <div className={`text-[#423B33] ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>{line.ja}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {renderActionAndMyAlbum(chunk.id, {
                              expression: chunk.expression,
                              meaning: chunk.meaning,
                              reading: chunk.pronunciation,
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ③ 💡 身体慣用句 ＆ 重要ことわざ（40選） */}
            {conversationSubTab === 'idioms' && (
              <div className="space-y-2">
                {/* 検索バー */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={idiomSearch}
                      onChange={(e) => setIdiomSearch(e.target.value)}
                      placeholder="慣用句・ことわざ・意味・直訳を絞り込み検索..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                    />
                    {idiomSearch && (
                      <button
                        type="button"
                        onClick={() => setIdiomSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 慣用句・ことわざ一覧 */}
                <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                  {displayedIdioms.length === 0 ? (
                    <div className="p-8 text-center text-[#948C82] text-xs">
                      一致する慣用句・ことわざが見つかりませんでした
                    </div>
                  ) : (
                    displayedIdioms.map((item) => {
                      const isOpen = !!openIdioms[item.id];
                      return (
                        <div key={item.id} id={item.id} className="scroll-mt-24">
                          <div
                            onClick={() => setOpenIdioms((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                          >
                            <div className="flex items-baseline gap-2 flex-1 min-w-0">
                              <span className="text-[11px] font-sans font-bold text-[#1E3A5F] w-6 text-right shrink-0">
                                {item.no}.
                              </span>
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#1E3A5F] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                    {item.korean}
                                  </h3>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                    item.type === 'idiom' ? 'bg-blue-50 text-blue-900 border border-blue-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                  }`}>
                                    {item.type === 'idiom' ? '身体慣用句' : 'ことわざ'}
                                  </span>
                                  {showPronunciation && (
                                    <span className="text-[11px] text-[#8A8075] font-mono">
                                      {item.reading}
                                    </span>
                                  )}
                                </div>
                                <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                  <span className="text-[#8A8075]">直訳:「{item.literalJa}」➔ </span>
                                  <strong className="text-[#1B2A38]">{item.meaningJa}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speechService.speak(item.korean);
                                }}
                                className="p-1 rounded-md text-[#1E3A5F] hover:bg-blue-50 transition-colors cursor-pointer"
                                title="発音を聞く"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              {renderItemStatusBadgeAndPin(item.id)}
                              <span className="text-[#948C82] p-1">
                                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </span>
                            </div>
                          </div>

                          {isOpen && (
                            <div className="p-3.5 sm:p-4 pt-2 border-t border-[#F0EBE1] space-y-3 bg-[#FCFAF7]/40">
                              <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200/60 text-xs text-[#544D45]">
                                <span className="font-bold text-[#1E3A5F] mr-1.5">💡 由来・使い方のコツ:</span>
                                <span>{item.originOrTip}</span>
                              </div>

                              <div className="p-3 sm:p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1.5 shadow-2xs">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-[#756D63]">🗣️ 実際の使い方・例文:</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      speechService.speak(item.exampleKo);
                                    }}
                                    className="p-1 rounded-md text-[#1E3A5F] hover:bg-blue-50 transition-colors cursor-pointer"
                                    title="例文の発音を聞く"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                  {item.exampleKo}
                                </div>
                                {showPronunciation && item.exampleReading && (
                                  <div className={`text-[#8A8075] font-mono ${isLargeFont ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                                    {item.exampleReading}
                                  </div>
                                )}
                                <div className={`text-[#423B33] pt-0.5 border-t border-[#F0D5CD]/40 ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                                  訳: {item.exampleJa}
                                </div>
                              </div>

                              {renderActionAndMyAlbum(item.id, {
                                expression: item.korean,
                                meaning: item.meaningJa,
                                reading: item.reading,
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ④ 🔥 若者スラング・新造語（60選） */}
            {conversationSubTab === 'slang' && (
              <div className="space-y-2">
                {/* 検索バー ＆ 1行スリム操作・カテゴリーバー */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#948C82] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={slangSearch}
                      onChange={(e) => setSlangSearch(e.target.value)}
                      placeholder="スラング用語・意味・由来を絞り込み検索..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-[#E2DDD2] focus:border-[#B84E34] focus:outline-none text-xs text-[#1B2A38] placeholder-[#948C82] transition-colors"
                    />
                    {slangSearch && (
                      <button
                        type="button"
                        onClick={() => setSlangSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#948C82] hover:text-[#1B2A38] p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* スラング 授業ノート風の1枚シート一覧 */}
                <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
                  {displayedSlangs.length === 0 ? (
                    <div className="p-8 text-center text-[#948C82] text-xs">
                      一致するスラングが見つかりませんでした
                    </div>
                  ) : (
                    displayedSlangs.map((slang) => {
                      const isOpen = !!openSlangs[slang.id];

                      return (
                        <div key={slang.id} id={slang.id} className="scroll-mt-24">
                          {/* シンプルな2行リスト行 */}
                          <div
                            onClick={() => {
                              setOpenSlangs((prev) => ({ ...prev, [slang.id]: !prev[slang.id] }));
                            }}
                            className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                          >
                            <div className="flex items-baseline gap-2 flex-1 min-w-0">
                              <span className="text-[11px] font-sans font-bold text-[#948C82] w-6 text-right shrink-0">
                                {slang.no}.
                              </span>
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                  {slang.term}
                                </h3>
                                <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                                  {slang.meaning}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-0.5 shrink-0">
                              {renderItemStatusBadgeAndPin(slang.id)}
                              <span className="text-[#948C82] p-1">
                                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </span>
                            </div>
                          </div>

                          {/* 展開された詳細コンテンツ */}
                          {isOpen && (
                            <div className="p-3.5 sm:p-4 pt-2 border-t border-[#F0EBE1] space-y-3 bg-[#FCFAF7]/40">
                              {/* 由来・語源 */}
                              <div className="p-2.5 bg-white rounded-xl border border-[#EDE7DC] text-xs text-[#544D45]">
                                <span className="font-bold text-[#B84E34] mr-1.5">💡 由来・短縮元:</span>
                                <span>{slang.origin}</span>
                              </div>

                              {/* リアル例文 */}
                              <div className="p-3 sm:p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1.5 shadow-2xs">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-[#756D63]">🗣️ 実際の使い方・例文:</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      speechService.speak(slang.exampleKo);
                                    }}
                                    className="p-1 rounded-md text-[#B84E34] hover:bg-[#FAF0EC] transition-colors cursor-pointer"
                                    title="発音を聞く"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                                  {slang.exampleKo}
                                </div>
                                {showPronunciation && slang.exampleReading && (
                                  <div className={`text-[#8A8075] font-mono ${isLargeFont ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                                    {slang.exampleReading}
                                  </div>
                                )}
                                <div className={`text-[#423B33] pt-0.5 border-t border-[#F0D5CD]/40 ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                                  訳: {slang.exampleJa}
                                </div>
                              </div>

                              {/* 使い方・注意点 */}
                              {slang.caution && (
                                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-0.5">
                                  <div className="font-bold text-amber-900 flex items-center gap-1">
                                    <span>⚠️ ニュアンス・使う時の注意:</span>
                                  </div>
                                  <p className="leading-relaxed">{slang.caution}</p>
                                </div>
                              )}

                              {/* 🎯次回ミッション・🟢実戦クリア・＋1秒めくり追加・📖授業実例 */}
                              {renderActionAndMyAlbum(slang.id, {
                                expression: slang.term,
                                meaning: slang.meaning,
                                reading: slang.reading,
                                exampleSentence: slang.exampleKo,
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== 助詞コロケーション・イディオム編タブ ===================== */}
        {activeTab === 'collocations' && (
          <div className="space-y-2.5">
            {/* 🔗 助詞 カテゴリーバー（収納式：タップで展開/折りたたみ） */}
            <div className="bg-white border border-[#E8E2D5] rounded-xl shadow-2xs overflow-hidden transition-all">
              {/* 普段表示される極薄1行バー */}
              <div className="p-2 sm:px-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowColoNav(!showColoNav)}
                  aria-expanded={showColoNav}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A38] hover:text-[#B84E34] transition-colors cursor-pointer min-w-0"
                  title="タップして助詞カテゴリーを切り替える"
                >
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#FAF0EC] text-[#B84E34] shrink-0">
                    助詞
                  </span>
                  <span className="truncate text-xs font-serif">
                    助詞コロケーション ({selectedColoCategory === 'all' ? `全${COLLOCATIONS_DATA.length}選` : selectedColoCategory})
                  </span>
                  {showColoNav ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#B84E34] shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#948C82] shrink-0" />
                  )}
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleExpandAllColos}
                    className="px-2 py-0.5 rounded-lg text-xs font-bold text-[#756D63] hover:text-[#B84E34] cursor-pointer whitespace-nowrap"
                  >
                    {expandAllColos ? 'すべて閉じる' : 'すべて開く'}
                  </button>
                </div>
              </div>

              {/* タップ時のみ展開される収納エリア（助詞カテゴリーピル群） */}
              <div className={`${showColoNav ? 'block border-t border-[#F0EBE1] p-2 bg-[#FAF7F2]/60' : 'hidden'}`}>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-bold text-[#8A8075] shrink-0">カテゴリー:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedColoCategory('all');
                      setShowColoNav(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedColoCategory === 'all'
                        ? 'bg-[#B84E34] text-white shadow-xs'
                        : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                    }`}
                  >
                    全カテゴリー ({COLLOCATIONS_DATA.length})
                  </button>
                  {COLLOCATION_CATEGORIES.map((cat) => {
                    const count = COLLOCATIONS_DATA.filter((c) => c.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedColoCategory(cat);
                          setShowColoNav(false);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedColoCategory === cat
                            ? 'bg-[#B84E34] text-white shadow-xs'
                            : 'bg-white text-[#756D63] hover:text-[#1B2A38] border border-[#E8E2D5]'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* コロケーション 授業ノート風の1枚シート一覧 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs divide-y divide-[#F0EBE1] overflow-hidden">
              {displayedCollocations.map((colo) => {
                const isOpen = !!openColos[colo.id];
                return (
                  <div key={colo.id} id={colo.id} className="scroll-mt-24">
                    <div
                      onClick={() => setBottomSheetItem({ type: 'colo', id: colo.id })}
                      className="p-3 sm:px-4 flex items-center justify-between gap-2 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer select-none group"
                    >
                      <div className="flex items-baseline gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-sans font-bold text-[#948C82] w-6 text-right shrink-0">
                          {colo.no}.
                        </span>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h3 className={`font-bold text-[#1B2A38] group-hover:text-[#B84E34] transition-colors leading-snug ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                            {colo.expression}
                          </h3>
                          <div className={`text-[#6B635B] font-sans leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                            {colo.meaning}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        {renderItemStatusBadgeAndPin(colo.id)}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBottomSheetItem({ type: 'colo', id: colo.id });
                          }}
                          className="p-1 text-[#948C82] group-hover:text-[#B84E34] rounded transition-colors cursor-pointer"
                          aria-label="詳細"
                          title="詳細を見る"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 展開された詳細コンテンツ */}
                    {isOpen && (
                      <div className="p-3.5 sm:p-4 pt-1 border-t border-[#F2ECE1] space-y-3">
                        <div className="text-xs text-[#B84E34] font-medium bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE7DC]">
                          発音: <strong>［{colo.pronunciation}］</strong>
                        </div>

                        {/* 直訳の罠（× / ◯） */}
                        <div className="p-3 bg-[#FEF6F5] rounded-xl border border-[#FADBD8] space-y-1">
                          <div className={`flex items-center gap-1.5 font-bold text-[#C0392B] ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                            <span>⚠️ 直訳の罠:</span>
                          </div>
                          <div className={`font-mono font-bold text-[#96281B] bg-white/90 p-2 rounded-lg border border-[#F5B7B1] ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
                            {colo.trap}
                          </div>
                        </div>

                        {/* 自然な実用例文 */}
                        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#F2ECE1] space-y-1">
                          <div className={`font-bold text-[#1B2A38] ${isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                            {colo.exampleKo}
                          </div>
                          <div className={`text-[#8A8075] font-mono ${isLargeFont ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                            （発音: {colo.exampleReading}）
                          </div>
                          <div className={`text-[#423B33] ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                            （訳: {colo.exampleJa}）
                          </div>
                        </div>

                        {/* ワンポイント解説 */}
                        <div className={`leading-relaxed pt-0.5 text-[#3A332C] ${isLargeFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                          <strong className="text-[#1B2A38] mr-1.5">💡 解説:</strong>
                          {colo.tip}
                        </div>

                        {renderActionAndMyAlbum(colo.id, {
                          expression: colo.expression,
                          meaning: colo.meaning,
                          reading: colo.pronunciation,
                          exampleSentence: colo.exampleKo,
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* トップへ戻るフローティングボタン（ボトムバーの上部に配置、スクロール連動） */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-4 sm:right-6 z-30 p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D5] text-[#756D63] hover:text-[#B84E34] hover:border-[#B84E34] shadow-md transition-all duration-300 cursor-pointer active:scale-90 ${
          showBars ? 'bottom-16 sm:bottom-20' : 'bottom-4'
        }`}
        style={{
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
        title="一番上へ戻る"
        aria-label="一番上へ戻る"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* ===================== 画面下部固定ボトムナビゲーション（スクロール連動自動収納 ＆ iOS Safari固定バグ完全対策） ===================== */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D5] shadow-lg transition-all duration-300 transform-gpu pb-[env(safe-area-inset-bottom)] ${
          showBars ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          transform: showBars ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
          WebkitTransform: showBars ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
          willChange: 'transform',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('textbook')}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'textbook'
                ? 'text-[#B84E34] font-bold'
                : 'text-[#756D63] hover:text-[#1B2A38]'
            }`}
          >
            <BookOpen className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'textbook' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 whitespace-nowrap">教科書</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reference')}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'reference'
                ? 'text-[#B84E34] font-bold'
                : 'text-[#756D63] hover:text-[#1B2A38]'
            }`}
          >
            <HelpCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'reference' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 whitespace-nowrap">参考書</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dictionary')}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dictionary'
                ? 'text-[#B84E34] font-bold'
                : 'text-[#756D63] hover:text-[#1B2A38]'
            }`}
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'dictionary' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 whitespace-nowrap">辞書</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chunks')}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'chunks'
                ? 'text-[#B84E34] font-bold'
                : 'text-[#756D63] hover:text-[#1B2A38]'
            }`}
          >
            <MessageCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'chunks' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 whitespace-nowrap">会話</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collocations')}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'collocations'
                ? 'text-[#B84E34] font-bold'
                : 'text-[#756D63] hover:text-[#1B2A38]'
            }`}
          >
            <Link2 className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'collocations' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 whitespace-nowrap">助詞</span>
          </button>
        </div>
      </nav>

      {/* ===================== ボトムシート詳細モーダル（辞書・会話・助詞） ===================== */}
      {currentBottomSheetData && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-2xs transition-all"
          onClick={() => setBottomSheetItem(null)}
        >
          <div
            className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ボトムシートヘッダー */}
            <div className="p-3.5 sm:p-4 border-b border-[#F2ECE1] flex items-center justify-between gap-2 bg-[#FAF7F2]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#FAF0EC] text-[#B84E34] flex items-center justify-center text-xs font-bold font-mono shrink-0">
                  {currentBottomSheetData.type === 'dict'
                    ? currentBottomSheetData.item.no
                    : currentBottomSheetData.type === 'chunk'
                    ? currentBottomSheetData.item.no
                    : currentBottomSheetData.item.no}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#B84E34] uppercase tracking-wider block">
                    {currentBottomSheetData.type === 'dict'
                      ? '文法逆引き辞書'
                      : currentBottomSheetData.type === 'chunk'
                      ? `会話チャンク・${currentBottomSheetData.item.category}`
                      : currentBottomSheetData.type === 'colo'
                      ? `助詞コロケーション・${currentBottomSheetData.item.category}`
                      : `重要単語・${currentBottomSheetData.item.categoryLabel}`}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-[#1B2A38] truncate">
                    {currentBottomSheetData.type === 'dict'
                      ? currentBottomSheetData.item.grammar
                      : currentBottomSheetData.type === 'vocab'
                      ? currentBottomSheetData.item.word
                      : currentBottomSheetData.item.expression}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBottomSheetItem(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#EDE7DC] flex items-center justify-center text-[#756D63] hover:text-[#1B2A38] transition-colors cursor-pointer shrink-0 border border-[#E8E2D5]"
                title="閉じる"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ボトムシート本文 */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              {currentBottomSheetData.type === 'dict' && (
                <>
                  <div className="p-3 bg-[#FAF0EC]/60 border border-[#F0D5CD] rounded-xl text-[#B84E34] font-bold text-sm sm:text-base">
                    意味: {currentBottomSheetData.item.meaning}
                  </div>

                  <div className="text-xs sm:text-sm text-[#423B33] bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE7DC]">
                    <strong className="text-[#1B2A38]">接続ルール:</strong>
                    <div className="font-mono text-[#B84E34] font-bold mt-1">
                      {currentBottomSheetData.item.connection}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1">
                    <div className="text-xs text-[#756D63] font-bold">リアル例文:</div>
                    <div className="font-mono text-emerald-950 font-bold text-sm sm:text-base leading-relaxed">
                      {currentBottomSheetData.item.example}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 leading-relaxed">
                    💡 <strong>ポイント:</strong> {currentBottomSheetData.item.tip}
                  </div>

                  {currentBottomSheetData.item.linkTextbook && (
                    <button
                      type="button"
                      onClick={() => {
                        const link = currentBottomSheetData.item.linkTextbook!;
                        setBottomSheetItem(null);
                        scrollTo(link.id, 'textbook');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#FAF0EC] hover:bg-[#F5E6DF] text-[#B84E34] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>💡 {currentBottomSheetData.item.linkTextbook.label} で教科書の詳細解説を読む</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}

              {currentBottomSheetData.type === 'chunk' && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE7DC]">
                    <div className="text-xs text-[#B84E34] font-medium">
                      発音: <strong>{currentBottomSheetData.item.pronunciation}</strong>
                    </div>
                    <div className="text-xs text-[#544D45]">
                      丁寧度: <strong className="text-[#1B2A38]">{currentBottomSheetData.item.politeness}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF0EC]/60 border border-[#F0D5CD] rounded-xl text-[#B84E34] font-bold text-sm sm:text-base">
                    意味: {currentBottomSheetData.item.meaning}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] text-[#3A332C] text-xs sm:text-sm leading-relaxed">
                    <strong className="text-[#1B2A38] mr-1.5">💡 実践ニュアンス:</strong>
                    {currentBottomSheetData.item.usage}
                  </div>

                  {/* 2往復ミニ会話 */}
                  <div className="space-y-2 bg-[#FCFAF7] p-3.5 rounded-xl border border-[#EDE7DC]">
                    <div className="text-xs font-bold text-[#756D63]">🗣️ AとBのリアルな2往復ミニ会話:</div>
                    {currentBottomSheetData.item.dialogue.map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span
                          className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            line.speaker === 'A' ? 'bg-[#1B2A38] text-white' : 'bg-[#B84E34] text-white'
                          }`}
                        >
                          {line.speaker}
                        </span>
                        <div className="flex-1 space-y-0.5">
                          <div className="font-bold text-[#1B2A38] text-sm sm:text-base">{line.ko}</div>
                          {showPronunciation && (
                            <div className="text-[#8A8075] font-mono text-xs">{line.reading}</div>
                          )}
                          <div className="text-[#423B33] text-xs sm:text-sm">{line.ja}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {currentBottomSheetData.type === 'colo' && (
                <>
                  <div className="p-3 bg-[#FAF0EC]/60 border border-[#F0D5CD] rounded-xl text-[#B84E34] font-bold text-sm sm:text-base">
                    意味: {currentBottomSheetData.item.meaning}
                  </div>

                  <div className="text-xs text-[#8A8075] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE7DC]">
                    発音: <strong className="font-mono text-[#B84E34]">［{currentBottomSheetData.item.pronunciation}］</strong>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 space-y-1">
                    <strong className="text-amber-900 block">⚠️ 日本人がハマる直訳の罠:</strong>
                    <p className="leading-relaxed">{currentBottomSheetData.item.trap}</p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1">
                    <div className="text-xs text-[#756D63] font-bold">リアル例文:</div>
                    <div className="font-bold text-[#1B2A38] text-sm sm:text-base">
                      {currentBottomSheetData.item.exampleKo}
                    </div>
                    {showPronunciation && (
                      <div className="text-xs font-mono text-[#8A8075]">
                        {currentBottomSheetData.item.exampleReading}
                      </div>
                    )}
                    <div className="text-xs sm:text-sm text-[#423B33]">
                      {currentBottomSheetData.item.exampleJa}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE7DC] text-xs sm:text-sm text-[#544D45] leading-relaxed">
                    💡 <strong>使い方のコツ:</strong> {currentBottomSheetData.item.tip}
                  </div>
                </>
              )}

              {currentBottomSheetData.type === 'vocab' && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF0EC]/70 border border-[#F0D5CD] rounded-xl">
                    <div className="text-xs text-[#B84E34] font-medium">
                      発音: <strong>［{currentBottomSheetData.item.pronunciation}］</strong>
                    </div>
                    <div className="text-xs text-[#544D45]">
                      品詞: <strong className="text-[#1B2A38] bg-white px-2 py-0.5 rounded border border-[#EDE7DC]">{currentBottomSheetData.item.pos}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-[#E8E2D5] rounded-xl text-[#1B2A38] font-bold text-sm sm:text-base">
                    意味: {currentBottomSheetData.item.meaning}
                  </div>

                  {/* 活用形（現在ヘヨ体・過去ヘヨ体） */}
                  {(currentBottomSheetData.item.presentForm || currentBottomSheetData.item.pastForm) && (
                    <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE7DC]">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#756D63] font-bold block">現在ヘヨ体</span>
                        <span className="font-bold text-[#B84E34] text-sm sm:text-base">{currentBottomSheetData.item.presentForm || '—'}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#756D63] font-bold block">過去ヘヨ体</span>
                        <span className="font-bold text-[#1B2A38] text-sm sm:text-base">{currentBottomSheetData.item.pastForm || '—'}</span>
                      </div>
                    </div>
                  )}

                  {/* 例文 */}
                  {currentBottomSheetData.item.example && (
                    <div className="p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-[#756D63] font-bold">例文:</div>
                        <button
                          type="button"
                          onClick={() => speechService.speak(currentBottomSheetData.item.example!.ko)}
                          className="p-1 rounded-full bg-white text-[#B84E34] border border-[#E8E2D5] hover:bg-[#B84E34] hover:text-white transition cursor-pointer shrink-0"
                          title="例文を音声で聞く"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-[#1B2A38] text-sm sm:text-base">
                        {currentBottomSheetData.item.example.ko}
                      </div>
                      {showPronunciation && currentBottomSheetData.item.example.reading && (
                        <div className="text-xs text-[#8C8379] font-medium">
                          [{currentBottomSheetData.item.example.reading}]
                        </div>
                      )}
                      <div className="text-xs sm:text-sm text-[#544D45]">
                        {currentBottomSheetData.item.example.ja}
                      </div>
                    </div>
                  )}

                  {/* 反対語・関連語 */}
                  {currentBottomSheetData.item.relatedWord && (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950">
                      🔄 <strong>反対語・関連語:</strong> {currentBottomSheetData.item.relatedWord}
                    </div>
                  )}

                  {/* コロケーション */}
                  {currentBottomSheetData.item.collocation && (
                    <div className="p-3.5 bg-white rounded-xl border border-[#E8E2D5] space-y-1">
                      <div className="text-xs text-[#756D63] font-bold">よく使う組み合わせ:</div>
                      <div className="font-bold text-[#B84E34] text-sm sm:text-base">
                        {currentBottomSheetData.item.collocation}
                      </div>
                    </div>
                  )}

                  {/* ワンポイント解説 */}
                  {currentBottomSheetData.item.tip && (
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 leading-relaxed">
                      💡 <strong>ワンポイント:</strong> {currentBottomSheetData.item.tip}
                    </div>
                  )}
                </>
              )}

              {/* 🎯次回ミッション・🟢実戦クリア・＋1秒めくり追加・📖授業実例（全詳細共通） */}
              {renderActionAndMyAlbum(
                currentBottomSheetData.item.id,
                currentBottomSheetData.type === 'dict'
                  ? {
                      expression: currentBottomSheetData.item.grammar,
                      meaning: currentBottomSheetData.item.meaning,
                      exampleSentence: currentBottomSheetData.item.example,
                    }
                  : currentBottomSheetData.type === 'vocab'
                  ? {
                      expression: currentBottomSheetData.item.presentForm
                        ? `${currentBottomSheetData.item.word} (${currentBottomSheetData.item.presentForm})`
                        : currentBottomSheetData.item.word,
                      meaning: currentBottomSheetData.item.meaning,
                      reading: currentBottomSheetData.item.pronunciation,
                      exampleSentence: currentBottomSheetData.item.example
                        ? `${currentBottomSheetData.item.example.ko} (${currentBottomSheetData.item.example.ja})`
                        : undefined,
                    }
                  : currentBottomSheetData.type === 'chunk'
                  ? {
                      expression: currentBottomSheetData.item.expression,
                      meaning: currentBottomSheetData.item.meaning,
                      reading: currentBottomSheetData.item.pronunciation,
                    }
                  : {
                      expression: currentBottomSheetData.item.expression,
                      meaning: currentBottomSheetData.item.meaning,
                      reading: currentBottomSheetData.item.pronunciation,
                      exampleSentence: currentBottomSheetData.item.exampleKo,
                    }
              )}
            </div>

            {/* ボトムシート下部ナビゲーション */}
            <div className="p-3 bg-[#FAF7F2] border-t border-[#F2ECE1] flex items-center justify-between text-xs font-bold">
              {currentBottomSheetData.prevId ? (
                <button
                  type="button"
                  onClick={() =>
                    setBottomSheetItem({
                      type: currentBottomSheetData.type,
                      id: currentBottomSheetData.prevId!,
                    })
                  }
                  className="flex items-center gap-1 text-[#756D63] hover:text-[#B84E34] px-2 py-1 rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>前へ</span>
                </button>
              ) : (
                <div />
              )}

              <span className="text-[#948C82] font-mono">
                {currentBottomSheetData.index + 1} / {currentBottomSheetData.total}
              </span>

              {currentBottomSheetData.nextId ? (
                <button
                  type="button"
                  onClick={() =>
                    setBottomSheetItem({
                      type: currentBottomSheetData.type,
                      id: currentBottomSheetData.nextId!,
                    })
                  }
                  className="flex items-center gap-1 text-[#B84E34] hover:underline px-2 py-1 rounded-lg cursor-pointer"
                >
                  <span>次へ</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGuideView;
