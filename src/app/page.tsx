'use client';

import React from 'react';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = React.useState('hi');
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [recognition, setRecognition] = React.useState<any>(null);

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
        
        // Simple voice command processing
        if (transcript.toLowerCase().includes('tomato') || transcript.includes('टमाटर')) {
          setTimeout(() => {
            const response = currentLanguage === 'hi' 
              ? 'टमाटर का भाव ₹45 प्रति किलो है'
              : 'Tomato price is ₹45 per kg';
            speak(response);
          }, 500);
        }
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [currentLanguage]);

  const startVoiceRecognition = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Speech recognition error:', error);
        // Fallback simulation
        setIsListening(true);
        setTimeout(() => {
          setTranscript(currentLanguage === 'hi' ? 'टमाटर का भाव क्या है?' : 'What is the price of tomatoes?');
          setIsListening(false);
        }, 2000);
      }
    } else {
      // Fallback simulation for browsers without speech recognition
      setIsListening(true);
      setTimeout(() => {
        setTranscript(currentLanguage === 'hi' ? 'टमाटर का भाव क्या है?' : 'What is the price of tomatoes?');
        setIsListening(false);
      }, 2000);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getWelcomeMessage = () => {
    return currentLanguage === 'hi' 
      ? 'मंडी में आपका स्वागत है' 
      : 'Welcome to Mandi';
  };

  const getSubtitle = () => {
    return currentLanguage === 'hi'
      ? 'आज के भाव जानें और बेहतर व्यापार करें'
      : 'Get today\'s prices and trade better';
  };

  const mockPrices = [
    {
      commodity: 'tomato',
      name: currentLanguage === 'hi' ? 'टमाटर' : 'Tomato',
      price: 45,
      trend: 'up',
      icon: '🍅'
    },
    {
      commodity: 'onion',
      name: currentLanguage === 'hi' ? 'प्याज' : 'Onion',
      price: 35,
      trend: 'down',
      icon: '🧅'
    },
    {
      commodity: 'potato',
      name: currentLanguage === 'hi' ? 'आलू' : 'Potato',
      price: 25,
      trend: 'stable',
      icon: '🥔'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-2 border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">म</span>
            </div>
            <h1 className="text-xl font-semibold text-green-700">
              मंडी / Mandi
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentLanguage(currentLanguage === 'hi' ? 'en' : 'hi')}
              className="px-4 py-2 border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-colors"
            >
              {currentLanguage === 'hi' ? 'हिंदी' : 'English'}
            </button>
            
            <button
              onClick={startVoiceRecognition}
              disabled={isListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
                isListening ? 'bg-green-500 animate-pulse' : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              🎤
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            {getWelcomeMessage()}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {getSubtitle()}
          </p>
          
          {/* Voice Input */}
          <div className="mb-8">
            <button
              onClick={startVoiceRecognition}
              disabled={isListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl transition-all shadow-lg ${
                isListening ? 'bg-green-500 animate-pulse scale-110' : 'bg-yellow-600 hover:bg-yellow-700 hover:scale-105'
              }`}
            >
              🎤
            </button>
            
            <p className="mt-4 text-lg font-medium text-gray-700">
              {isListening 
                ? (currentLanguage === 'hi' ? 'सुन रहे हैं...' : 'Listening...') 
                : (currentLanguage === 'hi' ? 'बोलने के लिए दबाएं' : 'Tap to speak')
              }
            </p>
            
            {transcript && (
              <div className="mt-4 p-4 bg-gray-100 border-l-4 border-green-700 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-gray-600 mb-1">
                  {currentLanguage === 'hi' ? 'आपने कहा:' : 'You said:'}
                </p>
                <p className="font-medium">{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-white text-xl">
                📊
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentLanguage === 'hi' ? 'भाव देखें' : 'Check Rates'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'आज के ताजे भाव' : 'Today\'s fresh prices'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-green-700 font-medium">
              📈 {currentLanguage === 'hi' ? 'लाइव प्राइस देखें' : 'View Live Prices'}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-white text-xl">
                💬
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentLanguage === 'hi' ? 'भाव-ताव करें' : 'Negotiate'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'AI के साथ प्रैक्टिस करें' : 'Practice with AI'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-yellow-600 font-medium">
              💬 {currentLanguage === 'hi' ? 'बातचीत शुरू करें' : 'Start Conversation'}
            </div>
          </div>
        </div>

        {/* Price Dashboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentLanguage === 'hi' ? 'आज के भाव' : 'Today\'s Prices'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPrices.map((item, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {currentLanguage === 'hi' ? 'प्रति किलो' : 'per kg'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➖'}
                      </span>
                      <span className={`font-semibold ${
                        item.trend === 'up' ? 'text-green-600' : 
                        item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {item.trend === 'up' ? '+₹5' : item.trend === 'down' ? '-₹3' : '₹0'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    {currentLanguage === 'hi' ? 'अपडेट:' : 'Updated:'} {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className="mt-12 p-6 bg-white rounded-2xl border-2 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentLanguage === 'hi' ? 'आवाज़ कमांड्स' : 'Voice Commands'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700 mb-2">
                {currentLanguage === 'hi' ? 'भाव पूछने के लिए:' : 'To ask for prices:'}
              </p>
              <ul className="space-y-1 text-gray-600">
                <li>• "{currentLanguage === 'hi' ? 'टमाटर का भाव क्या है?' : 'What is the price of tomatoes?'}"</li>
                <li>• "{currentLanguage === 'hi' ? 'आज प्याज कितने में है?' : 'How much are onions today?'}"</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">
                {currentLanguage === 'hi' ? 'नेवीगेशन के लिए:' : 'For navigation:'}
              </p>
              <ul className="space-y-1 text-gray-600">
                <li>• "{currentLanguage === 'hi' ? 'भाव दिखाओ' : 'Show prices'}"</li>
                <li>• "{currentLanguage === 'hi' ? 'बातचीत करना है' : 'I want to negotiate'}"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
