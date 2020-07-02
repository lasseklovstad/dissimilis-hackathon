import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

// not like to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

const resources : any = {
    en : {
    },
    no : {
    },
};

i18n
  //.use(Backend)
  //.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "no",
    fallbackLng: 'en'
  });


export default i18n;