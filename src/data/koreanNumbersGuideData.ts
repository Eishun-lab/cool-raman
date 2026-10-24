// 韓国語「数字・時刻・日付・助数詞」完全攻略マスターガイド データ定義

export interface NumberItem {
  id: string;
  num: string;
  hangul: string;
  pronunciation: string;
  formBeforeCounter?: string; // 助数詞の前の形（固有数詞のみ）
  tip: string;
  highlight?: boolean;
}

export interface SituationItem {
  id: string;
  category: string;
  unit: string;
  exampleKo: string;
  pronunciation: string;
  meaning: string;
  tip: string;
  warning?: boolean;
}

export interface NumberSentenceItem {
  id: string;
  no: number;
  sentenceKo: string;
  pronunciation: string;
  translationJa: string;
  explanation: string;
  warning?: boolean;
}

export interface ClockPatternItem {
  id: string;
  timeStr: string;
  hangul: string;
  pronunciation: string;
  note: string;
  warning?: boolean;
}

export interface TimeComparisonItem {
  id: string;
  label: string;
  timePoint: {
    ko: string;
    reading: string;
    ja: string;
    exampleKo: string;
    exampleJa: string;
  };
  duration: {
    ko: string;
    reading: string;
    ja: string;
    exampleKo: string;
    exampleJa: string;
  };
}

export interface DayPeriodItem {
  id: string;
  labelJa: string;
  hangul: string;
  pronunciation: string;
  example: string;
  note: string;
}

export interface WeekdayItem {
  id: string;
  dayJa: string;
  hangul: string;
  pronunciation: string;
  tip: string;
  warning?: boolean;
}

export interface TimeAdverbRow {
  unit: string;
  twoPast: { ko: string; reading: string; ja: string; note?: string };
  onePast: { ko: string; reading: string; ja: string; note?: string };
  present: { ko: string; reading: string; ja: string; note?: string };
  future: { ko: string; reading: string; ja: string; note?: string };
}

export interface NativeDaysItem {
  id: string;
  days: string;
  hangul: string;
  pronunciation: string;
  tip: string;
  warning?: boolean;
}

export interface CounterItem {
  id: string;
  unitJa: string;
  hangul: string;
  pronunciation: string;
  examples: { ko: string; reading: string }[];
  tip: string;
  warning?: boolean;
}

export interface PitfallItem {
  id: string;
  trapNo: number;
  title: string;
  summary: string;
  details: {
    subtitle?: string;
    items: {
      label: string;
      hangul: string;
      pronunciation: string;
      meaning: string;
      note?: string;
    }[];
  }[];
  keyPoint: string;
}

export interface PracticalPhraseItem {
  id: string;
  no: number;
  scene: string;
  subScene: string;
  sentenceKo: string;
  pronunciation: string;
  translationJa: string;
  point: string;
  warning?: boolean;
}

// ==========================================
// 第1章：漢数詞（일, 이, 삼...）データ
// ==========================================

export const SINO_NUMBERS: NumberItem[] = [
  {
    id: 'sino-0',
    num: '0',
    hangul: '영 / 공',
    pronunciation: 'ヨン / コン',
    tip: '💡ポイント：数値・気温・点数は「영」、電話番号・部屋番号などの記号的ゼロは「공（空）」を使用',
  },
  {
    id: 'sino-1',
    num: '1',
    hangul: '일',
    pronunciation: 'イル',
    tip: 'パッチム「ㄹ」で終わるため、後ろに母音が始まると連音化（例：일월 ➔ [이뤌] イロル）',
  },
  {
    id: 'sino-2',
    num: '2',
    hangul: '이',
    pronunciation: 'イ',
    tip: 'パッチムなし。日本語の「に」より口を横に引いて発音',
  },
  {
    id: 'sino-3',
    num: '3',
    hangul: '삼',
    pronunciation: 'サム',
    tip: 'パッチム「ㅁ」なので最後に唇をしっかり閉じる（口を開けたまま「ム」と言わない）',
  },
  {
    id: 'sino-4',
    num: '4',
    hangul: '사',
    pronunciation: 'サ',
    tip: 'パッチムなし。日本語の「し・よん」と混同しないよう注意',
  },
  {
    id: 'sino-5',
    num: '5',
    hangul: '오',
    pronunciation: 'オ',
    tip: '唇を丸めて突き出す「오」。日本語の「お」より口をすぼめる',
  },
  {
    id: 'sino-6',
    num: '6',
    hangul: '육 (륙)',
    pronunciation: 'ユク',
    tip: '⚠️注意：単体や語頭では「육」、16（십육 ➔ [심뉵]）などパッチムの後ろでは鼻音化が起きる',
    highlight: true,
  },
  {
    id: 'sino-7',
    num: '7',
    hangul: '칠',
    pronunciation: 'チル',
    tip: '激音「ㅊ」で息を強く吐き出し、パッチム「ㄹ」で舌先を上歯茎につける',
  },
  {
    id: 'sino-8',
    num: '8',
    hangul: '팔',
    pronunciation: 'パル',
    tip: '激音「ㅍ」で息を強く出し、パッチム「ㄹ」で終わる',
  },
  {
    id: 'sino-9',
    num: '9',
    hangul: '구',
    pronunciation: 'ク / グ',
    tip: '語頭では「ク」に近く、語中（例：십구 ➔ [십꾸] シップク）では濃音化しやすい',
  },
  {
    id: 'sino-10',
    num: '10',
    hangul: '십',
    pronunciation: 'シプ',
    tip: 'パッチム「ㅂ」で唇を閉じて音を止める。後ろに平音が来ると濃音化を起こす',
  },
  {
    id: 'sino-16',
    num: '16',
    hangul: '십육 ➔ [심뉵]',
    pronunciation: 'シムニュク',
    tip: '⚠️注意：最頻出の鼻音化！「십(ㅂ)＋육(ㅇ/ㄹ)」が共鳴し「심뉵（シムニュク）」と発音（「シプユク」は❌）',
    highlight: true,
  },
  {
    id: 'sino-25',
    num: '25',
    hangul: '이십오 ➔ [이시보]',
    pronunciation: 'イシボ',
    tip: '💡ポイント：「십」のパッチム「ㅂ」が後ろの母音「오」と連音化し「イシボ」と滑らかに繋がる',
  },
  {
    id: 'sino-38',
    num: '38',
    hangul: '삼십팔 ➔ [삼십팔]',
    pronunciation: 'サムシッパル',
    tip: '💡ポイント：「십」のパッチム「ㅂ」の直後に激音「팔」が続くため、小さい「ッ」が詰まる感覚で発音',
  },
  {
    id: 'sino-100',
    num: '100',
    hangul: '백',
    pronunciation: 'ペク（語中：ベク）',
    tip: '日本語の「ひゃく（いちひゃくとは言わない）」と同様、「일백」ではなく単独で「백」と言う',
  },
  {
    id: 'sino-1000',
    num: '1,000',
    hangul: '천',
    pronunciation: 'チョン',
    tip: '⚠️注意：日本語の「一千（いっせん）」につられて「일천」と言わず、必ず「천」から始める',
    highlight: true,
  },
  {
    id: 'sino-10000',
    num: '10,000 (1万)',
    hangul: '만',
    pronunciation: 'マン',
    tip: '⚠️注意：日本語は「いちまん」と言うが、韓国語では「일만」と言わず「만（マン）」のみで表す！',
    highlight: true,
  },
  {
    id: 'sino-100000',
    num: '100,000 (10万)',
    hangul: '십만 ➔ [심만]',
    pronunciation: 'シムマン',
    tip: '⚠️注意：パッチム「ㅂ」＋「ㅁ」の鼻音化により「シプマン」ではなく「シムマン [심만]」と発音',
    highlight: true,
  },
  {
    id: 'sino-1000000',
    num: '100万',
    hangul: '백만 ➔ [뱅만]',
    pronunciation: 'ペンマン',
    tip: '⚠️注意：パッチム「ㄱ」＋「ㅁ」の鼻音化により「ペクマン」ではなく「ペンマン [뱅만]」と発音',
    highlight: true,
  },
  {
    id: 'sino-10000000',
    num: '1,000万',
    hangul: '천만',
    pronunciation: 'チョンマン',
    tip: '「일천만」ではなく「천만」。パッチム「ㄴ」＋「ㅁ」はそのまま「チョンマン」',
  },
  {
    id: 'sino-100000000',
    num: '1億',
    hangul: '일억 ➔ [이럭]',
    pronunciation: 'イロク',
    tip: '💡ポイント：「億（억）」の単位からは先頭に「일（1）」をつける！連音化して「イロク [이럭]」',
  },
];

