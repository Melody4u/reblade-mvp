export function PixelHero({ hpRatio }: { hpRatio: number }) {
  const tired = hpRatio < 0.35
  return (
    <div className={`pixel-stage ${tired ? 'is-tired' : ''}`} aria-label="도트 리아 전투 스프라이트">
      <div className="time-ring ring-one" />
      <div className="time-ring ring-two" />
      <div className="pixel-moon" />
      <div className="pixel-companion" aria-hidden="true">
        <span className="wing" />
        <span className="beak" />
        <span className="clock" />
      </div>
      <div className="pixel-hero">
        <div className="ahoge" />
        <div className="hair" />
        <div className="face" />
        <div className="coat" />
        <div className="body" />
        <div className="belt" />
        <div className="pouch" />
        <div className="leg left" />
        <div className="leg right" />
      </div>
      <div className="pixel-sword">
        <span className="blade" />
        <span className="guard" />
        <span className="clock-core" />
      </div>
      <div className="pixel-enemy">
        <div className="eye left" />
        <div className="eye right" />
      </div>
      <div className="floor-shadow" />
    </div>
  )
}
