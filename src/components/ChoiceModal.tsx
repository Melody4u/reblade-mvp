import type { Choice, TraitRarity } from '../game/types'

interface Props {
  choices: Choice[]
  onChoose(choice: Choice): void
}

const rarityLabel: Record<TraitRarity, string> = {
  common: '평범',
  rare: '희귀',
  legendary: '전설',
  mythic: '신화',
}

export function ChoiceModal({ choices, onChoose }: Props) {
  if (choices.length === 0) return null
  return (
    <div className="modal-backdrop">
      <section className="choice-modal" aria-label="다음 던전 특성 선택지">
        <p className="eyebrow">Before Next Loop</p>
        <h2>다음 던전에 가져갈 특성 선택</h2>
        <p className="muted">검이 부러진 뒤 떠오른 기억입니다. 등급이 높을수록 이번 던전의 빌드가 크게 바뀝니다.</p>
        <div className="choice-list trait-list">
          {choices.map((choice) => (
            <button className={`choice-card trait-card rarity-${choice.rarity}`} key={choice.id} type="button" onClick={() => onChoose(choice)}>
              <span className="rarity-badge">{rarityLabel[choice.rarity]}</span>
              <strong>{choice.name}</strong>
              <span>{choice.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
