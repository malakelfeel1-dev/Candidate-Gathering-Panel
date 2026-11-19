export const MAX_PARTICIPANTS = 12
export const MAX_NAME_LENGTH = 24

const SAMPLE_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fatima',
  'George', 'Hana', 'Ivan', 'Jasmine', 'Karim', 'Layla',
]

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function normalizeName(rawName) {
  if (typeof rawName !== 'string') return ''
  return rawName.trim().replace(/\s+/g, ' ').slice(0, MAX_NAME_LENGTH)
}

export function pickUnusedName(participants) {
  const used = new Set(participants.map((p) => p.name))
  const free = SAMPLE_NAMES.find((name) => !used.has(name))
  return free ?? `Guest ${participants.length + 1}`
}

export function getInitials(name) {
  const words = normalizeName(name).split(' ').filter(Boolean)

  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// Participant model: { id, name, muted, speaking, handRaised }
export function createParticipant(name) {
  return {
    id: generateId(),
    name: normalizeName(name) || 'Guest',
    muted: false,
    speaking: false,
    handRaised: false, // NEW (Task 1)
  }
}

export function isValidParticipant(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.name === 'string' &&
    value.name.length > 0 &&
    typeof value.muted === 'boolean' &&
    typeof value.speaking === 'boolean' &&
    typeof value.handRaised === 'boolean' // NEW (Task 1)
  )
}

export function getInitialParticipants() {
  return ['Alice', 'Bob', 'Charlie'].map(createParticipant)
}

export function pickRandomSpeaker(participants, random = Math.random) {
  const candidates = participants.filter((p) => !p.muted)
  if (candidates.length === 0) return null
  return candidates[Math.floor(random() * candidates.length)].id
}

export function withSpeaker(participants, speakerId) {
  return participants.map((p) => {
    const shouldSpeak = p.id === speakerId
    return p.speaking === shouldSpeak ? p : { ...p, speaking: shouldSpeak }
  })
}