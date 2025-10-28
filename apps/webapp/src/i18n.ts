import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', templates: 'Templates', docs: 'Docs' },
      header: { language: 'Language', user: 'Account' },
    },
  },
  es: {
    translation: {
      nav: { home: 'Inicio', templates: 'Plantillas', docs: 'Docs' },
      header: { language: 'Idioma', user: 'Cuenta' },
    },
  },
  zh: {
    translation: {
      nav: { home: '首页', templates: '模板', docs: '文档' },
      header: { language: '语言', user: '账户' },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;