export const SINO_SITUATIONS: SituationItem[] = [
  {
    id: 'sino-sit-date',
    category: '年・月・日',
    unit: '년 / 월 / 일',
    exampleKo: '이천이십육 년 유월 십육 일',
    pronunciation: 'イチョニシムニュン ニョン ユウォル シムニュギル',
    meaning: '2026年 6月 16日',
    tip: '⚠️注意：「육 년」は鼻音化で[융년 ユンニョン]、「유월」はパッチム脱落、「십육 일」は[심뉴길 シムニュギル]。6月(유월)・10月(시월)はㄱ・ㅂが文字から脱落！',
    warning: true,
  },
  {
    id: 'sino-sit-time',
    category: '分・秒',
    unit: '분 / 초',
    exampleKo: '일 분 / 십 분 / 삼십 초',
    pronunciation: 'イル ブン / シップン / サムシプ チョ',
    meaning: '1分 / 10分 / 30秒',
    tip: '💡ポイント：「십 분（10分）」はパッチムㅂの後ろで濃音化し「シップン [십뿐]」と発音する',
  },
  {
    id: 'sino-sit-won-1',
    category: '値段・ウォン①',
    unit: '원（1,000ウォン）',
    exampleKo: '천 원 ➔ [처눤]',
    pronunciation: 'チョヌォン',
    meaning: '1,000ウォン',
    tip: '💡ポイント：「천」のパッチム「ㄴ」と「원」が連音化し、ネイティブは一息で「チョヌォン」と発音',
  },
  {
    id: 'sino-sit-won-2',
    category: '値段・ウォン②',
    unit: '원（5,500ウォン）',
    exampleKo: '오천오백 원 ➔ [오처노배권]',
    pronunciation: 'オチョノベグォン',
    meaning: '5,500ウォン',
    tip: '💡ポイント：「천＋오 ➔ 처노（チョノ）」「백＋원 ➔ 배권（ベグォン）」と2箇所で連音化が発生！',
  },
  {
    id: 'sino-sit-won-3',
    category: '値段・ウォン③',
    unit: '원（38,000ウォン）',
    exampleKo: '삼만 팔천 원 ➔ [삼만 팔처눤]',
    pronunciation: 'サムマン パルチョヌォン',
    meaning: '38,000ウォン',
    tip: '💡ポイント：万単位と千単位の間は少しポーズを置き、末尾「천 원」を連音化させて「パルチョヌォン」',
  },
  {
    id: 'sino-sit-phone',
    category: '電話番号・番号',
    unit: '번 / 에(-)',
    exampleKo: '공일공 에 일이삼사 에 오육칠팔',
    pronunciation: 'コンイルゴン エ イリサムサ エ オユクチルパル',
    meaning: '010-1234-5678',
    tip: '💡ポイント：携帯番号の「0」は「공（コン）」、ハイフン「-」は助詞「에（エ）」または一拍ポーズで読む',
  },
  {
    id: 'sino-sit-floor',
    category: '階数・号室',
    unit: '층 / 호',
    exampleKo: '일 층 / 지하 이 층 / 이백일 호 ➔ [이배기로]',
    pronunciation: 'イル チュン / チハ イ チュン / イベギロ',
    meaning: '1階 / 地下2階 / 201号室',
    tip: '⚠️注意：「201号室（이백일 호）」は「일」のパッチムㄹと「호」のㅎが弱化・連音化し「イベギロ」と発音',
    warning: true,
  },
  {
    id: 'sino-sit-serving',
    category: '人前（料理注文）',
    unit: '인분',
    exampleKo: '일 인분 [이린분] / 이 인분 / 삼 인분 [사민분]',
    pronunciation: 'イリンブン / イインブン / サミンブン',
    meaning: '1人前 / 2人前 / 3人前',
    tip: '⚠️注意：入店時の人数「2名（두 명 / 두 분）」は固有数詞だが、料理の分量「〜人前（인분）」は必ず漢数詞！',
    warning: true,
  },
  {
    id: 'sino-sit-page',
    category: 'ページ',
    unit: '쪽 / 페이지',
    exampleKo: '십오 쪽 [시보쪽] / 백 페이지',
    pronunciation: 'シボッチョク / ペク ペイジ',
    meaning: '15ページ / 100ページ',
    tip: '💡ポイント：韓国固有の単位「쪽」も外来語「페이지」も、ページ番号にはすべて漢数詞を使う',
  },
];

export const SINO_EXAMPLES: NumberSentenceItem[] = [
  {
    id: 'sino-ex-1',
    no: 1,
    sentenceKo: '이 옷은 삼만 오천 원이에요.',
    pronunciation: 'イ オスン サムマン オチョヌォニエヨ',
    translationJa: 'この服は35,000ウォンです。',
    explanation: '💡「천 원이에요」が連音化して「チョヌォニエヨ」',
  },
  {
    id: 'sino-ex-2',
    no: 2,
    sentenceKo: '제 생일은 시월 이십오 일이에요.',
    pronunciation: 'チェ センイルン シウォル イシボイリエヨ',
    translationJa: '私の誕生日は10月25日です。',
    explanation: '⚠️10月は「십월❌」ではなく「시월⭕」、25日は「イシボイル」',
    warning: true,
  },
  {
    id: 'sino-ex-3',
    no: 3,
    sentenceKo: '삼겹살 이 인분하고 냉면 일 인분 주세요.',
    pronunciation: 'サムギョプサル イインブンハゴ ネンミョン イリンブン ジュセヨ',
    translationJa: 'サムギョプサル2人前と冷麺1人前ください。',
    explanation: '💡料理の「〜人前（인분）」は漢数詞（일, 이, 삼...）',
  },
  {
    id: 'sino-ex-4',
    no: 4,
    sentenceKo: '화장실은 지하 일 층에 있어요.',
    pronunciation: 'ファジャンシルン チハ イルチュンエ イッソヨ',
    translationJa: 'トイレは地下1階にあります。',
    explanation: '💡地下は「지하（チハ）」、階数は漢数詞＋「층（チュン）」',
  },
  {
    id: 'sino-ex-5',
    no: 5,
    sentenceKo: '교과서 백이십육 쪽을 펴세요.',
    pronunciation: 'キョグァソ ペギシムニュク チョグル ピョセヨ',
    translationJa: '教科書の126ページを開いてください。',
    explanation: '⚠️126（백이십육）は連音化＋鼻音化で「ペギシムニュク」',
    warning: true,
  },
];

