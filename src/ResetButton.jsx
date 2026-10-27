import './ResetButton.css'

export default function ResetButton({ onReset }) {
  return (
    <button type="button" className="reset-game-button" onClick={onReset}>
      <span className="reset-game-button__icon" aria-hidden="true">↻</span>
      <span>Reset Game</span>
    </button>
  )
}
