# The Multilingual Mandi - UI/UX Guidelines

## Design Philosophy
Design for "Ramesh" - prioritize clarity, accessibility, and cultural familiarity over modern aesthetics.

## Color Palette

### Primary Colors (Earthy & Trustworthy)
- **Mandi Green**: #2D5016 (Primary brand color, represents fresh produce)
- **Harvest Gold**: #DAA520 (Secondary, represents prosperity)
- **Earth Brown**: #8B4513 (Tertiary, represents soil/agriculture)

### Functional Colors
- **Success Green**: #22C55E (Price increases, positive actions)
- **Warning Red**: #EF4444 (Price decreases, alerts)
- **Neutral Gray**: #6B7280 (Secondary text, borders)
- **Background**: #FEFEFE (Clean, high contrast)

### Accessibility Colors
- All color combinations meet WCAG AA standards (4.5:1 contrast ratio)
- Color-blind friendly palette tested with Coblis simulator
- Never rely on color alone to convey information

## Typography

### Font Stack
```css
font-family: 'Inter', 'Noto Sans Devanagari', 'Noto Sans Tamil', system-ui, sans-serif;
```

### Font Sizes (Mobile-First)
- **Hero Text**: 2.5rem (40px) - Price displays, main CTAs
- **Large Text**: 1.5rem (24px) - Section headers, important info
- **Body Text**: 1.125rem (18px) - Regular content, readable on small screens
- **Small Text**: 1rem (16px) - Minimum size, labels and metadata

### Font Weights
- **Bold (700)**: Prices, CTAs, important information
- **Medium (500)**: Section headers, navigation
- **Regular (400)**: Body text, descriptions

### Multilingual Typography Rules
- Devanagari script: Increase line-height to 1.6 for readability
- Tamil script: Ensure proper rendering of complex characters
- All text must be left-aligned (RTL support not required for V1)
- Minimum font size: 16px (prevents iOS zoom on input focus)

## Layout & Spacing

### Grid System
- Mobile-first design with 16px base spacing unit
- Maximum content width: 768px (tablet-friendly)
- Minimum touch target: 44px x 44px (Apple HIG standard)
- Spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### Component Spacing
- Card padding: 24px
- Button padding: 16px vertical, 24px horizontal
- Input field padding: 16px
- Section margins: 32px vertical

## Interactive Elements

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: #2D5016;
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  min-height: 44px;
  box-shadow: 0 2px 4px rgba(45, 80, 22, 0.2);
}

/* Voice Button (Special) */
.btn-voice {
  background: #DAA520;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Input Fields
- Large, clear labels above inputs
- Placeholder text in user's language
- Error states with clear messaging
- Voice input icon always visible

### Cards & Containers
```css
.price-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
```

## Iconography

### Icon Style
- Filled icons preferred over outlined
- Minimum size: 24px x 24px
- Cultural relevance: Use familiar symbols
- Consistent stroke width: 2px for outlined icons

### Custom Icons Needed
- Microphone (voice input)
- Tomato, Onion, Potato (commodity representations)
- Rupee symbol (₹)
- Up/Down arrows for price changes
- WhatsApp logo (for sharing)

### Icon-Text Relationships
- Icons always paired with text labels
- Icon above text for primary actions
- Icon left of text for secondary actions
- Consistent 8px spacing between icon and text

## Voice Interface Design

### Visual Feedback for Voice States
- **Listening**: Pulsing microphone with green ring
- **Processing**: Spinner with "समझ रहे हैं..." (Understanding...)
- **Speaking**: Sound wave animation
- **Error**: Red microphone with shake animation

### Voice Response Display
```css
.voice-response {
  background: #F3F4F6;
  border-left: 4px solid #2D5016;
  padding: 16px;
  border-radius: 8px;
  font-size: 18px;
  line-height: 1.5;
}
```

## Responsive Design Rules

### Breakpoints
- Mobile: 320px - 768px (primary focus)
- Tablet: 768px - 1024px (secondary)
- Desktop: 1024px+ (minimal support)

### Mobile-Specific Guidelines
- Single column layout only
- Thumb-friendly navigation at bottom
- Swipe gestures for secondary actions
- Avoid hover states entirely
- Large tap targets (minimum 44px)

## Accessibility Guidelines

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for all interactive elements
- Skip navigation links
- Focus management for voice interactions

### Motor Accessibility
- Large touch targets (44px minimum)
- Generous spacing between interactive elements
- No time-based interactions
- Alternative input methods (voice + touch)

### Cognitive Accessibility
- Simple, consistent navigation
- Clear visual hierarchy
- Familiar icons and symbols
- Error prevention and clear error messages
- Progress indicators for multi-step processes

## Cultural Considerations

### Visual Elements
- Use familiar market imagery (vegetables, scales, currency)
- Avoid Western-centric design patterns
- Include cultural color associations (green = fresh, gold = prosperity)
- Respect religious and cultural sensitivities

### Language Display
- Script-appropriate line heights and spacing
- Proper numeral display (Devanagari numerals option)
- Currency always in Indian Rupee format: ₹1,23,456
- Date format: DD/MM/YYYY

## Animation & Micro-interactions

### Performance-First Animations
- CSS transforms only (avoid layout thrashing)
- Maximum duration: 300ms
- Respect prefers-reduced-motion
- Battery-efficient animations

### Voice Interaction Animations
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.listening {
  animation: pulse 1.5s ease-in-out infinite;
}
```

## Error States & Empty States

### Error Messages
- Always in user's preferred language
- Clear, actionable instructions
- Friendly tone, avoid technical jargon
- Visual icons to support text

### Empty States
- Encouraging illustrations
- Clear next steps
- Voice prompts for guidance
- Cultural context in imagery

## Testing Guidelines

### Usability Testing
- Test with actual low-literacy users
- Noisy environment testing for voice features
- One-handed usage scenarios
- Slow network condition testing

### Accessibility Testing
- Screen reader compatibility
- High contrast mode testing
- Voice-over navigation testing
- Motor impairment simulation