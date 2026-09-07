import React, { useEffect } from 'react';
import { CheckCircle2, ArrowDown, LogOut } from 'lucide-react';
import { atmAudio } from '../../utils/audio';

export default function CompleteScreen({ amount, onFinish }) {
  useEffect(() => {
    atmAudio.playConfirmBeep();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between h-full p-8 text-center bg-slate-950 text-white rounded-xl">
      <div className="space-y-4 my-auto">
        <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-extrabold text-white">
          お引き出しが完了しました
        </h2>

        <p className="text-sm text-slate-300">
          現金 <strong className="text-amber-300 font-mono text-lg">¥{amount.toLocaleString()}円</strong>・カード・ご利用明細票をお受け取りください。
        </p>

        <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-amber-300 text-xs flex items-center justify-center space-x-2 animate-bounce">
          <ArrowDown className="w-4 h-4" />
          <span>取り忘れにご注意ください！</span>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full max-w-xs py-3.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2 text-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>最初の画面へ戻る</span>
      </button>
    </div>
  );
}
