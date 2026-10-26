import React, { useState } from 'react';
import {
  Check,
  Zap,
  Lock,
  Trophy,
  Sparkles,
  X,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { HorangiMascot } from '../mascot/HorangiMascot';
import { SeoulWorldDistrict } from '../../data/seoulWorldMap';
import { RoadmapStep } from '../../types/guide';
import { STAGE_DRILLS } from '../../data/stageMicroDrills';
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

// 380x900の座標系におけるノードの正確な位置（十分な上部余白と等間隔120px配置）
const TRAIL_COORDS = [
  { idx: 0, x: 190, y: 110 },   // Quest 1: 中央上部（余白110pxで切れない）
  { idx: 1, x: 275, y: 230 },   // Quest 2: 右へカーブ
  { idx: 2, x: 235, y: 350 },   // Quest 3: 緩やかに戻る
  { type: 'treasure', x: 135, y: 470 }, // 🎁 宝箱: 左岸へカーブ
  { idx: 3, x: 105, y: 590 },   // Quest 4: 左
  { idx: 4, x: 190, y: 710 },   // Quest 5: 中央へ復帰
  { type: 'boss', x: 190, y: 825 },     // 🏰 ボス検定: 中央ゴール
];

// 滑らかなS字の小道（ベジエ曲線）
const SVG_PATH_D = `
  M 190, 110
  C 190, 170  275, 170  275, 230
  C 275, 290  235, 290  235, 350
  C 235, 410  135, 410  135, 470
  C 135, 530  105, 530  105, 590
  C 105, 650  190, 650  190, 710
  C 190, 765  190, 770  190, 825
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
  // Duolingo風：ノードタップ時に下からスッと開く特訓開始シート
  const [previewTaskIdx, setPreviewTaskIdx] = useState<number | null>(null);

  const isChestOpened = !!completedQuests[`chest_s${step.step}`];

  // ロックされたノードをタップしたときのゴムのような触覚フィードバック
  const triggerLockedFeedback = (taskIdx: number) => {
    sound.playTap();
    setShakingIdx(taskIdx);
    setToastMessage(`前のクエスト（第${taskIdx}問）をクリアすると解放されます！`);
    setTimeout(() => setShakingIdx(null), 500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNodeClick = (taskIdx: number, isLocked: boolean) => {
    if (isLocked) {
      triggerLockedFeedback(taskIdx);
    } else {
      sound.playTap();
      setPreviewTaskIdx(taskIdx);
    }
  };

  const activeTask = previewTaskIdx !== null ? step.scopePriority.wbsBreakdown[previewTaskIdx] : null;
  const activeDrill = previewTaskIdx !== null ? STAGE_DRILLS[`s${step.step}_t${previewTaskIdx}`] : null;
  const isPreviewDone = previewTaskIdx !== null ? !!completedQuests[`s${step.step}_t${previewTaskIdx}`] : false;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#F8FAFC] border border-slate-200/60 shadow-xs">
      {/* 🌟 1. 背景のSVGなめらかリバートレイル ＆ 一体化された風景ベクター */}
      <div className="relative w-full aspect-[380/890] select-none">
        <svg
          viewBox="0 0 380 890"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* 漢江の水面グラデーション */}
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* 背景の柔らかな環境イラスト（川や芝生のシルエット） */}
          <ellipse cx="60" cy="200" rx="90" ry="60" fill="#F1F5F9" />
          <ellipse cx="320" cy="550" rx="100" ry="70" fill="#F1F5F9" />

          {/* 漢江のさざ波ベクター（Step 3など） */}
          {step.step === 3 && (
            <g opacity="0.35" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round">
              <path d="M 40, 220 Q 55, 215 70, 220 T 100, 220" />
              <path d="M 50, 235 Q 65, 230 80, 235" />
              <path d="M 280, 520 Q 295, 515 310, 520 T 340, 520" />
              <path d="M 290, 535 Q 305, 530 320, 535" />
            </g>
          )}

          {/* ① 地面の小道アンダーシャドウ（厚みと立体感） */}
          <path
            d={SVG_PATH_D}
            stroke="#CBD5E1"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />
          {/* ② メイン舗装路（清潔なオフホワイト） */}
          <path
            d={SVG_PATH_D}
            stroke="#FFFFFF"
            strokeWidth="40"
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
            opacity="0.35"
          />
        </svg>

        {/* 🌟 2. トレイル上のノード群（文字帯を全廃し、Duolingo本家の飛び石だけに純化） */}
        {step.scopePriority.wbsBreakdown.map((task, tIdx) => {
          const questKey = `s${step.step}_t${tIdx}`;
          const isDone = !!completedQuests[questKey];
          const isCurrent = tIdx === firstIncompleteIdx;
          const isLocked = !isDone && !isCurrent && !freeExploreMode;
          const coord = TRAIL_COORDS.find((c) => c.idx === tIdx) || { x: 190, y: 110 };
          const isShaking = shakingIdx === tIdx;

          return (
            <div
              key={tIdx}
              className="absolute z-20 flex flex-col items-center"
              style={{
                left: `${(coord.x / 380) * 100}%`,
                top: `${(coord.y / 890) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* 現在地の場合の START フキダシ ＆ オーラリング ＆ マスコット */}
              {isCurrent && (
                <>
                  {/* ふんわり呼吸する光のオーラ */}
                  <div
                    className="absolute w-[88px] h-[88px] rounded-[32px] animate-glow-pulse pointer-events-none"
                    style={{ backgroundColor: `${district.lineColor}25` }}
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

              {/* 🍬 触覚 3D キャンディノード ボタン（文字帯なし、純粋な飛び石） */}
              <button
                type="button"
                onClick={() => handleNodeClick(tIdx, isLocked)}
                className={`candy-stone w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] rounded-[26px] sm:rounded-[28px] flex items-center justify-center font-black cursor-pointer shadow-md active:scale-95 ${
                  isShaking ? 'animate-rubber' : ''
                } ${
                  isDone
                    ? 'bg-gradient-to-b from-[#10B981] to-[#059669] text-white border-b-[7px] border-[#047857]'
                    : isCurrent
                    ? 'bg-gradient-to-b from-[#D94632] to-[#B84E34] text-white border-b-[7px] border-[#853420]'
                    : 'bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0] text-slate-400 border-b-[6px] border-[#CBD5E1]'
                }`}
                title={`第${tIdx + 1}問`}
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
            </div>
          );
        })}

        {/* 🌟 3. 黄金のK-カルチャー宝箱（第3問のあとの小道カーブに配置） */}
        {(() => {
          const chestCoord = TRAIL_COORDS.find((c) => c.type === 'treasure') || { x: 135, y: 470 };
          return (
            <div
              className="absolute z-20 flex flex-col items-center"
              style={{
                left: `${(chestCoord.x / 380) * 100}%`,
                top: `${(chestCoord.y / 890) * 100}%`,
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
                className={`candy-stone w-[64px] h-[62px] sm:w-[70px] sm:h-[68px] rounded-[24px] flex items-center justify-center cursor-pointer shadow-md ${
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
            </div>
          );
        })()}

        {/* 🌟 4. 🏰 ボス検定（模試）ノード（小道の終着点に鎮座するマイルストーン） */}
        {(() => {
          const bossCoord = TRAIL_COORDS.find((c) => c.type === 'boss') || { x: 190, y: 825 };
          return (
            <div
              className="absolute z-20 flex flex-col items-center"
              style={{
                left: `${(bossCoord.x / 380) * 100}%`,
                top: `${(bossCoord.y / 890) * 100}%`,
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
                className={`candy-stone w-[80px] h-[78px] sm:w-[86px] sm:h-[84px] rounded-[30px] flex items-center justify-center font-black cursor-pointer shadow-lg active:scale-95 ${
                  isBossCleared
                    ? 'bg-gradient-to-b from-[#10B981] to-[#047857] text-white border-b-[8px] border-[#065F46]'
                    : isStageCleared
                    ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-white border-b-[8px] border-amber-800'
                    : 'bg-gradient-to-b from-[#334155] to-[#1E293B] text-white border-b-[7px] border-[#0F172A]'
                }`}
                title={qMeta.bossLabel}
              >
                <Trophy className="w-10 h-10 text-amber-300 drop-shadow-sm" />
              </button>

              <div className="mt-2.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md shadow-xs border border-slate-200/60 text-center max-w-[210px] pointer-events-none select-none">
                <span className="block text-xs font-black text-slate-800 leading-tight">
                  {qMeta.bossLabel}
                </span>
                <span className="block text-[9.5px] font-bold text-slate-400 leading-tight mt-0.5">
                  {isBossCleared
                    ? `合格達成 (${bossScore}点)`
                    : isStageCleared
                    ? `合格基準: ${qMeta.bossPassScore}点 (挑戦可能！)`
                    : `全5問クリアで解放`}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 🌟 5. Duolingo風：ノードタップ時に下からスッと開く特訓プレビュー・モーダル */}
      {previewTaskIdx !== null && activeTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-6 sm:zoom-in-95 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 上部バー */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#B84E34]">
                <Zap className="w-4 h-4 fill-[#B84E34]" />
                <span>Area {step.step} : 第 {previewTaskIdx + 1} 問</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTaskIdx(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* レッスンタイトル ＆ シナリオ */}
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {activeDrill?.title || activeTask.replace(/^[①-⑤\d\.\s]+/, '')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {qMeta.scenarioTitle}
              </p>
            </div>

            {/* ホランイ応援メッセージ */}
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100">
              <HorangiMascot size="sm" mood={isPreviewDone ? 'trophy' : 'cheering'} showMessage={false} interactive={false} />
              <div className="text-xs text-slate-700">
                <span className="font-bold block">
                  {isPreviewDone ? 'クリア済み！何度でも復習できます' : '30秒で集中特訓！'}
                </span>
                <span className="text-[11px] text-slate-400">
                  即答クイズで知識を定着させよう (+60 XP)
                </span>
              </div>
            </div>

            {/* スタートボタン */}
            <button
              type="button"
              onClick={() => {
                const targetIdx = previewTaskIdx;
                setPreviewTaskIdx(null);
                onStartDrill(step.step, targetIdx);
              }}
              className="w-full py-4 rounded-2xl bg-[#B84E34] hover:bg-[#a2432c] text-white font-black text-sm sm:text-base shadow-[0_5px_0_#853420] active:translate-y-1 active:shadow-[0_1px_0_#853420] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
              <span>{isPreviewDone ? 'もう一度特訓する (+60 XP)' : '30秒特訓をスタート (+60 XP)'}</span>
            </button>
          </div>
        </div>
      )}

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
