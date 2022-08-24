import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import ru from '../locales/ru.json'
import uk from '../locales/uk.json'

export default defineNuxtPlugin(({ vueApp }) => {
    const now = useCookie('lang')
    const i18n = createI18n({
        legacy: true,
        globalInjection: true,
        fallbackLocale: 'uk',
        locale: now.value || 'uk',
        messages: {
            ru,
            en,
            uk
        }
    })

    vueApp.use(i18n)
})
