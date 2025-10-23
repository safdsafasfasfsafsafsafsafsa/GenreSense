import React from 'react';
import { UploadScreen } from './UploadScreen';
import { AnalyzingScreen } from './AnalyzingScreen';
import { ResultScreen } from './ResultScreen';
import { HistoryPanel } from './HistoryPanel';
import { TagRequestModal } from './TagRequestModal';
import type { AnalysisResult, HistoryItem } from '../types';

type View = 'upload' | 'analyzing' | 'result';

interface AnalyzerViewProps {
    view: View;
    currentResult: AnalysisResult | null;
    error: string | null;
    history: HistoryItem[];
    isModalOpen: boolean;
    analysesLeft: number;
    onAnalysis: (file: File) => void;
    onSelectHistory: (item: HistoryItem) => void;
    onAnalyzeAnother: () => void;
    onModalOpen: () => void;
    onModalClose: () => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
    view,
    currentResult,
    error,
    history,
    isModalOpen,
    analysesLeft,
    onAnalysis,
    onSelectHistory,
    onAnalyzeAnother,
    onModalOpen,
    onModalClose
}) => {
    return (
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
            <div className="flex-grow bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm p-8 flex items-center justify-center">
                {view === 'upload' && <UploadScreen onAnalyze={onAnalysis} error={error} analysesLeft={analysesLeft} />}
                {view === 'analyzing' && <AnalyzingScreen />}
                {view === 'result' && currentResult && <ResultScreen result={currentResult} onAnalyzeAnother={onAnalyzeAnother} onTagRequest={onModalOpen} />}
            </div>
            <HistoryPanel history={history} onSelect={onSelectHistory} />
            <TagRequestModal isOpen={isModalOpen} onClose={onModalClose} />
        </div>
    );
};
