import { describe, expect, it } from 'vitest'
import {
  chooseTrait,
  createNewGame,
  getAvailableChoices,
  purchaseEquipmentUpgrade,
  purchaseUpgrade,
  resolveOfflineRewards,
  tickBattle,
} from './engine'

describe('Re:Blade engine', () => {
  it('creates a new game at floor 1 with Lia, an intact blade, and persistent gold', () => {
    const state = createNewGame(1_700_000_000_000)

    expect(state.run.floor).toBe(1)
    expect(state.run.hp).toBe(state.run.maxHp)
    expect(state.run.bladeBroken).toBe(false)
    expect(state.permanent.gold).toBe(0)
    expect(state.permanent.memoryShards).toBe(0)
    expect(state.story.seenIntro).toBe(false)
  })

  it('defeats a normal enemy, advances floor, and grants persistent gold rewards without interrupting choices', () => {
    const state = createNewGame(1_700_000_000_000)
    state.run.enemy.hp = 1

    const next = tickBattle(state, 1_700_000_001_000)

    expect(next.run.floor).toBe(2)
    expect(next.permanent.gold).toBeGreaterThan(0)
    expect(next.run.totalKills).toBe(1)
    expect(getAvailableChoices(next)).toEqual([])
    expect(next.log[0]).toContain('1층')
  })

  it('does not open 3-choice prompts while climbing floors 5 or 10', () => {
    const floorFive = createNewGame(1_700_000_000_000)
    floorFive.run.floor = 5
    expect(getAvailableChoices(floorFive)).toEqual([])

    const floorTen = createNewGame(1_700_000_000_000)
    floorTen.run.floor = 10
    expect(getAvailableChoices(floorTen)).toEqual([])
  })

  it('breaks the blade, rewinds to floor 1, awards memory shards, and offers next-run traits', () => {
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
    expect(getAvailableChoices(next)).toHaveLength(3)
    expect(getAvailableChoices(next).every((choice) => choice.kind === 'trait')).toBe(true)
    expect(next.log[0]).toContain('시간이 되감겼다')
  })

  it('pauses auto combat until a post-rewind trait is selected', () => {
    const state = createNewGame(1_700_000_000_000)
    state.pendingTraitChoices = [
      { id: 'test-trait', kind: 'trait', name: '테스트 특성', description: '공격력 +20%', effect: { attackMultiplier: 0.2 } },
    ]
    const blocked = tickBattle(state, 1_700_000_001_000)
    expect(blocked.run.floor).toBe(1)
    expect(blocked.run.enemy.hp).toBe(state.run.enemy.hp)

    const chosen = chooseTrait(state, state.pendingTraitChoices[0])
    expect(chosen.pendingTraitChoices).toEqual([])
    expect(chosen.run.activeTrait?.id).toBe('test-trait')
    expect(chosen.run.modifiers.attackMultiplier).toBeCloseTo(0.2)
  })

  it('purchases permanent memory upgrades with memory shards', () => {
    const state = createNewGame(1_700_000_000_000)
    state.permanent.memoryShards = 50

    const next = purchaseUpgrade(state, 'bladeTraining')

    expect(next.permanent.memoryShards).toBeLessThan(50)
    expect(next.permanent.upgrades.bladeTraining).toBe(1)
    expect(next.run.maxHp).toBeGreaterThan(100)
  })

  it('purchases gold equipment upgrades for blade, armor, and accessory', () => {
    const state = createNewGame(1_700_000_000_000)
    state.permanent.gold = 500

    const blade = purchaseEquipmentUpgrade(state, 'blade')
    const armor = purchaseEquipmentUpgrade(blade, 'armor')
    const accessory = purchaseEquipmentUpgrade(armor, 'accessory')

    expect(accessory.permanent.gold).toBeLessThan(500)
    expect(accessory.permanent.equipment.blade).toBe(1)
    expect(accessory.permanent.equipment.armor).toBe(1)
    expect(accessory.permanent.equipment.accessory).toBe(1)
    expect(accessory.run.maxHp).toBeGreaterThan(state.run.maxHp)
  })

  it('grants capped offline rewards as persistent gold based on elapsed time and progress', () => {
    const state = createNewGame(1_700_000_000_000)
    const next = resolveOfflineRewards(state, 1_700_000_000_000 + 60 * 60 * 1000)

    expect(next.permanent.gold).toBeGreaterThan(state.permanent.gold)
    expect(next.offline.lastSeenAt).toBe(1_700_003_600_000)
    expect(next.log[0]).toContain('오프라인')
  })
})
