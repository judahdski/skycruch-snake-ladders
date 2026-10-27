const zones = [
  ['top-left', 0.14, 0.15], ['top', 0.49, 0.10], ['top-right', 0.86, 0.20],
  ['left', 0.08, 0.52], ['middle', 0.51, 0.48], ['right', 0.91, 0.53],
  ['bottom-left', 0.20, 0.87], ['bottom', 0.55, 0.91], ['bottom-right', 0.86, 0.82],
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// Build once per changed result. Reuse the same plan for measurement and resize.
export function createPlacementPlan(random = Math.random) {
  const candidates = zones.flatMap(([zone, u, v]) => Array.from({ length: 8 }, () => ({
    zone,
    u: clamp(u + (random() - 0.5) * 0.21, 0.015, 0.985),
    v: clamp(v + (random() - 0.5) * 0.21, 0.015, 0.985),
  })))

  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1))
    ;[candidates[index], candidates[other]] = [candidates[other], candidates[index]]
  }
  return candidates
}

function overlapArea(a, b) {
  const width = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x))
  const height = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y))
  return width * height
}

function crossesSegment(rect, { start, end, radius = 0 }) {
  let enter = 0
  let exit = 1
  for (const axis of ['x', 'y']) {
    const min = rect[axis] - radius
    const max = rect[axis] + (axis === 'x' ? rect.width : rect.height) + radius
    const delta = end[axis] - start[axis]
    if (Math.abs(delta) < 1e-8) {
      if (start[axis] < min || start[axis] > max) return false
    } else {
      const first = (min - start[axis]) / delta
      const last = (max - start[axis]) / delta
      enter = Math.max(enter, Math.min(first, last))
      exit = Math.min(exit, Math.max(first, last))
      if (enter > exit) return false
    }
  }
  return true
}

function repetitionCost(candidate, history) {
  return history.slice(0, 3).reduce((cost, previous, index) => {
    const distanceSquared = (candidate.u - previous.u) ** 2 + (candidate.v - previous.v) ** 2
    const repeatedZone = candidate.zone === previous.zone ? 32 : 0
    return cost + (repeatedZone + 30 * Math.exp(-distanceSquared / 0.04)) / (index + 1)
  }, 0)
}

// Pure selection: no randomness, DOM access, or mutation of the supplied plan.
export function choosePlacement({
  width, height, textWidth, textHeight, candidates,
  obstacles = [], segments = [], history = [], preferredIndex = null,
}) {
  const dimensions = [width, height, textWidth, textHeight]
  if (!dimensions.every((value) => Number.isFinite(value) && value > 0)
    || textWidth > width || textHeight > height || !candidates?.length) return null

  const margin = clamp(Math.min(width, height) * 0.04, 12, 20)
  const paddingX = Math.min(margin, (width - textWidth) / 2)
  const paddingY = Math.min(margin, (height - textHeight) / 2)
  const availableX = Math.max(0, width - textWidth - paddingX * 2)
  const availableY = Math.max(0, height - textHeight - paddingY * 2)
  const area = textWidth * textHeight
  const ranked = []

  candidates.forEach((candidate, index) => {
    if (!Number.isFinite(candidate.u) || !Number.isFinite(candidate.v)) return
    const placement = {
      x: paddingX + clamp(candidate.u, 0, 1) * availableX,
      y: paddingY + clamp(candidate.v, 0, 1) * availableY,
      index,
      zone: candidate.zone,
      u: clamp(candidate.u, 0, 1),
      v: clamp(candidate.v, 0, 1),
    }
    const rect = { ...placement, width: textWidth, height: textHeight }
    let hard = 0
    let soft = 0
    for (const obstacle of obstacles) {
      const cost = overlapArea(rect, obstacle) / area * (obstacle.weight ?? 1)
      if (obstacle.hard) hard += cost
      else soft += cost
    }
    for (const segment of segments) {
      if (crossesSegment(rect, segment)) soft += segment.weight ?? 1
    }
    ranked.push({ placement, hard, soft, score: soft + repetitionCost(placement, history) })
  })
  if (!ranked.length) return null

  // A safe candidate always beats one touching a hard obstacle, irrespective of history.
  const minimumHard = Math.min(...ranked.map((candidate) => candidate.hard))
  const safest = ranked.filter((candidate) => candidate.hard <= minimumHard + 1e-8)
  const preferred = safest.find((candidate) => candidate.placement.index === preferredIndex)
  const minimumSoft = Math.min(...safest.map((candidate) => candidate.soft))

  // Preserve the chosen anchor during resize unless its collision cost materially worsens.
  if (preferred && preferred.soft <= minimumSoft + 3) return preferred.placement
  return safest.reduce((best, candidate) => candidate.score < best.score ? candidate : best).placement
}
