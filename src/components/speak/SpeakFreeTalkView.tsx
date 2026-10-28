import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  Send,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  SPEAK_FREETALK_SCENARIOS,
  SpeakFreeTalkScenario,
} from '../../data/speakCurriculum';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  textKo: string;
  textJa?: string;
}

export const SpeakFreeTalkView: React.FC<{ onBackToHome: () => void }> = ({
  onBackToHome,
}) => {
  const [activeScenario, setActiveScenario] = useState<SpeakFreeTalkScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);

  const handleSelectScenario = (scenario: SpeakFreeTalkScenario) => {
    sound.playTap();
    setActiveScenario(scenario);
    setMessages([
      {
        id: 'msg_0',
        sender: 'ai',
        textKo: scenario.firstMessageKo,
        textJa: scenario.firstMessageJa,
      },
    ]);
    speechService.speak(scenario.firstMessageKo);
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

    // AIの返答シミュレーション
    setTimeout(() => {
      sound.playCorrect();
      const aiReplies: Record<string, { ko: string; ja: string }> = {
        cafe_order: {
          ko: '네, 준비해 드릴게요! 영수증 필요하세요?',
          ja: 'はい、ご用意いたします！レシートは必要ですか？',
        },
        street_food: {
          ko: '아이고 착하다! 뜨거우니까 조심해서 먹어! 더 필요한 거 있으면 말해!',
          ja: 'あらいい子ね！熱いから気をつけて食べてね！他に要るものあったら言ってね！',
        },
        kpop_friend: {
          ko: '맞아! 나도 그거 보고 소리 질렀잖아 ㅋㅋㅋ 진짜 대박이야!',
          ja: 'だよね！私もそれ見て叫んじゃったよ（笑）マジで最高！',
        },
      };

      const scenarioKey = activeScenario?.id || 'cafe_order';
      const reply = aiReplies[scenarioKey] || {
        ko: '정말 잘 말씀하셨어요! 한국어 너무 잘하시네요!',
        ja: '本当に上手にお話しされましたね！韓国語すごくお上手です！',
      };

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        textKo: reply.ko,
        textJa: reply.ja,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiReplying(false);
      speechService.speak(reply.ko);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-28 select-none">
      {/* 1. シナリオ選択画面 */}
      {!activeScenario ? (
        <div className="max-w-md mx-auto px-4 pt-4 space-y-6 animate-fadeIn">
          <header className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                AI FREE TALK
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                프리톡（AIフリートーク）
              </h1>
            </div>
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800/50 cursor-pointer"
            >
              ホームへ戻る
            </button>
          </header>

          <p className="text-xs text-slate-400 leading-relaxed">
            教科書通りの勉強はここまで。ネイティブAIとリアルな韓国の現場で会話を楽しもう。
          </p>

          {/* シナリオカード一覧 */}
          <div className="space-y-3 pt-2">
            {SPEAK_FREETALK_SCENARIOS.map((sc) => (
              <div
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className="bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] rounded-3xl p-5 shadow-lg transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                    <img
                      src={sc.avatar}
                      alt={sc.role}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {sc.level}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {sc.location}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">
                      {sc.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      相手: {sc.role}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2. 対話チャット画面 */
        <div className="max-w-md mx-auto h-[90vh] flex flex-col justify-between px-3 pt-2 animate-fadeIn">
          {/* 上部ヘッダー */}
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
              <span className="text-[10px] text-slate-400">相手: {activeScenario.role}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSelectScenario(activeScenario)}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="最初からやり直す"
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
                        : 'bg-blue-600 text-white'
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

          {/* おすすめの返答クイックボタン */}
          <div className="space-y-1.5 pt-2 pb-2">
            <span className="text-[10px] text-slate-500 font-bold px-1 block">
              💡 おすすめの返答（タップで話す）:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeScenario.suggestedRepliesKo.map((reply, i) => (
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

          {/* テキスト入力 / マイクバー */}
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
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shrink-0 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakFreeTalkView;
