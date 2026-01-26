# The Multilingual Mandi 🌾

A voice-first web platform designed to empower India's unorganized wholesale trade sector by providing real-time price discovery and negotiation assistance in local languages.

![Multilingual Mandi](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Voice](https://img.shields.io/badge/Voice-Enabled-orange)

## 🎯 Overview

The Multilingual Mandi bridges the language and technology gap for wholesale traders across India. Built with accessibility and cultural familiarity in mind, it prioritizes voice interaction over complex navigation, making market information accessible to users with varying levels of tech literacy.

### Target User: "Ramesh"
- **Role**: Wholesale trader (vegetables, grains)
- **Tech Literacy**: Low (comfortable with WhatsApp, struggles with forms/English)
- **Device**: Low-end Android smartphone, 4G data
- **Primary Language**: Hindi/Regional languages
- **Key Needs**: Fast answers, voice interaction, visual cues over text

## ✨ Features

### 🎤 Voice-First Interface
- **Real-time Speech Recognition**: Web Speech API integration
- **Multilingual Support**: Hindi (हिंदी) and English
- **Text-to-Speech**: Audio responses in user's preferred language
- **Voice Commands**: Natural language price queries
- **Visual Feedback**: Pulsing animations and status indicators

### 📊 Real-Time Price Discovery
- **Live Commodity Prices**: Tomato, Onion, Potato, Wheat, Rice, Carrot
- **Visual Trend Indicators**: 📈 Up, 📉 Down, ➖ Stable
- **Indian Currency Format**: ₹1,23,456 formatting
- **Price Change Tracking**: Compare with previous day prices
- **Timestamp Display**: Minute-level precision updates

### 🌐 Multilingual Support
- **Language Toggle**: Seamless switching between Hindi and English
- **Cultural Design**: Earthy colors (green for trust, gold for prosperity)
- **Script Support**: Devanagari (देवनागरी) rendering
- **Localized Content**: All UI text translated appropriately

### 📱 Mobile-First Accessibility
- **Large Touch Targets**: Minimum 44px for finger-friendly navigation
- **High Contrast**: WCAG 2.1 AA compliant color ratios
- **Responsive Design**: 320px to 768px screen width support
- **Cultural Icons**: Familiar vegetable emojis and symbols

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with microphone access

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/multilingual-mandi.git
cd multilingual-mandi

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 🎮 Usage

### Voice Commands

#### Price Inquiries (Hindi)
- "टमाटर का भाव क्या है?" (What is the price of tomatoes?)
- "आज प्याज कितने में है?" (How much are onions today?)
- "आलू की कीमत बताओ" (Tell me the price of potatoes)

#### Price Inquiries (English)
- "What is the price of tomatoes?"
- "How much are onions today?"
- "Show me potato prices"

#### Navigation Commands
- "भाव दिखाओ" / "Show prices"
- "बातचीत करना है" / "I want to negotiate"

### Interface Navigation

1. **Language Toggle**: Click the language button in the top-right corner
2. **Voice Input**: Click the large microphone button to start voice recognition
3. **Price Cards**: View real-time commodity prices with trend indicators
4. **Action Cards**: Access price checking and negotiation features

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Custom CSS with utility classes
- **Voice Processing**: Web Speech API + Speech Synthesis API
- **State Management**: React hooks (useState, useEffect)
- **API**: Next.js API routes with mock data
- **Fonts**: Inter + Noto Sans Devanagari for multilingual support

### Project Structure
```
src/
├── app/
│   ├── api/prices/         # Price data API endpoints
│   ├── globals.css         # Global styles and utilities
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main application page
├── components/             # Reusable UI components (future)
├── lib/                    # Utility functions (future)
└── types/                  # TypeScript type definitions (future)
```

### Key Components

#### Voice Recognition System
- **Browser Compatibility**: Supports Chrome, Edge, Safari
- **Language Detection**: Automatic Hindi/English detection
- **Error Handling**: Graceful fallbacks for unsupported browsers
- **Audio Feedback**: Visual and audio response indicators

#### Price Data Management
- **Mock API**: Simulated real-time price updates
- **Data Validation**: Price range checking and trend calculation
- **Caching Strategy**: Browser-based price caching (future)
- **Update Frequency**: Real-time price refresh capability

## 🎨 Design System

### Color Palette
- **Mandi Green**: `#15803d` (Primary brand, trust)
- **Harvest Gold**: `#ca8a04` (Secondary, prosperity)
- **Success Green**: `#22c55e` (Price increases, positive actions)
- **Warning Red**: `#dc2626` (Price decreases, alerts)
- **Neutral Gray**: `#6b7280` (Secondary text, borders)

### Typography
- **Primary Font**: Inter (Latin characters)
- **Secondary Font**: Noto Sans Devanagari (Hindi script)
- **Base Font Size**: 18px (enhanced readability)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Accessibility Features
- **Touch Targets**: Minimum 44px × 44px
- **Contrast Ratios**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: 2px green outline on interactive elements
- **Screen Reader**: Semantic HTML structure
- **Reduced Motion**: Respects user motion preferences

## 🔧 Configuration

### Environment Variables
```env
# Future API integrations
NEXT_PUBLIC_PRICE_API_URL=your_price_api_url
NEXT_PUBLIC_VOICE_API_KEY=your_voice_api_key
```

### Browser Permissions
The application requires microphone access for voice recognition:
- Chrome: Automatic permission request
- Firefox: Manual permission grant required
- Safari: iOS 14.5+ required for speech recognition

## 🧪 Testing

### Manual Testing Checklist
- [ ] Voice recognition works in Hindi and English
- [ ] Language toggle switches interface language
- [ ] Price cards display with correct formatting
- [ ] Responsive design works on mobile devices
- [ ] Accessibility features function properly
- [ ] Voice commands trigger appropriate responses

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Edge 80+
- ✅ Safari 14.5+
- ⚠️ Firefox (limited speech recognition support)

## 🚧 Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] Voice-first interface
- [x] Multilingual support (Hindi/English)
- [x] Real-time price display
- [x] Mobile-responsive design
- [x] Accessibility compliance

### Phase 2: Enhanced Features (🔄 In Progress)
- [ ] AI-powered negotiation simulator
- [ ] WhatsApp message generation
- [ ] Advanced voice commands
- [ ] Price alerts and notifications
- [ ] Offline functionality

### Phase 3: Advanced Integration (📋 Planned)
- [ ] Real API integrations (e-NAM, market committees)
- [ ] User authentication and profiles
- [ ] Historical price data and trends
- [ ] Multi-commodity comparison
- [ ] Regional market selection

### Phase 4: Scale & Optimize (🔮 Future)
- [ ] Additional Indian languages (Tamil, Telugu, Kannada)
- [ ] Advanced AI features
- [ ] Mobile app development
- [ ] Farmer-to-trader direct connection
- [ ] Payment integration

## 🤝 Contributing

We welcome contributions from developers, designers, and domain experts!

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Test voice features across different browsers
- Ensure accessibility compliance
- Update documentation for new features
- Consider cultural sensitivity in design changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Target Users**: Wholesale traders across India who inspired this solution
- **Cultural Consultants**: For ensuring appropriate design and language choices
- **Accessibility Experts**: For guidance on inclusive design principles
- **Open Source Community**: For the amazing tools and libraries that made this possible

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas

### Contact
- **Project Maintainer**: [Your Name](mailto:your.email@example.com)
- **Project Repository**: [GitHub Link](https://github.com/your-username/multilingual-mandi)

---

**Built with ❤️ for India's wholesale trading community**

*"Empowering traders through technology, one voice command at a time"*