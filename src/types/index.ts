// Core story types
export interface StoryChoice {
  id: string;
  text: string;
  keywords: string[];
  nextNode: string;
  consequence: string;
}

export interface AudioData {
  background: string;
  voice: string;
}

export interface Atmosphere {
  mood: string;
  lighting: string;
  sounds: string[];
}

export interface StoryNode {
  id: string;
  title: string;
  text: string;
  audioData: AudioData;
  choices: StoryChoice[];
  atmosphere: Atmosphere;
  isEnding?: boolean;
  endingType?: string;
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
}

export interface ChoiceSettings {
  timeoutMs: number;
  allowVoiceInput: boolean;
  fuzzyMatching: boolean;
}

export interface AtmosphereSettings {
  enableBackgroundSounds: boolean;
  soundVolume: number;
  enableVisualEffects: boolean;
}

export interface StorySettings {
  voiceSettings: VoiceSettings;
  choices: ChoiceSettings;
  atmosphere: AtmosphereSettings;
}

export interface Story {
  title: string;
  description: string;
  author: string;
  version: string;
  startNode: string;
  nodes: Record<string, StoryNode>;
  settings: StorySettings;
}

// Application state types
export interface GameProgress {
  currentNodeId: string;
  visitedNodes: string[];
  choiceHistory: Array<{
    nodeId: string;
    choiceId: string;
    timestamp: number;
  }>;
  consequences: string[];
  startTime: number;
  lastSaveTime: number;
  totalPlayTime: number;
  choicesMade: string[];
  voiceCommandsUsed: number;
}

export interface UserPreferences {
  voiceEnabled: boolean;
  speechRecognitionEnabled: boolean;
  selectedVoice?: string;
  volume: number;
  autoPlay: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
  fontSize: "small" | "medium" | "large";
  ttsSpeed: number;
  ttsVolume: number;
  sttLanguage: string;
  sttContinuous: boolean;
}

// TTS and STT types
export interface TTSOptions {
  text: string;
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface STTOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onResult?: (transcript: string, confidence: number) => void;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

// Component props types
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

export interface StoryDisplayProps {
  node: StoryNode;
  onChoiceSelect: (choice: StoryChoice) => void;
  isLoading?: boolean;
}

export interface ChoiceButtonProps {
  choice: StoryChoice;
  onSelect: (choice: StoryChoice) => void;
  isListening?: boolean;
  disabled?: boolean;
}

export interface TTSControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface STTControlsProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  transcript: string;
  confidence: number;
}

export interface ProgressIndicatorProps {
  visitedNodes: string[];
  totalNodes: number;
  currentNode: string;
}

// Error types
export interface AppError {
  type:
    | "TTS_ERROR"
    | "STT_ERROR"
    | "STORAGE_ERROR"
    | "STORY_ERROR"
    | "NETWORK_ERROR";
  message: string;
  details?: unknown;
  timestamp: number;
}

// Event types
export interface StoryEvent {
  type: "NODE_ENTERED" | "CHOICE_MADE" | "STORY_COMPLETED" | "PROGRESS_SAVED";
  data: unknown;
  timestamp: number;
}

// Storage types
export interface SavedGame {
  id: string;
  name: string;
  progress: GameProgress;
  preferences: UserPreferences;
  createdAt: number;
  updatedAt: number;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  glass: string;
  glassBorder: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  isDark: boolean;
}

// Animation types
export interface AnimationVariants {
  initial: object;
  animate: object;
  exit?: object;
  transition?: object;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Web API types
export interface BrowserCapabilities {
  speechSynthesis: boolean;
  speechRecognition: boolean;
  serviceWorker: boolean;
  indexedDB: boolean;
  localStorage: boolean;
  notifications: boolean;
  vibration: boolean;
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  userAgent: string;
  platform: string;
}
