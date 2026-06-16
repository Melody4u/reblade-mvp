import type { GameState } from './types'

export const SAVE_KEY = 'reblade:mvp-save:v1'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): unknown
  removeItem(key: string): unknown
}

function normalizeGameState(parsed: GameState): GameState {
  const goldFromOldRun = typeof (parsed.run as unknown as { gold?: number }).gold === 'number'
    ? (parsed.run as unknown as { gold: number }).gold
    : 0
  const equipment = parsed.permanent.equipment ?? { blade: 0, armor: 0, accessory: 0 }
  const permanent = {
    ...parsed.permanent,
    gold: parsed.permanent.gold ?? goldFromOldRun,
    equipment,
  }
  return {
    ...parsed,
    permanent,
    pendingTraitChoices: parsed.pendingTraitChoices ?? [],
    run: {
      ...parsed.run,
      activeTrait: parsed.run.activeTrait ?? null,
      maxHp: parsed.run.maxHp + equipment.armor * 18,
    },
  }
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
    return normalizeGameState(parsed)
  } catch {
    return null
  }
}

export function clearGame(storage: StorageLike = window.localStorage): void {
  storage.removeItem(SAVE_KEY)
}