// ==========================================
// 第2章：固有数詞（하나, 둘, 셋...）データ
// ==========================================

export const NATIVE_NUMBERS: NumberItem[] = [
  {
    id: 'nat-1',
    num: '1',
    hangul: '하나',
    pronunciation: 'ハナ',
    formBeforeCounter: '한（ハン）',
    tip: '⚠️注意：後ろに単位がつくと必ず「한（ハン）」に変形！',
    highlight: true,
  },
  {
    id: 'nat-2',
    num: '2',
    hangul: '둘',
    pronunciation: 'トゥル',
    formBeforeCounter: '두（トゥ）',
    tip: '⚠️注意：後ろに単位がつくとパッチムㄹが落ちて「두（トゥ）」に変形！',
    highlight: true,
  },
  {
    id: 'nat-3',
    num: '3',
    hangul: '셋',
    pronunciation: 'セッ',
    formBeforeCounter: '세（セ）',
    tip: '⚠️注意：単体では末音「ㅅ」で音が詰まるが、単位の前では「세（セ）」に変形！',
    highlight: true,
  },
  {
    id: 'nat-4',
    num: '4',
    hangul: '넷',
    pronunciation: 'ネッ',
    formBeforeCounter: '네（ネ）',
    tip: '⚠️注意：3と同様に単位の前ではパッチムㅅが落ちて「네（ネ）」に変形！',
    highlight: true,
  },
  {
    id: 'nat-5',
    num: '5',
    hangul: '다섯',
    pronunciation: 'タソッ',
    formBeforeCounter: '다섯（タソッ）',
    tip: '変形なし。単位が続くときはパッチムㅅの影響で後ろの子音が濃音化しやすい',
  },
  {
    id: 'nat-6',
    num: '6',
    hangul: '여섯',
    pronunciation: 'ヨソッ',
    formBeforeCounter: '여섯（ヨソッ）',
    tip: '変形なし。「다섯（5）・여섯（6）」はリズムでセット暗記するのがおすすめ',
  },
  {
    id: 'nat-7',
    num: '7',
    hangul: '일곱',
    pronunciation: 'イルゴプ',
    formBeforeCounter: '일곱（イルゴプ）',
    tip: '変形なし。最後はパッチム「ㅂ」なので唇を閉じて音を止める',
  },
  {
    id: 'nat-8',
    num: '8',
    hangul: '여덟 ➔ [여덜]',
    pronunciation: 'ヨドル',
    formBeforeCounter: '여덟（ヨドル）',
    tip: '⚠️注意：二重パッチム「ㄼ」だが、単体でも単位の前でも「ㄹ」のみ発音し「ヨドル」',
    highlight: true,
  },
  {
    id: 'nat-9',
    num: '9',
    hangul: '아홉',
    pronunciation: 'アホプ',
    formBeforeCounter: '아홉（アホプ）',
    tip: '変形なし。パッチム「ㅂ」で唇を閉じる',
  },
  {
    id: 'nat-10',
    num: '10',
    hangul: '열',
    pronunciation: 'ヨル',
    formBeforeCounter: '열（ヨル）',
    tip: '変形なし。11〜19は「열＋하나(열하나 ヨラナ)」「열＋둘(열둘 ヨルトゥル)」と組み合わせる',
  },
  {
    id: 'nat-20',
    num: '20',
    hangul: '스물',
    pronunciation: 'スムル',
    formBeforeCounter: '스무（スム）',
    tip: '⚠️注意：20ちょうどに単位がつく時だけ「스무（スム）」に変形！（21歳＝스물한 살）',
    highlight: true,
  },
  {
    id: 'nat-30',
    num: '30',
    hangul: '서른',
    pronunciation: 'ソルン',
    formBeforeCounter: '서른（ソルン）',
    tip: '変形なし（例：30歳＝서른 살 [ソルン サル]）',
  },
  {
    id: 'nat-40',
    num: '40',
    hangul: '마흔',
    pronunciation: 'マフン',
    formBeforeCounter: '마흔（マフン）',
    tip: '変形なし。「ㅎ」は弱く息を漏らす程度で「マウン」に近く聞こえることもある',
  },
  {
    id: 'nat-50',
    num: '50',
    hangul: '쉰',
    pronunciation: 'スィン（シン）',
    formBeforeCounter: '쉰（スィン）',
    tip: '変形なし。唇を丸めて「シュ」と「シ」の中間音＋パッチム「ㄴ」',
  },
  {
    id: 'nat-60',
    num: '60',
    hangul: '예순',
    pronunciation: 'イェスン',
    formBeforeCounter: '예순（イェスン）',
    tip: '変形なし（60代以上の年齢表現などで使用）',
  },
  {
    id: 'nat-70',
    num: '70',
    hangul: '일흔 ➔ [이른]',
    pronunciation: 'イルン',
    formBeforeCounter: '일흔（イルン）',
    tip: 'パッチム「ㄹ」の後ろで「ㅎ」が弱化し、発音は「イルン [이른]」',
  },
  {
    id: 'nat-80',
    num: '80',
    hangul: '여든',
    pronunciation: 'ヨドゥン',
    formBeforeCounter: '여든（ヨドゥン）',
    tip: '変形なし。「8（여덟）」と同じ「여」で始まるので関連づけて覚える',
  },
  {
    id: 'nat-90',
    num: '90',
    hangul: '아흔',
    pronunciation: 'アフン',
    formBeforeCounter: '아흔（アフン）',
    tip: '変形なし。「9（아홉）」と同じ「아」で始まる。100からは漢数詞「백」へ切り替わる',
  },
];

