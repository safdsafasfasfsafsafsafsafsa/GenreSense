import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

type Theme = 'light' | 'dark';

interface ThemeSwitcherProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};