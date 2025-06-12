# 🎧 Interactive Audio Storybook

> **An immersive interactive audio storytelling experience with professional GitHub-style design**

A modern, accessible audio storybook application built with React, TypeScript, and cutting-edge web technologies. Features voice synthesis, speech recognition, and a beautiful GitHub-inspired design system with both light and dark themes.

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

- **GitHub-Style Design**: Professional GitHub-inspired color palette and components
- **Dark/Light Mode**: Adaptive themes with smooth transitions using CSS variables
- **Responsive Layout**: Optimized for mobile, tablet, and desktop devices
- **Accessibility First**: Full keyboard navigation and screen reader support
- **Smooth Animations**: CSS-powered micro-interactions and state transitions

### 🔧 Technical Features

- **Progressive Web App**: Offline-capable with service worker support
- **Type Safety**: Full TypeScript coverage with strict mode
- **State Management**: Zustand-powered reactive state with persistence
- **Error Boundaries**: Graceful error handling with user-friendly feedback
- **Performance Optimized**: Code splitting and lazy loading
- **GitHub Actions**: Automated deployment to GitHub Pages
- **Bug-Free Audio**: Fixed infinite playback loops with proper state management

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

Visit `http://localhost:5173/` to begin your journey!

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Deploy to GitHub Pages (via GitHub Actions)
git push origin main
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
- `1-9` - Select choices by number
- `R` - Restart story
- `H` - Toggle help panel
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
│   ├── StoryLayout.tsx     # Main layout with GitHub styling
│   ├── StoryViewer.tsx     # Story display with audio controls
│   ├── ChoiceSelector.tsx  # Interactive choice buttons with voice
│   ├── AudioControls.tsx   # Audio settings panel
│   ├── ProgressTracker.tsx # Journey progress display
│   ├── AudioManager.tsx    # Audio logic coordinator (bug-fixed)
│   ├── LoadingScreen.tsx   # Loading state component
│   ├── ErrorBoundary.tsx   # Error handling wrapper
│   ├── HelpPanel.tsx       # Keyboard shortcuts help
│   └── DebugPanel.tsx      # Development debug tools
├── stores/              # State management
│   └── storyStore.ts       # Zustand store with persistence
├── utils/               # Utility functions
│   ├── tts.ts             # Text-to-speech manager (enhanced)
│   ├── stt.ts             # Speech-to-text manager (TS fixed)
│   ├── storage.ts         # Local storage utilities
│   └── performance.ts     # Performance monitoring
├── hooks/               # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   ├── useResponsive.ts
│   └── useDevelopment.ts
├── types/               # TypeScript definitions
│   └── index.ts           # All type definitions
└── assets/              # Static assets
    ├── react.svg          # React logo
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

- **CSS Variables**: GitHub-inspired color palette with dark/light mode support
- **Tailwind CSS**: Utility-first styling framework
- **GitHub Components**: Professional card, button, and form styling
- **Responsive Design**: Mobile-first breakpoints
- **CSS Animations**: Smooth transitions and micro-interactions

Key CSS classes:

- `github-card`: GitHub-style card containers
- `github-btn-primary`: Primary action buttons
- `github-btn-secondary`: Secondary action buttons
- `github-input`: Form input styling
- Color variables: `--color-canvas-default`, `--color-fg-default`, etc.

### Development Tools

In development mode, press `Ctrl+Shift+D` to access:

- Performance metrics and recommendations
- Local storage management and export
- System information and browser capabilities
- Component render tracking

## 🧪 Testing & Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality Features

- **TypeScript**: Strict type checking with zero `any` types
- **ESLint**: Comprehensive linting rules for React and TypeScript
- **Prettier**: Consistent code formatting
- **Build Validation**: All TypeScript errors must be resolved before build
- **Performance Monitoring**: Built-in performance tracking and optimization

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
- **Error Handling**: Graceful fallback for unsupported features
- **Bug-Free Playback**: Fixed infinite loop issues with proper state management

### User Experience

- **Progressive Enhancement**: Works without JavaScript
- **Offline Support**: Service worker for offline functionality
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: WCAG compliant with screen reader support
- **GitHub UI**: Professional, familiar interface design

### Performance & Deployment

- **Lazy Loading**: Code splitting for faster initial load
- **Optimized Bundle**: 387KB JS, 37KB CSS (gzipped: 119KB JS, 7KB CSS)
- **GitHub Actions**: Automated CI/CD pipeline
- **PWA Support**: Service worker and manifest for app-like experience
- **Monitoring**: Built-in performance tracking

## 🌐 Deployment

This project is set up for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. Push changes to the `main` branch
2. GitHub Actions automatically builds and deploys to `gh-pages` branch
3. Site becomes available at: `https://yourusername.github.io/audio-storybook/`

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy manually (if needed)
# The GitHub Actions workflow handles this automatically
```

### GitHub Actions Workflow

The project includes a `.github/workflows/deploy.yml` file that:

- Triggers on pushes to main branch
- Sets up Node.js environment
- Installs dependencies and builds the project
- Deploys to GitHub Pages with proper permissions

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

## 👨‍💻 Author & Copyright

**Jean-Eudes Assogba**

- GitHub: [@JeanEudes-dev](https://github.com/JeanEudes-dev)
- Portfolio: Professional Interactive Audio Storybook

© 2025 Jean-Eudes Assogba. This project showcases modern web development skills including React, TypeScript, state management, audio APIs, and professional UI design.

## 🙏 Acknowledgments

- **Web Speech API** for enabling voice interactions
- **React 19** for the modern component architecture
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for the utility-first design system
- **Zustand** for elegant and performant state management
- **Vite** for exceptional build tooling and developer experience
- **GitHub** for design inspiration and deployment platform
- **CSS Variables** for theme consistency and maintainability

## 🔮 Recent Updates & Roadmap

### ✅ Completed (v1.0)

- ✅ Fixed infinite audio playback loop bug
- ✅ Implemented GitHub-style design system
- ✅ Added CSS variables for theme consistency
- ✅ Enhanced TypeScript declarations for Speech API
- ✅ Improved TTS error handling and user feedback
- ✅ Added explicit play/stop audio controls
- ✅ Integrated GitHub Actions for automated deployment
- ✅ Optimized production build (387KB total)
- ✅ Added comprehensive keyboard shortcuts
- ✅ Professional portfolio-ready design

### 🚧 Future Roadmap

- [ ] Multi-language support for international users
- [ ] Story sharing and community features
- [ ] Advanced voice training and personalization
- [ ] AR/VR story experiences
- [ ] Collaborative storytelling features
- [ ] Story analytics and user insights
- [ ] Custom story creation tools
- [ ] Mobile app versions (React Native)

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
