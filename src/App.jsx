import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { gameStates, positionDisplay, sourceDestPairs } from './rules'
import Block from './Block'

function App() {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [moveInput, setMoveInput] = useState(1);
  const [positionDisplayText, setPositionDisplayText] = useState('');
  const [gridSize, setGridSize] = useState(100);

  return (
    <>
      <section id="center">
        <div className="block-wrapper">
          {(new Array(gridSize).fill(0).map((_, ind) => {
            const COLS = 10;

            // cari tau dimana colIndex dan rowIndex
            const rowIndex = Math.floor(ind / COLS)
            const colIndex = ind % COLS;

            // kalo row ganjil, diputer angkanya
            const numberr = (rowIndex % 2 === 1 ? (rowIndex * COLS) + (COLS - 1 - colIndex) : ind) + 1;

            return (<Block key={numberr} number={numberr} isHighlighted={numberr === currentPosition} />)
          }))}
        </div>

        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Snakes & Ladders</h1>
          <p>positionDisplayText : {positionDisplayText}</p>
        </div>

        <form action="" onSubmit={(event) => {
          event.preventDefault();

          const validateInput = (inputNum) => {
            console.log('moveInput :>> ', moveInput);
            console.log('typeof moveInput :>> ', typeof moveInput);
            console.log('!Number.isInteger(inputNum) :>> ', !Number.isInteger(inputNum));
            console.log('Number(inputNum) > 6 && Number(inputNum) < 1 :>> ', Number(inputNum) > 6 && Number(inputNum) < 1);

            if (!Number.isInteger(inputNum)) return false;
            if (Number(inputNum) > 6 && Number(inputNum) < 1) return false;

            return true;
          }

          const calculatedNum = (prev) => {
            if (validateInput(moveInput)) {
              let newPosition = prev + Number(moveInput);

              const matchedIndex = sourceDestPairs.findIndex((arr) => {
                console.log('arr[0] === newPosition :>> ', arr[0] === newPosition);
                console.log('arr :>> ', arr);
                return arr[0] === newPosition;
              }) ?? -1;

              console.log('matchedIndex :>> ', matchedIndex);

              if (newPosition > gameStates.finalPosition) {
                newPosition = gameStates.finalPosition
              } else if (matchedIndex >= 0) {
                newPosition = sourceDestPairs[matchedIndex][1];
              }

              return newPosition;
            }
            else return -1;
          }

          setCurrentPosition(calculatedNum);

          const calculateDisplayText = () => {
            const convertedText = positionDisplay.map(([divisor, output]) => {
              console.log(divisor, output);
              console.log('currentPosition :>> ', currentPosition);
              console.log('currentPosition % divisor :>> ', currentPosition % divisor);

              if ((currentPosition % divisor) == 0) return output;

              return '';
            })

            return convertedText.join('')
          }

          setPositionDisplayText(calculateDisplayText)
        }}>
          <input type="number" min={1} max={6} value={moveInput} onChange={(e) => setMoveInput(Number(e.target.value))} />

          <button type="submit" className="counter">Current position : {currentPosition}</button>
        </form>
      </section>
    </>
  )
}

export default App
