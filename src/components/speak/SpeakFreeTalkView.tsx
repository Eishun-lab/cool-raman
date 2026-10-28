import React, { useState } from 'react';
import {
  Clock,
  Heart,
  Plus,
  ArrowLeft,
  Volume2,
  Send,
  Sparkles,
  Crown,
  Search,
  RefreshCw,
  X,
} from 'lucide-react';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface ScenarioItem {
  id: string;
  author: string;
  title: string;
  titleJa: string;
  description: string;
  likes: number;
  avatar: string;
  firstMessageKo: string;
  firstMessageJa: string;
  suggestedReplies: string[];
}

const COMMUNITY_SCENARIOS: ScenarioItem[] = [
  {
    id: 'sc_1',
    author: '@판문동',
    title: '만능 표현 연습하기',
    titleJa: '万能な受け答え表現をマスターする',
    description: '日常会話で詰まった時に咄嗟に出る万能フレーズを練習しましょう。',
    likes: 134,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    firstMessageKo: '안녕하세요! 오늘 어떤 표현부터 연습해 볼까요?',
    firstMessageJa: 'こんにちは！今日はどの表現から練習してみましょうか？',
    suggestedReplies: [
      '그렇군요! 몰랐어요.',
      '혹시 다시 말씀해 주실 수 있어요?',
      '그건 좀 어려울 것 같아요.',
    ],
  },
  {
    id: 'sc_2',
    author: '@Munarung',
    title: '일상 표현 100문장',
    titleJa: '日常で毎日使う最頻出100フレーズ',
    description: '韓国人が毎日口にする定番のリアクションと相づちの特訓。',
    likes: 96,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    firstMessageKo: '야! 주말에 뭐 했어? 재미있는 일 없었어?',
    firstMessageJa: 'おーい！週末なにしてた？面白いことなかった？',
    suggestedReplies: [
      '주말에 집에서 푹 쉬었어!',
      '친구랑 맛있는 거 먹으러 갔지.',
      '넷플릭스 보느라 시간 다 갔어 ㅋㅋㅋ',
    ],
  },
  {
    id: 'sc_3',
    author: '@홍대라이프',
    title: '홍대 핫플 카페 주문하기',
    titleJa: '弘大の話題のカフェでリアル注文',
    description: '甘さや氷の量、テイクアウトの受け答えまで完璧に。',
    likes: 453,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    firstMessageKo: '어서오세요! 주문 도와드릴까요? 매장에서 드시나요?',
    firstMessageJa: 'いらっしゃいませ！ご注文をお伺いします。店内でお召し上がりですか？',
    suggestedReplies: [
      '테이크아웃할게요. 아아 한 잔 주세요.',
      '덜 달게 해 주실 수 있나요?',
      '여기 디카페인 원두도 있나요?',
    ],
  },
  {
    id: 'sc_4',
    author: '@동대문밤시장',
    title: '동대문에서 가격 흥정하기',
    titleJa: '東大門市場でスマートに価格交渉',
    description: '旅先でぼったくられない、愛嬌のある値引き交渉会話。',
    likes: 28,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    firstMessageKo: '언니! 이거 이번 신상인데 딱 언니 스타일이다! 입어봐!',
    firstMessageJa: 'お姉さん！これ新作なんだけどまさにピッタリだよ！着てみて！',
    suggestedReplies: [
      '예쁜데 조금만 깎아주시면 안 돼요?',
      '현금으로 결제하면 할인돼요?',
      '다른 색상도 보여주세요.',
    ],
  },
];

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  textKo: string;
  textJa?: string;
}

