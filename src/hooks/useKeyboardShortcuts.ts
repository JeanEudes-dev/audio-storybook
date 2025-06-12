import { useEffect, useCallback } from "react";
import { useStoryStore } from "../stores/storyStore";

/**
 * Hook for managing keyboard shortcuts and accessibility
 */
export const useKeyboardShortcuts = () => {
  const {
    currentNode,
    isPlaying,
    isListening,
    setPlaying,
    setListening,
    makeChoice,
    resetStory,
  } = useStoryStore();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ": // Spacebar - toggle audio playback
          event.preventDefault();
          setPlaying(!isPlaying);
          break;

        case "v": // V key - toggle voice listening
          event.preventDefault();
          setListening(!isListening);
          break;

        case "r": // R key - restart story
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetStory();
          }
          break;

        case "1":
        case "2":
        case "3":
        case "4":
        case "5": {
          // Number keys - select choices
          event.preventDefault();
          const choiceIndex = parseInt(event.key) - 1;
          if (currentNode?.choices && currentNode.choices[choiceIndex]) {
            makeChoice(currentNode.choices[choiceIndex]);
          }
          break;
        }

        case "escape": // Escape - stop all audio activities
          event.preventDefault();
          setPlaying(false);
          setListening(false);
          break;

        default:
          break;
      }
    },
    [
      currentNode,
      isPlaying,
      isListening,
      setPlaying,
      setListening,
      makeChoice,
      resetStory,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    // Return useful keyboard shortcut info for help displays
    shortcuts: [
      { key: "Space", description: "Toggle audio playback" },
      { key: "V", description: "Toggle voice listening" },
      { key: "Ctrl+R", description: "Restart story" },
      { key: "1-5", description: "Select choice by number" },
      { key: "Esc", description: "Stop all audio" },
    ],
  };
};
