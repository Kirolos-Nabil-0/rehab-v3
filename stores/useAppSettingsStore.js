// JavaScript
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppSettingsStore = defineStore("appSettings", () => {
  const isSpeechEnabled = ref(true);

  const toggleSpeech = () => {
    isSpeechEnabled.value = !isSpeechEnabled.value;
  };

  return {
    isSpeechEnabled,
    toggleSpeech,
  };
});
