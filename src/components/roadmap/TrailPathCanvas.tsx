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
          <ellipse cx="60" cy="200" rx="90" ry="60" fill="#E2E8F0" opacity="0.5" />
          <ellipse cx="320" cy="550" rx="100" ry="70" fill="#E2E8F0" opacity="0.5" />

          {/* 小道脇の飛び石・自然のディテール */}
          <circle cx="85" cy="160" r="5" fill="#CBD5E1" opacity="0.6" />
          <circle cx="95" cy="170" r="3" fill="#CBD5E1" opacity="0.4" />
          <circle cx="305" cy="280" r="6" fill="#CBD5E1" opacity="0.6" />
          <circle cx="295" cy="295" r="4" fill="#CBD5E1" opacity="0.4" />
          <circle cx="80" cy="530" r="5" fill="#CBD5E1" opacity="0.6" />
          <circle cx="280" cy="670" r="6" fill="#CBD5E1" opacity="0.6" />

          {/* 漢江の水面さざ波＆ピクニックシート（Step 3など） */}
          {step.step === 3 && (
            <g opacity="0.5" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 35, 215 Q 50, 210 65, 215 T 95, 215" />
              <path d="M 45, 230 Q 60, 225 75, 230" />
              <path d="M 275, 515 Q 290, 510 305, 515 T 335, 515" />
              <path d="M 285, 530 Q 300, 525 315, 530" />
              {/* ピクニックシート */}
              <rect x="25" y="440" width="28" height="18" rx="3" fill="#FDE047" opacity="0.75" transform="rotate(-8 25 440)" />
              <rect x="28" y="443" width="22" height="12" rx="2" fill="#FEF08A" opacity="0.9" transform="rotate(-8 25 440)" />
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

        {/* 🌟 2. トレイル上のノード群（Duolingo本家 3D円形コイン ＆ 外周プログレスリング） */}
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
              {/* 現在地の場合：START フキダシ ＆ 外周リング ＆ マスコット */}
              {isCurrent && (
                <>
                  {/* 浮遊する START バッジ（下向きポインター矢印付き） */}
                  <div className="absolute -top-12 flex flex-col items-center animate-bounce z-30 pointer-events-none select-none">
                    <div className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-black shadow-lg flex items-center gap-1.5 ring-2 ring-white tracking-wider whitespace-nowrap">
                      <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>START</span>
                    </div>
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900 -mt-0.5" />
                  </div>

                  {/* ホランイ（マスコット）がトレイル脇の地面に立ってフキダシで応援 */}
                  <div className="absolute -left-18 sm:-left-22 top-0 z-30 flex flex-col items-center pointer-events-none select-none">
                    <div className="relative mb-1.5 px-2.5 py-1 bg-white rounded-xl shadow-md border border-slate-200/90 text-[10px] font-black text-slate-800 whitespace-nowrap">
                      <span>{district.shortTitle} 出発！</span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white" />
                    </div>
                    <HorangiMascot size="sm" mood="cheering" showMessage={false} interactive={false} />
                    <div className="w-10 h-2 bg-slate-900/15 rounded-full blur-[1px] -mt-1" />
                  </div>
                </>
              )}

              {/* 🌟 Duolingo本家 3D円形コイン（完全な円・8pxシリンダー沈み込み） */}
              <div className="relative flex items-center justify-center">
                {/* 外周プログレスリング（現在のアクティブノードに太い円弧ゲージ） */}
                {isCurrent && (
                  <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] -rotate-90 pointer-events-none">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="43"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="43"
                      fill="none"
                      stroke={district.lineColor || '#B84E34'}
                      strokeWidth="6"
                      strokeDasharray={270}
                      strokeDashoffset={270 * 0.75}
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                <button
                  type="button"
                  onClick={() => handleNodeClick(tIdx, isLocked)}
                  className={`w-[74px] h-[74px] sm:w-[80px] sm:h-[80px] rounded-full flex items-center justify-center font-black cursor-pointer select-none transition-all relative ${
                    isShaking ? 'animate-rubber' : ''
                  } ${
                    isDone
                      ? 'bg-gradient-to-b from-[#10B981] to-[#059669] text-white border-b-[8px] border-[#047857] hover:brightness-105 active:translate-y-[6px] active:border-b-[2px]'
                      : isCurrent
                      ? 'bg-gradient-to-b from-[#EA580C] to-[#C2410C] text-white border-b-[8px] border-[#9A3412] hover:brightness-105 active:translate-y-[6px] active:border-b-[2px]'
                      : 'bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0] text-slate-400 border-b-[7px] border-[#CBD5E1] cursor-pointer active:translate-y-[4px] active:border-b-[3px]'
                  }`}
                  title={`第${tIdx + 1}問`}
                >
                  {/* 上部の光彩ハイライト（Duolingo特有のツヤ感） */}
                  <span className="absolute top-2 w-7 h-2.5 rounded-full bg-white/35 pointer-events-none" />

                  {isDone ? (
                    <div className="relative flex items-center justify-center">
                      <Check className="w-9 h-9 stroke-[4]" />
                      <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300 absolute -top-2 -right-2 animate-star-spin" />
                    </div>
                  ) : isCurrent ? (
                    <Zap className="w-9 h-9 fill-amber-300 text-amber-300 drop-shadow-xs" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* 🌟 3. 本格 3D ベクター宝箱（木箱・金の金具・石畳の台座） */}
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
                <div className="absolute -top-10 flex flex-col items-center animate-bounce z-30 pointer-events-none select-none">
                  <div className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[10.5px] font-black shadow-md flex items-center gap-1 ring-2 ring-white whitespace-nowrap">
                    <Sparkles className="w-3 h-3 fill-amber-950 text-amber-950" />
                    <span>宝箱ボーナス！</span>
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-amber-400" />
                </div>
              )}

              {/* 宝箱の石畳台座（地面の影） */}
              <div className="absolute bottom-1 w-20 h-5 bg-slate-900/15 rounded-full blur-[2px] pointer-events-none" />

              {/* 立体的なベクター宝箱ボタン */}
              <button
                type="button"
                onClick={() => onOpenTreasure(step.step)}
                className="group relative cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none"
                title="韓国リアル文化＆流行語の宝箱を開く"
              >
                <svg viewBox="0 0 80 72" className="w-[74px] h-[66px] sm:w-[82px] sm:h-[74px] drop-shadow-md">
                  {/* 宝箱の下部ボディ（深い木目） */}
                  <rect x="12" y="32" width="56" height="30" rx="6" fill="#8B4513" stroke="#5C2C0B" strokeWidth="2.5" />
                  {/* 金の金具バンド（左右） */}
                  <rect x="22" y="32" width="7" height="30" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                  <rect x="51" y="32" width="7" height="30" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                  {/* 鋲（リベット） */}
                  <circle cx="25.5" cy="40" r="1.5" fill="#FEF3C7" />
                  <circle cx="25.5" cy="54" r="1.5" fill="#FEF3C7" />
                  <circle cx="54.5" cy="40" r="1.5" fill="#FEF3C7" />
                  <circle cx="54.5" cy="54" r="1.5" fill="#FEF3C7" />

                  {/* 宝箱のフタ（ドーム型） */}
                  <path
                    d="M 10 32 C 10 16 70 16 70 32 Z"
                    fill={isChestOpened ? '#B45309' : '#A0522D'}
                    stroke="#5C2C0B"
                    strokeWidth="2.5"
                  />
                  {/* フタの金バンド */}
                  <path d="M 22 32 C 22 20 29 20 29 32 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                  <path d="M 51 32 C 51 20 58 20 58 32 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                  {/* フタの光沢ハイライト */}
                  <path d="M 18 24 Q 40 18 62 24" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                  {/* 中央の金の錠前プレート */}
                  <rect x="34" y="28" width="12" height="15" rx="3" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" />
                  {/* 鍵穴 */}
                  <circle cx="40" cy="34" r="2" fill="#78350F" />
                  <path d="M 39 34 L 41 34 L 41.5 39 L 38.5 39 Z" fill="#78350F" />

                  {/* キラキラ光る宝石エフェクト */}
                  {!isChestOpened && (
                    <g className="animate-pulse">
                      <polygon points="68,14 70,18 74,18 71,21 72,25 68,22 64,25 65,21 62,18 66,18" fill="#FDE047" />
                      <polygon points="12,18 13.5,21 16.5,21 14,23 15,26 12,24 9,26 10,23 7.5,21 10.5,21" fill="#FDE047" />
                    </g>
                  )}
                </svg>

                {isChestOpened && (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </button>
            </div>
          );
        })()}

        {/* 🌟 4. 🏰 ボス検定（Duolingo 円形ゴールドトロフィー台座） */}
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
                <div className="absolute -top-9 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-md flex items-center gap-1 ring-2 ring-white whitespace-nowrap z-30">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>エリア完全制覇！</span>
                </div>
              ) : isStageCleared ? (
                <div className="absolute -top-9 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black shadow-md animate-bounce flex items-center gap-1 ring-2 ring-white whitespace-nowrap z-30">
                  <Trophy className="w-3.5 h-3.5 text-amber-200" />
                  <span>ボス検定に挑戦！</span>
                </div>
              ) : null}

              {/* トロフィーコイン */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  if (onNavigateToExam) {
                    onNavigateToExam(stepMeta.examId);
                  }
                }}
                className={`w-[84px] h-[84px] sm:w-[90px] sm:h-[90px] rounded-full flex items-center justify-center font-black cursor-pointer select-none transition-all relative ${
                  isBossCleared
                    ? 'bg-gradient-to-b from-[#10B981] to-[#047857] text-white border-b-[8px] border-[#065F46] active:translate-y-[6px] active:border-b-[2px]'
                    : isStageCleared
                    ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-white border-b-[8px] border-[#B45309] active:translate-y-[6px] active:border-b-[2px] animate-pulse'
                    : 'bg-gradient-to-b from-[#334155] to-[#1E293B] text-white border-b-[8px] border-[#0F172A] active:translate-y-[6px] active:border-b-[2px]'
                }`}
                title={qMeta.bossLabel}
              >
                <span className="absolute top-2.5 w-8 h-3 rounded-full bg-white/35 pointer-events-none" />
                <Trophy className="w-10 h-10 text-amber-300 drop-shadow-md" />
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
                    : `全問クリアで解放`}
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
