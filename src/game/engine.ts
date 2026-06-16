import { createEnemy, EQUIPMENT, TRAIT_CHOICES, UPGRADES } from './data'
import type { Choice, ChoiceEffect, EquipmentUpgrades, GameState, PermanentUpgrades, RunModifiers, RunState } from './types'

const emptyUpgrades = (): PermanentUpgrades => ({
  bladeTraining: 0,
  evasiveMemory: 0,
  bossPattern: 0,
  timeAdaptation: 0,
  sistersFencing: 0,
  steadyGrip: 0,
})

const emptyEquipment = (): EquipmentUpgrades => ({
  blade: 0,
  armor: 0,
  accessory: 0,
})

const emptyModifiers = (): RunModifiers => ({
  attackMultiplier: 0,
  critChance: 0,
  critDamage: 0,
  lifesteal: 0,
  shield: 0,
  bossDamage: 0,
  dodge: 0,
  goldMultiplier: 0,
  incomingDamageMultiplier: 0,
  extraStrikeChance: 0,
})

function addLog(state: GameState, message: string): GameState {
  return { ...state, log: [message, ...state.log].slice(0, 12) }
}

function mergeEffect(modifiers: RunModifiers, effect: ChoiceEffect): RunModifiers {
  return {
    attackMultiplier: modifiers.attackMultiplier + (effect.attackMultiplier ?? 0),
    critChance: modifiers.critChance + (effect.critChance ?? 0),
    critDamage: modifiers.critDamage + (effect.critDamage ?? 0),
    lifesteal: modifiers.lifesteal + (effect.lifesteal ?? 0),
    shield: modifiers.shield + (effect.shield ?? 0),
    bossDamage: modifiers.bossDamage + (effect.bossDamage ?? 0),
    dodge: modifiers.dodge + (effect.dodge ?? 0),
    goldMultiplier: modifiers.goldMultiplier + (effect.goldMultiplier ?? 0),
    incomingDamageMultiplier: modifiers.incomingDamageMultiplier + (effect.incomingDamageMultiplier ?? 0),
    extraStrikeChance: modifiers.extraStrikeChance + (effect.extraStrikeChance ?? 0),
  }
}

function deriveMaxHp(upgrades: PermanentUpgrades, equipment: EquipmentUpgrades): number {
  return 100 + upgrades.bladeTraining * 8 + upgrades.steadyGrip * 16 + equipment.armor * 18
}

function createRun(upgrades: PermanentUpgrades, equipment: EquipmentUpgrades): RunState {
  const maxHp = deriveMaxHp(upgrades, equipment)
  return {
    floor: 1,
    hp: maxHp,
    maxHp,
    bladePower: equipment.blade * 2,
    totalKills: 0,
    bladeBroken: false,
    enemy: createEnemy(1),
    modifiers: emptyModifiers(),
    activeTrait: null,
  }
}

export function createNewGame(now = Date.now()): GameState {
  const upgrades = emptyUpgrades()
  const equipment = emptyEquipment()
  return {
    version: 1,
    now,
    permanent: {
      gold: 0,
      memoryShards: 0,
      loopCount: 0,
      upgrades,
      equipment,
    },
    run: createRun(upgrades, equipment),
    pendingTraitChoices: [],
    records: {
      highestFloor: 1,
      bossesDefeated: 0,
    },
    story: {
      seenIntro: false,
      unlockedLogs: [],
    },
    offline: {
      lastSeenAt: now,
    },
    log: ['리아가 검을 다시 잡았다.'],
  }
}

function deterministicPick<T>(items: T[], seed: number, count: number): T[] {
  const pool = [...items]
  const picked: T[] = []
  let x = Math.max(1, seed)
  while (picked.length < count && pool.length) {
    x = (x * 9301 + 49297) % 233280
    const index = x % pool.length
    picked.push(pool.splice(index, 1)[0])
  }
  return picked
}

function nextTraitChoices(loopCount: number, floor: number): Choice[] {
  const common = TRAIT_CHOICES.filter((trait) => trait.rarity === 'common')
  const rare = TRAIT_CHOICES.filter((trait) => trait.rarity === 'rare')
  const legendary = TRAIT_CHOICES.filter((trait) => trait.rarity === 'legendary')
  const mythic = TRAIT_CHOICES.filter((trait) => trait.rarity === 'mythic')
  const seed = loopCount * 31 + floor * 7
  const first = deterministicPick(common, seed, 1)
  const secondPool = floor >= 20 || loopCount >= 1 ? [...rare, ...legendary] : rare
  const second = deterministicPick(secondPool, seed + 11, 1)
  const finalPool = floor >= 60 || loopCount >= 5 ? [...legendary, ...mythic] : [...rare, ...legendary]
  const third = deterministicPick(finalPool, seed + 29, 1)
  return [...first, ...second, ...third]
}

