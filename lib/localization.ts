import React, { createContext, useState, useMemo, useContext } from 'react';
import type { Locale } from '../types';

type Translations = {
    [key: string]: string | string[] | ((count: number) => string) | { [key: string]: string };
};

const en: Translations = {
    // App header
    analyzer: 'Analyzer',
    community: 'Community',
    github: 'GitHub',
    help: 'Help',
    login: 'Login',
    loginComingSoon: 'Login functionality is coming soon!',

    // UploadScreen
    uploadTitle: 'Analyze Music Genre',
    uploadSubtitle: 'Upload an audio file to identify its genre using AI.',
    uploadButton: 'Choose a file',
    uploadConstraints: 'MP3, WAV, M4A, AAC, FLAC. Max 50MB, 10 min.',
    analysesLeft: (count) => `${count} ${count === 1 ? 'analysis' : 'analyses'} left today.`,
    errors: {
        FILE_TOO_LARGE: 'File is too large. Maximum size is 50MB.',
        UNSUPPORTED_FORMAT: 'Unsupported file format.',
        DAILY_LIMIT_REACHED: 'You have reached the daily analysis limit.'
    },

    // AnalyzingScreen
    analyzing: 'Analyzing...',
    analyzingSteps: [
        'Processing audio waveform...',
        'Extracting acoustic features...',
        'Feeding data to the neural network...',
        'Comparing patterns with genre models...',
        'Finalizing prediction...',
    ],

    // ResultScreen
    resultTitle: 'Analysis Complete',
    majorGenre: 'Major Genre',
    top3Genres: 'Top 3 Genres',
    analyzeAnother: 'Analyze Another File',
    copyResults: 'Copy',
    copied: 'Copied!',
    addToCommunity: 'Add to Community Board',

    // HistoryPanel
    historyTitle: 'History',
    historyEmpty: 'Your recent analyses will appear here.',

    // AddToCommunityModal
    addToCommunityTitle: 'Add to Community Board',
    addToCommunitySubtitle: 'Enter the track information to add it to the community board.',
    detectedGenres: 'Detected Genres',
    close: 'Close',

    // CommunityView
    communityTitle: 'Community Genre Board',
    communitySubtitle: 'See what music other users are adding to our database.',
    addEntryTitle: 'Add New Entry',
    musicTitle: 'Title',
    composer: 'Artist / Composer',
    genre1: '1st Genre',
    genre2: '2nd Genre',
    genre3: '3rd Genre',
    add: 'Add Entry',
    searchPlaceholder: 'Search by title, artist, or genre...',
    noResults: 'No results found.',
    genres: 'Genres',
};

const ko: Translations = {
    // App header
    analyzer: '분석기',
    community: '커뮤니티',
    github: 'GitHub',
    help: '도움말',
    login: '로그인',
    loginComingSoon: '로그인 기능은 곧 추가될 예정입니다!',

    // UploadScreen
    uploadTitle: '음악 장르 분석',
    uploadSubtitle: 'AI를 사용하여 장르를 식별할 오디오 파일을 업로드하세요.',
    uploadButton: '파일 선택',
    uploadConstraints: 'MP3, WAV, M4A, AAC, FLAC. 최대 50MB, 10분.',
    analysesLeft: (count) => `오늘 ${count}회 분석 가능합니다.`,
    errors: {
        FILE_TOO_LARGE: '파일이 너무 큽니다. 최대 크기는 50MB입니다.',
        UNSUPPORTED_FORMAT: '지원하지 않는 파일 형식입니다.',
        DAILY_LIMIT_REACHED: '일일 분석 한도에 도달했습니다.'
    },

    // AnalyzingScreen
    analyzing: '분석 중...',
    analyzingSteps: [
        '오디오 파형 처리 중...',
        '음향 특징 추출 중...',
        '신경망에 데이터 입력 중...',
        '장르 모델과 패턴 비교 중...',
        '예측 완료 중...',
    ],

    // ResultScreen
    resultTitle: '분석 완료',
    majorGenre: '주요 장르',
    top3Genres: '상위 3개 장르',
    analyzeAnother: '다른 파일 분석하기',
    copyResults: '복사',
    copied: '복사됨!',
    addToCommunity: '커뮤니티 보드에 추가',

    // HistoryPanel
    historyTitle: '기록',
    historyEmpty: '최근 분석 기록이 여기에 표시됩니다.',

    // AddToCommunityModal
    addToCommunityTitle: '커뮤니티 보드에 추가',
    addToCommunitySubtitle: '커뮤니티 보드에 추가할 트랙 정보를 입력하세요.',
    detectedGenres: '분석된 장르',
    close: '닫기',

    // CommunityView
    communityTitle: '커뮤니티 장르 보드',
    communitySubtitle: '다른 사용자들이 데이터베이스에 추가하는 음악을 확인하세요.',
    addEntryTitle: '새 항목 추가',
    musicTitle: '제목',
    composer: '아티스트 / 작곡가',
    genre1: '1순위 장르',
    genre2: '2순위 장르',
    genre3: '3순위 장르',
    add: '항목 추가',
    searchPlaceholder: '제목, 아티스트 또는 장르로 검색...',
    noResults: '검색 결과가 없습니다.',
    genres: '장르',
};

const translations = { en, ko };

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

export const LocalizationContext = createContext<LocalizationContextType>({
    locale: 'en',
    setLocale: () => {},
    t: en,
});

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>(() => {
        const browserLang = navigator.language.split('-')[0];
        return (browserLang === 'ko' ? 'ko' : 'en');
    });

    const t = useMemo(() => translations[locale], [locale]);

    // FIX: Replaced JSX with React.createElement to avoid syntax errors in a .ts file.
    return React.createElement(LocalizationContext.Provider, { value: { locale, setLocale, t } }, children);
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};