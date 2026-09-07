import React, { useState, useEffect } from 'react';
import { ShieldAlert, Volume2, VolumeX, Settings, Landmark, Wifi } from 'lucide-react';
import { atmAudio } from '../utils/audio';

export default function AtmHeader({ onOpenSettings, isMuted, setIsMuted }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    atmAudio.setMuted(nextMuted);
    if (!nextMuted) {
      atmAudio.playBeep(1000, 0.05);
    }
  };

  return (
    <header className="atm-header flex items-center justify-between px-6 py-3 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b-2 border-cyan-500/30 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-500/20 border border-emerald-400/40 rounded-lg flex items-center justify-center">
          <Landmark className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            みらい安心銀行 <span className="text-xs font-normal text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-full ml-1">Mxxko ATM-2000</span>
          </h1>
          <p className="text-xs text-slate-400 flex items-center space-x-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>稼働中 | 自動退場監視AIシステム搭載</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>回線: 正常</span>
        </div>

        <div className="font-mono text-sm font-semibold text-cyan-300 bg-slate-900 px-3 py-1.5 rounded border border-cyan-900/60 shadow-inner">
          {timeStr || '12:00:00'}
        </div>

        <button
          onClick={toggleSound}
          title={isMuted ? "音声をONにする" : "音声をミュートにする"}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
        </button>

        <button
          onClick={onOpenSettings}
          title="システム設定 / 迷い検出設定"
          className="p-2 bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white rounded-lg border border-blue-600/50 transition flex items-center space-x-1"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium hidden md:inline">設定</span>
        </button>
      </div>
    </header>
  );
}
