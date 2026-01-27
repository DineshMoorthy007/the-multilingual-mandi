'use client';

import React from 'react';
import { PriceData } from '@/lib/types';
import { COMMODITIES } from '@/lib/constants';

interface PriceCardProps {
  priceData: PriceData;
  language: string;
  onClick?: () => void;
  onSetAlert?: (commodity: string, price: number) => void;
  selectedCommodity?: string;
}

export function PriceCard({ priceData, language, onClick, onSetAlert, selectedCommodity }: PriceCardProps) {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertPrice, setAlertPrice] = React.useState(priceData.currentPrice);

  const commodity = COMMODITIES.find(c => c.id === priceData.commodity);
  const commodityName = commodity?.name[language as keyof typeof commodity.name] || priceData.commodity;
  const icon = commodity?.icon || '📦';

  const getTrendIcon = () => {
    switch (priceData.trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➖';
    }
  };

  const getTrendColor = () => {
    switch (priceData.trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriceChange = () => {
    const change = priceData.currentPrice - priceData.previousPrice;
    const changePercent = ((change / priceData.previousPrice) * 100).toFixed(1);
    return { change, changePercent };
  };

  const { change, changePercent } = getPriceChange();
  const isStale = Date.now() - priceData.timestamp.getTime() > 30 * 60 * 1000; // 30 minutes

  const handleSetAlert = () => {
    if (onSetAlert) {
      onSetAlert(priceData.commodity, alertPrice);
      setShowAlert(false);
    }
  };

  const getUnitText = () => {
    const units = {
      hi: priceData.unit === 'kg' ? 'प्रति किलो' : 'प्रति क्विंटल',
      en: `per ${priceData.unit}`,
      ta: priceData.unit === 'kg' ? 'ஒரு கிலோவுக்கு' : 'ஒரு குவிண்டலுக்கு',
      te: priceData.unit === 'kg' ? 'కిలోకు' : 'క్వింటల్‌కు',
      kn: priceData.unit === 'kg' ? 'ಪ್ರತಿ ಕಿಲೋಗೆ' : 'ಪ್ರತಿ ಕ್ವಿಂಟಲ್‌ಗೆ'
    };
    return units[language as keyof typeof units] || `per ${priceData.unit}`;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 ${
        onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-green-300' : ''
      } ${selectedCommodity === priceData.commodity ? 'ring-2 ring-green-500 border-green-500' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-4xl drop-shadow-sm">{icon}</span>
            {priceData.trend === 'up' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
            {priceData.trend === 'down' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {commodityName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getUnitText()}
            </p>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center space-x-2">
          {isStale && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-700 dark:text-yellow-300">Stale</span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAlert(!showAlert);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Set Price Alert"
          >
            🔔
          </button>
        </div>
      </div>

      {/* Price Information */}
      <div className="space-y-4">
        {/* Current Price */}
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ₹{priceData.currentPrice.toLocaleString('en-IN')}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTrendIcon()}</span>
            <div className="text-right">
              <span className={`font-bold text-lg ${getTrendColor()}`}>
                {change > 0 ? '+' : ''}₹{Math.abs(change)}
              </span>
              <div className={`text-sm font-medium ${getTrendColor()}`}>
                {change > 0 ? '+' : ''}{changePercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Price Change Context */}
        <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {language === 'hi' ? 'पिछले दिन से' : 
             language === 'ta' ? 'நேற்றிலிருந்து' :
             language === 'te' ? 'నిన్నటి నుండి' :
             language === 'kn' ? 'ನಿನ್ನೆಯಿಂದ' : 'From yesterday'}
          </span>
          <span className={`font-bold ${getTrendColor()}`}>
            {change > 0 ? '+' : ''}{changePercent}%
          </span>
        </div>

        {/* Day High/Low */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <div className="text-green-600 dark:text-green-400 font-medium">
              {language === 'hi' ? 'उच्च' : 
               language === 'ta' ? 'உயர்ந்த' :
               language === 'te' ? 'అధిక' :
               language === 'kn' ? 'ಹೆಚ್ಚಿನ' : 'High'}
            </div>
            <div className="text-lg font-bold text-green-700 dark:text-green-300">
              ₹{priceData.dayHigh}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
            <div className="text-red-600 dark:text-red-400 font-medium">
              {language === 'hi' ? 'निम्न' : 
               language === 'ta' ? 'குறைந்த' :
               language === 'te' ? 'తక్కువ' :
               language === 'kn' ? 'ಕಡಿಮೆ' : 'Low'}
            </div>
            <div className="text-lg font-bold text-red-700 dark:text-red-300">
              ₹{priceData.dayLow}
            </div>
          </div>
        </div>

        {/* Timestamp and Source */}
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <span>🕒</span>
              <span>
                {language === 'hi' ? 'अपडेट' : 
                 language === 'ta' ? 'புதுப்பிக்கப்பட்டது' :
                 language === 'te' ? 'అప్‌డేట్' :
                 language === 'kn' ? 'ನವೀಕರಿಸಲಾಗಿದೆ' : 'Updated'}: {priceData.timestamp.toLocaleTimeString()}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <span>📍</span>
              <span>{priceData.source}</span>
            </span>
          </div>
          {isStale && (
            <div className="mt-2 flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
              <span>⚠️</span>
              <span className="font-medium">
                {language === 'hi' ? 'पुराना डेटा - रिफ्रेश करें' : 
                  language === 'ta' ? 'பழைய தரவு - புதுப்பிக்கவும்' :
                  language === 'te' ? 'పాత డేటా - రిఫ్రెష్ చేయండి' :
                  language === 'kn' ? 'ಹಳೆಯ ಡೇಟಾ - ರಿಫ್ರೆಶ್ ಮಾಡಿ' : 'Stale data - Please refresh'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price Alert Modal */}
      {showAlert && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
          <h4 className="font-bold mb-3 text-blue-800 dark:text-blue-200 flex items-center space-x-2">
            <span>🔔</span>
            <span>
              {language === 'hi' ? 'प्राइस अलर्ट सेट करें' :
               language === 'ta' ? 'விலை எச்சரிக்கை அமைக்கவும்' :
               language === 'te' ? 'ప్రైస్ అలర్ట్ సెట్ చేయండి' :
               language === 'kn' ? 'ಬೆಲೆ ಎಚ್ಚರಿಕೆ ಹೊಂದಿಸಿ' : 'Set Price Alert'}
            </span>
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">₹</span>
              <input
                type="number"
                value={alertPrice}
                onChange={(e) => setAlertPrice(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={`Current: ₹${priceData.currentPrice}`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSetAlert}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>✅</span>
                <span>
                  {language === 'hi' ? 'अलर्ट सेट करें' : 
                   language === 'ta' ? 'எச்சரிக்கை அமைக்கவும்' :
                   language === 'te' ? 'అలర్ట్ సెట్ చేయండి' :
                   language === 'kn' ? 'ಎಚ್ಚರಿಕೆ ಹೊಂದಿಸಿ' : 'Set Alert'}
                </span>
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}