export const NATIVE_COUNTERS: CounterItem[] = [
  {
    id: 'cnt-gae',
    unitJa: '〜個・〜つ',
    hangul: '개',
    pronunciation: 'ケ / ゲ',
    examples: [
      { ko: '한 개', reading: 'ハン ゲ（1個）' },
      { ko: '두 개', reading: 'トゥ ゲ（2個）' },
      { ko: '다섯 개', reading: 'タソッケ（5個・濃音化）' },
    ],
    tip: '💡ポイント：果物・雑貨・パンなど形のある物を幅広く数える万能単位。5個（다섯 개）は濃音化で「タソッケ」',
  },
  {
    id: 'cnt-myeong',
    unitJa: '〜人（一般）',
    hangul: '명',
    pronunciation: 'ミョン',
    examples: [
      { ko: '한 명', reading: 'ハン ミョン（1人）' },
      { ko: '세 명', reading: 'セ ミョン（3人）' },
      { ko: '네 명', reading: 'ネ ミョン（4人）' },
    ],
    tip: '💡ポイント：友人・家族・自分のグループ人数を伝える時の基本単位（食堂で「세 명이에요＝3人です」）',
  },
  {
    id: 'cnt-bun',
    unitJa: '〜名様（敬語）',
    hangul: '분',
    pronunciation: 'ブン / プン',
    examples: [
      { ko: '한 분', reading: 'ハン ブン（1名様）' },
      { ko: '두 분', reading: 'トゥ ブン（2名様）' },
      { ko: '몇 분', reading: 'ミョップン（何名様）' },
    ],
    tip: '⚠️注意：店員が客に「몇 분이세요?（何名様ですか？）」と聞く時や、目上の人を数える時に使用。時間の「分（분）」と同音なので注意！',
    warning: true,
  },
  {
    id: 'cnt-sal',
    unitJa: '〜歳（年齢）',
    hangul: '살',
    pronunciation: 'サル',
    examples: [
      { ko: '한 살', reading: 'ハン サル（1歳）' },
      { ko: '스무 살', reading: 'スム サル（20歳）' },
      { ko: '스물여덟 살', reading: 'スムリョドル サル（28歳）' },
    ],
    tip: '💡ポイント：日常会話の年齢は固有数詞＋「살」。公的書類やニュースの「〜歳（세）」のみ漢数詞（例：이십 세）を使う',
  },
  {
    id: 'cnt-si',
    unitJa: '〜時（時刻）',
    hangul: '시',
    pronunciation: 'シ',
    examples: [
      { ko: '한 시', reading: 'ハン シ（1時）' },
      { ko: '네 시', reading: 'ネ シ（4時）' },
      { ko: '열두 시', reading: 'ヨルトゥ シ（12時）' },
    ],
    tip: '💡ポイント：時計の「〜時」は必ず12時間制の固有数詞（1時〜12時）で読むのが自然',
  },
  {
    id: 'cnt-beon',
    unitJa: '〜回・〜度',
    hangul: '번',
    pronunciation: 'ボン',
    examples: [
      { ko: '한 번', reading: 'ハン ボン（1回）' },
      { ko: '두 번', reading: 'トゥ ボン（2回）' },
      { ko: '다시 한 번', reading: 'タシ ハン ボン（もう1回）' },
    ],
    tip: '⚠️注意：固有数詞＋「번」は「〜回（回数）」。漢数詞＋「번」になると「〜番（番号）」に意味が変わる！',
    warning: true,
  },
  {
    id: 'cnt-gwon',
    unitJa: '〜冊（本・ノート）',
    hangul: '권',
    pronunciation: 'クォン / グォン',
    examples: [
      { ko: '한 권', reading: 'ハン グォン（1冊）' },
      { ko: '두 권', reading: 'トゥ グォン（2冊）' },
    ],
    tip: '💡ポイント：書籍・雑誌・ノート類を数える単位',
  },
  {
    id: 'cnt-jan',
    unitJa: '〜杯（飲み物）',
    hangul: '잔',
    pronunciation: 'チャン / ジャン',
    examples: [
      { ko: '한 잔', reading: 'ハン ジャン（1杯）' },
      { ko: '두 잔', reading: 'トゥ ジャン（2杯）' },
    ],
    tip: '💡ポイント：コーヒー・水・お酒などグラスやカップに入った飲料すべてに使用。「한잔하다」で「一杯飲む」',
  },
  {
    id: 'cnt-mari',
    unitJa: '〜匹・頭・羽',
    hangul: '마리',
    pronunciation: 'マリ',
    examples: [
      { ko: '한 마리', reading: 'ハン マリ（1匹）' },
      { ko: '두 마리', reading: 'トゥ マリ（2匹）' },
    ],
    tip: '💡ポイント：日本語では犬（匹）・牛（頭）・鳥（羽）・魚（尾）と分けるが、韓国語は動物・鳥・魚・虫すべて「마리」1つでOK！',
  },
  {
    id: 'cnt-dae',
    unitJa: '〜台（車・機械）',
    hangul: '대',
    pronunciation: 'テ / デ',
    examples: [
      { ko: '한 대', reading: 'ハン デ（1台）' },
      { ko: '두 대', reading: 'トゥ デ（2台）' },
    ],
    tip: '💡ポイント：車・バス・パソコン・スマートフォン・エアコンなどの機械・車両を数える単位',
  },
  {
    id: 'cnt-jang',
    unitJa: '〜枚（紙・切符・服）',
    hangul: '장',
    pronunciation: 'チャン / ジャン',
    examples: [
      { ko: '한 장', reading: 'ハン ジャン（1枚）' },
      { ko: '네 장', reading: 'ネ ジャン（4枚）' },
    ],
    tip: '💡ポイント：紙・写真・チケット・カード・Tシャツなどの薄いものを数える単位',
  },
  {
    id: 'cnt-byeong',
    unitJa: '〜瓶・〜本（ボトル）',
    hangul: '병',
    pronunciation: 'ピョン / ビョン',
    examples: [
      { ko: '한 병', reading: 'ハン ビョン（1本）' },
      { ko: '세 병', reading: 'セ ビョン（3本）' },
    ],
    tip: '💡ポイント：ビール・ソジュ（焼酎）・ペットボトルの水などを数える際に飲食店で頻出',
  },
  {
    id: 'cnt-kyeolle',
    unitJa: '〜足（靴・靴下・手袋）',
    hangul: '켤레',
    pronunciation: 'キョルレ',
    examples: [
      { ko: '한 켤레', reading: 'ハン キョルレ（1足）' },
      { ko: '두 켤레', reading: 'トゥ キョルレ（2足）' },
    ],
    tip: '💡ポイント：左右ペアになって機能する靴・靴下・手袋を数える単位（「ㄹ＋ㄹ」の流音で「キョルレ」）',
  },
];

export const NATIVE_EXAMPLES: NumberSentenceItem[] = [
  {
    id: 'nat-ex-1',
    no: 1,
    sentenceKo: '아이스 아메리카노 두 잔 주세요.',
    pronunciation: 'アイス アメリカーノ トゥ ジャン ジュセヨ',
    translationJa: 'アイスアメリカーノを2杯ください。',
    explanation: '⚠️「둘 잔❌」ではなく変形した「두 잔⭕」',
    warning: true,
  },
  {
    id: 'nat-ex-2',
    no: 2,
    sentenceKo: '한국인 친구가 세 명 있어요.',
    pronunciation: 'ハングギン チングガ セ ミョン イッソヨ',
    translationJa: '韓国人の友達が3人います。',
    explanation: '⚠️「셋 명❌」ではなく変形した「세 명⭕」',
    warning: true,
  },
  {
    id: 'nat-ex-3',
    no: 3,
    sentenceKo: '제 동생은 올해 스무 살이에요.',
    pronunciation: 'チェ トンセンウン オレ スム サリエヨ',
    translationJa: '私の弟（妹）は今年20歳です。',
    explanation: '⚠️20歳は「스물 살❌」ではなく「스무 살⭕（スム サル）」',
    warning: true,
  },
  {
    id: 'nat-ex-4',
    no: 4,
    sentenceKo: '고양이 한 마리와 강아지 두 마리를 키워요.',
    pronunciation: 'コヤンイ ハン マリワ カンアジ トゥ マリルル キウォヨ',
    translationJa: '猫1匹と犬2匹を飼っています。',
    explanation: '💡動物・魚・鳥はすべて固有数詞＋「마리（マリ）」',
  },
  {
    id: 'nat-ex-5',
    no: 5,
    sentenceKo: '콘서트 티켓을 네 장 예매했어요.',
    pronunciation: 'コンソトゥ ティケスル ネ ジャン イェメヘッソヨ',
    translationJa: 'コンサートのチケットを4枚予約しました。',
    explanation: '⚠️4枚は「넷 장❌」ではなく「네 장⭕（ネ ジャン）」',
    warning: true,
  },
];

// ==========================================
// 第3章：時刻・時間のハイブリッド攻略データ
// ==========================================

