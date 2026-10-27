// Inline the extensionless PNG so production does not depend on its filename.
import winnerBadge from './assets/win-badge?url&inline'
import './WinnerOverlay.css'

export default function WinnerOverlay() {
  return (
    <div className="winner-overlay" role="status">
      <img
        className="winner-overlay__badge"
        src={winnerBadge}
        alt="You win!"
        width={1536}
        height={1024}
        draggable={false}
      />
    </div>
  )
}
