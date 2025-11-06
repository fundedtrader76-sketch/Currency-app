import React from 'react';
import type { Asset } from '../types';

interface LiveChartProps {
  asset: Asset;
}

const LiveChart: React.FC<LiveChartProps> = ({ asset }) => {
  // In a real application, this would integrate with a charting library
  // like TradingView, Chart.js, or a custom D3 implementation.
  // For this example, we'll use a placeholder to represent the chart.

  return (
    <div className="bg-gray-900/30 p-4 rounded-xl shadow-lg border border-gray-700/50 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">{asset.name} Chart</h3>
        <div className="flex space-x-2">
            <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-cyan-500 transition-colors">1H</button>
            <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-cyan-500 transition-colors">4H</button>
            <button className="text-xs px-2 py-1 bg-gray-800 ring-1 ring-cyan-500 text-white rounded">1D</button>
            <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-cyan-500 transition-colors">1W</button>
        </div>
      </div>
      <div className="flex-grow bg-gray-900 rounded-md flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for the chart */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="z-10 text-center">
            <i className="fas fa-chart-area text-6xl text-gray-600"></i>
            <p className="mt-4 text-gray-500">Live chart data would be displayed here.</p>
            <p className="text-sm text-gray-600">({asset.id})</p>
        </div>
      </div>
    </div>
  );
};

export default LiveChart;
