const Block = ({ number, isHighlighted }) => {
  return (
    <div className={`block ${isHighlighted ? 'block-highlighted' : ''}`}>
      <span>{number}</span>
    </div>
  )
}

export default Block