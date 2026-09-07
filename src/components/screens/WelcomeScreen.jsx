import React from 'react';
import { CreditCard, TouchpadIcon, ShieldCheck, Zap } from 'lucide-react';
import { atmAudio } from '../../utils/audio';

export default function WelcomeScreen({ onStart, registerButtonHover, unregisterButtonHover }) {
  const handleStart = () => {
    atmAudio.playCardInsert();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-8 text-center bg-gradient-to-b from-slate-900 via-blue-950/60 to-slate-900 rounded-xl relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="space-y-2 z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>AI 混雑防止システム・リアルタイム監視稼働中</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
          いらっしゃいませ
        </h2>
        <p className="text-sm text-slate-300">
          カード・通帳をお入れいただくか、画面をタッチしてください
        </p>
      </div>

      {/* Center Interactive Touch Card */}
      <div className="z-10 my-6">
        <div
          onClick={handleStart}
          onMouseEnter={() => registerButtonHover('card-start')}
          onMouseLeave={() => unregisterButtonHover('card-start')}
          className="group cursor-pointer p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_45px_rgba(6,182,212,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-300 mb-4">
            <CreditCard className="w-10 h-10 animate-pulse" />
          </div>

          <div className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
            💳 取引を開始する (カード挿入)
          </div>
          <p className="text-xs text-slate-400 mt-2">
            ※操作が遅れると「Automatic Turning away of Mxxko」が発動します
          </p>

          <div className="mt-4 px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1 shadow">
            <span>ここをタッチして挿入</span>
          </div>
        </div>
      </div>

      {/* Bottom info banner */}
      <div className="z-10 text-xs text-slate-400 space-y-1">
        <p>【お知らせ】混雑時は迷い行動や長時間操作に対し退出ダイアログが表示されます。</p>
        <p className="text-[11px] text-slate-500">みらい安心銀行 ATMセキュリティプロトコル Mxxko-v2.4</p>
      </div>
    </div>
  );
}
