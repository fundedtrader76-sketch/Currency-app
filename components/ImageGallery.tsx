import React from 'react';
import type { SavedImage, Prediction } from '../types';
import { PredictionSignal } from '../types';

interface ImageGalleryProps {
  images: SavedImage[];
  onDelete: (imageId: string) => void;
}

const getSignalUI = (signal?: PredictionSignal) => {
    switch (signal) {
        case PredictionSignal.BUY:
            return { text: 'BUY', bgClass: 'bg-green-500/30', textClass: 'text-green-400' };
        case PredictionSignal.SELL:
            return { text: 'SELL', bgClass: 'bg-red-500/30', textClass: 'text-red-400' };
        default:
            return { text: 'HOLD', bgClass: 'bg-yellow-500/30', textClass: 'text-yellow-400' };
    }
};

const Stat: React.FC<{ label: string; value: string | number | undefined; colorClass?: string }> = ({ label, value, colorClass = 'text-white' }) => (
    <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-sm font-semibold ${colorClass}`}>{value?.toString() ?? 'N/A'}</p>
    </div>
);


const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
  const handleDelete = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this analysis?")) {
        onDelete(imageId);
    }
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50">
      <h3 className="text-xl font-bold mb-4 text-white">Saved Analyses</h3>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.slice().reverse().map((image) => {
            const signalUI = getSignalUI(image.prediction.signal);
            const { entryPrice, takeProfit, stopLoss } = image.prediction;
            const isForex = ['EURUSD', 'GBPUSD'].includes(image.assetId);
            const priceDecimals = isForex ? 5 : 2;
            
            return (
                <div key={image.id} className="group relative aspect-square rounded-md overflow-hidden cursor-pointer">
                   <img src={image.dataUrl} alt="Uploaded chart" className="w-full h-full object-cover" />
                   
                   <button 
                    onClick={(e) => handleDelete(e, image.id)}
                    className="absolute top-1 right-1 bg-gray-900/50 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all text-xs z-20"
                    title="Delete Analysis"
                    aria-label="Delete Analysis"
                   >
                    <i className="fas fa-trash-alt"></i>
                   </button>

                   <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-2 text-white z-10 space-y-1 overflow-y-auto">
                        <div className={`px-2 py-0.5 rounded-full self-start text-xs font-bold ${signalUI.bgClass} ${signalUI.textClass}`}>
                            {signalUI.text}
                        </div>
                        {image.prediction.signal !== PredictionSignal.HOLD && (
                            <div className='space-y-1 text-xs'>
                                <Stat label="Entry" value={entryPrice?.toFixed(priceDecimals)} colorClass="text-cyan-300" />
                                <Stat label="TP" value={takeProfit?.toFixed(priceDecimals)} colorClass="text-green-400" />
                                <Stat label="SL" value={stopLoss?.toFixed(priceDecimals)} colorClass="text-red-400" />
                            </div>
                        )}
                        <div className="flex-grow min-h-0">
                            <p className="text-xs text-gray-300 italic line-clamp-3" title={image.prediction.reasoning}>
                                "{image.prediction.reasoning}"
                            </p>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-700/50">
                            {new Date(image.timestamp).toLocaleDateString()}
                        </div>
                   </div>
                </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
            <i className="fas fa-save text-4xl text-gray-600"></i>
            <p className="mt-2 text-sm text-gray-500">No saved analyses for this asset yet.</p>
            <p className="mt-1 text-xs text-gray-600">Analyze a chart to save it here.</p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;