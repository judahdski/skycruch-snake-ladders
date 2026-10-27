import test from 'node:test'
import assert from 'node:assert/strict'
import { choosePlacement, createPlacementPlan } from './floatingTextLayout.js'

function seededRandom(seed = 17) {
  let state = seed
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

const base = { width: 200, height: 200, textWidth: 40, textHeight: 20 }
const corners = [
  { zone: 'top-left', u: 0, v: 0 },
  { zone: 'bottom-right', u: 1, v: 1 },
]

test('plans cover nine balanced areas, with jitter and reproducible injected randomness', () => {
  const plan = createPlacementPlan(seededRandom())
  assert.deepEqual(plan, createPlacementPlan(seededRandom()))
  assert.equal(plan.length, 72)
  const counts = new Map()
  for (const candidate of plan) {
    assert(candidate.u > 0 && candidate.u < 1)
    assert(candidate.v > 0 && candidate.v < 1)
    counts.set(candidate.zone, (counts.get(candidate.zone) ?? 0) + 1)
  }
  assert.equal(counts.size, 9)
  assert([...counts.values()].every((count) => count === 8))
  assert(new Set(plan.map(({ u, v }) => `${u}:${v}`)).size > 65)
})

test('every anchor stays fully inside normal and tight board bounds', () => {
  const plan = createPlacementPlan(seededRandom())
  for (const [width, height, textWidth, textHeight] of [[480, 510, 110, 26], [180, 90, 150, 60], [100, 30, 100, 30]]) {
    for (const candidate of plan) {
      const result = choosePlacement({ width, height, textWidth, textHeight, candidates: [candidate] })
      assert(result.x >= 0 && result.y >= 0)
      assert(result.x + textWidth <= width + 1e-8)
      assert(result.y + textHeight <= height + 1e-8)
      if (width === 480) assert(result.x >= 12 && result.y >= 12)
    }
  }
})

test('a clear area beats player overlap even when history and preferred anchor favor the overlap', () => {
  const result = choosePlacement({
    ...base, candidates: corners, preferredIndex: 0,
    history: [{ zone: 'bottom-right', u: 1, v: 1 }],
    obstacles: [{ x: -20, y: -20, width: 120, height: 120, hard: true, weight: 1 }],
  })
  assert.equal(result.index, 1)
})

test('unavoidable hard obstacles choose the least overlapping candidate without leaving bounds', () => {
  const result = choosePlacement({
    ...base, candidates: corners,
    obstacles: [
      { x: 0, y: 0, width: 200, height: 200, hard: true },
      { x: 0, y: 0, width: 100, height: 100, hard: true },
    ],
  })
  assert.equal(result.index, 1)
  assert(result.x + base.textWidth <= base.width)
})

test('snake or ladder body corridors are avoided when an otherwise equal area is clear', () => {
  const result = choosePlacement({
    ...base,
    candidates: [{ zone: 'middle', u: 0.5, v: 0.5 }, { zone: 'top', u: 0.5, v: 0.1 }],
    segments: [{ start: { x: 0, y: 100 }, end: { x: 200, y: 100 }, radius: 6, weight: 8 }],
  })
  assert.equal(result.index, 1)
})

test('recent positions discourage repeated zones and nearby anchors', () => {
  const candidates = [corners[0], { zone: 'middle', u: 0.5, v: 0.5 }, corners[1]]
  assert.equal(choosePlacement({ ...base, candidates }).index, 0)
  const next = choosePlacement({ ...base, candidates, history: [corners[0]] })
  assert.notEqual(next.zone, 'top-left')
  assert(Math.hypot(next.u, next.v) > 0.5)
})

test('resize is deterministic and keeps a safe preferred anchor despite its history entry', () => {
  const candidates = createPlacementPlan(seededRandom())
  const first = choosePlacement({ ...base, candidates })
  const options = {
    ...base, width: 360, height: 240, candidates,
    preferredIndex: first.index, history: [first],
  }
  const oldRandom = Math.random
  Math.random = () => { throw new Error('Selection must not draw randomness') }
  try {
    const resized = choosePlacement(options)
    assert.equal(resized.index, first.index)
    assert.equal(resized.u, first.u)
    assert.equal(resized.v, first.v)
    assert.deepEqual(resized, choosePlacement(options))
    assert.notEqual(resized.x, first.x)
  } finally {
    Math.random = oldRandom
  }
})

test('selection is pure and ignores malformed candidate coordinates', () => {
  const candidates = Object.freeze([
    Object.freeze({ zone: 'invalid', u: Number.NaN, v: 0 }),
    Object.freeze(corners[1]),
  ])
  assert.equal(choosePlacement({ ...base, candidates }).index, 1)
})

test('empty, invalid, or impossible measurements produce no placement', () => {
  for (const overrides of [
    { width: 0 }, { height: -1 }, { textWidth: Number.NaN }, { textHeight: 0 },
    { textWidth: 201 }, { textHeight: 201 }, { candidates: [] },
  ]) {
    assert.equal(choosePlacement({ ...base, candidates: corners, ...overrides }), null)
  }
})
