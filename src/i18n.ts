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
import { exportViewEn } from "./assets/languages/english/exportViewEn";
import { exportViewNo } from "./assets/languages/norwegian/exportViewNo";
import { modalEn } from "./assets/languages/english/modalEn";
import { modalNo } from "./assets/languages/norwegian/modalNo"




const resources: Resource = {
  en: {
    DashboardView: dashboardEn,
    CreateSongTab: createSongTabEn,
    LoginView: loginEn,
    BottomBar: bottombarEn,
    MenuButton: menuButtonEn,
    BarContainer: barContainerEn,
    ExportView: exportViewEn,
    Modal: modalEn,
  },
  no: {
    DashboardView: dashboardNo,
    CreateSongTab: createSongTabNo,
    LoginView: loginNo,
    BottomBar: bottombarNo,
    MenuButton: menuButtonNo,
    BarContainer: barContainerNo,
    ExportView: exportViewNo,
    Modal: modalNo,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "no",
    fallbackLng: 'en'
  });


export default i18n;