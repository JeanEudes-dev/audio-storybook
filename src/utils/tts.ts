/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TTSOptions } from "../types";

/**
 * Text-to-Speech utility class with advanced features
 * Provides a clean interface for speech synthesis with error handling
 */
export class TTSManager {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initialize();
  }

  /**
   * Initialize the TTS manager and load available voices
   */
  private async initialize(): Promise<void> {
    try {
      await this.loadVoices();
    } catch (error) {
      console.error("Failed to initialize TTS:", error);
    }
  }

  /**
   * Load available voices with retry mechanism
   */
  private loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const loadVoicesWithRetry = (attempts = 0) => {
        const voices = this.synthesis.getVoices();

        if (voices.length > 0) {
          this.availableVoices = voices;
          resolve(voices);
        } else if (attempts < 10) {
          // Some browsers load voices asynchronously
          setTimeout(() => loadVoicesWithRetry(attempts + 1), 100);
        } else {
          // Fallback: return empty array if no voices found
          this.availableVoices = [];
          resolve([]);
        }
      };

      // Listen for voices changed event
      this.synthesis.onvoiceschanged = () => {
        const voices = this.synthesis.getVoices();
        if (voices.length > 0) {
          this.availableVoices = voices;
          resolve(voices);
        }
      };

      // Start loading immediately
      loadVoicesWithRetry();
    });
  }

  /**
   * Get all available voices
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  /**
   * Get voices filtered by language
   */
  public getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.availableVoices.filter((voice) =>
      voice.lang.toLowerCase().startsWith(language.toLowerCase()),
    );
  }

  /**
   * Find the best voice for the given preferences
   */
  public findBestVoice(preferences?: {
    language?: string;
    gender?: "male" | "female";
    name?: string;
  }): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) return null;

    let candidates = this.availableVoices;

    // Filter by language
    if (preferences?.language) {
      const languageVoices = this.getVoicesByLanguage(preferences.language);
      if (languageVoices.length > 0) {
        candidates = languageVoices;
      }
    }

    // Filter by name
    if (preferences?.name) {
      const nameMatch = candidates.find((voice) =>
        voice.name.toLowerCase().includes(preferences.name!.toLowerCase()),
      );
      if (nameMatch) return nameMatch;
    }

    // Filter by gender (heuristic based on common name patterns)
    if (preferences?.gender) {
      const genderVoices = candidates.filter((voice) => {
        const name = voice.name.toLowerCase();
        if (preferences.gender === "female") {
          return (
            name.includes("female") ||
            name.includes("woman") ||
            name.includes("alice") ||
            name.includes("samantha") ||
            name.includes("victoria") ||
            name.includes("karen")
          );
        } else {
          return (
            name.includes("male") ||
            name.includes("man") ||
            name.includes("alex") ||
            name.includes("daniel") ||
            name.includes("tom") ||
            name.includes("fred")
          );
        }
      });

      if (genderVoices.length > 0) {
        candidates = genderVoices;
      }
    }

    // Prefer local voices over remote ones
    const localVoices = candidates.filter((voice) => voice.localService);
    if (localVoices.length > 0) {
      return localVoices[0];
    }

    return candidates[0] || null;
  }

  /**
   * Speak text with the given options
   */
  public async speak(
    options: TTSOptions & {
      voice?: SpeechSynthesisVoice;
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: any) => void;
    },
  ): Promise<void> {
    // Ensure voices are loaded before proceeding
    if (this.availableVoices.length === 0) {
      console.log("Loading voices...");
      await this.loadVoices();
    }

    return new Promise((resolve, reject) => {
      try {
        // Stop any current speech
        this.stop();

        const utterance = new SpeechSynthesisUtterance(options.text);

        // Set voice safely with fallback
        try {
          if (options.voice && options.voice.voiceURI) {
            // Validate that the voice is still available
            const availableVoices = this.synthesis.getVoices();
            const validVoice = availableVoices.find(
              (v) => v.voiceURI === options.voice!.voiceURI,
            );
            if (validVoice) {
              utterance.voice = validVoice;
            }
          } else {
            const bestVoice = this.findBestVoice({ language: "en-US" });
            if (bestVoice) {
              utterance.voice = bestVoice;
            }
          }
        } catch (voiceError) {
          console.warn(
            "Error setting voice, using system default:",
            voiceError,
          );
          // Continue without setting a specific voice
        }

        // Set speech parameters
        utterance.rate = options.rate ?? 0.9;
        utterance.pitch = options.pitch ?? 1.0;
        utterance.volume = options.volume ?? 0.8;

        // Set event handlers
        utterance.onstart = () => {
          options.onStart?.();
        };

        utterance.onend = () => {
          this.currentUtterance = null;
          options.onEnd?.();
          resolve();
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event.error);
          this.currentUtterance = null;

          // Handle specific error types
          let errorMessage = `Speech synthesis error: ${event.error}`;
          if (event.error === "not-allowed") {
            errorMessage =
              "Speech synthesis blocked by browser. Please click the play button to enable audio.";
          } else if (event.error === "network") {
            errorMessage =
              "Network error during speech synthesis. Please check your connection.";
          }

          const error = new Error(errorMessage);
          options.onError?.(error);
          reject(error);
        };

        // Store current utterance for cancellation
        this.currentUtterance = utterance;

        // Start speaking
        this.synthesis.speak(utterance);
      } catch (error) {
        console.error("TTS speak method error:", error);
        const speechError =
          error instanceof Error ? error : new Error("Unknown speech error");
        options.onError?.(speechError);
        reject(speechError);
      }
    });
  }

  /**
   * Pause current speech
   */
  public pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  public resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Stop current speech
   */
  public stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Check if currently speaking
   */
  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  /**
   * Check if speech is paused
   */
  public isPaused(): boolean {
    return this.synthesis.paused;
  }

  /**
   * Get current utterance
   */
  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  /**
   * Check if TTS is supported
   */
  public static isSupported(): boolean {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  /**
   * Check if TTS requires user interaction to start
   */
  public requiresUserInteraction(): boolean {
    // Some browsers require user interaction before allowing speech
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  /**
   * Check if TTS is available and ready to use
   */
  public isAvailable(): boolean {
    return !!(window.speechSynthesis && !this.synthesis.speaking);
  }

  /**
   * Test speech synthesis with user interaction
   */
  public async testWithUserInteraction(): Promise<boolean> {
    try {
      const testUtterance = new SpeechSynthesisUtterance("");
      testUtterance.volume = 0;
      this.synthesis.speak(testUtterance);
      this.synthesis.cancel();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if user gesture is required for TTS
   */
  public async testSpeechAvailability(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const testUtterance = new SpeechSynthesisUtterance("");
        testUtterance.volume = 0;

        testUtterance.onstart = () => {
          this.synthesis.cancel();
          resolve(true);
        };

        testUtterance.onerror = (event) => {
          resolve(event.error !== "not-allowed");
        };

        this.synthesis.speak(testUtterance);

        // Timeout fallback
        setTimeout(() => resolve(false), 1000);
      } catch {
        resolve(false);
      }
    });
  }
}

// Create a singleton instance
export const ttsManager = new TTSManager();

// Export utility functions
export const speakText = (
  text: string,
  options?: Partial<TTSOptions>,
): Promise<void> => {
  return ttsManager.speak({
    text,
    ...options,
  });
};

export const stopSpeaking = (): void => {
  ttsManager.stop();
};

export const pauseSpeaking = (): void => {
  ttsManager.pause();
};

export const resumeSpeaking = (): void => {
  ttsManager.resume();
};

export const isSpeaking = (): boolean => {
  return ttsManager.isSpeaking();
};

export const isPaused = (): boolean => {
  return ttsManager.isPaused();
};

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  return ttsManager.getAvailableVoices();
};

export const findBestVoice = (preferences?: {
  language?: string;
  gender?: "male" | "female";
  name?: string;
}): SpeechSynthesisVoice | null => {
  return ttsManager.findBestVoice(preferences);
};

export const isTTSSupported = (): boolean => {
  return TTSManager.isSupported();
};
