// Anchor coordinates refer to the original 1024 x 1536 PNGs.
// Ladder anchors are the midpoints between the rails; snake anchors are head/tail.
export const artworkAnchors = {
  ladder: {
    source: { x: 312, y: 1419 },
    destination: { x: 794, y: 126 },
    width: 480,
  },
  snake: {
    source: { x: 790, y: 100 },
    destination: { x: 194, y: 1480 },
    width: 850,
  },
}

export function getArtworkTransform(source, destination, artwork, maxWidth) {
  const imageDx = artwork.destination.x - artwork.source.x
  const imageDy = artwork.destination.y - artwork.source.y
  const imageLength = Math.hypot(imageDx, imageDy)
  const dx = destination.x - source.x
  const dy = destination.y - source.y
  const length = Math.hypot(dx, dy)
  const scaleAlong = length / imageLength
  const scaleAcross = Math.min(scaleAlong, maxWidth / artwork.width)

  // CSS transforms apply right to left: move the source anchor to the origin,
  // straighten the artwork, size it, rotate toward the destination, then place it.
  return [
    `translate(${source.x}px, ${source.y}px)`,
    `rotate(${Math.atan2(dy, dx)}rad)`,
    `scale(${scaleAlong}, ${scaleAcross})`,
    `rotate(${-Math.atan2(imageDy, imageDx)}rad)`,
    `translate(${-artwork.source.x}px, ${-artwork.source.y}px)`,
  ].join(' ')
}
