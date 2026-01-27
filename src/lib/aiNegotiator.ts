import { NegotiationSession, NegotiationMessage } from './types';

export class AIBargainBot {
  private sessions: Map<string, NegotiationSession> = new Map();
  private currentLanguage = 'hi';

  setLanguage(language: string) {
    this.currentLanguage = language;
  }

  startNegotiation(commodity: string, marketPrice: number): NegotiationSession {
    const sessionId = Date.now().toString();
    const session: NegotiationSession = {
      id: sessionId,
      commodity,
      marketPrice,
      messages: [],
      status: 'active',
      startTime: new Date()
    };

    // AI opens with initial offer
    const openingMessage = this.generateOpeningMessage(commodity, marketPrice);
    session.messages.push({
      id: Date.now().toString(),
      sender: 'ai',
      message: openingMessage.text,
      timestamp: new Date(),
      price: openingMessage.price,
      type: 'offer'
    });

    this.sessions.set(sessionId, session);
    return session;
  }

  processUserMessage(sessionId: string, userMessage: string, userPrice?: number): NegotiationMessage {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add user message to session
    const userMsg: NegotiationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: userMessage,
      timestamp: new Date(),
      price: userPrice,
      type: userPrice ? 'offer' : 'chat'
    };
    session.messages.push(userMsg);

    // Generate AI response
    const aiResponse = this.generateAIResponse(session, userMessage, userPrice);
    session.messages.push(aiResponse);

    // Update session
    this.sessions.set(sessionId, session);

