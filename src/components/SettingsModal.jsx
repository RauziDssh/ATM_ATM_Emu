import React from 'react';
import { X, Sliders, Zap, ShieldAlert, Check } from 'lucide-react';
import { SENSITIVITY_PRESETS } from '../hooks/useHesitationTracker';

export default function SettingsModal({ isOpen, onClose, strictnessKey, setStrictnessKey, onTriggerDemoEject }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-white p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-cyan-400 mb-4">
          <Sliders className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">迷い行動判定・システム設定</h2>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          ATM利用者の操作遅延判定アルゴリズムの感度を設定できます。「Mxxko」退場ルーチンの閾値をカスタマイズします。
        </p>

        {/* Preset Radio Buttons */}
        <div className="space-y-3 mb-6">
          {Object.entries(SENSITIVITY_PRESETS).map(([key, item]) => {
            const isSelected = strictnessKey === key;
            return (
              <div
                key={key}
                onClick={() => setStrictnessKey(key)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-100">{item.label}</span>
                    {key === 'EXTREME' && (
                      <span className="text-[10px] bg-red-600/30 text-red-400 border border-red-500/50 px-2 py-0.5 rounded font-mono font-bold">
                        RECOMMENDED FOR TEST
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    無操作許容: 約{item.maxIdleSeconds}秒 | 感度倍率: {item.multiplier}x
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Test Trigger */}
        <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
          <div className="text-xs text-slate-400">デモ・検証用機能:</div>
          <button
            onClick={() => {
              onClose();
              onTriggerDemoEject();
            }}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm border border-red-400"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>”Automatic Turning away of Mxxko" 発動ダイアログをテスト表示</span>
          </button>
        </div>

      </div>
    </div>
  );
}
