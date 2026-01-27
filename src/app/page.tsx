'use client';

import React from 'react';
import { VoiceInterface } from '@/components/VoiceInterface';
import { PriceCard } from '@/components/PriceCard';
import { NegotiationChat } from '@/components/NegotiationChat';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BrowserCompatibility } from '@/components/BrowserCompatibility';
import { EnhancedPriceService } from '@/lib/priceService';
import { PriceData, UserPreferences, PriceAlert } from '@/lib/types';
import { SUPPORTED_LANGUAGES, COMMODITIES, TRANSLATIONS } from '@/lib/constants';

export default function Home() {
  // State management
  const [currentLanguage, setCurrentLanguage] = React.useState('hi');
  const [activeView, setActiveView] = React.useState<'dashboard' | 'negotiation' | 'settings'>('dashboard');
  const [prices, setPrices] = React.useState<PriceData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCommodity, setSelectedCommodity] = React.useState<string>('');
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const [priceAlerts, setPriceAlerts] = React.useState<PriceAlert[]>([]);
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'auto'>('light');
  const [userLocation, setUserLocation] = React.useState('delhi');
  const [isOnline, setIsOnline] = React.useState(true);
  
  // Services
  const [priceService] = React.useState(() => new EnhancedPriceService());

  // Initialize app
  React.useEffect(() => {
    loadPrices();
    requestNotificationPermission();
    registerServiceWorker();
    setupOnlineListener();
    
    // Load user preferences from localStorage
    const savedPrefs = localStorage.getItem('mandi-preferences');
    if (savedPrefs) {
      const prefs: UserPreferences = JSON.parse(savedPrefs);
      setCurrentLanguage(prefs.language);
      setTheme(prefs.theme);
      setUserLocation(prefs.location);
      setPriceAlerts(prefs.priceAlerts);
    }
  }, []);

  // Save preferences when they change
  React.useEffect(() => {
    const preferences: UserPreferences = {
      language: currentLanguage,
      theme,
      voiceEnabled: true,
      notifications: true,
      location: userLocation,
      favoritecommodities: [],
      priceAlerts
    };
    localStorage.setItem('mandi-preferences', JSON.stringify(preferences));
  }, [currentLanguage, theme, userLocation, priceAlerts]);

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  };

  const setupOnlineListener = () => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  };

  const loadPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const newPrices = await priceService.getCurrentPrices(userLocation);
      setPrices(newPrices);
    } catch (err) {
      setError('Failed to load prices');
      console.error('Error loading prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceResult = (result: any) => {
    console.log('Voice command result:', result);
    
    switch (result.action) {
      case 'get_price':
        if (result.data?.commodity) {
          // Find and highlight the commodity
          const commodity = COMMODITIES.find(c => 
            Object.values(c.name).some(name => 
              name.toLowerCase().includes(result.commodity.toLowerCase())
            )
          );
          if (commodity) {
            setSelectedCommodity(commodity.id);
          }
        }
        break;
      case 'show_dashboard':
        setActiveView('dashboard');
        break;
      case 'start_negotiation':
        setActiveView('negotiation');
        break;
    }
  };

  const handleVoiceError = (error: string) => {
    setError(error);
    setTimeout(() => setError(null), 3000);
  };

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
  };

  const handleSetPriceAlert = (commodity: string, targetPrice: number) => {
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      commodity,
      targetPrice,
      condition: 'below', // Default to below for buying alerts
      isActive: true,
      createdAt: new Date()
    };
    
    setPriceAlerts(prev => [...prev, newAlert]);
    
    // Show confirmation
    const alertText = {
      hi: `${commodity} के लिए ₹${targetPrice} का अलर्ट सेट किया गया`,
      en: `Price alert set for ${commodity} at ₹${targetPrice}`,
      ta: `${commodity} க்கு ₹${targetPrice} விலை எச்சரிக்கை அமைக்கப்பட்டது`,
      te: `${commodity} కోసం ₹${targetPrice} వద్ద ప్రైస్ అలర్ట్ సెట్ చేయబడింది`,
      kn: `${commodity} ಗಾಗಿ ₹${targetPrice} ನಲ್ಲಿ ಬೆಲೆ ಎಚ್ಚರಿಕೆ ಹೊಂದಿಸಲಾಗಿದೆ`
    };
    
    alert(alertText[currentLanguage as keyof typeof alertText] || alertText.en);
  };

  const handleWhatsAppGenerate = (message: string) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const selectedPrice = prices.find(p => p.commodity === selectedCommodity);

  const getWelcomeMessage = () => {
    return TRANSLATIONS.welcome[currentLanguage as keyof typeof TRANSLATIONS.welcome] || 'Welcome to Mandi';
  };

  const getSubtitle = () => {
    return TRANSLATIONS.subtitle[currentLanguage as keyof typeof TRANSLATIONS.subtitle] || 'Get today\'s prices and trade better';
  };

  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode - use system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Enhanced Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">म</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-700 dark:text-green-400">
                मंडी / Mandi
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentLanguage === 'hi' ? 'बहुभाषी बाज़ार' : 'Multilingual Market'}
              </p>
            </div>
            {loading && <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin ml-3"></div>}
            {!isOnline && (
              <div className="ml-3 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded-full flex items-center space-x-1">
                <span>📡</span>
                <span>
                  {currentLanguage === 'hi' ? 'ऑफलाइन' : 
                   currentLanguage === 'ta' ? 'ஆஃப்லைன்' :
                   currentLanguage === 'te' ? 'ఆఫ్‌లైన్' :
                   currentLanguage === 'kn' ? 'ಆಫ್‌ಲೈನ್' : 'Offline'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              <span className="text-xl">
                {theme === 'light' ? '🌙' : theme === 'dark' ? '🌓' : '☀️'}
              </span>
            </button>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-green-600 text-green-700 dark:text-green-400 rounded-xl hover:bg-green-600 hover:text-white dark:hover:bg-green-700 transition-all duration-200 shadow-sm"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="hidden sm:inline font-medium">{currentLang.nativeName}</span>
                <span className="text-xs transform transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}">▼</span>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 ${
                        currentLanguage === lang.code ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-400 border-r-4 border-green-500' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{lang.nativeName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{lang.name}</div>
                      </div>
                      {currentLanguage === lang.code && (
                        <span className="text-green-500 flex-shrink-0">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeView === 'dashboard' 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>📊</span>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveView('negotiation')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeView === 'negotiation' 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>💬</span>
                <span className="hidden sm:inline">Negotiate</span>
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeView === 'settings' 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>⚙️</span>
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-4">
              {getWelcomeMessage()}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
              {getSubtitle()}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>🌍</span>
              <span>
                {currentLanguage === 'hi' ? '5 भाषाओं में उपलब्ध' : 
                 currentLanguage === 'ta' ? '5 மொழிகளில் கிடைக்கிறது' :
                 currentLanguage === 'te' ? '5 భాషలలో అందుబాటులో' :
                 currentLanguage === 'kn' ? '5 ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯ' : 'Available in 5 languages'}
              </span>
              <span>•</span>
              <span>🎤</span>
              <span>
                {currentLanguage === 'hi' ? 'वॉइस कमांड' : 
                 currentLanguage === 'ta' ? 'குரல் கட்டளைகள்' :
                 currentLanguage === 'te' ? 'వాయిస్ కమాండ్స్' :
                 currentLanguage === 'kn' ? 'ಧ್ವನಿ ಆಜ್ಞೆಗಳು' : 'Voice Commands'}
              </span>
            </div>
          </div>
          
          {/* Enhanced Voice Input */}
          <div className="mb-12 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl p-8 shadow-lg border border-green-200 dark:border-green-800">
            <VoiceInterface 
              language={currentLanguage}
              onVoiceResult={handleVoiceResult}
              onError={handleVoiceError}
            />
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div 
                className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]`}
                onClick={() => setActiveView('dashboard')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white text-xl">
                    📊
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {TRANSLATIONS.checkRates[currentLanguage as keyof typeof TRANSLATIONS.checkRates]}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'hi' ? 'आज के ताजे भाव' : 
                       currentLanguage === 'ta' ? 'இன்றைய புதிய விலைகள்' :
                       currentLanguage === 'te' ? 'నేటి తాజా ధరలు' :
                       currentLanguage === 'kn' ? 'ಇಂದಿನ ತಾಜಾ ಬೆಲೆಗಳು' : 'Today\'s fresh prices'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-green-700 font-medium">
                  📈 {currentLanguage === 'hi' ? 'लाइव प्राइस देखें' : 
                       currentLanguage === 'ta' ? 'நேரடி விலைகளைப் பார்க்கவும்' :
                       currentLanguage === 'te' ? 'లైవ్ ప్రైస్‌లను చూడండి' :
                       currentLanguage === 'kn' ? 'ಲೈವ್ ಬೆಲೆಗಳನ್ನು ನೋಡಿ' : 'View Live Prices'}
                </div>
              </div>

              <div 
                className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]`}
                onClick={() => setActiveView('negotiation')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-white text-xl">
                    💬
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {TRANSLATIONS.negotiate[currentLanguage as keyof typeof TRANSLATIONS.negotiate]}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'hi' ? 'AI के साथ प्रैक्टिस करें' : 
                       currentLanguage === 'ta' ? 'AI உடன் பயிற்சி செய்யுங்கள்' :
                       currentLanguage === 'te' ? 'AI తో ప్రాక్టీస్ చేయండి' :
                       currentLanguage === 'kn' ? 'AI ಜೊತೆ ಅಭ್ಯಾಸ ಮಾಡಿ' : 'Practice with AI'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-yellow-600 font-medium">
                  💬 {currentLanguage === 'hi' ? 'बातचीत शुरू करें' : 
                       currentLanguage === 'ta' ? 'பேச்சுவார்த்தை தொடங்குங்கள்' :
                       currentLanguage === 'te' ? 'చర్చలు ప్రారంభించండి' :
                       currentLanguage === 'kn' ? 'ಚರ್ಚೆ ಪ್ರಾರಂಭಿಸಿ' : 'Start Conversation'}
                </div>
              </div>
            </div>

            {/* Price Cards */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {currentLanguage === 'hi' ? 'आज के भाव' : 
                   currentLanguage === 'ta' ? 'இன்றைய விலைகள்' :
                   currentLanguage === 'te' ? 'నేటి ధరలు' :
                   currentLanguage === 'kn' ? 'ಇಂದಿನ ಬೆಲೆಗಳು' : 'Today\'s Prices'}
                </h2>
                <button
                  onClick={loadPrices}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center space-x-2"
                >
                  <span>🔄</span>
                  <span>
                    {currentLanguage === 'hi' ? 'रिफ्रेश' : 
                     currentLanguage === 'ta' ? 'புதுப்பிக்கவும்' :
                     currentLanguage === 'te' ? 'రిఫ్రెష్' :
                     currentLanguage === 'kn' ? 'ರಿಫ್ರೆಶ್' : 'Refresh'}
                  </span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <LoadingSpinner size="lg" language={currentLanguage} />
                  </div>
                ) : prices.length > 0 ? (
                  prices.map((priceData, index) => (
                    <PriceCard 
                      key={`${priceData.commodity}-${index}`}
                      priceData={priceData}
                      language={currentLanguage}
                      onSetAlert={handleSetPriceAlert}
                      onClick={() => setSelectedCommodity(priceData.commodity)}
                      selectedCommodity={selectedCommodity}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-500">
                      {currentLanguage === 'hi' ? 'कोई डेटा उपलब्ध नहीं है' :
                       currentLanguage === 'ta' ? 'தரவு கிடைக்கவில்லை' :
                       currentLanguage === 'te' ? 'డేటా అందుబాటులో లేదు' :
                       currentLanguage === 'kn' ? 'ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ' : 'No data available'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Negotiation View */}
        {activeView === 'negotiation' && (
          <div className="space-y-6">
            {selectedPrice ? (
              <NegotiationChat
                commodity={selectedPrice.commodity}
                marketPrice={selectedPrice.currentPrice}
                language={currentLanguage}
                onClose={() => setActiveView('dashboard')}
                onWhatsAppGenerate={handleWhatsAppGenerate}
              />
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  {currentLanguage === 'hi' ? 'कमोडिटी चुनें' : 
                   currentLanguage === 'ta' ? 'பொருளைத் தேர்ந்தெடுக்கவும்' :
                   currentLanguage === 'te' ? 'కమోడిటీని ఎంచుకోండి' :
                   currentLanguage === 'kn' ? 'ಸರಕುಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select Commodity'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {currentLanguage === 'hi' ? 'बातचीत शुरू करने के लिए कोई कमोडिटी चुनें' : 
                   currentLanguage === 'ta' ? 'பேச்சுவார்த்தை தொடங்க ஒரு பொருளைத் தேர்ந்தெடுக்கவும்' :
                   currentLanguage === 'te' ? 'చర్చలు ప్రారంభించడానికి ఒక కమోడిటీని ఎంచుకోండి' :
                   currentLanguage === 'kn' ? 'ಚರ್ಚೆ ಪ್ರಾರಂಭಿಸಲು ಒಂದು ಸರಕುಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select a commodity to start negotiation'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {prices.slice(0, 8).map((price) => {
                    const commodity = COMMODITIES.find(c => c.id === price.commodity);
                    return (
                      <button
                        key={price.commodity}
                        onClick={() => setSelectedCommodity(price.commodity)}
                        className={`p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-lg hover:shadow-lg transition-all hover:scale-105`}
                      >
                        <div className="text-3xl mb-2">{commodity?.icon}</div>
                        <div className="text-sm font-medium">
                          {commodity?.name[currentLanguage as keyof typeof commodity.name]}
                        </div>
                        <div className="text-xs text-gray-500">₹{price.currentPrice}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings View */}
        {activeView === 'settings' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLanguage === 'hi' ? 'सेटिंग्स' : 
                 currentLanguage === 'ta' ? 'அமைப்புகள்' :
                 currentLanguage === 'te' ? 'సెట్టింగ్స్' :
                 currentLanguage === 'kn' ? 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' : 'Settings'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentLanguage === 'hi' ? 'ऐप की सेटिंग्स और कम्पैटिबिलिटी जांचें' : 
                 currentLanguage === 'ta' ? 'பயன்பாட்டு அமைப்புகள் மற்றும் இணக்கத்தன்மையைச் சரிபார்க்கவும்' :
                 currentLanguage === 'te' ? 'యాప్ సెట్టింగ్స్ మరియు అనుకూలతను తనిఖీ చేయండి' :
                 currentLanguage === 'kn' ? 'ಅಪ್ಲಿಕೇಶನ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಹೊಂದಾಣಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ' : 'Check app settings and compatibility'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Browser Compatibility */}
              <BrowserCompatibility language={currentLanguage} />
              
              {/* App Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <span>📱</span>
                  <span>
                    {currentLanguage === 'hi' ? 'ऐप की जानकारी' : 
                     currentLanguage === 'ta' ? 'பயன்பாட்டு தகவல்' :
                     currentLanguage === 'te' ? 'యాప్ సమాచారం' :
                     currentLanguage === 'kn' ? 'ಅಪ್ಲಿಕೇಶನ್ ಮಾಹಿತಿ' : 'App Information'}
                  </span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {currentLanguage === 'hi' ? 'वर्जन' : 'Version'}
                    </span>
                    <span className="text-sm font-medium">1.0.0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {currentLanguage === 'hi' ? 'भाषाएं' : 'Languages'}
                    </span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {currentLanguage === 'hi' ? 'कमोडिटीज' : 'Commodities'}
                    </span>
                    <span className="text-sm font-medium">{COMMODITIES.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {currentLanguage === 'hi' ? 'थीम' : 'Theme'}
                    </span>
                    <span className="text-sm font-medium capitalize">{theme}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {currentLanguage === 'hi' ? 'लोकेशन' : 'Location'}
                    </span>
                    <span className="text-sm font-medium capitalize">{userLocation}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>
                      {currentLanguage === 'hi' ? '🎉 सभी फीचर्स सक्रिय हैं!' : '🎉 All features are active!'}
                    </strong>
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {currentLanguage === 'hi' 
                      ? 'वॉइस कमांड्स, AI नेगोसिएशन, और प्राइस अलर्ट्स का आनंद लें।' 
                      : 'Enjoy voice commands, AI negotiation, and price alerts.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <span>⚡</span>
                <span>
                  {currentLanguage === 'hi' ? 'त्वरित कार्य' : 
                   currentLanguage === 'ta' ? 'விரைவு செயல்கள்' :
                   currentLanguage === 'te' ? 'త్వరిత చర్యలు' :
                   currentLanguage === 'kn' ? 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು' : 'Quick Actions'}
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={loadPrices}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-medium text-sm">
                    {currentLanguage === 'hi' ? 'प्राइसेस रिफ्रेश करें' : 'Refresh Prices'}
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    localStorage.removeItem('mandi-preferences');
                    window.location.reload();
                  }}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-medium text-sm">
                    {currentLanguage === 'hi' ? 'सेटिंग्स रीसेट करें' : 'Reset Settings'}
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium text-sm">
                    {currentLanguage === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Price Alerts Display */}
        {priceAlerts.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="font-semibold mb-2">
              {currentLanguage === 'hi' ? 'सक्रिय अलर्ट' : 
               currentLanguage === 'ta' ? 'செயலில் உள்ள எச்சரிக்கைகள்' :
               currentLanguage === 'te' ? 'క్రియాశీల అలర్ట్‌లు' :
               currentLanguage === 'kn' ? 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು' : 'Active Alerts'}
            </h3>
            <div className="space-y-2">
              {priceAlerts.filter(alert => alert.isActive).map(alert => (
                <div key={alert.id} className="flex items-center justify-between text-sm">
                  <span>{alert.commodity} - ₹{alert.targetPrice}</span>
                  <button
                    onClick={() => setPriceAlerts(prev => prev.filter(a => a.id !== alert.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
    </ErrorBoundary>
  );
}
