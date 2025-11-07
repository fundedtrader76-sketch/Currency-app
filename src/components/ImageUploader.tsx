import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onAnalyze: (file: File, instructions: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (selectedFile: File | undefined) => {
    if (selectedFile) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
            setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
            return;
        }
        setError('');
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }
  };
  
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleFileChange(event.dataTransfer.files?.[0]);
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
  };

  const handleSubmit = () => {
    if (file) {
      onAnalyze(file, instructions);
    } else {
      setError('Please select an image to analyze.');
    }
  };
  
  const handleRemoveImage = () => {
      setFile(null);
      setPreview(null);
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50">
      <h3 className="text-xl font-bold mb-4 text-white">Analyze Your Chart</h3>
      <div className="space-y-4">
        {preview ? (
            <div className="relative">
                <img src={preview} alt="Chart preview" className="rounded-lg max-h-48 w-full object-contain" />
                <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full h-7 w-7 flex items-center justify-center hover:bg-red-500 transition-colors">
                    <i className="fas fa-times"></i>
                </button>
            </div>
        ) : (
             <div 
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 transition-colors"
             >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <i className="fas fa-upload text-3xl text-gray-500"></i>
                    <p className="mt-2 text-sm text-gray-400">Drag & drop or click to upload</p>
                </label>
            </div>
        )}
       
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Optional: Add instructions for the AI (e.g., 'Focus on the RSI divergence and the head and shoulders pattern.')"
          className="w-full bg-gray-900/70 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 resize-none"
          rows={3}
        />
        
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        <button
            onClick={handleSubmit}
            disabled={isLoading || !file}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
             {isLoading ? 'Analyzing...' : 'Analyze Chart'}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;