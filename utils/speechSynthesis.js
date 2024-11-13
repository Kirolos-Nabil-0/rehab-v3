export function speak(text, options = {}) {
  if (!("speechSynthesis" in window)) {
    console.warn("Text-to-Speech is not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = options.lang || "en-US";
  utterance.pitch = options.pitch || 1;
  utterance.rate = options.rate || 1;
  utterance.volume = options.volume || 1;

  if (options.voice) {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        const selectedVoice = updatedVoices.find(
          (v) => v.name === options.voice
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        window.speechSynthesis.speak(utterance);
      };
      return;
    }
    const selectedVoice = voices.find((v) => v.name === options.voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}
