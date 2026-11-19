import Tile from './Tile.jsx'

export default function CallView({
  participants,
  keyMode = 'id',
  controlsDisabled = false,
  onToggleMute,
  onToggleHand, // NEW
  onRemove,
}) {
  if (participants.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p className="empty-state__title">Nobody is in the call.</p>
        <p>Use “Add participant” above to bring someone in.</p>
      </div>
    )
  }

  return (
    <ul className="call-grid" aria-label="Participants">
      {participants.map((participant, index) => (
        <li
          key={keyMode === 'index' ? index : participant.id}
          className="call-grid__item"
        >
          <Tile
            name={participant.name}
            muted={participant.muted}
            speaking={participant.speaking}
            handRaised={participant.handRaised}
          >
            <div className="tile__actions">
              <button
                type="button"
                className="btn btn--secondary btn--small"
                aria-pressed={participant.muted}
                disabled={controlsDisabled}
                onClick={() => onToggleMute(participant.id)}
              >
                {participant.muted ? 'Unmute' : 'Mute'}
                <span className="visually-hidden"> {participant.name}</span>
              </button>

              {/* NEW (Task 1): raise / lower hand button */}
              <button
                type="button"
                className="btn btn--secondary btn--small"
                aria-pressed={participant.handRaised}
                disabled={controlsDisabled}
                onClick={() => onToggleHand(participant.id)}
              >
                {participant.handRaised ? 'Lower hand' : 'Raise hand'}
                <span className="visually-hidden"> {participant.name}</span>
              </button>

              <button
                type="button"
                className="btn btn--danger btn--small"
                disabled={controlsDisabled}
                onClick={() => onRemove(participant.id)}
              >
                Remove
                <span className="visually-hidden"> {participant.name}</span>
              </button>
            </div>
          </Tile>
        </li>
      ))}
    </ul>
  )
}