'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-700">Please try again. If the problem persists, contact support.</p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Go to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-600 break-words">{error?.digest ? `Error ID: ${error.digest}` : ''}</p>
      </div>
    </div>
  );
}
