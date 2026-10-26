import { MockExam } from '../../types/mockExam';

export const HANKEN_4_EXAM: MockExam = {
  id: 'hanken_4',
  category: 'hanken',
  levelName: '4級',
  title: 'ハングル検定 4級 模擬試験',
  badge: '初級完成',
  subtitle: '音変化・不規則活用・過去形・理由・依頼・日常会話読解の到達測定',
  targetLevel: 'ハングル検定 4級（合格基準 70点以上）/ CEFR A1+〜A2',
  timeLimitSeconds: 1200, // 20分
  totalScore: 100,
  passScore: 70,
  questionCount: 20,
  overview:
    'ハングル能力検定協会（ハン検）4級の公式基準に完全準拠。鼻音化・激音化などの音変化、ㅂ・ㄷ・르などの不規則活用、過去形、理由（-아서/어서, -(으)니까）、依頼・可能表現、および短文読解とリスニング（計20問）で構成されています。',
  canDoList: [
    '鼻音化、激音化、口蓋音化などの主要な音変化を正確に発音・識別できる',
    'ㅂ変則、ㄷ変則、르変則、ㅡ脱落などの用言活用を瞬時に変換できる',
    '過去（-았/었어요）、未来（-(으)ㄹ 거예요）、可能（-(으)ㄹ 수 있다）の時制と助動詞を使いこなせる',
    '理由（-아서/어서, -(으)니까）の制約条件を正しく使い分けられる',
    '病院、駅、買い物、約束など、日常生活に必要な対話文を聞き取って意図を把握できる',
  ],
  passCriteria: [
    {
      level: '4級 合格',
      minScore: 70,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: '見事合格！初級文法と不規則活用の重要関門を突破しました。次は中級（3級：敬語・間接話法・慣用句）へのステップアップに挑戦しましょう！',
    },
    {
      level: '4級 不合格',
      minScore: 0,
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      description: '合格点（70点）まであと少し。失点しやすい不規則活用（ㅂ・ㄷ・르）と理由表現（-아서/어서 vs -(으)니까）を教科書第11〜20課で重点復習しましょう。',
    },
  ],
  questions: [
    // -------------------------------------------------------------
    // 【発音・音変化】第1問〜第4問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q1',
      questionNumber: 1,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '국물（スープ）の発音はどれですか？',
      options: ['[국물]', '[궁물]', '[군물]', '[국늘]'],
      correctIndex: 1,
      score: 5,
      explanation:
        'パッチム「ㄱ」の直後に鼻音「ㅁ」が続くため、パッチム「ㄱ」が同じ調音位置の鼻音「ㅇ」に変化する「鼻音化」が起こり、[궁물]（クンムル）と発音されます。',
      linkReview: {
        label: '参考書Q10: 鼻音化のメカニズム',
        tab: 'reference',
        id: 'qa-10',
      },
    },
    {
      id: 'hk4-q2',
      questionNumber: 2,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '축하（お祝い）の発音はどれですか？',
      options: ['[추카]', '[축하]', '[추가]', '[충하]'],
      correctIndex: 0,
      score: 5,
      explanation:
        '平音「ㄱ」と「ㅎ」が隣り合うと合体して激音「ㅋ」になる「激音化（有気音化）」が起こり、[추카]（チュッカ）となります。',
      linkReview: {
        label: '参考書Q20: 激音化のルール',
        tab: 'reference',
        id: 'qa-20',
      },
    },
    {
      id: 'hk4-q3',
      questionNumber: 3,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '같이（一緒に）の発音はどれですか？',
      options: ['[가티]', '[가치]', '[갇이]', '[가지]'],
      correctIndex: 1,
      score: 5,
      explanation:
        'パッチム「ㅌ」の直後に母音「이」が続くと「ㅊ」音に変化する「口蓋音化」が起こり、[가치]（カチ）と発音されます。',
      linkReview: {
        label: '参考書Q21: 口蓋音化の法則',
        tab: 'reference',
        id: 'qa-21',
      },
    },
    {
      id: 'hk4-q4',
      questionNumber: 4,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '연락（連絡）の発音はどれですか？',
      options: ['[연락]', '[열락]', '[영낙]', '[연낙]'],
      correctIndex: 1,
      score: 5,
      explanation:
        'パッチム「ㄴ」と初声「ㄹ」が隣接すると、両方とも「ㄹ」音になる「流音化（ㄹ音化）」が起こり、[열락]（ヨルラク）と発音されます。',
      linkReview: {
        label: '参考書Q36: 流音化（ㄹ音化）',
        tab: 'reference',
        id: 'qa-36',
      },
    },

    // -------------------------------------------------------------
    // 【変則活用】第5問〜第8問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q5',
      questionNumber: 5,
      section: 'grammar',
      sectionLabel: '【変則活用】',
      instruction: '下線部の形容詞「춥다（寒い）」のヘヨ体として正しいものを1つ選んでください。',
      questionText: '겨울에는 날씨가 많이 ( 　 ).（冬には天気がとても寒いです）',
      options: ['춥어요', '추워요', '추바요', '추와요'],
      correctIndex: 1,
      score: 5,
      explanation:
        '「춥다」はㅂ変則用言です。母音で始まる語尾が接続すると語幹末の「ㅂ」が「우」に変化し、「우 + 어요」が合体して「추워요（チュウォヨ）」となります。',
      translation: '冬には天気がとても寒いです。',
      linkReview: {
        label: '第12課: ㅂ変則活用マスター',
        tab: 'textbook',
        id: 'lesson-12',
      },
    },
    {
      id: 'hk4-q6',
      questionNumber: 6,
      section: 'grammar',
      sectionLabel: '【変則活用】',
      instruction: '動詞「듣다（聴く）」の過去形として正しいものを1つ選んでください。',
      questionText: '어제 좋은 음악을 ( 　 ).（昨日良い音楽を聴きました）',
      options: ['듣었어요', '들었어요', '들았어요', '듣았어요'],
      correctIndex: 1,
      score: 5,
      explanation:
        '「듣다」はㄷ変則動詞です。母音が続くとパッチム「ㄷ」が「ㄹ」に変化します。語幹母音が「ㅡ」（陰母音）なので過去形語尾「-었어요」が付き「들었어요（トゥロッソヨ）」となります。',
      translation: '昨日良い音楽を聴きました。',
      linkReview: {
        label: '第14課: ㄷ変則活用',
        tab: 'textbook',
        id: 'lesson-14',
      },
    },
    {
      id: 'hk4-q7',
      questionNumber: 7,
      section: 'grammar',
      sectionLabel: '【変則活用】',
      instruction: '動詞「모르다（知らない）」のヘヨ体現在形として正しいものを選んでください。',
      questionText: '저는 한국어를 잘 ( 　 ).（私は韓国語をよく知りません・分かりません）',
      options: ['몰라요', '모라요', '모르어요', '몰러요'],
      correctIndex: 0,
      score: 5,
      explanation:
        '「모르다」は르変則動詞です。母音語尾が接続すると「ㅡ」が脱落し、直前の音節にパッチム「ㄹ」が挿入され、さらに「라/러」が接続します。「모（陽母音）」なので「몰라요（モルラヨ）」になります。',
      translation: '私は韓国語をよく分かりません。',
      linkReview: {
        label: '第15課: 르変則活用',
        tab: 'textbook',
        id: 'lesson-15',
      },
    },
    {
      id: 'hk4-q8',
      questionNumber: 8,
      section: 'grammar',
      sectionLabel: '【変則活用】',
      instruction: '動詞「만들다（作る）」に理由の語尾「-(으)니까」が接続した正しい形を選んでください。',
      options: ['만드니까', '만들으니까', '만드러니까', '만들니까'],
      correctIndex: 0,
      score: 5,
      explanation:
        '語幹末にパッチム「ㄹ」を持つ用言は、「ㄴ, ㅂ, ㅅ, -(으)」で始まる語尾が接続するとパッチム「ㄹ」が脱落（ㄹ脱落）します。したがって「만들- + -(으)니까」は「만드니까（マンドゥニッカ）」となります。',
      linkReview: {
        label: '第16課: ㄹ脱落と変則活用',
        tab: 'textbook',
        id: 'lesson-16',
      },
    },

    // -------------------------------------------------------------
    // 【初級重要文法】第9問〜第13問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q9',
      questionNumber: 9,
      section: 'grammar',
      sectionLabel: '【文法・時制】',
      instruction: '過去形（〜しました）の文として正しいものを1つ選んでください。',
      passage: '가: 주말에 뭐 했어요?\n나: 친구를 ( 　 ).（友達に会いました）',
      options: ['만나요', '만났어요', '만날 거예요', '만나고 싶어요'],
      correctIndex: 1,
      score: 5,
      explanation:
        '「週末に何をしましたか？」と過去のこと（뭐 했어요?）を聞かれているため、過去形語尾「-았/었어요」を用いた「만났어요（マンナッソヨ）」が正解です。',
      translation: 'A: 週末に何をしましたか？\nB: 友達に会いました。',
      linkReview: {
        label: '第9課: 過去形（-았/었어요）',
        tab: 'textbook',
        id: 'lesson-9',
      },
    },
    {
      id: 'hk4-q10',
      questionNumber: 10,
      section: 'grammar',
      sectionLabel: '【文法・理由】',
      instruction: '空欄に入る適切な接続語尾を1つ選んでください。後件が勧誘文（〜しましょう）になっています。',
      passage: '시간이 ( 　 ) 택시를 탑시다.（時間がないのでタクシーに乗りましょう）',
      options: ['없어서', '없으니까', '없지만', '없는데'],
      correctIndex: 1,
      score: 5,
      explanation:
        '後件が命令文（-으세요）や勧誘文（-ㅂ시다）の場合、理由の接続語尾「-아서/어서」は使えず、「-(으)니까」を用いなければならないという文法規則があります。',
      translation: '時間がないのでタクシーに乗りましょう。',
      linkReview: {
        label: '第18課: 理由表現（-아서/어서 vs -(으)니까）',
        tab: 'textbook',
        id: 'lesson-18',
      },
    },
    {
      id: 'hk4-q11',
      questionNumber: 11,
      section: 'grammar',
      sectionLabel: '【文法・可能】',
      instruction: '「〜することができる（可能）」を表す文として正しいものを選んでください。',
      questionText: '私は韓国語を話すことができます。',
      options: [
        '저는 한국어를 말할 수 있어요.',
        '저는 한국어를 말하고 싶어요.',
        '저는 한국어를 말해야 돼요.',
        '저는 한국어를 말하지 않아요.',
      ],
      correctIndex: 0,
      score: 5,
      explanation:
        '可能表現「〜することができる」は「-(으)ㄹ 수 있다」を用います。語幹「말하-」に「-ㄹ 수 있어요」が接続して「말할 수 있어요」となります。',
      linkReview: {
        label: '第17課: 可能・不可能（-(으)ㄹ 수 있다/없다）',
        tab: 'textbook',
        id: 'lesson-17',
      },
    },
    {
      id: 'hk4-q12',
      questionNumber: 12,
      section: 'grammar',
      sectionLabel: '【文法・依頼】',
      instruction: '相手に「〜してください（丁寧な依頼）」と頼む表現を選んでください。',
      passage: '이 문을 좀 ( 　 ).（このドアをちょっと開けてください）',
      options: ['열어 주세요', '열고 싶어요', '열지 마세요', '열어야 해요'],
      correctIndex: 0,
      score: 5,
      explanation:
        '「〜してください」と依頼する表現は「-아/어 주세요」です。動詞「열다（開ける）」に接続して「열어 주세요（ヨロ ジュセヨ）」となります。',
      translation: 'このドアをちょっと開けてください。',
      linkReview: {
        label: '第13課: 依頼表現（-아/어 주세요）',
        tab: 'textbook',
        id: 'lesson-13',
      },
    },
    {
      id: 'hk4-q13',
      questionNumber: 13,
      section: 'grammar',
      sectionLabel: '【文法・助詞使い分け】',
      instruction: '空欄に入る適切な助詞の組み合わせを1つ選んでください。',
      passage: '도서관( 　 ) 공부를 하고, 집( 　 ) 돌아왔어요.（図書館で勉強をして、家に帰ってきました）',
      options: ['에서 / 에', '에 / 에서', '에서 / 에서', '에 / 에'],
      correctIndex: 0,
      score: 5,
      explanation:
        '動作・行為が行われる舞台には「〜で（에서）」を用い、帰着点・到着場所には「〜に（에）」を用います。',
      translation: '図書館で勉強をして、家に帰ってきました。',
      linkReview: {
        label: '第7課: 助詞使い分け（에 vs 에서）',
        tab: 'textbook',
        id: 'lesson-7',
      },
    },

    // -------------------------------------------------------------
    // 【短文読解】第14問〜第16問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q14',
      questionNumber: 14,
      section: 'reading',
      sectionLabel: '【短文読解】',
      instruction: '次の案内文を読んで、内容と一致するものを1つ選んでください。',
      passage:
        '【한국어 교실 안내】\n일시: 매주 토요일 오후 2시〜4시\n장소: 시민회관 3층 301호\n준비물: 필기도구, 교재\n※ 참가비는 무료입니다.',
      questionText: '案内文の内容と一致するものはどれですか？',
      options: [
        '수업은 일요일에 있습니다.',
        '참가비는 돈을 내야 합니다.',
        '수업 시간은 2시간입니다.',
        '시민회관 1층에서 모입니다.',
      ],
      correctIndex: 2,
      score: 5,
      explanation:
        '「午後2時〜4時（오후 2시〜4시）」とあるため、授業時間は2時間です。土曜日に開催、無料（무료）、3階（3층）なので他の選択肢は誤りです。',
      translation:
        '【韓国語教室のご案内】\n日時: 毎週土曜日 午後2時〜4時\n場所: 市民会館3階301号\n持ち物: 筆記用具、テキスト\n※参加費は無料です。',
      linkReview: {
        label: '第4課: 日時と数字の読解',
        tab: 'textbook',
        id: 'lesson-4',
      },
    },
    {
      id: 'hk4-q15',
      questionNumber: 15,
      section: 'reading',
      sectionLabel: '【短文読解】',
      instruction: '次の日記を読んで、筆者が昨日したこととして正しいものを選んでください。',
      passage:
        '어제는 아침부터 머리가 아파서 회사에 못 갔습니다. 집에서 하루 종일 쉬고 따뜻한 차를 마셨습니다. 오늘은 많이 좋아졌습니다.',
      questionText: '筆者は昨日何をしましたか？',
      options: [
        '회사에서 일했습니다.',
        '집에서 쉬었습니다.',
        '병원에 갔습니다.',
        '친구를 만났습니다.',
      ],
      correctIndex: 1,
      score: 5,
      explanation:
        '「頭が痛くて会社に行けず、家で一日中休みました（집에서 하루 종일 쉬고）」と明記されています。',
      translation:
        '昨日は朝から頭が痛くて会社に行けませんでした。家で一日中休み、温かいお茶を飲みました。今日は随分良くなりました。',
      linkReview: {
        label: '第19課: 理由・体調の日記読解',
        tab: 'textbook',
        id: 'lesson-19',
      },
    },
    {
      id: 'hk4-q16',
      questionNumber: 16,
      section: 'reading',
      sectionLabel: '【短文読解】',
      instruction: '空欄に入る接続詞として最も適切なものを1つ選んでください。',
      passage:
        '어제 백화점에 갔습니다. 예쁜 코트가 많았습니다. ( 　 ) 값이 너무 비싸서 못 샀습니다.',
      options: ['그리고', '그래서', '하지만', '그러면'],
      correctIndex: 2,
      score: 5,
      explanation:
        '「綺麗なコートがたくさんありました」と「値段があまりに高くて買えませんでした」は逆接の関係にあるため、「しかし（하지만）」が最も適切です。',
      translation:
        '昨日デパートに行きました。綺麗なコートがたくさんありました。しかし、値段が高すぎて買えませんでした。',
      linkReview: {
        label: '第10課: 接続詞（그리고, 하지만, 그래서）',
        tab: 'textbook',
        id: 'lesson-10',
      },
    },

    // -------------------------------------------------------------
    // 【聞き取り音声】第17問〜第20問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q17',
      questionNumber: 17,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、二人が約束した「曜日」を選んでください。',
      audioText:
        '가: 이번 주 토요일에 같이 영화 볼까요? 나: 토요일에는 바빠요. 일요일은 어때요? 가: 좋아요. 일요일에 만나요.',
      questionText: '二人は何曜日に会うことにしましたか？',
      options: ['금요일（金曜日）', '토요일（土曜日）', '일요일（日曜日）', '월요일（月曜日）'],
      correctIndex: 2,
      score: 5,
      explanation:
        '土曜日は忙しい（바빠요）ため、日曜日はどうかと提案し、最終的に「일요일에 만나요（日曜日に会いましょう）」と合意しています。',
      translation:
        'A: 今週の土曜日に一緒に映画を見ましょうか？\nB: 土曜日は忙しいです。日曜日はどうですか？\nA: いいですね。日曜日に会いましょう。',
      linkReview: {
        label: '第11課: 提案表現（-(으)ㄹ까요?）と曜日',
        tab: 'textbook',
        id: 'lesson-11',
      },
    },
    {
      id: 'hk4-q18',
      questionNumber: 18,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、男性がコンビニに行く「目的」を選んでください。',
      audioText:
        '가: 비가 오네요. 우산 있어요? 나: 아니요, 없어요. 편의점에 우산 사러 갈 거예요.',
      questionText: '男性がコンビニに行く目的は何ですか？',
      options: ['우산을 사려고', '비를 피하려고', '친구를 만나려고', '커피를 마시려고'],
      correctIndex: 0,
      score: 5,
      explanation:
        '男性は「편의점에 우산 사러 갈 거예요（コンビニに傘を買いに行くつもりです）」と目的語尾「-(으)러 가다」を用いて話しています。',
      translation:
        'A: 雨が降っていますね。傘はありますか？\nB: いいえ、ありません。コンビニに傘を買いに行きます。',
      linkReview: {
        label: '第18課: 目的の接続（-(으)러 가다）',
        tab: 'textbook',
        id: 'lesson-18',
      },
    },
    {
      id: 'hk4-q19',
      questionNumber: 19,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、薬を飲むタイミングとして正しいものを選んでください。',
      audioText:
        '가: 약사님, 이 약은 어떻게 먹어요? 나: 하루에 세 번, 식사 후에 드세요.',
      questionText: '薬はいつ飲みますか？',
      options: ['식사 전（食前）', '식사 후（食後）', '자기 전（就寝前）', '아침에만（朝だけ）'],
      correctIndex: 1,
      score: 5,
      explanation:
        '薬剤師が「하루에 세 번, 식사 후에 드세요（1日3回、食後に召し上がってください）」と言っています。',
      translation:
        'A: 薬剤師さん、この薬はどうやって飲みますか？\nB: 1日3回、食後に召し上がってください。',
      linkReview: {
        label: '第20課: 時期・順序（-(으)ㄴ 후에）',
        tab: 'textbook',
        id: 'lesson-20',
      },
    },
    {
      id: 'hk4-q20',
      questionNumber: 20,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、男性の次の行動として最も適切なものを選んでください。',
      audioText:
        '가: 지하철역이 어디에 있는지 아세요? 나: 저 사거리에서 오른쪽으로 가면 바로 보여요. 가: 감사합니다.',
      questionText: '男性はこの後どうしますか？',
      options: [
        '사거리에서 오른쪽으로 간다.',
        '사거리에서 왼쪽으로 간다.',
        '직진해서 계속 걷는다.',
        '버스를 타러 간다.',
      ],
      correctIndex: 0,
      score: 5,
      explanation:
        '「あの交差点で右に行けばすぐに見えます（저 사거리에서 오른쪽으로 가면 바로 보여요）」と案内されたため、交差点で右に進みます。',
      translation:
        'A: 地下鉄の駅がどこにあるかご存知ですか？\nB: あの交差点で右に行けばすぐ見えますよ。\nA: ありがとうございます。',
      linkReview: {
        label: '第14課: 方向の助詞（-(으)로）と道案内',
        tab: 'textbook',
        id: 'lesson-14',
      },
    },
  ],
};
