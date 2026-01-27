'use client';

import React from 'react';

interface BrowserCompatibilityProps {
  language: string;
}

export function BrowserCompatibility({ language }: BrowserCompatibilityProps) {
  const [compatibility, setCompatibility] = React.useState({
    speechRecognition: false,
    speechSynthesis: false,
    mediaDevices: false,
    notifications: false,
    serviceWorker: false,
    browser: 'Unknown'
  });

  React.useEffect(() => {
    const checkCompatibility = () => {
      const userAgent = navigator.userAgent;
      let browser = 'Unknown';
      
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      
      setCompatibility({
        speechRecognition: !!(
          (window as any).SpeechRecognition || 
          (window as any).webkitSpeechRecognition ||
          (window as any).mozSpeechRecognition ||
          (window as any).msSpeechRecognition
        ),
        speechSynthesis: 'speechSynthesis' in window,
        mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        notifications: 'Notification' in window,
        serviceWorker: 'serviceWorker' in navigator,
        browser
      });
    };

    checkCompatibility();
  }, []);

  const getStatusIcon = (supported: boolean) => supported ? '✅' : '❌';
  
  const getRecommendation = () => {
    if (compatibility.browser === 'Chrome' || compatibility.browser === 'Edge') {
      return language === 'hi' ? 'बेहतरीन! आपका ब्राउज़र सभी फीचर्स को सपोर्ट करता है।' : 'Excellent! Your browser supports all features.';
    }
    
    if (compatibility.browser === 'Safari') {
      return language === 'hi' ? 'अच्छा! Safari में अधिकतर फीचर्स काम करते हैं।' : 'Good! Most features work in Safari.';
    }
    
    if (compatibility.browser === 'Firefox') {
      return language === 'hi' ? 'Firefox में वॉइस रिकॉग्निशन सीमित है। Chrome का उपयोग करें।' : 'Voice recognition is limited in Firefox. Please use Chrome.';
    }
    
    return language === 'hi' ? 'बेहतर अनुभव के लिए Chrome, Edge या Safari का उपयोग करें।' : 'For the best experience, please use Chrome, Edge, or Safari.';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <span>🔧</span>
        <span>
          {language === 'hi' ? 'ब्राउज़र कम्पैटिबिलिटी' : 
           language === 'ta' ? 'உலாவி இணக்கத்தன்மை' :
           language === 'te' ? 'బ్రౌజర్ అనుకూలత' :
           language === 'kn' ? 'ಬ್ರೌಸರ್ ಹೊಂದಾಣಿಕೆ' : 'Browser Compatibility'}
        </span>
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {language === 'hi' ? 'वॉइस रिकॉग्निशन' : 'Voice Recognition'}
          </span>
          <span>{getStatusIcon(compatibility.speechRecognition)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {language === 'hi' ? 'वॉइस सिंथेसिस' : 'Voice Synthesis'}
          </span>
          <span>{getStatusIcon(compatibility.speechSynthesis)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {language === 'hi' ? 'माइक्रोफोन एक्सेस' : 'Microphone Access'}
          </span>
          <span>{getStatusIcon(compatibility.mediaDevices)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {language === 'hi' ? 'नोटिफिकेशन' : 'Notifications'}
          </span>
          <span>{getStatusIcon(compatibility.notifications)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {language === 'hi' ? 'ऑफलाइन सपोर्ट' : 'Offline Support'}
          </span>
          <span>{getStatusIcon(compatibility.serviceWorker)}</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <span>🌐</span>
          <span className="font-medium text-sm">
            {language === 'hi' ? 'आपका ब्राउज़र' : 'Your Browser'}: {compatibility.browser}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getRecommendation()}
        </p>
      </div>
      
      {!compatibility.speechRecognition && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>
              {language === 'hi' ? '⚠️ वॉइस रिकॉग्निशन उपलब्ध नहीं है' : '⚠️ Voice Recognition Not Available'}
            </strong>
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            {language === 'hi' 
              ? 'वॉइस कमांड्स के लिए Chrome, Edge, या Safari का उपयोग करें।' 
              : 'Please use Chrome, Edge, or Safari for voice commands.'}
          </p>
        </div>
      )}
    </div>
  );
}