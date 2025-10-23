import React, { useState } from 'react';
import { useLocalization } from '../lib/localization';

interface TagRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TagRequestModal: React.FC<TagRequestModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    const [submitted, setSubmitted] = useState(false);
    const [tagName, setTagName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to a server
        console.log("Tag suggestion submitted:", { tagName });
        setSubmitted(true);
        setTimeout(() => {
            handleClose();
        }, 3000);
    };
    
    const handleClose = () => {
        onClose();
        setTimeout(() => {
          setSubmitted(false);
          setTagName('');
        }, 300); // allow for closing animation
    }

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg w-full max-w-md p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {submitted ? (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t.tagRequestSuccess}</h3>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.tagRequestTitle}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{t.tagRequestSubtitle}</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.tagName}</label>
                                <input
                                    type="text"
                                    id="tagName"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    required
                                    className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="tagDesc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.tagDescription}</label>
                                <textarea
                                    id="tagDesc"
                                    rows={3}
                                    className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                             <div>
                                <label htmlFor="tagRef" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.tagReference}</label>
                                <input
                                    type="text"
                                    id="tagRef"
                                    className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors">{t.close}</button>
                                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">{t.submit}</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};