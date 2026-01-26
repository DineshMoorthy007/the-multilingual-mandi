# The Multilingual Mandi - Architecture Decision Record

## Technology Stack Decisions

### Frontend Framework: Next.js 14
**Decision**: Use Next.js with App Router
**Rationale**: 
- Server-side rendering for fast initial loads on slow networks
- Built-in optimization for images and fonts
- API routes for backend integration
- Excellent performance on low-end devices
- Progressive Web App capabilities

### Voice Processing: Web Speech API + Azure Cognitive Services
**Decision**: Hybrid approach using browser APIs with cloud fallback
**Rationale**:
- Web Speech API for basic recognition (offline capability)
- Azure Speech Services for complex multilingual processing
- Cost-effective for Indian language support
- Reliable accuracy for market terminology

### State Management: Zustand
**Decision**: Lightweight state management with Zustand
**Rationale**:
- Minimal bundle size impact
- Simple API suitable for voice-first interactions
- No complex setup required
- Excellent TypeScript support

### Styling: Tailwind CSS + Headless UI
**Decision**: Utility-first CSS with accessible components
**Rationale**:
- Rapid development of high-contrast, large-button interfaces
- Built-in accessibility features
- Excellent mobile-first responsive design
- Small production bundle with purging

### Database: Supabase (PostgreSQL)
**Decision**: Supabase for backend services
**Rationale**:
- Real-time price updates via WebSocket
- Built-in authentication for future features
- Edge functions for AI processing
- Cost-effective scaling

## System Architecture

### Folder Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx           # Main dashboard
│   └── api/               # API routes
│       ├── prices/        # Price data endpoints
│       ├── voice/         # Voice processing
│       └── negotiate/     # AI negotiation
├── components/
│   ├── ui/                # Reusable UI components
│   ├── voice/             # Voice interaction components
│   ├── price/             # Price display components
│   └── negotiation/       # Trade simulator components
├── lib/
│   ├── voice.ts           # Voice processing utilities
│   ├── prices.ts          # Price data management
│   ├── ai.ts              # AI negotiation logic
│   └── utils.ts           # Common utilities
├── hooks/                 # Custom React hooks
├── store/                 # Zustand store definitions
└── types/                 # TypeScript type definitions
```

### Data Flow Architecture

1. **Voice Input Layer**
   - Browser Web Speech API (primary)
   - Azure Speech-to-Text (fallback)
   - Language detection and processing

2. **Business Logic Layer**
   - Price aggregation from multiple sources
   - AI-powered negotiation simulation
   - Language translation services

3. **Data Layer**
   - Supabase for real-time price data
   - Redis for caching frequently accessed prices
   - Local storage for offline capabilities

## API Integration Strategy

### Price Data Sources
- Government e-NAM portal APIs
- Agricultural market committee data
- Third-party commodity price feeds
- Real-time WebSocket connections

### AI Services
- OpenAI GPT-4 for negotiation simulation
- Azure Translator for multilingual support
- Custom fine-tuned models for market terminology

## Performance Optimizations

### Bundle Optimization
- Dynamic imports for voice processing
- Code splitting by feature
- Image optimization with Next.js Image component
- Font optimization with next/font

### Network Optimization
- Service Worker for offline price caching
- Request deduplication
- Compression and minification
- CDN deployment via Vercel Edge Network

### Mobile Optimization
- Touch-friendly interface (minimum 44px targets)
- Reduced motion for accessibility
- Optimized for slow 4G networks
- Battery-efficient voice processing

## Security Considerations

### Data Privacy
- No personal data collection in V1
- Voice data processed locally when possible
- Encrypted API communications
- GDPR-compliant data handling

### API Security
- Rate limiting on voice processing endpoints
- Input validation and sanitization
- CORS configuration for web app
- API key rotation strategy

## Deployment Strategy

### Hosting: Vercel
**Decision**: Deploy on Vercel platform
**Rationale**:
- Excellent Next.js integration
- Global CDN for Indian users
- Automatic scaling
- Cost-effective for MVP

### Environment Configuration
- Development: Local with mock data
- Staging: Vercel preview deployments
- Production: Vercel with real API integrations

## Monitoring and Analytics

### Performance Monitoring
- Vercel Analytics for Core Web Vitals
- Custom metrics for voice processing latency
- Error tracking with Sentry
- User session recording (privacy-compliant)

### Business Metrics
- Voice query success rates
- Price inquiry patterns
- Negotiation simulator usage
- Language preference distribution