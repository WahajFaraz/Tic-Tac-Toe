import { useEffect } from 'react';
import { useSounds } from './SoundEffects.jsx';

function GameOver({ winner, onRestart }) {
  const { playWinSound, playDrawSound } = useSounds();

  useEffect(() => {
    if (winner) {
      playWinSound();
    } else {
      playDrawSound();
    }
  }, [winner, playWinSound, playDrawSound]);

  return (
    <div id="game-over">
      <h2>Game Over !</h2>
      {winner && <p>{winner} Won ! </p>}
      {!winner && <p>It's a Draw !</p>}
      <p>
        <button onClick={onRestart}>Rematch !</button>
      </p>
    </div>
  );
}
export default GameOver;