    return aiResponse;
  }

  private generateOpeningMessage(commodity: string, marketPrice: number): { text: string; price: number } {
    const aiPrice = Math.round(marketPrice * 0.85); // AI starts 15% below market
    
    const messages = {
      hi: `नमस्ते! मुझे ${commodity} चाहिए। मार्केट रेट ₹${marketPrice} है, लेकिन मैं ₹${aiPrice} दे सकता हूं।`,
      en: `Hello! I need ${commodity}. Market rate is ₹${marketPrice}, but I can pay ₹${aiPrice}.`,
      ta: `வணக்கம்! எனக்கு ${commodity} வேண்டும். சந்தை விலை ₹${marketPrice}, ஆனால் நான் ₹${aiPrice} கொடுக்க முடியும்.`,
      te: `నమస్కారం! నాకు ${commodity} కావాలి. మార్కెట్ రేట్ ₹${marketPrice}, కానీ నేను ₹${aiPrice} ఇవ్వగలను.`,
      kn: `ನಮಸ್ಕಾರ! ನನಗೆ ${commodity} ಬೇಕು. ಮಾರುಕಟ್ಟೆ ದರ ₹${marketPrice}, ಆದರೆ ನಾನು ₹${aiPrice} ಕೊಡಬಹುದು.`
    };

    return {
      text: messages[this.currentLanguage as keyof typeof messages] || messages.hi,
      price: aiPrice
    };
  }

  private generateAIResponse(session: NegotiationSession, userMessage: string, userPrice?: number): NegotiationMessage {
    const lastAIPrice = this.getLastAIPrice(session);
    const marketPrice = session.marketPrice;
    
    let responseText = '';
    let newPrice = lastAIPrice;
    let messageType: 'offer' | 'counter' | 'accept' | 'reject' | 'chat' = 'chat';

    if (userPrice) {
      if (userPrice <= marketPrice * 0.95) {
        // User price is reasonable, AI accepts or counters
        if (userPrice >= lastAIPrice * 1.05) {
          // Accept the deal
          responseText = this.getAcceptanceMessage(userPrice);
          messageType = 'accept';
          session.status = 'completed';
          session.endTime = new Date();
        } else {
          // Counter offer
          newPrice = Math.round((userPrice + lastAIPrice) / 2);
          responseText = this.getCounterOfferMessage(newPrice);
          messageType = 'counter';
        }
      } else {
        // User price is too high
        newPrice = Math.round(lastAIPrice * 1.1);
        responseText = this.getHighPriceResponse(newPrice, marketPrice);
        messageType = 'counter';
      }
    } else {
      // General chat response
      responseText = this.getChatResponse(userMessage);
    }

    return {
      id: Date.now().toString(),
      sender: 'ai',
      message: responseText,
      timestamp: new Date(),
      price: (messageType === 'counter' || newPrice !== lastAIPrice) ? newPrice : undefined,
      type: messageType
    };
  }

  private getLastAIPrice(session: NegotiationSession): number {
    const aiMessages = session.messages.filter(m => m.sender === 'ai' && m.price);
    return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].price! : session.marketPrice * 0.85;
  }

  private getAcceptanceMessage(price: number): string {
    const messages = {
      hi: `ठीक है! ₹${price} में डील फाइनल। धन्यवाद!`,
      en: `Alright! Deal finalized at ₹${price}. Thank you!`,
      ta: `சரி! ₹${price} க்கு ஒப்பந்தம் முடிந்தது. நன்றி!`,
      te: `సరే! ₹${price} కు డీల్ ఫైనల్. ధన్యవాదాలు!`,
      kn: `ಸರಿ! ₹${price} ಗೆ ಒಪ್ಪಂದ ಮುಗಿದಿದೆ. ಧನ್ಯವಾದಗಳು!`
    };
    return messages[this.currentLanguage as keyof typeof messages] || messages.hi;
  }

  private getCounterOfferMessage(price: number): string {
    const messages = {
      hi: `₹${price} कैसा रहेगा? यह अच्छा रेट है।`,
      en: `How about ₹${price}? This is a good rate.`,
      ta: `₹${price} எப்படி? இது நல்ல விலை.`,
      te: `₹${price} ఎలా ఉంటుంది? ఇది మంచి రేట్.`,
      kn: `₹${price} ಹೇಗೆ? ಇದು ಒಳ್ಳೆಯ ದರ.`
    };
    return messages[this.currentLanguage as keyof typeof messages] || messages.hi;
  }

  private getHighPriceResponse(newPrice: number, marketPrice: number): string {
    const messages = {
      hi: `यह तो बहुत ज्यादा है! मार्केट रेट ₹${marketPrice} है। मैं ₹${newPrice} से ज्यादा नहीं दे सकता।`,
      en: `That's too much! Market rate is ₹${marketPrice}. I can't pay more than ₹${newPrice}.`,
      ta: `அது அதிகம்! சந்தை விலை ₹${marketPrice}. நான் ₹${newPrice} க்கு மேல் கொடுக்க முடியாது.`,
      te: `అది చాలా ఎక్కువ! మార్కెట్ రేట్ ₹${marketPrice}. నేను ₹${newPrice} కంటే ఎక్కువ ఇవ్వలేను.`,
      kn: `ಅದು ತುಂಬಾ ಹೆಚ್ಚು! ಮಾರುಕಟ್ಟೆ ದರ ₹${marketPrice}. ನಾನು ₹${newPrice} ಕ್ಕಿಂತ ಹೆಚ್ಚು ಕೊಡಲಾರೆ.`
    };
    return messages[this.currentLanguage as keyof typeof messages] || messages.hi;
  }

  private getChatResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('quality') || lowerMessage.includes('गुणवत्ता') || lowerMessage.includes('தரம்')) {
      const messages = {
        hi: 'गुणवत्ता बहुत अच्छी है। फ्रेश माल है।',
        en: 'Quality is very good. Fresh stock.',
        ta: 'தரம் மிகவும் நல்லது. புதிய பொருள்.',
        te: 'నాణ్యత చాలా బాగుంది. తాజా స్టాక్.',
        kn: 'ಗುಣಮಟ್ಟ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ. ತಾಜಾ ಸ್ಟಾಕ್.'
      };
      return messages[this.currentLanguage as keyof typeof messages] || messages.hi;
    }

    const generalResponses = {
      hi: 'हां, बताइए। क्या रेट लगेगा?',
      en: 'Yes, tell me. What rate will you give?',
      ta: 'ஆம், சொல்லுங்கள். என்ன விலை கொடுப்பீர்கள்?',
      te: 'అవును, చెప్పండి. ఎంత రేట్ ఇస్తారు?',
      kn: 'ಹೌದು, ಹೇಳಿ. ಎಷ್ಟು ದರ ಕೊಡುತ್ತೀರಿ?'
    };
    return generalResponses[this.currentLanguage as keyof typeof generalResponses] || generalResponses.hi;
  }

  generateWhatsAppMessage(session: NegotiationSession): string {
    const finalPrice = this.getLastAIPrice(session);
    const commodity = session.commodity;
    
    const templates = {
      hi: `🛒 *मंडी डील*\n\n📦 वस्तु: ${commodity}\n💰 फाइनल रेट: ₹${finalPrice}\n📅 दिनांक: ${new Date().toLocaleDateString('hi-IN')}\n\n✅ डील कन्फर्म करने के लिए रिप्लाई करें।\n\n_मल्टीलिंगुअल मंडी ऐप से भेजा गया_`,
      en: `🛒 *Mandi Deal*\n\n📦 Item: ${commodity}\n💰 Final Rate: ₹${finalPrice}\n📅 Date: ${new Date().toLocaleDateString('en-IN')}\n\n✅ Reply to confirm the deal.\n\n_Sent from Multilingual Mandi App_`,
      ta: `🛒 *மண்டி ஒப்பந்தம்*\n\n📦 பொருள்: ${commodity}\n💰 இறுதி விலை: ₹${finalPrice}\n📅 தேதி: ${new Date().toLocaleDateString('ta-IN')}\n\n✅ ஒப்பந்தத்தை உறுதிப்படுத்த பதிலளிக்கவும்.\n\n_பன்மொழி மண்டி ஆப்பிலிருந்து அனுப்பப்பட்டது_`,
      te: `🛒 *మండి ఒప్పందం*\n\n📦 వస్తువు: ${commodity}\n💰 చివరి రేటు: ₹${finalPrice}\n📅 తేదీ: ${new Date().toLocaleDateString('te-IN')}\n\n✅ ఒప్పందాన్ని నిర్ధారించడానికి రిప్లై చేయండి.\n\n_మల్టీలింగ్వల్ మండి యాప్ నుండి పంపబడింది_`,
      kn: `🛒 *ಮಂಡಿ ಒಪ್ಪಂದ*\n\n📦 ವಸ್ತು: ${commodity}\n💰 ಅಂತಿಮ ದರ: ₹${finalPrice}\n📅 ದಿನಾಂಕ: ${new Date().toLocaleDateString('kn-IN')}\n\n✅ ಒಪ್ಪಂದವನ್ನು ದೃಢೀಕರಿಸಲು ಉತ್ತರಿಸಿ.\n\n_ಬಹುಭಾಷಾ ಮಂಡಿ ಆ್ಯಪ್‌ನಿಂದ ಕಳುಹಿಸಲಾಗಿದೆ_`
    };

    return templates[this.currentLanguage as keyof typeof templates] || templates.hi;
  }

  getSession(sessionId: string): NegotiationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): NegotiationSession[] {
    return Array.from(this.sessions.values());
  }
}