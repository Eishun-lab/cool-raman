// ==============================================================================
// 🎙️ Speak（スピック）韓国語 スピーキング・カリキュラム データ
// ==============================================================================

export interface SpeakLessonStep {
  type: 'concept' | 'speaking' | 'roleplay';
  title: string;
  subtitle?: string;
  tutorPhraseKo?: string;
  tutorPhraseReading?: string;
  tutorPhraseJa?: string;
  userPromptKo?: string;
  userPromptJa?: string;
  hint?: string;
  explanation?: string;
}

export interface SpeakLesson {
  id: string;
  unitId: number;
  lessonNumber: number;
  tutorName: string;
  tutorAvatar: string;
  bubblePrompt: string; // "簡単な相づちを打ってみましょう"
  keyPhrase: string; // "Sounds good!" / "괜찮아요!"
  keyPhraseJa: string; // "大丈夫です！ / いいですよ！"
  tag: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
  steps: SpeakLessonStep[];
}

export interface SpeakUnit {
  id: number;
  unitNumber: number;
  titleKo: string; // "처음 만나는 스픽"
  titleJa: string; // "はじめてのリアル韓国語スピーキング"
  description: string;
  lessons: SpeakLesson[];
}

export const SPEAK_UNITS: SpeakUnit[] = [
  {
    id: 1,
    unitNumber: 1,
    titleKo: '처음 만나는 스픽',
    titleJa: 'はじめてのリアル韓国語スピーキング',
    description: 'まずはこれだけ！日常で1日10回以上使う超重要リアクションと返事',
    lessons: [
      {
        id: 'u1_l1',
        unitId: 1,
        lessonNumber: 1,
        tutorName: 'ジヒョン',
        tutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bubblePrompt: '簡単な返事をしてみましょう',
        keyPhrase: '괜찮아요!',
        keyPhraseJa: '大丈夫ですよ！ / 結構です！',
        tag: '最頻出',
        isCurrent: true,
        steps: [
          {
            type: 'concept',
            title: 'ミニレッスン:「괜찮아요」の万能な使い方',
            tutorPhraseKo: '괜찮아요!',
            tutorPhraseReading: 'ケンチャナヨ',
            tutorPhraseJa: '大丈夫です！',
            explanation:
              '韓国人が毎日最も口にする言葉の一つ。「問題ない」「平気」「結構です（断り）」「いいですよ（承諾）」など、トーン次第であらゆる場面を救ってくれます。',
          },
          {
            type: 'speaking',
            title: '声に出して言ってみよう',
            subtitle: '相手を安心させるように、明るいトーンで発音してください',
            userPromptKo: '괜찮아요!',
            userPromptJa: '大丈夫です！',
            hint: 'ケンチャナヨ（「チャ」に少しアクセントを置く）',
          },
          {
            type: 'roleplay',
            title: '実戦会話ロールプレイ',
            subtitle: 'カフェで店員さんがお冷をこぼしそうになりました。声をかけてあげましょう。',
            tutorPhraseKo: '어머, 죄송합니다! 다치지 않으셨어요?',
            tutorPhraseReading: 'オモ、チェソンハムニダ！タチジ アヌショッソヨ？',
            tutorPhraseJa: 'あら、すみません！お怪我はありませんでしたか？',
            userPromptKo: '괜찮아요! 신경 쓰지 마세요.',
            userPromptJa: '大丈夫ですよ！お気になさらないでください。',
            hint: '「괜찮아요!」と笑顔で返してみましょう',
          },
        ],
      },
      {
        id: 'u1_l2',
        unitId: 1,
        lessonNumber: 2,
        tutorName: 'スジン',
        tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bubblePrompt: '相手の話に共感してみましょう',
        keyPhrase: '진짜요?!',
        keyPhraseJa: '本当ですか？！ / マジですか？！',
        tag: '相づち',
        steps: [
          {
            type: 'concept',
            title: 'ミニレッスン: 最高の相づち「진짜요?」',
            tutorPhraseKo: '진짜요?!',
            tutorPhraseReading: 'チンチャヨ？！',
            tutorPhraseJa: '本当ですか？！',
            explanation: '会話のテンポを生む魔法の相づち。語尾を上げると「えっ本当?!」、下げると「本当にね〜」と使い分けられます。',
          },
          {
            type: 'speaking',
            title: '声に出して言ってみよう',
            userPromptKo: '진짜요?! 대박!',
            userPromptJa: '本当ですか？！すごい！',
            hint: 'チンチャヨ？！テバク！',
          },
          {
            type: 'roleplay',
            title: '実戦会話ロールプレイ',
            tutorPhraseKo: '저 이번에 한국어 시험 만점 받았어요!',
            tutorPhraseReading: 'チョ イボネ ハングゴ シホム マンジョム パダッソヨ！',
            tutorPhraseJa: '私、今回の韓国語テスト満点取ったんですよ！',
            userPromptKo: '진짜요?! 대단해요!',
            userPromptJa: '本当ですか？！すごいです！',
          },
        ],
      },
      {
        id: 'u1_l3',
        unitId: 1,
        lessonNumber: 3,
        tutorName: 'ミンホ',
        tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bubblePrompt: '自分の意思をはっきり伝えましょう',
        keyPhrase: '좋아요!',
        keyPhraseJa: 'いいですね！ / 賛成です！',
        tag: '承諾',
        steps: [
          {
            type: 'concept',
            title: 'ミニレッスン: 即答の「좋아요!」',
            tutorPhraseKo: '좋아요!',
            tutorPhraseReading: 'チョアヨ！',
            tutorPhraseJa: 'いいですね！',
            explanation: '誘いや提案に対して、二つ返事で快諾するときに一番使われる表現です。',
          },
          {
            type: 'speaking',
            title: '声に出して言ってみよう',
            userPromptKo: '네, 좋아요!',
            userPromptJa: 'はい、いいですね！',
            hint: 'ネ、チョアヨ！',
          },
          {
            type: 'roleplay',
            title: '実戦会話ロールプレイ',
            tutorPhraseKo: '오늘 저녁에 삼겹살 먹으러 갈래요?',
            tutorPhraseReading: 'オヌル チョニョゲ サムギョプサル モグロ カルレヨ？',
            tutorPhraseJa: '今晩、サムギョプサル食べに行きませんか？',
            userPromptKo: '너무 좋아요! 가요!',
            userPromptJa: 'めっちゃいいですね！行きましょう！',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    unitNumber: 2,
    titleKo: '카페와 맛집에서 당당하게 주문하기',
    titleJa: 'カフェ＆飲食店で堂々と注文する',
    description: '指差し注文はもう卒業！カスタムや持ち帰りまでスラスラ言えるスピーキング',
    lessons: [
      {
        id: 'u2_l1',
        unitId: 2,
        lessonNumber: 1,
        tutorName: 'ユナ',
        tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bubblePrompt: 'カフェでドリンクを注文してみましょう',
        keyPhrase: '아이스 아메리카노 한 잔 주세요',
        keyPhraseJa: 'アイスアメリカーノ1杯ください',
        tag: '注文',
        steps: [
          {
            type: 'concept',
            title: 'ミニレッスン: 韓国カフェの定番注文スタイル',
            tutorPhraseKo: '아이스 아메리카노 한 잔 주세요.',
            tutorPhraseReading: 'アイス アメリカーノ ハン ジャン ジュセヨ',
            tutorPhraseJa: 'アイスアメリカーノ1杯ください。',
            explanation: '「〜 한 잔（1杯）주세요（ください）」。韓国では冬でも「アア（아아＝アイスアメリカーノ）」が大定番です。',
          },
          {
            type: 'speaking',
            title: '声に出して言ってみよう',
            userPromptKo: '아아 한 잔 테이크아웃이요.',
            userPromptJa: 'アア（アイスアメリカーノ）1杯テイクアウトで。',
            hint: 'アア ハンジャン テイクアウシヨ',
          },
          {
            type: 'roleplay',
            title: '実戦会話ロールプレイ',
            tutorPhraseKo: '주문 도와드릴까요? 드시고 가세요?',
            tutorPhraseReading: 'チュムン トワドゥリルッカヨ？ トゥシゴ カセヨ？',
            tutorPhraseJa: 'ご注文をお伺いします。店内でお召し上がりですか？',
            userPromptKo: '포장해 주세요. 아이스 라떼 하나요.',
            userPromptJa: '持ち帰りでお願いします。アイスラテ1つで。',
          },
        ],
      },
      {
        id: 'u2_l2',
        unitId: 2,
        lessonNumber: 2,
        tutorName: 'ソジュン',
        tutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bubblePrompt: '辛さやお会計を尋ねてみましょう',
        keyPhrase: '이거 많이 매워요?',
        keyPhraseJa: 'これ、結構辛いですか？',
        tag: '質問',
        steps: [
          {
            type: 'concept',
            title: 'ミニレッスン: 飲食店での必須フレーズ',
            tutorPhraseKo: '이거 많이 매워요?',
            tutorPhraseReading: 'イゴ マニ メウォヨ？',
            tutorPhraseJa: 'これ、結構辛いですか？',
            explanation: '韓国料理店で辛さを確認するときの定番。덜 맵게 해주세요（辛さ控えめにしてください）とセットで覚えましょう。',
          },
          {
            type: 'speaking',
            title: '声に出して言ってみよう',
            userPromptKo: '덜 맵게 해 주세요.',
            userPromptJa: '辛さ控えめにしてください。',
            hint: 'トル メプケ ヘ ジュセヨ',
          },
          {
            type: 'roleplay',
            title: '実戦会話ロールプレイ',
            tutorPhraseKo: '떡볶이 주문하셨죠? 기본맛도 좀 매콤한 편이에요.',
            tutorPhraseReading: 'トッポッキ チュムナショッチョ？ キボンマット チョム メコマンプルエヨ。',
            tutorPhraseJa: 'トッポッキをご注文ですね？基本の味でも少しピリ辛めですが大丈夫ですか？',
            userPromptKo: '아, 그럼 덜 맵게 해 주세요!',
            userPromptJa: 'あ、では辛さ控えめでお願いします！',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    unitNumber: 3,
    titleKo: '친구 사이 반말과 찐 리액션',
    titleJa: '友達同士のタメ口＆リアルリアクション',
    description: 'ドラマでよく聞く「マジで？」「ウケる」「どうしよう」を自然に口から出す特訓',
    lessons: [
      {
        id: 'u3_l1',
        unitId: 3,
        lessonNumber: 1,
        tutorName: 'ジヒョン',
        tutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bubblePrompt: '親しい友達へ挨拶してみましょう',
        keyPhrase: '밥 먹었어?',
        keyPhraseJa: 'ご飯食べた？（韓国の定番挨拶）',
        tag: '日常タメ口',
        steps: [
          {
            type: 'concept',
            title: 'ミニレッスン: 韓国文化の挨拶「ご飯食べた？」',
            tutorPhraseKo: '밥 먹었어?',
            tutorPhraseReading: 'パン モゴッソ？',
            tutorPhraseJa: 'ご飯食べた？',
            explanation: '文字通りご飯の確認だけでなく「元気？調子どう？」の意味で韓国人が誰にでも投げる愛の挨拶です。',
          },
          {
            type: 'speaking',
            title: '声に出して言ってみよう',
            userPromptKo: '응, 방금 먹었어! 넌?',
            userPromptJa: 'うん、さっき食べたよ！あんたは？',
            hint: 'ウン、パングム モゴッソ！ノン？',
          },
          {
            type: 'roleplay',
            title: '実戦会話ロールプレイ',
            tutorPhraseKo: '야! 오랜만이다! 밥은 먹고 다니냐?',
            tutorPhraseReading: 'ヤ！オレンマニダ！パブン モッコ タニニャ？',
            tutorPhraseJa: 'おーい！久しぶり！ちゃんとご飯食べてる？',
            userPromptKo: '당연하지! 오늘 맛있는 거 먹자!',
            userPromptJa: '当たり前でしょ！今日美味しいもの食べよ！',
          },
        ],
      },
    ],
  },
];

// フリー対話（AI Free Talk）のシナリオ定義
export interface SpeakFreeTalkScenario {
  id: string;
  title: string;
  titleKo: string;
  role: string;
  avatar: string;
  location: string;
  level: string;
  firstMessageKo: string;
  firstMessageReading: string;
  firstMessageJa: string;
  suggestedRepliesKo: string[];
}

export const SPEAK_FREETALK_SCENARIOS: SpeakFreeTalkScenario[] = [
  {
    id: 'cafe_order',
    title: '弘大（ホンデ）の話題のカフェで注文',
    titleKo: '홍대 핫플 카페에서 주문하기',
    role: '親切なカフェ店員',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'ソウル 弘大',
    level: '初級',
    firstMessageKo: '안녕하세요! 어서오세요. 주문 도와드릴까요?',
    firstMessageReading: 'アンニョンハセヨ！オソオセヨ。チュムン トワドゥリルッカヨ？',
    firstMessageJa: 'こんにちは！いらっしゃいませ。ご注文をお伺いしましょうか？',
    suggestedRepliesKo: [
      '아이스 아메리카노 한 잔 주세요.',
      '여기 시그니처 메뉴가 뭐예요?',
      '포장으로 부탁드려요.',
    ],
  },
  {
    id: 'street_food',
    title: '広蔵市場（クァンジャンシジャン）の屋台で注文',
    titleKo: '광장시장 포장마차 맛보기',
    role: '元気な屋台のおばちゃん（イモ）',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    location: 'ソウル 鍾路',
    level: '初級〜中級',
    firstMessageKo: '학생! 여기 와서 앉아! 마약김밥이랑 떡볶이 어때? 진짜 맛있어!',
    firstMessageReading: 'ハクセン！ヨギ ワソ アンジャ！マヤッキンバビラン トッポッキ オッテ？チンチャ マシッソ！',
    firstMessageJa: 'お兄さん/お姉さん！ここ座って！麻薬キンパとトッポッキどう？本当に美味しいよ！',
    suggestedRepliesKo: [
      '이모, 떡볶이 1인분 주세요!',
      '많이 매워요?',
      '오뎅 국물도 좀 주실 수 있어요?',
    ],
  },
  {
    id: 'kpop_friend',
    title: '韓国の友達とK-POPの推しトーク',
    titleKo: '한국 친구와 덕질 토크',
    role: 'K-POP好きの韓国人の友達',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'オンライン通話',
    level: '日常会話',
    firstMessageKo: '야! 이번 신곡 뮤비 봤어? 진짜 미쳤지 않아?!',
    firstMessageReading: 'ヤ！イボン シンゴッ ミュビ ボッソ？チンチャ ミチョッチ アナ？！',
    firstMessageJa: 'ねえ！今回の新曲MV見た？マジでヤバくない？！',
    suggestedRepliesKo: [
      '나도 봤어! 완전 대박이야!',
      '안무가 진짜 멋있더라.',
      '콘서트 티켓팅 언제야?',
    ],
  },
];
