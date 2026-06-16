import { UPGRADES, purchaseUpgrade, upgradeCost } from '../game/engine'
import type { GameState } from '../game/types'

interface Props {
  state: GameState
  setState(state: GameState): void
}

export function UpgradePanel({ state, setState }: Props) {
  return (
    <section className="panel">
      <p className="eyebrow">Permanent Memory</p>
      <h2>기억 강화</h2>
      <p className="muted">기억 조각: <b>{state.permanent.memoryShards}</b></p>
      <div className="upgrade-list">
        {UPGRADES.map((upgrade) => {
          const level = state.permanent.upgrades[upgrade.id]
          const cost = upgradeCost(state, upgrade.id)
          const affordable = state.permanent.memoryShards >= cost
          return (
            <button
              className="upgrade-card"
              disabled={!affordable}
              key={upgrade.id}
              type="button"
              onClick={() => setState(purchaseUpgrade(state, upgrade.id))}
            >
              <span><strong>{upgrade.name}</strong> Lv.{level}</span>
              <small>{upgrade.description}</small>
              <b>{cost} 조각</b>
            </button>
          )
        })}
      </div>
    </section>
  )
}
