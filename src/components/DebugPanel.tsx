import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Download, Trash2, Info, X } from "lucide-react";
import { PerformanceMonitor } from "../utils/performance";
import { LocalStorageManager } from "../utils/storage";

interface DebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

interface PerformanceData {
  metrics: Array<{
    name: string;
    value: number;
    timestamp: number;
    metadata?: Record<string, unknown>;
  }>;
  averages: Record<string, number>;
  recommendations: string[];
}

interface StorageData {
  totalKeys: number;
  totalSize: number;
  items: Array<{ key: string; size: number; timestamp: number }>;
}

type TabId = "performance" | "storage" | "info";

export const DebugPanel: React.FC<DebugPanelProps> = ({
  isVisible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("performance");
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [storageData, setStorageData] = useState<StorageData | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Refresh data when panel opens
      setPerformanceData(PerformanceMonitor.getSummary());
      setStorageData(LocalStorageManager.getStorageInfo());
    }
  }, [isVisible]);

  const handleExportPerformance = () => {
    const csv = PerformanceMonitor.exportCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportStorage = () => {
    const data = LocalStorageManager.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storage-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearStorage = () => {
    if (
      confirm(
        "Are you sure you want to clear all stored data? This will reset your progress.",
      )
    ) {
      LocalStorageManager.clear();
      setStorageData(LocalStorageManager.getStorageInfo());
    }
  };

  const tabs = [
    { id: "performance", label: "Performance", icon: Settings },
    { id: "storage", label: "Storage", icon: Info },
    { id: "info", label: "System Info", icon: Info },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[80vh] bg-surface-light dark:bg-surface-dark rounded-2xl border border-glassBorder shadow-glass backdrop-blur-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-glassBorder">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-accent-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Debug Panel
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-glassBorder">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-accent-primary border-b-2 border-accent-primary bg-accent-primary/5"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Performance Tab */}
              {activeTab === "performance" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Performance Metrics
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportPerformance}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </button>
                      <button
                        onClick={() => {
                          PerformanceMonitor.clear();
                          setPerformanceData(PerformanceMonitor.getSummary());
                        }}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear
                      </button>
                    </div>
                  </div>

                  {performanceData && (
                    <>
                      {/* Averages */}
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Average Metrics
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(performanceData.averages).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {key}
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {typeof value === "number"
                                    ? value.toFixed(2)
                                    : String(value)}
                                  ms
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Recommendations */}
                      {performanceData.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Recommendations
                          </h4>
                          <div className="space-y-2">
                            {performanceData.recommendations.map(
                              (rec: string, index: number) => (
                                <div
                                  key={index}
                                  className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                                >
                                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    {rec}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Storage Tab */}
              {activeTab === "storage" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Local Storage
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportStorage}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
                      >
                        <Download className="h-4 w-4" />
                        Export JSON
                      </button>
                      <button
                        onClick={handleClearStorage}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                      </button>
                    </div>
                  </div>

                  {storageData && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Items
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {storageData.totalKeys}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Size
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {(storageData.totalSize / 1024).toFixed(2)} KB
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Storage Items
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {storageData.items.map((item, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {item.key}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(item.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {(item.size / 1024).toFixed(2)} KB
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* System Info Tab */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    System Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        User Agent
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {navigator.userAgent}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Screen Resolution
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {screen.width} × {screen.height}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Viewport Size
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {window.innerWidth} × {window.innerHeight}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Language
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {navigator.language}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Speech Synthesis
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {"speechSynthesis" in window
                          ? "✅ Supported"
                          : "❌ Not Supported"}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Speech Recognition
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {"SpeechRecognition" in window ||
                        "webkitSpeechRecognition" in window
                          ? "✅ Supported"
                          : "❌ Not Supported"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
