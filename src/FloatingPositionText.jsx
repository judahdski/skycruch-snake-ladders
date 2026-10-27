import { useLayoutEffect, useRef } from 'react'
import { sourceDestPairs } from './contracts'
import { choosePlacement, createPlacementPlan } from './floatingTextLayout'
import './FloatingPositionText.css'

const transitionSquares = new Set(sourceDestPairs.flat())

export default function FloatingPositionText({ text }) {
  const layerRef = useRef(null)
  const textRef = useRef(null)
  const layoutRef = useRef({ text: null, candidates: [], selected: null, history: [] })

  useLayoutEffect(() => {
    const layer = layerRef.current
    const label = textRef.current
    const board = layer.parentElement
    const layout = layoutRef.current

    const measure = () => {
      if (layout.text !== text) {
        if (layout.selected) layout.history = [layout.selected, ...layout.history].slice(0, 3)
        layout.text = text
        layout.candidates = text ? createPlacementPlan() : []
        layout.selected = null
      }
      if (!text) {
        label.style.visibility = 'hidden'
        return
      }

      const origin = layer.getBoundingClientRect()
      const size = label.getBoundingClientRect()
      const obstacles = []
      const cells = new Map()

      const localRect = (rect, padding = 0) => ({
        x: rect.left - origin.left - padding,
        y: rect.top - origin.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      })
      const avoid = (element, weight, hard = false, padding = 0) => {
        if (!element) return
        const rect = element.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) obstacles.push({ ...localRect(rect, padding), weight, hard })
      }

      avoid(board.querySelector('.block-highlighted'), 1000, true, 8)
      avoid(board.querySelector('.win-counter'), 1000, true, 8)
      avoid(board.querySelector('.winner-overlay__badge'), 1000, true, 12)

      board.querySelectorAll(':scope > .block').forEach((block) => {
        const number = Number(block.textContent)
        const rect = block.getBoundingClientRect()
        cells.set(number, {
          x: rect.left + rect.width / 2 - origin.left,
          y: rect.top + rect.height / 2 - origin.top,
          width: rect.width,
        })
        if (transitionSquares.has(number)) avoid(block, 6, false, 3)

        // Number labels are soft obstacles, so the text is not locked to cell gaps.
        const range = document.createRange()
        range.selectNodeContents(block.querySelector('span') ?? block)
        const numberRect = range.getBoundingClientRect()
        if (numberRect.width > 0) obstacles.push({ ...localRect(numberRect), weight: 10 })
      })

      // Approximate the artwork with soft corridors, not opaque PNG bounding boxes.
      const segments = sourceDestPairs.flatMap(([source, destination]) => {
        const start = cells.get(source)
        const end = cells.get(destination)
        return start && end ? [{ start, end, radius: Math.min(start.width, end.width) * 0.2, weight: 1 }] : []
      })
      const placement = choosePlacement({
        width: origin.width,
        height: origin.height,
        textWidth: size.width,
        textHeight: size.height,
        candidates: layout.candidates,
        obstacles,
        segments,
        history: layout.history,
        preferredIndex: layout.selected?.index ?? null,
      })

      if (!placement) {
        label.style.visibility = 'hidden'
        return
      }
      layout.selected = placement
      label.style.left = `${placement.x}px`
      label.style.top = `${placement.y}px`
      label.style.visibility = 'visible'
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(board, { box: 'border-box' })
    observer.observe(label, { box: 'border-box' })
    return () => observer.disconnect()
  }, [text])

  return (
    <div ref={layerRef} className="floating-result">
      <p ref={textRef} className="floating-result__text" role="status" aria-atomic="true">{text}</p>
    </div>
  )
}
