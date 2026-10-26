import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [currentPosition, setCurrentPosition] = useState(0);

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
        </div>

        <form action="" onSubmit={(event) => {
          event.preventDefault();

          console.log('event :>> ', event);

          const moveStep = event.target.querySelector('#movementStep').value;

          setCurrentPosition((prev) => prev + Number(moveStep));
        }}>
          <input type="number" name="movementStep" id="movementStep" min={1} max={6} />

          <button type="submit" className="counter">Current position : {currentPosition}</button>
        </form>
      </section>
    </>
  )
}

export default App
