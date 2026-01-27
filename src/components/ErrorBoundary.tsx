'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          कुछ गलत हुआ है / Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          ऐप में कोई समस्या आई है। कृपया दोबारा कोशिश करें।
        </p>
        <p className="text-sm text-gray-500 mb-4">
          The app encountered an error. Please try again.
        </p>
        {error && (
          <details className="text-left text-xs text-gray-400 mb-4">
            <summary className="cursor-pointer">Technical details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={reset}
          className="w-full px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
        >
          दोबारा कोशिश करें / Try Again
        </button>
      </div>
    </div>
  );
}