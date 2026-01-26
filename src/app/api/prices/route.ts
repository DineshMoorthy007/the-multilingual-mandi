import { NextResponse } from 'next/server';

// Define types inline for simplicity
interface PriceData {
  commodity: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  timestamp: Date;
  source: string;
  currency: string;
  unit: string;
}

// Mock price data - in a real app, this would come from external APIs
const mockPrices: PriceData[] = [
  {
    commodity: 'tomato',
    currentPrice: 45 + Math.random() * 10 - 5, // Add some variation
    previousPrice: 40,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    timestamp: new Date(),
    source: 'Delhi Mandi',
    currency: 'INR',
    unit: 'kg'
  },
  {
    commodity: 'onion',
    currentPrice: 35 + Math.random() * 8 - 4,
    previousPrice: 38,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    timestamp: new Date(),
    source: 'Mumbai Mandi',
    currency: 'INR',
    unit: 'kg'
  },
  {
    commodity: 'potato',
    currentPrice: 25 + Math.random() * 6 - 3,
    previousPrice: 25,
    trend: Math.random() > 0.3 ? 'stable' : Math.random() > 0.5 ? 'up' : 'down',
    timestamp: new Date(),
    source: 'Kolkata Mandi',
    currency: 'INR',
    unit: 'kg'
  },
  {
    commodity: 'wheat',
    currentPrice: 2200 + Math.random() * 200 - 100,
    previousPrice: 2150,
    trend: 'up',
    timestamp: new Date(),
    source: 'Punjab Mandi',
    currency: 'INR',
    unit: 'quintal'
  },
  {
    commodity: 'rice',
    currentPrice: 3500 + Math.random() * 300 - 150,
    previousPrice: 3400,
    trend: 'up',
    timestamp: new Date(),
    source: 'Haryana Mandi',
    currency: 'INR',
    unit: 'quintal'
  },
  {
    commodity: 'carrot',
    currentPrice: 30 + Math.random() * 8 - 4,
    previousPrice: 32,
    trend: 'down',
    timestamp: new Date(),
    source: 'Bangalore Mandi',
    currency: 'INR',
    unit: 'kg'
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update trends based on price changes
    const updatedPrices = mockPrices.map(price => {
      const change = price.currentPrice - price.previousPrice;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      if (Math.abs(change) > 1) {
        trend = change > 0 ? 'up' : 'down';
      }
      
      return {
        ...price,
        trend,
        timestamp: new Date(),
      };
    });
    
    return NextResponse.json({
      success: true,
      data: updatedPrices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch prices',
        data: [] 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { commodity } = await request.json();
    
    // Find specific commodity price
    const price = mockPrices.find(p => p.commodity.toLowerCase() === commodity.toLowerCase());
    
    if (!price) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Commodity not found',
          data: null 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: price,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching specific price:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch price',
        data: null 
      },
      { status: 500 }
    );
  }
}