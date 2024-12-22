// ~/utils/speechRecognition.js

import Fuse from "fuse.js"; // If using ES modules and installed via npm

export function startSpeechRecognition(commands) {
  // Check for browser support
  const SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true; // Keep listening
  recognition.interimResults = false; // Only final results
  recognition.lang = "en-US"; // Set language

  recognition.onstart = () => {
    console.log("Speech recognition started.");
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended. Restarting...");
    recognition.start(); // Restart recognition if it ends
  };

  // Prepare commands for Fuse.js
  const commandList = Object.keys(commands).filter((cmd) => !cmd.includes("*"));
  const fuseOptions = {
    includeScore: true,
    threshold: 0.4, // Adjust based on desired sensitivity
  };
  const fuse = new Fuse(commandList, fuseOptions);

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .slice(event.resultIndex)
      .map((result) => result[0].transcript.trim().toLowerCase())
      .join(" ");

    console.log("Recognized:", transcript);

    // First, attempt exact and wildcard matches
    let commandExecuted = false;

    for (const [command, action] of Object.entries(commands)) {
      // Handle dynamic commands with wildcards (e.g., 'search *query')
      if (command.includes("*")) {
        const [prefix] = command.split(" ");
        if (transcript.startsWith(prefix)) {
          const query = transcript.replace(prefix, "").trim();
          if (query.length > 0) {
            action(query);
            commandExecuted = true;
            break;
          }
        }
      } else {
        if (transcript === command) {
          action();
          commandExecuted = true;
          break;
        }
      }
    }

    if (!commandExecuted) {
      // If no exact or wildcard match found, perform fuzzy matching
      const fuzzyResult = fuse.search(transcript);
      if (
        fuzzyResult.length > 0 &&
        fuzzyResult[0].score < fuseOptions.threshold
      ) {
        const matchedCommand = fuzzyResult[0].item;
        const action = commands[matchedCommand];
        action();
        console.log(`Fuzzy matched to: ${matchedCommand}`);
      } else {
        console.log("No matching command found.");
      }
    }
  };

  recognition.start();

  // Optional: Return the recognition instance if you need to control it elsewhere
  return recognition;
}
