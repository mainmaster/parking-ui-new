import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// for passing in lng and translations on init

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: localStorage.getItem('language') ?? 'ru',
    interpolation: {
      escapeValue: false,
    },

  });


export default i18n;