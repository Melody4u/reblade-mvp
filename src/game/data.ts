import type { Choice, Enemy, UpgradeDefinition } from './types'

export const BOSS_FLOORS = [20, 40, 60]

export const IMPRINT_CHOICES: Choice[] = [
  { id: 'flame', kind: 'imprint', name: '불꽃 각인', description: '공격력 +15%, 칼날에 열기가 돈다.', effect: { attackMultiplier: 0.15 } },
  { id: 'blood', kind: 'imprint', name: '피의 각인', description: '흡혈 +3%, 버티는 힘을 얻는다.', effect: { lifesteal: 0.03 } },
  { id: 'thunder', kind: 'imprint', name: '번개 각인', description: '추가 타격 확률 +12%.', effect: { extraStrikeChance: 0.12 } },
  { id: 'guard', kind: 'imprint', name: '수호 각인', description: '전투 중 보호막 +12.', effect: { shield: 12 } },
  { id: 'edge', kind: 'imprint', name: '칼날 각인', description: '치명타 확률 +8%.', effect: { critChance: 0.08 } },
  { id: 'rift', kind: 'imprint', name: '균열 각인', description: '공격력 +30%, 받는 피해 +10%.', effect: { attackMultiplier: 0.3, incomingDamageMultiplier: 0.1 } },
  { id: 'gold-spark', kind: 'imprint', name: '황금 균열', description: '골드 획득 +30%.', effect: { goldMultiplier: 0.3 } },
  { id: 'deep-cut', kind: 'imprint', name: '깊은 상처', description: '치명타 피해 +35%.', effect: { critDamage: 0.35 } },
  { id: 'echo-edge', kind: 'imprint', name: '잔향검', description: '보스 피해 +20%.', effect: { bossDamage: 0.2 } },
  { id: 'mirror', kind: 'imprint', name: '거울 날', description: '회피 +4%, 치명타 +4%.', effect: { dodge: 0.04, critChance: 0.04 } },
  { id: 'pulse', kind: 'imprint', name: '맥동하는 검신', description: '공격력 +10%, 흡혈 +2%.', effect: { attackMultiplier: 0.1, lifesteal: 0.02 } },
  { id: 'last-light', kind: 'imprint', name: '마지막 빛', description: '보스 피해 +35%, 받는 피해 +8%.', effect: { bossDamage: 0.35, incomingDamageMultiplier: 0.08 } },
]

export const MEMORY_CHOICES: Choice[] = [
  { id: 'boss-gap', kind: 'memory', name: '보스의 빈틈', description: '보스 피해 +25%.', effect: { bossDamage: 0.25 } },
  { id: 'falling-wall', kind: 'memory', name: '무너지는 벽', description: '공격력 +18%.', effect: { attackMultiplier: 0.18 } },
  { id: 'floor-trap', kind: 'memory', name: '발밑의 함정', description: '회피 +6%.', effect: { dodge: 0.06 } },
  { id: 'sister-fingertip', kind: 'memory', name: '언니의 손끝', description: '치명타 피해 +30%.', effect: { critDamage: 0.3 } },
  { id: 'first-break', kind: 'memory', name: '첫 파손의 감각', description: '공격력 +12%, 치명타 +5%.', effect: { attackMultiplier: 0.12, critChance: 0.05 } },
  { id: 'rewind-breath', kind: 'memory', name: '되감기는 호흡', description: '보호막 +20.', effect: { shield: 20 } },
  { id: 'known-pain', kind: 'memory', name: '아는 고통', description: '받는 피해 -8%.', effect: { incomingDamageMultiplier: -0.08 } },
  { id: 'soft-step', kind: 'memory', name: '조용한 발걸음', description: '회피 +3%, 골드 +15%.', effect: { dodge: 0.03, goldMultiplier: 0.15 } },
  { id: 'again', kind: 'memory', name: '다시 잡는 손', description: '공격력 +10%, 보스 피해 +10%.', effect: { attackMultiplier: 0.1, bossDamage: 0.1 } },
]

export const UPGRADES: UpgradeDefinition[] = [
  { id: 'bladeTraining', name: '기억 훈련', description: '기본 공격력과 HP를 올린다.', baseCost: 8 },
  { id: 'evasiveMemory', name: '몸이 기억하는 회피', description: '받는 피해를 줄인다.', baseCost: 10 },
  { id: 'bossPattern', name: '보스 패턴 기억', description: '보스에게 주는 피해를 올린다.', baseCost: 12 },
  { id: 'timeAdaptation', name: '시간 적응', description: '오프라인 보상을 올린다.', baseCost: 10 },
  { id: 'sistersFencing', name: '언니의 검술', description: '치명타 확률과 피해를 올린다.', baseCost: 14 },
  { id: 'steadyGrip', name: '다시 잡는 손', description: '루프 시작 HP를 올린다.', baseCost: 9 },
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
