// Web Audio API Sound Synthesizer for ATM Emulator

class AtmAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.alarmOscillator = null;
    this.alarmInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted && this.alarmInterval) {
      this.stopAlarm();
    }
  }

  playBeep(freq = 1200, duration = 0.06, type = 'sine') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  playConfirmBeep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.25);
    } catch (e) {}
  }

  playErrorBeep() {
    if (this.muted) return;
    this.playBeep(220, 0.2, 'sawtooth');
  }

  playCardInsert() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playCashDispense() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Simulate mechanical fluttering count sound
    let count = 0;
    const interval = setInterval(() => {
      this.playBeep(300 + Math.random() * 200, 0.03, 'triangle');
      count++;
      if (count > 12) {
        clearInterval(interval);
        // Final shutter open chime
        setTimeout(() => this.playConfirmBeep(), 100);
      }
    }, 60);
  }

  playAlarm() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.stopAlarm();

    let high = true;
    const triggerTone = () => {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(high ? 960 : 770, this.ctx.currentTime);
        high = !high;

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch (e) {}
    };

    triggerTone();
    this.alarmInterval = setInterval(triggerTone, 250);
  }

  stopAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  speakWarning() {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance("Automatic Turning away of Mxxko 発動。直ちにATMから退出してください。");
        utterance.lang = "ja-JP";
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  }
}

export const atmAudio = new AtmAudioEngine();
