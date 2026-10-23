// Shows the idle, loading and error states. Nothing is shown on success.
export default function StatusMessage({ status, message, onRetry }) {
  if (status === 'success') return null;

  const text = status === 'idle' ? 'Search for a city to see the weather.' : message;

  return (
    <div className="status" data-state={status} role={status === 'error' ? 'alert' : 'status'}>
      <p>{text}</p>
      {status === 'error' && (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
