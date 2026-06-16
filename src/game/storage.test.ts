import { describe, expect, it } from 'vitest'
import { createNewGame } from './engine'
import { loadGame, saveGame } from './storage'

describe('Re:Blade storage', () => {
  it('saves and loads a game state from a Storage-compatible object', () => {
    const storage = new Map<string, string>()
    const adapter = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    }
    const state = createNewGame(1_700_000_000_000)
    state.permanent.memoryShards = 12

    saveGame(state, adapter)
    const loaded = loadGame(adapter)

    expect(loaded?.permanent.memoryShards).toBe(12)
    expect(loaded?.run.floor).toBe(1)
  })

  it('returns null when stored data is missing or invalid', () => {
    const adapter = {
      getItem: () => 'not-json',
      setItem: () => undefined,
      removeItem: () => undefined,
    }

    expect(loadGame(adapter)).toBeNull()
  })
})
