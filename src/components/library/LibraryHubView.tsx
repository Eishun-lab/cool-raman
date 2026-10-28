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
      {/* 📚 ライブラリ 統合トップカテゴリーバー（Speak/Linear風 ミニマル・セグメントバー） */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'textbook' as const, label: '教科書40課', icon: BookOpen },
            { id: 'dictionary' as const, label: '文法辞典250', icon: Bookmark },
            { id: 'reference' as const, label: '使い分け・Q&A', icon: HelpCircle },
            { id: 'chunks' as const, label: '会話・助詞', icon: MessageCircle },
            { id: 'numbers' as const, label: '数字攻略', icon: Hash },
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
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
