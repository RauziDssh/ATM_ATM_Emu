import React from 'react';
import { AlertOctagon, ShieldAlert, LogOut, RefreshCw, VolumeX, Flame, Clock, MousePointerClick, RotateCcw, AlertTriangle } from 'lucide-react';
import { atmAudio } from '../utils/audio';

export default function EjectionModal({ isOpen, reason, metrics, onReset }) {
  if (!isOpen) return null;

  const handleExit = () => {
    atmAudio.stopAlarm();
    onReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      
      {/* Emergency flashing strobe border animation */}
      <div className="absolute inset-0 border-[12px] border-red-600 animate-pulse pointer-events-none shadow-[inset_0_0_100px_rgba(239,68,68,0.8)]" />

      <div className="relative w-full max-w-3xl bg-slate-950 border-4 border-red-600 rounded-2xl shadow-[0_0_80px_rgba(239,68,68,0.7)] text-white p-6 md:p-10 my-8">
        
        {/* Top Warning Banner */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-red-600/30 rounded-full border-2 border-red-500 animate-bounce">
            <AlertOctagon className="w-16 h-16 text-red-500 shadow-lg" />
          </div>

          <div className="inline-block px-4 py-1 bg-red-600/30 border border-red-500 rounded-full text-xs font-bold text-red-300 tracking-widest uppercase animate-pulse">
            🚨 SYSTEM CRITICAL WARNING / 強制退場警告
          </div>

          {/* EXACT MANDATORY USER TEXT REQUIREMENT */}
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 font-mono py-2 drop-shadow-[0_4px_12px_rgba(239,68,68,0.8)]">
            ”Automatic Turning away of Mxxko" 発動
          </h2>

          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent my-2" />
        </div>

        {/* Warning Message Box */}
        <div className="mt-6 bg-red-950/40 border border-red-800/80 rounded-xl p-5 text-slate-200 text-sm space-y-3">
          <div className="flex items-start space-x-3 text-red-300 font-semibold text-base">
            <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <p>
              ご利用操作が遅いユーザーを検出しました。AI端末セキュリティ規定に基づき、直ちに本ATMからの退出を命じます。
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pl-9">
            理由: <strong className="text-amber-300 font-mono text-sm">{reason || '操作遅延および迷い行動が基準値を超過しました。'}</strong>
            <br />
            後方でお待ちのお客様の円滑な利用および混雑防止のため、当セッションの端末利用権限は一時的に凍結されました。
          </p>
        </div>

        {/* Hesitation Analytics Breakdown */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <Flame className="w-4 h-4 text-amber-400 mr-1.5" />
            検出された「迷い行動・遅延指標」アナリティクス
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">無操作時間</div>
              <div className="text-lg font-bold font-mono text-cyan-300">{metrics.idleTime.toFixed(1)} 秒</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <MousePointerClick className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">迷いホバー回数</div>
              <div className="text-lg font-bold font-mono text-amber-300">{metrics.hoverHesitationCount} 回</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <RotateCcw className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">訂正・戻る頻度</div>
              <div className="text-lg font-bold font-mono text-rose-300">{metrics.backtrackCount} 回</div>
            </div>

            <div className="bg-slate-900 border border-red-900/60 rounded-lg p-3 bg-red-950/30">
              <AlertTriangle className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <div className="text-[10px] text-red-300 font-bold">総合迷い度</div>
              <div className="text-lg font-black font-mono text-red-400">100 / 100</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleExit}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 transform active:scale-95 transition flex items-center justify-center space-x-2 text-base border border-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>カード・明細を受け取って退場する</span>
          </button>

          <button
            onClick={handleExit}
            className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>スピーディーに再挑戦する</span>
          </button>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          ※本メッセージは「Automatic Turning away of Mxxko」安全管理システムにより自動発出されました。
        </div>

      </div>
    </div>
  );
}
