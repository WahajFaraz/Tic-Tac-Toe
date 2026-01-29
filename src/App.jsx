import { useState } from 'react';
import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import { WINNING_COMBINATIONS } from './winningCombination.js';
import GameOver from './components/GameOver.jsx';
import BackgroundMusic from './components/BackgroundMusic.jsx';
import { SoundEffectsProvider } from './components/SoundEffects.jsx';

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function App({ playXMoveSound, playOMoveSound }) {
  const [players, setplayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const isDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    // Play different sound based on current player
    const currentPlayer = deriveActivePlayer(gameTurns);
    if (currentPlayer === 'X') {
      playXMoveSound();
    } else {
      playOMoveSound();
    }
    
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const xTurns = prevTurns.filter((turn) => turn.player === 'X').length;
      const oTurns = prevTurns.filter((turn) => turn.player === 'O').length;

      let updatedTurns = [
        {
          square: { row: rowIndex, col: colIndex },
          player: currentPlayer,
        },
        ...prevTurns,
      ];

      if (currentPlayer === 'O' && oTurns === 3) {
        const xTurnIndexes = [];
        updatedTurns.forEach((turn, index) => {
          if (turn.player === 'X') {
            xTurnIndexes.push(index);
          }
        });

        if (xTurnIndexes.length === 4) {
          updatedTurns = updatedTurns.filter(
            (_, index) => index !== xTurnIndexes[xTurnIndexes.length - 1]
          );
        }
      } else if (currentPlayer === 'X' && xTurns === 3) {
        const oTurnIndexes = [];
        updatedTurns.forEach((turn, index) => {
          if (turn.player === 'O') {
            oTurnIndexes.push(index);
          }
        });

        if (oTurnIndexes.length === 4) {
          updatedTurns = updatedTurns.filter(
            (_, index) => index !== oTurnIndexes[oTurnIndexes.length - 1]
          );
        }
      }

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setplayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <BackgroundMusic />
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || isDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          board={gameBoard}
          activeSymbolPlayer={activePlayer}
        />
        </div>
        <Log turns={gameTurns} />
      </main>
  );
}
export default App;
