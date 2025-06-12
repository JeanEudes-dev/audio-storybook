import React from "react";
import { motion } from "framer-motion";
import { Book, Play, Square, Volume2 } from "lucide-react";
import { useStoryStore } from "../stores/storyStore";

export const StoryViewer: React.FC = () => {
  const { currentNode, isPlaying, setPlaying } = useStoryStore();

  if (!currentNode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Book
            className="mx-auto h-12 w-12 mb-4"
            style={{ color: "var(--color-accent-emphasis)" }}
          />
          <p className="text-lg" style={{ color: "var(--color-fg-default)" }}>
            Loading your story...
          </p>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Professional container */}
      <div className="github-card p-8">
        {/* Content */}
        <div className="relative z-10">
          {/* Story title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: "var(--color-fg-default)" }}
          >
            {currentNode.title}
          </motion.h2>

          {/* Story text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg max-w-none mb-8"
          >
            <p
              className="leading-relaxed text-lg"
              style={{ color: "var(--color-fg-default)" }}
            >
              {currentNode.text}
            </p>
          </motion.div>

          {/* Audio controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-3"
          >
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="github-btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <Play className="h-5 w-5" />
                <span>Play Audio</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="github-btn-danger flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <Square className="h-5 w-5" />
                <span>Stop Audio</span>
              </button>
            )}

            {/* Audio indicator */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border"
                style={{
                  backgroundColor: "var(--color-success-subtle)",
                  borderColor: "var(--color-success-fg)",
                  color: "var(--color-success-fg)",
                }}
              >
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-medium">Playing...</span>
              </motion.div>
            )}
          </motion.div>

          {/* Atmosphere indicator */}
          {currentNode.atmosphere && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex justify-center"
            >
              <div
                className="px-4 py-2 rounded-xl border"
                style={{
                  backgroundColor: "var(--color-neutral-muted)",
                  borderColor: "var(--color-border-default)",
                  color: "var(--color-fg-muted)",
                }}
              >
                <span className="text-sm">
                  {currentNode.atmosphere.mood} •{" "}
                  {currentNode.atmosphere.lighting}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
