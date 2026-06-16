import type { Choice } from '../game/types'

interface Props {
  choices: Choice[]
  onChoose(choice: Choice): void
}

export function ChoiceModal({ choices, onChoose }: Props) {
  if (choices.length === 0) return null
  return (
    <div className="modal-backdrop">
      <section className="choice-modal" aria-label="다음 던전 특성 선택지">
        <p className="eyebrow">Before Next Loop</p>
        <h2>다음 던전에 가져갈 특성 선택</h2>
        <p className="muted">검이 부러진 뒤 떠오른 기억입니다. 하나를 고르면 다시 자동 등반을 시작합니다.</p>
        <div className="choice-list">
          {choices.map((choice) => (
            <button className="choice-card" key={choice.id} type="button" onClick={() => onChoose(choice)}>
              <strong>{choice.name}</strong>
              <span>{choice.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
