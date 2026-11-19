import { CONNECTION_STATUS, STATUS_LABELS } from '../lib/connectionStates.js'

export function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export default function ConnectionStatus({
  status,
  participantCount,
  onJoin,
  onConnected,
  onFailed,
  onRetry,
  onBackToIdle,
}) {
  if (status === CONNECTION_STATUS.IDLE) {
    return (
      <section className="panel">
        <h2 className="panel__title">Welcome</h2>
        <button type="button" className="btn btn--primary" onClick={onJoin}>
          Join call
        </button>
      </section>
    )
  }

  if (status === CONNECTION_STATUS.CONNECTING) {
    return (
      <section className="panel" aria-live="polite">
        <h2 className="panel__title">Connecting…</h2>
        <div className="demo-buttons">
          <button type="button" className="btn btn--secondary" onClick={onConnected}>
            Simulate success
          </button>
          <button type="button" className="btn btn--secondary" onClick={onFailed}>
            Simulate failure
          </button>
          <button type="button" className="btn btn--ghost" onClick={onBackToIdle}>
            Cancel
          </button>
        </div>
      </section>
    )
  }

  if (status === CONNECTION_STATUS.RECONNECTING) {
    return (
      <div className="banner banner--warn" role="status">
        Connection lost. Reconnecting… ({participantCount} in call)
      </div>
    )
  }

  if (status === CONNECTION_STATUS.FAILED) {
    return (
      <section className="panel" role="alert">
        <h2 className="panel__title">Couldn’t connect</h2>
        <p className="panel__text">Something went wrong. Please try again.</p>
        <div className="demo-buttons">
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            Retry
          </button>
          <button type="button" className="btn btn--ghost" onClick={onBackToIdle}>
            Back to start
          </button>
        </div>
      </section>
    )
  }

  return null
}