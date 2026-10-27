const Block = ({ number, isHighlighted }) => {
  return (
    <div className={`block ${isHighlighted ? 'block-highlighted' : ''}`}>{number}</div>
  )
}

export default Block