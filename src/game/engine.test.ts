import { describe, expect, it } from 'vitest'
import {
  applyChoice,
  createNewGame,
  getAvailableChoices,
  purchaseUpgrade,
  resolveOfflineRewards,
  tickBattle,
} from './engine'
import type { Choice } from './types'

describe('Re:Blade engine', () => {
  it('creates a new game at floor 1 with Lia and an intact blade', () => {
    const state = createNewGame(1_700_000_000_000)

    expect(state.run.floor).toBe(1)
    expect(state.run.hp).toBe(state.run.maxHp)
    expect(state.run.bladeBroken).toBe(false)
    expect(state.permanent.memoryShards).toBe(0)
    expect(state.story.seenIntro).toBe(false)
  })

  it('defeats a normal enemy, advances floor, and grants rewards', () => {
    const state = createNewGame(1_700_000_000_000)
    state.run.enemy.hp = 1

    const next = tickBattle(state, 1_700_000_001_000)

    expect(next.run.floor).toBe(2)
    expect(next.run.gold).toBeGreaterThan(0)
    expect(next.run.totalKills).toBe(1)
    expect(next.log[0]).toContain('1층')
  })

  it('opens blade imprint choices on floor 5 and memory fragment choices on floor 10', () => {
    const floorFive = createNewGame(1_700_000_000_000)
    floorFive.run.floor = 5
    expect(getAvailableChoices(floorFive).every((choice) => choice.kind === 'imprint')).toBe(true)

    const floorTen = createNewGame(1_700_000_000_000)
    floorTen.run.floor = 10
    expect(getAvailableChoices(floorTen).every((choice) => choice.kind === 'memory')).toBe(true)
  })

  it('applies a choice to the current loop build and avoids duplicate floor prompts', () => {
    const state = createNewGame(1_700_000_000_000)
    state.run.floor = 5
    const choice: Choice = {
      id: 'test-flame',
      kind: 'imprint',
      name: '불꽃 각인',
      description: '공격력 +20%',
      effect: { attackMultiplier: 0.2 },
    }

    const next = applyChoice(state, choice)

    expect(next.run.choicesTaken).toContain('test-flame')
    expect(next.run.resolvedChoiceFloors).toContain(5)
    expect(next.run.modifiers.attackMultiplier).toBeCloseTo(0.2)
    expect(getAvailableChoices(next)).toEqual([])
  })

  it('breaks the blade, rewinds to floor 1, and awards memory shards', () => {
    const state = createNewGame(1_700_000_000_000)
    state.run.floor = 21
    state.run.hp = 1
    state.run.enemy.attack = 999

    const next = tickBattle(state, 1_700_000_001_000)

    expect(next.run.floor).toBe(1)
    expect(next.run.bladeBroken).toBe(false)
    expect(next.permanent.memoryShards).toBeGreaterThan(0)
    expect(next.permanent.loopCount).toBe(1)
    expect(next.records.highestFloor).toBe(21)
    expect(next.log[0]).toContain('시간이 되감겼다')
  })

  it('purchases permanent upgrades with memory shards', () => {
    const state = createNewGame(1_700_000_000_000)
    state.permanent.memoryShards = 50

    const next = purchaseUpgrade(state, 'bladeTraining')

    expect(next.permanent.memoryShards).toBeLessThan(50)
    expect(next.permanent.upgrades.bladeTraining).toBe(1)
    expect(next.run.maxHp).toBeGreaterThan(100)
  })

  it('grants capped offline rewards based on elapsed time and permanent progress', () => {
    const state = createNewGame(1_700_000_000_000)
    const next = resolveOfflineRewards(state, 1_700_000_000_000 + 60 * 60 * 1000)

    expect(next.run.gold).toBeGreaterThan(state.run.gold)
    expect(next.offline.lastSeenAt).toBe(1_700_003_600_000)
    expect(next.log[0]).toContain('오프라인')
  })
})
