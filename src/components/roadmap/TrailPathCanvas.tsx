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
  const [tigerQuoteIdx, setTigerQuoteIdx] = useState(0);
  const TIGER_QUOTES = [
    '화이팅! 🐯',
    '오늘도 힘내자! ⚡',
    '넌 할 수 있어! ✨',
    '달려보자! 🐾',
    '대단해! 🌟',
  ];

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
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#EEF2F6]/50 to-[#F8FAFC]">
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

          {/* 🏙️ ソウル8大エリア固有の風景イラスト・ランドマークデカール */}
          {step.step === 1 && (
            /* Area 1: 弘大・延南洞（バスキング・カフェ・アート） */
            <g opacity="0.6">
              {/* ギターシルエット */}
              <circle cx="55" cy="220" r="14" fill="#E2E8F0" />
              <rect x="52" y="185" width="6" height="25" rx="2" fill="#CBD5E1" />
              {/* 音符 */}
              <text x="75" y="195" fontSize="16" fill="#A855F7" opacity="0.7 font-bold">♪</text>
              <text x="88" y="215" fontSize="13" fill="#EC4899" opacity="0.6">♫</text>
              {/* テイクアウトコーヒー */}
              <rect x="290" y="525" width="20" height="26" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
              <rect x="287" y="521" width="26" height="5" rx="2" fill="#F97316" opacity="0.8" />
              <path d="M 297, 514 Q 295, 508 299, 504" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {step.step === 2 && (
            /* Area 2: 聖水洞（レンガカフェ・フォトブース） */
            <g opacity="0.6">
              {/* 赤レンガ倉庫の壁面 */}
              <rect x="35" y="200" width="45" height="35" rx="3" fill="#E2E8F0" />
              <rect x="42" y="208" width="12" height="18" rx="2" fill="#94A3B8" />
              <rect x="60" y="208" width="12" height="18" rx="2" fill="#94A3B8" />
              {/* カメラアイコン */}
              <rect x="285" y="520" width="30" height="22" rx="4" fill="#334155" />
              <circle cx="300" cy="531" r="6" fill="#94A3B8" />
              <circle cx="308" cy="524" r="2" fill="#38BDF8" />
            </g>
          )}

          {step.step === 3 && (
            /* Area 3: 汝矣島・漢江（水面さざ波・ピクニック・ラーメン） */
            <g opacity="0.6">
              <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 35, 215 Q 50, 210 65, 215 T 95, 215" />
                <path d="M 45, 230 Q 60, 225 75, 230" />
                <path d="M 275, 515 Q 290, 510 305, 515 T 335, 515" />
                <path d="M 285, 530 Q 300, 525 315, 530" />
              </g>
              {/* ピクニックシート */}
              <rect x="25" y="440" width="30" height="20" rx="3" fill="#FDE047" opacity="0.85" transform="rotate(-8 25 440)" />
              <rect x="28" y="443" width="24" height="14" rx="2" fill="#FEF08A" opacity="0.95" transform="rotate(-8 25 440)" />
              {/* 漢江ラーメン鍋 */}
              <ellipse cx="40" cy="450" rx="6" ry="4" fill="#EA580C" />
            </g>
          )}

          {step.step === 4 && (
            /* Area 4: 仁寺洞・益善洞（韓屋の瓦屋根・伝統茶・青紗一籠） */
            <g opacity="0.6">
              {/* 韓屋の瓦屋根シルエット */}
              <path d="M 25, 225 Q 55, 205 85, 225 L 80, 230 Q 55, 215 30, 230 Z" fill="#475569" />
              <rect x="35" y="230" width="40" height="20" fill="#E2E8F0" />
              {/* 伝統提灯 */}
              <rect x="295" y="520" width="16" height="12" rx="3" fill="#EF4444" />
              <rect x="295" y="532" width="16" height="12" rx="3" fill="#3B82F6" />
              <line x1="303" y1="512" x2="303" y2="520" stroke="#64748B" strokeWidth="2" />
            </g>
          )}

          {step.step === 5 && (
            /* Area 5: 明洞・南山（Nソウルタワー・屋台グルメ） */
            <g opacity="0.6">
              {/* Nソウルタワーシルエット */}
              <path d="M 50, 240 L 53, 175 L 48, 175 L 53, 150 L 54, 150 L 59, 175 L 54, 175 L 57, 240 Z" fill="#64748B" />
              <rect x="47" y="180" width="13" height="8" rx="2" fill="#0284C7" />
              {/* 屋台風トッポッキ串 */}
              <line x1="285" y1="535" x2="315" y2="515" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="295" cy="528" r="4.5" fill="#EF4444" />
              <circle cx="305" cy="522" r="4.5" fill="#EF4444" />
            </g>
          )}

          {step.step === 6 && (
            /* Area 6: 梨泰院・漢南洞（ヘッドフォン・ネオン） */
            <g opacity="0.6">
              {/* ヘッドフォン */}
              <path d="M 40, 220 A 18 18 0 0 1 72, 220" stroke="#334155" strokeWidth="3" fill="none" />
              <rect x="36" y="215" width="8" height="14" rx="3" fill="#06B6D4" />
              <rect x="68" y="215" width="8" height="14" rx="3" fill="#06B6D4" />
              {/* ルーフトップカクテル */}
              <polygon points="290,520 310,520 300,535" fill="#EC4899" opacity="0.8" />
              <line x1="300" y1="535" x2="300" y2="548" stroke="#64748B" strokeWidth="2" />
              <line x1="294" y1="548" x2="306" y2="548" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {step.step === 7 && (
            /* Area 7: 江南・狎鴎亭（高層ビル・サングラス・2号線） */
            <g opacity="0.6">
              {/* 高層ビルのシルエット群 */}
              <rect x="35" y="195" width="20" height="45" fill="#94A3B8" rx="2" />
              <rect x="58" y="175" width="22" height="65" fill="#64748B" rx="2" />
              {/* 地下鉄2号線のグリーンの丸 */}
              <circle cx="300" cy="530" r="14" fill="#10B981" />
              <text x="296" y="535" fontSize="13" fill="#FFFFFF" fontWeight="900">2</text>
            </g>
          )}

          {step.step === 8 && (
            /* Area 8: 蚕室・ロッテワールド（お城・観覧車・バルーン） */
            <g opacity="0.6">
              {/* ロッテワールド城の尖塔 */}
              <path d="M 40, 240 L 40, 210 L 48, 190 L 56, 210 L 56, 240 Z" fill="#6366F1" />
              <path d="M 58, 240 L 58, 200 L 68, 180 L 78, 200 L 78, 240 Z" fill="#4F46E5" />
              <circle cx="48" cy="189" r="2.5" fill="#F59E0B" />
              <circle cx="68" cy="179" r="2.5" fill="#F59E0B" />
              {/* カラフル風船 */}
              <circle cx="295" cy="520" r="8" fill="#EC4899" />
              <circle cx="308" cy="515" r="9" fill="#3B82F6" />
              <circle cx="302" cy="527" r="7" fill="#F59E0B" />
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

                  {/* ホランイ（マスコット）がトレイル脇の地面に立ってフキダシで応援（タップで喋る！） */}
                  <div
                    onClick={() => {
                      sound.playCorrect();
                      setTigerQuoteIdx((prev) => (prev + 1) % TIGER_QUOTES.length);
                    }}
                    className="absolute -left-16 sm:-left-20 top-0 z-30 flex flex-col items-center cursor-pointer select-none group"
                    title="ホランイをタップして応援を聞く！"
                  >
                    <div className="relative mb-1 px-2.5 py-1 bg-white rounded-2xl shadow-md border-2 border-amber-300 text-[11px] font-black text-slate-800 whitespace-nowrap animate-bounce-subtle">
                      <span>{TIGER_QUOTES[tigerQuoteIdx]}</span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white" />
                    </div>
                    <div className="transition-transform group-hover:scale-110 active:scale-95 animate-bounce-subtle">
                      <HorangiMascot size="sm" mood="cheering" showMessage={false} interactive={false} />
                    </div>
                    <div className="w-10 h-2 bg-slate-900/15 rounded-full blur-[1px] -mt-1" />
                  </div>
                </>
              )}

              {/* 🌟 Duolingo本家 3D円形コイン（完全な円・8pxシリンダー沈み込み） */}
              <div className="relative flex items-center justify-center">
                {/* 脈動するレーダー光彩（アクティブノードへの没入感） */}
                {isCurrent && (
                  <div className="absolute -inset-2.5 rounded-full bg-orange-400/40 animate-ping pointer-events-none -z-10" />
                )}

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
                  className={`w-[74px] h-[74px] sm:w-[80px] sm:h-[80px] rounded-full flex items-center justify-center font-bold cursor-pointer select-none transition-all relative ${
                    isShaking ? 'animate-rubber' : ''
                  } ${
                    isDone
                      ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-xs border-b-[4px] border-emerald-700 hover:brightness-105 active:translate-y-[3px] active:border-b-0'
                      : isCurrent
                      ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-xs border-b-[4px] border-amber-700 hover:brightness-105 active:translate-y-[3px] active:border-b-0'
                      : 'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-400 border-b-[4px] border-slate-300 cursor-pointer active:translate-y-[2px] active:border-b-0'
                  }`}
                  title={`第${tIdx + 1}問`}
                >
                  {/* 上部の光彩ハイライト */}
                  <span className="absolute top-2 w-7 h-2 rounded-full bg-white/30 pointer-events-none" />

                  {isDone ? (
                    <div className="relative flex items-center justify-center">
                      <Check className="w-8 h-8 stroke-[3]" />
                      <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300 absolute -top-2 -right-2 animate-star-spin" />
                    </div>
                  ) : isCurrent ? (
                    <Zap className="w-8 h-8 fill-white text-white drop-shadow-xs" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400 stroke-[2]" />
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
                className={`w-[84px] h-[84px] sm:w-[90px] sm:h-[90px] rounded-full flex items-center justify-center font-bold cursor-pointer select-none transition-all relative ${
                  isBossCleared
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-xs border-b-[4px] border-emerald-800 active:translate-y-[3px] active:border-b-0'
                    : isStageCleared
                    ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-white shadow-xs border-b-[4px] border-amber-700 active:translate-y-[3px] active:border-b-0 animate-pulse'
                    : 'bg-gradient-to-b from-slate-700 to-slate-800 text-white shadow-xs border-b-[4px] border-slate-900 active:translate-y-[3px] active:border-b-0'
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
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 pb-12 sm:pb-6 shadow-2xl border-2 border-stone-200 animate-in slide-in-from-bottom-6 sm:zoom-in-95 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 上部バー */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black shadow-2xs">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Area {step.step} : 第 {previewTaskIdx + 1} 問</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setPreviewTaskIdx(null);
                }}
                className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
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
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-3.5 flex items-center gap-3 border-2 border-amber-200/90 shadow-2xs">
              <HorangiMascot size="sm" mood={isPreviewDone ? 'trophy' : 'cheering'} showMessage={false} interactive={false} />
              <div className="text-xs text-amber-950">
                <span className="font-black text-sm block">
                  {isPreviewDone ? '🏆 復習ステージ！何度でも挑戦できます' : '🔥 30秒で集中特訓！'}
                </span>
                <span className="text-[11px] text-amber-800 font-bold">
                  {isPreviewDone ? '満点を目指して即答スピードを鍛えよう (+60 XP)' : '即答クイズで知識を定着させよう (+60 XP)'}
                </span>
              </div>
            </div>

            {/* スタートボタン（Speak風 クリーンなプライマリボタン） */}
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                const targetIdx = previewTaskIdx;
                setPreviewTaskIdx(null);
                onStartDrill(step.step, targetIdx);
              }}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide"
            >
              <Zap className="w-5 h-5 fill-white text-white drop-shadow-xs" />
              <span>{isPreviewDone ? 'もう一度特訓する (+60 XP)' : '特訓スタート (+60 XP)'}</span>
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
