import { MockExam } from '../../types/mockExam';

export const HANKEN_4_EXAM: MockExam = {
  id: 'hanken_4',
  category: 'hanken',
  levelName: '4級',
  title: 'ハングル検定 4級 公式模擬試験',
  badge: '初級完成',
  subtitle: '音変化・不規則活用・過去形・理由・依頼・日常会話の到達測定',
  targetLevel: 'ハングル検定 4級（合格基準 60点以上）/ CEFR A1+〜A2',
  timeLimitSeconds: 1200, // 20分
  totalScore: 100,
  passScore: 60,
  questionCount: 25,
  overview:
    'ハングル能力検定協会 4級基準に完全準拠。鼻音化・流音化などの音変化、ㄷ・ㅂ・르変則などの不規則活用、理由・条件・意図の接続語尾、尊敬語、および聞き取り（計25問・各4点・100点満点）で構成されています。',
  canDoList: [
    '鼻音化、流音化、激音化、口蓋音化などの主要な音変化を正確に発音・識別できる',
    'ㄷ変則、ㅂ変則、르変則、ㅡ脱落などの用言活用を瞬時に変換できる',
    '過去（-았/었어요）、未来（-(으)ㄹ 거예요）、可能（-(으)ㄹ 수 있다）の時制と助動詞を使いこなせる',
    '理由（-아서/어서 vs -(으)니까）や条件（-(으)면）の制約を正しく使い分けられる',
    '病院、駅、買い物、約束など、日常生活に必要な対話文を聞き取って意図を把握できる',
  ],
  passCriteria: [
    {
      level: '4級 合格',
      minScore: 60,
      color: 'bg-[#FAF0EC] text-[#B84E34] border-[#F0D5CD]',
      description: '見事合格！初級文法と不規則活用の重要関門を突破しました。次は3級（敬語体系・間接話法・慣用句）へステップアップしましょう！',
    },
    {
      level: '4級 不合格',
      minScore: 0,
      color: 'bg-stone-100 text-stone-700 border-stone-300',
      description: 'あと少し！失点しやすい不規則活用（ㄷ・ㅂ・르）と理由表現（-아서/어서 vs -(으)니까）を教科書で重点復習しましょう。',
    },
  ],
  questions: [
    // -------------------------------------------------------------
    // 【発音・音変化】第1問〜第5問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q1',
      questionNumber: 1,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '<u>국물</u>（スープ）の発音はどれですか？',
      options: ['[국물]', '[궁물]', '[군물]', '[국늘]'],
      correctIndex: 1,
      score: 4,
      explanation:
        'パッチム「ㄱ」の直後に鼻音「ㅁ」が続くため、パッチム「ㄱ」が同じ調音位置の鼻音「ㅇ」に変化する「鼻音化」が起こり、[궁물]（クンムル）と発音されます。',
      linkReview: {
        label: '第1課: 音変化7大ルール（鼻音化）',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },
    {
      id: 'hk4-q2',
      questionNumber: 2,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '<u>연락</u>（連絡）の発音はどれですか？',
      options: ['[연락]', '[열락]', '[연낙]', '[열낙]'],
      correctIndex: 1,
      score: 4,
      explanation:
        'パッチム「ㄴ」と初声「ㄹ」が隣り合うため、両方とも流音「ㄹ」に同化する「流音化」が起こり、[열락]（ヨルラク）と発音されます。',
      linkReview: {
        label: '第1課: 音変化7大ルール（流音化）',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },
    {
      id: 'hk4-q3',
      questionNumber: 3,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '<u>축하</u>（お祝い）の発音はどれですか？',
      options: ['[추카]', '[축하]', '[추가]', '[충하]'],
      correctIndex: 0,
      score: 4,
      explanation:
        '平音「ㄱ」と「ㅎ」が合体して激音「ㅋ」に変わる「激音化」が起こり、[추카]（チュカ）と発音されます。',
      linkReview: {
        label: '第1課: 音変化7大ルール（激音化）',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },
    {
      id: 'hk4-q4',
      questionNumber: 4,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '<u>같이</u>（一緒に）の発音はどれですか？',
      options: ['[가티]', '[가치]', '[갇이]', '[가디]'],
      correctIndex: 1,
      score: 4,
      explanation:
        'パッチム「ㅌ」の直後に母音「이」が来ると、舌の調音位置が硬口蓋に移り「ㅊ」に変化する「口蓋音化」が起こり、[가치]（カチ）と発音されます。',
      linkReview: {
        label: '第23課: 提案・勧誘・会話体',
        tab: 'textbook',
        id: 'lesson-23',
      },
    },
    {
      id: 'hk4-q5',
      questionNumber: 5,
      section: 'pronunciation',
      sectionLabel: '【発音・音変化】',
      instruction: '下線部の単語の発音として最も適切なものを1つ選んでください。',
      questionText: '<u>식당</u>（食堂）の発音はどれですか？',
      options: ['[식당]', '[식땅]', '[신당]', '[싱당]'],
      correctIndex: 1,
      score: 4,
      explanation:
        'パッチム「ㄱ」の後ろに平音「ㄷ」が続くため、息を詰めて強く発音する「濃音化」が起こり、[식땅]（シクタン）と発音されます。',
      linkReview: {
        label: '第1課: 音変化7大ルール（濃音化）',
        tab: 'textbook',
        id: 'lesson-1',
      },
    },

    // -------------------------------------------------------------
    // 【語彙・反意語・慣用表現】第6問〜第10問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q6',
      questionNumber: 6,
      section: 'vocab',
      sectionLabel: '【語彙・反意語】',
      instruction: '下線部の反意語（反対の意味の言葉）として適切なものを選んでください。',
      questionText: '한국어 시험이 <u>어려워요</u>.（韓国語の試験が難しいです）',
      options: ['쉬워요', '나빠요', '가벼워요', '차가워요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '「어렵다（難しい）」の反対語は「쉽다（易しい）」で、ㅂ変則活用により「쉬워요（シウォヨ）」となります。',
      linkReview: {
        label: '第26課: 逆接と前置き',
        tab: 'textbook',
        id: 'lesson-26',
      },
    },
    {
      id: 'hk4-q7',
      questionNumber: 7,
      section: 'vocab',
      sectionLabel: '【語彙・類義語】',
      instruction: '下線部と意味が最も近い単語を1つ選んでください。',
      questionText: '저는 한국 노래를 <u>항상</u> 들어요.（私は韓国の歌をいつも聴きます）',
      options: ['가끔', '언제나', '별로', '전혀'],
      correctIndex: 1,
      score: 4,
      explanation:
        '「항상（いつも・常に）」の類義語は「언제나（いつも）」です。가끔は時々、별로はあまり、전혀は全くです。',
      linkReview: {
        label: '第16課: ㄷ変則と日常副詞',
        tab: 'textbook',
        id: 'lesson-16',
      },
    },
    {
      id: 'hk4-q8',
      questionNumber: 8,
      section: 'vocab',
      sectionLabel: '【語彙・慣用表現】',
      instruction: '空欄に入る最も適切な身体語彙表現を1つ選んでください。',
      passage: '아침부터 아무것도 안 먹어서 ( 　 ).（朝から何も食べていないのでお腹が空きました）',
      options: ['배가 고파요', '목이 말라요', '머리가 아파요', '눈이 높아요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '空腹を表す慣用表現は「배가 고프다（お腹が空く）」のヘヨ体「배가 고파요（ペガ コパヨ）」です。목이 마르다は喉が渇くです。',
      linkReview: {
        label: '第14課: 理由・原因',
        tab: 'textbook',
        id: 'lesson-14',
      },
    },
    {
      id: 'hk4-q9',
      questionNumber: 9,
      section: 'vocab',
      sectionLabel: '【語彙・接続詞】',
      instruction: '文脈に最も合う接続副詞を1つ選んでください。',
      passage: '어제 비가 많이 왔어요. ( 　 ) 집에만 있었어요.（昨日雨がたくさん降りました。だから家にだけいました）',
      options: ['하지만', '그래서', '그런데', '그래도'],
      correctIndex: 1,
      score: 4,
      explanation:
        '前文が原因・理由、後文がその結果を表す順接関係なので、「だから・それで」を意味する「그래서（クレソ）」が入ります。',
      linkReview: {
        label: '第26課: 逆接と接続詞',
        tab: 'textbook',
        id: 'lesson-26',
      },
    },
    {
      id: 'hk4-q10',
      questionNumber: 10,
      section: 'vocab',
      sectionLabel: '【語彙・交通】',
      instruction: '空欄に入る適切な交通動詞を1つ選んでください。',
      passage: '서울역에서 지하철 4호선으로 ( 　 ).（ソウル駅で地下鉄4号線に乗り換えます）',
      options: ['갈아타요', '내려요', '기다려요', '출발해요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '乗り換えを表す動詞は「갈아타다（乗り換える）」で、ヘヨ体は「갈아타요（カラタヨ）」です。내리다は降りるです。',
      linkReview: {
        label: '第15課: 交通と日常行動',
        tab: 'textbook',
        id: 'lesson-15',
      },
    },

    // -------------------------------------------------------------
    // 【助詞・接続語尾】第11問〜第15問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q11',
      questionNumber: 11,
      section: 'grammar',
      sectionLabel: '【助詞・比較】',
      instruction: '空欄に入る適切な比較助詞を1つ選んでください。',
      passage: '비행기가 기차( 　 ) 훨씬 빨라요.（飛行機が列車よりずっと速いです）',
      options: ['보다', '처럼', '만큼', '마저'],
      correctIndex: 0,
      score: 4,
      explanation:
        '比較の基準となる「〜より」には助詞「보다（ポダ）」を用います。',
      translation: '飛行機が列車よりずっと速いです。',
      linkReview: {
        label: '第24課: 比較・最上級・程度',
        tab: 'textbook',
        id: 'lesson-24',
      },
    },
    {
      id: 'hk4-q12',
      questionNumber: 12,
      section: 'grammar',
      sectionLabel: '【接続語尾・理由】',
      instruction: '空欄に入る最も自然な理由の語尾を選んでください。',
      passage: '약속 시간에 늦( 　 ) 정말 죄송합니다.（約束の時間に遅れて本当に申し訳ありません）',
      options: ['어서', '으니까', '어서야', '으므로'],
      correctIndex: 0,
      score: 4,
      explanation:
        '謝罪や感謝の理由には「-(으)니까」ではなく必ず「-아서/어서」を用います。「늦다」の語幹「늦-」は陰母音なので「늦어서 죄송합니다」となります。',
      translation: '約束の時間に遅れて本当に申し訳ありません。',
      linkReview: {
        label: '第14課: 理由・原因（-아/어서 vs -(으)니까）',
        tab: 'textbook',
        id: 'lesson-14',
      },
    },
    {
      id: 'hk4-q13',
      questionNumber: 13,
      section: 'grammar',
      sectionLabel: '【接続語尾・条件】',
      instruction: '空欄に入る適切な条件表現を選んでください。',
      passage: '내일 시간( 　 ) 같이 영화 보러 가요.（明日時間があれば一緒に映画を見に行きましょう）',
      options: ['이 있으면', '이 있어서', '을 있으면', '을 있어서'],
      correctIndex: 0,
      score: 4,
      explanation:
        '「時間がある」は「시간이 있다」であり、条件の語尾「-(으)면」が接続して「시간이 있으면（時間があれば）」となります。後ろが勧誘文のため-아서/어서は使えません。',
      translation: '明日時間があれば一緒に映画を見に行きましょう。',
      linkReview: {
        label: '第25課: 条件・仮定・選択',
        tab: 'textbook',
        id: 'lesson-25',
      },
    },
    {
      id: 'hk4-q14',
      questionNumber: 14,
      section: 'grammar',
      sectionLabel: '【接続語尾・目的】',
      instruction: '空欄に入る適切な目的語尾を選んでください。',
      passage: '서점에 한국어 책을 사( 　 ) 가요.（書店に韓国語の本を買いに行きます）',
      options: ['러', '려고', '면서', '자마자'],
      correctIndex: 0,
      score: 4,
      explanation:
        '移動動詞（가다/오다）とともに使って「〜しに行く」という目的を表すのは「-(으)러」です。語幹「사-」にパッチムがないため「사러 가요」となります。',
      translation: '書店に韓国語の本を買いに行きます。',
      linkReview: {
        label: '第22課: 意図・目的',
        tab: 'textbook',
        id: 'lesson-22',
      },
    },
    {
      id: 'hk4-q15',
      questionNumber: 15,
      section: 'grammar',
      sectionLabel: '【助詞・限定】',
      instruction: '「〜しかありません」という限定表現として正しいものを1つ選んでください。',
      passage: '지갑에 천 원( 　 ).（財布に千ウォンしかありません）',
      options: ['밖에 없어요', '만 없어요', '밖에 있어요', '만 있어요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '「〜しか」を表す助詞「밖에」は、後ろに必ず「없다」「모르다」などの否定形が続きます。「천 원밖에 없어요」が正解です。',
      translation: '財布に千ウォンしかありません。',
      linkReview: {
        label: '第8課: 否定表現',
        tab: 'textbook',
        id: 'lesson-8',
      },
    },

    // -------------------------------------------------------------
    // 【活用・敬語・実戦会話】第16問〜第20問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q16',
      questionNumber: 16,
      section: 'grammar',
      sectionLabel: '【活用・ㄷ変則】',
      instruction: '動詞「듣다（聞く）」のヘヨ体過去形として正しいものを1つ選んでください。',
      options: ['들었어요', '듣었어요', '들았어요', '듣았어요'],
      correctIndex: 0,
      score: 4,
      explanation:
        'ㄷ変則動詞は母音が続く活用でパッチム「ㄷ」が「ㄹ」に変化します。「듣다」の母音「ㅡ」は陰母音なので「-었어요」が付き、「들었어요（トゥロッソヨ）」となります。',
      linkReview: {
        label: '第16課: ㄷ変則 ＆ ㄹ脱落',
        tab: 'textbook',
        id: 'lesson-16',
      },
    },
    {
      id: 'hk4-q17',
      questionNumber: 17,
      section: 'grammar',
      sectionLabel: '【活用・ㅂ変則】',
      instruction: '形容詞「춥다（寒い）」のヘヨ体現在形として正しいものを1つ選んでください。',
      options: ['추워요', '춥어요', '추와요', '추바요'],
      correctIndex: 0,
      score: 4,
      explanation:
        'ㅂ変則用言は母音が続く活用でパッチム「ㅂ」が「우」に変化します。「추- + 우 + 어요」が縮約して「추워요（チュウォヨ）」となります。',
      linkReview: {
        label: '第18課: 7大不規則活用完全攻略',
        tab: 'textbook',
        id: 'lesson-18',
      },
    },
    {
      id: 'hk4-q18',
      questionNumber: 18,
      section: 'grammar',
      sectionLabel: '【活用・르変則】',
      instruction: '動詞「모르다（知らない）」のヘヨ体現在形として正しいものを1つ選んでください。',
      options: ['몰라요', '모라요', '모르러요', '몰러요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '르変則動詞は母音が続く活用で「ㅡ」が脱落し、直前の音節に「ㄹ」パッチムが入り、語幹末に「라/러」が付きます。「모르다 ➔ 몰라요（モルラヨ）」が正解です。',
      linkReview: {
        label: '第17課: 르変則 ＆ ㅅ変則',
        tab: 'textbook',
        id: 'lesson-17',
      },
    },
    {
      id: 'hk4-q19',
      questionNumber: 19,
      section: 'grammar',
      sectionLabel: '【敬語・主体尊敬】',
      instruction: '空欄に入る適切な尊敬語尾を選んでください。',
      passage: '선생님께서 지금 책을 ( 　 ).（先生が今本をお読みになっています）※原形: 읽다',
      options: ['읽으세요', '읽으셔요', '읽어요', '읽으십니다'],
      correctIndex: 0,
      score: 4,
      explanation:
        '目上の人の動作には尊敬接尾辞「-(으)시-」を用います。「읽다」はパッチムがあるため「-으세요」が付き、「읽으세요（イルグセヨ）」となります。',
      translation: '先生が今本をお読みになっています。',
      linkReview: {
        label: '第15課: 依頼・敬語',
        tab: 'textbook',
        id: 'lesson-15',
      },
    },
    {
      id: 'hk4-q20',
      questionNumber: 20,
      section: 'vocab',
      sectionLabel: '【実戦会話・挨拶】',
      instruction: '仕事や作業を終えて先に帰る相手に対する挨拶として最も適切なものを選んでください。',
      options: ['수고하셨습니다', '실례하겠습니다', '다녀오겠습니다', '어서 오세요'],
      correctIndex: 0,
      score: 4,
      explanation:
        '相手の労をねぎらう表現は「수고하셨습니다（お疲れ様でした）」です。',
      linkReview: {
        label: '第2課: 挨拶とマナー',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },

    // -------------------------------------------------------------
    // 【聞き取り・リスニング】第21問〜第25問（各4点）
    // -------------------------------------------------------------
    {
      id: 'hk4-q21',
      questionNumber: 21,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、女性の現在の体調（症状）を選んでください。',
      audioText: '가: 어디가 아프세요? 나: 어제부터 머리가 아프고 열이 많이 나요.',
      questionText: '女性の症状として合致するものはどれですか？',
      options: [
        '頭が痛くて熱がある',
        'お腹が痛くて下痢をしている',
        '咳が出て喉が痛い',
        '足に怪我をした',
      ],
      correctIndex: 0,
      score: 4,
      explanation:
        '女性は「머리가 아프고（頭が痛くて） 열이 많이 나요（熱がたくさん出ます）」と言っています。',
      translation: 'A: どこが痛いですか？\nB: 昨日から頭が痛くて熱がたくさん出ます。',
      linkReview: {
        label: '第11課: 並列（-고）と身体症状',
        tab: 'textbook',
        id: 'lesson-11',
      },
    },
    {
      id: 'hk4-q22',
      questionNumber: 22,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、男性が市役所へ行くために利用する交通手段を選んでください。',
      audioText: '가: 시청에 어떻게 가요? 나: 저기서 지하철 1호선을 타세요. 세 정거장만 가면 돼요.',
      questionText: '男性が利用する交通手段はどれですか？',
      options: ['지하철（地下鉄）', '버스（バス）', '택시（タクシー）', '자전거（自転車）'],
      correctIndex: 0,
      score: 4,
      explanation:
        '「지하철 1호선을 타세요（地下鉄1号線に乗ってください）」と案内されているため、正解は地下鉄です。',
      translation: 'A: 市役所にどうやって行きますか？\nB: あそこで地下鉄1号線に乗ってください。3駅行くだけでいいです。',
      linkReview: {
        label: '第15課: 案内と移動手段',
        tab: 'textbook',
        id: 'lesson-15',
      },
    },
    {
      id: 'hk4-q23',
      questionNumber: 23,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、二人が会う「曜日」を選んでください。',
      audioText: '가: 이번 주 토요일에 만날까요? 나: 미안해요, 토요일은 가족 약속이 있어요. 일요일은 어때요? 가: 좋아요, 일요일에 만나요.',
      questionText: '二人が会う曜日はいつですか？',
      options: ['일요일（日曜日）', '토요일（土曜日）', '금요일（金曜日）', '월요일（月曜日）'],
      correctIndex: 0,
      score: 4,
      explanation:
        '土曜日は家族の約束があるため断り、「일요일은 어때요? 좋아요, 일요일에 만나요」と日曜日で合意しています。',
      translation: 'A: 今週土曜日に会いましょうか？\nB: ごめんなさい、土曜日は家族の約束があります。日曜日はどうですか？\nA: いいですね、日曜日に会いましょう。',
      linkReview: {
        label: '第23課: 提案と約束の会話',
        tab: 'textbook',
        id: 'lesson-23',
      },
    },
    {
      id: 'hk4-q24',
      questionNumber: 24,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、男性がこの後すぐに行う行動を選んでください。',
      audioText: '가: 손님, 찾으시는 옷이 있으세요? 나: 네, 이 바지 입어봐도 돼요? 가: 그럼요, 저쪽 탈의실을 이용하세요.',
      questionText: '男性がこの後行う行動はどれですか？',
      options: ['ズボンを試着する', '服を返品する', '会計をする', '店を出る'],
      correctIndex: 0,
      score: 4,
      explanation:
        '男性は「이 바지 입어봐도 돼요?（このズボンを着てみてもいいですか？）」と聞き、更衣室を案内されているため「試着する」が正解です。',
      translation: '店員: お客様、お探しの服はございますか？\n客: はい、このズボン試着してみてもいいですか？\n店員: もちろんです、あちらの更衣室をご利用ください。',
      linkReview: {
        label: '第20課: 試みと許可（-아/어 보다, -아/어도 되다）',
        tab: 'textbook',
        id: 'lesson-20',
      },
    },
    {
      id: 'hk4-q25',
      questionNumber: 25,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、相手の発言に対する最も自然な応答を1つ選んでください。',
      audioText: '민수 씨, 주말 잘 보내세요!',
      questionText: '相手の言葉に対する返答として最も自然なものはどれですか？',
      options: [
        '네, 수진 씨도 주말 잘 보내세요.',
        '아니요, 주말이 없어요.',
        '네, 처음 뵙겠습니다.',
        '감사하지만 안 가요.',
      ],
      correctIndex: 0,
      score: 4,
      explanation:
        '「ミンスさん、良い週末をお過ごしください！」と言われたので、「はい、スジンさんも良い週末をお過ごしください（네, 수진 씨도 주말 잘 보내세요）」と返すのが最も自然です。',
      translation: '音声: 「ミンスさん、良い週末をお過ごしください！」\n答え: 「はい、スジンさんも良い週末をお過ごしください。」',
      linkReview: {
        label: '第2課: 週末の挨拶表現',
        tab: 'textbook',
        id: 'lesson-2',
      },
    },
  ],
};
