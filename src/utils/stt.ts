/* eslint-disable @typescript-eslint/no-explicit-any */
import type { STTOptions } from "../types";

// Declare Speech Recognition types for better TypeScript support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}

/**
 * Speech-to-Text utility class with fuzzy matching for choice selection
 * Provides voice control for story choices with intelligent matching
 */
export class STTManager {
  private recognition: any = null;
  private isInitialized = false;
  private isListening = false;
  private currentOptions: STTOptions | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the speech recognition
   */
  private initialize(): void {
    try {
      // Check for Speech Recognition API
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("Speech Recognition not supported");
        return;
      }

      this.recognition = new SpeechRecognition();
      this.setupRecognition();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize STT:", error);
    }
  }

  /**
   * Setup speech recognition with default settings
   */
  private setupRecognition(): void {
    if (!this.recognition) return;

    // Default settings
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = "en-US";

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.currentOptions?.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      this.handleResult(event);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const error = new Error(`Speech recognition error: ${event.error}`);
      this.currentOptions?.onError?.(error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.currentOptions?.onEnd?.();
    };
  }

  /**
   * Handle speech recognition results
   */
  private handleResult(event: any): void {
    if (!this.currentOptions?.onResult) return;

    let finalTranscript = "";
    let interimTranscript = "";
    let maxConfidence = 0;

    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.5;

      if (result.isFinal) {
        finalTranscript += transcript;
        maxConfidence = Math.max(maxConfidence, confidence);
      } else {
        interimTranscript += transcript;
      }
    }

    // Send the best transcript
    const bestTranscript = finalTranscript || interimTranscript;
    if (bestTranscript.trim()) {
      this.currentOptions.onResult(bestTranscript.trim(), maxConfidence);
    }
  }

  /**
   * Start listening for speech
   */
  public startListening(options: STTOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !this.recognition) {
        reject(new Error("Speech recognition not available"));
        return;
      }

      if (this.isListening) {
        reject(new Error("Already listening"));
        return;
      }

      // Store options for callbacks
      this.currentOptions = options;

      // Apply options to recognition
      if (options.language) {
        this.recognition.lang = options.language;
      }
      if (options.continuous !== undefined) {
        this.recognition.continuous = options.continuous;
      }
      if (options.interimResults !== undefined) {
        this.recognition.interimResults = options.interimResults;
      }
      if (options.maxAlternatives !== undefined) {
        this.recognition.maxAlternatives = options.maxAlternatives;
      }

      try {
        this.recognition.start();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop listening for speech
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Abort current recognition
   */
  public abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if STT is supported
   */
  public static isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Get supported languages (browser-specific)
   */
  public getSupportedLanguages(): string[] {
    // Common supported languages for speech recognition
    return [
      "en-US",
      "en-GB",
      "en-AU",
      "en-CA",
      "en-IN",
      "es-ES",
      "es-MX",
      "fr-FR",
      "de-DE",
      "it-IT",
      "pt-BR",
      "ru-RU",
      "ja-JP",
      "ko-KR",
      "zh-CN",
      "zh-TW",
      "ar-SA",
      "hi-IN",
      "th-TH",
      "sv-SE",
      "no-NO",
      "da-DK",
      "fi-FI",
      "pl-PL",
      "tr-TR",
    ];
  }
}

/**
 * Fuzzy string matching utility for choice selection
 */
export class FuzzyMatcher {
  /**
   * Calculate similarity between two strings using Levenshtein distance
   */
  public static calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    if (s1 === s2) return 1;
    if (s1.length === 0 || s2.length === 0) return 0;

    const matrix = Array(s2.length + 1)
      .fill(null)
      .map(() => Array(s1.length + 1).fill(null));

    for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= s2.length; j++) {
      for (let i = 1; i <= s1.length; i++) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }

    const maxLength = Math.max(s1.length, s2.length);
    return 1 - matrix[s2.length][s1.length] / maxLength;
  }

  /**
   * Find the best matching choice based on spoken text
   */
  public static findBestMatch(
    spokenText: string,
    choices: Array<{ text: string; keywords: string[] }>,
    threshold = 0.3,
  ): { index: number; confidence: number } | null {
    const spoken = spokenText.toLowerCase().trim();
    let bestMatch = { index: -1, confidence: 0 };

    choices.forEach((choice, index) => {
      // Check exact keyword matches first
      const keywordMatch = choice.keywords.some((keyword) =>
        spoken.includes(keyword.toLowerCase()),
      );

      if (keywordMatch) {
        bestMatch = { index, confidence: 0.9 };
        return;
      }

      // Check similarity with choice text
      const choiceText = choice.text.toLowerCase();
      const similarity = this.calculateSimilarity(spoken, choiceText);

      if (similarity > bestMatch.confidence) {
        bestMatch = { index, confidence: similarity };
      }

      // Check similarity with individual keywords
      choice.keywords.forEach((keyword) => {
        const keywordSimilarity = this.calculateSimilarity(
          spoken,
          keyword.toLowerCase(),
        );
        if (keywordSimilarity > bestMatch.confidence) {
          bestMatch = { index, confidence: keywordSimilarity };
        }
      });

      // Check if spoken text contains significant words from choice
      const choiceWords = choiceText
        .split(" ")
        .filter((word) => word.length > 3);
      const spokenWords = spoken.split(" ");
      const matchingWords = choiceWords.filter((word) =>
        spokenWords.some(
          (spokenWord) => this.calculateSimilarity(word, spokenWord) > 0.7,
        ),
      );

      if (matchingWords.length > 0) {
        const wordMatchConfidence = matchingWords.length / choiceWords.length;
        if (wordMatchConfidence > bestMatch.confidence) {
          bestMatch = { index, confidence: wordMatchConfidence };
        }
      }
    });

    return bestMatch.confidence >= threshold ? bestMatch : null;
  }

  /**
   * Extract intent from spoken text using common patterns
   */
  public static extractIntent(spokenText: string): {
    action: string;
    confidence: number;
  } {
    const text = spokenText.toLowerCase().trim();
    const patterns = {
      select: /^(choose|select|pick|take|go)\s+(.+)$/,
      navigate: /^(go\s+to|navigate\s+to|move\s+to)\s+(.+)$/,
      action: /^(i\s+want\s+to|i\s+choose\s+to|let\s+me)\s+(.+)$/,
      simple: /^(.+)$/,
    };

    for (const [action, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        return {
          action: match[2] || match[1],
          confidence: action === "simple" ? 0.5 : 0.8,
        };
      }
    }

    return { action: text, confidence: 0.3 };
  }
}

// Create singleton instance
export const sttManager = new STTManager();

// Export utility functions
export const startListening = (options?: STTOptions): Promise<void> => {
  return sttManager.startListening(options);
};

export const stopListening = (): void => {
  sttManager.stopListening();
};

export const isListening = (): boolean => {
  return sttManager.getIsListening();
};

export const isSTTSupported = (): boolean => {
  return STTManager.isSupported();
};

export const findBestChoiceMatch = (
  spokenText: string,
  choices: Array<{ text: string; keywords: string[] }>,
  threshold?: number,
): { index: number; confidence: number } | null => {
  return FuzzyMatcher.findBestMatch(spokenText, choices, threshold);
};

export const calculateTextSimilarity = (str1: string, str2: string): number => {
  return FuzzyMatcher.calculateSimilarity(str1, str2);
};

export const extractSpeechIntent = (
  spokenText: string,
): { action: string; confidence: number } => {
  return FuzzyMatcher.extractIntent(spokenText);
};
