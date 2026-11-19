import { describe, it, expect } from 'vitest'
import { pickRandomSpeaker } from './participantUtils.js'

const people = [
  { id: 'a', name: 'A', muted: false },
  { id: 'b', name: 'B', muted: true },
  { id: 'c', name: 'C', muted: false },
]

describe('pickRandomSpeaker', () => {
  it('picks predictably with a fixed random function', () => {
    // unmuted candidates are [a, c]
    expect(pickRandomSpeaker(people, () => 0)).toBe('a')
    expect(pickRandomSpeaker(people, () => 0.99)).toBe('c')
  })

  it('never picks a muted participant', () => {
    for (const r of [0, 0.3, 0.5, 0.7, 0.99]) {
      expect(pickRandomSpeaker(people, () => r)).not.toBe('b')
    }
  })

  it('returns null for an empty list', () => {
    expect(pickRandomSpeaker([], () => 0)).toBeNull()
  })

  it('returns null when everyone is muted', () => {
    const allMuted = people.map((p) => ({ ...p, muted: true }))
    expect(pickRandomSpeaker(allMuted, () => 0)).toBeNull()
  })
})
