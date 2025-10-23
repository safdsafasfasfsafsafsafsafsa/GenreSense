import React, { useState, useEffect, useCallback } from 'react';
import type { AnalysisResult, HistoryItem, CommunityEntry } from './types';
import { analyzeAudioFile } from './services/geminiService';
import { MAX_ANALYSES_PER_DAY } from './constants';
import { LocalizationProvider, useLocalization } from './lib/localization';
import { GithubIcon } from './components/Icons';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AnalyzerView } from './components/AnalyzerView';
import { CommunityView } from './components/CommunityView';
import { AddToCommunityModal } from './components/TagRequestModal';

type View = 'upload' | 'analyzing' | 'result';
type Page = 'analyzer' | 'community';
type Theme = 'light' | 'dark';

const initialCommunityEntries: CommunityEntry[] = [
    { id: '1', title: "Bohemian Rhapsody", composer: "Queen", genre1: "Rock Opera" },
    { id: '2', title: "Blinding Lights", composer: "The Weeknd", genre1: "Synth-pop" },
    { id: '3', title: "Smells Like Teen Spirit", composer: "Nirvana", genre1: "Grunge", genre2: "Alternative Rock" },
    { id: '4', title: "Take Five", composer: "The Dave Brubeck Quartet", genre1: "Cool Jazz" },
    { id: '5', title: "Billie Jean", composer: "Michael Jackson", genre1: "Post-disco", genre2: "R&B" },
];


// Self-contained theme management component
const ThemeManager: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('genre-sense-theme') as Theme | null;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('genre-sense-theme', theme);
    }, [theme]);

    return <ThemeSwitcher theme={theme} setTheme={setTheme} />;
};

// Main content component that uses the localization context
const AppContent: React.FC = () => {
    const { t, locale, setLocale } = useLocalization();
    const [view, setView] = useState<View>('upload');
    const [page, setPage] = useState<Page>('analyzer');
    const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>(initialCommunityEntries);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analysesLeft, setAnalysesLeft] = useState(MAX_ANALYSES_PER_DAY);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('genre-sense-history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
        }

        const today = new Date().toISOString().split('T')[0];
        const storedDate = localStorage.getItem('genre-sense-date');
        const storedCount = localStorage.getItem('genre-sense-count');

        if (storedDate === today && storedCount) {
            setAnalysesLeft(parseInt(storedCount, 10));
        } else {
            localStorage.setItem('genre-sense-date', today);
            localStorage.setItem('genre-sense-count', String(MAX_ANALYSES_PER_DAY));
            setAnalysesLeft(MAX_ANALYSES_PER_DAY);
        }
    }, []);
    
    const saveHistory = (newHistory: HistoryItem[]) => {
        setHistory(newHistory);
        localStorage.setItem('genre-sense-history', JSON.stringify(newHistory));
    };

    const handleAnalysis = useCallback(async (file: File) => {
        if (analysesLeft <= 0) {
            setError((t.errors as { DAILY_LIMIT_REACHED: string }).DAILY_LIMIT_REACHED);
            return;
        }

        setView('analyzing');
        setError(null);
        try {
            const result = await analyzeAudioFile(file);
            setCurrentResult(result);
            
            const newHistoryItem: HistoryItem = {
                id: crypto.randomUUID(),
                fileName: file.name,
                result,
                timestamp: new Date().toISOString(),
            };
            saveHistory([newHistoryItem, ...history.slice(0, 9)]);
            
            const newCount = analysesLeft - 1;
            setAnalysesLeft(newCount);
            localStorage.setItem('genre-sense-count', String(newCount));
            
            setView('result');
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setView('upload');
        }
    }, [analysesLeft, history, t.errors]);

    const handleSelectHistory = (item: HistoryItem) => {
        setCurrentResult(item.result);
        setPage('analyzer');
        setView('result');
        setError(null);
        window.scrollTo(0, 0);
    };

    const handleAnalyzeAnother = () => {
        setCurrentResult(null);
        setView('upload');
        setError(null);
    };

    const handleAddEntryFromCommunityForm = (entry: Omit<CommunityEntry, 'id'>) => {
        const newEntry: CommunityEntry = {
            id: crypto.randomUUID(),
            ...entry
        };
        setCommunityEntries([newEntry, ...communityEntries]);
    };

    const handleConfirmAddToCommunity = ({ title, composer }: { title: string, composer: string }) => {
        if (!currentResult) return;

        const newEntry: CommunityEntry = {
            id: crypto.randomUUID(),
            title,
            composer,
            genre1: currentResult.top3[0]?.genre,
            genre2: currentResult.top3[1]?.genre,
            genre3: currentResult.top3[2]?.genre,
        };
        setCommunityEntries([newEntry, ...communityEntries]);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            <header className="py-4 px-6 md:px-8 border-b border-gray-200 dark:border-gray-700/50 sticky top-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 19C9 20.1046 9.89543 21 11 21C12.1046 21 13 20.1046 13 19V5C13 3.89543 12.1046 3 11 3C9.89543 3 9 3.89543 9 5V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 19C5 20.1046 5.89543 21 7 21C8.1046 21 9 20.1046 9 19V11C9 9.89543 8.1046 9 7 9C5.89543 9 5 9.89543 5 11V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 19C17 20.1046 17.8954 21 19 21C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7C17.8954 7 17 7.89543 17 9V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        <h1 className="text-xl font-bold">GenreSense</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-full">
                        <button onClick={() => setPage('analyzer')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${page === 'analyzer' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{t.analyzer as string}</button>
                        <button onClick={() => setPage('community')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${page === 'community' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{t.community as string}</button>
                    </nav>
                    <div className="flex items-center gap-2">
                        <ThemeManager />
                        <LanguageSwitcher locale={locale} setLocale={setLocale} />
                        <button
                            onClick={() => alert(t.loginComingSoon as string)}
                            className="hidden sm:inline-block text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t.login as string}
                        </button>
                        <a href="https://github.com/google/generative-ai-docs/tree/main/examples/web/genresense" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700" title={t.github as string}><GithubIcon /></a>
                    </div>
                </div>
            </header>

            <main className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex items-start justify-center">
                    {page === 'analyzer' ? (
                        <AnalyzerView
                            view={view}
                            currentResult={currentResult}
                            error={error}
                            history={history}
                            analysesLeft={analysesLeft}
                            onAnalysis={handleAnalysis}
                            onSelectHistory={handleSelectHistory}
                            onAnalyzeAnother={handleAnalyzeAnother}
                            onAddToCommunity={() => setIsModalOpen(true)}
                        />
                    ) : (
                        <CommunityView entries={communityEntries} onAddEntry={handleAddEntryFromCommunityForm} />
                    )}
                </div>
            </main>
            <AddToCommunityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleConfirmAddToCommunity}
                result={currentResult}
            />
        </div>
    );
};

// Root component that provides the localization context
const App: React.FC = () => {
    return (
        <LocalizationProvider>
            <AppContent />
        </LocalizationProvider>
    );
};

export default App;
