import React from "react";
import { motion } from "framer-motion";
import { MapPin, Award, Clock, BookOpen } from "lucide-react";
import { useStoryStore } from "../stores/storyStore";

export const ProgressTracker: React.FC = () => {
  const { progress, story } = useStoryStore();

  if (!progress || !story) {
    return null;
  }

  const completionPercentage =
    (progress.visitedNodes.length / Object.keys(story.nodes).length) * 100;
  const playTime = Math.floor(progress.totalPlayTime / 60); // Convert to minutes

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="github-card p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin
          className="h-5 w-5"
          style={{ color: "var(--color-accent-emphasis)" }}
        />
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-fg-default)" }}
        >
          Your Journey
        </h3>
      </div>

      {/* Progress stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Completion */}
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: "var(--color-neutral-muted)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen
              className="h-4 w-4"
              style={{ color: "var(--color-success-fg)" }}
            />
            <span className="text-sm font-medium github-text-muted">
              Progress
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 rounded-full h-2"
              style={{ backgroundColor: "var(--color-border-default)" }}
            >
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: "var(--color-success-fg)" }}
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-success-fg)" }}
            >
              {Math.round(completionPercentage)}%
            </span>
          </div>
        </div>

        {/* Play time */}
        <div className="p-3 bg-surface-light/30 dark:bg-surface-dark/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-accent-warning" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Play Time
            </span>
          </div>
          <p className="text-lg font-bold text-accent-warning">{playTime}m</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-accent-primary" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Achievements
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* First choice */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: progress.choicesMade.length > 0 ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-lg text-center ${
              progress.choicesMade.length > 0
                ? "bg-accent-primary/10 text-accent-primary"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400"
            }`}
          >
            <div className="text-lg">🎯</div>
            <div className="text-xs">First Choice</div>
          </motion.div>

          {/* Explorer */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: progress.visitedNodes.length >= 5 ? 1 : 0.7 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`p-2 rounded-lg text-center ${
              progress.visitedNodes.length >= 5
                ? "bg-accent-secondary/10 text-accent-secondary"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400"
            }`}
          >
            <div className="text-lg">🗺️</div>
            <div className="text-xs">Explorer</div>
          </motion.div>

          {/* Voice Master */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: progress.voiceCommandsUsed >= 3 ? 1 : 0.7 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`p-2 rounded-lg text-center ${
              progress.voiceCommandsUsed >= 3
                ? "bg-accent-warning/10 text-accent-warning"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400"
            }`}
          >
            <div className="text-lg">🎤</div>
            <div className="text-xs">Voice Master</div>
          </motion.div>
        </div>
      </div>

      {/* Story path visualization */}
      <div>
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          Your Path
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {progress.visitedNodes.slice(-5).map((nodeId, index) => {
            const node = story.nodes[nodeId];
            if (!node) return null;

            return (
              <motion.div
                key={nodeId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 bg-surface-light/20 dark:bg-surface-dark/20 rounded-lg"
              >
                <div className="w-2 h-2 bg-accent-primary rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {node.title}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 pt-4 border-t border-glassBorder">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-accent-primary">
              {progress.choicesMade.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Choices Made
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-secondary">
              {progress.visitedNodes.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Nodes Visited
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-warning">
              {progress.voiceCommandsUsed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Voice Commands
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
