// plugins/vuetify.js

import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VTimePicker } from "vuetify/labs/VTimePicker";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      VDateInput,
      VTimePicker,
    },
    directives,
    theme: {
      defaultTheme: "premiumAdminTheme",
      themes: {
        premiumAdminTheme: {
          dark: false, // Set to false if you want a light theme
          colors: {
            primary: "#C94F5D", // primary-color
            secondary: "#2B3151", // primary-color-text
            accent: "#5F7495", // description-color
            background: "#FFFFFF", // background-color
            surface: "#F0F0F0", // white-color as a surface
            descriptionGray: "#B0B0B0", // description-color-gray
            primaryAlternative: "#C94F5D", // primary-color2
            error: "#BF616A",
            info: "#81A1C1",
            success: "#A3BE8C",
            warning: "#EBCB8B",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
