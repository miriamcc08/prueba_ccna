import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language } from '@shared/types';
import enTranslations from './en.json';
import esTranslations from './es.json';

type TranslationDictionary = typeof enTranslations;

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const STORAGE_KEY = 'ccna_simulator_language';

const dictionaries: Record<Language, any> = {
  en: enTranslations,
  es: esTranslations,
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'es') {
        return saved;
      }
      const browserLang = navigator.language?.slice(0, 2);
      return browserLang === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let result: any = dictionaries[language];

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          // Fallback to English
          let fallback: any = dictionaries.en;
          for (const fbKey of keys) {
            if (fallback && typeof fallback === 'object' && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              fallback = undefined;
              break;
            }
          }
          result = fallback ?? key;
          break;
        }
      }

      if (typeof result !== 'string') {
        return key;
      }

      if (params) {
        let interpolated = result;
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          interpolated = interpolated.replace(
            new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'),
            String(paramVal)
          );
        });
        return interpolated;
      }

      return result;
    };
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default useTranslation;
