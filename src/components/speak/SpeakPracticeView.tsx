import React, { useState } from 'react';
import {
  Layers,
  Quote,
  Zap,
  Bookmark,
  Sparkles,
  PhoneCall,
  Crown,
  ChevronRight,
  Volume2,
  X,
} from 'lucide-react';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

export const SpeakPracticeView: React.FC<{ onStartDrill: () => void }> = ({
  onStartDrill,
}) => {
  const [selectedWordCategory, setSelectedWordCategory] = useState<'vocab' | 'idiom' | null>(null);

  const vocabList = [
    { ko: '진짜', ja: '本当に、マジで', ex: '진짜 맛있어요!' },
    { ko: '대박', ja: 'すごい、ヤバい', ex: '와 대박이다!' },
    { ko: '괜찮아요', ja: '大丈夫です', ex: '저는 괜찮아요.' },
    { ko: '어떡해', ja: 'どうしよう', ex: '어떡해! 늦겠다!' },
    { ko: '좋아요', ja: 'いいですね', ex: '네, 좋아요!' },
  ];

  const idiomList = [
    { ko: '밥 먹었어?', ja: 'ご飯食べた？（元気？の挨拶）', ex: '야! 밥은 먹고 다녀?' },
    { ko: '말도 안 돼', ja: 'ありえない、まさか', ex: '진짜? 말도 안 돼!' },
    { ko: '마음에 들어요', ja: '気に入りました', ex: '이 옷 마음에 들어요.' },
    { ko: '눈치채다', ja: '空気を読む、気づく', ex: '벌써 눈치챘어?' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans pb-32 max-w-md mx-auto px-4 pt-4 space-y-6 select-none animate-fadeIn">
      {/* 1. ヘッダー（スクショ3完全再現） */}
      <header>
        <h1 className="text-2xl font-black text-white tracking-tight">
          연습
        </h1>
      </header>

      {/* 2. 폰 스픽（Phone Speak）ヒーローカード（スクショ3完全再現） */}
      <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          {/* 青いヘッドセット付きマスコットアバター */}
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shrink-0">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white">폰 스픽</h2>
            <p className="text-xs text-slate-400">
              10분 통화로 스피킹을 연습해 보세요
            </p>
          </div>
        </div>

        {/* プレミアムプラス解除ボタン */}
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onStartDrill();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#172554] via-[#1E1B4B] to-[#311042] border border-indigo-500/30 hover:border-indigo-400/60 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <Crown className="w-4 h-4 fill-indigo-400 text-indigo-400" />
          <span>프리미엄 플러스로 잠금 해제하기</span>
        </button>
      </div>

      {/* 3. 빠른 레슨（クイックレッスン）（スクショ3完全再現） */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white tracking-tight px-1">
          빠른 레슨
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* 어휘（単語カード） */}
          <div
            onClick={() => {
              sound.playTap();
              setSelectedWordCategory('vocab');
            }}
            className="bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] rounded-3xl p-5 space-y-4 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-base font-bold text-white block">
              어휘
            </span>
          </div>

          {/* 관용구（慣用句カード） */}
          <div
            onClick={() => {
              sound.playTap();
              setSelectedWordCategory('idiom');
            }}
            className="bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] rounded-3xl p-5 space-y-4 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Quote className="w-6 h-6" />
            </div>
            <span className="text-base font-bold text-white block">
              관용구
            </span>
          </div>
        </div>
      </section>

      {/* 4. 리뷰（復習）（スクショ3完全再現） */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white tracking-tight px-1">
          리뷰
        </h3>
        <div className="space-y-2.5">
          {/* スマート復習 */}
          <div
            onClick={() => {
              sound.playTap();
              onStartDrill();
            }}
            className="bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] rounded-3xl p-4 flex items-center justify-between gap-3 shadow-lg cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-slate-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">스마트 복습</h4>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500 text-[10px] font-black text-white shrink-0">
                    프리미엄
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate pt-0.5">
                  코스 레슨을 수강하여 잠금 해제
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
          </div>

          {/* 保存した文章 */}
          <div
            onClick={() => {
              sound.playTap();
              setSelectedWordCategory('vocab');
            }}
            className="bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] rounded-3xl p-4 flex items-center justify-between gap-3 shadow-lg cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5 fill-slate-300" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">저장된 문장 보기</h4>
                <p className="text-xs text-slate-400 truncate pt-0.5">
                  단어나 문장을 저장하려면 레슨을 수강하세요
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
          </div>

          {/* ミスした表現 */}
          <div
            onClick={() => {
              sound.playTap();
              onStartDrill();
            }}
            className="bg-[#141A26] hover:bg-[#1A2234] border border-[#232B3C] rounded-3xl p-4 flex items-center justify-between gap-3 shadow-lg cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">실수</h4>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-[10px] font-black text-white shrink-0">
                    프리미엄 플러스
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate pt-0.5">
                  苦手な発音や間違えやすいフレーズを集中的に復習
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
          </div>
        </div>
      </section>

      {/* 単語・慣用句モーダル */}
      {selectedWordCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141A26] border border-[#232B3C] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {selectedWordCategory === 'vocab' ? '어휘（単語リスト）' : '관용구（慣用句リスト）'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedWordCategory(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(selectedWordCategory === 'vocab' ? vocabList : idiomList).map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playTap();
                    speechService.speak(item.ko);
                  }}
                  className="p-3 rounded-2xl bg-[#0A0D14] border border-[#232B3C] hover:border-blue-500/50 flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white group-hover:text-blue-300">
                      {item.ko}
                    </span>
                    <span className="text-xs text-slate-400 block">{item.ja}</span>
                    <span className="text-[11px] text-slate-500 italic block">{item.ex}</span>
                  </div>
                  <Volume2 className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakPracticeView;
