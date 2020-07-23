import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loginNo } from './assets/languages/norwegian/loginNo';
import { loginEn } from './assets/languages/english/loginEn';
import { dashboardNo } from './assets/languages/norwegian/dashboardNo';
import { dashboardEn } from './assets/languages/english/dashboardEn';
import { createSongTabNo } from "./assets/languages/norwegian/createSongTabNo";
import { createSongTabEn } from "./assets/languages/english/createSongTabEn";
import { bottombarEn } from './assets/languages/english/bottombarEn';
import { bottombarNo } from './assets/languages/norwegian/bottombarNo';
import { menuButtonEn } from './assets/languages/english/menuButtonEn';
import { menuButtonNo } from './assets/languages/norwegian/menuButtonNo';
import { barContainerEn } from './assets/languages/english/barContainerEn';
import { barContainerNo } from './assets/languages/norwegian/barContainerNo';



// not like to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

const resources: Resource = {
  en: {
    DashboardView: dashboardEn,
    CreateSongTab: createSongTabEn,
    LoginView: loginEn,
    BottomBar: bottombarEn,
    MenuButton: menuButtonEn,
    BarContainer: barContainerEn,

  },
  no: {
    DashboardView: dashboardNo,
    CreateSongTab: createSongTabNo,
    LoginView: loginNo,
    BottomBar: bottombarNo,
    MenuButton: menuButtonNo,
    BarContainer: barContainerNo,

  },
}

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