import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full text-center p-8 backdrop-blur-md bg-glassWhite dark:bg-glassBlack rounded-4xl border border-glassBorder shadow-glass"
          >
            {/* Error icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <div className="w-16 h-16 mx-auto bg-accent-danger/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-accent-danger" />
              </div>
            </motion.div>

            {/* Error message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Oops! Something went wrong
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 mb-6"
            >
              We encountered an unexpected error while loading your story. Don't
              worry, your progress is safe!
            </motion.p>

            {this.state.error && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 text-left"
              >
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Technical Details
                </summary>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                  <div className="text-red-600 dark:text-red-400 mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {this.state.error.stack}
                  </div>
                </div>
              </motion.details>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-xl hover:bg-accent-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                Restart App
              </motion.button>
            </motion.div>

            {/* Support info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-gray-500 dark:text-gray-400"
            >
              <p>If the problem persists, try refreshing the page</p>
              <p className="mt-1">Your story progress is automatically saved</p>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
