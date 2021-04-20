import i18n, { Resource } from "i18next"
import { initReactI18next } from "react-i18next"
import translationEN from "./assets/languages/english/translation.json"
import translationNO from "./assets/languages/norwegian/translation.json"

const resources: Resource = {
    en: {
        translation: translationEN,
    },
    no: {
        translation: translationNO,
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: "no",
    fallbackLng: "en",
})

// eslint-disable-next-line import/no-default-export
export default i18n
