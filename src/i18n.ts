import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import { dashboardNo } from './assets/languages/norwegian/dashboardNo';
import { dashboardEn } from './assets/languages/english/dashboardEn';

// not like to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

const resources : Resource = {
    en : {
        DashboardView: dashboardEn,
    },
    no : {
        DashboardView: dashboardNo,
    },
};

i18n
  //.use(Backend)
  //.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en ",
    fallbackLng: 'en'
  });


export default i18n;