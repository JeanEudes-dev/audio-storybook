/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Performance monitoring utility for tracking application metrics
 * Helps identify bottlenecks and optimize user experience
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

interface NavigationTiming {
  dns: number;
  connection: number;
  request: number;
  response: number;
  domProcessing: number;
  domComplete: number;
  loadComplete: number;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];
  private static observers: PerformanceObserver[] = [];

  /**
   * Initialize performance monitoring
   */
  static initialize(): void {
    if (typeof window === "undefined") return;

    // Monitor resource loading
    this.observeResourceTiming();

    // Monitor layout shifts and input delays
    this.observeWebVitals();

    // Log initial page load metrics
    this.logNavigationTiming();
  }

  /**
   * Record a custom performance metric
   */
  static recordMetric(
    name: string,
    value: number,
    metadata?: Record<string, unknown>,
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    console.log(`📊 Performance: ${name} = ${value}ms`, metadata);
  }

  /**
   * Start timing an operation
   */
  static startTiming(name: string): () => void {
    const startTime = performance.now();

    return (metadata?: Record<string, unknown>) => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, metadata);
    };
  }

  /**
   * Measure component render time
   */
  static measureRender<T extends (...args: any[]) => any>(
    componentName: string,
    renderFunction: T,
  ): T {
    return ((...args: any[]) => {
      const startTime = performance.now();
      const result = renderFunction(...args);
      const duration = performance.now() - startTime;

      this.recordMetric(`render:${componentName}`, duration);

      return result;
    }) as T;
  }

  /**
   * Monitor resource loading performance
   */
  private static observeResourceTiming(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "resource") {
            const resource = entry as PerformanceResourceTiming;
            this.recordMetric(`resource:${resource.name}`, resource.duration, {
              size: resource.transferSize,
              type: resource.initiatorType,
            });
          }
        });
      });

      observer.observe({ entryTypes: ["resource"] });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Failed to observe resource timing:", error);
    }
  }

  /**
   * Monitor Web Vitals (CLS, FID, LCP)
   */
  private static observeWebVitals(): void {
    if (!("PerformanceObserver" in window)) return;

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric("lcp", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn("Failed to observe LCP:", error);
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric(
            "fid",
            (entry as PerformanceEventTiming).processingStart - entry.startTime,
          );
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    } catch (error) {
      console.warn("Failed to observe FID:", error);
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        if (clsValue > 0) {
          this.recordMetric("cls", clsValue);
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn("Failed to observe CLS:", error);
    }
  }

  /**
   * Log navigation timing metrics
   */
  private static logNavigationTiming(): void {
    if (typeof window === "undefined" || !window.performance?.timing) return;

    window.addEventListener("load", () => {
      const timing = window.performance.timing;
      const navigation: NavigationTiming = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        connection: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        domProcessing: timing.domContentLoadedEventStart - timing.responseEnd,
        domComplete: timing.domComplete - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart,
      };

      Object.entries(navigation).forEach(([key, value]) => {
        this.recordMetric(`navigation:${key}`, value);
      });
    });
  }

  /**
   * Get performance summary
   */
  static getSummary(): {
    metrics: PerformanceMetric[];
    averages: Record<string, number>;
    recommendations: string[];
  } {
    const averages: Record<string, number> = {};
    const metricGroups: Record<string, number[]> = {};

    // Group metrics by name
    this.metrics.forEach((metric) => {
      if (!metricGroups[metric.name]) {
        metricGroups[metric.name] = [];
      }
      metricGroups[metric.name].push(metric.value);
    });

    // Calculate averages
    Object.entries(metricGroups).forEach(([name, values]) => {
      averages[name] =
        values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    // Generate recommendations
    const recommendations: string[] = [];

    if (averages["lcp"] > 2500) {
      recommendations.push(
        "Largest Contentful Paint is slow. Consider optimizing images and reducing server response time.",
      );
    }

    if (averages["fid"] > 100) {
      recommendations.push(
        "First Input Delay is high. Consider reducing JavaScript execution time.",
      );
    }

    if (averages["cls"] > 0.1) {
      recommendations.push(
        "Cumulative Layout Shift is high. Ensure proper sizing for images and ads.",
      );
    }

    return {
      metrics: this.metrics,
      averages,
      recommendations,
    };
  }

  /**
   * Clear all recorded metrics
   */
  static clear(): void {
    this.metrics = [];
  }

  /**
   * Cleanup observers
   */
  static cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.clear();
  }

  /**
   * Export metrics as CSV
   */
  static exportCSV(): string {
    const headers = ["Name", "Value", "Timestamp", "Metadata"];
    const rows = this.metrics.map((metric) => [
      metric.name,
      metric.value.toString(),
      new Date(metric.timestamp).toISOString(),
      JSON.stringify(metric.metadata || {}),
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }
}