export const CLOCK_PATTERNS: ClockPatternItem[] = [
  {
    id: 'clk-1-00',
    timeStr: '1時00分',
    hangul: '한 시 (정각)',
    pronunciation: 'ハン シ (チョンガク)',
    note: '💡「정각（正刻）」をつけると「1時ちょうど」',
  },
  {
    id: 'clk-1-15',
    timeStr: '1時15分',
    hangul: '한 시 십오 분 ➔ [한 시 시보 분]',
    pronunciation: 'ハン シ シボ ブン',
    note: '💡15分（십오 분）は連音化で「シボ ブン」',
  },
  {
    id: 'clk-2-30',
    timeStr: '2時30分 (2時半)',
    hangul: '두 시 삼십 분 / 두 시 반',
    pronunciation: 'トゥ シ サムシップン / トゥ シ バン',
    note: '💡日常会話では「두 시 반（2時半）」が圧倒的に自然',
  },
  {
    id: 'clk-3-05',
    timeStr: '3時05分',
    hangul: '세 시 오 분',
    pronunciation: 'セ シ オ ブン',
    note: '⚠️3時は「셋 시❌」ではなく「세 시⭕」',
    warning: true,
  },
  {
    id: 'clk-4-20',
    timeStr: '4時20分',
    hangul: '네 시 이십 분 ➔ [네 시 이십뿐]',
    pronunciation: 'ネ シ イシップン',
    note: '⚠️4時は「네 시⭕」、20分は濃音化で「イシップン」',
    warning: true,
  },
  {
    id: 'clk-5-40',
    timeStr: '5時40分',
    hangul: '다섯 시 사십 분 ➔ [다섣씨 사십뿐]',
    pronunciation: 'タソッシ サシップン',
    note: '💡5時（다섯 시）はパッチムㅅの影響で「タソッシ」と濃音化',
  },
  {
    id: 'clk-6-10',
    timeStr: '6時10分',
    hangul: '여섯 시 십 분 ➔ [여섣씨 십뿐]',
    pronunciation: 'ヨソッシ シップン',
    note: '💡6時（여섯 시）も「ヨソッシ」、10分は「シップン」',
  },
  {
    id: 'clk-7-45',
    timeStr: '7時45分',
    hangul: '일곱 시 사십오 분 ➔ [일곱씨 사시보 분]',
    pronunciation: 'イルゴプシ サシボ ブン',
    note: '💡45分（사십오 분）は連音化で「サシボ ブン」',
  },
  {
    id: 'clk-8-50',
    timeStr: '8時50分',
    hangul: '여덟 시 오십 분 (= 아홉 시 십 분 전)',
    pronunciation: 'ヨドル シ オシップン (= アホプ シ シップン ジョン)',
    note: '💡「9時10分前（아홉 시 십 분 전）」と言い換え可能',
  },
  {
    id: 'clk-9-55',
    timeStr: '9時55分',
    hangul: '아홉 시 오십오 분 (= 열 시 오 분 전)',
    pronunciation: 'アホプ シ オシボ ブン (= ヨル シ オ ブン ジョン)',
    note: '💡「10時5分前（열 시 오 분 전）」も日常で頻出',
  },
  {
    id: 'clk-11-16',
    timeStr: '11時16分',
    hangul: '열한 시 십육 분 ➔ [여란 시 심뉵 뿐]',
    pronunciation: 'ヨラン シ シムニュクプン',
    note: '⚠️最難関！「열한 시」は連音化で「ヨラン シ」、「십육 분」は鼻音化で「シムニュクプン」',
    warning: true,
  },
  {
    id: 'clk-12-00',
    timeStr: '12時00分',
    hangul: '열두 시 (정각)',
    pronunciation: 'ヨルトゥ シ (チョンガク)',
    note: '⚠️12時は「열둘 시❌」ではなく「열두 시⭕」',
    warning: true,
  },
];

export const TIME_COMPARISONS: TimeComparisonItem[] = [
  {
    id: 'time-comp-1',
    label: '1時 vs 1時間',
    timePoint: {
      ko: '한 시',
      reading: 'ハン シ',
      ja: '1時（時刻）',
      exampleKo: '한 시에 만나요.',
      exampleJa: '1時に会いましょう。',
    },
    duration: {
      ko: '한 시간',
      reading: 'ハン シガン',
      ja: '1時間（期間）',
      exampleKo: '한 시간 걸려요.',
      exampleJa: '1時間かかります。',
    },
  },
  {
    id: 'time-comp-2',
    label: '2時半 vs 2時間半',
    timePoint: {
      ko: '두 시 반',
      reading: 'トゥ シ バン',
      ja: '2時半（時刻）',
      exampleKo: '지금 두 시 반이에요.',
      exampleJa: '今2時半です。',
    },
    duration: {
      ko: '두 시간 반',
      reading: 'トゥ シガン バン',
      ja: '2時間半（期間）',
      exampleKo: '두 시간 반 기다렸어요.',
      exampleJa: '2時間半待ちました。',
    },
  },
  {
    id: 'time-comp-3',
    label: '3時15分 vs 3時間15分',
    timePoint: {
      ko: '세 시 십오 분',
      reading: 'セ シ シボ ブン',
      ja: '3時15分（時刻）',
      exampleKo: '기차가 세 시 십오 분에 출발해요.',
      exampleJa: '列車が3時15分に出発します。',
    },
    duration: {
      ko: '세 시간 십오 분',
      reading: 'セ シガン シボ ブン',
      ja: '3時間15分（期間）',
      exampleKo: '세 시간 십오 분 동안 공부했어요.',
      exampleJa: '3時間15分の間勉強しました。',
    },
  },
];

export const DAY_PERIODS: DayPeriodItem[] = [
  {
    id: 'dp-am',
    labelJa: '午前（AM）',
    hangul: '오전',
    pronunciation: 'オジョン',
    example: '오전 아홉 시（オジョン アホプ シ / 午前9時）',
    note: '※ビジネス・公式にも使える標準表現',
  },
  {
    id: 'dp-pm',
    labelJa: '午後（PM）',
    hangul: '오후',
    pronunciation: 'オフ',
    example: '오후 세 시 반（オフ セ シ バン / 午後3時半）',
    note: '※「후（フ）」は口を丸めて息を出す',
  },
  {
    id: 'dp-morning',
    labelJa: '朝',
    hangul: '아침',
    pronunciation: 'アチム',
    example: '아침 일곱 시（アチム イルゴプシ / 朝7時）',
    note: '※「朝食（아침밥）」の意味でも使われる日常語',
  },
  {
    id: 'dp-day',
    labelJa: '昼（日中）',
    hangul: '낮',
    pronunciation: 'ナッ',
    example: '낮 열두 시（ナン ニョルトゥ シ / 昼12時）',
    note: '※日が出ている時間帯（昼食は「점심 チョムシム」）',
  },
  {
    id: 'dp-evening',
    labelJa: '夕方・夜（夕食時）',
    hangul: '저녁',
    pronunciation: 'チョニョク',
    example: '저녁 여섯 시（チョニョク ヨソッシ / 夕方6時・夜6時）',
    note: '※18時〜20時頃の夕食時間帯（「夕食」の意味もある）',
  },
  {
    id: 'dp-night',
    labelJa: '夜（深夜前まで）',
    hangul: '밤',
    pronunciation: 'パム',
    example: '밤 열한 시（パム ヨラン シ / 夜11時）',
    note: '※21時以降のすっかり暗くなった夜の時間帯',
  },
  {
    id: 'dp-dawn',
    labelJa: '明け方・未明',
    hangul: '새벽',
    pronunciation: 'セビョク',
    example: '새벽 두 시（セビョク トゥ シ / 深夜2時・未明2時）',
    note: '💡ポイント：韓国語では夜中1時〜早朝5時頃までをすべて「새벽」と呼ぶ！（日本の「夜中2時」＝ 새벽 두 시）',
  },
];

// ==========================================
// 第4章：日付・曜日・時間軸データ
// ==========================================

