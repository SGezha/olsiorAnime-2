import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/strapi',
        '@vueuse/nuxt',
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@nuxtjs/proxy'
    ],
    strapi: {
        url: process.env.API,
        prefix: '/api',
        version: 'v4',
        cookie: {},
        cookieName: 'strapi_jwt'
    },
    proxy: {
        'https://olsioradmin.smotrel.net/api': {
            target: 'http://localhost:1337',
            changeOrigin: true,
            pathRewrite: { '^https://olsioradmin.smotrel.net/api': '/' },
        }
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.API
        }
    },
    serverMiddleware: [
        { path: "/server-api", handler: "~/server-middleware/index.js" },
    ],
    colorMode: {
        dataValue: 'theme'
    },
    app: {
        head: {
            htmlAttrs: {
                lang: 'ru'
            },
            title: 'Олсиор смотрит аниме',
            meta: [
                { charset: 'utf-8' },
                { 'http-equiv': 'cache-control', content: 'max-age=31536000' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1"' },
                { name: 'yandex-verification', content: '9ef2af352f0e448e' },
                { hid: 'description', name: 'description', content: 'Сайт с записями стримов просмотра аниме Olsior\'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата.' },
                { property: 'og:description', hid: 'og:description', name: 'og:description', content: 'Сайт с записями стримов просмотра аниме Olsior\'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата.' },
                { property: 'og:title', hid: 'og:title', name: 'og:title', content: 'Олсиор смотрит аниме' },
                { property: 'og:url', hid: 'og:url', name: 'og:url', content: 'https://smotrel.net' },
                { property: 'og:image', hid: 'og:image', name: 'og:image', content: 'https://smotrel.net/site.jpg' },
                { hid: 'Keywords', name: 'Keywords', content: 'Olsior, olsior, олсиор, Олсиор, смотрит, Смотрит, аниме, Аниме, Olsior смотрит аниме, Olsior записи аниме стримов, олсиор аниме записи, Anime, anime, наруто, блич, Naruto, bleach, Bleach, врата штейна, смотрит, аниме, записи стримов, стримы, Стримы олсиора, Записи олсиора, Olsior twitch, олсиор твитч, смотреть аниме с олсиором, смореть аниме' },
                { name: 'format-detection', content: 'telephone=no' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
        },
    }
})
