import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'pathe'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: ['@nuxt/content'],
  content: {
    sources: [
      {
        name: 'dev-to',
        prefix: '/blog',
        contentUrl: '/blog',
        ttl: 600,
        articlesSize: 10000,
        organization: 'vue-storefront',
        driver: resolve('drivers', 'devTo', 'driver.mjs'),
      },
    ],
  },
})