export const WEEKDAYS: WeekdayItem[] = [
  {
    id: 'wd-mon',
    dayJa: '月曜日',
    hangul: '월요일 ➔ [워료일]',
    pronunciation: 'ウォリョイル',
    tip: '⚠️注意：パッチム「ㄹ」が「요」と連音化し「ウォルヨイル」ではなく「ウォリョイル」',
    warning: true,
  },
  {
    id: 'wd-tue',
    dayJa: '火曜日',
    hangul: '화요일',
    pronunciation: 'ファヨイル',
    tip: 'パッチムなし。「화」は「ファ」と唇を丸めずに発音',
  },
  {
    id: 'wd-wed',
    dayJa: '水曜日',
    hangul: '수요일',
    pronunciation: 'スヨイル',
    tip: 'パッチムなし。唇を丸めて「スヨイル」',
  },
  {
    id: 'wd-thu',
    dayJa: '木曜日',
    hangul: '목요일 ➔ [모교일]',
    pronunciation: 'モギョイル',
    tip: '⚠️注意：「목」のパッチム「ㄱ」が連音化し「モクヨイル」ではなく「モギョイル」',
    warning: true,
  },
  {
    id: 'wd-fri',
    dayJa: '金曜日',
    hangul: '금요일 ➔ [그묘일]',
    pronunciation: 'クミョイル',
    tip: '⚠️注意：「금」のパッチム「ㅁ」が連音化し「クムヨイル」ではなく「クミョイル」（華金＝불금 プルグム）',
    warning: true,
  },
  {
    id: 'wd-sat',
    dayJa: '土曜日',
    hangul: '토요일',
    pronunciation: 'トヨイル',
    tip: '激音「ㅌ」で息をしっかり出して「トヨイル」',
  },
  {
    id: 'wd-sun',
    dayJa: '日曜日',
    hangul: '일요일 ➔ [이료일]',
    pronunciation: 'イリョイル',
    tip: '⚠️注意：月曜日と同じくパッチム「ㄹ」が連音化して「イリョイル」',
    warning: true,
  },
  {
    id: 'wd-what',
    dayJa: '何曜日',
    hangul: '무슨 요일',
    pronunciation: 'ムスン ヨイル',
    tip: '💡ポイント：「何曜日ですか？」は「몇 요일❌」ではなく「무슨 요일이에요? ⭕（どんな曜日ですか？）」と聞く！',
  },
];

export const TIME_ADVERBS: TimeAdverbRow[] = [
  {
    unit: '日',
    twoPast: { ko: '그저께 (그제)', reading: 'クジョッケ (クジェ)', ja: 'おととい' },
    onePast: { ko: '어제', reading: 'オジェ', ja: '昨日' },
    present: { ko: '오늘', reading: 'オヌル', ja: '今日' },
    future: { ko: '내일 / 모레', reading: 'ネイル / モレ', ja: '明日 / あさって' },
  },
  {
    unit: '週',
    twoPast: { ko: '지지난주', reading: 'チジナンジュ', ja: '先々週' },
    onePast: { ko: '지난주', reading: 'チナンジュ', ja: '先週（過ぎた週）' },
    present: { ko: '이번 주', reading: 'イボン ジュ', ja: '今週（今回の週）' },
    future: { ko: '다음 주 / 다다음 주', reading: 'タウム ジュ / タダウム ジュ', ja: '来週 / 再来週' },
  },
  {
    unit: '月',
    twoPast: { ko: '지지난달', reading: 'チジナンダル', ja: '先々月' },
    onePast: { ko: '지난달', reading: 'チナンダル', ja: '先月' },
    present: { ko: '이번 달', reading: 'イボン タル', ja: '今月' },
    future: { ko: '다음 달', reading: 'タウム タル', ja: '来月' },
  },
  {
    unit: '年',
    twoPast: { ko: '재작년 ➔ [재장년]', reading: 'チェジャンニョン', ja: '一昨年（おととし）', note: '鼻音化' },
    onePast: { ko: '작년 ➔ [장년]', reading: 'チャンニョン', ja: '去年', note: '鼻音化 [장년] 必須' },
    present: { ko: '올해 ➔ [올해/오래]', reading: 'オレ', ja: '今年（금년も可）', note: '連音化' },
    future: { ko: '내년 / 내후년', reading: 'ネニョン / ネフニョン', ja: '来年 / 再来年' },
  },
];

export const NATIVE_DAYS: NativeDaysItem[] = [
  {
    id: 'nd-1',
    days: '1日（1日間）',
    hangul: '하루',
    pronunciation: 'ハル',
    tip: '⚠️超重要：カレンダーの「1日（ついたち）」は漢数詞「일 일 [イリル]」、期間の「1日（まる1日・1日間）」は固有語「하루 [ハル]」（例：하루 종일＝一日中）',
    warning: true,
  },
  {
    id: 'nd-2',
    days: '2日（2日間）',
    hangul: '이틀',
    pronunciation: 'イトゥル',
    tip: '💡ポイント：「2日間休む（이틀 쉬다）」など日常で最頻出。毎月2日（ふつか）を指すこともある',
  },
  {
    id: 'nd-3',
    days: '3日（3日間）',
    hangul: '사흘',
    pronunciation: 'サフル',
    tip: '⚠️注意：「사（4）」という音が入っているが意味は「3日間」！（三日坊主＝작심삼일 / 사흘）',
    warning: true,
  },
  {
    id: 'nd-4',
    days: '4日（4日間）',
    hangul: '나흘',
    pronunciation: 'ナフル',
    tip: '💡ポイント：「셋(3) ➔ 사흘」「넷(4) ➔ 나흘」と頭文字の子音（ㅅ・ㄴ）を対応させると絶対に間違えない！',
  },
  {
    id: 'nd-5',
    days: '5日（5日間）',
    hangul: '닷새',
    pronunciation: 'タッセ',
    tip: '「다섯（5）」と同語源。5日間（오 일간 とも言う）',
  },
  {
    id: 'nd-6',
    days: '6日（6日間）',
    hangul: '엿새',
    pronunciation: 'ヨッセ',
    tip: '「여섯（6）」と同語源。6日間',
  },
  {
    id: 'nd-7',
    days: '7日（7日間）',
    hangul: '이레',
    pronunciation: 'イレ',
    tip: '「일곱（7）」と同語源。会話では「일주일（1週間 / イルチュイル）」もよく使う',
  },
  {
    id: 'nd-8',
    days: '8日（8日間）',
    hangul: '여드레',
    pronunciation: 'ヨドゥレ',
    tip: '「여덟（8）」と同語源',
  },
  {
    id: 'nd-9',
    days: '9日（9日間）',
    hangul: '아흐레',
    pronunciation: 'アフレ',
    tip: '「아홉（9）」と同語源',
  },
  {
    id: 'nd-10',
    days: '10日（10日間）',
    hangul: '열흘 ➔ [여를]',
    pronunciation: 'ヨルル',
    tip: '「열（10）」と同語源。パッチム「ㄹ」の後ろで「ㅎ」が弱化し「ヨルル」と発音（15日間・半月は「보름 ポルム」）',
  },
];

// ==========================================
// 第5章：同音・落とし穴（罠）5選データ
// ==========================================

