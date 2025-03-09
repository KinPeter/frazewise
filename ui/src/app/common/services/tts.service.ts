import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private supportedVoices = signal<SpeechSynthesisVoice[]>([]);
  private currentLang = signal<string>('');
  private isUserEnabled = signal<boolean>(true);

  constructor() {
    this.supportedVoices.set(window.speechSynthesis.getVoices());
    window.speechSynthesis.onvoiceschanged = () => {
      this.supportedVoices.set(window.speechSynthesis.getVoices());
    };
  }

  public isBrowserEnabled = computed(() => this.voicesForLang().length > 0);
  public isEnabled = computed(() => this.isBrowserEnabled() && this.isUserEnabled());

  private voicesForLang = computed(() =>
    this.supportedVoices().filter(voice => {
      const lang = this.currentLang();
      if (lang === 'en') {
        return voice.lang === 'en-US' || voice.lang === 'en-GB';
      } else if (lang === 'de') {
        return voice.lang === 'de-DE' || voice.lang === 'de-AT';
      } else {
        return voice.lang.toLowerCase().startsWith(lang.toLowerCase());
      }
    })
  );

  public initForLang(lang: string): void {
    this.currentLang.set(lang);
  }

  public toggleVoice(): void {
    this.isUserEnabled.update(value => !value);
  }

  public readOut(text: string): void {
    const lang = this.currentLang();
    const voices = this.voicesForLang();
    if (!lang || !voices.length || !this.isBrowserEnabled() || !this.isUserEnabled()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    if (voices.length !== 0) {
      const randomIndex = Math.floor(Math.random() * voices.length);
      utterance.voice = voices[randomIndex];
    }

    window.speechSynthesis.speak(utterance);
  }
}
