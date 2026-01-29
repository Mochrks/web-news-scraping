'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

type Translations = {
    [key in Language]: {
        [key: string]: string;
    };
};

const translations: Translations = {
    en: {
        'nav.world': 'World',
        'nav.business': 'Business',
        'nav.tech': 'Tech',
        'nav.science': 'Science',
        'nav.culture': 'Culture',
        'nav.subscribe': 'Subscribe',
        'search.placeholder': 'Search news... (Ctrl + K)',
        'theme.toggle': 'Toggle theme',
        'lang.toggle': 'ID',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.cookies': 'Cookie Settings',
        'hero.readMore': 'Read Full Story',
        'latest.title': 'Latest Reports',
        'weather.title': 'Weather',
    },
    id: {
        'nav.world': 'Dunia',
        'nav.business': 'Bisnis',
        'nav.tech': 'Teknologi',
        'nav.science': 'Sains',
        'nav.culture': 'Budaya',
        'nav.subscribe': 'Langganan',
        'search.placeholder': 'Cari berita... (Ctrl + K)',
        'theme.toggle': 'Ganti tema',
        'lang.toggle': 'EN',
        'footer.privacy': 'Kebijakan Privasi',
        'footer.terms': 'Syarat Ketentuan',
        'footer.cookies': 'Pengaturan Cookie',
        'hero.readMore': 'Baca Selengkapnya',
        'latest.title': 'Berita Terbaru',
        'weather.title': 'Cuaca',
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Load language from local storage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
