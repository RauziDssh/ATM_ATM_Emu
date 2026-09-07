import React, { useState } from 'react';
import { ArrowLeft, Banknote, Delete, CheckCircle } from 'lucide-react';
import { atmAudio } from '../../utils/audio';

export default function AmountScreen({ operationType, onAmountSubmit, onBack, registerButtonHover, unregisterButtonHover, registerBacktrack }) {
  const [customAmount, setCustomAmount] = useState('');

  const quickAmounts = [
    { value: 10000, label: '1 万円' },
    { value: 30000, label: '3 万円' },
    { value: 50000, label: '5 万円' },
    { value: 100000, label: '10 万円' },
  ];

  const handleSelectQuick = (val) => {
    atmAudio.playBeep(1000, 0.06);
    onAmountSubmit(val);
  };

  const handleCustomKey = (num) => {
    if (customAmount.length < 6) {
      atmAudio.playBeep(1100, 0.05);
      setCustomAmount(prev => prev + num);
    }
  };

  const handleCustomClear = () => {
    atmAudio.playErrorBeep();
    setCustomAmount('');
    registerBacktrack(); // Track correction metric!
  };

  const handleCustomSubmit = () => {
    const parsed = parseInt(customAmount, 10) * 10000;
    if (parsed > 0) {
      atmAudio.playConfirmBeep();
      onAmountSubmit(parsed);
    } else {
      atmAudio.playErrorBeep();
    }
  };

  const handleBack = () => {
    atmAudio.playBeep(600, 0.08);
    registerBacktrack();
    onBack();
  };

  const isWithdraw = operationType === 'WITHDRAW';

  return (
    <div className="flex flex-col justify-between h-full p-6 bg-slate-950 text-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-cyan-300 flex items-center space-x-2">
            <Banknote className="w-5 h-5 text-emerald-400" />
            <span>{isWithdraw ? 'お引き出し金額を選択・入力してください' : 'お預入れ金額を入力してください'}</span>
          </h2>
          <p className="text-xs text-slate-400">※千円単位・紙幣種別指定が可能です</p>
        </div>

        <button
          onClick={handleBack}
          onMouseEnter={() => registerButtonHover('amount-back')}
          onMouseLeave={() => unregisterButtonHover('amount-back')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs flex items-center space-x-1 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>戻る</span>
        </button>
      </div>

      {/* Main Grid Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {/* Quick buttons column */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            クイック金額選択
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((item) => (
              <button
                key={item.value}
                onClick={() => handleSelectQuick(item.value)}
                onMouseEnter={() => registerButtonHover(`btn-quick-${item.value}`)}
                onMouseLeave={() => unregisterButtonHover(`btn-quick-${item.value}`)}
                className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded-xl text-lg font-bold font-mono text-cyan-300 shadow transition flex flex-col items-center justify-center active:scale-95"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">({item.value.toLocaleString()}円)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount keypad column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            手入力指定 (万円単位)
          </div>

          <div className="bg-slate-950 border border-cyan-900/80 rounded-lg p-2.5 text-right font-mono text-2xl text-cyan-300 mb-3 shadow-inner">
            {customAmount ? `${customAmount} 万円` : '0 万円'}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleCustomKey(n)}
                className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-lg font-bold font-mono text-white active:scale-95 transition"
              >
                {n}
              </button>
            ))}
            <button
              onClick={handleCustomClear}
              className="py-2 bg-amber-900/40 hover:bg-amber-800 text-amber-300 rounded-lg text-xs font-bold active:scale-95 transition"
            >
              訂正
            </button>
            <button
              onClick={() => handleCustomKey(0)}
              className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-lg font-bold font-mono text-white active:scale-95 transition"
            >
              0
            </button>
            <button
              onClick={handleCustomSubmit}
              disabled={!customAmount}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 active:scale-95 transition ${
                customAmount
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>決定</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 text-center">
        ※1回のお引き出し限度額: 50万円
      </div>
    </div>
  );
}
