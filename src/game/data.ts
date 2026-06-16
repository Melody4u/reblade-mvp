import type { Choice, Enemy, EquipmentDefinition, UpgradeDefinition } from './types'

export const BOSS_FLOORS = [20, 40, 60]

export const TRAIT_CHOICES: Choice[] = [
  { id: 'flame', kind: 'trait', name: '불꽃 각인', description: '다음 던전 동안 공격력 +15%.', effect: { attackMultiplier: 0.15 } },
  { id: 'blood', kind: 'trait', name: '피의 각인', description: '다음 던전 동안 흡혈 +3%.', effect: { lifesteal: 0.03 } },
  { id: 'thunder', kind: 'trait', name: '번개 각인', description: '다음 던전 동안 추가 타격 확률 +12%.', effect: { extraStrikeChance: 0.12 } },
  { id: 'guard', kind: 'trait', name: '수호 각인', description: '다음 던전 동안 보호막 +12.', effect: { shield: 12 } },
  { id: 'edge', kind: 'trait', name: '칼날 각인', description: '다음 던전 동안 치명타 확률 +8%.', effect: { critChance: 0.08 } },
  { id: 'rift', kind: 'trait', name: '균열 각인', description: '공격력 +30%, 받는 피해 +10%.', effect: { attackMultiplier: 0.3, incomingDamageMultiplier: 0.1 } },
  { id: 'gold-spark', kind: 'trait', name: '황금 균열', description: '다음 던전 동안 골드 획득 +30%.', effect: { goldMultiplier: 0.3 } },
  { id: 'deep-cut', kind: 'trait', name: '깊은 상처', description: '다음 던전 동안 치명타 피해 +35%.', effect: { critDamage: 0.35 } },
  { id: 'echo-edge', kind: 'trait', name: '잔향검', description: '다음 던전 동안 보스 피해 +20%.', effect: { bossDamage: 0.2 } },
]

export const UPGRADES: UpgradeDefinition[] = [
  { id: 'bladeTraining', name: '기억 훈련', description: '기본 공격력과 HP를 올린다.', baseCost: 8 },
  { id: 'evasiveMemory', name: '몸이 기억하는 회피', description: '받는 피해를 줄인다.', baseCost: 10 },
  { id: 'bossPattern', name: '보스 패턴 기억', description: '보스에게 주는 피해를 올린다.', baseCost: 12 },
  { id: 'timeAdaptation', name: '시간 적응', description: '오프라인 보상을 올린다.', baseCost: 10 },
  { id: 'sistersFencing', name: '언니의 검술', description: '치명타 확률과 피해를 올린다.', baseCost: 14 },
  { id: 'steadyGrip', name: '다시 잡는 손', description: '루프 시작 HP를 올린다.', baseCost: 9 },
]

export const EQUIPMENT: EquipmentDefinition[] = [
  { id: 'blade', name: '검 강화', description: '골드로 검의 기본 공격력을 올린다.', baseCost: 35 },
  { id: 'armor', name: '리아 방어구', description: '골드로 최대 HP와 피해 감소를 올린다.', baseCost: 40 },
  { id: 'accessory', name: '시계 장신구', description: '골드 획득과 시간 보상을 올린다.', baseCost: 45 },
]

export function createEnemy(floor: number): Enemy {
  const isBoss = floor % 20 === 0
  const bossNames: Record<number, string> = {
    20: '균열 늑대',
    40: '시간에 잠긴 기사',
    60: '검을 부수는 자',
  }
  const hp = Math.round((22 + floor * 6 + floor ** 1.18) * (isBoss ? 4.2 + floor / 45 : 1))
  return {
    name: isBoss ? bossNames[floor] ?? '균열의 수문장' : `${floor}층 그림자`,
    hp,
    maxHp: hp,
    attack: Math.round((2 + floor * 0.85) * (isBoss ? 1.8 : 1)),
    isBoss,
    turnLimit: isBoss ? 18 : 999,
    elapsedTurns: 0,
  }
}
