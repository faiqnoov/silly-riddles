// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  runtimeConfig: {
    // Private keys are only available on the server
    someKey: '123',

    // Public keys that are exposed to the client
    public: {
      appName: process.env.APP_NAME || 'Riddles App',
      geminiKey: process.env.GEMINI_API_KEY || '',
      genAIModel: process.env.GEN_AI_MODEL || 'gemini-1.5-flash',
    }
  }
})