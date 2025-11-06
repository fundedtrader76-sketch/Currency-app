import React from 'react';

const NewsFeed: React.FC = () => {
    // Mock news data
    const newsItems = [
        { id: 1, source: 'Crypto News', title: 'Bitcoin Surges Past $60,000 as Market Sentiment Improves', time: '2h ago' },
        { id: 2, source: 'Forex Live', title: 'Federal Reserve Hints at Tapering, USD Strengthens', time: '3h ago' },
        { id: 3, source: 'Commodity Times', title: 'Gold Prices Fluctuate Amidst Geopolitical Tensions', time: '5h ago' },
    ];

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4 text-white">Market News</h3>
            <div className="space-y-4">
                {newsItems.map(item => (
                    <div key={item.id} className="border-b border-gray-700/50 pb-3 last:border-b-0 last:pb-0">
                        <p className="font-semibold text-white hover:text-cyan-400 transition-colors cursor-pointer">{item.title}</p>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-cyan-500">{item.source}</p>
                            <p className="text-xs text-gray-400">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
