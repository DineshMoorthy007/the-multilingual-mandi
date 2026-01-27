import { Language, VoiceCommand } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    speechSupported: true,
    ttsSupported: true,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    speechSupported: true,
    ttsSupported: true,
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    speechSupported: true,
    ttsSupported: true,
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    speechSupported: true,
    ttsSupported: true,
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    speechSupported: true,
    ttsSupported: true,
  },
];

export const COMMODITIES = [
  { id: 'tomato', name: { hi: 'टमाटर', en: 'Tomato', ta: 'தக்காளி', te: 'టమాటో', kn: 'ಟೊಮೇಟೊ' }, icon: '🍅', category: 'vegetables' },
  { id: 'onion', name: { hi: 'प्याज', en: 'Onion', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', kn: 'ಈರುಳ್ಳಿ' }, icon: '🧅', category: 'vegetables' },
  { id: 'potato', name: { hi: 'आलू', en: 'Potato', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప', kn: 'ಆಲೂಗಡ್ಡೆ' }, icon: '🥔', category: 'vegetables' },
  { id: 'wheat', name: { hi: 'गेहूं', en: 'Wheat', ta: 'கோதுமை', te: 'గోధుమ', kn: 'ಗೋಧಿ' }, icon: '🌾', category: 'grains' },
  { id: 'rice', name: { hi: 'चावल', en: 'Rice', ta: 'அரிசி', te: 'బియ్యం', kn: 'ಅಕ್ಕಿ' }, icon: '🍚', category: 'grains' },
  { id: 'carrot', name: { hi: 'गाजर', en: 'Carrot', ta: 'கேரட்', te: 'క్యారెట్', kn: 'ಕ್ಯಾರೆಟ್' }, icon: '🥕', category: 'vegetables' },
  { id: 'cabbage', name: { hi: 'पत्ता गोभी', en: 'Cabbage', ta: 'முட்டைகோஸ்', te: 'కాబేజీ', kn: 'ಎಲೆಕೋಸು' }, icon: '🥬', category: 'vegetables' },
  { id: 'cauliflower', name: { hi: 'फूल गोभी', en: 'Cauliflower', ta: 'காலிஃப்ளவர்', te: 'కాలీఫ్లవర్', kn: 'ಹೂಕೋಸು' }, icon: '🥦', category: 'vegetables' },
];

export const LOCATIONS = [
  { id: 'delhi', name: { hi: 'दिल्ली', en: 'Delhi', ta: 'டெல்லி', te: 'ఢిల్లీ', kn: 'ದೆಹಲಿ' } },
  { id: 'mumbai', name: { hi: 'मुंबई', en: 'Mumbai', ta: 'மும்பை', te: 'ముంబై', kn: 'ಮುಂಬೈ' } },
  { id: 'kolkata', name: { hi: 'कोलकाता', en: 'Kolkata', ta: 'கொல்கத்தா', te: 'కోల్‌కతా', kn: 'ಕೋಲ್ಕತ್ತಾ' } },
  { id: 'chennai', name: { hi: 'चेन्नई', en: 'Chennai', ta: 'சென்னை', te: 'చెన్నై', kn: 'ಚೆನ್ನೈ' } },
  { id: 'bangalore', name: { hi: 'बेंगलुरु', en: 'Bangalore', ta: 'பெங்களூரு', te: 'బెంగళూరు', kn: 'ಬೆಂಗಳೂರು' } },
  { id: 'hyderabad', name: { hi: 'हैदराबाद', en: 'Hyderabad', ta: 'ஹைதராபாத்', te: 'హైదరాబాద్', kn: 'ಹೈದರಾಬಾದ್' } },
];

export const VOICE_COMMANDS: Record<string, VoiceCommand[]> = {
  hi: [
    {
      pattern: /(\w+)\s*का\s*भाव|(\w+)\s*की\s*कीमत|(\w+)\s*कितने\s*में/i,
      intent: 'price_query',
      action: 'get_price',
      response: (data) => `${data.commodity} का भाव ₹${data.price} प्रति ${data.unit} है`
    },
    {
      pattern: /भाव\s*दिखाओ|प्राइस\s*दिखाओ|दाम\s*बताओ/i,
      intent: 'show_prices',
      action: 'show_dashboard',
      response: () => 'सभी भाव दिखा रहे हैं'
    },
    {
      pattern: /बातचीत|नेगोसिएशन|भाव.*ताव/i,
      intent: 'negotiate',
      action: 'start_negotiation',
      response: () => 'बातचीत शुरू कर रहे हैं'
    }
  ],
  en: [
    {
      pattern: /price\s*of\s*(\w+)|(\w+)\s*price|how\s*much\s*(\w+)/i,
      intent: 'price_query',
      action: 'get_price',
      response: (data) => `${data.commodity} price is ₹${data.price} per ${data.unit}`
    },
    {
      pattern: /show\s*prices|view\s*rates|display\s*prices/i,
      intent: 'show_prices',
      action: 'show_dashboard',
      response: () => 'Showing all prices'
    },
    {
      pattern: /negotiate|bargain|deal/i,
      intent: 'negotiate',
      action: 'start_negotiation',
      response: () => 'Starting negotiation'
    }
  ]
};

export const TRANSLATIONS = {
  welcome: {
    hi: 'मंडी में आपका स्वागत है',
    en: 'Welcome to Mandi',
    ta: 'மண்டிக்கு வரவேற்கிறோம்',
    te: 'మండికి స్వాగతం',
    kn: 'ಮಂಡಿಗೆ ಸ್ವಾಗತ'
  },
  subtitle: {
    hi: 'आज के भाव जानें और बेहतर व्यापार करें',
    en: 'Get today\'s prices and trade better',
    ta: 'இன்றைய விலைகளை அறிந்து சிறப்பாக வர்த்தகம் செய்யுங்கள்',
    te: 'నేటి ధరలను తెలుసుకోండి మరియు మెరుగైన వ్యాపారం చేయండి',
    kn: 'ಇಂದಿನ ಬೆಲೆಗಳನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ ಮತ್ತು ಉತ್ತಮ ವ್ಯಾಪಾರ ಮಾಡಿ'
  },
  checkRates: {
    hi: 'भाव देखें',
    en: 'Check Rates',
    ta: 'விலைகளைப் பார்க்கவும்',
    te: 'రేట్లను చూడండి',
    kn: 'ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ'
  },
  negotiate: {
    hi: 'भाव-ताव करें',
    en: 'Negotiate',
    ta: 'பேரம் பேசுங்கள்',
    te: 'చర్చలు జరపండి',
    kn: 'ಚರ್ಚೆ ಮಾಡಿ'
  },
  listening: {
    hi: 'सुन रहे हैं...',
    en: 'Listening...',
    ta: 'கேட்டுக்கொண்டிருக்கிறது...',
    te: 'వింటున్నాం...',
    kn: 'ಕೇಳುತ್ತಿದೆ...'
  },
  tapToSpeak: {
    hi: 'बोलने के लिए दबाएं',
    en: 'Tap to speak',
    ta: 'பேச அழுத்தவும்',
    te: 'మాట్లాడటానికి నొక్కండి',
    kn: 'ಮಾತನಾಡಲು ಒತ್ತಿ'
  }
};