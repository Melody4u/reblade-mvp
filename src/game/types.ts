export type ChoiceKind = 'imprint' | 'memory'

export type ChoiceEffect = Partial<{
  attackMultiplier: number
  critChance: number
  critDamage: number
  lifesteal: number
  shield: number
  bossDamage: number
  dodge: number
  goldMultiplier: number
  incomingDamageMultiplier: number
  extraStrikeChance: number
}>

export interface Choice {
  id: string
  kind: ChoiceKind
  name: string
  description: string
  effect: ChoiceEffect
}

export interface Enemy {
  name: string
  hp: number
  maxHp: number
  attack: number
  isBoss: boolean
  turnLimit: number
  elapsedTurns: number
}

export interface PermanentUpgrades {
  bladeTraining: number
  evasiveMemory: number
  bossPattern: number
  timeAdaptation: number
  sistersFencing: number
  steadyGrip: number
}

export interface PermanentState {
  memoryShards: number
  loopCount: number
  upgrades: PermanentUpgrades
}

export interface RunModifiers {
  attackMultiplier: number
  critChance: number
  critDamage: number
  lifesteal: number
  shield: number
  bossDamage: number
  dodge: number
  goldMultiplier: number
  incomingDamageMultiplier: number
  extraStrikeChance: number
}

export interface RunState {
  floor: number
  hp: number
  maxHp: number
  gold: number
  bladePower: number
  totalKills: number
  bladeBroken: boolean
  enemy: Enemy
  modifiers: RunModifiers
  choicesTaken: string[]
  resolvedChoiceFloors: number[]
}

export interface RecordsState {
  highestFloor: number
  bossesDefeated: number
}

export interface StoryState {
  seenIntro: boolean
  unlockedLogs: string[]
}

export interface OfflineState {
  lastSeenAt: number
}

export interface GameState {
  version: 1
  now: number
  permanent: PermanentState
  run: RunState
  records: RecordsState
  story: StoryState
  offline: OfflineState
  log: string[]
}

export interface UpgradeDefinition {
  id: keyof PermanentUpgrades
  name: string
  description: string
  baseCost: number
}
