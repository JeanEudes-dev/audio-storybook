import { StoryLayout } from "./components/StoryLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        <StoryLayout />
        {/* Subtle copyright attribution */}
        <div className="fixed bottom-2 right-2 z-50">
          <p className="copyright-text text-right">
            © 2025 Jean-Eudes Assogba
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
