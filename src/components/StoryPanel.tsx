import type { GameState } from '../game/types'

export function StoryPanel({ state }: { state: GameState }) {
  return (
    <section className="panel story-panel">
      <p className="eyebrow">Prologue</p>
      <h2>검이 부러지면, 시간은 다시 시작된다</h2>
      <p>
        언니는 던전의 끝을 보겠다고 말했다. 그리고 돌아오지 않았다. 남은 것은 금이 간 검 한 자루.
        리아는 검이 부러지는 순간마다 처음으로 돌아오지만, 이전 루프의 기억만은 잃지 않는다.
      </p>
      <div className="log-box">
        {state.log.map((entry, index) => <p key={`${entry}-${index}`}>{entry}</p>)}
      </div>
    </section>
  )
}
