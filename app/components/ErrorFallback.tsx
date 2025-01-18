interface ErrorFallbackProps {
  error: Error;
  eventId?: string;
  componentStack?: string;
  resetError: () => void;
}

export function ErrorFallback({ error, eventId, resetError }: ErrorFallbackProps) {
  return (
    <div 
      role="alert"
      aria-labelledby="error-title"
      className="p-6 max-w-xl mx-auto mt-8 bg-white rounded-lg shadow-lg"
    >
      <div className="space-y-4">
        <div className="flex items-center text-red-600">
          <svg
            aria-hidden="true"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 id="error-title" className="text-xl font-semibold">
            Something went wrong
          </h2>
        </div>

        <p className="text-gray-600">
          An unexpected error occurred. Our team has been notified.
        </p>

        {eventId && (
          <p 
            className="text-sm text-gray-500"
            aria-label={`Error ID: ${eventId}`}
          >
            Error ID: {eventId}
          </p>
        )}

        <div 
          className="bg-red-50 p-4 rounded-md"
          aria-label="Error details"
        >
          <pre className="text-sm text-red-600 whitespace-pre-wrap">
            {error.message}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetError}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Try again"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Refresh page"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
} 