class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Read preference if available
    try {
      const stored = localStorage.getItem('fantasy_sound_enabled');
      if (stored !== null) {
        this.soundEnabled = stored === 'true';
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem('fantasy_sound_enabled', String(this.soundEnabled));
    } catch {
      // Ignore
    }
    if (this.soundEnabled) {
      this.playChime();
    }
    return this.soundEnabled;
  }

  public playDiceRoll() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const count = 5;

    for (let i = 0; i < count; i++) {
      const clickTime = now + i * 0.045 + Math.random() * 0.015;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120 + Math.random() * 180, clickTime);
      osc.frequency.exponentialRampToValueAtTime(40, clickTime + 0.04);

      gain.gain.setValueAtTime(0.08, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(clickTime);
      osc.stop(clickTime + 0.05);
    }
  }

  public playChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Play warm minor/major pentatonic chord notes: D4, F#4, A4, D5
    const freqs = [293.66, 369.99, 440.0, 587.33];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = now + idx * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.04, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }

  public playCartoonPowerUp() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Play upbeat video game level-up arpeggio: C5, E5, G5, B5, C6
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = now + idx * 0.055;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.06, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.28);
    });
  }

  public playQuillScratch() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Create soft parchment quill scratch sound
    for (let i = 0; i < 4; i++) {
      const scratchTime = now + i * 0.045 + Math.random() * 0.01;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600 + Math.random() * 400, scratchTime);
      osc.frequency.exponentialRampToValueAtTime(150, scratchTime + 0.035);

      gain.gain.setValueAtTime(0.02, scratchTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, scratchTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(scratchTime);
      osc.stop(scratchTime + 0.04);
    }
  }

  public playQuestFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Heroic fanfare notes: G4, C5, E5, G5
    const notes = [392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.06, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });
  }

  public playSwordClash() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playSpellCast() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.22);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playVictoryFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Victory fanfare: C5, G4, C5, E5, G5, C6
    const freqs = [523.25, 392.0, 523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = now + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.07, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.48);
    });
  }
}

export const soundManager = new SoundManager();
