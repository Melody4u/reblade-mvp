import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { BattleScreen } from './components/BattleScreen'
import { ChoiceModal } from './components/ChoiceModal'
import { StoryPanel } from './components/StoryPanel'
import { UpgradePanel } from './components/UpgradePanel'
import { applyChoice, createNewGame, getAvailableChoices, resolveOfflineRewards, tickBattle } from './game/engine'
import { clearGame, loadGame, saveGame } from './game/storage'
import type { GameState } from './game/types'

function initializeGame(): GameState {
  const loaded = loadGame()
  if (loaded) return resolveOfflineRewards(loaded)
  return createNewGame()
}

function App() {
  const [state, setState] = useState<GameState>(() => initializeGame())
  const [tab, setTab] = useState<'battle' | 'upgrade' | 'story'>('battle')
  const choices = useMemo(() => getAvailableChoices(state), [state])

  useEffect(() => {
    saveGame(state)
  }, [state])

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((current) => {
        if (getAvailableChoices(current).length > 0) return current
        return tickBattle(current)
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  function resetGame() {
    clearGame()
    setState(createNewGame())
    setTab('battle')
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Idle Roguelite MVP</p>
          <h1>Re:Blade</h1>
        </div>
        <button className="ghost" type="button" onClick={resetGame}>초기화</button>
      </header>

      <section className="resource-strip" aria-label="주요 자원">
        <span>최고층 <b>{state.records.highestFloor}</b></span>
        <span>골드 <b>{state.run.gold}</b></span>
        <span>기억 <b>{state.permanent.memoryShards}</b></span>
      </section>

      {tab === 'battle' && <BattleScreen state={state} onTick={() => setState(tickBattle(state))} />}
      {tab === 'upgrade' && <UpgradePanel state={state} setState={setState} />}
      {tab === 'story' && <StoryPanel state={state} />}

      <nav className="bottom-tabs" aria-label="하단 탭">
        <button className={tab === 'battle' ? 'active' : ''} type="button" onClick={() => setTab('battle')}>전투</button>
        <button className={tab === 'upgrade' ? 'active' : ''} type="button" onClick={() => setTab('upgrade')}>강화</button>
        <button className={tab === 'story' ? 'active' : ''} type="button" onClick={() => setTab('story')}>기억</button>
      </nav>

      <ChoiceModal choices={choices} onChoose={(choice) => setState(applyChoice(state, choice))} />
    </main>
  )
}

export default App
