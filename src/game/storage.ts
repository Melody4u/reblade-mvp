import type { GameState } from './types'

export const SAVE_KEY = 'reblade:mvp-save:v1'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): unknown
  removeItem(key: string): unknown
}

export function saveGame(state: GameState, storage: StorageLike = window.localStorage): void {
  storage.setItem(SAVE_KEY, JSON.stringify(state))
}

export function loadGame(storage: StorageLike = window.localStorage): GameState | null {
  try {
    const raw = storage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GameState
    if (parsed?.version !== 1 || !parsed.run || !parsed.permanent) return null
    return parsed
  } catch {
    return null
  }
}

export function clearGame(storage: StorageLike = window.localStorage): void {
  storage.removeItem(SAVE_KEY)
}
