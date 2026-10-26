import React from 'react';
import {
  Coffee,
  Utensils,
  Train,
  Building2,
  Sparkles,
  Camera,
  Mic,
  Crown,
  Gift,
  Check,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { CultureTreasureCard } from '../../data/seoulWorldMap';
import { HorangiMascot } from '../mascot/HorangiMascot';
import { speechService } from '../../utils/speech';

/**
 * 1. 韓国地下鉄駅の象徴的な丸型ナンバー＆駅名標プレート
 */
export const SeoulSubwaySign: React.FC<{
  stationCode: string;
  lineName: string;
  lineColor: string;
  koName: string;
}> = ({ stationCode, lineName, lineColor, koName }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-md border-2 border-white/80">
      <span
        style={{ backgroundColor: lineColor }}
        className="px-2 py-0.5 rounded-full text-white font-mono font-black text-[10px] sm:text-[11px] tracking-tight shadow-2xs"
      >
        {stationCode}
      </span>
      <span className="text-[11px] sm:text-xs font-black text-[#1B2A38] tracking-tight">
        {koName}
      </span>
      <span className="text-[10px] font-bold text-stone-400 hidden sm:inline border-l border-stone-200 pl-2">
        {lineName}
      </span>
    </div>
  );
};

/**
 * 2. トレイル脇に佇む韓国の街並みランドマーク（SVGベクター看板＆イラスト）
 */
export const SeoulLandmarkDeco: React.FC<{
  step: number;
  position: 'topLeft' | 'midRight' | 'bottomLeft';
  labelKo: string;
  labelJa: string;
  accentColor: string;
  onClick?: () => void;
}> = ({ step, position, labelKo, labelJa, accentColor, onClick }) => {
  // ステージと位置に応じたカスタムベクターミニイラスト
  const renderVectorLandmark = () => {
    if (step === 1) {
      if (position === 'topLeft') {
        // 延南洞カフェ（カップ＆ネオン看板）
        return (
          <svg viewBox="0 0 64 64" className="w-11 h-11 sm:w-13 sm:h-13">
            {/* カフェのオーニング屋根 */}
            <path d="M8 22 L56 22 L52 12 L12 12 Z" fill="#10B981" />
            <path d="M12 22 C12 26 20 26 20 22 C20 26 28 26 28 22 C28 26 36 26 36 22 C36 26 44 26 44 22 C44 26 52 26 52 22" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
            {/* 建物本体 */}
            <rect x="12" y="24" width="40" height="32" rx="4" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" />
            {/* 窓とコーヒーカップ */}
            <rect x="18" y="30" width="16" height="16" rx="2" fill="#BAE6FD" />
            <rect x="38" y="32" width="10" height="24" rx="1" fill="#B84E34" />
            {/* 湯気 */}
            <path d="M26 8 C24 4 28 4 26 1" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );
      }
      return (
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs">
          <Coffee className="w-5 h-5" />
        </div>
      );
    }

    if (step === 2) {
      if (position === 'topLeft') {
        // 広蔵市場・屋台テント（赤いポジャンマチャ）
        return (
          <svg viewBox="0 0 64 64" className="w-11 h-11 sm:w-13 sm:h-13">
            <path d="M6 26 L58 26 L50 12 L14 12 Z" fill="#E11D48" />
            <path d="M14 12 L22 26 M32 12 L32 26 M50 12 L42 26" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
            <rect x="12" y="26" width="40" height="28" rx="3" fill="#FEF3C7" stroke="#E11D48" strokeWidth="2" />
            {/* 提灯 */}
            <circle cx="20" cy="34" r="4" fill="#F59E0B" />
            <circle cx="44" cy="34" r="4" fill="#F59E0B" />
            {/* トッポッキ鍋 */}
            <path d="M24 46 L40 46 L38 52 L26 52 Z" fill="#B84E34" />
          </svg>
        );
      }
      return (
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-xs">
          <Utensils className="w-5 h-5" />
        </div>
      );
    }

    if (step === 4) {
      // KTX 高速鉄道イラスト
      return (
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-rose-700 shadow-xs">
          <Train className="w-5 h-5" />
        </div>
      );
    }

    if (step === 8) {
      // 韓屋（ハノク）＆ Nソウルタワー
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11 sm:w-13 sm:h-13">
          {/* 韓屋の反り屋根 */}
          <path d="M4 28 Q32 12 60 28 L52 34 Q32 22 12 34 Z" fill="#1B2A38" />
          <rect x="14" y="32" width="36" height="24" rx="2" fill="#FAF0EC" stroke="#B84E34" strokeWidth="2" />
          <rect x="26" y="38" width="12" height="18" fill="#D97706" />
        </svg>
      );
    }

    const IconMap: Record<number, React.FC<{ className?: string }>> = {
      3: Sparkles,
      5: Camera,
      6: Building2,
      7: Mic,
    };
    const FallbackIcon = IconMap[step] || Sparkles;

    return (
      <div
        style={{ borderColor: accentColor, color: accentColor }}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border-2 flex items-center justify-center shadow-xs"
      >
        <FallbackIcon className="w-5 h-5" />
      </div>
    );
  };

  return (
    <button
      type="button"
      onClick={() => {
        speechService.speak(labelKo);
        if (onClick) onClick();
      }}
      className="group flex flex-col items-center gap-1 cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
      title={`タップで発音: ${labelKo} (${labelJa})`}
    >
      <div className="relative">
        {renderVectorLandmark()}
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 group-hover:text-[#B84E34] shadow-2xs">
          <Volume2 className="w-2.5 h-2.5" />
        </span>
      </div>
      <div className="bg-white/95 backdrop-blur-xs border border-stone-200/90 px-2 py-0.5 rounded-lg shadow-2xs text-center">
        <span className="block text-[10px] font-black text-[#1B2A38] leading-tight whitespace-nowrap">
          {labelKo}
        </span>
        <span className="block text-[8.5px] font-bold text-stone-400 leading-tight whitespace-nowrap">
          {labelJa}
        </span>
      </div>
    </button>
  );
};

