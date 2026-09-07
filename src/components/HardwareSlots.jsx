import React from 'react';
import { CreditCard, Banknote, FileText, ArrowDown } from 'lucide-react';

export default function HardwareSlots({ cardInserted, cashDispensing, receiptDispensing }) {
  return (
    <div className="bg-slate-900 border-t-2 border-slate-800 p-4 grid grid-cols-3 gap-4 text-slate-300 text-xs">
      {/* Card Slot */}
      <div className={`p-3 rounded-lg border flex flex-col items-center justify-between transition-all duration-300 ${
        cardInserted 
          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
          : 'bg-slate-800/60 border-slate-700'
      }`}>
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>カード・通帳挿入口</span>
        </div>
        <div className="w-full my-2 relative">
          <div className="h-2 bg-slate-950 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden">
            <div className={`h-1 rounded-full transition-all duration-500 ${
              cardInserted ? 'w-full bg-emerald-400 animate-pulse' : 'w-2 bg-slate-600'
            }`} />
          </div>
        </div>
        <span className={`text-[10px] ${cardInserted ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
          {cardInserted ? '● カード挿入中' : '挿入待ち'}
        </span>
      </div>

      {/* Cash Slot */}
      <div className={`p-3 rounded-lg border flex flex-col items-center justify-between transition-all duration-300 ${
        cashDispensing 
          ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse' 
          : 'bg-slate-800/60 border-slate-700'
      }`}>
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
          <Banknote className="w-4 h-4 text-amber-400" />
          <span>紙幣取出口</span>
        </div>
        <div className="w-full my-2 relative">
          <div className="h-3 bg-slate-950 rounded-sm border border-slate-700 flex items-center justify-center relative overflow-hidden">
            {cashDispensing && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 animate-shimmer flex items-center justify-center">
                <span className="text-[9px] font-bold text-slate-950 tracking-widest">CASH</span>
              </div>
            )}
          </div>
        </div>
        <span className={`text-[10px] ${cashDispensing ? 'text-amber-300 font-bold flex items-center' : 'text-slate-500'}`}>
          {cashDispensing ? <>現金をお受取りください <ArrowDown className="w-3 h-3 ml-1 animate-bounce" /></> : '閉塞中'}
        </span>
      </div>

      {/* Receipt Slot */}
      <div className={`p-3 rounded-lg border flex flex-col items-center justify-between transition-all duration-300 ${
        receiptDispensing 
          ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
          : 'bg-slate-800/60 border-slate-700'
      }`}>
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>明細票発行口</span>
        </div>
        <div className="w-full my-2 relative">
          <div className="h-2 bg-slate-950 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden">
            <div className={`h-1 rounded-full transition-all duration-500 ${
              receiptDispensing ? 'w-full bg-cyan-400' : 'w-2 bg-slate-600'
            }`} />
          </div>
        </div>
        <span className={`text-[10px] ${receiptDispensing ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
          {receiptDispensing ? '明細票発行中' : '待機中'}
        </span>
      </div>
    </div>
  );
}
