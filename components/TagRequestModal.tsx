import React, { useState, useEffect } from 'react';
import { useLocalization } from '../lib/localization';
import type { AnalysisResult } from '../types';

interface AddToCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string, composer: string }) => void;
    result: AnalysisResult | null;
}

export const AddToCommunityModal: React.FC<AddToCommunityModalProps> = ({ isOpen, onClose, onSubmit, result }) => {
    const { t } = useLocalization();
    const [title, setTitle] = useState('');
    const [composer, setComposer] = useState('');

    useEffect(() => {
        if (result) {
            // Try to infer title and artist from filename
            const parts = result.file.name.split('.').slice(0, -1).join('.').split(' - ');
            if (parts.length === 2) {
                setComposer(parts[0].trim());
                setTitle(parts[1].trim());
            } else {
                setTitle(parts[0].trim());
            }
        }
    }, [result]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !composer) return;
        onSubmit({ title, composer });
    };
    
    const handleClose = () => {
        onClose();
        setTimeout(() => {
          setTitle('');
          setComposer('');
        }, 300); // allow for closing animation
    }

    if (!isOpen || !result) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg w-full max-w-md p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.addToCommunityTitle as string}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t.addToCommunitySubtitle as string}</p>
                
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.detectedGenres as string}</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.top3.map((g, i) => (
                            <span key={i} className="px-2.5 py-1 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-full">{g.genre}</span>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="music-title-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.musicTitle as string}</label>
                        <input
                            type="text"
                            id="music-title-modal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="music-composer-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.composer as string}</label>
                        <input
                            type="text"
                            id="music-composer-modal"
                            value={composer}
                            onChange={(e) => setComposer(e.target.value)}
                            required
                            className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={handleClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors">{t.close as string}</button>
                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">{t.add as string}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
