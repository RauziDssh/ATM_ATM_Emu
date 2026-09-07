import React from 'react';
import { ArrowLeft, Banknote, Wallet, Send, Search, BookOpen, AlertTriangle } from 'lucide-react';
import { atmAudio } from '../../utils/audio';

export default function MainMenuScreen({ onSelectOperation, onCancel, registerButtonHover, unregisterButtonHover }) {
  const operations = [
    { id: 'WITHDRAW', label: 'お引き出し', desc: '現金をお手元へ', icon: Banknote, color: 'from-emerald-600 to-teal-700', badge: '人気' },
    { id: 'DEPOSIT', label: 'お預い入れ', desc: '口座へご入金', icon: Wallet, color: 'from-blue-600 to-cyan-700', badge: '' },
    { id: 'TRANSFER', label: 'お振込み', desc: '他口座へ送金', icon: Send, color: 'from-indigo-600 to-blue-700', badge: '' },
    { id: 'INQUIRY', label: '残高照会', desc: '口座残高の確認', icon: Search, color: 'from-slate-700 to-slate-800', badge: '' },
    { id: 'PASSBOOK', label: '通帳記入', desc: '記帳・履歴更新', icon: BookOpen, color: 'from-amber-700 to-orange-800', badge: '' },
  ];

  const handleSelect = (opId) => {
    atmAudio.playBeep(900, 0.06);
    onSelectOperation(opId);
  };

  const handleBack = () => {
    atmAudio.playErrorBeep();
    onCancel();
  };

  return (
    <div className="flex flex-col justify-between h-full p-6 bg-slate-950 text-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-cyan-300">ご希望のご取引を選択してください</h2>
          <p className="text-xs text-slate-400">※ボタンを長時間の迷いなく迅速にお選びください</p>
        </div>

        <button
          onClick={handleBack}
          onMouseEnter={() => registerButtonHover('btn-cancel-main')}
          onMouseLeave={() => unregisterButtonHover('btn-cancel-main')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>取消・カード返却</span>
        </button>
      </div>

      {/* Operation Buttons Grid */}
      <div className="grid grid-cols-2 gap-4 my-4">
        {operations.map((op) => {
          const Icon = op.icon;
          return (
            <button
              key={op.id}
              onClick={() => handleSelect(op.id)}
              onMouseEnter={() => registerButtonHover(`op-${op.id}`)}
              onMouseLeave={() => unregisterButtonHover(`op-${op.id}`)}
              className={`group relative p-5 rounded-xl bg-gradient-to-r ${op.color} border border-white/10 hover:border-cyan-400 shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 active:scale-95 transition-all text-left flex items-center justify-between`}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-black/20 rounded-lg text-white group-hover:scale-110 transition">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white group-hover:text-cyan-200">
                    {op.label}
                  </div>
                  <div className="text-xs text-slate-200/80">{op.desc}</div>
                </div>
              </div>

              {op.badge && (
                <span className="absolute top-2 right-2 text-[10px] bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded-full shadow">
                  {op.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer warning hint */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>迷いホバー行動はリアルタイムAIスコアへ即座に加算されます</span>
        </span>
        <span className="text-[11px] text-cyan-400">操作目標時間: 5秒以内</span>
      </div>
    </div>
  );
}
