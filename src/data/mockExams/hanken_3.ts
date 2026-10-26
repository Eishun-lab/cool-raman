import { MockExam } from '../../types/mockExam';

export const HANKEN_3_EXAM: MockExam = {
  id: 'hanken_3',
  category: 'hanken',
  levelName: '3級',
  title: 'ハングル検定 3級 模擬試験',
  badge: '中級前半',
  subtitle: '敬語体系・間接話法・身体慣用句・推量接続・複文対話の到達測定',
  targetLevel: 'ハングル検定 3級（合格基準 70点以上）/ CEFR B1',
  timeLimitSeconds: 1320, // 22分
  totalScore: 100,
  passScore: 70,
  questionCount: 20,
  overview:
    'ハングル能力検定協会（ハン検）3級の公式出題基準に完全準拠。尊敬語・謙譲語の敬語体系、4大間接話法（伝聞）、身体慣用句、推量・感情終結語尾、複文読解および電話や仕事のリスニング対話（計20問）で構成されています。',
  canDoList: [
    '尊敬接尾辞（-(으)시다）や特殊尊敬語・謙譲語を正しく使い分けられる',
    '平叙・疑問・勧誘・命令の4大間接話法（伝聞表現）を使いこなせる',
    '「눈이 높다（目が高い）」「귀가 얇다（耳が薄い・騙されやすい）」などの頻出慣用句を理解できる',
    '推量・配慮（-(으)ㄹ 텐데/테니까）や婉曲表現を用いて自然な対話ができる',
    '電話のやり取りや同僚との業務相談など、中級レベルのまとまった韓国語を聞き取れる',
  ],
  passCriteria: [
    {
      level: '3級 合格',
      minScore: 70,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: '見事合格！中級の骨格である敬語体系と間接話法をしっかりとマスターしました。次は準2級（ことわざ・四字熟語・使役受動）へステップアップしましょう！',
    },
    {
      level: '3級 不合格',
      minScore: 0,
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      description: '合格点（70点）まであと少し。敬語の謙譲表現や間接話法の縮約形、慣用句の語彙を教科書第21〜35課で復習して再挑戦しましょう。',
    },
  ],
  questions: [
    // -------------------------------------------------------------
    // 【敬語体系】第1問〜第4問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk3-q1',
      questionNumber: 1,
      section: 'grammar',
      sectionLabel: '【敬語体系】',
      instruction: '空欄に入る適切な特殊尊敬語を1つ選んでください。',
      passage: '할아버지께서는 지금 방에서 ( 　 ).（お祖父様は今部屋でお休みになっています）',
      options: ['자고 있어요', '주무시고 계세요', '자시고 계세요', '드시고 있어요'],
      correctIndex: 1,
      score: 5,
      explanation:
        '「寝る（자다）」の特殊尊敬語は「주무시다」です。さらに現在進行形の尊敬補助用言「-고 계시다」と合わさり、「주무시고 계세요（お休みになっています）」が正解です。',
      translation: 'お祖父様は今、部屋でお休みになっています。',
      linkReview: {
        label: '第24課: 敬語体系（特殊尊敬語と謙譲語）',
        tab: 'textbook',
        id: 'lesson-24',
      },
    },
    {
      id: 'hk3-q2',
      questionNumber: 2,
      section: 'grammar',
      sectionLabel: '【敬語体系】',
      instruction: '自分をへりくだる「謙譲語」として最も適切なものを1つ選んでください。',
      passage: '선생님, 내일 연구실로 ( 　 ).（先生、明日研究室へお伺いします）',
      options: ['갈게요', '만날게요', '찾아뵐게요', '보러 갈게요'],
      correctIndex: 2,
      score: 5,
      explanation:
        '目上の人を訪問して会う場合の謙譲語は「찾아뵙다（お訪ねしてお目にかかる）」です。意思表現「-(으)ㄹ게요」が付いて「찾아뵐게요」となります。',
      translation: '先生、明日研究室へお伺いします。',
      linkReview: {
        label: '第24課: 謙譲語（드리다 / 뵙다）',
        tab: 'textbook',
        id: 'lesson-24',
      },
    },
    {
      id: 'hk3-q3',
      questionNumber: 3,
      section: 'grammar',
      sectionLabel: '【敬語体系】',
      instruction: '与格助詞「〜に」の敬称として正しいものを1つ選んでください。',
      passage: '이 선물은 사장님( 　 ) 드릴 것입니다.（この贈り物は社長に差し上げるものです）',
      options: ['에게', '한테', '께', '더러'],
      correctIndex: 2,
      score: 5,
      explanation:
        '目上の対象に対する「〜に（与格）」は敬称助詞「께」を用います。「에게/한테」は一般的な相手に使います。',
      translation: 'このプレゼントは社長に差し上げるものです。',
      linkReview: {
        label: '第24課: 敬称助詞（께서, 께）',
        tab: 'textbook',
        id: 'lesson-24',
      },
    },
    {
      id: 'hk3-q4',
      questionNumber: 4,
      section: 'grammar',
      sectionLabel: '【敬語体系】',
      instruction: '文脈上、敬語の誤りを含む文を1つ選んでください。',
      options: [
        '선생님께서는 키가 크세요.',
        '저희 아버지는 집에 없으세요.',
        '할머니, 진지 잡수셨어요?',
        '교장 선생님께서 말씀하셨습니다.',
      ],
      correctIndex: 1,
      score: 5,
      explanation:
        '人の存在「いらっしゃる」には「계시다」を用います（✕ 없으세요 → ○ 안 계세요）。「없으시다」は目上の人の所有物・状態（お時間がない、心配がないなど）の間接敬語として使われます。',
      linkReview: {
        label: '第24課: 直接敬語（계시다）vs 間接敬語（있으시다）',
        tab: 'textbook',
        id: 'lesson-24',
      },
    },

    // -------------------------------------------------------------
    // 【間接話法】第5問〜第8問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk3-q5',
      questionNumber: 5,
      section: 'grammar',
      sectionLabel: '【間接話法】',
      instruction: '平叙文の間接話法（〜だと言っています）として正しいものを選んでください。',
      passage: '민수 씨가 내일 한국에 ( 　 ) 했어요.（ミンスさんが明日韓国に行くと言っていました）',
      options: ['간다고', '가자고', '가냐고', '가라고'],
      correctIndex: 0,
      score: 5,
      explanation:
        '動詞の現在形平叙文の間接話法は「-ㄴ/는다고 하다」です。「가다」はパッチムがないため「간다고 했어요」となります。',
      translation: 'ミンスさんが明日韓国へ行くと言っていました。',
      linkReview: {
        label: '第31課: 平叙文の間接話法（-다고 하다）',
        tab: 'textbook',
        id: 'lesson-31',
      },
    },
    {
      id: 'hk3-q6',
      questionNumber: 6,
      section: 'grammar',
      sectionLabel: '【間接話法】',
      instruction: '勧誘文の間接話法（〜しようと言いました）として正しいものを選んでください。',
      passage: '친구가 주말에 같이 콘서트에 ( 　 ) 했어요.（友達が週末に一緒にコンサートに行こうと言いました）',
      options: ['간다고', '가자고', '가라고', '가냐고'],
      correctIndex: 1,
      score: 5,
      explanation:
        '勧誘「〜しよう（-자）」の間接話法は「-자고 하다」です。「가자고 했어요」が正解です。',
      translation: '友達が週末に一緒にコンサートに行こうと言いました。',
      linkReview: {
        label: '第32課: 疑問・勧誘・命令の間接話法',
        tab: 'textbook',
        id: 'lesson-32',
      },
    },
    {
      id: 'hk3-q7',
      questionNumber: 7,
      section: 'grammar',
      sectionLabel: '【間接話法】',
      instruction: '命令文の間接話法（〜しろと言いました）として正しいものを選んでください。',
      passage: '의사 선생님이 약을 꼭 밥 먹은 후에 ( 　 ) 하셨어요.（お医者さんが薬を必ず食後に飲めとおっしゃいました）',
      options: ['먹으라고', '먹자고', '먹는다고', '먹냐고'],
      correctIndex: 0,
      score: 5,
      explanation:
        '命令「〜しなさい（-으세요 / -아/어라）」の間接話法は「-(으)라고 하다」です。動詞「먹다」に接続して「먹으라고 하셨어요」となります。',
      translation: 'お医者さんが薬を必ず食後に飲むようにおっしゃいました。',
      linkReview: {
        label: '第32課: 命令の間接話法（-(으)라고 하다）',
        tab: 'textbook',
        id: 'lesson-32',
      },
    },
    {
      id: 'hk3-q8',
      questionNumber: 8,
      section: 'grammar',
      sectionLabel: '【間接話法】',
      instruction: '口語の縮約形「〜ですって/〜だそうですよ（-대요）」として正しいものを選んでください。',
      passage: '오늘 날씨가 아주 ( 　 ).（今日の天気はとても寒いそうですよ）',
      options: ['춥대요', '추운데요', '춥재요', '추우래요'],
      correctIndex: 0,
      score: 5,
      explanation:
        '形容詞「춥다」の平叙文間接話法「춥다고 해요」が日常会話で縮約されると「춥대요（チュプテヨ）」となります。',
      translation: '今日の天気はとても寒いそうですよ。',
      linkReview: {
        label: '第33課: 間接話法の日常縮約形（-대요, -래요, -재요）',
        tab: 'textbook',
        id: 'lesson-33',
      },
    },

    // -------------------------------------------------------------
    // 【身体慣用句・語彙】第9問〜第12問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk3-q9',
      questionNumber: 9,
      section: 'vocab',
      sectionLabel: '【身体慣用句】',
      instruction: '「他人の言うことをすぐに信じて騙されやすい」という意味の慣用句を選んでください。',
      options: ['귀가 얇다', '눈이 높다', '입이 무겁다', '손이 크다'],
      correctIndex: 0,
      score: 5,
      explanation:
        '「귀가 얇다（耳が薄い）」は、他人の言葉に流されやすく、すぐに信じてしまう性格を表す頻出身体慣用句です。',
      linkReview: {
        label: '身体慣用句: 耳（귀）に関する重要表現',
        tab: 'chunks',
        id: 'idiom-1',
      },
    },
    {
      id: 'hk3-q10',
      questionNumber: 10,
      section: 'vocab',
      sectionLabel: '【身体慣用句】',
      instruction: '「秘密を絶対に人に漏らさない・口が堅い」を表す慣用句を選んでください。',
      options: ['입이 가볍다', '입이 무겁다', '입이 짧다', '입을 맞추다'],
      correctIndex: 1,
      score: 5,
      explanation:
        '「입이 무겁다（口が重い）」は口が堅いことを意味します。「입이 가볍다」は口が軽い、「입이 짧다」は小食・偏食です。',
      linkReview: {
        label: '身体慣用句: 口（입）に関する重要表現',
        tab: 'chunks',
        id: 'idiom-2',
      },
    },
    {
      id: 'hk3-q11',
      questionNumber: 11,
      section: 'vocab',
      sectionLabel: '【身体慣用句】',
      instruction: '空欄に入る適切な身体部位の単語を選んでください。',
      passage: '그 사람은 아는 사람이 많아서 ( 　 )이/가 아주 넓어요.（あの人は知り合いが多くて顔が広いです）',
      options: ['손', '발', '눈', '얼굴'],
      correctIndex: 1,
      score: 5,
      explanation:
        '日本語の「顔が広い」に該当する韓国語は「발이 넓다（足が広い）」です。日本語と異なる身体部位を使うため、検定で非常によく狙われます。',
      translation: 'あの人は知人が多くて顔（足）がとても広いです。',
      linkReview: {
        label: '身体慣用句: 足（발）に関する重要表現',
        tab: 'chunks',
        id: 'idiom-3',
      },
    },
    {
      id: 'hk3-q12',
      questionNumber: 12,
      section: 'vocab',
      sectionLabel: '【中級副詞】',
      instruction: '文脈に最も合う中級副詞を1つ選んでください。',
      passage: '서두르지 않으면 ( 　 ) 비행기를 놓칠지도 몰라요.（急がないともしかすると飛行機に乗り遅れるかもしれません）',
      options: ['자칫', '과연', '차마', '하마터면'],
      correctIndex: 0,
      score: 5,
      explanation:
        '「자칫（ややもすると、もしかすると）」は、不都合な結果を引き起こしかねない状況を表します。「하마터면」は過去の危うい事態（하마터면 ~을 뻔했다）と共起します。',
      translation: '急がないと、ともすると飛行機に乗り遅れるかもしれません。',
      linkReview: {
        label: '第28課: 中級必須副詞と呼応',
        tab: 'textbook',
        id: 'lesson-28',
      },
    },

    // -------------------------------------------------------------
    // 【中級接続・読解】第13問〜第16問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk3-q13',
      questionNumber: 13,
      section: 'grammar',
      sectionLabel: '【中級接続】',
      instruction: '推量・配慮を表す語尾「-(으)ㄹ 텐데」の使い方として最も適切なものを選んでください。',
      passage: '하루 종일 걸어서 많이 ( 　 ) 좀 쉬세요.（一日中歩いてとてもお疲れでしょうから、少し休んでください）',
      options: ['피곤할 텐데', '피곤할망정', '피곤하느니', '피곤한 탓에'],
      correctIndex: 0,
      score: 5,
      explanation:
        '「-(으)ㄹ 텐데」は話し手の強い推量を前提として、相手への配慮や提案を後件に導く表現です。「피곤할 텐데（お疲れでしょうから）」が最適です。',
      translation: '一日中歩いてとてもお疲れでしょうから、少し休んでください。',
      linkReview: {
        label: '第36課: 推量・配慮（-(으)ㄹ 텐데 / 테니까）',
        tab: 'textbook',
        id: 'lesson-36',
      },
    },
    {
      id: 'hk3-q14',
      questionNumber: 14,
      section: 'grammar',
      sectionLabel: '【中級接続】',
      instruction: '空欄に入る適切な接続語尾を選んでください。',
      passage: '책을 ( 　 ) 음악을 듣는 습관이 있습니다.（本を読みながら音楽を聴く習慣があります）',
      options: ['읽으면서', '읽다가', '읽더니', '읽느라고'],
      correctIndex: 0,
      score: 5,
      explanation:
        '同一の主体が2つの動作を同時に行う「〜しながら」は「-(으)면서」です。',
      translation: '本を読みながら音楽を聴く習慣があります。',
      linkReview: {
        label: '第22課: 同時進行（-(으)면서）',
        tab: 'textbook',
        id: 'lesson-22',
      },
    },
    {
      id: 'hk3-q15',
      questionNumber: 15,
      section: 'reading',
      sectionLabel: '【短文読解】',
      instruction: '次の文章を読んで、筆者が言いたいこととして最も適切なものを1つ選んでください。',
      passage:
        '건강을 유지하기 위해서는 규칙적인 식사와 운동이 필수적이다. 특히 바쁜 현대인들은 아침을 거르기 쉬운데, 하루를 활기차게 시작하려면 아침 식사를 꼭 챙겨 먹어야 한다.',
      questionText: '筆者の主張は何ですか？',
      options: [
        '운동을 무리하게 하지 말아야 한다.',
        '아침 식사를 반드시 챙겨 먹어야 한다.',
        '바쁜 현대인은 식사를 줄여야 한다.',
        '점심을 많이 먹는 것이 중요하다.',
      ],
      correctIndex: 1,
      score: 5,
      explanation:
        '文章の後半で「하루를 활기차게 시작하려면 아침 식사를 꼭 챙겨 먹어야 한다（一日を活気よく始めるには朝食を必ず食べるべきだ）」と明確に述べられています。',
      translation:
        '健康を維持するためには規則的な食事と運動が不可欠である。特に忙しい現代人は朝食を抜きがちだが、一日を活気よく始めるためには朝食を必ずしっかり食べるべきである。',
      linkReview: {
        label: '第27課: 義務・当為（-아야/어야 하다）の論述読解',
        tab: 'textbook',
        id: 'lesson-27',
      },
    },
    {
      id: 'hk3-q16',
      questionNumber: 16,
      section: 'reading',
      sectionLabel: '【短文読解】',
      instruction: '次の文章の空欄に入る最も適切な文尾を選んでください。',
      passage:
        '한국 여행 중에 길을 잃어버려서 당황했는데, 지나가던 친절한 대학생이 목적지까지 직접 데려다주었다. 그 학생의 따뜻한 배려 덕분에 한국에 대한 좋은 인상을 ( 　 ).',
      options: ['받게 되었다', '줄 뻔했다', '버릴 셈이다', '잃을 지경이다'],
      correctIndex: 0,
      score: 5,
      explanation:
        '「〜のおかげで（덕분에）」に呼応し、状況の変化・結果を表す「良い印象を受けることになった（받게 되었다）」が入るのが最も論理的です。',
      translation:
        '韓国旅行中に道に迷って慌てたが、通りがかった親切な大学生が目的地まで直接連れて行ってくれた。その学生の温かい配慮のおかげで、韓国に対する良い印象を受けることになった。',
      linkReview: {
        label: '第29課: 被動・結果状態（-게 되다）',
        tab: 'textbook',
        id: 'lesson-29',
      },
    },

    // -------------------------------------------------------------
    // 【聞き取り音声】第17問〜第20問（各5点）
    // -------------------------------------------------------------
    {
      id: 'hk3-q17',
      questionNumber: 17,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、女性が電話をかけた「目的」を選んでください。',
      audioText:
        '여: 여보세요, 김 과장님. 죄송하지만 제가 오늘 갑자기 몸살이 심해서 출근을 못 할 것 같습니다. 남: 그래요? 걱정하지 말고 병원 다녀와서 푹 쉬세요.',
      questionText: '女性が電話をかけた用件は何ですか？',
      options: [
        '출근 시간을 늦추려고',
        '결근을 보고하려고',
        '병원 위치를 물어보려고',
        '회의 일정을 변경하려고',
      ],
      correctIndex: 1,
      score: 5,
      explanation:
        '女性は「体調が悪くて出勤できない（출근을 못 할 것 같습니다）」と欠勤を報告（결근 보고）しています。',
      translation:
        '女: もしもし、キム課長。申し訳ありませんが、今日突然体調がひどく悪く、出勤できそうにありません。\n男: そうですか？心配せず病院に行ってゆっくり休んでください。',
      linkReview: {
        label: '第34課: 職場電話対話と婉曲（-(으)ㄴ/는 것 같다）',
        tab: 'textbook',
        id: 'lesson-34',
      },
    },
    {
      id: 'hk3-q18',
      questionNumber: 18,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、会話の後に二人がすることを選んでください。',
      audioText:
        '남: 민희 씨, 회의 자료 준비 다 끝났어요? 여: 네, 거의 다 됐는데 복사만 남았어요. 남: 그럼 복사는 제가 할 테니까 민희 씨는 회의실 정리를 좀 해 주세요. 여: 알겠습니다.',
      questionText: '男性が次に行う作業は何ですか？',
      options: ['자료 복사', '회의실 정리', '보고서 작성', '컴퓨터 수리'],
      correctIndex: 0,
      score: 5,
      explanation:
        '男性は「コピーは私がしますから（복사는 제가 할 테니까）」と言っています。',
      translation:
        '男: ミニさん、会議資料の準備は終わりましたか？\n女: はい、ほぼ終わってコピーだけ残っています。\n男: ではコピーは僕がやるので、ミニさんは会議室の片付けをお願いします。\n女: わかりました。',
      linkReview: {
        label: '第36課: 意志・提案（-(으)ㄹ 테니까）',
        tab: 'textbook',
        id: 'lesson-36',
      },
    },
    {
      id: 'hk3-q19',
      questionNumber: 19,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、内容と一致するものを1つ選んでください。',
      audioText:
        '여: 손님, 주문하신 아이스 아메리카노 두 잔 나왔습니다. 남: 저, 제가 텀블러를 가져왔는데 할인 적용됐나요? 여: 아, 죄송합니다. 다시 계산해 드리겠습니다.',
      questionText: '会話の内容と一致するものはどれですか？',
      options: [
        '손님은 따뜻한 커피를 주문했다.',
        '텀블러 할인이 처음에 누락되었다.',
        '손님은 텀블러를 가져오지 않았다.',
        '직원은 할인이 불가능하다고 말했다.',
      ],
      correctIndex: 1,
      score: 5,
      explanation:
        'タンブラー割引が適用されたか聞かれ、店員が「申し訳ありません、再計算します」と謝罪しているため、最初は割引が抜けていました。',
      translation:
        '女: お客様、ご注文のアイスアメリカーノ2杯できました。\n男: あの、タンブラーを持参したのですが割引は適用されていますか？\n女: あ、申し訳ありません。再計算いたします。',
      linkReview: {
        label: '第25課: 日常カフェ実戦対話と謙譲（해 드리다）',
        tab: 'textbook',
        id: 'lesson-25',
      },
    },
    {
      id: 'hk3-q20',
      questionNumber: 20,
      section: 'listening',
      sectionLabel: '【聞き取り】',
      instruction: '音声を聞いて、男性の心情として最も適切なものを選んでください。',
      audioText:
        '여: 시험 결과 나왔어요? 남: 네, 1점 차이로 떨어졌더라고요. 지난달에 조금만 더 열심히 공부할 걸 그랬어요.',
      questionText: '男性の現在の気持ちはどれですか？',
      options: ['후회스럽다（後悔している）', '자랑스럽다（誇らしい）', '기쁘다（嬉しい）', '안도하다（安心している）'],
      correctIndex: 0,
      score: 5,
      explanation:
        '「1点差で落ちてしまった、もう少し一生懸命勉強すればよかった（-ㄹ 걸 그랬다）」と後悔を述べています。',
      translation:
        '女: 試験の結果出ましたか？\n男: ええ、1点差で落ちていたんですよ。先月もうちょっと勉強すればよかったと後悔しています。',
      linkReview: {
        label: '第35課: 後悔表現（-(으)ㄹ 걸 그랬다）',
        tab: 'textbook',
        id: 'lesson-35',
      },
    },
  ],
};
