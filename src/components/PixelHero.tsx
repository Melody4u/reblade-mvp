export function PixelHero({ hpRatio }: { hpRatio: number }) {
  const tired = hpRatio < 0.35
  return (
    <div className={`pixel-stage ${tired ? 'is-tired' : ''}`} aria-label="도트 리아 전투 스프라이트">
      <div className="pixel-moon" />
      <div className="pixel-hero">
        <div className="hair" />
        <div className="face" />
        <div className="body" />
        <div className="cape" />
        <div className="leg left" />
        <div className="leg right" />
      </div>
      <div className="pixel-sword">
        <span />
      </div>
      <div className="pixel-enemy">
        <div className="eye left" />
        <div className="eye right" />
      </div>
      <div className="floor-shadow" />
    </div>
  )
}
