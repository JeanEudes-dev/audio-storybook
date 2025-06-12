import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Story,
  StoryNode,
  StoryChoice,
  GameProgress,
  UserPreferences,
  AppError,
} from "../types";

interface StoryState {
  // Story data
  story: Story | null;
  currentNode: StoryNode | null;

  // Game progress
  progress: GameProgress | null;

  // User preferences
  preferences: UserPreferences;

  // UI state
  isLoading: boolean;
  isPlaying: boolean;
  isListening: boolean;
  errors: AppError[];

  // TTS state
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;

  // STT state
  transcript: string;
  confidence: number;

  // Theme state
  isDarkMode: boolean;

  // Actions
  setStory: (story: Story) => void;
  setCurrentNode: (nodeId: string) => void;
  makeChoice: (choice: StoryChoice) => void;
  updateProgress: (progress: Partial<GameProgress>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (loading: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setListening: (listening: boolean) => void;
  addError: (error: AppError) => void;
  clearErrors: () => void;
  setAvailableVoices: (voices: SpeechSynthesisVoice[]) => void;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  setTranscript: (transcript: string, confidence: number) => void;
  toggleDarkMode: () => void;
  restartStory: () => void;
  resetStory: () => void;
  saveProgress: () => void;
  loadProgress: (progress: GameProgress) => void;
  initializeAudio: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  voiceEnabled: true,
  speechRecognitionEnabled: true,
  volume: 0.8,
  autoPlay: true,
  darkMode: true,
  reducedMotion: false,
  fontSize: "medium",
  ttsSpeed: 1.0,
  ttsVolume: 0.8,
  sttLanguage: "en-US",
  sttContinuous: false,
};

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      // Initial state
      story: null,
      currentNode: null,
      progress: null,
      preferences: defaultPreferences,
      isLoading: false,
      isPlaying: false,
      isListening: false,
      errors: [],
      availableVoices: [],
      selectedVoice: null,
      transcript: "",
      confidence: 0,
      isDarkMode: true,

      // Actions
      setStory: (story: Story) => {
        set({ story });

        // Initialize progress if not exists
        const { progress } = get();
        if (!progress) {
          const initialProgress: GameProgress = {
            currentNodeId: story.startNode,
            visitedNodes: [story.startNode],
            choiceHistory: [],
            consequences: [],
            startTime: Date.now(),
            lastSaveTime: Date.now(),
            totalPlayTime: 0,
            choicesMade: [],
            voiceCommandsUsed: 0,
          };
          set({ progress: initialProgress });
        }

        // Set initial node
        get().setCurrentNode(story.startNode);
      },

      setCurrentNode: (nodeId: string) => {
        const { story, progress } = get();
        if (!story || !progress) return;

        const node = story.nodes[nodeId];
        if (!node) {
          get().addError({
            type: "STORY_ERROR",
            message: `Node ${nodeId} not found`,
            timestamp: Date.now(),
          });
          return;
        }

        set({ currentNode: node });

        // Update progress
        const updatedProgress: GameProgress = {
          ...progress,
          currentNodeId: nodeId,
          visitedNodes: progress.visitedNodes.includes(nodeId)
            ? progress.visitedNodes
            : [...progress.visitedNodes, nodeId],
          lastSaveTime: Date.now(),
        };

        set({ progress: updatedProgress });
      },

      makeChoice: (choice: StoryChoice) => {
        const { progress, story } = get();
        if (!progress || !story) return;

        // Update choice history
        const choiceEntry = {
          nodeId: progress.currentNodeId,
          choiceId: choice.id,
          timestamp: Date.now(),
        };

        const updatedProgress: GameProgress = {
          ...progress,
          choiceHistory: [...progress.choiceHistory, choiceEntry],
          consequences: [...progress.consequences, choice.consequence],
        };

        set({ progress: updatedProgress });

        // Navigate to next node
        get().setCurrentNode(choice.nextNode);

        // Auto-save progress
        get().saveProgress();
      },

      updateProgress: (partialProgress: Partial<GameProgress>) => {
        const { progress } = get();
        if (!progress) return;

        set({
          progress: {
            ...progress,
            ...partialProgress,
            lastSaveTime: Date.now(),
          },
        });
      },

      updatePreferences: (partialPreferences: Partial<UserPreferences>) => {
        const { preferences } = get();
        set({
          preferences: {
            ...preferences,
            ...partialPreferences,
          },
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setPlaying: (playing: boolean) => set({ isPlaying: playing }),
      setListening: (listening: boolean) => set({ isListening: listening }),

      addError: (error: AppError) => {
        const { errors } = get();
        set({ errors: [...errors, error] });

        // Auto-remove error after 5 seconds
        setTimeout(() => {
          const currentErrors = get().errors;
          set({
            errors: currentErrors.filter(
              (e) => e.timestamp !== error.timestamp,
            ),
          });
        }, 5000);
      },

      clearErrors: () => set({ errors: [] }),

      setAvailableVoices: (voices: SpeechSynthesisVoice[]) => {
        set({ availableVoices: voices });

        // Auto-select first available voice if none selected
        const { selectedVoice } = get();
        if (!selectedVoice && voices.length > 0) {
          // Prefer English voices
          const englishVoice = voices.find((voice) =>
            voice.lang.startsWith("en-"),
          );
          set({ selectedVoice: englishVoice || voices[0] });
        }
      },

      setSelectedVoice: (voice: SpeechSynthesisVoice | null) => {
        set({ selectedVoice: voice });
      },

      setTranscript: (transcript: string, confidence: number) => {
        set({ transcript, confidence });
      },

      toggleDarkMode: () => {
        const { preferences } = get();
        get().updatePreferences({ darkMode: !preferences.darkMode });
        set({ isDarkMode: !preferences.darkMode });
      },

      restartStory: () => {
        const { story } = get();
        if (!story) return;

        const newProgress: GameProgress = {
          currentNodeId: story.startNode,
          visitedNodes: [story.startNode],
          choiceHistory: [],
          consequences: [],
          startTime: Date.now(),
          lastSaveTime: Date.now(),
          totalPlayTime: 0,
          choicesMade: [],
          voiceCommandsUsed: 0,
        };

        set({
          progress: newProgress,
          currentNode: story.nodes[story.startNode],
          transcript: "",
          confidence: 0,
          errors: [],
        });
      },

      saveProgress: () => {
        const { progress } = get();
        if (!progress) return;

        // The persist middleware will automatically save to localStorage
        set({
          progress: {
            ...progress,
            lastSaveTime: Date.now(),
          },
        });
      },

      loadProgress: (loadedProgress: GameProgress) => {
        set({ progress: loadedProgress });
        get().setCurrentNode(loadedProgress.currentNodeId);
      },

      resetStory: () => {
        const { story } = get();
        if (!story) return;

        const newProgress: GameProgress = {
          currentNodeId: story.startNode,
          visitedNodes: [story.startNode],
          choiceHistory: [],
          consequences: [],
          startTime: Date.now(),
          lastSaveTime: Date.now(),
          totalPlayTime: 0,
          choicesMade: [],
          voiceCommandsUsed: 0,
        };

        set({
          progress: newProgress,
          currentNode: story.nodes[story.startNode],
          transcript: "",
          confidence: 0,
          errors: [],
        });
      },

      initializeAudio: async () => {
        try {
          // Initialize TTS voices
          const voices = speechSynthesis.getVoices();
          set({ availableVoices: voices });

          // Set default voice if none selected
          const { selectedVoice } = get();
          if (!selectedVoice && voices.length > 0) {
            const englishVoice =
              voices.find((v) => v.lang.startsWith("en")) || voices[0];
            set({ selectedVoice: englishVoice });
          }

          // Initialize speech recognition if available
          if (
            "SpeechRecognition" in window ||
            "webkitSpeechRecognition" in window
          ) {
            console.log("Speech recognition available");
          }
        } catch (error) {
          console.error("Failed to initialize audio:", error);
          get().addError({
            type: "TTS_ERROR",
            message: "Failed to initialize audio features",
            timestamp: Date.now(),
          });
        }
      },
    }),
    {
      name: "audio-storybook-store",
      partialize: (state) => ({
        progress: state.progress,
        preferences: state.preferences,
        selectedVoice: state.selectedVoice
          ? {
              name: state.selectedVoice.name,
              lang: state.selectedVoice.lang,
            }
          : null,
      }),
    },
  ),
);

// Selectors for better performance
export const useCurrentNode = () => useStoryStore((state) => state.currentNode);
export const useProgress = () => useStoryStore((state) => state.progress);
export const usePreferences = () => useStoryStore((state) => state.preferences);
export const useIsLoading = () => useStoryStore((state) => state.isLoading);
export const useIsPlaying = () => useStoryStore((state) => state.isPlaying);
export const useIsListening = () => useStoryStore((state) => state.isListening);
export const useErrors = () => useStoryStore((state) => state.errors);
export const useVoices = () =>
  useStoryStore((state) => ({
    available: state.availableVoices,
    selected: state.selectedVoice,
  }));
export const useTranscript = () =>
  useStoryStore((state) => ({
    text: state.transcript,
    confidence: state.confidence,
  }));