export const SpeakFreeTalkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'community' | 'topic'>('community');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'new' | 'top'>('trending');
  const [activeScenario, setActiveScenario] = useState<ScenarioItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState('');

  const handleSelectScenario = (sc: ScenarioItem) => {
    sound.playTap();
    setActiveScenario(sc);
    setMessages([
      {
        id: 'msg_0',
        sender: 'ai',
        textKo: sc.firstMessageKo,
        textJa: sc.firstMessageJa,
      },
    ]);
    speechService.speak(sc.firstMessageKo);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    sound.playTap();

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      textKo: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAiReplying(true);

    setTimeout(() => {
      sound.playCorrect();
      const reply = {
        ko: '정말 자연스러운 한국어 표현이에요! 다음에는 이렇게도 말씀해 보세요.',
        ja: 'すごく自然な韓国語表現です！次はこう言ってみるのもおすすめです。',
      };
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          textKo: reply.ko,
          textJa: reply.ja,
        },
      ]);
      setIsAiReplying(false);
      speechService.speak(reply.ko);
    }, 1200);
  };

  const handleCreateCustomScenario = () => {
    if (!customTopic.trim()) return;
    sound.playTap();
    const newSc: ScenarioItem = {
      id: `custom_${Date.now()}`,
      author: '@私だけのAI会話',
      title: customTopic,
      titleJa: 'カスタムAI対話シナリオ',
      description: 'あなたが作成したオリジナルシチュエーションで会話します。',
      likes: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      firstMessageKo: `안녕하세요! "${customTopic}"에 대해 이야기해 볼까요?`,
      firstMessageJa: `こんにちは！「${customTopic}」についてお話ししてみましょうか？`,
      suggestedReplies: [
        '네, 좋아요! 시작해 봐요.',
        '제가 먼저 질문해도 될까요?',
        '오늘 기분이 어떠세요?',
      ],
    };
    setIsCustomModalOpen(false);
    setCustomTopic('');
    handleSelectScenario(newSc);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-32 select-none relative">
      {/* 1. シナリオ一覧画面 */}
      {!activeScenario ? (
        <div className="max-w-md mx-auto px-4 pt-4 space-y-4 animate-fadeIn">
          {/* 上部ヘッダー（スクショ4完全再現） */}
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white tracking-tight">
              프리톡
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#161B26] border border-[#232936] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="会話履歴"
              >
                <Clock className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#161B26] border border-[#232936] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="お気に入り"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* タブ切り替え（커뮤니티 / 주제별） */}
          <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setActiveTab('community');
              }}
              className={`text-base font-bold pb-1 transition-colors cursor-pointer relative ${
                activeTab === 'community' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              커뮤니티
              {activeTab === 'community' && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setActiveTab('topic');
              }}
              className={`text-base font-bold pb-1 transition-colors cursor-pointer relative ${
                activeTab === 'topic' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              주제별
              {activeTab === 'topic' && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* フィルターピル群（スクショ4完全再現） */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveFilter('trending')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeFilter === 'trending'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-[#161B26] text-slate-300 border border-[#232936]'
              }`}
            >
              🔥 트렌딩
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('new')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeFilter === 'new'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-[#161B26] text-slate-300 border border-[#232936]'
              }`}
            >
              ⭐ 신규
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('top')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeFilter === 'top'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-[#161B26] text-slate-300 border border-[#232936]'
              }`}
            >
              🏆 탑 차트 - 일간 ∨
            </button>
          </div>

          {/* プレミアムバナー（スクショ4完全再現） */}
          <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 text-center space-y-3 shadow-xl">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Crown className="w-5 h-5 fill-blue-400 text-blue-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white">
                스픽을 제한 없이 누려보세요
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                프리미엄 멤버십에 가입하여 프리톡 및 여러가지 콘텐츠를 이용해 보세요
              </p>
            </div>
            <button
              type="button"
              onClick={() => sound.playTap()}
              className="w-full py-3 rounded-2xl bg-[#1652F0] hover:bg-[#1344C8] text-white font-bold text-xs shadow-lg active:scale-[0.99] transition-all cursor-pointer"
            >
              프리미엄 멤버십 보기
            </button>
          </div>

          {/* 2カラム シナリオカード一覧（スクショ4の3Dアバターカードを完全再現） */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {COMMUNITY_SCENARIOS.map((sc) => (
              <div
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className="bg-[#141A26] border border-[#232B3C] rounded-3xl overflow-hidden shadow-lg hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                {/* 3Dアバター画像 ＆ いいねバッジ */}
                <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={sc.avatar}
                    alt={sc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-white text-white" />
                    <span>{sc.likes}</span>
                  </div>
                </div>

                {/* カードテキスト */}
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {sc.author}
                  </span>
                  <h3 className="text-xs font-bold text-white leading-snug line-clamp-1 group-hover:text-blue-300 transition-colors">
                    {sc.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                    {sc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 右下・中央フローティングボタン: + 나만의 시나리오 만들기（スクショ4完全再現） */}
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setIsCustomModalOpen(true);
              }}
              className="px-5 py-3 rounded-full bg-[#1652F0] hover:bg-[#1344C8] text-white font-bold text-xs shadow-[0_8px_20px_rgba(22,82,240,0.4)] flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>나만의 시나리오 만들기</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. 対話チャット画面 */
        <div className="max-w-md mx-auto h-[90vh] flex flex-col justify-between px-3 pt-2 animate-fadeIn">
          <header className="flex items-center justify-between p-3 bg-[#141A26] rounded-2xl border border-[#232B3C] shrink-0">
            <button
              type="button"
              onClick={() => setActiveScenario(null)}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xs font-bold text-white">{activeScenario.title}</h2>
              <span className="text-[10px] text-slate-400">{activeScenario.author}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSelectScenario(activeScenario)}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="リセット"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </header>

          {/* メッセージログ */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                      <img
                        src={activeScenario.avatar}
                        alt="AI"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 shadow-sm ${
                      isAi
                        ? 'bg-[#151E2E] text-white border border-[#24314A]'
                        : 'bg-[#1652F0] text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold leading-snug">{m.textKo}</p>
                      {isAi && (
                        <button
                          type="button"
                          onClick={() => speechService.speak(m.textKo)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer shrink-0"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {m.textJa && (
                      <p className="text-[11px] text-slate-400 leading-tight pt-0.5">
                        {m.textJa}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {isAiReplying && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-10">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>相手が入力しています...</span>
              </div>
            )}
          </div>

          {/* おすすめの返答 */}
          <div className="space-y-1.5 pt-2 pb-2">
            <span className="text-[10px] text-slate-500 font-bold px-1 block">
              💡 タップして返答する:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeScenario.suggestedReplies.map((reply, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(reply)}
                  className="px-3 py-1.5 rounded-xl bg-[#182236] hover:bg-[#22304D] border border-blue-500/30 text-xs text-blue-200 font-medium transition-colors cursor-pointer text-left"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* 入力バー */}
          <div className="p-2 bg-[#141A26] rounded-2xl border border-[#232B3C] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(inputText);
              }}
              placeholder="韓国語で返答を入力..."
              className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2"
            />
            <button
              type="button"
              onClick={() => handleSendMessage(inputText)}
              className="p-2.5 rounded-xl bg-[#1652F0] hover:bg-[#1344C8] text-white cursor-pointer shrink-0 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* カスタムシナリオ作成モーダル */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">나만의 시나리오 만들기</h3>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              会話したいシチュエーションやトピックを入力してください。（例: ソウルの皮膚科で相談、空港で荷物を受け取る）
            </p>
            <input
              type="text"
              autoFocus
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="シチュエーションを入力..."
              className="w-full p-3 rounded-2xl bg-[#0A0D14] border border-[#232B3C] text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleCreateCustomScenario}
              className="w-full py-3 rounded-2xl bg-[#1652F0] hover:bg-[#1344C8] text-white font-bold text-xs cursor-pointer shadow-lg transition-all"
            >
              AI会話をスタート
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakFreeTalkView;
