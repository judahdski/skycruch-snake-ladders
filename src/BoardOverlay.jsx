import { useLayoutEffect, useRef, useState } from 'react'
import ladderImage from './assets/ladder.png'
import snakeImage from './assets/snake.png'
import { sourceDestPairs } from './contracts'
import { artworkAnchors, getArtworkTransform } from './boardOverlayGeometry'
import './BoardOverlay.css'

const images = { ladder: ladderImage, snake: snakeImage }

export default function BoardOverlay({ currentPosition }) {
  const overlayRef = useRef(null)
  const [connections, setConnections] = useState([])
  const [labels, setLabels] = useState([])

  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const board = overlay.parentElement
    const blocks = Array.from(board.querySelectorAll(':scope > .block'))

    const measure = () => {
      const origin = overlay.getBoundingClientRect()
      const cells = new Map(blocks.map((block) => {
        const rect = block.getBoundingClientRect()

        // Read the existing labels so Block and its serpentine rendering stay intact.
        return [Number(block.textContent), {
          x: rect.left + rect.width / 2 - origin.left,
          y: rect.top + rect.height / 2 - origin.top,
          width: rect.width,
          labelStyle: {
            left: rect.left + block.clientLeft - origin.left,
            top: rect.top + block.clientTop - origin.top,
            width: block.clientWidth,
          },
        }]
      }))

      // Repaint labels above the artwork without changing the original blocks.
      setLabels(Array.from(cells, ([number, cell]) => ({ number, style: cell.labelStyle })))

      setConnections(sourceDestPairs.flatMap(([source, destination]) => {
        const start = cells.get(source)
        const end = cells.get(destination)
        if (!start || !end) return []

        const type = source < destination ? 'ladder' : 'snake'

        return [{
          source,
          destination,
          type,
          transform: getArtworkTransform(
            start,
            end,
            artworkAnchors[type],
            Math.min(start.width, end.width) * 0.8,
          ),
        }]
      }))
    }

    // The observer runs once on mount and again when the layout changes size.
    const observer = new ResizeObserver(measure)
    observer.observe(board, { box: 'border-box' })
    blocks.forEach((block) => observer.observe(block))

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={overlayRef} className="board-overlay" aria-hidden="true">
      {connections.map(({ source, destination, type, transform }) => (
        <img
          key={`${source}-${destination}`}
          className={`board-overlay__image board-overlay__image--${type}`}
          src={images[type]}
          alt=""
          draggable={false}
          width={1024}
          height={1536}
          data-source={source}
          data-destination={destination}
          style={{ transform }}
        />
      ))}
      {labels.map(({ number, style }) => (
        <span
          key={number}
          className={`board-overlay__number${number === currentPosition ? ' board-overlay__number--highlighted' : ''}`}
          style={style}
        >
          {number}
        </span>
      ))}
    </div>
  )
}
