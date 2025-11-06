import { GoogleGenAI, Type } from "@google/genai";
// Fix: 'PredictionSignal' is used as a value, so it needs a value import, not a type-only import.
import { PredictionSignal } from '../types';
import type { Asset, MarketData, Prediction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const modelName = 'gemini-2.5-pro';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        signal: {
            type: Type.STRING,
            enum: [PredictionSignal.BUY, PredictionSignal.SELL, PredictionSignal.HOLD],
            description: 'The trading signal.',
        },
        entryPrice: {
            type: Type.NUMBER,
            description: 'The recommended entry price for the trade.'
        },
        takeProfit: {
            type: Type.NUMBER,
            description: 'The recommended take-profit price.'
        },
        stopLoss: {
            type: Type.NUMBER,
            description: 'The recommended stop-loss price.'
        },
        reasoning: {
            type: Type.STRING,
            description: 'A brief explanation for the trading signal based on the analysis.'
        },
    },
    required: ['signal', 'reasoning'],
};


const parseAndValidatePrediction = (jsonString: string): Prediction | null => {
    try {
        const parsed = JSON.parse(jsonString);

        if (!Object.values(PredictionSignal).includes(parsed.signal)) {
            console.error("Invalid signal in prediction:", parsed);
            return null;
        }

        const prediction: Prediction = {
            signal: parsed.signal,
            reasoning: parsed.reasoning,
            entryPrice: typeof parsed.entryPrice === 'number' ? parsed.entryPrice : undefined,
            takeProfit: typeof parsed.takeProfit === 'number' ? parsed.takeProfit : undefined,
            stopLoss: typeof parsed.stopLoss === 'number' ? parsed.stopLoss : undefined,
        };

        return prediction;
    } catch (error) {
        console.error("Error parsing prediction JSON:", error);
        return null;
    }
};

const getPrediction = async (prompt: any): Promise<Prediction | null> => {
     try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const prediction = parseAndValidatePrediction(jsonString);

        if (!prediction) {
            throw new Error("Failed to parse or validate prediction from API response.");
        }
        
        return prediction;
    } catch (error) {
        console.error("Error fetching prediction from Gemini API:", error);
        throw error;
    }
}


export const getMarketPrediction = async (asset: Asset, marketData: MarketData): Promise<Prediction | null> => {
    const prompt = `
        Analyze the following market data for ${asset.name} (${asset.id}). 
        Act as an expert financial analyst. Provide a trading plan for the next 24 hours.
        Your response must be in JSON format.
        If you provide a BUY or SELL signal, you MUST provide an entryPrice, takeProfit, and stopLoss.
        The risk-to-reward ratio MUST be at least 1:3. For a BUY, (takeProfit - entryPrice) must be at least 3 * (entryPrice - stopLoss). For a SELL, (entryPrice - takeProfit) must be at least 3 * (entryPrice - stopLoss).
        If market conditions are unclear or a high RRR trade is not visible, return a 'HOLD' signal and do not include entryPrice, takeProfit, or stopLoss.

        Current Market Data:
        - Price: ${marketData.price.toFixed(5)} ${asset.quote}
        - 24h Change: ${marketData.change.toFixed(5)} (${marketData.changePercent.toFixed(2)}%)
        - 24h High: ${marketData.high.toFixed(5)}
        - 24h Low: ${marketData.low.toFixed(5)}
        - 24h Volume: ${marketData.volume.toLocaleString()}
    `;
    return getPrediction(prompt);
};

export const getImageAnalysisPrediction = async (asset: Asset, imageBase64: string, instructions: string): Promise<Prediction | null> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };
    
    const textPart = {
        text: `
            Analyze the attached trading chart image for ${asset.name} (${asset.id}).
            Act as an expert technical analyst. Provide a trading plan based on the chart patterns, indicators, and market structure.
            Your response must be in JSON format.
            If you provide a BUY or SELL signal, you MUST provide an entryPrice, takeProfit, and stopLoss.
            The risk-to-reward ratio MUST be at least 1:3. For a BUY, (takeProfit - entryPrice) must be at least 3 * (entryPrice - stopLoss). For a SELL, (entryPrice - takeProfit) must be at least 3 * (entryPrice - stopLoss).
            If the chart is unclear or a high RRR trade is not visible, return a 'HOLD' signal and do not include entryPrice, takeProfit, or stopLoss.

            User-provided instructions: "${instructions}"
        `
    };

    const prompt = { parts: [imagePart, textPart] };
    return getPrediction({ parts: [imagePart, textPart] });
}