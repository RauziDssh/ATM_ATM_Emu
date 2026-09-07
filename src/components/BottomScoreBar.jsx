import React from 'react';
import { AlertTriangle, Clock, MousePointerClick, RotateCcw, Activity } from 'lucide-react';

export default function BottomScoreBar({ score, statusLevel, metrics, currentScreen }) {
  // Determine color theme based on score level
  let barGradient = 'from-emerald-500 via-teal-400 to-emerald-400';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let statusText = 'スムーズに操作中';
  let pulseClass = '';

  if (score >= 90) {
    barGradient = 'from-red-600 via-rose-500 to-red-600';
    badgeColor = 'bg-red-500/30 text-red-200 border-red-500/60 animate-pulse';
    statusText = '🚨 強制退出限界直前！急いで操作してください';
    pulseClass = 'animate-ping';
  } else if (score >= 70) {
    barGradient = 'from-orange-500 via-amber-500 to-red-500';
    badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/50';
    statusText = '⚠️ 警告: 操作が遅れています。退出カウントダウン進行中';
  } else if (score >= 40) {
    barGradient = 'from-yellow-400 via-amber-400 to-orange-400';
    badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    statusText = '⚡ 迷い行動を検知: スピードアップを推奨';
  }

  const isWelcomeScreen = currentScreen === 'WELCOME';

  return (
    <div className="bottom-score-bar fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t-2 border-slate-800 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Status badge & Threat score title */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
              <Activity className="w-4 h-4 animate-spin-slow" />
              <span>{statusText}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">退場要求スコア:</span>
              <span className={`text-lg font-black font-mono tracking-tight ${
                score > 75 ? 'text-rose-400' : score > 40 ? 'text-amber-300' : 'text-emerald-400'
              }`}>
                {isWelcomeScreen ? '0' : score}
                <span className="text-xs font-normal text-slate-400"> / 100 </span>
              </span>
            </div>
          </div>

          {/* Real-time Score Gauge Progress Bar */}
          <div className="w-full md:flex-1 md:mx-6">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1 font-mono">
              <span className="text-emerald-400">安全 (0)</span>
              <span className="text-yellow-400">注意 (40)</span>
              <span className="text-orange-400">警告 (70)</span>
              <span className="text-red-500 font-bold">Mxxko発動限界 (100)</span>
            </div>

            <div className="h-3.5 bg-slate-900 rounded-full border border-slate-800 p-0.5 relative overflow-hidden shadow-inner">
              {/* Background gradient zones indicator */}
              <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 to-red-600 pointer-events-none" />

              {/* Active fill bar */}
              <div
                className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-300 shadow-[0_0_12px_rgba(239,68,68,0.5)]`}
                style={{ width: `${isWelcomeScreen ? 0 : Math.max(2, score)}%` }}
              />
            </div>
          </div>

          {/* Metrics Quick Chips */}
          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-300">
            <div className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>無操作: <strong className="font-mono text-cyan-300">{metrics.idleTime.toFixed(1)}s</strong></span>
            </div>

            <div className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
              <span>迷いホバー: <strong className="font-mono text-amber-300">{metrics.hoverHesitationCount}回</strong></span>
            </div>

            <div className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>訂正・戻る: <strong className="font-mono text-rose-300">{metrics.backtrackCount}回</strong></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