/**
 * 3. Duolingo風 トレジャーチェスト（宝箱ノード）
 */
export const TreasureChestNode: React.FC<{
  treasure: CultureTreasureCard;
  isOpened: boolean;
  onOpen: () => void;
}> = ({ treasure, isOpened, onOpen }) => {
  return (
    <div className="relative flex flex-col items-center z-10 my-1">
      {/* 未開封時のきらきらバウンドバッジ */}
      {!isOpened && (
        <div className="absolute -top-6 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black shadow-sm animate-bounce whitespace-nowrap z-20 flex items-center gap-1 border border-white">
          <Sparkles className="w-2.5 h-2.5 fill-amber-950" />
          <span>宝箱ボーナス！</span>
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        className={`w-15 h-14 sm:w-16 sm:h-15 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
          isOpened
            ? 'bg-amber-100 border-2 border-amber-300 text-amber-700 shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-none'
            : 'bg-gradient-to-b from-amber-400 to-amber-500 text-white border-2 border-amber-200 shadow-[0_6px_0_#b45309] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#b45309]'
        }`}
        title="韓国リアルカルチャー＆スラング宝箱"
      >
        {/* カスタムSVG宝箱 */}
        <svg viewBox="0 0 64 64" className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-2xs">
          {/* 箱の下部 */}
          <rect x="10" y="28" width="44" height="24" rx="4" fill={isOpened ? '#F59E0B' : '#B45309'} stroke="#78350F" strokeWidth="2.5" />
          {/* 箱のフタ */}
          <path
            d={isOpened ? 'M8 22 C8 10 56 10 56 22 Z' : 'M10 28 C10 16 54 16 54 28 Z'}
            fill="#FBBF24"
            stroke="#78350F"
            strokeWidth="2.5"
          />
          {/* 金具バンド */}
          <rect x="28" y="22" width="8" height="14" rx="2" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
          <circle cx="32" cy="29" r="2" fill="#78350F" />
        </svg>

        {isOpened && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-2xs">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
        )}
      </button>

      <span className="text-[10.5px] font-black text-amber-900 mt-1.5 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300/80">
        {isOpened ? `発見済: ${treasure.slangKo}` : 'K-カルチャー宝箱'}
      </span>
    </div>
  );
};

/**
 * 4. 宝箱開封モーダル（K-Culture & 生きたスラングカード）
 */
export const TreasureChestModal: React.FC<{
  treasure: CultureTreasureCard;
  districtName: string;
  onClose: () => void;
}> = ({ treasure, districtName, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-300 space-y-4 animate-in zoom-in-95 relative overflow-hidden">
        {/* 背景の装飾グラデーション */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* 上部ヘッダー */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
            <Gift className="w-3.5 h-3.5 text-amber-700" />
            <span>{districtName} のお宝発見！</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ホランイ祝福 */}
        <div className="flex justify-center py-1">
          <HorangiMascot
            size="md"
            mood="happy"
            message={`+${treasure.xpReward} XP 獲得！🎉`}
            subMessage="現地の生きた韓国語カードをゲット！"
            showXpBadge={true}
            xpAmount={treasure.xpReward}
          />
        </div>

        {/* スラング・カルチャーメインカード */}
        <div className="bg-gradient-to-br from-[#FAF7F2] to-amber-50/60 border-2 border-amber-200/90 rounded-2xl p-4 space-y-2.5 text-center shadow-inner">
          <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">
            REAL KOREAN CULTURE CARD
          </span>
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1B2A38]">
              {treasure.slangKo}
            </h3>
            <button
              type="button"
              onClick={() => speechService.speak(treasure.slangKo)}
              className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95"
              title="発音を聴く"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs font-mono font-bold text-[#B84E34]">
            [{treasure.slangReading}] — {treasure.originKo}
          </p>
          <div className="inline-block px-3 py-1 rounded-xl bg-white border border-amber-200 text-xs sm:text-sm font-black text-stone-800">
            意味：{treasure.meaningJa}
          </div>
        </div>

        {/* 文化的背景の解説 */}
        <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
          {treasure.description}
        </p>

        {/* 実践会話フレーズ */}
        <div className="bg-[#FAF0EC]/60 border border-[#F0D5CD] rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#B84E34]">💬 現地での使い方</span>
            <button
              type="button"
              onClick={() => speechService.speak(treasure.exampleKo)}
              className="text-[11px] font-bold text-[#B84E34] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> 音声を聴く
            </button>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#1B2A38]">{treasure.exampleKo}</p>
          <p className="text-[11px] text-stone-600">{treasure.exampleJa}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#B84E34] text-white font-black text-sm shadow-[0_5px_0_#853420] active:translate-y-1 active:shadow-[0_1px_0_#853420] transition-all cursor-pointer"
        >
          コレクションに保存して旅を続ける ➔
        </button>
      </div>
    </div>
  );
};
