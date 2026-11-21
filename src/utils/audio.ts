// Synthesized acoustic feedback for Tasbih click and completion chime
class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  playCompletionChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.6);
      });
    } catch {
      // AudioContext unavailable
    }
  }
}

export const soundFx = new SoundSynthesizer();

export interface AdhanReciterOption {
  id: 'makkah' | 'madinah' | 'alafasy' | 'chime';
  url: string;
  labels: {
    uz_lat: string;
    uz_cyr: string;
    en: string;
    ru: string;
  };
}

export const ADHAN_RECITERS: AdhanReciterOption[] = [
  {
    id: 'makkah',
    url: 'https://cdn.aladhan.com/audio/adhans/a1.mp3',
    labels: {
      uz_lat: 'Makka uslubi',
      uz_cyr: 'Макка услуби',
      en: 'Classic Masjid Adhan',
      ru: 'Классический азан',
    },
  },
  {
    id: 'madinah',
    url: 'https://cdn.aladhan.com/audio/adhans/a2.mp3',
    labels: {
      uz_lat: 'Madina ohangi',
      uz_cyr: 'Мадина оҳанги',
      en: 'Haramain Tone',
      ru: 'Мелодичный азан',
    },
  },
  {
    id: 'alafasy',
    url: 'https://cdn.aladhan.com/audio/adhans/a7.mp3',
    labels: {
      uz_lat: 'Qisqa va sokin',
      uz_cyr: 'Қисқа ва сокин',
      en: 'Serene Call',
      ru: 'Спокойный азан',
    },
  },
  {
    id: 'chime',
    url: '',
    labels: {
      uz_lat: 'Mayin signal (Oflayn)',
      uz_cyr: 'Майин сигнал (Офлайн)',
      en: 'Soft Chime (Offline)',
      ru: 'Мягкий сигнал (Офлайн)',
    },
  },
];

// Default live Adhan audio stream
export const ADHAN_AUDIO_URL = ADHAN_RECITERS[0].url;
