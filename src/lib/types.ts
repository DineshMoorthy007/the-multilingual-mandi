// Enhanced types for the improved app

export interface PriceData {
  commodity: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  timestamp: Date;
  source: string;
  currency: string;
  unit: string;
  dayHigh: number;
  dayLow: number;
  volume?: number;
  location: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechSupported: boolean;
  ttsSupported: boolean;
}

export interface VoiceCommand {
  pattern: RegExp;
  intent: string;
  action: string;
  response: (data?: any) => string;
}

export interface NegotiationSession {
  id: string;
  commodity: string;
  marketPrice: number;
  userPrice?: number;
  aiPrice?: number;
  messages: NegotiationMessage[];
  status: 'active' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
}

export interface NegotiationMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  price?: number;
  type: 'offer' | 'counter' | 'accept' | 'reject' | 'chat';
}

export interface PriceAlert {
  id: string;
  commodity: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  voiceEnabled: boolean;
  notifications: boolean;
  location: string;
  favoritecommodities: string[];
  priceAlerts: PriceAlert[];
}

export interface AppState {
  user: UserPreferences;
  prices: PriceData[];
  negotiation: NegotiationSession | null;
  isOffline: boolean;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}