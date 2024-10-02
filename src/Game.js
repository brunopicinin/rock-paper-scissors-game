import { useState, useEffect, useCallback } from 'react';
import './Game.css';
import GameUI from './components/GameUI';
import RoboflowModel from './components/RoboflowModel';
import { ROCK, PAPER, SCISSORS, USER, COMP, DRAW, MAX_LIVES } from './constants';

const CHOICES = [ROCK, PAPER, SCISSORS];

let canPlay = true;
let lastChoice = null;
let lastTimestamp = null;

function debouncePlayEvent(choice) {
  if (!choice) {
    // reset
    canPlay = true;
    lastChoice = null;
    lastTimestamp = null;
    return false;
  }

  const now = Date.now();
  if (choice === lastChoice && canPlay) {
    if (now - lastTimestamp > 600) {
      // held choice for enough time
      canPlay = false;
      return true;
    }
  } else {
    lastChoice = choice;
    lastTimestamp = now;
  }

  return false;
}

export function calcRoundWinner(user, comp) {
  if (
    (user === ROCK && comp === SCISSORS) ||
    (user === PAPER && comp === ROCK) ||
    (user === SCISSORS && comp === PAPER)
  ) {
    return USER;
  } else if (
    (user === SCISSORS && comp === ROCK) ||
    (user === ROCK && comp === PAPER) ||
    (user === PAPER && comp === SCISSORS)
  ) {
    return COMP;
  } else {
    return DRAW;
  }
}

function Game() {
  const [isLoading, setIsLoading] = useState(true);

  const [userChoice, setUserChoice] = useState(null);
  const [compChoice, setCompChoice] = useState(null);

  const [userScore, setUserScore] = useState(0);
  const [compScore, setCompScore] = useState(0);

  const [roundWinner, setRoundWinner] = useState(null);
  const [gameWinner, setGameWinner] = useState(null);

  useEffect(() => {
    function handlePlay(event) {
      const choice = event.detail;
      if (debouncePlayEvent(choice)) {
        play(choice);
      }
    }
    window.addEventListener('play', handlePlay);
    return () => {
      window.removeEventListener('play', handlePlay);
    };
  });

  // game logic
  function play(user) {
    if (gameWinner) return;

    // pick a random choice for the computer
    const comp = CHOICES[Math.floor(Math.random() * CHOICES.length)];

    setUserChoice(user);
    setCompChoice(comp);

    // find round winner
    const winner = calcRoundWinner(user, comp);
    setRoundWinner(winner);

    // update score and check for end of game
    if (winner === USER) {
      setUserScore(userScore + 1);
      if (userScore + 1 === MAX_LIVES) {
        setGameWinner(USER);
      }
    } else if (winner === COMP) {
      setCompScore(compScore + 1);
      if (compScore + 1 === MAX_LIVES) {
        setGameWinner(COMP);
      }
    }
  }

  // reset game state
  function handleRestart() {
    setUserChoice(null);
    setCompChoice(null);
    setUserScore(0);
    setCompScore(0);
    setRoundWinner(null);
    setGameWinner(null);
  }

  // cache handler definitions to avoid re-renders of RoboflowModel
  const handleModelLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleDetection = useCallback((detectedClass) => {
    // use window as global event bus, since callbacks are cached
    window.dispatchEvent(new CustomEvent('play', { detail: detectedClass }));
  }, []);

  return (
    <div className={isLoading ? 'loading' : ''}>
      <header className="app-header">
        <h1>Rock Paper Scissors</h1>
      </header>
      <GameUI
        userChoice={userChoice}
        compChoice={compChoice}
        userScore={userScore}
        compScore={compScore}
        roundWinner={roundWinner}
        gameWinner={gameWinner}
        onRestart={handleRestart}
      />
      <RoboflowModel onModelLoad={handleModelLoad} onDetection={handleDetection} />
    </div>
  );
}

export default Game;
