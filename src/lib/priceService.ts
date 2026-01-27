import { PriceData, PriceAlert } from './types';
import { COMMODITIES, LOCATIONS } from './constants';

export class EnhancedPriceService {
  private cache: Map<string, PriceData[]> = new Map();
  private alerts: PriceAlert[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startPriceUpdates();
  }

  async getCurrentPrices(location: string = 'delhi'): Promise<PriceData[]> {
    const cacheKey = `prices_${location}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cachedPrices = this.cache.get(cacheKey)!;
      const isStale = Date.now() - cachedPrices[0].timestamp.getTime() > 5 * 60 * 1000; // 5 minutes
      
      if (!isStale) {
        return cachedPrices;
      }
    }

    // Generate fresh prices
    const prices = this.generatePrices(location);
    this.cache.set(cacheKey, prices);
    
    // Check alerts
    this.checkPriceAlerts(prices);
    
    return prices;
  }

  private generatePrices(location: string): PriceData[] {
    return COMMODITIES.map(commodity => {
      const basePrice = this.getBasePrice(commodity.id);
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const currentPrice = Math.round(basePrice * (1 + variation));
      const previousPrice = Math.round(basePrice * (1 + (Math.random() - 0.5) * 0.15));
      
      const trend: 'up' | 'down' | 'stable' = 
        currentPrice > previousPrice * 1.02 ? 'up' :
        currentPrice < previousPrice * 0.98 ? 'down' : 'stable';

      return {
        commodity: commodity.id,
        currentPrice,
        previousPrice,
        trend,
        timestamp: new Date(),
        source: `${location} Mandi`,
        currency: 'INR',
        unit: commodity.category === 'grains' ? 'quintal' : 'kg',
        dayHigh: Math.round(currentPrice * 1.1),
        dayLow: Math.round(currentPrice * 0.9),
        volume: Math.round(Math.random() * 1000 + 100),
        location
      };
    });
  }

  private getBasePrice(commodityId: string): number {
    const basePrices: Record<string, number> = {
      tomato: 45,
      onion: 35,
      potato: 25,
      wheat: 2200,
      rice: 3500,
      carrot: 30,
      cabbage: 20,
      cauliflower: 40
    };
    return basePrices[commodityId] || 50;
  }

  async getPriceHistory(commodity: string, days: number = 7): Promise<PriceData[]> {
    const history: PriceData[] = [];
    const basePrice = this.getBasePrice(commodity);
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.3;
      const price = Math.round(basePrice * (1 + variation));
      
      history.push({
        commodity,
        currentPrice: price,
        previousPrice: i < days ? history[history.length - 1]?.currentPrice || price : price,
        trend: 'stable',
        timestamp: date,
        source: 'Historical Data',
        currency: 'INR',
        unit: 'kg',
        dayHigh: Math.round(price * 1.05),
        dayLow: Math.round(price * 0.95),
        location: 'delhi'
      });
    }
    
    return history;
  }

  addPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    this.alerts.push(newAlert);
    return newAlert;
  }

  removePriceAlert(alertId: string): boolean {
    const index = this.alerts.findIndex(alert => alert.id === alertId);
    if (index > -1) {
      this.alerts.splice(index, 1);
      return true;
    }
    return false;
  }

  getPriceAlerts(): PriceAlert[] {
    return this.alerts.filter(alert => alert.isActive);
  }

  private checkPriceAlerts(prices: PriceData[]) {
    const activeAlerts = this.alerts.filter(alert => alert.isActive);
    
    for (const alert of activeAlerts) {
      const priceData = prices.find(p => p.commodity === alert.commodity);
      if (!priceData) continue;
      
      const shouldTrigger = 
        (alert.condition === 'above' && priceData.currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && priceData.currentPrice <= alert.targetPrice);
      
      if (shouldTrigger) {
        this.triggerAlert(alert, priceData);
      }
    }
  }

  private triggerAlert(alert: PriceAlert, priceData: PriceData) {
    // In a real app, this would send a push notification
    console.log(`Price Alert: ${alert.commodity} is now ₹${priceData.currentPrice}`);
    
    // Deactivate the alert
    alert.isActive = false;
    
    // Trigger browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Price Alert - ${alert.commodity}`, {
        body: `Price is now ₹${priceData.currentPrice} (Target: ₹${alert.targetPrice})`,
        icon: '/favicon.ico'
      });
    }
  }

  private startPriceUpdates() {
    // Update prices every 2 minutes
    this.updateInterval = setInterval(() => {
      this.cache.clear(); // Clear cache to force fresh data
    }, 2 * 60 * 1000);
  }

  stopPriceUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  async searchCommodity(query: string, language: string = 'hi'): Promise<any[]> {
    const lowerQuery = query.toLowerCase();
    
    return COMMODITIES.filter(commodity => {
      const names = Object.values(commodity.name);
      return names.some(name => 
        name.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(name.toLowerCase())
      );
    });
  }

  formatPrice(price: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }

  calculatePriceChange(current: number, previous: number): {
    amount: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  } {
    const amount = current - previous;
    const percentage = previous > 0 ? (amount / previous) * 100 : 0;
    
    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(percentage) > 1) {
      direction = amount > 0 ? 'up' : 'down';
    }
    
    return { amount, percentage, direction };
  }
}