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

const fallbackLng = (code?: string) => {
    if (!code) {
        return "en"
    }
    if (
        code.startsWith("no-") ||
        code.startsWith("nn") ||
        code.startsWith("no")
    ) {
        return "no"
    }
    if (code.startsWith("en-")) {
        return "en"
    }
    return "en"
}

i18n.use({
    type: "languageDetector",
    async: false,
    init: function () {},
    detect: function () {
        return localStorage.getItem("userLanguage") || navigator.language
    },
    cacheUserLanguage: function (lng: string) {
        localStorage.setItem("userLanguage", lng)
    },
})
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng,
    })

document.documentElement.lang = i18n.language

// eslint-disable-next-line import/no-default-export
export default i18n
