import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Log to error tracking service (Sentry, etc.) if configured
    if (window.errorTracker) {
      window.errorTracker.logError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // Save error to localStorage for debugging
    try {
      const errorLog = JSON.parse(localStorage.getItem('error_log') || '[]');
      errorLog.push({
        timestamp: new Date().toISOString(),
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
      });
      // Keep only last 10 errors
      localStorage.setItem('error_log', JSON.stringify(errorLog.slice(-10)));
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReloadData = () => {
    // Clear potentially corrupted data
    if (window.confirm('This will clear your local data and reload the app. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isDeveloperMode = localStorage.getItem('settings')
        ? JSON.parse(localStorage.getItem('settings')).developerMode
        : false;

      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-zinc-900 rounded-2xl p-8 border border-red-500/50 shadow-2xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FiAlertTriangle className="text-red-400" size={40} />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-zinc-100 text-center mb-4">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-zinc-400 text-center mb-8">
                We encountered an unexpected error. Don't worry, your data is safe.
                Try one of the options below to recover.
              </p>

              {/* Actions */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={this.handleReset}
                  className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <FiRefreshCw size={20} />
                  Return to Dashboard
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition-colors"
                >
                  Reload Page
                </button>

                <button
                  onClick={this.handleReloadData}
                  className="w-full px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition-colors border border-red-500/50"
                >
                  Clear Data & Reset (Last Resort)
                </button>
              </div>

              {/* Developer Mode Error Details */}
              {isDeveloperMode && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-zinc-400 hover:text-zinc-300 mb-2">
                    Error Details (Developer Mode)
                  </summary>
                  <div className="bg-zinc-950 rounded-lg p-4 overflow-auto max-h-64">
                    <p className="text-red-400 font-mono text-xs mb-2">
                      {this.state.error.toString()}
                    </p>
                    <pre className="text-zinc-500 font-mono text-xs whitespace-pre-wrap">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Help Text */}
              <p className="text-xs text-zinc-600 text-center mt-6">
                If the problem persists, try exporting your data from Settings before resetting.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
