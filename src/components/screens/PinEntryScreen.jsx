import React, { useState } from 'react';
import { Delete, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { atmAudio } from '../../utils/audio';

export default function PinEntryScreen({ onPinSubmit, onBack, registerButtonHover, unregisterButtonHover, registerBacktrack }) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      atmAudio.playBeep(1100, 0.05);
      setErrorMsg('');
      setPin(prev => prev + num);
    }
  };

  const handleClear = () => {
    if (pin.length > 0) {
      atmAudio.playErrorBeep();
      setPin('');
      registerBacktrack(); // Track correction / backtrack behavior!
    }
  };

  const handleConfirm = () => {
    if (pin.length === 4) {
      atmAudio.playConfirmBeep();
      onPinSubmit(pin);
    } else {
      atmAudio.playErrorBeep();
      setErrorMsg('暗証番号4桁を入力してください');
    }
  };

  const handleBack = () => {
    atmAudio.playBeep(600, 0.08);
    registerBacktrack();
    onBack();
  };

  return (
    <div className="flex flex-col justify-between h-full p-6 bg-slate-950 text-white rounded-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-cyan-300 flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <span>暗証番号（4桁）を入力してください</span>
          </h2>
          <p className="text-xs text-slate-400">※後方のお客様に見えないようご考慮の上、入力してください</p>
        </div>

        <button
          onClick={handleBack}
          onMouseEnter={() => registerButtonHover('pin-back')}
          onMouseLeave={() => unregisterButtonHover('pin-back')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs flex items-center space-x-1 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>戻る</span>
        </button>
      </div>

      {/* Center PIN Display Box */}
      <div className="flex flex-col items-center justify-center my-3">
        <div className="flex space-x-4 mb-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-3xl font-mono transition-all ${
                pin[idx]
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}
            >
              {pin[idx] ? '●' : ''}
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-800 px-3 py-1 rounded-md animate-shake">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Keypad Grid */}
      <div className="max-w-xs mx-auto w-full grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            onMouseEnter={() => registerButtonHover(`pin-key-${num}`)}
            onMouseLeave={() => unregisterButtonHover(`pin-key-${num}`)}
            className="p-3.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 active:bg-cyan-600 text-2xl font-bold font-mono rounded-xl shadow transition text-white active:scale-95"
          >
            {num}
          </button>
        ))}

        <button
          onClick={handleClear}
          onMouseEnter={() => registerButtonHover('pin-key-clear')}
          onMouseLeave={() => unregisterButtonHover('pin-key-clear')}
          className="p-3 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/60 text-amber-300 font-bold rounded-xl text-xs flex flex-col items-center justify-center active:scale-95 transition"
        >
          <Delete className="w-5 h-5 mb-0.5" />
          <span>訂正</span>
        </button>

        <button
          onClick={() => handleKeyPress(0)}
          onMouseEnter={() => registerButtonHover('pin-key-0')}
          onMouseLeave={() => unregisterButtonHover('pin-key-0')}
          className="p-3.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 active:bg-cyan-600 text-2xl font-bold font-mono rounded-xl shadow transition text-white active:scale-95"
        >
          0
        </button>

        <button
          onClick={handleConfirm}
          onMouseEnter={() => registerButtonHover('pin-key-confirm')}
          onMouseLeave={() => unregisterButtonHover('pin-key-confirm')}
          className="p-3 bg-emerald-700/60 hover:bg-emerald-600 border border-emerald-500 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center active:scale-95 transition shadow-lg shadow-emerald-950/40"
        >
          <CheckCircle2 className="w-5 h-5 mb-0.5 text-emerald-300" />
          <span>確認</span>
        </button>
      </div>

      {/* Footer advice */}
      <div className="text-center text-[11px] text-slate-400 mt-2">
        デモ用暗証番号: 任意の4桁（例: <span className="font-mono text-cyan-300">1234</span>）を入力してください
      </div>
    </div>
  );
}
