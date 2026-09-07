import React, { useEffect } from 'react';
import { Loader2, Banknote, ShieldCheck } from 'lucide-react';
import { atmAudio } from '../../utils/audio';

export default function ProcessingScreen({ onComplete }) {
  useEffect(() => {
    atmAudio.playCashDispense();
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-950 text-white rounded-xl relative overflow-hidden">
      
      <div className="relative z-10 space-y-6">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Banknote className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-cyan-300">只今処理中です</h2>
          <p className="text-sm text-slate-400 mt-1">
            紙幣を数えています。そのまましばらくお待ちください...
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>通信暗号化処理中...</span>
        </div>
      </div>

    </div>
  );
}