export function getAvailableChoices(state: GameState): Choice[] {
  return state.pendingTraitChoices
}

export function chooseTrait(state: GameState, trait: Choice): GameState {
  const run = {
    ...state.run,
    activeTrait: trait,
    modifiers: mergeEffect(emptyModifiers(), trait.effect),
  }
  return addLog({ ...state, run, pendingTraitChoices: [] }, `${trait.name} 선택 — 다음 던전에 적용된다.`)
}

// Backward-compatible alias for old UI/tests.
export const applyChoice = chooseTrait

function playerDamage(state: GameState): number {
  const { upgrades, equipment } = state.permanent
  const { modifiers, bladePower, enemy } = state.run
  const base = 14 + upgrades.bladeTraining * 3 + equipment.blade * 4 + bladePower
  const attack = base * (1 + modifiers.attackMultiplier)
  const critExpected = attack * Math.min(0.8, modifiers.critChance + upgrades.sistersFencing * 0.015) * (0.5 + modifiers.critDamage + upgrades.sistersFencing * 0.04)
  const extraStrike = attack * modifiers.extraStrikeChance
  const bossBonus = enemy.isBoss ? attack * (modifiers.bossDamage + upgrades.bossPattern * 0.05) : 0
  return Math.max(1, Math.round(attack + critExpected + extraStrike + bossBonus))
}

function enemyDamage(state: GameState): number {
  const reduction = state.permanent.upgrades.evasiveMemory * 0.035 + state.permanent.equipment.armor * 0.025 + state.run.modifiers.dodge * 0.5
  const incoming = 1 + state.run.modifiers.incomingDamageMultiplier - reduction
  const shield = state.run.modifiers.shield > 0 ? Math.min(state.run.modifiers.shield, state.run.enemy.attack * 0.35) : 0
  return Math.max(1, Math.round(state.run.enemy.attack * Math.max(0.3, incoming) - shield))
}

function rewardForFloor(state: GameState): { gold: number; bladePower: number } {
  const floor = state.run.floor
  const multiplier = 1 + state.run.modifiers.goldMultiplier + state.permanent.equipment.accessory * 0.035
  return {
    gold: Math.round((6 + floor * 2.5) * multiplier * (state.run.enemy.isBoss ? 4 : 1)),
    bladePower: state.run.enemy.isBoss ? 4 : 1,
  }
}

function rewind(state: GameState, now: number): GameState {
  const reachedFloor = state.run.floor
  const shards = Math.max(3, Math.floor(reachedFloor / 2) + state.records.bossesDefeated * 2)
  const highestFloor = Math.max(state.records.highestFloor, reachedFloor)
  const permanent = {
    ...state.permanent,
    memoryShards: state.permanent.memoryShards + shards,
    loopCount: state.permanent.loopCount + 1,
  }
  const next: GameState = {
    ...state,
    now,
    permanent,
    run: createRun(permanent.upgrades, permanent.equipment),
    pendingTraitChoices: nextTraitChoices(permanent.loopCount, reachedFloor),
    records: { ...state.records, highestFloor },
    offline: { lastSeenAt: now },
  }
  return addLog(next, `검이 부러졌다. 시간이 되감겼다. 기억 조각 +${shards}`)
}

export function tickBattle(state: GameState, now = Date.now()): GameState {
  if (state.pendingTraitChoices.length > 0) return { ...state, now }

  let enemy = { ...state.run.enemy }
  const damage = playerDamage(state)
  enemy.hp -= damage

  if (enemy.hp <= 0) {
    const reward = rewardForFloor(state)
    const nextFloor = state.run.floor + 1
    const bossKill = state.run.enemy.isBoss ? 1 : 0
    const next: GameState = {
      ...state,
      now,
      permanent: {
        ...state.permanent,
        gold: state.permanent.gold + reward.gold,
      },
      run: {
        ...state.run,
        floor: nextFloor,
        hp: Math.min(state.run.maxHp, state.run.hp + Math.round(state.run.maxHp * 0.16) + Math.round(damage * state.run.modifiers.lifesteal)),
        bladePower: state.run.bladePower + reward.bladePower,
        totalKills: state.run.totalKills + 1,
        enemy: createEnemy(nextFloor),
      },
      records: {
        highestFloor: Math.max(state.records.highestFloor, nextFloor),
        bossesDefeated: state.records.bossesDefeated + bossKill,
      },
      offline: { lastSeenAt: now },
    }
    return addLog(next, `${state.run.floor}층 돌파. 골드 +${reward.gold}`)
  }

  enemy.elapsedTurns += 1
  const hp = state.run.hp - enemyDamage({ ...state, run: { ...state.run, enemy } })
  if (hp <= 0 || (enemy.isBoss && enemy.elapsedTurns >= enemy.turnLimit)) {
    return rewind({ ...state, run: { ...state.run, hp: 0, enemy, bladeBroken: true } }, now)
  }

  return {
    ...state,
    now,
    run: { ...state.run, hp, enemy },
    offline: { lastSeenAt: now },
  }
}

