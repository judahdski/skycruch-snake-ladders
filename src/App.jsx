import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { gameStates, positionDisplay, sourceDestPairs } from './rules'

function App() {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [moveInput, setMoveInput] = useState(1);
  const [positionDisplayText, setPositionDisplayText] = useState('');

  return (
    <>
      <section id="center">
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
