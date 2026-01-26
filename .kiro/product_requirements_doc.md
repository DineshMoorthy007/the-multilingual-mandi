# The Multilingual Mandi - Product Requirements Document

## Executive Summary
The Multilingual Mandi is a voice-first web platform designed to empower India's unorganized wholesale trade sector by providing real-time price discovery and negotiation assistance in local languages.

## Problem Statement
- Small farmers and vendors lose money due to lack of real-time market information
- Language barriers prevent effective negotiation in wholesale markets
- Middlemen exploitation due to information asymmetry
- Complex interfaces exclude low-literacy users from digital solutions

## Target User Persona: "Ramesh"
- **Role**: Tomato wholesaler
- **Tech Literacy**: Low (WhatsApp, YouTube comfortable; struggles with forms/English)
- **Device**: Low-end Android smartphone, 4G data
- **Primary Language**: Hindi/Regional languages
- **Key Needs**: Fast answers, voice interaction, visual cues over text

## Core Features

### 1. The Linguistic Bridge (Voice-First Interface)
**User Story**: As Ramesh, I want to ask "What is the price of tomatoes in Chennai?" in Hindi and get an immediate voice response in Hindi.

**Acceptance Criteria**:
- Microphone input prioritized over keyboard
- Automatic language detection (Hindi, Tamil, Kannada, Telugu, Bengali)
- Text-to-speech responses in detected language
- Fallback to translated text display
- Voice commands work in noisy market environments

### 2. Fair Price Discovery Dashboard
**User Story**: As Ramesh, I want to quickly see today's tomato prices with visual indicators so I can make informed decisions.

**Acceptance Criteria**:
- Display "Day's High", "Day's Low", "Average" prices
- Green up arrows for price increases, red down arrows for decreases
- Large, finger-friendly price cards
- Commodity icons (tomato looks like tomato)
- Prices in Indian Rupee (₹) format only

### 3. The "Sauda" (Trade) Simulator
**User Story**: As Ramesh, I want to practice negotiating with an AI buyer so I can improve my bargaining skills and draft messages for real buyers.

**Acceptance Criteria**:
- Voice-based negotiation with AI agent
- AI responds in user's language
- Generates WhatsApp-ready messages
- Provides negotiation tips and market insights
- Saves successful negotiation templates

## User Flow - Happy Path

1. **Entry**: User opens app, greeted with large microphone button
2. **Voice Query**: User speaks "Aaj tamatar ka bhav kya hai Mumbai mein?"
3. **Processing**: App detects Hindi, processes query
4. **Response**: Shows price card with visual indicators + voice response
5. **Action**: User can tap "Practice Negotiation" for simulator
6. **Simulation**: Voice conversation with AI buyer
7. **Output**: Generated WhatsApp message ready to send

## Technical Constraints

### Performance Requirements
- Page load time < 3 seconds on 4G
- Voice recognition response < 2 seconds
- Offline capability for cached prices
- Data usage < 10MB per session

### Accessibility Requirements
- Minimum touch target: 44px x 44px
- High contrast ratios (4.5:1 minimum)
- Screen reader compatibility
- Voice-over support for all interactive elements

### Language Support
- Primary: Hindi, Tamil, Kannada, Telugu, Bengali
- Text display with regional script support
- Voice synthesis quality optimized for Indian accents

## Success Metrics
- Voice query success rate > 90%
- User session duration > 5 minutes
- Price inquiry to negotiation conversion > 30%
- User retention rate > 60% after 7 days

## Out of Scope (V1)
- Direct transaction processing
- User registration/authentication
- Advanced analytics/reporting
- Multi-commodity comparison tools