export const PITFALLS: PitfallItem[] = [
  {
    id: 'trap-1',
    trapNo: 1,
    title: '「번（ボン）」の罠 ― 漢数詞がつくと「〜番」、固有数詞がつくと「〜回」',
    summary: '算用数字で「2번」と書かれている場合、文脈によって読み方も意味もまったく異なります。',
    details: [
      {
        items: [
          {
            label: '1번',
            hangul: '일 번（漢数詞） vs 한 번（固有数詞）',
            pronunciation: 'イル ボン vs ハン ボン',
            meaning: '1番（順序・番号） vs 1回・一度（回数・頻度）',
            note: '例: 1番出口＝일 번 출구 / もう1回＝한 번 더',
          },
          {
            label: '2번',
            hangul: '이 번（漢数詞） vs 두 번（固有数詞）',
            pronunciation: 'イ ボン vs トゥ ボン',
            meaning: '2番（順序・番号） vs 2回・二度（回数・頻度）',
            note: '例: 2番バス＝이 번 버스 / 韓国に2回行った＝두 번 갔어요',
          },
          {
            label: '3번',
            hangul: '삼 번（漢数詞） vs 세 번（固有数詞）',
            pronunciation: 'サム ボン vs セ ボン',
            meaning: '3番（順序・番号） vs 3回・三度（回数・頻度）',
            note: '例: 3番テーブル＝삼 번 테이블 / 1日3回＝하루에 세 번',
          },
        ],
      },
    ],
    keyPoint: '💡漢数詞＋번＝「〜番（番号）」、固有数詞＋번＝「〜回（回数）」と頭に叩き込みましょう！',
  },
  {
    id: 'trap-2',
    trapNo: 2,
    title: '「몇（いくつ・何〜）」の疑問文と「며칠（何日）」「얼마（いくら）」の使い分け',
    summary: '数や量を尋ねる疑問詞「몇」は濃音化・鼻音化が多発し、「何日（며칠）」の綴りトラップや「얼마」の使い分けが必須です。',
    details: [
      {
        items: [
          {
            label: '何時',
            hangul: '몇 시 ➔ [몃씨]',
            pronunciation: 'ミョッシ',
            meaning: '何時',
            note: '⚠️パッチム「ㅊ（代表音ㄷ）」の後ろで「시」が濃音化し「ミョッシ」と詰まる音になる',
          },
          {
            label: '何人 / 何名様',
            hangul: '몇 명 ➔ [면명] / 몇 분 ➔ [몃뿐]',
            pronunciation: 'ミョンミョン / ミョップン',
            meaning: '何人 / 何名様',
            note: '⚠️超重要：「몇 명」は鼻音化で「ミョンミョン [면명]」と発音！（「ミョッミョン」は❌）',
          },
          {
            label: '何個（いくつ）',
            hangul: '몇 개 ➔ [몃깨]',
            pronunciation: 'ミョッケ',
            meaning: '何個',
            note: '💡濃音化して「ミョッケ」。単体で「いくつですか？」と聞く時は「몇 개예요?」',
          },
          {
            label: '何歳',
            hangul: '몇 살 ➔ [몃쌀]',
            pronunciation: 'ミョッサル',
            meaning: '何歳',
            note: '💡親しい間柄や子どもに「몇 살이에요?」。目上の人には「연세가 어떻게 되세요?」',
          },
          {
            label: '何月何日',
            hangul: '몇 월 며칠 ➔ [며둴 며칠]',
            pronunciation: 'ミョドゥォル ミョチル',
            meaning: '何月何日',
            note: '⚠️最大の正書法トラップ！「何月」は「몇 월」と書くが、「何日」は「몇 일❌」ではなく必ず「며칠⭕」と書く！',
          },
          {
            label: 'いくら（金額）',
            hangul: '얼마 (얼마예요?)',
            pronunciation: 'オルマ（オルマエヨ？）',
            meaning: 'いくら（金額）',
            note: '⚠️値段を聞く時は「몇 원❌」とは言わず、必ず「얼마예요?（いくらですか？）」を使う',
          },
        ],
      },
    ],
    keyPoint: '⚠️「何日」は「몇 일❌ ➔ 며칠⭕」。「いくら」は「몇 원❌ ➔ 얼마⭕」。試験でも会話でも超重要です！',
  },
  {
    id: 'trap-3',
    trapNo: 3,
    title: '「分（분）」と「方（분）」の罠 ― 10분（10分） vs 두 분（2名様）',
    summary: 'ハングルの「분」には、時間の「分（漢数詞＋분）」と、人を敬って数える「方・〜名様（固有数詞＋분）」の2つがあります。',
    details: [
      {
        items: [
          {
            label: '時間: 〜分',
            hangul: '漢数詞 ＋ 분',
            pronunciation: 'シップン / オ ブン',
            meaning: '10分 (십 분 ➔ [십뿐]) / 5分 (오 분)',
            note: '※「십(10)・육(6)・팔(8)」などの後ろでは「プン」と強く濃音化します',
          },
          {
            label: '人数: 〜名様',
            hangul: '固有数詞 ＋ 분',
            pronunciation: 'ハン ブン / トゥ ブン / セ ブン',
            meaning: '1名様 (한 분) / 2名様 (두 분) / 3名様 (세 분)',
            note: '※食堂に入って店員に「두 분이세요?（2名様ですか？）」と聞かれたら、「네, 두 명이에요（はい、2人です）」と答え、注文時に「이 인분 주세요（2人前ください）」と切り替えます。',
          },
        ],
      },
    ],
    keyPoint: '💡時間の「分」＝漢数詞、人の敬称「名様」＝固有数詞。食堂での店員とのやり取りで直結します！',
  },
  {
    id: 'trap-4',
    trapNo: 4,
    title: '数の後ろに付く助詞の発音変化（連音化・濃音化・二重パッチム）',
    summary: '数字単体に直接「〜が（이/가）」「〜を（을/를）」「〜に（에）」などの助詞がつく際、パッチムが後ろの母音と結合して劇的に発音が変化します。',
    details: [
      {
        items: [
          {
            label: '3人が / 3つが',
            hangul: '셋이 ➔ [세시]',
            pronunciation: 'セシ',
            meaning: '3人が / 3つが',
            note: '⚠️「셋」単体では[섿]だが、母音「이」が続くとパッチム「ㅅ」が復活して「セシ」と連音化！',
          },
          {
            label: '4人が / 4つが',
            hangul: '넷이 ➔ [네시]',
            pronunciation: 'ネシ',
            meaning: '4人が / 4つが',
            note: '⚠️3と同様にパッチム「ㅅ」が連音化して「ネシ」（「ネッイ」「ネディ」は❌）',
          },
          {
            label: '8つが / 8人が',
            hangul: '여덟이 ➔ [여덜비]',
            pronunciation: 'ヨドルビ',
            meaning: '8つが / 8人が',
            note: '⚠️二重パッチム「ㄼ」の隠れていた「ㅂ」が母音「이」に連音化し「ヨドルビ」と発音される！',
          },
          {
            label: '6日（むいか）に',
            hangul: '육 일에 ➔ [유기레]',
            pronunciation: 'ユギレ',
            meaning: '6日（むいか）に',
            note: '💡「육＋일＋에」が2段階連続で連音化し、一息で「ユギレ」と発音される',
          },
          {
            label: '6年生',
            hangul: '육 학년 ➔ [유캉년]',
            pronunciation: 'ユカンニョン',
            meaning: '6年生',
            note: '⚠️激音化（ㄱ＋ㅎ ➔ ㅋ）と鼻音化（ㄱ＋ㄴ ➔ ㅇ＋ㄴ）が同時に起き、「ユカンニョン」と発音',
          },
        ],
      },
    ],
    keyPoint: '⚠️助詞「이/에」がつくと、パッチム（特にㅅや二重パッチムㄼ）が母音に吸い込まれて流れるように発音されます！',
  },
  {
    id: 'trap-5',
    trapNo: 5,
    title: 'ゼロの言い方 ― 「영（零）」と「공（空）」の完全使い分け',
    summary: '韓国語のゼロには漢字の「零」に由来する「영」と、「空」に由来する「공」の2通りがあり、役割が明確に分かれています。',
    details: [
      {
        items: [
          {
            label: '영（ヨン）【漢字：零】',
            hangul: '수학적・실질적 0',
            pronunciation: 'ヨン',
            meaning: '数学的・実質的な「0（ゼロ）」',
            note: '💡「量や数値としてのゼロ」: テストの点数（0点＝영 점）、気温（氷点下5度＝영하 오 도）、小数点（0.5＝영 점 오）',
          },
          {
            label: '공（コン）【漢字：空】',
            hangul: '기호・코드의 0',
            pronunciation: 'コン',
            meaning: '記号・コードとしての「0」',
            note: '💡「数字の並び（コード）を読み上げる時」: 電話番号（010＝공일공、ソウル02＝공이）、部屋番号（501号室＝공공칠 / 오백일 호）、暗証番号',
          },
        ],
      },
    ],
    keyPoint: '💡「数値・点数・気温」は「영（零）」、「電話番号・部屋番号の並び」は「공（空）」！',
  },
];

