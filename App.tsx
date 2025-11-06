import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import PairSelector from './components/PairSelector';
import MarketDataDisplay from './components/MarketDataDisplay';
import LiveChart from './components/LiveChart';
import PredictionCard from './components/PredictionCard';
import ImageUploader from './components/ImageUploader';
import ImageGallery from './components/ImageGallery';
import { ASSETS } from './constants';
import { fetchMarketData } from './services/marketDataService';
import { getMarketPrediction, getImageAnalysisPrediction } from './services/geminiService';
import type { Asset, MarketData, Prediction, SavedImage } from './types';

const App: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(ASSETS[0].id);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketDataIsLoading, setMarketDataIsLoading] = useState<boolean>(true);
  
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [predictionIsLoading, setPredictionIsLoading] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string>('');

  const [savedImages, setSavedImages] = useState<Record<string, SavedImage[]>>(() => {
    try {
      const saved = localStorage.getItem('savedChartAnalyses');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to parse saved images from localStorage", e);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('savedChartAnalyses', JSON.stringify(savedImages));
    } catch (e) {
      console.error("Failed to save images to localStorage", e);
    }
  }, [savedImages]);

  const selectedAsset = useMemo(
    () => ASSETS.find(asset => asset.id === selectedAssetId)!,
    [selectedAssetId]
  );

  const imagesForSelectedAsset = useMemo(
    () => savedImages[selectedAssetId] || [],
    [savedImages, selectedAssetId]
  );

  const handleFetchMarketPrediction = useCallback(async (asset: Asset, currentMarketData: MarketData) => {
    setPredictionIsLoading(true);
    setPredictionError('');
    setPrediction(null);
    try {
      const result = await getMarketPrediction(asset, currentMarketData);
      setPrediction(result);
    } catch (e) {
      setPredictionError('Failed to get market prediction.');
      console.error(e);
    } finally {
      setPredictionIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const getMarketData = async () => {
      setMarketDataIsLoading(true);
      try {
        const data = await fetchMarketData(selectedAsset);
        setMarketData(data);
        handleFetchMarketPrediction(selectedAsset, data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setMarketData(null);
        setPredictionError('Could not load market data to make a prediction.');
      } finally {
        setMarketDataIsLoading(false);
      }
    };

    getMarketData();
    
  }, [selectedAsset, handleFetchMarketPrediction]);
  
  const handleImageAnalysis = async (file: File, instructions: string) => {
      setPredictionIsLoading(true);
      setPredictionError('');
      setPrediction(null);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
          const base64Image = (reader.result as string).split(',')[1];
          try {
              const analysisResult = await getImageAnalysisPrediction(selectedAsset, base64Image, instructions);
              setPrediction(analysisResult);
              
              if (analysisResult) {
                const userConfirmedSave = window.confirm("AI analysis complete. Would you like to save this chart and prediction to your gallery?");
                if (userConfirmedSave) {
                    const newImage: SavedImage = {
                        id: `${Date.now()}-${file.name}`,
                        assetId: selectedAsset.id,
                        dataUrl: reader.result as string,
                        timestamp: new Date(),
                        instructions,
                        prediction: analysisResult,
                    };

                    setSavedImages(prev => ({
                        ...prev,
                        [selectedAsset.id]: [...(prev[selectedAsset.id] || []), newImage]
                    }));
                }
              }

          } catch (e) {
              setPredictionError('Failed to analyze the image.');
              console.error(e);
          } finally {
              setPredictionIsLoading(false);
          }
      };
      reader.onerror = () => {
        setPredictionError('Failed to read the image file.');
        setPredictionIsLoading(false);
      }
  };

  const handleDeleteImage = (imageId: string) => {
    setSavedImages(prev => {
        const newImagesByAsset = { ...prev };
        const updatedAssetImages = (newImagesByAsset[selectedAssetId] || []).filter(img => img.id !== imageId);

        if (updatedAssetImages.length > 0) {
            newImagesByAsset[selectedAssetId] = updatedAssetImages;
        } else {
            delete newImagesByAsset[selectedAssetId];
        }
        
        return newImagesByAsset;
    });
  };


  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <PairSelector
            assets={ASSETS}
            selectedAssetId={selectedAssetId}
            onAssetChange={setSelectedAssetId}
          />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          <div className="xl:col-span-8 space-y-6">
            <MarketDataDisplay asset={selectedAsset} data={marketData} isLoading={marketDataIsLoading} />
            <LiveChart asset={selectedAsset} />
          </div>

          <div className="xl:col-span-4 space-y-6">
            <PredictionCard
                asset={selectedAsset}
                prediction={prediction}
                isLoading={predictionIsLoading}
                error={predictionError}
            />
            <ImageUploader onAnalyze={handleImageAnalysis} isLoading={predictionIsLoading} />
            <ImageGallery images={imagesForSelectedAsset} onDelete={handleDeleteImage} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;