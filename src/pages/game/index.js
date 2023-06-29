import React, { useState, useEffect } from "react";
import matchstickImage from "../../images/spichka.png";
import "./styles.css";

function Game() {
  const [matchsticks, setMatchsticks] = useState(
    Array(25).fill(matchstickImage)
  );
  const [takenMatchsticksByPlayer, setTakenMatchsticksByPlayer] = useState(0);
  const [takenMatchsticksByAI, setTakenMatchsticksByAI] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (isPlayerTurn === false && !gameOver) {
      const aiTimeout = setTimeout(aiMove, 1000);
      return () => clearTimeout(aiTimeout);
    }
  }, [isPlayerTurn, gameOver]);

  useEffect(() => {
    if (matchsticks.length === 0) {
      setGameOver(true);
      const remainingMatchsticksByPlayer = 25 - takenMatchsticksByPlayer;
      if (remainingMatchsticksByPlayer % 2 === 0) {
        setWinner("AI");
      } else {
        setWinner("User");
      }
    }
  }, [matchsticks, takenMatchsticksByPlayer]);

  const removeMatchsticks = (count) => {
    if (isPlayerTurn && matchsticks.length >= count) {
      const updatedMatchsticks = [...matchsticks];
      updatedMatchsticks.splice(-count);
      setMatchsticks(updatedMatchsticks);
      setTakenMatchsticksByPlayer(takenMatchsticksByPlayer + count);
      setIsPlayerTurn(false);
    }
  };

  const aiMove = () => {
    if (!gameOver) {
      let aiCount;
      if (matchsticks.length === 2) {
        aiCount = 1;
      } else if (matchsticks.length % 2 === 0) {
        const remainingMatchsticks = matchsticks.length - takenMatchsticksByAI;
        if (remainingMatchsticks % 2 === 1) {
          aiCount = Math.min(3, remainingMatchsticks);
        } else {
          aiCount = Math.min(2, remainingMatchsticks);
        }
      } else {
        aiCount = Math.min(3, matchsticks.length);
      }
      const updatedMatchsticks = [...matchsticks];
      updatedMatchsticks.splice(-aiCount);
      setMatchsticks(updatedMatchsticks);
      setTakenMatchsticksByAI(takenMatchsticksByAI + aiCount);
      setIsPlayerTurn(true);
    }
  };

  const startGame = (isPlayerFirst) => {
    setIsPlayerTurn(isPlayerFirst);
  };

  const restartGame = () => {
    setMatchsticks(Array(25).fill(matchstickImage));
    setTakenMatchsticksByPlayer(0);
    setTakenMatchsticksByAI(0);
    setIsPlayerTurn(null);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="container">
      {isPlayerTurn === null ? (
        <div className="start-game-buttons">
          <button onClick={() => startGame(true)}>User goes first</button>
          <button onClick={() => startGame(false)}>AI goes first</button>
        </div>
      ) : (
        <>
          {gameOver ? (
            <div className="game-over-message">
              {winner === "AI" ? <p>AI win!</p> : <p>User win!</p>}
              <button onClick={restartGame}>New game</button>
            </div>
          ) : (
            <div>
              <div className="taken-matchsticks-info">
                <p>AI score: {takenMatchsticksByAI}</p>
              </div>
              <div className="centered-row">
                {matchsticks.map((matchstick, index) => (
                  <img
                    key={index}
                    src={matchstick}
                    className="matchstick"
                    alt="matchstick"
                  />
                ))}
              </div>

              {isPlayerTurn ? (
                <div className="button-container">
                  <button onClick={() => removeMatchsticks(1)}>Take 1</button>
                  <button onClick={() => removeMatchsticks(2)}>Take 2</button>
                  <button onClick={() => removeMatchsticks(3)}>Take 3</button>
                </div>
              ) : (
                <p className="ai-turn">Хід AI...</p>
              )}
              <p>User score: {takenMatchsticksByPlayer}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Game;
