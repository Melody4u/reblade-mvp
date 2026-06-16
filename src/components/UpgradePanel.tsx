import { EQUIPMENT, UPGRADES, equipmentCost, purchaseEquipmentUpgrade, purchaseUpgrade, upgradeCost } from '../game/engine'
import type { GameState } from '../game/types'

interface Props {
  state: GameState
  setState(state: GameState): void
}

export function UpgradePanel({ state, setState }: Props) {
  return (
    <section className="panel upgrade-panel">
      <p className="eyebrow">Upgrade</p>
      <h2>장비와 기억 강화</h2>

      <div className="upgrade-section">
        <p className="muted">골드: <b>{state.permanent.gold}</b></p>
        <div className="upgrade-list">
          {EQUIPMENT.map((equipment) => {
            const level = state.permanent.equipment[equipment.id]
            const cost = equipmentCost(state, equipment.id)
            const affordable = state.permanent.gold >= cost
            return (
              <button
                className="upgrade-card gold-upgrade"
                disabled={!affordable}
                key={equipment.id}
                type="button"
                onClick={() => setState(purchaseEquipmentUpgrade(state, equipment.id))}
              >
                <span><strong>{equipment.name}</strong> Lv.{level}</span>
                <small>{equipment.description}</small>
                <b>{cost} 골드</b>
              </button>
            )
          })}
        </div>
      </div>

      <div className="upgrade-section memory-section">
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
      </div>
    </section>
  )
}
