import React, { useState } from 'react';
import { BookOpen, Hash, Search, ArrowLeft } from 'lucide-react';
import { StudyGuideView } from '../StudyGuideView';
import { KoreanNumbersGuideView } from '../KoreanNumbersGuideView';

interface LibraryHubViewProps {
  initialAnchor?: string;
  initialSubTab?: 'textbook' | 'numbers';
  onNavigateToExam?: (examId?: string) => void;
  onBackToDashboard?: () => void;
}

export const LibraryHubView: React.FC<LibraryHubViewProps> = ({
  initialAnchor,
  initialSubTab = 'textbook',
  onNavigateToExam,
  onBackToDashboard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'textbook' | 'numbers'>(initialSubTab);

  return (
    <div className="w-full space-y-4">
      {/* 📚 ライブラリ トップヘッダー ＆ サブナビゲーション */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF0EC] text-[#B84E34] border border-[#F0D5CD] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#1B2A38] tracking-tight">
                  逆引きライブラリ
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  全網羅リファレンス
                </span>
              </div>
              <p className="text-xs text-stone-500">
                40課の体系文法・250大辞典・数字攻略をいつでも一発検索
              </p>
            </div>
          </div>

          {/* サブタブ切り替え */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto shrink-0 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSubTab('textbook')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'textbook'
                  ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>教科書・文法大辞典</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('numbers')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'numbers'
                  ? 'bg-white text-[#B84E34] shadow-2xs font-black'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>数字完全攻略</span>
            </button>
          </div>
        </div>
      </div>

      {/* コンテンツ表示エリア */}
      {activeSubTab === 'textbook' ? (
        <StudyGuideView
          onBackToNote={onBackToDashboard || (() => {})}
          initialAnchor={initialAnchor}
          onNavigateToExam={onNavigateToExam}
        />
      ) : (
        <div className="space-y-4">
          <KoreanNumbersGuideView showPronunciation={true} isLargeFont={false} />
        </div>
      )}
    </div>
  );
};
