import React from 'react';
import type { Asset, Prediction } from '../types';
import { PredictionSignal } from '../types';

interface PredictionCardProps {
  asset: Asset;
  prediction: Prediction | null;
  isLoading: boolean;
  error: string;
}

const Stat: React.FC<{ label: string; value: string | number; colorClass?: string }> = ({ label, value, colorClass = 'text-white' }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-lg font-semibold ${colorClass}`}>{value}</p>
    </div>
);


const PredictionCard: React.FC<PredictionCardProps> = ({ asset, prediction, isLoading, error }) => {
    
    const getSignalUI = (signal?: PredictionSignal) => {
        switch (signal) {
            case PredictionSignal.BUY:
                return {
                    text: 'BUY',
                    bgClass: 'bg-green-500/20',
                    textClass: 'text-green-400',
                    icon: <i className="fas fa-arrow-trend-up mr-2"></i>
                };
            case PredictionSignal.SELL:
                return {
                    text: 'SELL',
                    bgClass: 'bg-red-500/20',
                    textClass: 'text-red-400',
                    icon: <i className="fas fa-arrow-trend-down mr-2"></i>
                };
            default:
                return {
                    text: 'HOLD',
                    bgClass: 'bg-yellow-500/20',
                    textClass: 'text-yellow-400',
                    icon: <i className="fas fa-pause-circle mr-2"></i>
                };
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-10">
                    <svg className="animate-spin mx-auto h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-400">AI is analyzing the market...</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-400 text-sm text-center py-10">{error}</p>;
        }

        if (!prediction) {
            return <p className="text-gray-500 text-sm text-center py-10">No prediction available. Analysis might be in progress or failed.</p>;
        }
        
        const signalUI = getSignalUI(prediction.signal);
        const { entryPrice, takeProfit, stopLoss } = prediction;
        let rrr = null;

        const isForex = ['EURUSD', 'GBPUSD'].includes(asset.id);
        const priceDecimals = isForex ? 5 : 2;

        if (entryPrice && takeProfit && stopLoss) {
            const reward = Math.abs(takeProfit - entryPrice);
            const risk = Math.abs(entryPrice - stopLoss);
            if (risk > 0) {
                rrr = (reward / risk).toFixed(2);
            }
        }

        return (
            <div className="space-y-4 animate-fade-in">
                <div className={`p-3 rounded-lg flex items-center justify-center font-bold text-lg ${signalUI.bgClass} ${signalUI.textClass}`}>
                    {signalUI.icon}
                    <span>{signalUI.text}</span>
                </div>
                
                {prediction.signal !== PredictionSignal.HOLD && entryPrice && takeProfit && stopLoss && (
                     <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-lg">
                        <Stat label="Entry Price" value={entryPrice.toFixed(priceDecimals)} colorClass="text-cyan-400" />
                        <Stat label="Risk/Reward" value={rrr ? `1 : ${rrr}`: 'N/A'} colorClass={rrr && parseFloat(rrr) >= 3 ? 'text-green-400' : 'text-yellow-400'} />
                        <Stat label="Take Profit" value={takeProfit.toFixed(priceDecimals)} colorClass="text-green-400" />
                        <Stat label="Stop Loss" value={stopLoss.toFixed(priceDecimals)} colorClass="text-red-400" />
                    </div>
                )}
               
                <div>
                    <h4 className="font-semibold mb-1 text-gray-300">AI Reasoning:</h4>
                    <p className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-md">{prediction.reasoning}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 min-h-[200px]">
            <h3 className="text-xl font-bold mb-4 text-white">AI Trading Plan</h3>
            {renderContent()}
        </div>
    );
};

export default PredictionCard;