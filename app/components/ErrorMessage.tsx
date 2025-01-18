interface ErrorMessageProps {
  error: Error | null;
  id?: string;
  className?: string;
}

export function ErrorMessage({ error, id, className = '' }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className={`p-4 rounded-lg bg-red-50 border border-red-200 ${className}`}
    >
      <div className="flex items-start gap-2">
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-red-600 mt-0.5"
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
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            {error.message}
          </p>
          {error.stack && process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
              {error.stack}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
} 