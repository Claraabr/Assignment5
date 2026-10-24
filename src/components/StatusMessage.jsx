// Shows the idle, loading and error states. Nothing is shown on success.
export default function StatusMessage({ status, message, onRetry }) {
  if (status === 'success') return null;

  let text = message;
  if (status === 'idle') {
    text = 'Search for a city to see the weather.';
  }

  return (
    <div className="status" data-state={status}>
      <p>{text}</p>
      {status === 'error' && (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
