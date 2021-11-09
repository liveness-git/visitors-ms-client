import i18n from 'i18next';
import enTranslation from './_locales/en/translation.json';
import jaTranslation from './_locales/ja/translation.json';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: enTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

i18n.use(initReactI18next).init({
  lng: 'ja',
  fallbackLng: 'ja',
  interpolation: {
    escapeValue: false,
  },
  react: {
    wait: true,
  },
  resources: resources,
});

export default i18n;
