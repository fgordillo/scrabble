import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import "./style.css"
import App from "./App.vue"
import router from "./routes"
import en from "./locales/en.json"
import es from "./locales/es.json"
import { usePreferredLanguages } from "@vueuse/core"

const preferredLanguages = usePreferredLanguages()

function getDefaultLocale() {
    const supportedLocales = ["en", "es"]
    for (const lang of preferredLanguages.value) {
        if (supportedLocales.includes(lang)) {
            return lang
        }
    }
    return "en"
}

const i18n = createI18n({
    locale: getDefaultLocale(),
    fallbackLocale: "en",
    messages: {
        en,
        es,
    },
})

createApp(App).use(router).use(i18n).mount("#app")
