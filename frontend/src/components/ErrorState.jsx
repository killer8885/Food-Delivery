export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 rounded bg-red-600 px-3 py-1 text-white">
          Retry
        </button>
      )}
    </div>
  );
}
