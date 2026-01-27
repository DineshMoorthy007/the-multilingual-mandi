'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  language?: string;
}

export function LoadingSpinner({ size = 'md', text, language = 'hi' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const loadingTexts = {
    hi: 'लोड हो रहा है...',
    en: 'Loading...',
    ta: 'ஏற்றுகிறது...',
    te: 'లోడ్ అవుతోంది...',
    kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...'
  };

  const displayText = text || loadingTexts[language as keyof typeof loadingTexts] || loadingTexts.hi;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`${sizeClasses[size]} border-4 border-green-200 border-t-green-700 rounded-full animate-spin`}></div>
      {displayText && (
        <p className="text-sm text-gray-600 animate-pulse">{displayText}</p>
      )}
    </div>
  );
}