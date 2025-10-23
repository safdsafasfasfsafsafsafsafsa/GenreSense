import React from 'react';
import type { Locale } from '../types';

interface LanguageSwitcherProps {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ locale, setLocale }) => {
    return (
        <div className="flex items-center bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full p-1 text-sm">
            <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded-full transition-colors ${locale === 'en' ? 'bg-purple-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-gray-700'}`}
            >
                EN
            </button>
            <button
                onClick={() => setLocale('ko')}
                className={`px-3 py-1 rounded-full transition-colors ${locale === 'ko' ? 'bg-purple-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-gray-700'}`}
            >
                KO
            </button>
        </div>
    );
};