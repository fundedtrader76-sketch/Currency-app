export interface Asset {
  id: string;
  name: string;
  base: string;
  quote: string;
}

export interface MarketData {
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export enum PredictionSignal {
    BUY = 'BUY',
    SELL = 'SELL',
    HOLD = 'HOLD',
}

export interface Prediction {
    signal: PredictionSignal;
    entryPrice?: number;
    takeProfit?: number;
    stopLoss?: number;
    reasoning: string;
}

export interface UploadedImage {
    id: string;
    assetId: string;
    dataUrl: string;
    timestamp: Date;
    instructions: string;
}

export interface SavedImage extends UploadedImage {
    prediction: Prediction;
}