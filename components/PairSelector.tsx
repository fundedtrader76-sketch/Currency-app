import React from 'react';
import type { Asset } from '../types';

interface PairSelectorProps {
  assets: Asset[];
  selectedAssetId: string;
  onAssetChange: (assetId: string) => void;
}

const PairSelector: React.FC<PairSelectorProps> = ({ assets, selectedAssetId, onAssetChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <label htmlFor="asset-select" className="text-lg font-semibold text-gray-300 whitespace-nowrap">
        Select Market Pair
      </label>
      <select
        id="asset-select"
        value={selectedAssetId}
        onChange={(e) => onAssetChange(e.target.value)}
        className="w-full sm:w-auto bg-gray-800 border border-gray-700 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
      >
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.name} ({asset.id})
          </option>
        ))}
      </select>
    </div>
  );
};

export default PairSelector;