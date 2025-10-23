
export type Genre = {
    genre: string;
    probability: number;
};

export interface AnalysisResult {
    file: {
        name: string;
        size: number; // in bytes
    };
    top3: Genre[];
}

export interface HistoryItem {
    id: string;
    fileName: string;
    result: AnalysisResult;
    timestamp: string;
}

export type Locale = 'en' | 'ko';
