'use client';

import React from 'react';
import { EnhancedVoiceService } from '@/lib/voiceService';
import { TRANSLATIONS } from '@/lib/constants';

interface VoiceInterfaceProps {
  language: string;
  onVoiceResult: (result: any) => void;
  onError: (error: string) => void;
}

export function VoiceInterface({ language, onVoiceResult, onError }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [voiceService] = React.useState(() => new EnhancedVoiceService());
  const [isSupported, setIsSupported] = React.useState(true);
  const [permissionStatus, setPermissionStatus] = React.useState<'granted' | 'denied' | 'prompt'>('prompt');

  React.useEffect(() => {
    voiceService.setLanguage(language);
    setIsSupported(voiceService.isSpeechRecognitionSupported());
    
    // Check microphone permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setPermissionStatus(result.state);
          result.onchange = () => setPermissionStatus(result.state);
        })
        .catch(() => setPermissionStatus('prompt'));
    }
  }, [language, voiceService]);

  const startListening = async () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }
    
    setIsListening(true);
    setTranscript('');
    
    try {
      const result = await voiceService.startListening();
      setTranscript(result);
      
      // Process the voice command
      const commandResult = voiceService.processVoiceCommand(result);
      
      // Speak the response
      if (commandResult.response) {
        await voiceService.speak(commandResult.response, language);
      }
      
      onVoiceResult(commandResult);
    } catch (error) {
      console.error('Voice error:', error);
      onError(error as string);
    } finally {
      setIsListening(false);
    }
  };

  const getStatusText = () => {
    if (!isSupported) {
      return language === 'hi' ? 'वॉइस सपोर्ट उपलब्ध नहीं है' : 'Voice not supported';
    }
    
    if (permissionStatus === 'denied') {
      return language === 'hi' ? 'माइक्रोफोन की अनुमति दें' : 'Allow microphone access';
    }
    
    if (isListening) {
      return TRANSLATIONS.listening[language as keyof typeof TRANSLATIONS.listening] || 'Listening...';
    }
    
    return TRANSLATIONS.tapToSpeak[language as keyof typeof TRANSLATIONS.tapToSpeak] || 'Tap to speak';
  };

  const getButtonColor = () => {
    if (!isSupported || permissionStatus === 'denied') {
      return 'bg-gray-400 cursor-not-allowed';
    }
    
    if (isListening) {
      return 'bg-red-500 animate-pulse scale-110 shadow-lg shadow-red-500/50';
    }
    
    return 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg shadow-green-500/30';
  };

  const getMicrophoneIcon = () => {
    if (!isSupported) return '🚫';
    if (permissionStatus === 'denied') return '🔒';
    if (isListening) return '🔴';
    return '🎤';
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* Main Voice Button */}
      <div className="relative">
        <button
          onClick={startListening}
          disabled={!isSupported || permissionStatus === 'denied'}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 ${getButtonColor()}`}
        >
          {getMicrophoneIcon()}
        </button>
        
        {/* Pulse animation rings */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-red-500 opacity-30 animate-ping animation-delay-200"></div>
          </>
        )}
      </div>
      
      {/* Status Text */}
      <div className="text-center max-w-sm">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {getStatusText()}
        </p>
        
        {/* Browser compatibility info */}
        {!isSupported && (
          <p className="text-sm text-red-600 mt-2">
            {language === 'hi' 
              ? 'कृपया Chrome, Edge, या Safari का उपयोग करें' 
              : 'Please use Chrome, Edge, or Safari browser'}
          </p>
        )}
        
        {/* Permission info */}
        {permissionStatus === 'denied' && (
          <p className="text-sm text-orange-600 mt-2">
            {language === 'hi' 
              ? 'ब्राउज़र सेटिंग्स में माइक्रोफोन की अनुमति दें' 
              : 'Enable microphone access in browser settings'}
          </p>
        )}
      </div>
      
      {/* Transcript Display */}
      {transcript && (
        <div className="w-full max-w-sm p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-l-4 border-green-500 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">
            {language === 'hi' ? 'आपने कहा:' : 
             language === 'ta' ? 'நீங்கள் சொன்னது:' :
             language === 'te' ? 'మీరు చెప్పినది:' :
             language === 'kn' ? 'ನೀವು ಹೇಳಿದ್ದು:' : 'You said:'}
          </p>
          <p className="font-medium text-gray-800 dark:text-gray-200">{transcript}</p>
        </div>
      )}
      
      {/* Voice Commands Help */}
      <div className="w-full max-w-sm text-center">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            {language === 'hi' ? 'कमांड उदाहरण देखें ▼' :
             language === 'ta' ? 'கட்டளை உதாரணங்களைப் பார்க்கவும் ▼' :
             language === 'te' ? 'కమాండ్ ఉదాహరణలను చూడండి ▼' :
             language === 'kn' ? 'ಆಜ್ಞೆ ಉದಾಹರಣೆಗಳನ್ನು ನೋಡಿ ▼' : 'View command examples ▼'}
          </summary>
          
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">💬</span>
              <span className="text-gray-700 dark:text-gray-300 text-left">
                "{language === 'hi' ? 'टमाटर का भाव क्या है?' : 
                   language === 'ta' ? 'தக்காளியின் விலை என்ன?' :
                   language === 'te' ? 'టమాటో ధర ఎంత?' :
                   language === 'kn' ? 'ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?' : 'What is tomato price?'}"
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📊</span>
              <span className="text-gray-700 dark:text-gray-300 text-left">
                "{language === 'hi' ? 'भाव दिखाओ' : 
                   language === 'ta' ? 'விலைகளைக் காட்டு' :
                   language === 'te' ? 'ధరలను చూపించు' :
                   language === 'kn' ? 'ಬೆಲೆಗಳನ್ನು ತೋರಿಸು' : 'Show prices'}"
              </span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}