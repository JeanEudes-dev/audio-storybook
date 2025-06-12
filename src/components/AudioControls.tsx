import React from "react";
import { motion } from "framer-motion";
import { Settings, Volume2, Mic, Moon, Sun, RotateCcw } from "lucide-react";
import { useStoryStore } from "../stores/storyStore";

export const AudioControls: React.FC = () => {
  const {
    preferences,
    availableVoices,
    selectedVoice,
    isDarkMode,
    isPlaying,
    isListening,
    updatePreferences,
    setSelectedVoice,
    toggleDarkMode,
    resetStory,
  } = useStoryStore();

  const handleVoiceChange = (voiceURI: string) => {
    const voice = availableVoices.find((v) => v.voiceURI === voiceURI);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  const handleSpeedChange = (speed: number) => {
    updatePreferences({ ttsSpeed: speed });
  };

  const handleVolumeChange = (volume: number) => {
    updatePreferences({ ttsVolume: volume });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="github-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings
            className="h-5 w-5"
            style={{ color: "var(--color-accent-emphasis)" }}
          />
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-fg-default)" }}
          >
            Audio Controls
          </h3>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="github-btn p-2"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.button>

          {/* Reset story */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetStory}
            className="github-btn p-2"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Controls grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TTS Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Volume2
              className="h-4 w-4"
              style={{ color: "var(--color-accent-emphasis)" }}
            />
            <span
              className="font-medium"
              style={{ color: "var(--color-fg-default)" }}
            >
              Text-to-Speech
            </span>
          </div>

          {/* Voice selection */}
          <div>
            <label className="block text-sm font-medium github-text-muted mb-2">
              Voice
            </label>
            <select
              value={selectedVoice?.voiceURI || ""}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="github-input"
            >
              <option value="">Default Voice</option>
              {availableVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed control */}
          <div>
            <label className="block text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
              Speed: {preferences.ttsSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={preferences.ttsSpeed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-primary-200 dark:bg-primary-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Volume control */}
          <div>
            <label className="block text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
              Volume: {Math.round(preferences.ttsVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.ttsVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-primary-200 dark:bg-primary-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* STT Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Mic className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
            <span className="font-medium text-primary-700 dark:text-primary-300">
              Speech Recognition
            </span>
          </div>

          {/* STT Status */}
          <div className="p-3 bg-primary-50 dark:bg-primary-800 rounded-md border border-primary-200 dark:border-primary-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                Status
              </span>
              <div
                className={`w-2 h-2 rounded-full ${
                  isListening
                    ? "bg-accent-danger animate-pulse"
                    : "bg-primary-400"
                }`}
              />
            </div>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              {isListening
                ? "Listening for voice commands..."
                : "Voice recognition inactive"}
            </p>
          </div>

          {/* Language selection */}
          <div>
            <label className="block text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
              Language
            </label>
            <select
              value={preferences.sttLanguage}
              onChange={(e) =>
                updatePreferences({ sttLanguage: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-600 rounded-md text-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-primary-900 dark:text-white"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr-FR">French</option>
              <option value="es-ES">Spanish</option>
              <option value="de-DE">German</option>
            </select>
          </div>

          {/* Continuous listening toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Continuous Listening
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                updatePreferences({
                  sttContinuous: !preferences.sttContinuous,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                preferences.sttContinuous
                  ? "bg-accent-primary"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{
                  x: preferences.sttContinuous ? 20 : 2,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-6 flex justify-center gap-4">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs ${
            isPlaying
              ? "bg-accent-primary/10 text-accent-primary"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500"
          }`}
        >
          <Volume2 className="h-3 w-3" />
          <span>{isPlaying ? "Audio Playing" : "Audio Stopped"}</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs ${
            isListening
              ? "bg-accent-danger/10 text-accent-danger"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500"
          }`}
        >
          <Mic className="h-3 w-3" />
          <span>{isListening ? "Listening" : "Not Listening"}</span>
        </div>
      </div>
    </motion.div>
  );
};
