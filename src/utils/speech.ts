// HanMoa (ハンモア) - 韓国語音声再生サービス (Web Speech API ＆ オプションTTS)

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private koreanVoice: SpeechSynthesisVoice | null = null;
  private isVoiceLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const koVoice = voices.find(v => v.lang.startsWith('ko') || v.lang.includes('Korean'));
    if (koVoice) {
      this.koreanVoice = koVoice;
      this.isVoiceLoaded = true;
    }
  }

  public unlockAudio() {
    // iOS Safari などのオーディオアンロック用ダミー
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * 韓国語のテキストを読み上げる
   */
  public async speak(
    text: string,
    optionsOrRate?: number | SpeakOptions
  ): Promise<void> {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported on this device.');
      return;
    }

    this.stop();

    if (!this.isVoiceLoaded) {
      this.initVoices();
    }

    const options: SpeakOptions =
      typeof optionsOrRate === 'number'
        ? { rate: optionsOrRate }
        : optionsOrRate || {};

    const rate = options.rate ?? 0.9;
    const pitch = options.pitch ?? 1.0;

    return new Promise((resolve) => {
      const cleanText = text.replace(/\[.*?\]|\(.*?\)/g, '').trim();
      if (!cleanText) {
        options.onEnd?.();
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ko-KR';
      utterance.rate = rate;
      utterance.pitch = pitch;

      if (this.koreanVoice) {
        utterance.voice = this.koreanVoice;
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        options.onError?.();
        resolve();
      };

      this.synth!.speak(utterance);
    });
  }

  public async speakSlow(text: string): Promise<void> {
    return this.speak(text, { rate: 0.7 });
  }

  public stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
