// ソウル＆韓国 8大探訪ワールドマップ データ（Duolingo × LingoDeer風 世界観定義）

export interface CultureTreasureCard {
  id: string;
  slangKo: string;
  slangReading: string;
  meaningJa: string;
  originKo: string;
  description: string;
  exampleKo: string;
  exampleJa: string;
  xpReward: number;
}

export interface SeoulWorldDistrict {
  step: number;
  stationCode: string;
  lineName: string;
  lineColor: string;
  koName: string;
  jaName: string;
  shortTitle: string;
  shortCatch: string;
  subTitle: string;
  bannerGradient: string;
  bannerBorder: string;
  canvasBg: string;
  canvasPatternColor: string;
  landmarks: {
    topLeft: { emoji: string; labelKo: string; labelJa: string };
    midRight: { emoji: string; labelKo: string; labelJa: string };
    bottomLeft: { emoji: string; labelKo: string; labelJa: string };
  };
  treasure: CultureTreasureCard;
}

export const SEOUL_WORLD_DISTRICTS: Record<number, SeoulWorldDistrict> = {
  1: {
    step: 1,
    stationCode: '239',
    lineName: '2호선 (2号線)',
    lineColor: '#10B981',
    koName: '홍대입구・연남동',
    jaName: '弘大入口・延南洞カフェ街',
    shortTitle: '弘大・延南洞',
    shortCatch: 'ハングル解読＆カフェで最初の注文！',
    subTitle: '看板のハングルを解読し、おしゃれカフェで最初の注文を成功させよう！',
    bannerGradient: 'from-[#059669] via-[#10B981] to-[#0D9488]',
    bannerBorder: 'border-emerald-700',
    canvasBg: 'bg-gradient-to-b from-emerald-50/70 via-[#FAF7F2] to-teal-50/50',
    canvasPatternColor: '#10B981',
    landmarks: {
      topLeft: { emoji: '☕', labelKo: '연남동 카페', labelJa: '延南洞カフェ' },
      midRight: { emoji: '🎸', labelKo: '버스킹 거리', labelJa: '路上ライブ通り' },
      bottomLeft: { emoji: '🥐', labelKo: '베이커리', labelJa: 'ベーカリー' },
    },
    treasure: {
      id: 'chest_1',
      slangKo: '얼죽아',
      slangReading: 'オルジュガ',
      meaningJa: '凍え死んでもアイスアメリカーノ',
      originKo: '얼어 죽어도 아이스 아메리카노',
      description: '真冬の氷点下のソウルでも、韓国人がカフェで必ず頼む国民的ドリンク文化！この言葉をカフェで使うと現地の人と一気に打ち解けます。',
      exampleKo: '오늘 영하 10도인데 역시 얼죽아지! 아이스 아메리카노 주세요.',
      exampleJa: '今日は氷点下10度だけどやっぱりオルジュガでしょ！アイスアメリカーノください。',
      xpReward: 40,
    },
  },
  2: {
    step: 2,
    stationCode: '421',
    lineName: '4호선 (4号線)',
    lineColor: '#0284C7',
    koName: '명동・광장시장',
    jaName: '明洞・広蔵市場ナイトマーケット',
    shortTitle: '明洞・広蔵市場',
    shortCatch: '屋台の数字・会計＆買い物会話！',
    subTitle: '屋台の熱気の中で、数字と基本会話を使って買い物・食べ歩きを楽しもう！',
    bannerGradient: 'from-[#0369A1] via-[#0284C7] to-[#2563EB]',
    bannerBorder: 'border-sky-800',
    canvasBg: 'bg-gradient-to-b from-sky-50/70 via-[#FAF7F2] to-blue-50/50',
    canvasPatternColor: '#0284C7',
    landmarks: {
      topLeft: { emoji: '🍢', labelKo: '포장마차', labelJa: '屋台トッポッキ' },
      midRight: { emoji: '🥟', labelKo: '광장시장 빈대떡', labelJa: '広蔵市場チヂミ' },
      bottomLeft: { emoji: '🛍️', labelKo: '명동 쇼핑거리', labelJa: '明洞コスメ通り' },
    },
    treasure: {
      id: 'chest_2',
      slangKo: '겉바속촉',
      slangReading: 'コッパソクチョク',
      meaningJa: '外はカリッ、中はジューシー',
      originKo: '겉은 바삭하고 속은 촉촉하다',
      description: '広蔵市場のピンデトッ（緑豆チヂミ）や韓国チキンを褒める時の最高の食レポ表現！グルメ番組でも毎日使われます。',
      exampleKo: '이 치킨 진짜 겉바속촉이네요! 하나 더 주세요.',
      exampleJa: 'このチキン本当に外カリ中ジュワですね！もう一つください。',
      xpReward: 40,
    },
  },
  3: {
    step: 3,
    stationCode: '526',
    lineName: '5호선 (5号線)',
    lineColor: '#D97706',
    koName: '여의도・한강공원',
    jaName: '汝矣島・漢江サンセット公園',
    shortTitle: '汝矣島・漢江',
    shortCatch: '漢江ピクニック＆過去の思い出語り！',
    subTitle: '夕暮れの漢江でピクニック！感情表現と不規則活用で友だちと語り合おう！',
    bannerGradient: 'from-[#D97706] via-[#EA580C] to-[#E11D48]',
    bannerBorder: 'border-amber-800',
    canvasBg: 'bg-gradient-to-b from-amber-50/70 via-[#FAF7F2] to-orange-50/50',
    canvasPatternColor: '#D97706',
    landmarks: {
      topLeft: { emoji: '🍗', labelKo: '한강 치맥', labelJa: '漢江チメク配達' },
      midRight: { emoji: '🍜', labelKo: '한강 라면', labelJa: '漢江コンビニラーメン' },
      bottomLeft: { emoji: '⛺', labelKo: '피크닉 텐트', labelJa: 'ピクニック広場' },
    },
    treasure: {
      id: 'chest_3',
      slangKo: '치맥 & 한강라면',
      slangReading: 'チメク ＆ ハンガンラミョン',
      meaningJa: 'チキン＋ビール ＆ 漢江で作る即席ラーメン',
      originKo: '치킨 + 맥주 / 한강 즉석 라면',
      description: '漢江公園のコンビニにある専用調理器で作るラーメンと、配達ゾーンに届くアツアツのチキンはソウル青春の象徴です！',
      exampleKo: '날씨도 좋은데 한강에서 치맥 먹을래요?',
      exampleJa: '天気もいいし、漢江でチキンとビール食べませんか？',
      xpReward: 40,
    },
  },
  4: {
    step: 4,
    stationCode: 'KTX-01',
    lineName: 'KTX 경부선',
    lineColor: '#E11D48',
    koName: '서울역 ➔ 부산 해운대',
    jaName: 'ソウル駅 ➔ KTX釜山・海雲台',
    shortTitle: 'ソウル駅・釜山KTX',
    shortCatch: 'KTX乗り換え案内＆旅行プラン！',
    subTitle: '高速鉄道KTXで韓国縦断！ホテル予約からトラブル交渉まで一人で完結しよう！',
    bannerGradient: 'from-[#BE123C] via-[#E11D48] to-[#EA580C]',
    bannerBorder: 'border-rose-900',
    canvasBg: 'bg-gradient-to-b from-rose-50/70 via-[#FAF7F2] to-pink-50/50',
    canvasPatternColor: '#E11D48',
    landmarks: {
      topLeft: { emoji: '🚄', labelKo: '서울역 KTX', labelJa: '高速鉄道KTXホーム' },
      midRight: { emoji: '🌊', labelKo: '해운대 바닷가', labelJa: '海雲台ビーチ' },
      bottomLeft: { emoji: '🏨', labelKo: '오션뷰 호텔', labelJa: 'オーシャンビュー宿' },
    },
    treasure: {
      id: 'chest_4',
      slangKo: '호캉스',
      slangReading: 'ホカンス',
      meaningJa: 'ホテルで過ごす贅沢バカンス',
      originKo: '호텔 (Hotel) + 바캉스 (Vacance)',
      description: '観光地を走り回るのではなく、素敵なホテルのプールやラウンジでゆっくり癒やされる韓国で大人気の旅スタイル！',
      exampleKo: '이번 주말에는 부산 호텔에서 호캉스하면서 푹 쉬려고요.',
      exampleJa: '今週末は釜山のホテルでホカンスしながらゆっくり休むつもりです。',
      xpReward: 40,
    },
  },
  5: {
    step: 5,
    stationCode: '211',
    lineName: '2호선 (聖水支線)',
    lineColor: '#7C3AED',
    koName: '성수동・트렌드 팝업',
    jaName: '聖水洞・クリエイティブ街',
    shortTitle: '聖水洞トレンド',
    shortCatch: 'ポップアップ＆SNSレビュー！',
    subTitle: 'ソウルの最先端トレンド発信地！ニュースや噂、他人の言葉を正確に伝えよう！',
    bannerGradient: 'from-[#6D28D9] via-[#7C3AED] to-[#9333EA]',
    bannerBorder: 'border-purple-900',
    canvasBg: 'bg-gradient-to-b from-violet-50/70 via-[#FAF7F2] to-purple-50/50',
    canvasPatternColor: '#7C3AED',
    landmarks: {
      topLeft: { emoji: '🎨', labelKo: '성수 팝업스토어', labelJa: '聖水ポップアップ' },
      midRight: { emoji: '📸', labelKo: '인생네컷', labelJa: '人生4カット写真館' },
      bottomLeft: { emoji: '🏭', labelKo: '리모델링 카페', labelJa: '倉庫リノベカフェ' },
    },
    treasure: {
      id: 'chest_5',
      slangKo: '인생네컷 & 핫플',
      slangReading: 'インセンネッコ ＆ ハップル',
      meaningJa: '人生ベスト4コマプリクラ ＆ ホットプレイス（話題のスポット）',
      originKo: '인생 네 컷 / 핫플레이스 (Hot Place)',
      description: '聖水洞のポップアップストア巡りの後は、友達と「인생네컷（4コマ写真）」を撮ってSNSに載せるのが定番コース！',
      exampleKo: '성수동에 새로 생긴 핫플에서 같이 인생네컷 찍자고 했어요.',
      exampleJa: '聖水洞に新しくできた話題のスポットで一緒に4コマ写真を撮ろうと言っていました。',
      xpReward: 50,
    },
  },
  6: {
    step: 6,
    stationCode: '222',
    lineName: '2호선・신분당선',
    lineColor: '#2563EB',
    koName: '강남・테헤란로',
    jaName: '江南・テヘラン路オフィス街',
    shortTitle: '江南オフィス街',
    shortCatch: 'ビジネスメール＆ニュース討論！',
    subTitle: 'IT企業とスタートアップが集まる摩天楼！自分の意見を論理的に主張しよう！',
    bannerGradient: 'from-[#1E40AF] via-[#2563EB] to-[#4F46E5]',
    bannerBorder: 'border-indigo-950',
    canvasBg: 'bg-gradient-to-b from-indigo-50/70 via-[#FAF7F2] to-blue-50/50',
    canvasPatternColor: '#2563EB',
    landmarks: {
      topLeft: { emoji: '🏙️', labelKo: '강남 타워', labelJa: '江南ITビル群' },
      midRight: { emoji: '📚', labelKo: '코엑스 별마당', labelJa: 'COEXピョルマダン図書館' },
      bottomLeft: { emoji: '💼', labelKo: '비즈니스 미팅', labelJa: 'スタートアップ会議' },
    },
    treasure: {
      id: 'chest_6',
      slangKo: '워라밸 & 칼퇴',
      slangReading: 'ウォラベル ＆ カルテ',
      meaningJa: 'ワークライフバランス ＆ 定時ピタ退勤',
      originKo: 'Work-Life Balance / 칼같이 퇴근',
      description: '現代の韓国ビジネス街で最も重視されるキーワード。「칼퇴（刀のようにスパッと定時退社すること）」は会社員の合言葉です。',
      exampleKo: '우리 회사는 워라밸이 좋아서 오늘도 칼퇴할 수 있어요.',
      exampleJa: 'うちの会社はワークライフバランスが良いので今日も定時ピタ退勤できます。',
      xpReward: 50,
    },
  },
  7: {
    step: 7,
    stationCode: '533',
    lineName: '5호선・광화문',
    lineColor: '#0D9488',
    koName: '광화문・여의도 방송국',
    jaName: '光化門・汝矣島メディア街',
    shortTitle: '光化門メディア街',
    shortCatch: '社説・論文・高難度長文読解！',
    subTitle: '報道局と官庁の中心地！社会問題やビジネス交渉を格調高い韓国語で論じよう！',
    bannerGradient: 'from-[#0F766E] via-[#0D9488] to-[#0891B2]',
    bannerBorder: 'border-teal-950',
    canvasBg: 'bg-gradient-to-b from-teal-50/70 via-[#FAF7F2] to-cyan-50/50',
    canvasPatternColor: '#0D9488',
    landmarks: {
      topLeft: { emoji: '🎙️', labelKo: '뉴스 스튜디오', labelJa: '報道スタジオ' },
      midRight: { emoji: '🏛️', labelKo: '광화문 광장', labelJa: '光化門広場' },
      bottomLeft: { emoji: '📊', labelKo: '국제 컨퍼런스', labelJa: '国際カンファレンス' },
    },
    treasure: {
      id: 'chest_7',
      slangKo: '일취월장 (日就月將)',
      slangReading: 'イルチュィウォルジャン',
      meaningJa: '日に月に絶えず進歩・成長すること',
      originKo: '날마다 나아가고 달마다 발전한다',
      description: 'TOPIK II 高級やビジネススピーチで相手の成長や業績を称賛する際によく使われる、知的で格調高い四字熟語です。',
      exampleKo: '꾸준히 노력한 덕분에 한국어 실력이 일취월장하고 있습니다.',
      exampleJa: 'たゆまず努力したおかげで、韓国語の実力が日々飛躍的に進歩しています。',
      xpReward: 60,
    },
  },
  8: {
    step: 8,
    stationCode: 'TOP-8',
    lineName: '남산 케이블카',
    lineColor: '#B84E34',
    koName: '경복궁 ➔ N서울타워 정상',
    jaName: '景福宮 ➔ Nソウルタワー頂上',
    shortTitle: '景福宮・Nソウルタワー',
    shortCatch: '四字熟語＆TOPIK 6級完全制覇！',
    subTitle: 'ソウルを一望する頂へ！歴史・ユーモア・哲学まで母語話者と対等に語り合おう！',
    bannerGradient: 'from-[#1B2A38] via-[#B84E34] to-[#D97706]',
    bannerBorder: 'border-stone-900',
    canvasBg: 'bg-gradient-to-b from-amber-50/80 via-[#FAF7F2] to-rose-50/60',
    canvasPatternColor: '#B84E34',
    landmarks: {
      topLeft: { emoji: '🏯', labelKo: '경복궁 근정전', labelJa: '景福宮・勤政殿' },
      midRight: { emoji: '🏮', labelKo: '북촌 한옥마을', labelJa: '北村韓屋マウル' },
      bottomLeft: { emoji: '🗼', labelKo: 'N서울타워 전망대', labelJa: 'Nソウルタワー頂上' },
    },
    treasure: {
      id: 'chest_8',
      slangKo: '금상첨화 (錦上添花)',
      slangReading: 'クムサンチョムファ',
      meaningJa: '錦の上に花を添える（良いことにさらに良いことが重なる最高の状態）',
      originKo: '비단 위에 꽃을 더한다',
      description: '最上級の韓国語マスターにふさわしい美しい表現。完璧な状況にさらに彩りが加わる時にネイティブが好んで使います。',
      exampleKo: '아름다운 서울 야경에 맛있는 음식까지 있으니 금상첨화네요.',
      exampleJa: '美しいソウルの夜景に美味しい料理まであるので、まさに鬼に金棒（錦上添花）ですね。',
      xpReward: 100,
    },
  },
};
