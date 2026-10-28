import React from 'react';
import {
  AudioLines,
  MessageSquareText,
  Zap,
  Trophy,
  User,
} from 'lucide-react';
import { sound } from '../../utils/audioSynth';

export type SpeakTabType = 'home' | 'freetalk' | 'practice' | 'challenge' | 'profile';

interface SpeakBottomNavProps {
  activeTab: SpeakTabType;
  onChangeTab: (tab: SpeakTabType) => void;
}

export const SpeakBottomNav: React.FC<SpeakBottomNavProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    { id: 'home' as const, label: '홈', sub: 'ホーム', icon: AudioLines },
    { id: 'freetalk' as const, label: '프리톡', sub: 'AI会話', icon: MessageSquareText },
    { id: 'practice' as const, label: '연습', sub: '練習', icon: Zap },
    { id: 'challenge' as const, label: '챌린지', sub: '挑戦', icon: Trophy },
    { id: 'profile' as const, label: '프로필', sub: 'マイ', icon: User },
  ];

  return (
    <nav className="fixed bottom-3 left-4 right-4 z-40 max-w-md mx-auto bg-[#141A26]/95 backdrop-blur-xl border border-[#232B3C] rounded-full p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              sound.playTap();
              onChangeTab(tab.id);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all cursor-pointer select-none ${
              isActive
                ? 'bg-[#212C42] text-white shadow-inner font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400 stroke-[2.2]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default SpeakBottomNav;
