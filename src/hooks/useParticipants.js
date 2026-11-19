import { useState, useEffect } from 'react'
import {
  MAX_PARTICIPANTS,
  createParticipant,
  getInitialParticipants,
  isValidParticipant,
  normalizeName,
  pickRandomSpeaker,
  pickUnusedName,
  withSpeaker,
} from '../lib/participantUtils.js'

const SPEAKING_INTERVAL_MS = 1500

export function useParticipants({ simulateSpeaking = false } = {}) {
  const [participants, setParticipants] = useState(getInitialParticipants)

  function addParticipant(name) {
    if (participants.length >= MAX_PARTICIPANTS) return

    const newParticipant = createParticipant(
      normalizeName(name) || pickUnusedName(participants),
    )
    if (!isValidParticipant(newParticipant)) return

    setParticipants((current) => [...current, newParticipant])
  }

  function removeParticipant(id) {
    setParticipants((current) => current.filter((p) => p.id !== id))
  }

  function toggleMute(id) {
    setParticipants((current) =>
      current.map((p) => {
        if (p.id !== id) return p
        const nowMuted = !p.muted
        return { ...p, muted: nowMuted, speaking: nowMuted ? false : p.speaking }
      }),
    )
  }

  // NEW (Task 1): raise / lower hand - returns a NEW object for one participant
  function toggleHand(id) {
    setParticipants((current) =>
      current.map((p) => (p.id === id ? { ...p, handRaised: !p.handRaised } : p)),
    )
  }

  // NEW (Task 2): mute everybody and stop all speaking indicators
  function muteAll() {
    setParticipants((current) =>
      current.map((p) => ({ ...p, muted: true, speaking: false })),
    )
  }

  useEffect(() => {
    if (!simulateSpeaking) {
      setParticipants((current) =>
        current.some((p) => p.speaking) ? withSpeaker(current, null) : current,
      )
      return undefined
    }

    function pickNextSpeaker() {
      setParticipants((current) => withSpeaker(current, pickRandomSpeaker(current)))
    }

    pickNextSpeaker()
    const timerId = setInterval(pickNextSpeaker, SPEAKING_INTERVAL_MS)
    return () => clearInterval(timerId)
  }, [simulateSpeaking])

  return {
    participants,
    addParticipant,
    removeParticipant,
    toggleMute,
    toggleHand, // NEW
    muteAll,    // NEW
    maxParticipants: MAX_PARTICIPANTS,
  }
}