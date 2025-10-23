import React from 'react';
import type { HistoryItem } from '../types';
import { ClockIcon } from './Icons';
import { useLocalization } from '../lib/localization';

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
    const { t } = useLocalization();
    const { locale } = useLocalization();

    const formatTimeAgo = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return new Intl.DateTimeFormat(locale).format(date);
        interval = seconds / 2592000;
        if (interval > 1) return new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric' }).format(date);
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + (locale === 'ko' ? '일 전' : ' days ago');
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + (locale === 'ko' ? '시간 전' : ' hours ago');
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + (locale === 'ko' ? '분 전' : ' minutes ago');
        return locale === 'ko' ? '방금 전' : 'just now';
    };

    return (
        <aside className="w-full lg:w-80 flex-shrink-0 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t.historyTitle}</h3>
            {history.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p>{t.historyEmpty}</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {history.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => onSelect(item)}
                                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            >
                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.fileName}</p>
                                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{item.result.top3[0].genre}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <ClockIcon />
                                    <span className="ml-1.5">{formatTimeAgo(item.timestamp)}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
};