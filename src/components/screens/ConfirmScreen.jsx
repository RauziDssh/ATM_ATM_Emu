import React from 'react';
import { CheckCircle2, RotateCcw, XCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { atmAudio } from '../../utils/audio';

export default function ConfirmScreen({ operationType, amount, onConfirm, onChangeAmount, onCancel, registerButtonHover, unregisterButtonHover, registerBacktrack }) {
  const isWithdraw = operationType === 'WITHDRAW';
  const opName = isWithdraw ? 'お引き出し' : operationType === 'DEPOSIT' ? 'お預い入れ' : 'お振込み';
  const fee = 0;
  const simulatedBalance = 1250000;
  const newBalance = isWithdraw ? simulatedBalance - amount : simulatedBalance + amount;

  const handleConfirm = () => {
    atmAudio.playConfirmBeep();
    onConfirm();
  };

  const handleChange = () => {
    atmAudio.playErrorBeep();
    registerBacktrack();
    onChangeAmount();
  };

  const handleCancel = () => {
    atmAudio.playErrorBeep();
    registerBacktrack();
    onCancel();
  };

  return (
    <div className="flex flex-col justify-between h-full p-6 bg-slate-950 text-white rounded-xl">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-cyan-300">取引内容のご確認</h2>
        <p className="text-xs text-slate-400">内容をご確認のうえ、「確認」ボタンを押してください</p>
      </div>

      {/* Confirmation Details Card */}
      <div className="my-4 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 max-w-lg mx-auto w-full shadow-lg">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-400 text-sm">取引種別</span>
          <span className="text-lg font-bold text-white bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
            {opName}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-400 text-sm">ご指定金額</span>
          <span className="text-2xl font-black font-mono text-cyan-300">
            ¥ {amount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">円</span>
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-400 text-sm">ATM利用手数料</span>
          <span className="text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-2.5 py-0.5 rounded">
            ¥ 0 円 (終日無料)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">差引後お口座残高 (見込み)</span>
          <span className="text-sm font-mono text-slate-300">
            ¥ {newBalance.toLocaleString()} 円
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={handleCancel}
          onMouseEnter={() => registerButtonHover('confirm-cancel')}
          onMouseLeave={() => unregisterButtonHover('confirm-cancel')}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 font-bold rounded-xl text-xs flex flex-col items-center justify-center active:scale-95 transition"
        >
          <XCircle className="w-5 h-5 mb-1 text-rose-400" />
          <span>取引中止</span>
        </button>

        <button
          onClick={handleChange}
          onMouseEnter={() => registerButtonHover('confirm-change')}
          onMouseLeave={() => unregisterButtonHover('confirm-change')}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold rounded-xl text-xs flex flex-col items-center justify-center active:scale-95 transition"
        >
          <RotateCcw className="w-5 h-5 mb-1 text-amber-400" />
          <span>金額変更</span>
        </button>

        <button
          onClick={handleConfirm}
          onMouseEnter={() => registerButtonHover('confirm-ok')}
          onMouseLeave={() => unregisterButtonHover('confirm-ok')}
          className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm flex flex-col items-center justify-center active:scale-95 transition shadow-lg shadow-emerald-950/50 border border-emerald-400"
        >
          <CheckCircle2 className="w-6 h-6 mb-0.5 text-emerald-200" />
          <span>確 認</span>
        </button>
      </div>

    </div>
  );
}
