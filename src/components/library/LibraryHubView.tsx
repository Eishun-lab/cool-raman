import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Hash,
  Bookmark,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { StudyGuideView } from '../StudyGuideView';
import { KoreanNumbersGuideView } from '../KoreanNumbersGuideView';
import { GuideTab } from '../../types/guide';
import { sound } from '../../utils/audioSynth';

interface LibraryHubViewProps {
  initialAnchor?: string;
  initialSubTab?: 'textbook' | 'dictionary' | 'reference' | 'chunks' | 'numbers';
  onNavigateToExam?: (examId?: string) => void;
  onBackToDashboard?: () => void;
}

type LibrarySubTab = 'textbook' | 'dictionary' | 'reference' | 'chunks' | 'numbers';

export const LibraryHubView: React.FC<LibraryHubViewProps> = ({
  initialAnchor,
  initialSubTab = 'textbook',
  onNavigateToExam,
  onBackToDashboard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<LibrarySubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* 📚 ライブラリ 統合トップカテゴリーバー（Duolingo 3Dキャンディタブ） */}
      <div className="bg-white border-2 border-stone-200/90 rounded-3xl p-2.5 sm:p-3 shadow-[0_3px_0_#E5E7EB]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'textbook' as const, label: '教科書40課', icon: BookOpen, color: '#58CC02', shadow: '#388E00' },
            { id: 'dictionary' as const, label: '文法辞典250', icon: Bookmark, color: '#1CB0F6', shadow: '#1899D6' },
            { id: 'reference' as const, label: '使い分け・Q&A', icon: HelpCircle, color: '#FF9600', shadow: '#CC7A00' },
            { id: 'chunks' as const, label: '会話・助詞', icon: MessageCircle, color: '#CE82FF', shadow: '#A855F7' },
            { id: 'numbers' as const, label: '数字攻略', icon: Hash, color: '#FF4B4B', shadow: '#D32F2F' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setActiveSubTab(tab.id);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white -translate-y-0.5'
                    : 'bg-white border-2 border-stone-200 text-stone-600 shadow-[0_2px_0_#E5E7EB] hover:bg-stone-50'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: tab.color,
                        boxShadow: `0 3px 0 ${tab.shadow}`,
                      }
                    : undefined
                }
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* コンテンツ表示エリア */}
      {activeSubTab === 'numbers' ? (
        <div className="space-y-4 animate-in fade-in duration-150">
          <KoreanNumbersGuideView showPronunciation={true} isLargeFont={false} />
        </div>
      ) : (
        <StudyGuideView
          onBackToNote={onBackToDashboard || (() => {})}
          initialAnchor={initialAnchor}
          defaultTab={activeSubTab as GuideTab}
          onNavigateToExam={onNavigateToExam}
          hideBottomNav={true}
          hideBackButton={true}
        />
      )}
    </div>
  );
};

export default LibraryHubView;
