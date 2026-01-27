'use client';

import React from 'react';
import { AIBargainBot } from '@/lib/aiNegotiator';
import { NegotiationSession, NegotiationMessage } from '@/lib/types';
import { EnhancedVoiceService } from '@/lib/voiceService';

interface NegotiationChatProps {
  commodity: string;
  marketPrice: number;
  language: string;
  onClose: () => void;
  onWhatsAppGenerate: (message: string) => void;
}

export function NegotiationChat({ 
  commodity, 
  marketPrice, 
  language, 
  onClose, 
  onWhatsAppGenerate 
}: NegotiationChatProps) {
  const [session, setSession] = React.useState<NegotiationSession | null>(null);
  const [userInput, setUserInput] = React.useState('');
  const [userPrice, setUserPrice] = React.useState<number | undefined>();
  const [isVoiceMode, setIsVoiceMode] = React.useState(false);
  const [aiBot] = React.useState(() => new AIBargainBot());
  const [voiceService] = React.useState(() => new EnhancedVoiceService());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    aiBot.setLanguage(language);
    voiceService.setLanguage(language);
    
    // Start negotiation
    const newSession = aiBot.startNegotiation(commodity, marketPrice);
    setSession(newSession);
    
    // Speak the opening message
    const openingMessage = newSession.messages[0];
    if (openingMessage) {
      voiceService.speak(openingMessage.message, language);
    }
  }, [commodity, marketPrice, language, aiBot, voiceService]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const sendMessage = async () => {
    if (!session || (!userInput.trim() && !userPrice)) return;

    try {
      const aiResponse = aiBot.processUserMessage(
        session.id, 
        userInput || `₹${userPrice}`, 
        userPrice
      );
      
      // Update session
      const updatedSession = aiBot.getSession(session.id);
      if (updatedSession) {
        setSession(updatedSession);
        
        // Speak AI response
        await voiceService.speak(aiResponse.message, language);
      }
      
      // Clear inputs
      setUserInput('');
      setUserPrice(undefined);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleVoiceInput = async () => {
    setIsVoiceMode(true);
    try {
      const transcript = await voiceService.startListening();
      setUserInput(transcript);
      
      // Try to extract price from transcript
      const priceMatch = transcript.match(/₹?(\d+)/);
      if (priceMatch) {
        setUserPrice(Number(priceMatch[1]));
      }
    } catch (error) {
      console.error('Voice input error:', error);
    } finally {
      setIsVoiceMode(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!session) return;
    
    const whatsappMessage = aiBot.generateWhatsAppMessage(session);
    onWhatsAppGenerate(whatsappMessage);
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'offer': return '💰';
      case 'counter': return '🔄';
      case 'accept': return '✅';
      case 'reject': return '❌';
      default: return '💬';
    }
  };

  const getStatusText = () => {
    const texts = {
      hi: {
        active: 'बातचीत जारी है',
        completed: 'डील पूरी हुई',
        cancelled: 'बातचीत रद्द'
      },
      en: {
        active: 'Negotiation in progress',
        completed: 'Deal completed',
        cancelled: 'Negotiation cancelled'
      },
      ta: {
        active: 'பேச்சுவார்த்தை நடந்து கொண்டிருக்கிறது',
        completed: 'ஒப்பந்தம் முடிந்தது',
        cancelled: 'பேச்சுவார்த்தை ரத்து'
      },
      te: {
        active: 'చర్చలు కొనసాగుతున్నాయి',
        completed: 'ఒప్పందం పూర్తయింది',
        cancelled: 'చర్చలు రద్దు'
      },
      kn: {
        active: 'ಚರ್ಚೆ ನಡೆಯುತ್ತಿದೆ',
        completed: 'ಒಪ್ಪಂದ ಪೂರ್ಣಗೊಂಡಿದೆ',
        cancelled: 'ಚರ್ಚೆ ರದ್ದು'
      }
    };
    
    const langTexts = texts[language as keyof typeof texts] || texts.en;
    return langTexts[session?.status || 'active'];
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold">
            {language === 'hi' ? 'AI के साथ भाव-ताव' :
             language === 'ta' ? 'AI உடன் பேரம்' :
             language === 'te' ? 'AI తో చర్చలు' :
             language === 'kn' ? 'AI ಜೊತೆ ಚರ್ಚೆ' : 'AI Negotiation'}
          </h3>
          <p className="text-sm text-gray-600">
            {commodity} - ₹{marketPrice} ({getStatusText()})
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {session.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span>{getMessageTypeIcon(message.type)}</span>
                <span className="text-xs opacity-75">
                  {message.sender === 'user' ? 
                    (language === 'hi' ? 'आप' : 
                     language === 'ta' ? 'நீங்கள்' :
                     language === 'te' ? 'మీరు' :
                     language === 'kn' ? 'ನೀವು' : 'You') : 'AI'}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
              {message.price && (
                <p className="text-xs mt-1 font-semibold">₹{message.price}</p>
              )}
              <p className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {session.status === 'active' && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={
                language === 'hi' ? 'अपना संदेश लिखें...' :
                language === 'ta' ? 'உங்கள் செய்தியை எழுதுங்கள்...' :
                language === 'te' ? 'మీ సందేశాన్ని రాయండి...' :
                language === 'kn' ? 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ...' : 'Type your message...'
              }
              className="flex-1 px-3 py-2 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={handleVoiceInput}
              disabled={isVoiceMode}
              className={`px-3 py-2 rounded-lg ${
                isVoiceMode ? 'bg-green-500 animate-pulse' : 'bg-yellow-600 hover:bg-yellow-700'
              } text-white`}
            >
              🎤
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={userPrice || ''}
              onChange={(e) => setUserPrice(Number(e.target.value) || undefined)}
              placeholder={
                language === 'hi' ? 'आपका रेट (₹)' :
                language === 'ta' ? 'உங்கள் விலை (₹)' :
                language === 'te' ? 'మీ రేటు (₹)' :
                language === 'kn' ? 'ನಿಮ್ಮ ದರ (₹)' : 'Your rate (₹)'
              }
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              {language === 'hi' ? 'भेजें' :
               language === 'ta' ? 'அனுப்பு' :
               language === 'te' ? 'పంపు' :
               language === 'kn' ? 'ಕಳುಹಿಸಿ' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Generation */}
      {session.status === 'completed' && (
        <div className="p-4 border-t border-gray-200 bg-green-50">
          <p className="text-sm text-green-700 mb-2">
            {language === 'hi' ? '🎉 डील सफल! WhatsApp मैसेज तैयार करें:' :
             language === 'ta' ? '🎉 ஒப்பந்தம் வெற்றி! WhatsApp செய்தி தயார் செய்யுங்கள்:' :
             language === 'te' ? '🎉 ఒప్పందం విజయవంతం! WhatsApp సందేశం సిద్ధం చేయండి:' :
             language === 'kn' ? '🎉 ಒಪ್ಪಂದ ಯಶಸ್ವಿ! WhatsApp ಸಂದೇಶ ತಯಾರಿಸಿ:' : '🎉 Deal successful! Generate WhatsApp message:'}
          </p>
          <button
            onClick={generateWhatsAppMessage}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <span>📱</span>
            <span>
              {language === 'hi' ? 'WhatsApp मैसेज बनाएं' :
               language === 'ta' ? 'WhatsApp செய்தி உருவாக்கு' :
               language === 'te' ? 'WhatsApp సందేశం సృష్టించు' :
               language === 'kn' ? 'WhatsApp ಸಂದೇಶ ರಚಿಸಿ' : 'Generate WhatsApp Message'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}