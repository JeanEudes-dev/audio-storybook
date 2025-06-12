import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Keyboard } from "lucide-react";
import { useKeyboardShortcuts } from "../hooks";

export const HelpPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { shortcuts } = useKeyboardShortcuts();

  return (
    <>
      {/* Help trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-accent-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Open help panel"
      >
        <HelpCircle className="h-6 w-6" />
      </motion.button>

      {/* Help panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl border border-glassBorder shadow-glass backdrop-blur-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-glassBorder">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-primary/10 rounded-lg">
                    <Keyboard className="h-5 w-5 text-accent-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                  Use these keyboard shortcuts to navigate your story faster:
                </p>

                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={shortcut.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.key.split("+").map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && (
                              <span className="text-gray-400 text-xs">+</span>
                            )}
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                              {key}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional tips */}
                <div className="mt-6 p-4 bg-accent-primary/5 rounded-lg border border-accent-primary/20">
                  <h3 className="font-medium text-accent-primary mb-2">
                    Voice Control Tips
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Speak clearly and at normal volume</li>
                    <li>• Use the keyword phrases shown with each choice</li>
                    <li>• Allow microphone permissions for best experience</li>
                    <li>• Voice commands work best in quiet environments</li>
                  </ul>
                </div>

                {/* Accessibility info */}
                <div className="mt-4 p-4 bg-accent-secondary/5 rounded-lg border border-accent-secondary/20">
                  <h3 className="font-medium text-accent-secondary mb-2">
                    Accessibility Features
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Full keyboard navigation support</li>
                    <li>• Screen reader compatible</li>
                    <li>• Voice synthesis for story narration</li>
                    <li>• High contrast mode available</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-glassBorder">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Press{" "}
                  <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                    Esc
                  </kbd>{" "}
                  to close this panel
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
