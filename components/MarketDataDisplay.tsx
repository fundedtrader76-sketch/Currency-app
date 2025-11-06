import React from 'react';
import type { Asset, MarketData } from '../types';

interface MarketDataDisplayProps {
  asset: Asset;
  data: MarketData | null;
  isLoading: boolean;
}

const StatCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div className={`p-4 bg-gray-800 rounded-lg ${className}`}>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl md:text-2xl font-semibold text-white">{value}</p>
    </div>
);


const MarketDataDisplay: React.FC<MarketDataDisplayProps> = ({ asset, data, isLoading }) => {
    if (isLoading) {
        return (
             <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="h-16 bg-gray-700 rounded-lg"></div>
                    <div className="h-16 bg-gray-700 rounded-lg"></div>
                    <div className="h-16 bg-gray-700 rounded-lg"></div>
                    <div className="h-16 bg-gray-700 rounded-lg"></div>
                    <div className="h-16 bg-gray-700 rounded-lg"></div>
                    <div className="h-16 bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 text-center">
                <p className="text-gray-400">No market data available for {asset.name}.</p>
            </div>
        );
    }
    
    const isPositive = data.change >= 0;
    const isForex = ['EURUSD', 'GBPUSD'].includes(asset.id);
    const priceDecimals = isForex ? 5 : 2;
    const otherDecimals = isForex ? 5 : 2;


  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {asset.name} ({asset.base}/{asset.quote})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard 
                label="Price" 
                value={`${data.price.toFixed(priceDecimals)} ${asset.quote}`}
                className="col-span-2 md:col-span-1"
            />
            <StatCard 
                label="24h Change"
                value={`${isPositive ? '+' : ''}${data.change.toFixed(otherDecimals)}`}
            />
            <StatCard 
                label="24h Change %"
                value={`${isPositive ? '+' : ''}${data.changePercent.toFixed(2)}%`}
            />
             <StatCard 
                label="24h High"
                value={data.high.toFixed(priceDecimals)}
            />
             <StatCard 
                label="24h Low"
                value={data.low.toFixed(priceDecimals)}
            />
            <StatCard 
                label="24h Volume"
                value={data.volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            />
        </div>
    </div>
  );
};

export default MarketDataDisplay;
