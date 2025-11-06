import type { Asset, MarketData } from '../types';

// This is a mock service. In a real application, you would fetch this data from a live API.
export const fetchMarketData = async (asset: Asset): Promise<MarketData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 800));

  // Generate some realistic-looking random data based on the asset type
  const basePrice = {
    BTCUSD: 65000,
    ETHUSD: 3500,
    XAUUSD: 2300,
    EURUSD: 1.07,
    GBPUSD: 1.26,
  }[asset.id] || 100;
  
  const isForex = ['EURUSD', 'GBPUSD'].includes(asset.id);
  const priceFluctuation = isForex ? 0.005 : 0.05;

  const price = basePrice * (1 + (Math.random() - 0.5) * priceFluctuation);
  const high = price * (1 + Math.random() * 0.02);
  const low = price * (1 - Math.random() * 0.02);
  const open = basePrice * (1 + (Math.random() - 0.5) * priceFluctuation);
  const change = price - open;
  const changePercent = (change / open) * 100;
  const volume = Math.random() * 10000000;

  return {
    price,
    change,
    changePercent,
    high,
    low,
    volume,
  };
};
