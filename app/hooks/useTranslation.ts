import { useCallback } from 'react';
import { en } from '../i18n/translations/en';
import { es } from '../i18n/translations/es';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;
type Locale = 'en' | 'es';

const translations: Record<Locale, Record<string, any>> = {
  en,
  es
};

export function useTranslation(locale: Locale = 'en') {
  const translate = useCallback((
    key: TranslationKey,
    params?: TranslationParams
  ) => {
    // Split the key by dots to access nested translations
    const keys = key.split('.');
    let translation = keys.reduce((obj, key) => obj?.[key], translations[locale]);

    // Fallback to English if translation not found
    if (!translation && locale !== 'en') {
      translation = keys.reduce((obj, key) => obj?.[key], translations['en']);
    }

    // If still no translation found, return the key
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(`{${key}}`, String(value)),
        translation
      );
    }

    return translation;
  }, [locale]);

  return { translate };
} 