import { useState, useEffect } from "react";

/**
 * Hook for development mode features
 * Provides development utilities and debug capabilities
 */
export const useDevelopment = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    if (!isDevelopment) return;

    // Add keyboard shortcut for debug panel (Ctrl+Shift+D)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "D") {
        event.preventDefault();
        setShowDebugPanel((prev) => !prev);
      }

      // Toggle debug mode with Ctrl+Shift+X
      if (event.ctrlKey && event.shiftKey && event.key === "X") {
        event.preventDefault();
        setIsDebugMode((prev) => !prev);
        console.log("Debug mode:", !isDebugMode ? "enabled" : "disabled");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDevelopment, isDebugMode]);

  // Log component renders in debug mode
  const logRender = (
    componentName: string,
    props?: Record<string, unknown>,
  ) => {
    if (isDebugMode && isDevelopment) {
      console.log(`🔄 Render: ${componentName}`, props);
    }
  };

  // Log state changes in debug mode
  const logStateChange = (
    stateName: string,
    oldValue: unknown,
    newValue: unknown,
  ) => {
    if (isDebugMode && isDevelopment) {
      console.log(`📊 State: ${stateName}`, { from: oldValue, to: newValue });
    }
  };

  // Log user interactions in debug mode
  const logInteraction = (action: string, data?: Record<string, unknown>) => {
    if (isDebugMode && isDevelopment) {
      console.log(`👆 Interaction: ${action}`, data);
    }
  };

  return {
    isDevelopment,
    isDebugMode,
    showDebugPanel,
    setShowDebugPanel,
    logRender,
    logStateChange,
    logInteraction,
  };
};
