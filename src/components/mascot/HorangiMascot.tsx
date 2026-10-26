import React, { useState } from 'react';
import { Sparkles, Trophy, Heart } from 'lucide-react';
import { speechService } from '../../utils/speech';

export type MascotMood =
  | 'idle'
  | 'cheering'
  | 'happy'
  | 'encouraging'
  | 'studying'
  | 'trophy';

export interface HorangiMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  message?: string;
  subMessage?: string;
  showMessage?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  showXpBadge?: boolean;
  xpAmount?: number;
  speechText?: string;
}

export const HorangiMascot: React.FC<HorangiMascotProps> = ({
  mood = 'idle',
  size = 'md',
  message,
  subMessage,
  showMessage = true,
  interactive = true,
  onClick,
  className = '',
  showXpBadge = false,
  xpAmount = 60,
  speechText,
}) => {
  const [isJumping, setIsJumping] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  // サイズ定義
  const sizeMap = {
    sm: { box: 'w-12 h-12', svg: 48 },
    md: { box: 'w-20 h-20', svg: 80 },
    lg: { box: 'w-28 h-28', svg: 112 },
    hero: { box: 'w-36 h-36 sm:w-44 sm:h-44', svg: 160 },
  };

  const { box, svg } = sizeMap[size];

  // タップした時のリアクション
  const handleClick = () => {
    if (!interactive) return;

    setIsJumping(true);
    setShowHearts(true);
    setTimeout(() => setIsJumping(false), 750);
    setTimeout(() => setShowHearts(false), 1200);

    // 韓国語音声による励ましリアクション
    const phrases = [
      '화이팅!',
      '잘하고 있어요!',
      '대단해요!',
      '오늘도 힘내세요!',
      '참 잘했어요!',
    ];
    const phrase = speechText || phrases[Math.floor(Math.random() * phrases.length)];
    speechService.speak(phrase);

    if (onClick) {
      onClick();
    }
  };

  // 気分に応じたアニメーションクラス
  let bodyAnimClass = 'animate-mascot-breathe';
  if (isJumping || mood === 'happy') {
    bodyAnimClass = 'animate-mascot-jump';
  } else if (mood === 'encouraging') {
    bodyAnimClass = 'animate-mascot-wobble';
  }

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* 吹き出し (Speech Bubble) */}
      {showMessage && message && (
        <div className="mb-2 z-20 animate-speech-pop max-w-[240px] sm:max-w-[280px]">
          <div className="relative bg-white text-stone-800 text-xs font-black px-3.5 py-2 rounded-2xl shadow-md border-2 border-stone-200/90 text-center">
            <p className="text-stone-900 leading-snug">{message}</p>
            {subMessage && (
              <p className="text-[10.5px] font-medium text-stone-500 mt-0.5">{subMessage}</p>
            )}
            {/* 吹き出しの三角の尻尾 */}
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]" />
          </div>
        </div>
      )}

      {/* タップ時の浮遊ハート・星演出 */}
      {showHearts && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-1 animate-in fade-in zoom-in duration-300">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
          <Sparkles className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
        </div>
      )}

      {/* +XP 獲得時の浮遊バッジ */}
      {showXpBadge && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-xp-float">
          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-[#B84E34] text-white font-black text-xs shadow-lg whitespace-nowrap flex items-center gap-1 border border-amber-200">
            <Sparkles className="w-3 h-3 fill-amber-200" />
            +{xpAmount} XP
          </span>
        </div>
      )}

      {/* ホランイ（韓国の虎）ベクターキャラクター本体 */}
      <div
        onClick={handleClick}
        className={`${box} relative shrink-0 cursor-pointer transition-transform active:scale-95 ${bodyAnimClass}`}
        title={interactive ? 'タップしてね！応援してくれるよ' : undefined}
      >
        <svg
          viewBox="0 0 160 160"
          width={svg}
          height={svg}
          className="w-full h-full overflow-visible drop-shadow-sm"
        >
          {/* 影 */}
          <ellipse
            cx="80"
            cy="150"
            rx="46"
            ry="8"
            fill="#1B2A38"
            opacity="0.12"
          />

          {/* しっぽ（揺れる） */}
          <g className="animate-mascot-tail" style={{ transformOrigin: '40px 130px' }}>
            <path
              d="M40 128 C20 120 15 90 28 80 C32 76 38 82 34 88 C25 98 28 116 42 122 Z"
              fill="#F59E0B"
            />
            {/* しっぽの縞模様 */}
            <path d="M24 105 C20 102 22 96 27 98" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            <path d="M28 92 C26 88 30 84 33 86" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            {/* しっぽの先（白） */}
            <circle cx="28" cy="80" r="5" fill="#FFFFFF" />
          </g>

          {/* 体（ふっくらした洋梨型） */}
          <path
            d="M50 144 C42 144 42 108 55 96 C64 88 96 88 105 96 C118 108 118 144 110 144 Z"
            fill="#F59E0B"
          />

          {/* 韓服風チョッキ（배자 / ベスト） */}
          <path
            d="M52 144 C48 136 52 106 64 98 C72 106 88 106 96 98 C108 106 112 136 108 144 Z"
            fill="#FAF0EC"
            stroke="#F0D5CD"
            strokeWidth="2"
          />
          {/* チョッキの胸の飾り紐（テディ / メドゥプ） */}
          <circle cx="80" cy="114" r="4" fill="#B84E34" />
          <path d="M80 118 L76 130 M80 118 L84 130" stroke="#B84E34" strokeWidth="2.5" strokeLinecap="round" />

          {/* 足 */}
          <ellipse cx="60" cy="145" rx="14" ry="7" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
          <ellipse cx="100" cy="145" rx="14" ry="7" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />

          {/* 頭のベース（大きな丸い輪郭） */}
          <circle cx="80" cy="62" r="44" fill="#FBBF24" />

          {/* 両耳 */}
          {/* 左耳 */}
          <g>
            <circle cx="44" cy="26" r="15" fill="#F59E0B" />
            <circle cx="44" cy="26" r="9" fill="#FDA4AF" />
            <circle cx="48" cy="30" r="4" fill="#FFFFFF" opacity="0.6" />
          </g>
          {/* 右耳 */}
          <g>
            <circle cx="116" cy="26" r="15" fill="#F59E0B" />
            <circle cx="116" cy="26" r="9" fill="#FDA4AF" />
            <circle cx="112" cy="30" r="4" fill="#FFFFFF" opacity="0.6" />
          </g>

          {/* 額の虎縞模様（スタイリッシュな「王」字風） */}
          <path d="M72 32 L88 32" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M74 38 L86 38" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M80 30 L80 44" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />

          {/* ほっぺの虎縞（左右） */}
          <path d="M38 60 L45 62 M37 68 L46 68" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M122 60 L115 62 M123 68 L114 68" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />

          {/* 韓国伝統の青＆テラコッタはちまき（アクセント） */}
          <path
            d="M40 45 C60 38 100 38 120 45"
            stroke="#1E3A8A"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* はちまきの中央メダル */}
          <circle cx="80" cy="41" r="5" fill="#F59E0B" stroke="#B84E34" strokeWidth="1.5" />

          {/* 白いマズル（口元とほっぺのふくらみ） */}
          <ellipse cx="68" cy="74" rx="14" ry="11" fill="#FFFFFF" />
          <ellipse cx="92" cy="74" rx="14" ry="11" fill="#FFFFFF" />
          <ellipse cx="80" cy="77" rx="12" ry="9" fill="#FFFFFF" />

          {/* ほっぺのチーク（ピンクの照れ） */}
          <ellipse cx="50" cy="72" rx="7" ry="4" fill="#FB7185" opacity="0.55" />
          <ellipse cx="110" cy="72" rx="7" ry="4" fill="#FB7185" opacity="0.55" />

          {/* 鼻（イチゴピンクの小さな逆三角形） */}
          <path
            d="M76 68 C78 67 82 67 84 68 C85 71 81 74 80 75 C79 74 75 71 76 68 Z"
            fill="#E11D48"
          />

          {/* お口（猫口 ω） */}
          <path
            d="M73 75 C75 79 79 79 80 76 C81 79 85 79 87 75"
            fill="none"
            stroke="#1F2937"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 目（気分によって切り替え） */}
          {mood === 'happy' || isJumping ? (
            /* ニッコリ目（^ ^） */
            <g>
              <path
                d="M58 58 C62 52 70 52 74 58"
                fill="none"
                stroke="#1F2937"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M86 58 C90 52 98 52 102 58"
                fill="none"
                stroke="#1F2937"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* きらきら星 */}
              <path d="M46 48 L48 52 L52 54 L48 56 L46 60 L44 56 L40 54 L44 52 Z" fill="#F59E0B" />
              <path d="M114 48 L116 52 L120 54 L116 56 L114 60 L112 56 L108 54 L112 52 Z" fill="#F59E0B" />
            </g>
          ) : mood === 'encouraging' ? (
            /* 優しい困り笑顔（うるうる・ファイト） */
            <g>
              {/* 眉毛（八の字） */}
              <path d="M58 48 L68 51" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M102 48 L92 51" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
              {/* 瞳 */}
              <circle cx="65" cy="57" r="7" fill="#1F2937" />
              <circle cx="63" cy="55" r="2.8" fill="#FFFFFF" />
              <circle cx="67" cy="59" r="1.5" fill="#FFFFFF" />
              <circle cx="95" cy="57" r="7" fill="#1F2937" />
              <circle cx="93" cy="55" r="2.8" fill="#FFFFFF" />
              <circle cx="97" cy="59" r="1.5" fill="#FFFFFF" />
            </g>
          ) : (
            /* 通常のぱっちり目（まばたきアニメーション連動） */
            <g className="animate-mascot-blink" style={{ transformOrigin: '80px 57px' }}>
              {/* 左目 */}
              <circle cx="65" cy="57" r="7.5" fill="#1F2937" />
              <circle cx="63" cy="54" r="3" fill="#FFFFFF" />
              <circle cx="67" cy="59" r="1.5" fill="#FFFFFF" />
              {/* 右目 */}
              <circle cx="95" cy="57" r="7.5" fill="#1F2937" />
              <circle cx="93" cy="54" r="3" fill="#FFFFFF" />
              <circle cx="97" cy="59" r="1.5" fill="#FFFFFF" />
              {/* まつげ・まゆげ */}
              <path d="M59 47 C63 45 69 46 72 48" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M101 47 C97 45 91 46 88 48" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 前足・手 */}
          {mood === 'happy' || isJumping ? (
            /* 万歳ハイタッチの手（両手アップ！） */
            <g>
              <ellipse cx="44" cy="80" rx="9" ry="12" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" transform="rotate(-30 44 80)" />
              <ellipse cx="116" cy="80" rx="9" ry="12" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" transform="rotate(30 116 80)" />
              {/* 肉球 */}
              <circle cx="43" cy="78" r="3" fill="#FDA4AF" />
              <circle cx="117" cy="78" r="3" fill="#FDA4AF" />
            </g>
          ) : mood === 'trophy' ? (
            /* 金のトロフィーを抱えている */
            <g>
              {/* トロフィー */}
              <path d="M72 108 L88 108 L85 124 L75 124 Z" fill="#F59E0B" />
              <rect x="73" y="124" width="14" height="6" rx="2" fill="#B45309" />
              <path d="M68 96 L92 96 C92 108 86 112 80 112 C74 112 68 108 68 96 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
              {/* トロフィーの取っ手 */}
              <path d="M68 98 C62 98 62 106 68 106" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path d="M92 98 C98 98 98 106 92 106" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              {/* 抱える両手 */}
              <circle cx="66" cy="108" r="7" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="94" cy="108" r="7" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
            </g>
          ) : mood === 'studying' ? (
            /* 韓国語のノート・本を持っている */
            <g>
              {/* ミニ本 */}
              <rect x="68" y="104" width="24" height="20" rx="3" fill="#B84E34" />
              <rect x="70" y="106" width="10" height="16" rx="1" fill="#FFFFFF" />
              <rect x="80" y="106" width="10" height="16" rx="1" fill="#FAF0EC" />
              <text x="73" y="117" fontSize="7" fontWeight="bold" fill="#B84E34">한</text>
              {/* 添える手 */}
              <circle cx="66" cy="114" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="94" cy="114" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
            </g>
          ) : (
            /* 通常の手（ちょこんと前に揃える） */
            <g>
              <circle cx="68" cy="116" r="7" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="92" cy="116" r="7" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
              {/* ピンクの小さな肉球 */}
              <circle cx="68" cy="116" r="2.5" fill="#FDA4AF" />
              <circle cx="92" cy="116" r="2.5" fill="#FDA4AF" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
