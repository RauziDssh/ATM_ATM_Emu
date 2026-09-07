import { useState, useEffect, useRef, useCallback } from 'react';
import { atmAudio } from '../utils/audio';

export const SENSITIVITY_PRESETS = {
  EASY: { label: '緩め (過保護)', multiplier: 0.5, maxIdleSeconds: 30 },
  STANDARD: { label: '標準 (一般的な混雑店)', multiplier: 1.0, maxIdleSeconds: 15 },
  STRICT: { label: '厳密 (行列発生中)', multiplier: 1.8, maxIdleSeconds: 8 },
  EXTREME: { label: '鬼厳格 (Mxxko Rush)', multiplier: 3.5, maxIdleSeconds: 4 },
};

export function useHesitationTracker(currentScreen, strictnessKey = 'STANDARD') {
  const [score, setScore] = useState(0);
  const [isEjected, setIsEjected] = useState(false);
  const [ejectionReason, setEjectionReason] = useState('');
  
  // Tracked metrics
  const [metrics, setMetrics] = useState({
    idleTime: 0,
    hoverHesitationCount: 0,
    backtrackCount: 0,
    totalSessionTime: 0,
    screenTransitions: 0,
    mouseJitterCount: 0,
  });

  const lastActivityRef = useRef(Date.now());
  const mousePosRef = useRef({ x: 0, y: 0, timestamp: Date.now() });
  const hoverTimerRef = useRef({});
  const activeScreenRef = useRef(currentScreen);

  // Sync active screen reference
  useEffect(() => {
    if (activeScreenRef.current !== currentScreen) {
      activeScreenRef.current = currentScreen;
      setMetrics(prev => ({
        ...prev,
        screenTransitions: prev.screenTransitions + 1,
      }));
      // Changing screens resets immediate idle timer slightly but retains total threat
      lastActivityRef.current = Date.now();
    }
  }, [currentScreen]);

  const preset = SENSITIVITY_PRESETS[strictnessKey] || SENSITIVITY_PRESETS.STANDARD;

  // Real-time ticking loop (runs every 100ms)
  useEffect(() => {
    if (isEjected || currentScreen === 'WELCOME') {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const idleSec = (now - lastActivityRef.current) / 1000;
      
      setMetrics(prev => {
        const newTotalSession = prev.totalSessionTime + 0.1;
        const newIdle = idleSec;

        // Calculate hesitation score formula
        // 1. Idle time penalty: exponential curve after 3 seconds
        const idlePenalty = Math.max(0, (newIdle - 2)) * 6.5 * preset.multiplier;
        
        // 2. Hover indecision penalty
        const hoverPenalty = prev.hoverHesitationCount * 5.0 * preset.multiplier;
        
        // 3. Backtrack penalty (cancelling / correcting)
        const backtrackPenalty = prev.backtrackCount * 12.0 * preset.multiplier;
        
        // 4. Session overall duration penalty
        const sessionPenalty = Math.max(0, newTotalSession - 10) * 1.5 * preset.multiplier;

        // 5. Mouse jitter penalty
        const jitterPenalty = prev.mouseJitterCount * 2.0 * preset.multiplier;

        let totalCalculated = Math.floor(idlePenalty + hoverPenalty + backtrackPenalty + sessionPenalty + jitterPenalty);
        if (totalCalculated < 0) totalCalculated = 0;

        // Ejection condition trigger
        if (totalCalculated >= 100 && !isEjected) {
          setIsEjected(true);
          setEjectionReason(
            newIdle > preset.maxIdleSeconds 
              ? `画面操作停止時間超過 (${newIdle.toFixed(1)}秒間無操作)` 
              : prev.backtrackCount >= 2 
              ? `操作のやり直し・迷い行動頻発 (訂正/戻る ${prev.backtrackCount}回)` 
              : `総合遅延指数オーバー (迷い度 ${totalCalculated}点)`
          );
          atmAudio.playAlarm();
          atmAudio.speakWarning();
        }

        setScore(Math.min(100, totalCalculated));

        return {
          ...prev,
          idleTime: newIdle,
          totalSessionTime: newTotalSession,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentScreen, isEjected, preset]);

  // Track Mouse movement jitter / hesitation
  const handleMouseMove = useCallback((e) => {
    if (isEjected || currentScreen === 'WELCOME') return;

    const now = Date.now();
    lastActivityRef.current = now;

    const prevPos = mousePosRef.current;
    const dx = e.clientX - prevPos.x;
    const dy = e.clientY - prevPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = (now - prevPos.timestamp) / 1000;

    // Detect high movement without purpose (mouse jittering frantically across screen)
    if (dt > 0.05 && dt < 0.2 && dist > 150) {
      setMetrics(prev => ({
        ...prev,
        mouseJitterCount: prev.mouseJitterCount + 1,
      }));
    }

    mousePosRef.current = { x: e.clientX, y: e.clientY, timestamp: now };
  }, [currentScreen, isEjected]);

  // Register hover on an ATM button
  const registerButtonHover = useCallback((buttonId) => {
    if (isEjected || currentScreen === 'WELCOME') return;
    
    // If user hovers over a button for more than 1.2s without clicking it
    if (!hoverTimerRef.current[buttonId]) {
      hoverTimerRef.current[buttonId] = setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          hoverHesitationCount: prev.hoverHesitationCount + 1,
        }));
        delete hoverTimerRef.current[buttonId];
      }, 1200);
    }
  }, [currentScreen, isEjected]);

  const unregisterButtonHover = useCallback((buttonId) => {
    if (hoverTimerRef.current[buttonId]) {
      clearTimeout(hoverTimerRef.current[buttonId]);
      delete hoverTimerRef.current[buttonId];
    }
  }, []);

  // Register user backtrack click (Clear / Back button)
  const registerBacktrack = useCallback(() => {
    lastActivityRef.current = Date.now();
    setMetrics(prev => ({
      ...prev,
      backtrackCount: prev.backtrackCount + 1,
    }));
  }, []);

  // Register any normal action / click
  const registerUserAction = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Reset session
  const resetTracker = useCallback(() => {
    setIsEjected(false);
    setScore(0);
    setEjectionReason('');
    setMetrics({
      idleTime: 0,
      hoverHesitationCount: 0,
      backtrackCount: 0,
      totalSessionTime: 0,
      screenTransitions: 0,
      mouseJitterCount: 0,
    });
    lastActivityRef.current = Date.now();
    atmAudio.stopAlarm();
  }, []);

  // Manual trigger for testing ejection
  const triggerManualEject = useCallback(() => {
    setScore(100);
    setIsEjected(true);
    setEjectionReason('デモモード強制発動 (テストボタン操作)');
    atmAudio.playAlarm();
    atmAudio.speakWarning();
  }, []);

  let statusLevel = 'normal';
  if (score >= 100) statusLevel = 'ejected';
  else if (score >= 75) statusLevel = 'critical';
  else if (score >= 50) statusLevel = 'warning';
  else if (score >= 25) statusLevel = 'hesitating';

  return {
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
  };
}
