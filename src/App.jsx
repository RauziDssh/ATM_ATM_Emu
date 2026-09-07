import React, { useState } from 'react';
import AtmHeader from './components/AtmHeader';
import HardwareSlots from './components/HardwareSlots';
import BottomScoreBar from './components/BottomScoreBar';
import EjectionModal from './components/EjectionModal';
import SettingsModal from './components/SettingsModal';

import WelcomeScreen from './components/screens/WelcomeScreen';
import MainMenuScreen from './components/screens/MainMenuScreen';
import PinEntryScreen from './components/screens/PinEntryScreen';
import AmountScreen from './components/screens/AmountScreen';
import ConfirmScreen from './components/screens/ConfirmScreen';
import ProcessingScreen from './components/screens/ProcessingScreen';
import CompleteScreen from './components/screens/CompleteScreen';

import { useHesitationTracker } from './hooks/useHesitationTracker';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('WELCOME');
  const [operationType, setOperationType] = useState('WITHDRAW');
  const [amount, setAmount] = useState(10000);
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [strictnessKey, setStrictnessKey] = useState('STANDARD');

  // Hesitation & Slowness Tracker Engine
  const {
    score,
    statusLevel,
    isEjected,
    ejectionReason,
    metrics,
    handleMouseMove,
    registerButtonHover,
    unregisterButtonHover,
    registerBacktrack,
    registerUserAction,
    resetTracker,
    triggerManualEject,
  } = useHesitationTracker(currentScreen, strictnessKey);

  // Screen transition handlers
  const handleStartSession = () => {
    registerUserAction();
    setCurrentScreen('MAIN_MENU');
  };

  const handleSelectOperation = (opId) => {
    registerUserAction();
    setOperationType(opId);
    if (opId === 'PASSBOOK' || opId === 'INQUIRY') {
      setCurrentScreen('PIN_ENTRY');
    } else {
      setCurrentScreen('PIN_ENTRY');
    }
  };

  const handlePinSubmit = (pin) => {
    registerUserAction();
    if (operationType === 'INQUIRY' || operationType === 'PASSBOOK') {
      setCurrentScreen('CONFIRM');
      setAmount(0);
    } else {
      setCurrentScreen('AMOUNT');
    }
  };

  const handleAmountSubmit = (selectedAmount) => {
    registerUserAction();
    setAmount(selectedAmount);
    setCurrentScreen('CONFIRM');
  };

  const handleConfirmTransaction = () => {
    registerUserAction();
    setCurrentScreen('PROCESSING');
  };

  const handleProcessingComplete = () => {
    setCurrentScreen('COMPLETE');
  };

  const handleResetSession = () => {
    resetTracker();
    setCurrentScreen('WELCOME');
  };

  // Hardware slot animation flags
  const cardInserted = currentScreen !== 'WELCOME' && currentScreen !== 'COMPLETE';
  const cashDispensing = currentScreen === 'PROCESSING' || currentScreen === 'COMPLETE';
  const receiptDispensing = currentScreen === 'COMPLETE';

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans select-none overflow-x-hidden relative pb-16"
    >
      {/* Background Matrix Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 max-w-6xl w-full mx-auto p-2 sm:p-4">
        
        {/* Main ATM Physical Terminal Frame */}
        <div className="bg-slate-900 border-4 border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col flex-1 my-auto border-t-slate-700">
          
          {/* ATM Top Brand Header */}
          <AtmHeader
            onOpenSettings={() => setIsSettingsOpen(true)}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
          />

          {/* Main ATM Display Screen (Aspect-ratio Touchscreen) */}
          <div className="p-4 sm:p-6 bg-slate-950 flex-1 min-h-[480px] flex flex-col relative">
            <div className="w-full flex-1 rounded-2xl border-2 border-slate-800 bg-slate-950 shadow-inner overflow-hidden flex flex-col">
              
              {currentScreen === 'WELCOME' && (
                <WelcomeScreen
                  onStart={handleStartSession}
                  registerButtonHover={registerButtonHover}
                  unregisterButtonHover={unregisterButtonHover}
                />
              )}

              {currentScreen === 'MAIN_MENU' && (
                <MainMenuScreen
                  onSelectOperation={handleSelectOperation}
                  onCancel={handleResetSession}
                  registerButtonHover={registerButtonHover}
                  unregisterButtonHover={unregisterButtonHover}
                />
              )}

              {currentScreen === 'PIN_ENTRY' && (
                <PinEntryScreen
                  onPinSubmit={handlePinSubmit}
                  onBack={() => setCurrentScreen('MAIN_MENU')}
                  registerButtonHover={registerButtonHover}
                  unregisterButtonHover={unregisterButtonHover}
                  registerBacktrack={registerBacktrack}
                />
              )}

              {currentScreen === 'AMOUNT' && (
                <AmountScreen
                  operationType={operationType}
                  onAmountSubmit={handleAmountSubmit}
                  onBack={() => setCurrentScreen('PIN_ENTRY')}
                  registerButtonHover={registerButtonHover}
                  unregisterButtonHover={unregisterButtonHover}
                  registerBacktrack={registerBacktrack}
                />
              )}

              {currentScreen === 'CONFIRM' && (
                <ConfirmScreen
                  operationType={operationType}
                  amount={amount}
                  onConfirm={handleConfirmTransaction}
                  onChangeAmount={() => setCurrentScreen('AMOUNT')}
                  onCancel={handleResetSession}
                  registerButtonHover={registerButtonHover}
                  unregisterButtonHover={unregisterButtonHover}
                  registerBacktrack={registerBacktrack}
                />
              )}

              {currentScreen === 'PROCESSING' && (
                <ProcessingScreen onComplete={handleProcessingComplete} />
              )}

              {currentScreen === 'COMPLETE' && (
                <CompleteScreen amount={amount} onFinish={handleResetSession} />
              )}

            </div>
          </div>

          {/* Physical Hardware Slots (Card, Cash, Receipt) */}
          <HardwareSlots
            cardInserted={cardInserted}
            cashDispensing={cashDispensing}
            receiptDispensing={receiptDispensing}
          />

        </div>

      </div>

      {/* Bottom Score Bar (Requested feature) */}
      <BottomScoreBar
        score={score}
        statusLevel={statusLevel}
        metrics={metrics}
        currentScreen={currentScreen}
      />

      {/* Forced Ejection Overlay Dialog ("Automatic Turning out of Mxxko" 発動) */}
      <EjectionModal
        isOpen={isEjected}
        reason={ejectionReason}
        metrics={metrics}
        onReset={handleResetSession}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        strictnessKey={strictnessKey}
        setStrictnessKey={setStrictnessKey}
        onTriggerDemoEject={triggerManualEject}
      />
    </div>
  );
}
