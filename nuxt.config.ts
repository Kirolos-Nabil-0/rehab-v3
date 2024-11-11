import vuetify from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  ssr: false,
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500&display=swap",
        },
      ],
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@formkit/auto-animate/nuxt",
    "nuxt-api-party",
  ],
  apiParty: {
    server: {
      basePath: "https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/",
    },
    endpoints: {
      rehabAPi: {
        url: "https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/",
        headers: {
          Authorization: `Bearer`,
        },
      },
    },
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls: {},
      },
    },
  },
  devtools: { enabled: true },
  css: ["@/assets/styles/main.css"],
});
