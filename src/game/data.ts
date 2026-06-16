import type { Choice, Enemy, EquipmentDefinition, UpgradeDefinition } from './types'

export const BOSS_FLOORS = [20, 40, 60]

export const TRAIT_CHOICES: Choice[] = [
  { id: 'flame', kind: 'trait', rarity: 'common', name: '불꽃 각인', description: '공격력 +15%. 칼날에 작은 불씨가 붙는다.', effect: { attackMultiplier: 0.15 } },
  { id: 'blood', kind: 'trait', rarity: 'common', name: '피의 각인', description: '흡혈 +3%. 전투가 길수록 조금 더 버틴다.', effect: { lifesteal: 0.03 } },
  { id: 'guard', kind: 'trait', rarity: 'common', name: '수호 각인', description: '보호막 +12. 다음 던전의 초반 안정성이 오른다.', effect: { shield: 12 } },
  { id: 'edge', kind: 'trait', rarity: 'common', name: '칼날 각인', description: '치명타 확률 +8%. 기본 검격이 날카로워진다.', effect: { critChance: 0.08 } },

  { id: 'thunder', kind: 'trait', rarity: 'rare', name: '번개 각인', description: '추가타 확률 +24%. 검 끝에 튀는 번개가 적을 한 번 더 긁는다.', effect: { extraStrikeChance: 0.24 } },
  { id: 'gold-spark', kind: 'trait', rarity: 'rare', name: '황금 균열', description: '골드 획득 +45%. 시간의 균열에서 금빛 파편이 떨어진다.', effect: { goldMultiplier: 0.45 } },
  { id: 'mirror-step', kind: 'trait', rarity: 'rare', name: '거울 발걸음', description: '회피 +9%, 받는 피해 -5%. 이전 루프의 발자국을 따라간다.', effect: { dodge: 0.09, incomingDamageMultiplier: -0.05 } },
  { id: 'deep-cut', kind: 'trait', rarity: 'rare', name: '깊은 상처', description: '치명타 피해 +55%. 같은 상처를 기억해 더 깊게 벤다.', effect: { critDamage: 0.55 } },

  { id: 'sister-echo', kind: 'trait', rarity: 'legendary', name: '언니의 잔향', description: '추가타 확률 +80%, 추가 검격은 공격력의 일부로 두 번 울린다.', effect: { extraStrikeChance: 0.8, attackMultiplier: 0.18 } },
  { id: 'last-breath', kind: 'trait', rarity: 'legendary', name: '마지막 호흡', description: '흡혈 +12%, 보호막 +35. 부러지기 직전의 호흡을 되찾는다.', effect: { lifesteal: 0.12, shield: 35 } },
  { id: 'boss-memory', kind: 'trait', rarity: 'legendary', name: '보스의 사각', description: '보스 피해 +65%, 치명타 확률 +10%. 죽기 전 본 빈틈을 기억한다.', effect: { bossDamage: 0.65, critChance: 0.1 } },

  { id: 'chronos-mercy', kind: 'trait', rarity: 'mythic', name: '시간의 자비', description: '받는 피해 -18%, 흡혈 +20%, 보호막 +60. 던전당 한 번 죽음을 빗겨낸 듯 버틴다.', effect: { incomingDamageMultiplier: -0.18, lifesteal: 0.2, shield: 60 } },
  { id: 'reblade-awakening', kind: 'trait', rarity: 'mythic', name: 'Re:Blade 각성', description: '공격력 +55%, 보스 피해 +45%, 추가타 확률 +40%. 검이 이전 루프의 모든 파손을 기억한다.', effect: { attackMultiplier: 0.55, bossDamage: 0.45, extraStrikeChance: 0.4 } },
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
