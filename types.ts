
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

export interface CommunityEntry {
    id: string;
    title: string;
    composer: string;
    genre1: string;
    genre2?: string;
    genre3?: string;
}
