export default function Confirmation({ result, error, loading }) {
  return (
    <div className="status-area">
      {loading && <p>Processing...</p>}
      {!loading && error && (
        <p className="error">{error}</p>
      )}
      {!loading && result && result.success && (
        <p className="success">{result.message}</p>
      )}
      {!loading && result && !result.success && !error && (
        <p className="error">{result.message}</p>
      )}
    </div>
  );
}
