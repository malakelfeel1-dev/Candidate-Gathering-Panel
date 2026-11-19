import { getInitials } from '../lib/participantUtils.js'

export default function Tile({ name, muted, speaking, handRaised, children }) {
  const className = ['tile', muted && 'tile--muted', speaking && 'tile--speaking']
    .filter(Boolean)
    .join(' ')

  return (
    <article className={className} aria-label={`Participant ${name}`}>
      <div className="tile__video">
        <div className="avatar" aria-hidden="true">
          {getInitials(name)}
        </div>

        <div className="tile__badges">
          {muted && (
            <span className="badge badge--muted">
              <span aria-hidden="true">🔇</span> Muted
            </span>
          )}
          {speaking && (
            <span className="badge badge--speaking">
              <span className="eq" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              Speaking
            </span>
          )}
          {/* NEW (Task 1): hand raised badge */}
          {handRaised && (
            <span className="badge badge--hand">
              <span aria-hidden="true">✋</span> Hand raised
            </span>
          )}
        </div>
      </div>

      <h3 className="tile__name">{name}</h3>

      <label className="tile__note">
        <span className="tile__note-label">Note for {name}</span>
        <input type="text" defaultValue="" placeholder="Type a note…" maxLength={60} />
      </label>

      {children}
    </article>
  )
}