// ==========================================
// 第6章：実践シチュエーション別フレーズ（全10選）
// ==========================================

export const PRACTICAL_PHRASES: PracticalPhraseItem[] = [
  {
    id: 'ph-1',
    no: 1,
    scene: 'カフェ・食堂',
    subScene: '入店・人数',
    sentenceKo: '저기요, 저희 네 명인데요. 자리 있어요?',
    pronunciation: 'チョギヨ、チョヒ ネ ミョンインデヨ。チャリ イッソヨ？',
    translationJa: 'すみません、私たち4人なのですが、席はありますか？',
    point: '💡人数は固有数詞（한, 두, 세, 네）＋명',
  },
  {
    id: 'ph-2',
    no: 2,
    scene: 'カフェ・食堂',
    subScene: '料理＋飲み物',
    sentenceKo: '삼겹살 삼 인분하고 맥주 두 병 주세요.',
    pronunciation: 'サムギョプサル サミンブンハゴ メクチュ トゥ ビョン ジュセヨ',
    translationJa: 'サムギョプサル3人前とビール2本ください。',
    point: '⚠️「3人前」は漢数詞（삼 인분）、「2本」は固有数詞（두 병）のハイブリッド！',
    warning: true,
  },
  {
    id: 'ph-3',
    no: 3,
    scene: 'カフェ・食堂',
    subScene: 'テイクアウト',
    sentenceKo: '따뜻한 라떼 한 잔이랑 조각 케이크 두 개 포장해 주세요.',
    pronunciation: 'タトゥタン ラッテ ハン ジャンイラン チョガク ケイク トゥ ゲ ポジャンヘ ジュセヨ',
    translationJa: 'ホットラテ1杯とカットケーキ2個を持ち帰りにしてください。',
    point: '💡杯（잔）も個（개）も固有数詞を使用',
  },
  {
    id: 'ph-4',
    no: 4,
    scene: 'ショッピング',
    subScene: '値段の確認',
    sentenceKo: '이 가방은 얼마예요? — 사만 팔천 원입니다.',
    pronunciation: 'イ カバンウン オルマエヨ？ — サマン パルチョヌォンイムニダ',
    translationJa: 'このカバンはいくらですか？ — 48,000ウォンです。',
    point: '💡「팔천 원」は連音化で「パルチョヌォン」',
  },
  {
    id: 'ph-5',
    no: 5,
    scene: 'ショッピング',
    subScene: 'まとめ買い',
    sentenceKo: '이 마스크팩 열 장 사면 얼마예요?',
    pronunciation: 'イ マスクペク ヨル ジャン サミョン オルマエヨ？',
    translationJa: 'このマスクパックを10枚買ったらいくらですか？',
    point: '💡枚数（장）は固有数詞（10枚＝열 장）',
  },
  {
    id: 'ph-6',
    no: 6,
    scene: 'ショッピング',
    subScene: '分割・カード払い',
    sentenceKo: '카드로 계산할게요. 삼 개월 할부 되나요?',
    pronunciation: 'カドゥロ ケサナルケヨ。サム ゲウォル ハルブ トゥエナヨ？',
    translationJa: 'カードで支払います。3ヶ月の分割払いはできますか？',
    point: '💡「〜ヶ月（개월）」は漢数詞（삼 개월）を使用！（固有数詞なら「세 달」）',
  },
  {
    id: 'ph-7',
    no: 7,
    scene: 'タクシー・移動',
    subScene: '地下鉄・出口',
    sentenceKo: '지하철 이 호선을 타고 홍대입구역 구 번 출구로 나오세요.',
    pronunciation: 'チハチョル イ ホソンウル タゴ ホンデイプクヨク ク ボン チュルグロ ナオセヨ',
    translationJa: '地下鉄2号線に乗って、弘大入口駅の9番出口に出てください。',
    point: '💡路線番号（호선）も出口番号（번 출구）も漢数詞！',
  },
  {
    id: 'ph-8',
    no: 8,
    scene: 'タクシー・移動',
    subScene: '建物の階数',
    sentenceKo: '엘리베이터를 타고 십육 층으로 올라가세요.',
    pronunciation: 'エルリベイトゥルル タゴ シムニュク チュンウロ オルラガセヨ',
    translationJa: 'エレベーターに乗って16階へ上がってください。',
    point: '⚠️16階（십육 층）は鼻音化で「シムニュク チュン」',
    warning: true,
  },
  {
    id: 'ph-9',
    no: 9,
    scene: '待ち合わせ',
    subScene: '日時・時刻',
    sentenceKo: '유월 십일 일 금요일 오후 일곱 시 반에 만날까요?',
    pronunciation: 'ユウォル シビリル クミョイル オフ イルゴプシ バンエ マンナルッカヨ？',
    translationJa: '6月11日金曜日の午後7時半に会いましょうか？',
    point: '⚠️6月＝유월（パッチム脱落）、11日＝십일 일 [시비릴 シビリル]',
    warning: true,
  },
  {
    id: 'ph-10',
    no: 10,
    scene: 'スケジュール',
    subScene: '滞在期間',
    sentenceKo: '다음 달에 이 박 삼 일 동안 서울에 갈 거예요. (이틀은 호텔에 묵어요.)',
    pronunciation: 'タウム タレ イ バク サミル トンアン ソウレ カル コイェヨ。（イトゥルン ホテレ ムゴヨ）',
    translationJa: '来月、2泊3日の間ソウルに行く予定です。（2日間はホテルに泊まります。）',
    point: '💡「2泊3日（이 박 삼 일）」は漢数詞、「2日間（이틀）」は固有語の日数表現',
  },
];

// ナビゲーション用章カテゴリー
export const NUMBER_CHAPTERS = [
  { id: 'all', title: '全章・すべて', short: 'すべて' },
  { id: 'ch1', title: '第1章：漢数詞（日付・金額・番号）', short: '第1章 漢数詞' },
  { id: 'ch2', title: '第2章：固有数詞（個数・人数・助数詞）', short: '第2章 固有数詞' },
  { id: 'ch3', title: '第3章：時計・時刻（時＝固有・分＝漢数）', short: '第3章 時刻' },
  { id: 'ch4', title: '第4章：日付・曜日・時間軸（カレンダー・日数）', short: '第4章 日付・曜日' },
  { id: 'ch5', title: '第5章：5大落とし穴（번・몇・분・発音変化・0）', short: '第5章 5大落とし穴' },
  { id: 'ch6', title: '第6章：実践シチュエーション別フレーズ（全10選）', short: '第6章 実践フレーズ' },
];
