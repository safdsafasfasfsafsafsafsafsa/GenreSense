import React, { useState, useEffect } from 'react';
import { useLocalization } from '../lib/localization';

export const AnalyzingScreen: React.FC = () => {
    const { t } = useLocalization();
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);
    const steps = t.analyzingSteps;

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1;
                if (next >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return next;
            });
        }, 80);

        const stepInterval = setInterval(() => {
            setStep(prev => (prev + 1) % steps.length);
        }, 2500);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, [steps.length]);

    return (
        <div className="w-full max-w-md text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.analyzing}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 h-6 transition-opacity duration-300">{steps[step]}</p>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};