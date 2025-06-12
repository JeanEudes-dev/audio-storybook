import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { StoryViewer } from "./StoryViewer";
import { ChoiceSelector } from "./ChoiceSelector";
import { AudioControls } from "./AudioControls";
import { ProgressTracker } from "./ProgressTracker";
import { LoadingScreen } from "./LoadingScreen";
import { AudioManager } from "./AudioManager";
import { HelpPanel } from "./HelpPanel";
import { DebugPanel } from "./DebugPanel";
import { useStoryStore } from "../stores/storyStore";
import { useKeyboardShortcuts, useResponsive, useDevelopment } from "../hooks";
import { PerformanceMonitor } from "../utils/performance";
import type { Story } from "../types";
import storyData from "../assets/story.json";

export const StoryLayout: React.FC = () => {
  const {
    story,
    currentNode,
    isDarkMode,
    isLoading,
    setStory,
    setCurrentNode,
    setLoading,
    initializeAudio,
  } = useStoryStore();

  // Initialize hooks
  useKeyboardShortcuts();
  const { isMobile, isTablet } = useResponsive();
  const { showDebugPanel, setShowDebugPanel } = useDevelopment();

  useEffect(() => {
    // Initialize performance monitoring
    PerformanceMonitor.initialize();

    // Initialize the story
    const initializeStory = async () => {
      const endTiming = PerformanceMonitor.startTiming("story-initialization");
      setLoading(true);
      try {
        // Load story data
        setStory(storyData as Story);

        // Set starting node
        if (storyData.startNode) {
          setCurrentNode(storyData.startNode);
        }

        // Initialize audio systems
        await initializeAudio();
      } catch (error) {
        console.error("Failed to initialize story:", error);
      } finally {
        setLoading(false);
        endTiming();
      }
    };

    if (!story) {
      initializeStory();
    }

    // Cleanup on unmount
    return () => {
      PerformanceMonitor.cleanup();
    };
  }, [story, setStory, setCurrentNode, setLoading, initializeAudio]);

  // Show loading screen while initializing
  if (isLoading || !story || !currentNode) {
    return <LoadingScreen />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "dark" : ""
      }`}
      style={{ backgroundColor: "var(--color-canvas-subtle)" }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--color-accent-emphasis)" }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: "var(--color-success-fg)" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Audio Manager (invisible but handles all audio logic) */}
        <AudioManager />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50"
          style={{
            backgroundColor: "var(--color-canvas-default)",
            borderBottom: "1px solid var(--color-border-muted)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.h1
                className="text-2xl font-bold text-gradient"
                whileHover={{ scale: 1.05 }}
              >
                {story?.title || "Audio Storybook"}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm github-text-muted"
              >
                by {story?.author || "Jean-Eudes Assogba"}
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main layout */}
        <div className="container mx-auto px-4 py-8">
          <div
            className={`grid gap-8 ${
              isMobile
                ? "grid-cols-1"
                : isTablet
                  ? "grid-cols-1 lg:grid-cols-3"
                  : "grid-cols-1 lg:grid-cols-4"
            }`}
          >
            {/* Left sidebar - Controls */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${
                isMobile
                  ? "order-2"
                  : isTablet
                    ? "lg:col-span-1"
                    : "lg:col-span-1"
              } space-y-6`}
            >
              <AudioControls />
              {!isMobile && (
                <div className="hidden lg:block">
                  <ProgressTracker />
                </div>
              )}
            </motion.aside>

            {/* Main content area */}
            <main
              className={`${
                isMobile
                  ? "order-1"
                  : isTablet
                    ? "lg:col-span-2"
                    : "lg:col-span-3"
              } space-y-8`}
            >
              {/* Story viewer */}
              <StoryViewer />

              {/* Choice selector */}
              {currentNode && !currentNode.isEnding && <ChoiceSelector />}

              {/* Ending message */}
              {currentNode?.isEnding && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center p-8 backdrop-blur-md bg-glassWhite dark:bg-glassBlack rounded-4xl border border-glassBorder shadow-glass"
                >
                  <div className="text-6xl mb-4">
                    {currentNode.endingType === "good"
                      ? "🎉"
                      : currentNode.endingType === "bad"
                        ? "😔"
                        : "🌟"}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    The End
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Thank you for experiencing this journey!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentNode(story?.startNode || "")}
                    className="px-6 py-3 bg-accent-primary text-white rounded-xl hover:bg-accent-primary/90 transition-colors"
                  >
                    Start Over
                  </motion.button>
                </motion.div>
              )}

              {/* Mobile progress tracker */}
              {(isMobile || isTablet) && (
                <div className="order-3">
                  <ProgressTracker />
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Help Panel */}
        <HelpPanel />

        {/* Debug Panel (Development only) */}
        <DebugPanel
          isVisible={showDebugPanel}
          onClose={() => setShowDebugPanel(false)}
        />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-glassBorder bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interactive Audio Storybook • Powered by Web Speech API •
              <span className="ml-2 text-accent-primary">
                Liquid Glass Design
              </span>
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};
