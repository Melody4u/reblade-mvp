import { PixelHero } from './PixelHero'
import type { GameState } from '../game/types'

interface Props {
  state: GameState
  onTick(): void
}

export function BattleScreen({ state, onTick }: Props) {
  const hpRatio = state.run.hp / state.run.maxHp
  const enemyRatio = state.run.enemy.hp / state.run.enemy.maxHp
  return (
    <section className="panel battle-panel">
      <div className="battle-header">
        <div>
          <p className="eyebrow">Current Loop</p>
          <h2>{state.run.floor}층</h2>
        </div>
        <button className="primary" type="button" onClick={onTick}>수동 진행</button>
      </div>

      <PixelHero hpRatio={hpRatio} />

      <div className="combat-bars">
        <label>
          <span>리아 HP {state.run.hp}/{state.run.maxHp}</span>
          <meter min="0" max="1" value={hpRatio} />
        </label>
        <label>
          <span>{state.run.enemy.name} {Math.max(0, state.run.enemy.hp)}/{state.run.enemy.maxHp}</span>
          <meter min="0" max="1" value={enemyRatio} />
        </label>
      </div>

      <div className="stat-grid small">
        <span>검 위력 <b>{state.run.bladePower}</b></span>
        <span>처치 <b>{state.run.totalKills}</b></span>
        <span>각인 <b>{state.run.choicesTaken.length}</b></span>
        <span>루프 <b>{state.permanent.loopCount}</b></span>
      </div>
    </section>
  )
}
