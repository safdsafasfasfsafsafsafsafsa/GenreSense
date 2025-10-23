import React, { useState, useCallback } from 'react';
import { SpeakerIcon } from './Icons';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_FILE_TYPES } from '../constants';
import { useLocalization } from '../lib/localization';

interface UploadScreenProps {
    onAnalyze: (file: File) => void;
    error: string | null;
    analysesLeft: number;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onAnalyze, error, analysesLeft }) => {
    const { t } = useLocalization();
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleFile = useCallback((file: File | null | undefined) => {
        if (!file) return;

        setLocalError(null);
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setLocalError(t.errors.FILE_TOO_LARGE);
            return;
        }
        if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
            setLocalError(t.errors.UNSUPPORTED_FORMAT);
            return;
        }
        onAnalyze(file);
    }, [onAnalyze, t.errors]);

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const displayError = error || localError;
    const isDisabled = analysesLeft <= 0;

    return (
        <div className="w-full max-w-lg text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.uploadTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t.uploadSubtitle}</p>
            
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'} ${isDisabled ? 'opacity-50' : ''}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={onFileChange}
                    accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
                    disabled={isDisabled}
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <SpeakerIcon />
                    <label htmlFor="file-upload" className="font-semibold text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">
                        {t.uploadButton}
                    </label>
                    <p className="text-xs text-gray-500">{t.uploadConstraints}</p>
                </div>
            </div>

            {displayError && (
                <div className="mt-4 text-red-700 bg-red-100 border border-red-200 dark:text-red-400 dark:bg-red-900/50 dark:border-red-800 p-3 rounded-lg">
                    {displayError}
                </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {t.analysesLeft(analysesLeft)}
            </div>
        </div>
    );
};