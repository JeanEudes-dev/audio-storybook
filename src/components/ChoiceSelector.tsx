import React from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, ArrowRight } from "lucide-react";
import { useStoryStore } from "../stores/storyStore";
import type { StoryChoice } from "../types";

export const ChoiceSelector: React.FC = () => {
  const { currentNode, isListening, makeChoice, setListening } =
    useStoryStore();

  if (
    !currentNode ||
    !currentNode.choices ||
    currentNode.choices.length === 0
  ) {
    return null;
  }

  const handleChoiceClick = (choice: StoryChoice) => {
    makeChoice(choice);
  };

  const handleVoiceToggle = () => {
    setListening(!isListening);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Voice control toggle */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVoiceToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            isListening ? "github-btn-danger" : "github-btn"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              <span className="text-sm font-medium">Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span className="text-sm font-medium">Voice Control</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Voice listening indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-danger-subtle)",
              borderColor: "var(--color-danger-fg)",
              color: "var(--color-danger-fg)",
            }}
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: "var(--color-danger-fg)" }}
                />
              ))}
            </div>
            <span className="text-sm font-medium">Listening...</span>
          </div>
        </motion.div>
      )}

      {/* Choice buttons */}
      <div className="grid gap-4">
        {currentNode.choices.map((choice, index) => (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleChoiceClick(choice)}
            className="github-card group relative p-6 transition-all duration-200 hover:shadow-lg"
          >
            {/* Ripple effect on hover */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0"
                style={{ backgroundColor: "var(--color-accent-subtle)" }}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1 text-left">
                <p
                  className="font-medium leading-relaxed"
                  style={{ color: "var(--color-fg-default)" }}
                >
                  {choice.text}
                </p>

                {/* Keywords for voice recognition */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {choice.keywords.slice(0, 2).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 text-xs rounded-lg"
                      style={{
                        backgroundColor: "var(--color-accent-subtle)",
                        color: "var(--color-accent-fg)",
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Consequence hint */}
                {choice.consequence && (
                  <p
                    className="mt-2 text-sm italic"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    → {choice.consequence} path
                  </p>
                )}
              </div>

              {/* Arrow indicator */}
              <motion.div
                className="ml-4"
                style={{ color: "var(--color-accent-emphasis)" }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>

            {/* Choice number indicator */}
            <div className="absolute top-2 right-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-accent-subtle)" }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-accent-emphasis)" }}
                >
                  {index + 1}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Help text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-sm github-text-muted">
          Click a choice or use voice commands with the keywords shown
        </p>
      </motion.div>
    </motion.div>
  );
};
