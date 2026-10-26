import React, { useState } from 'react';
import {
  Check,
  Zap,
  Lock,
  Trophy,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { HorangiMascot } from '../mascot/HorangiMascot';
import { SeoulWorldDistrict } from '../../data/seoulWorldMap';
import { RoadmapStep } from '../../types/guide';
import { STAGE_DRILLS } from '../../data/stageMicroDrills';
import { speechService } from '../../utils/speech';
import { sound } from '../../utils/audioSynth';

interface TrailPathCanvasProps {
  step: RoadmapStep;
  district: SeoulWorldDistrict;
  qMeta: {
    scenarioTitle: string;
    bossLabel: string;
    bossPassScore: number;
  };
  stepMeta: {
    examId: string;
  };
  firstIncompleteIdx: number;
  completedQuests: Record<string, boolean>;
  freeExploreMode: boolean;
  bossScore?: number;
  isBossCleared: boolean;
  isStageCleared: boolean;
  onStartDrill: (stepNum: number, taskIdx: number) => void;
  onOpenTreasure: (stepNum: number) => void;
  onNavigateToExam?: (examId: string) => void;
}

// 380x800の座標系におけるノードの正確な位置
const TRAIL_COORDS = [
  { idx: 0, x: 190, y: 70 },   // Quest 1: 中央
  { idx: 1, x: 275, y: 175 },  // Quest 2: 右へカーブ
  { idx: 2, x: 235, y: 295 },  // Quest 3: 緩やかに戻る
  { type: 'treasure', x: 135, y: 405 }, // 🎁 宝箱: 左岸へカーブ
  { idx: 3, x: 105, y: 515 },  // Quest 4: 左
  { idx: 4, x: 190, y: 625 },  // Quest 5: 中央へ復帰
  { type: 'boss', x: 190, y: 735 },     // 🏰 ボス検定: 中央ゴール
];

// 滑らかなS字の小道（ベジエ曲線）
const SVG_PATH_D = `
  M 190, 70
  C 190, 120  275, 120  275, 175
  C 275, 235  235, 235  235, 295
  C 235, 350  135, 350  135, 405
  C 135, 460  105, 460  105, 515
  C 105, 570  190, 570  190, 625
  C 190, 680  190, 685  190, 735
`;

export const TrailPathCanvas: React.FC<TrailPathCanvasProps> = ({
  step,
  district,
  qMeta,
  stepMeta,
  firstIncompleteIdx,
  completedQuests,
  freeExploreMode,
  bossScore,
  isBossCleared,
  isStageCleared,
  onStartDrill,
  onOpenTreasure,
  onNavigateToExam,
}) => {
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isChestOpened = !!completedQuests[`chest_s${step.step}`];

  // ロックされたノードをタップしたときのゴムのような触覚フィードバック
  const triggerLockedFeedback = (taskIdx: number) => {
    sound.playTap();
    setShakingIdx(taskIdx);
    setToastMessage(`前のクエスト（第${taskIdx}問）をクリアすると解放されます！`);
    setTimeout(() => setShakingIdx(null), 500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/80 to-[#F8FAFC] border border-slate-200/80 shadow-xs">
      {/* 🌟 1. 背景のSVGなめらかリバートレイル */}
      <div className="relative w-full aspect-[380/820] select-none">
        <svg
          viewBox="0 0 380 820"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ① 地面の小道アンダーシャドウ */}
          <path
            d={SVG_PATH_D}
            stroke="#CBD5E1"
            strokeWidth="46"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.45"
          />
          {/* ② メイン舗装路（清潔なオフホワイト） */}
          <path
            d={SVG_PATH_D}
            stroke="#FFFFFF"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* ③ 路線カラーの石畳センターライン */}
          <path
            d={SVG_PATH_D}
            stroke={district.lineColor}
            strokeWidth="6"
            strokeDasharray="10 14"
            strokeLinecap="round"
            fill="none"
            opacity="0.38"
          />
        </svg>

        {/* 🌟 2. 街並みランドマーク（小道が曲がることで生まれた自然なオープンスペースに配置） */}
        {/* 左岸ランドマーク（Quest 2が右にカーブした左側の広場） */}
        <div
          className="absolute z-10 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ left: '16%', top: '21%', transform: 'translate(-50%, -50%)' }}
          onClick={() => {
            sound.playTap();
            speechService.speak(district.landmarks.topLeft.labelKo);
          }}
          title={`タップで発音: ${district.landmarks.topLeft.labelKo}`}
        >
          <div className="flex flex-col items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-2 rounded-2xl shadow-xs border border-slate-200/60">
            <div className="text-2xl">{district.landmarks.topLeft.emoji}</div>
            <div className="text-center">
              <span className="block text-[10px] font-black text-slate-800 leading-tight">
                {district.landmarks.topLeft.labelKo}
              </span>
              <span className="block text-[8.5px] font-bold text-slate-400 leading-tight">
                {district.landmarks.topLeft.labelJa}
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-slate-400 text-[8.5px] font-bold">
              <Volume2 className="w-2.5 h-2.5 text-[#B84E34]" />
              <span>発音</span>
            </div>
          </div>
        </div>

        {/* 右岸ランドマーク（Quest 4が左にカーブした右側の広場） */}
        <div
          className="absolute z-10 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ left: '80%', top: '61%', transform: 'translate(-50%, -50%)' }}
          onClick={() => {
            sound.playTap();
            speechService.speak(district.landmarks.midRight.labelKo);
          }}
          title={`タップで発音: ${district.landmarks.midRight.labelKo}`}
        >
          <div className="flex flex-col items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-2 rounded-2xl shadow-xs border border-slate-200/60">
            <div className="text-2xl">{district.landmarks.midRight.emoji}</div>
            <div className="text-center">
              <span className="block text-[10px] font-black text-slate-800 leading-tight">
                {district.landmarks.midRight.labelKo}
              </span>
              <span className="block text-[8.5px] font-bold text-slate-400 leading-tight">
                {district.landmarks.midRight.labelJa}
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-slate-400 text-[8.5px] font-bold">
              <Volume2 className="w-2.5 h-2.5 text-[#B84E34]" />
              <span>発音</span>
            </div>
          </div>
        </div>

        {/* 🌟 3. トレイル上のノード群（ベジエ曲線と100%一致した座標でレンダリング） */}
        {step.scopePriority.wbsBreakdown.map((task, tIdx) => {
          const questKey = `s${step.step}_t${tIdx}`;
          const isDone = !!completedQuests[questKey];
          const isCurrent = tIdx === firstIncompleteIdx;
          const isLocked = !isDone && !isCurrent && !freeExploreMode;
          const coord = TRAIL_COORDS.find((c) => c.idx === tIdx) || { x: 190, y: 100 };
          const drill = STAGE_DRILLS[questKey];
          const displayTitle = drill?.title || task.replace(/^[①-⑤\d\.\s]+/, '');
          const isShaking = shakingIdx === tIdx;

          return (
            <div
              key={tIdx}
              className="absolute z-20 flex flex-col items-center"
              style={{
                left: `${(coord.x / 380) * 100}%`,
                top: `${(coord.y / 820) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* 現在地の場合の START フキダシ ＆ オーラリング ＆ マスコット */}
              {isCurrent && (
                <>
                  {/* ふんわり呼吸する光のオーラ */}
                  <div
                    className="absolute w-[86px] h-[86px] rounded-[30px] animate-glow-pulse pointer-events-none"
                    style={{ backgroundColor: `${district.lineColor}30` }}
                  />

                  {/* 浮遊する START バッジ */}
                  <div className="absolute -top-8 px-3 py-1 rounded-full bg-[#B84E34] text-white text-[11px] font-black shadow-md flex items-center gap-1 ring-2 ring-white z-30 animate-bounce whitespace-nowrap">
                    <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>START</span>
                  </div>

                  {/* ホランイ（マスコット）がノードの隣から笑顔で応援 */}
                  <div className="absolute -left-12 sm:-left-14 -top-3 z-30 pointer-events-none">
                    <HorangiMascot size="sm" mood="cheering" showMessage={false} interactive={false} />
                  </div>
                </>
              )}

              {/* 🍬 触覚 3D キャンディノード ボタン */}
              <button
                type="button"
                onClick={() => {
                  if (isLocked) {
                    triggerLockedFeedback(tIdx);
                  } else {
                    onStartDrill(step.step, tIdx);
                  }
                }}
                className={`candy-stone w-[66px] h-[66px] sm:w-[72px] sm:h-[72px] rounded-[24px] sm:rounded-[26px] flex items-center justify-center font-black cursor-pointer shadow-md ${
                  isShaking ? 'animate-rubber' : ''
                } ${
                  isDone
                    ? 'bg-gradient-to-b from-[#10B981] to-[#059669] text-white border-b-[7px] border-[#047857]'
                    : isCurrent
                    ? 'bg-gradient-to-b from-[#D94632] to-[#B84E34] text-white border-b-[7px] border-[#853420]'
                    : 'bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0] text-slate-400 border-b-[6px] border-[#CBD5E1]'
                }`}
                title={displayTitle}
              >
                {isDone ? (
                  <div className="relative flex items-center justify-center">
                    <Check className="w-8 h-8 stroke-[3.5]" />
                    <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300 absolute -top-1.5 -right-1.5 animate-star-spin" />
                  </div>
                ) : isCurrent ? (
                  <Zap className="w-8 h-8 fill-amber-300 text-amber-300" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-400 stroke-[2.2]" />
                )}
              </button>

              {/* ノード下部のミニタイトル（枠線地獄を廃止した清潔なフローティングピル） */}
              <div className="mt-2.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md shadow-xs border border-slate-200/60 pointer-events-none select-none">
                <span className="block text-[11px] font-black text-slate-700 whitespace-nowrap break-keep leading-tight">
                  {displayTitle}
                </span>
              </div>
            </div>
          );
        })}

        {/* 🌟 4. 黄金のK-カルチャー宝箱（第3問のあとの小道カーブに配置） */}
        {(() => {
          const chestCoord = TRAIL_COORDS.find((c) => c.type === 'treasure') || { x: 135, y: 405 };
          return (
            <div
              className="absolute z-20 flex flex-col items-center"
              style={{
                left: `${(chestCoord.x / 380) * 100}%`,
                top: `${(chestCoord.y / 820) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {!isChestOpened && (
                <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10.5px] font-black shadow-sm animate-bounce flex items-center gap-1 ring-2 ring-white whitespace-nowrap z-30">
                  <Sparkles className="w-3 h-3 fill-amber-950" />
                  <span>宝箱ボーナス！</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onOpenTreasure(step.step)}
                className={`candy-stone w-[62px] h-[60px] sm:w-[68px] sm:h-[66px] rounded-[22px] flex items-center justify-center cursor-pointer shadow-md ${
                  isChestOpened
                    ? 'bg-gradient-to-b from-amber-100 to-amber-200 border-b-[5px] border-amber-400 text-amber-700'
                    : 'bg-gradient-to-b from-amber-400 to-amber-500 border-b-[7px] border-amber-700 text-white'
                }`}
                title="韓国リアル文化＆スラング宝箱"
              >
                <svg viewBox="0 0 64 64" className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-2xs">
                  <rect
                    x="10"
                    y="28"
                    width="44"
                    height="24"
                    rx="4"
                    fill={isChestOpened ? '#F59E0B' : '#B45309'}
                    stroke="#78350F"
                    strokeWidth="2.5"
                  />
                  <path
                    d={isChestOpened ? 'M8 22 C8 10 56 10 56 22 Z' : 'M10 28 C10 16 54 16 54 28 Z'}
                    fill="#FBBF24"
                    stroke="#78350F"
                    strokeWidth="2.5"
                  />
                  <rect x="28" y="22" width="8" height="14" rx="2" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
                  <circle cx="32" cy="29" r="2" fill="#78350F" />
                </svg>

                {isChestOpened && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>

              <div className="mt-2 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200/80 shadow-2xs pointer-events-none">
                <span className="block text-[10px] font-black text-amber-900 whitespace-nowrap">
                  {isChestOpened ? district.treasure.slangKo : 'K-カルチャー宝箱'}
                </span>
              </div>
            </div>
          );
        })()}

        {/* 🌟 5. 🏰 ボス検定（模試）ノード（小道の終着点に鎮座するマイルストーン） */}
        {(() => {
          const bossCoord = TRAIL_COORDS.find((c) => c.type === 'boss') || { x: 190, y: 735 };
          return (
            <div
              className="absolute z-20 flex flex-col items-center"
              style={{
                left: `${(bossCoord.x / 380) * 100}%`,
                top: `${(bossCoord.y / 820) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {isBossCleared ? (
                <div className="absolute -top-8 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-md flex items-center gap-1 ring-2 ring-white whitespace-nowrap z-30">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>エリア完全制覇！</span>
                </div>
              ) : isStageCleared ? (
                <div className="absolute -top-8 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black shadow-md animate-bounce flex items-center gap-1 ring-2 ring-white whitespace-nowrap z-30">
                  <Trophy className="w-3.5 h-3.5 text-amber-200" />
                  <span>ボス検定に挑戦！</span>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  if (onNavigateToExam) {
                    onNavigateToExam(stepMeta.examId);
                  }
                }}
                className={`candy-stone w-[76px] h-[74px] sm:w-[84px] sm:h-[82px] rounded-[28px] sm:rounded-[32px] flex items-center justify-center font-black cursor-pointer shadow-lg ${
                  isBossCleared
                    ? 'bg-gradient-to-b from-[#10B981] to-[#047857] text-white border-b-[8px] border-[#065F46]'
                    : isStageCleared
                    ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-white border-b-[8px] border-amber-800'
                    : 'bg-gradient-to-b from-[#334155] to-[#1E293B] text-white border-b-[7px] border-[#0F172A]'
                }`}
                title={qMeta.bossLabel}
              >
                <Trophy className="w-9 h-9 sm:w-10 sm:h-10 text-amber-300 drop-shadow-sm" />
              </button>

              <div className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-xs border border-slate-200/70 text-center max-w-[210px] pointer-events-none select-none">
                <span className="block text-xs font-black text-slate-800 leading-tight">
                  {qMeta.bossLabel}
                </span>
                <span className="block text-[9.5px] font-bold text-slate-400 leading-tight mt-0.5">
                  {isBossCleared
                    ? `合格達成 (${bossScore}点)`
                    : isStageCleared
                    ? `合格基準: ${qMeta.bossPassScore}点 (挑戦可能！)`
                    : `全5問クリアで解放 (合格ライン: ${qMeta.bossPassScore}点)`}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ロック時のトースト案内 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 max-w-sm text-center animate-in fade-in zoom-in-95">
          <Lock className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
