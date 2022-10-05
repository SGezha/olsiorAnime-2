import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/strapi',
        '@vueuse/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode'
    ],
    strapi: {
        url: process.env.API,
        prefix: '/api',
        version: 'v4',
        cookie: {},
        cookieName: 'strapi_jwt'
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
        dataValue: 'theme',
        preference: 'system',
        fallback: 'dark'
    },
    app: {
        head: {
            htmlAttrs: {
                lang: 'ua'
            },
            title: 'Олсіор дивиться аніме',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
                { name: 'yandex-verification', content: '2c14acb80e12a24e' },
                { hid: 'Keywords', name: 'Keywords', content: 'Olsior, olsior, олсиор, Олсиор, смотрит, Смотрит, аниме, Аниме, Olsior смотрит аниме, Olsior записи аниме стримов, олсиор аниме записи, Anime, anime, наруто, блич, Naruto, bleach, Bleach, врата штейна, смотрит, аниме, записи стримов, стримы, Стримы олсиора, Записи олсиора, Olsior twitch, олсиор твитч, смотреть аниме с олсиором, смореть аниме' },
                { name: 'format-detection', content: 'telephone=no' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                // { rel: 'manifest', href: '/manifest.webmanifest' },
            ],
        },
    }
})
