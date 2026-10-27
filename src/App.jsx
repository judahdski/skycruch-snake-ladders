import { useState } from 'react'

import './App.css'
import './RulesList.css'

import { gameStates, positionDisplay, rules, sourceDestPairs } from './contracts'

import Block from './Block'
import BoardOverlay from './BoardOverlay'
import WinnerOverlay from './WinnerOverlay'
import ResetButton from './ResetButton'
import FloatingPositionText from './FloatingPositionText'

function App() {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [moveInput, setMoveInput] = useState(1);
  const [positionDisplayText, setPositionDisplayText] = useState('');
  const [gridSize, setGridSize] = useState(100);
  const [winCount, setWinCount] = useState(0);


  const onRoll = () => {
    const validateInput = (inputNum) => {
      // console.log('moveInput :>> ', moveInput);
      // console.log('typeof moveInput :>> ', typeof moveInput);
      // console.log('!Number.isInteger(inputNum) :>> ', !Number.isInteger(inputNum));
      // console.log('Number(inputNum) > 6 && Number(inputNum) < 1 :>> ', Number(inputNum) > 6 && Number(inputNum) < 1);

      if (!Number.isInteger(inputNum)) return false;
      if (Number(inputNum) > 6 && Number(inputNum) < 1) return false;

      return true;
    }

    const calculateDisplayText = (currPosition) => {
      console.log('currPosition :>> ', currPosition);

      const convertedText = positionDisplay.map(([divisor, output]) => {
        if ((currPosition % divisor) === 0) {
          console.log(divisor, output);
          console.log('currPosition :>> ', currPosition);
          console.log(`${currPosition} % ${divisor} :>> ${currPosition % divisor}`);

          return output;
        }

        return '';
      })

      return convertedText.join('')
    }

    const calculatedNum = (prev) => {
      if (validateInput(moveInput)) {
        let newPosition = prev + Number(moveInput);

        const matchedIndex = sourceDestPairs.findIndex((arr) => {
          // console.log('arr[0] === newPosition :>> ', arr[0] === newPosition);
          // console.log('arr :>> ', arr);
          return arr[0] === newPosition;
        }) ?? -1;

        // console.log('matchedIndex :>> ', matchedIndex);

        if (newPosition >= gameStates.finalPosition) {
          newPosition = gameStates.finalPosition;

          setWinCount(winCount + 1);
        } else if (matchedIndex >= 0) {
          newPosition = sourceDestPairs[matchedIndex][1];
        }

        const displayText = calculateDisplayText(newPosition);


        setPositionDisplayText(displayText);

        return newPosition;
      }
      else return -1;

    }

    setCurrentPosition(calculatedNum);
  };

  const onInputChange = (e) => setMoveInput(Number(e.target.value))

  const onReset = () => {
    setCurrentPosition(gameStates.initialPosition);
    setMoveInput(1);
    setPositionDisplayText('');
  };

  return (
    <section id="center">
      <div className="block-wrapper">
        {
          (new Array(gridSize).fill(0).map((_, ind) => {
            const COLS = 10;

            // cari tau mana yang colIndex dan rowIndex
            const rowIndex = Math.floor(ind / COLS)
            const colIndex = ind % COLS;

            // kalo row ganjil, diputer urutan angkanya
            const numberr = (rowIndex % 2 === 1 ? (rowIndex * COLS) + (COLS - 1 - colIndex) : ind) + 1;

            return (<Block key={numberr} number={numberr} isHighlighted={numberr === currentPosition} />)
          }))
        }

        {/* AI-generated */}
        <BoardOverlay currentPosition={currentPosition} />
        <FloatingPositionText text={positionDisplayText} />
        {/* AI-generated */}

        {currentPosition === gameStates.finalPosition && <WinnerOverlay />}

        <p className='win-counter'>Win counter : {winCount}</p>
      </div>

      <div className="left-mainboard">
        {
          currentPosition === gameStates.finalPosition
            ? <ResetButton onReset={onReset} />
            : <div className="input-moveStep">
              <input type="number" className='counter' min={1} max={6} value={moveInput} onChange={onInputChange} />

              <button type="button" className="btn counter" onClick={onRoll}>Move!</button>
            </div>
        }

        <section className="rules-list" aria-labelledby="rules-list-title">
          <h2 id="rules-list-title" className="rules-list__title">
            <span className="rules-list__info" aria-hidden="true" />
            Rules List
          </h2>
          <ol className="rules-list__items" role="list">
            {rules.map((rule, index) => (
              <li key={index} className="rules-list__item">
                <span className="rules-list__number" aria-hidden="true">{index + 1}</span>
                <p className="rules-list__copy">{rule}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  )
}

export default App
