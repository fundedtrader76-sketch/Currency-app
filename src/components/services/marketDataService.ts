// FIX: Corrected import path to be relative.
import type { Asset, MarketData } from '../../types';

// This is a mock function to simulate fetching real-time market data.
// In a real application, this would connect to a WebSocket or poll an API endpoint.
export const fetchMarketData = async (asset: Asset): Promise<MarketData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  // Generate a plausible base price for different assets
  let basePrice = 1.00000;
  if (asset.id.includes('BTC')) basePrice = 68000;
  else if (asset.id.includes('ETH')) basePrice = 3500;
  else if (asset.id.includes('XAU')) basePrice = 2300;
  else if (asset.id.includes('EUR')) basePrice = 1.07000;
  else if (asset.id.includes('GBP')) basePrice = 1.25000;

  // Simulate price fluctuation
  const price = basePrice * (1 + (Math.random() - 0.5) * 0.02); // +/- 1% fluctuation

  // Simulate other market data points based on the price
  const changePercent = (Math.random() - 0.5) * 4; // +/- 2% change
  const change = price * (changePercent / 100);
  const openPrice = price - change;
  const high = Math.max(openPrice, price) * (1 + Math.random() * 0.015); // up to 1.5% higher
  const low = Math.min(openPrice, price) * (1 - Math.random() * 0.015); // up to 1.5% lower
  const volume = Math.random() * 10000 + (asset.id.includes('BTC') ? 5000 : 1000);

  return {
    price,
    change,
    changePercent,
    high,
    low,
    volume,
  };
};