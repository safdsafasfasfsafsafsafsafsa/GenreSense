import React, { useState, useMemo } from 'react';
import { useLocalization } from '../lib/localization';
import { SearchIcon } from './Icons';

interface GenreEntry {
    id: number;
    title: string;
    composer: string;
    genre: string;
}

const initialEntries: GenreEntry[] = [
    { id: 1, title: "Bohemian Rhapsody", composer: "Queen", genre: "Rock Opera" },
    { id: 2, title: "Blinding Lights", composer: "The Weeknd", genre: "Synth-pop" },
    { id: 3, title: "Smells Like Teen Spirit", composer: "Nirvana", genre: "Grunge, Alternative Rock" },
    { id: 4, title: "Take Five", composer: "The Dave Brubeck Quartet", genre: "Cool Jazz" },
    { id: 5, title: "Billie Jean", composer: "Michael Jackson", genre: "Post-disco, R&B" },
];

export const CommunityView: React.FC = () => {
    const { t } = useLocalization();
    const [entries, setEntries] = useState<GenreEntry[]>(initialEntries);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newComposer, setNewComposer] = useState('');
    const [newGenre, setNewGenre] = useState('');

    const filteredEntries = useMemo(() => {
        if (!searchTerm) return entries;
        const lowercasedFilter = searchTerm.toLowerCase();
        return entries.filter(
            (entry) =>
                entry.title.toLowerCase().includes(lowercasedFilter) ||
                entry.composer.toLowerCase().includes(lowercasedFilter) ||
                entry.genre.toLowerCase().includes(lowercasedFilter)
        );
    }, [entries, searchTerm]);

    const handleAddEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newComposer.trim() || !newGenre.trim()) return;
        const newEntry: GenreEntry = {
            id: Date.now(),
            title: newTitle.trim(),
            composer: newComposer.trim(),
            genre: newGenre.trim(),
        };
        setEntries([newEntry, ...entries]);
        setNewTitle('');
        setNewComposer('');
        setNewGenre('');
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.communityTitle}</h2>
                <p className="text-gray-600 dark:text-gray-400">{t.communitySubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">{t.addEntryTitle}</h3>
                        <form onSubmit={handleAddEntry} className="space-y-4">
                            <div>
                                <label htmlFor="music-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.musicTitle}</label>
                                <input
                                    type="text"
                                    id="music-title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="music-composer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.composer}</label>
                                <input
                                    type="text"
                                    id="music-composer"
                                    value={newComposer}
                                    onChange={(e) => setNewComposer(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="music-genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.genre}</label>
                                <input
                                    type="text"
                                    id="music-genre"
                                    value={newGenre}
                                    onChange={(e) => setNewGenre(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2">
                                <div className="w-5 h-5 border-2 border-gray-400 dark:border-gray-500 rounded-sm flex-shrink-0"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t.captchaPlaceholder}</span>
                            </div>
                            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">{t.add}</button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2">
                     <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                           <SearchIcon />
                        </div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left">
                               <thead className="bg-white/70 dark:bg-gray-800/70">
                                   <tr>
                                       <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-white">{t.musicTitle}</th>
                                       <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-white">{t.composer}</th>
                                       <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-white">{t.genre}</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                                       <tr key={entry.id} className="border-t border-gray-200 dark:border-gray-700">
                                           <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{entry.title}</td>
                                           <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{entry.composer}</td>
                                           <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{entry.genre}</td>
                                       </tr>
                                   )) : (
                                       <tr>
                                           <td colSpan={3} className="text-center py-10 text-gray-500">{t.noResults}</td>
                                       </tr>
                                   )}
                               </tbody>
                           </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};