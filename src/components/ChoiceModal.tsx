import type { Choice } from '../game/types'

interface Props {
  choices: Choice[]
  onChoose(choice: Choice): void
}

export function ChoiceModal({ choices, onChoose }: Props) {
  if (choices.length === 0) return null
  const title = choices[0].kind === 'imprint' ? '검의 각인이 깨어났다' : '리아가 기억의 파편을 떠올렸다'
  return (
    <div className="modal-backdrop">
      <section className="choice-modal" aria-label="3택 선택지">
        <p className="eyebrow">3택 선택</p>
        <h2>{title}</h2>
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
