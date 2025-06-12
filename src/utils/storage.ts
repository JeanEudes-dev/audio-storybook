/**
 * Local Storage utility for managing application data
 * Provides type-safe storage operations with error handling
 */

interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

export class LocalStorageManager {
  private static readonly PREFIX = "audio-storybook";

  /**
   * Store an item in localStorage with optional expiration
   */
  static setItem<T>(key: string, value: T, expirationHours?: number): boolean {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiresAt: expirationHours
          ? Date.now() + expirationHours * 60 * 60 * 1000
          : undefined,
      };

      localStorage.setItem(`${this.PREFIX}:${key}`, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error("Failed to store item:", error);
      return false;
    }
  }

  /**
   * Retrieve an item from localStorage
   */
  static getItem<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(`${this.PREFIX}:${key}`);
      if (!stored) return null;

      const item: StorageItem<T> = JSON.parse(stored);

      // Check if item has expired
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error("Failed to retrieve item:", error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(`${this.PREFIX}:${key}`);
      return true;
    } catch (error) {
      console.error("Failed to remove item:", error);
      return false;
    }
  }

  /**
   * Clear all application data from localStorage
   */
  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(`${this.PREFIX}:`)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to clear storage:", error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  static getStorageInfo(): {
    totalKeys: number;
    totalSize: number;
    items: Array<{ key: string; size: number; timestamp: number }>;
  } {
    const items: Array<{ key: string; size: number; timestamp: number }> = [];
    let totalSize = 0;

    try {
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith(`${this.PREFIX}:`)) {
          const value = localStorage.getItem(key) || "";
          const size = new Blob([value]).size;

          try {
            const item: StorageItem<unknown> = JSON.parse(value);
            items.push({
              key: key.replace(`${this.PREFIX}:`, ""),
              size,
              timestamp: item.timestamp,
            });
          } catch {
            // Handle corrupted items
            items.push({
              key: key.replace(`${this.PREFIX}:`, ""),
              size,
              timestamp: 0,
            });
          }

          totalSize += size;
        }
      });

      return {
        totalKeys: items.length,
        totalSize,
        items: items.sort((a, b) => b.timestamp - a.timestamp),
      };
    } catch (error) {
      console.error("Failed to get storage info:", error);
      return { totalKeys: 0, totalSize: 0, items: [] };
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, "test");
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Export all application data
   */
  static exportData(): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(`${this.PREFIX}:`)) {
          const cleanKey = key.replace(`${this.PREFIX}:`, "");
          const value = localStorage.getItem(key);
          if (value) {
            try {
              data[cleanKey] = JSON.parse(value);
            } catch {
              data[cleanKey] = value;
            }
          }
        }
      });
    } catch (error) {
      console.error("Failed to export data:", error);
    }

    return data;
  }

  /**
   * Import application data
   */
  static importData(data: Record<string, unknown>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "object") {
          localStorage.setItem(`${this.PREFIX}:${key}`, JSON.stringify(value));
        } else {
          localStorage.setItem(`${this.PREFIX}:${key}`, String(value));
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }
}
