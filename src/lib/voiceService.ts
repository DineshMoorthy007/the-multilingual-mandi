import { VOICE_COMMANDS, COMMODITIES } from './constants';

export class EnhancedVoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isInitialized = false;
  private currentLanguage = 'hi';
  private isListening = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeServices();
    }
  }

  private initializeServices() {
    try {
      // Initialize Speech Recognition with better browser support
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition || 
                               (window as any).mozSpeechRecognition || 
                               (window as any).msSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
        console.log('Speech Recognition initialized successfully');
      } else {
        console.warn('Speech Recognition not supported in this browser');
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
        this.loadVoices();
        
        // Handle voices loading
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
        console.log('Speech Synthesis initialized successfully');
      } else {
        console.warn('Speech Synthesis not supported in this browser');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing voice services:', error);
      this.isInitialized = false;
    }
  }

  private loadVoices() {
    if (this.synthesis) {
      this.voices = this.synthesis.getVoices();
      console.log('Available voices:', this.voices.length);
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 3;
    
    // Add error handling
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
    };
    
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Speech recognition started');
    };
  }

  public setLanguage(language: string) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = this.getLanguageCode(language);
    }
  }

  private getLanguageCode(lang: string): string {
    const codes: Record<string, string> = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN'
    };
    return codes[lang] || 'hi-IN';
  }

  public async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      if (this.isListening) {
        reject('Already listening');
        return;
      }

      // Request microphone permission first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            this.startRecognition(resolve, reject);
          })
          .catch((error) => {
            reject('Microphone access denied. Please allow microphone access and try again.');
          });
      } else {
        // Fallback for older browsers
        this.startRecognition(resolve, reject);
      }
    });
  }

  private startRecognition(resolve: (value: string) => void, reject: (reason: string) => void) {
    this.recognition.lang = this.getLanguageCode(this.currentLanguage);

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Speech recognized:', transcript);
      resolve(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition failed. ';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage += 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage += 'Microphone not accessible. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage += 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage += 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage += 'Please try again.';
      }
      
      reject(errorMessage);
    };

    try {
      this.recognition.start();
    } catch (error) {
      reject('Failed to start speech recognition. Please try again.');
    }
  }

  public async speak(text: string, language?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        console.warn('Speech synthesis not supported');
        resolve(); // Don't reject, just skip speaking
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = this.getLanguageCode(language || this.currentLanguage);
      utterance.lang = langCode;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Try to find a suitable voice
      const voice = this.findBestVoice(langCode);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        console.log('Speech synthesis completed');
        resolve();
      };
      
      utterance.onerror = (event) => {
        // Only log non-interrupt errors
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event.error);
        }
        resolve(); // Don't reject, just complete silently
      };

      try {
        this.synthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to start speech synthesis:', error);
        resolve(); // Don't reject, just complete silently
      }
    });
  }

  private findBestVoice(langCode: string): SpeechSynthesisVoice | null {
    if (!this.voices.length) {
      this.loadVoices();
    }

    // First try to find exact match
    let voice = this.voices.find(v => v.lang === langCode);
    
    // If not found, try language without region
    if (!voice) {
      const baseLang = langCode.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(baseLang));
    }
    
    // If still not found, try any voice that contains the language
    if (!voice) {
      const baseLang = langCode.split('-')[0];
      voice = this.voices.find(v => v.lang.includes(baseLang));
    }

    return voice || null;
  }

  public processVoiceCommand(transcript: string): {
    intent: string;
    commodity?: string;
    action: string;
    response: string;
    data?: any;
  } {
    const commands = VOICE_COMMANDS[this.currentLanguage] || VOICE_COMMANDS['hi'];
    
    for (const command of commands) {
      const match = transcript.match(command.pattern);
      if (match) {
        let commodity = '';
        let data = {};

        if (command.intent === 'price_query') {
          // Extract commodity from the match
          commodity = match[1] || match[2] || match[3] || '';
          
          // Find commodity in our database
          const commodityData = this.findCommodity(commodity);
          if (commodityData) {
            data = {
              commodity: commodityData.name[this.currentLanguage as keyof typeof commodityData.name],
              price: this.getMockPrice(commodityData.id),
              unit: 'kg'
            };
          }
        }

        return {
          intent: command.intent,
          commodity,
          action: command.action,
          response: command.response(data),
          data
        };
      }
    }

    return {
      intent: 'unknown',
      action: 'no_action',
      response: this.getUnknownResponse()
    };
  }

  private findCommodity(spokenName: string): any {
    const lowerSpoken = spokenName.toLowerCase();
    
    return COMMODITIES.find(commodity => {
      const names = Object.values(commodity.name);
      return names.some(name => 
        name.toLowerCase().includes(lowerSpoken) || 
        lowerSpoken.includes(name.toLowerCase())
      );
    });
  }

  private getMockPrice(commodityId: string): number {
    const basePrices: Record<string, number> = {
      tomato: 45,
      onion: 35,
      potato: 25,
      wheat: 2200,
      rice: 3500,
      carrot: 30,
      cabbage: 20,
      cauliflower: 40
    };
    
    const basePrice = basePrices[commodityId] || 50;
    return Math.round(basePrice + (Math.random() * 20 - 10));
  }

  private getUnknownResponse(): string {
    const responses = {
      hi: 'समझ नहीं आया, कृपया दोबारा बोलें',
      en: 'I did not understand, please speak again',
      ta: 'புரியவில்லை, தயவுசெய்து மீண்டும் பேசுங்கள்',
      te: 'అర్థం కాలేదు, దయచేసి మళ్లీ మాట్లాడండి',
      kn: 'ಅರ್ಥವಾಗಲಿಲ್ಲ, ದಯವಿಟ್ಟು ಮತ್ತೆ ಮಾತನಾಡಿ'
    };
    
    return responses[this.currentLanguage as keyof typeof responses] || responses.hi;
  }

  public isSupported(): boolean {
    return this.isInitialized && (this.recognition !== null || this.synthesis !== null);
  }

  public isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  public isSpeechSynthesisSupported(): boolean {
    return this.synthesis !== null;
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}