import React, { useState } from 'react';
import type { AnalysisResult, Genre } from '../types';
import { CopyIcon, PlusIcon } from './Icons';
import { useLocalization } from '../lib/localization';

interface ResultScreenProps {
    result: AnalysisResult;
    onAnalyzeAnother: () => void;
    onAddToCommunity: () => void;
}

const GenreBar: React.FC<{ genre: Genre, isPrimary: boolean }> = ({ genre, isPrimary }) => {
    const { t } = useLocalization();
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${isPrimary ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{genre.genre}</span>
                    {isPrimary && <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-500/50 dark:text-purple-200 px-2 py-0.5 rounded-full">{t.majorGenre}</span>}
                </div>
                <span className={`font-mono text-lg ${isPrimary ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{(genre.probability * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                    className={`h-3 rounded-full ${isPrimary ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-400 dark:bg-gray-500'}`}
                    style={{ width: `${genre.probability * 100}%` }}
                ></div>
            </div>
        </div>
    );
};


export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onAnalyzeAnother, onAddToCommunity }) => {
    const { t } = useLocalization();
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        const textToCopy = result.top3
            .map(g => `${g.genre}: ${(g.probability * 100).toFixed(1)}%`)
            .join(', ');
        navigator.clipboard.writeText(`Top Genres for ${result.file.name}: ${textToCopy}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-2xl text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.resultTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 truncate" title={result.file.name}>
                {result.file.name}
            </p>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t.top3Genres}</h3>
                {result.top3.map((g, index) => (
                    <GenreBar key={g.genre} genre={g} isPrimary={index === 0} />
                ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onAnalyzeAnother}
                    className="w-full sm:w-auto flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    {t.analyzeAnother}
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleCopy}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <CopyIcon />
                        <span>{copied ? t.copied : t.copyResults}</span>
                    </button>
                    <button
                        onClick={onAddToCommunity}
                        title={t.addToCommunity as string}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        <PlusIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};
