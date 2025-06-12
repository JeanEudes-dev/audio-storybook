/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from "react";
import { useStoryStore } from "../stores/storyStore";
import { TTSManager } from "../utils/tts";
import { STTManager, findBestChoiceMatch } from "../utils/stt";

let ttsManager: TTSManager | null = null;
let sttManager: STTManager | null = null;

export const AudioManager: React.FC = () => {
  const {
    currentNode,
    preferences,
    selectedVoice,
    isPlaying,
    isListening,
    setPlaying,
    setListening,
    setTranscript,
    makeChoice,
    addError,
  } = useStoryStore();

  // Memoize store functions to prevent infinite loops
  const stableSetPlaying = useCallback(setPlaying, [setPlaying]);
  const stableSetListening = useCallback(setListening, [setListening]);
  const stableSetTranscript = useCallback(setTranscript, [setTranscript]);
  const stableMakeChoice = useCallback(makeChoice, [makeChoice]);
  const stableAddError = useCallback(addError, [addError]);

  // Initialize audio managers
  useEffect(() => {
    // Check if Web Speech API is available
    if (!window.speechSynthesis) {
      console.error("Speech Synthesis API not available in this browser");
      stableAddError({
        type: "TTS_ERROR",
        message: "Speech Synthesis not supported",
        details: new Error("Web Speech API not available"),
        timestamp: Date.now(),
      });
      return;
    }

    if (!ttsManager) {
      ttsManager = new TTSManager();
    }
    if (!sttManager) {
      sttManager = new STTManager();
    }
  }, [stableAddError]);

  // Handle TTS playback
  useEffect(() => {
    if (!ttsManager || !currentNode || !preferences.voiceEnabled) {
      return;
    }

    const handleTTS = async () => {
      if (isPlaying) {
        try {
          await ttsManager!.speak({
            text: currentNode.text,
            voice: selectedVoice || undefined,
            rate: preferences.ttsSpeed || 1.0,
            volume: preferences.ttsVolume || 0.8,
            pitch: 1.0,
            onStart: () => {
              console.log("TTS started successfully");
            },
            onEnd: () => {
              console.log("TTS ended");
              stableSetPlaying(false);
            },
            onError: (error: Error) => {
              console.error("TTS error:", error);
              stableSetPlaying(false);

              // Handle specific error types
              let errorMessage = "Failed to play audio";
              if (error.message.includes("not-allowed")) {
                errorMessage =
                  "Audio blocked by browser. Please click play to enable audio.";
              } else if (error.message.includes("network")) {
                errorMessage = "Network error during audio playback";
              }

              stableAddError({
                type: "TTS_ERROR",
                message: errorMessage,
                details: error,
                timestamp: Date.now(),
              });
            },
          });
        } catch (error) {
          console.error("TTS catch error:", error);
          stableSetPlaying(false);
          stableAddError({
            type: "TTS_ERROR",
            message: "TTS initialization failed",
            details: error,
            timestamp: Date.now(),
          });
        }
      } else {
        ttsManager?.stop();
      }
    };

    handleTTS();
  }, [
    isPlaying,
    currentNode?.id,
    currentNode?.text,
    selectedVoice?.voiceURI,
    preferences.voiceEnabled,
    preferences.ttsSpeed,
    preferences.ttsVolume,
    stableSetPlaying,
    stableAddError,
  ]);

  // Handle STT listening
  useEffect(() => {
    if (!sttManager || !currentNode || !preferences.speechRecognitionEnabled)
      return;

    const handleSTT = async () => {
      if (isListening) {
        try {
          await sttManager!.startListening({
            language: preferences.sttLanguage || "en-US",
            continuous: preferences.sttContinuous || false,
            onResult: (transcript, confidence) => {
              stableSetTranscript(transcript, confidence);

              // Try to match transcript with available choices
              if (currentNode.choices && transcript.trim()) {
                const matchResult = findBestChoiceMatch(
                  transcript,
                  currentNode.choices,
                );

                if (matchResult && matchResult.confidence > 0.5) {
                  const matchedChoice = currentNode.choices[matchResult.index];
                  stableMakeChoice(matchedChoice);
                  stableSetListening(false);
                }
              }
            },
            onError: (error) => {
              stableSetListening(false);
              stableAddError({
                type: "STT_ERROR",
                message: "Speech recognition failed",
                details: error,
                timestamp: Date.now(),
              });
            },
            onEnd: () => {
              stableSetListening(false);
            },
          });
        } catch (error) {
          stableSetListening(false);
          stableAddError({
            type: "STT_ERROR",
            message: "Failed to start speech recognition",
            details: error,
            timestamp: Date.now(),
          });
        }
      } else {
        sttManager!.stopListening();
      }
    };

    handleSTT();
  }, [
    isListening,
    currentNode?.id,
    currentNode?.choices,
    preferences.speechRecognitionEnabled,
    preferences.sttLanguage,
    preferences.sttContinuous,
    stableSetListening,
    stableSetTranscript,
    stableMakeChoice,
    stableAddError,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ttsManager) {
        ttsManager.stop();
      }
      if (sttManager) {
        sttManager.stopListening();
      }
    };
  }, []);

  // Auto-play if enabled - but only after user interaction
  useEffect(() => {
    const attemptAutoPlay = async () => {
      if (preferences.autoPlay && currentNode && !isPlaying && ttsManager) {
        // Check if TTS is available first
        const isAvailable = await ttsManager.testSpeechAvailability();
        if (isAvailable) {
          const timer = setTimeout(() => {
            stableSetPlaying(true);
          }, 500); // Small delay for better UX
          return () => clearTimeout(timer);
        } else {
          console.log(
            "TTS not available for autoplay - user interaction required",
          );
        }
      }
    };

    attemptAutoPlay();
  }, [currentNode, preferences.autoPlay, isPlaying, stableSetPlaying]);

  return null; // This component doesn't render anything
};
