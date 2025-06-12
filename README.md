# 🎧 Interactive Audio Storybook

> **An immersive interactive audio storytelling experience with liquid glass design**

A modern, accessible audio storybook application built with React, TypeScript, and cutting-edge web technologies. Features voice synthesis, speech recognition, and a beautiful glassmorphism UI design.

![Audio Storybook](https://img.shields.io/badge/Status-Active-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19.x-61dafb)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff)

## ✨ Features

### 🎯 Core Functionality

- **Interactive Storytelling**: Navigate through branching story paths with meaningful choices
- **Audio Narration**: Text-to-speech synthesis with customizable voices and settings
- **Voice Control**: Speech-to-text recognition for hands-free navigation
- **Progress Tracking**: Save and resume your journey with detailed progress analytics
- **Multiple Endings**: Discover different story outcomes based on your choices

### 🎨 Design & UX

- **Liquid Glass Theme**: Modern glassmorphism design with dynamic animations
- **Dark/Light Mode**: Adaptive themes with smooth transitions
- **Responsive Layout**: Optimized for mobile, tablet, and desktop devices
- **Accessibility First**: Full keyboard navigation and screen reader support
- **Smooth Animations**: Framer Motion powered micro-interactions

### 🔧 Technical Features

- **Progressive Web App**: Offline-capable with service worker support
- **Type Safety**: Full TypeScript coverage with strict mode
- **State Management**: Zustand-powered reactive state with persistence
- **Error Boundaries**: Graceful error handling with user-friendly feedback
- **Performance Optimized**: Code splitting and lazy loading

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JeanEudes-dev/audio-storybook.git

# Navigate to project directory
cd audio-storybook

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/audio-storybook/` to begin your journey!

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 🎮 How to Use

### Navigation Methods

#### 🖱️ Mouse/Touch

- Click story choices to progress
- Use audio control buttons in the sidebar
- Access settings via the controls panel

#### ⌨️ Keyboard Shortcuts

- `Space` - Toggle audio playback
- `V` - Toggle voice listening
- `1-5` - Select choices by number
- `Ctrl+R` - Restart story
- `Esc` - Stop all audio activities
- `Ctrl+Shift+D` - Open debug panel (dev mode)

#### 🎤 Voice Commands

1. Click the microphone button or press `V`
2. Speak the keywords shown with each choice
3. The system will automatically select the best match

### Audio Settings

- **Voice Selection**: Choose from available system voices
- **Speed Control**: Adjust narration speed (0.5x - 2.0x)
- **Volume Control**: Fine-tune audio levels
- **Language**: Select speech recognition language

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── StoryViewer.tsx     # Main story display
│   ├── ChoiceSelector.tsx  # Interactive choice buttons
│   ├── AudioControls.tsx   # Audio settings panel
│   ├── ProgressTracker.tsx # Journey progress display
│   ├── AudioManager.tsx    # Audio logic coordinator
│   ├── LoadingScreen.tsx   # Loading state component
│   ├── ErrorBoundary.tsx   # Error handling wrapper
│   ├── HelpPanel.tsx       # Keyboard shortcuts help
│   └── DebugPanel.tsx      # Development debug tools
├── stores/              # State management
│   └── storyStore.ts       # Zustand store with persistence
├── utils/               # Utility functions
│   ├── tts.ts             # Text-to-speech manager
│   ├── stt.ts             # Speech-to-text manager
│   ├── storage.ts         # Local storage utilities
│   └── performance.ts     # Performance monitoring
├── hooks/               # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   ├── useResponsive.ts
│   └── useDevelopment.ts
├── types/               # TypeScript definitions
│   └── index.ts           # All type definitions
└── assets/              # Static assets
    └── story.json         # Story content and structure
```

## 🎨 Customization

### Adding New Stories

Edit `src/assets/story.json` to add your own interactive stories:

```json
{
  "title": "Your Story Title",
  "description": "Story description",
  "author": "Your Name",
  "startNode": "beginning",
  "nodes": {
    "beginning": {
      "id": "beginning",
      "title": "Chapter Title",
      "text": "Your story text here...",
      "choices": [
        {
          "id": "choice1",
          "text": "Choice description",
          "keywords": ["key", "words"],
          "nextNode": "next_scene",
          "consequence": "story_branch"
        }
      ],
      "atmosphere": {
        "mood": "mysterious",
        "lighting": "dim",
        "sounds": ["wind", "footsteps"]
      }
    }
  }
}
```

### Styling

The design system uses:

- **Tailwind CSS**: Utility-first styling
- **Custom Colors**: Glassmorphism color palette
- **Animations**: Framer Motion configurations
- **Responsive**: Mobile-first breakpoints

### Development Tools

In development mode, press `Ctrl+Shift+D` to access:

- Performance metrics and recommendations
- Local storage management and export
- System information and browser capabilities
- Component render tracking

## 🧪 Testing

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## 📱 Browser Support

- ✅ Chrome 80+ (Recommended for speech features)
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ Speech Recognition: Chrome/Edge recommended for best experience

## 🚀 Features in Detail

### Audio System

- **Web Speech API**: Native browser TTS/STT integration
- **Voice Customization**: Speed, volume, and voice selection
- **Fuzzy Matching**: Intelligent voice command recognition
- **Fallback Support**: Graceful degradation for unsupported browsers

### User Experience

- **Progressive Enhancement**: Works without JavaScript
- **Offline Support**: Service worker for offline functionality
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: WCAG compliant with screen reader support

### Performance

- **Lazy Loading**: Code splitting for faster initial load
- **Caching**: Intelligent caching strategies
- **Monitoring**: Built-in performance tracking
- **Optimization**: Bundle size and runtime performance optimized

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style (Prettier + ESLint)
- Add JSDoc comments for public APIs
- Test across different browsers
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jean-Eudes Assogba**

- GitHub: [@JeanEudes-dev](https://github.com/JeanEudes-dev)
- Email: [Your Email]

## 🙏 Acknowledgments

- **Web Speech API** for enabling voice interactions
- **Framer Motion** for beautiful animations
- **Tailwind CSS** for the design system
- **Zustand** for elegant state management
- **Vite** for exceptional developer experience
- **TypeScript** for type safety and better DX

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Story sharing and community features
- [ ] Advanced voice training
- [ ] AR/VR story experiences
- [ ] Collaborative storytelling
- [ ] Story analytics and insights

---

_Built with ❤️ using modern web technologies_

**Experience the future of interactive storytelling!** 🎧✨

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