export function upgradeCost(state: GameState, id: keyof PermanentUpgrades): number {
  const def = UPGRADES.find((upgrade) => upgrade.id === id)
  if (!def) throw new Error(`Unknown upgrade: ${id}`)
  const level = state.permanent.upgrades[id]
  return Math.round(def.baseCost * 1.45 ** level)
}

export function purchaseUpgrade(state: GameState, id: keyof PermanentUpgrades): GameState {
  const cost = upgradeCost(state, id)
  if (state.permanent.memoryShards < cost) return addLog(state, '기억 조각이 부족하다.')
  const upgrades = { ...state.permanent.upgrades, [id]: state.permanent.upgrades[id] + 1 }
  const maxHp = deriveMaxHp(upgrades, state.permanent.equipment)
  const next: GameState = {
    ...state,
    permanent: {
      ...state.permanent,
      memoryShards: state.permanent.memoryShards - cost,
      upgrades,
    },
    run: {
      ...state.run,
      maxHp,
      hp: Math.min(maxHp, state.run.hp + 20),
    },
  }
  const name = UPGRADES.find((upgrade) => upgrade.id === id)?.name ?? id
  return addLog(next, `${name} 강화 완료.`)
}

export function equipmentCost(state: GameState, id: keyof EquipmentUpgrades): number {
  const def = EQUIPMENT.find((equipment) => equipment.id === id)
  if (!def) throw new Error(`Unknown equipment: ${id}`)
  const level = state.permanent.equipment[id]
  return Math.round(def.baseCost * 1.38 ** level)
}

export function purchaseEquipmentUpgrade(state: GameState, id: keyof EquipmentUpgrades): GameState {
  const cost = equipmentCost(state, id)
  if (state.permanent.gold < cost) return addLog(state, '골드가 부족하다.')
  const equipment = { ...state.permanent.equipment, [id]: state.permanent.equipment[id] + 1 }
  const maxHp = deriveMaxHp(state.permanent.upgrades, equipment)
  const next: GameState = {
    ...state,
    permanent: {
      ...state.permanent,
      gold: state.permanent.gold - cost,
      equipment,
    },
    run: {
      ...state.run,
      maxHp,
      hp: Math.min(maxHp, state.run.hp + (id === 'armor' ? 24 : 0)),
      bladePower: state.run.bladePower + (id === 'blade' ? 2 : 0),
    },
  }
  const name = EQUIPMENT.find((equipmentDef) => equipmentDef.id === id)?.name ?? id
  return addLog(next, `${name} 강화 완료.`)
}

export function resolveOfflineRewards(state: GameState, now = Date.now()): GameState {
  const elapsedMs = Math.max(0, now - state.offline.lastSeenAt)
  const cappedMs = Math.min(elapsedMs, 8 * 60 * 60 * 1000)
  const minutes = Math.floor(cappedMs / 60000)
  if (minutes < 1) return { ...state, now }
  const adaptation = state.permanent.upgrades.timeAdaptation
  const accessory = state.permanent.equipment.accessory
  const gold = Math.round(minutes * (2 + state.records.highestFloor * 0.25) * (1 + adaptation * 0.12 + accessory * 0.04))
  const shards = Math.floor(minutes / 45) * Math.max(1, 1 + Math.floor(adaptation / 3))
  const next: GameState = {
    ...state,
    now,
    permanent: { ...state.permanent, gold: state.permanent.gold + gold, memoryShards: state.permanent.memoryShards + shards },
    offline: { lastSeenAt: now },
  }
  return addLog(next, `오프라인 보상: 골드 +${gold}${shards > 0 ? `, 기억 조각 +${shards}` : ''}`)
}

export { EQUIPMENT, UPGRADES }
