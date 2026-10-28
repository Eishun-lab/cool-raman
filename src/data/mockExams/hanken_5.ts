import { MockExam } from '../../types/mockExam';

export const HANKEN_5_EXAM: MockExam = {
  id: 'hanken_5',
  category: 'hanken',
  levelName: '5級',
  title: 'ハングル検定 5級 公式模擬試験',
  badge: '入門・基礎',
  subtitle: '文字・発音・基本助詞・日常会話の到達測定',
  targetLevel: 'ハングル検定 5級（合格基準 60点以上）/ CEFR A1 入門',
  timeLimitSeconds: 1200, // 20分
  totalScore: 100,
  passScore: 60,
  questionCount: 25,
  overview:
    'ハングル能力検定協会 5級基準に完全準拠。発音・表記、基本語彙、必須助詞、用言活用、および聞き取り（計25問・各4点・100点満点）で構成されています。',
  canDoList: [
    'ハングルの文字・母音・子音・パッチムを正確に読み分けられる',
    '連音化や有声音化の初歩的な発音規則を理解している',
    '挨拶、数字、日付、身の回りの名詞など約480語の基本語彙を使える',
    '基本助詞（은/는, 이/가, 을/를, 에, 에서）と現在形（-아요/어요, -습니다）を組み立てられる',
    '日常的な自己紹介や買い物の対話を聞き取れる',
  ],
  passCriteria: [
    {
      level: '5級 合格',
      minScore: 60,
      color: 'bg-[#FAF0EC] text-[#B84E34] border-[#F0D5CD]',
      description: 'おめでとうございます！5級合格基準クリア！基礎的な文字・発音・助詞が確実に身についています。次は4級へステップアップしましょう！',
    },
    {
      level: '5級 不合格',
      minScore: 0,
      color: 'bg-stone-100 text-stone-700 border-stone-300',
      description: 'あと少し！間違えた問題の解説と該当レッスンを復習して、60点突破を目指しましょう。',
    },
  ],
  questions: [
    // -------------------------------------------------------------
    // 【発音・表記】第1問〜第5問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk5-q1',
      questionNumber: 1,
      section: 'pronunciation',
      sectionLabel: '【発音・表記】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '<u>한국어</u>（韓国語）の発音はどれですか？',
      options: ['[한구거]', '[한국어]', '[한구어]', '[항구거]'],
      correctIndex: 0,
      score: 4,
      explanation:
        'パッチム「ㄱ」の直後に母音「어」が続くため、パッチムが次の音節の初声に移って発音される「連音化（リエゾン）」が起こり、[한구거]（ハングゴ）となります。',
      linkReview: {
        label: '第1課: ハングルの読み方パズル ＆ 連音化',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },
    {
      id: 'hk5-q2',
      questionNumber: 2,
      section: 'pronunciation',
      sectionLabel: '【発音・表記】',
      instruction: 'パッチムの代表音（終声の発音）が他と異なるものを1つ選んでください。',
      options: ['옷（服）', '낮（昼）', '꽃（花）', '방（部屋）'],
      correctIndex: 3,
      score: 4,
      explanation:
        '옷（ㅅ）, 낮（ㅈ）, 꽃（ㅊ）はいずれも終声代表音「ㄷ」音で発音されます。一方、방のパッチム「ㅇ」は[ŋ]音（鼻音）であるため仲間外れです。',
      linkReview: {
        label: '第1課: パッチムの7大代表音',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },
    {
      id: 'hk5-q3',
      questionNumber: 3,
      section: 'pronunciation',
      sectionLabel: '【発音・表記】',
      instruction: '激音（息を強く吐き出す音）を含む単語を1つ選んでください。',
      options: ['가방（かばん）', '커피（コーヒー）', '바다（海）', '사과（りんご）'],
      correctIndex: 1,
      score: 4,
      explanation:
        '「커피」の「ㅋ」と「ㅍ」は息を強く吐き出す激音です。가방, 바다, 사과の子音は平音です。',
      linkReview: {
        label: '第1課: 平音・激音・濃音の識別',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },
    {
      id: 'hk5-q4',
      questionNumber: 4,
      section: 'pronunciation',
      sectionLabel: '【発音・表記】',
      instruction: 'ハングルのスペル（表記）として正しいものを1つ選んでください。',
      questionText: '日本語の「先生」に該当する正しい韓国語表記はどれですか？',
      options: ['선생림', '선생님', '선생닙', '선생임'],
      correctIndex: 1,
      score: 4,
      explanation:
        '「先生」は漢字語「先生（선생）」に敬称接尾辞「-님」が付いた「선생님（ソンセンニム）」が正しい表記です。',
      linkReview: {
        label: '第2課: 挨拶と自己紹介',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },
    {
      id: 'hk5-q5',
      questionNumber: 5,
      section: 'pronunciation',
      sectionLabel: '【発音・表記】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '<u>집에</u>（家に）の発音はどれですか？',
      options: ['[지베]', '[집에]', '[지메]', '[치베]'],
      correctIndex: 0,
      score: 4,
      explanation:
        'パッチム「ㅂ」の直後に助詞「에」が続くため、連音化により「ㅂ」が移動して[지베]（チベ）と発音されます。',
      linkReview: {
        label: '第1課: 連音化の規則',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },

    // -------------------------------------------------------------
    // 【語彙・数詞】第6問〜第10問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk5-q6',
      questionNumber: 6,
      section: 'vocab',
      sectionLabel: '【語彙・数詞】',
      instruction: '空欄に入る最も適切な単語を1つ選んでください。',
      passage: '가: 지금 몇 시예요?\n나: 오후 ( 　 ) 시 삼십 분이에요.（3時30分です）',
      options: ['셋', '세', '삼', '석'],
      correctIndex: 1,
      score: 4,
      explanation:
        '時刻の「〜時」には固有数詞を用います。数詞「셋（3）」は助数詞（시）の直前で語形変化を起こして「세（セ）」になります。「삼」は漢数詞（分に使用）です。',
      translation: 'A: 今何時ですか？\nB: 午後3時30分です。',
      linkReview: {
        label: '第4課: 数字・時刻・数え方',
        tab: 'textbook',
        id: 'lesson-4',
      },
    },
    {
      id: 'hk5-q7',
      questionNumber: 7,
      section: 'vocab',
      sectionLabel: '【語彙・数詞】',
      instruction: '下線部の反意語（反対の意味の言葉）として適切なものを選んでください。',
      questionText: '이 방은 <u>넓어요</u>.（この部屋は広いです）',
      options: ['좁아요', '작아요', '낮아요', '멀어요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '「넓다（広い）」の反対語は「좁다（狭い）」で、ヘヨ体は「좁아요（チョバヨ）」です。작다は小さい、낮다は低い、멀다は遠いです。',
      linkReview: {
        label: '第6課: 基本形容詞とヘヨ体',
        tab: 'textbook',
        id: 'lesson-6',
      },
    },
    {
      id: 'hk5-q8',
      questionNumber: 8,
      section: 'vocab',
      sectionLabel: '【語彙・数詞】',
      instruction: '値段を表す漢数字の読み方として正しいものを1つ選んでください。',
      questionText: '5,000원（5千ウォン）',
      options: ['오천 원', '다섯천 원', '오백 원', '오만 원'],
      correctIndex: 0,
      score: 4,
      explanation:
        'お金の単位「ウォン（원）」は漢数詞で数えます。5（오）＋千（천）で「오천 원（オチョノン）」となります。',
      linkReview: {
        label: '第4課: 漢数詞と金額',
        tab: 'textbook',
        id: 'lesson-4',
      },
    },
    {
      id: 'hk5-q9',
      questionNumber: 9,
      section: 'vocab',
      sectionLabel: '【語彙・数詞】',
      instruction: '文脈に最も合う挨拶表現を1つ選んでください。',
      passage: '（店を出る客に対して、店主が見送る際の挨拶）\n점원: 손님, ( 　 )!',
      options: ['안녕히 계세요', '안녕히 가세요', '처음 뵙겠습니다', '실례합니다'],
      correctIndex: 1,
      score: 4,
      explanation:
        '立ち去る人に対してその場に残る側が見送る挨拶は「안녕히 가세요（安寧にお行きください）」です。「안녕히 계세요」はその場に残る人に対して去る側が言います。',
      translation: '店員: お客様、さようなら（お気をつけてお帰りください）！',
      linkReview: {
        label: '第2課: 基本の挨拶表現',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },
    {
      id: 'hk5-q10',
      questionNumber: 10,
      section: 'vocab',
      sectionLabel: '【語彙・数詞】',
      instruction: '曜日の組み合わせとして正しいものを1つ選んでください。',
      questionText: '月曜日・水曜日・金曜日',
      options: [
        '화요일・목요일・토요일',
        '월요일・수요일・금요일',
        '월요일・화요일・수요일',
        '일요일・월요일・화요일',
      ],
      correctIndex: 1,
      score: 4,
      explanation:
        '月（월）・水（수）・金（금）に「曜日（요일）」が付いた「월요일・수요일・금요일」が正解です。',
      linkReview: {
        label: '第4課: 日付・曜日の対照表',
        tab: 'textbook',
        id: 'lesson-4',
      },
    },

    // -------------------------------------------------------------
    // 【助詞・指定詞】第11問〜第15問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk5-q11',
      questionNumber: 11,
      section: 'grammar',
      sectionLabel: '【助詞・指定詞】',
      instruction: '空欄に入る適切な助詞の組み合わせを1つ選んでください。',
      passage: '저( 　 ) 일본 사람입니( 　 ).（私は日本人です）',
      options: ['는 / 다', '는 / 까', '가 / 다', '를 / 까'],
      correctIndex: 0,
      score: 4,
      explanation:
        '主題助詞「〜は」はパッチムのない名詞「저」に「는」が付きます。またハムニダ体の指定詞平叙形は「-입니다」なので「다」が入ります。',
      translation: '私は日本人です。',
      linkReview: {
        label: '第2課: 主題助詞（은/는）とハムニダ体',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },
    {
      id: 'hk5-q12',
      questionNumber: 12,
      section: 'grammar',
      sectionLabel: '【助詞・指定詞】',
      instruction: '指定詞（〜です）の使い分けとして正しいものを選んでください。',
      passage: '이것은 책( 　 ). 저것은 모자( 　 ).（これは本です。あれは帽子です）',
      options: ['이에요 / 예요', '예요 / 이에요', '이에요 / 이에요', '예요 / 예요'],
      correctIndex: 0,
      score: 4,
      explanation:
        'ヘヨ体の指定詞「〜です」は、パッチムのある名詞（책）には「-이에요」、パッチムのない名詞（모자）には「-예요」が接続します。',
      translation: 'これは本です。あれは帽子です。',
      linkReview: {
        label: '第2課: 指定詞（이에요 / 예요）の使い分け',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },
    {
      id: 'hk5-q13',
      questionNumber: 13,
      section: 'grammar',
      sectionLabel: '【助詞・指定詞】',
      instruction: '空欄に入る適切な場所の助詞を選んでください。',
      passage: '저는 지금 도서관( 　 ) 공부해요.（私は今図書館で勉強しています）',
      options: ['에서', '에', '으로', '를'],
      correctIndex: 0,
      score: 4,
      explanation:
        '動作が行われる場所「〜で」には「에서」を用います。「에」は行き先（〜へ）や存在（〜に）に使われます。',
      translation: '私は今図書館で勉強しています。',
      linkReview: {
        label: '第7課: 場所の助詞（에 vs 에서）',
        tab: 'textbook',
        id: 'lesson-7',
      },
    },
    {
      id: 'hk5-q14',
      questionNumber: 14,
      section: 'grammar',
      sectionLabel: '【助詞・指定詞】',
      instruction: '空欄に入る適切な助詞を1つ選んでください。',
      passage: '매일 아침 커피( 　 ) 마셔요.（毎朝コーヒーを飲みます）',
      options: ['를', '을', '에', '가'],
      correctIndex: 0,
      score: 4,
      explanation:
        '目的格助詞「〜を」は、直前の名詞「커피」にパッチムがないため「를」を選択します（パッチムがある名詞なら「을」）。',
      translation: '毎朝コーヒーを飲みます。',
      linkReview: {
        label: '第7課: 目的格助詞（을/를）の使い分け',
        tab: 'textbook',
        id: 'lesson-7',
      },
    },
    {
      id: 'hk5-q15',
      questionNumber: 15,
      section: 'grammar',
      sectionLabel: '【助詞・指定詞】',
      instruction: '存在詞「있다/없다」を用いた表現として最も適切なものを選んでください。',
      passage: '가: 교실에 시계가 있어요?\n나: 아니요, 시계가 ( 　 ).（いいえ、時計がありません）',
      options: ['없어요', '있어요', '아니에요', '안 해요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '「時計がありますか？」の問いに対して「아니요（いいえ）」と否定しているため、「ありません」を意味する存在詞「없다」のヘヨ体「없어요（オプソヨ）」が入ります。',
      translation: 'A: 教室に時計がありますか？\nB: いいえ、時計がありません。',
      linkReview: {
        label: '第5課: 存在詞（있다 / 없다）の使い方',
        tab: 'textbook',
        id: 'lesson-5',
      },
    },

    // -------------------------------------------------------------
    // 【活用・実戦会話】第16問〜第20問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk5-q16',
      questionNumber: 16,
      section: 'grammar',
      sectionLabel: '【活用・実戦会話】',
      instruction: '動詞「가다（行く）」のヘヨ体現在形として正しいものを選んでください。',
      options: ['가어요', '가요', '가아', '가셔요'],
      correctIndex: 1,
      score: 4,
      explanation:
        '語幹「가-」の母音は陽母音「ㅏ」なので「-아요」が付きますが、同じ母音「ㅏ+ㅏ」が縮約されて「가요（カヨ）」となります。',
      linkReview: {
        label: '第6課: ヘヨ体現在形の母音調和と縮約',
        tab: 'textbook',
        id: 'lesson-6',
      },
    },
    {
      id: 'hk5-q17',
      questionNumber: 17,
      section: 'grammar',
      sectionLabel: '【活用・実戦会話】',
      instruction: '空欄に入る適切なヘヨ体の形を1つ選んでください。',
      passage: '날씨가 참 ( 　 ).（天気がとても良いです）※原形: 좋다',
      options: ['좋아요', '좋어요', '조아요', '좋해요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '語幹「좋-」の母音は陽母音「ㅗ」なので「-아요」が付き「좋아요（チョアヨ）」となります。パッチムがあるため縮約は起こりません。',
      linkReview: {
        label: '第6課: 陽母音語幹の活用',
        tab: 'textbook',
        id: 'lesson-6',
      },
    },
    {
      id: 'hk5-q18',
      questionNumber: 18,
      section: 'grammar',
      sectionLabel: '【活用・実戦会話】',
      instruction: '否定文「私は辛い食べ物を食べません」として正しいものを1つ選んでください。',
      options: [
        '저는 매운 음식을 안 먹어요.',
        '저는 매운 음식을 못 먹어요.',
        '저는 매운 음식을 먹어요.',
        '저는 매운 음식을 아니 먹어요.',
      ],
      correctIndex: 0,
      score: 4,
      explanation:
        '自分の意志で「〜しない」という否定は用言の直前に「안」を置きます。「안 먹어요」が正解です。「못」は能力や状況で「〜できない」を表します。',
      linkReview: {
        label: '第8課: 否定表現（안 vs 못）',
        tab: 'textbook',
        id: 'lesson-8',
      },
    },
    {
      id: 'hk5-q19',
      questionNumber: 19,
      section: 'vocab',
      sectionLabel: '【活用・実戦会話】',
      instruction: '「감사합니다（ありがとうございます）」に対する自然な返答を選んでください。',
      options: ['아니에요.', '미안해요.', '잘 먹겠습니다.', '반갑습니다.'],
      correctIndex: 0,
      score: 4,
      explanation:
        '感謝された際の「いいえ、どういたしまして（とんでもないです）」には「아니에요（アニエヨ）」が最も一般的に使われます。',
      linkReview: {
        label: '第2課: 挨拶と自己紹介の相づち',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },
    {
      id: 'hk5-q20',
      questionNumber: 20,
      section: 'grammar',
      sectionLabel: '【活用・実戦会話】',
      instruction: '飲食店で「お水（を）ください」と頼むときの正しい表現を選んでください。',
      options: ['물 주세요.', '물 마셔요.', '물 가세요.', '물 봐요.'],
      correctIndex: 0,
      score: 4,
      explanation:
        '名詞に「주세요（チュセヨ＝ください）」を付けることで「〜をください」という依頼表現になります。',
      linkReview: {
        label: '第15課: 依頼・指示（주세요）',
        tab: 'textbook',
        id: 'lesson-15',
      },
    },

    // -------------------------------------------------------------
    // 【聞き取り・リスニング】第21問〜第25問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk5-q21',
      questionNumber: 21,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、相手の発言に対する最も自然な応答を1つ選んでください。',
      audioText: '만나서 반갑습니다. 저는 김민수예요.',
      questionText: '相手の言葉に対する返答として最も自然なものはどれですか？',
      options: [
        '네, 반갑습니다.',
        '아니요, 괜찮아요.',
        '안녕히 가세요.',
        '감사합니다.',
      ],
      correctIndex: 0,
      score: 4,
      explanation:
        '「お会いできて嬉しいです。私はキム・ミンスです」と自己紹介されたので、「はい、お会いできて嬉しいです（네, 반갑습니다）」と返すのが最も自然です。',
      translation: '音声: 「お会いできて嬉しいです。私はキム・ミンスです。」\n答え: 「はい、お会いできて嬉しいです。」',
      linkReview: {
        label: '第2課: 自己紹介の挨拶フレーズ',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },
    {
      id: 'hk5-q22',
      questionNumber: 22,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、二人が会話している「場所」を選んでください。',
      audioText: '가: 아메리카노 한 잔 주세요. 나: 네, 4천 원입니다.',
      questionText: '二人はどこで会話していますか？',
      options: ['카페（カフェ）', '은행（銀行）', '병원（病院）', '도서관（図書館）'],
      correctIndex: 0,
      score: 4,
      explanation:
        '「アメリカーノ1杯ください」「はい、4千ウォンです」という会話から、場所は「カフェ（카페）」です。',
      translation: 'A: アメリカーノ一杯ください。\nB: はい、4千ウォンです。',
      linkReview: {
        label: '第4課: 助数詞（杯・잔）とカフェ注文',
        tab: 'textbook',
        id: 'lesson-4',
      },
    },
    {
      id: 'hk5-q23',
      questionNumber: 23,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、男性が今どこへ行くのか選んでください。',
      audioText: '가: 민수 씨, 지금 어디에 가요? 나: 저는 도서관에 가요. 책을 읽어요.',
      questionText: '男性は今どこに行きますか？',
      options: ['도서관（図書館）', '식당（食堂）', '공항（空港）', '회사（会社）'],
      correctIndex: 0,
      score: 4,
      explanation:
        '男性は「저는 도서관에 가요（私は図書館に行きます）」と言っています。',
      translation: 'A: ミンスさん、今どこに行きますか？\nB: 私は図書館に行きます。本を読みます。',
      linkReview: {
        label: '第7課: 場所の助詞（에 가다）',
        tab: 'textbook',
        id: 'lesson-7',
      },
    },
    {
      id: 'hk5-q24',
      questionNumber: 24,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、リンゴの値段として正しいものを選んでください。',
      audioText: '가: 아저씨, 이 사과 얼마예요? 나: 한 개에 천오백 원이에요.',
      questionText: 'リンゴ1個の値段はいくらですか？',
      options: ['1,000ウォン', '1,500ウォン', '5,000ウォン', '500ウォン'],
      correctIndex: 1,
      score: 4,
      explanation:
        '「한 개에 천오백 원이에요（1個に千五百ウォンです）」と言っているため、1,500ウォンが正解です。',
      translation: 'A: おじさん、このりんごいくらですか？\nB: 1個1,500ウォンです。',
      linkReview: {
        label: '第4課: 固有数詞の助数詞（個・개）と金額漢数詞',
        tab: 'textbook',
        id: 'lesson-4',
      },
    },
    {
      id: 'hk5-q25',
      questionNumber: 25,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、質問に対する返答として最も適切なものを選んでください。',
      audioText: '한국 음식을 좋아해요?',
      questionText: '質問に対する女性の答えはどれですか？',
      options: [
        '네, 아주 좋아해요.',
        '아니요, 한국 사람이에요.',
        '네, 안 가요.',
        '감사합니다.',
      ],
      correctIndex: 0,
      score: 4,
      explanation:
        '「韓国料理が好きですか？」という質問に対して、「はい、とても好きです（네, 아주 좋아해요）」と答えるのが自然です。',
      translation: '音声: 「韓国料理が好きですか？」\n答え: 「はい、とても好きです。」',
      linkReview: {
        label: '第6課: ヘヨ体と副詞（아주）',
        tab: 'textbook',
        id: 'lesson-6',
      },
    },
  ],
};
