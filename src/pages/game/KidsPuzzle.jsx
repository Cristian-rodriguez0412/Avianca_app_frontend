import React, { useState, useEffect } from "react";
import BackToHome from "../../Components/BackToHome";
import "./puzzleStyles.css";

const PuzzleGame = () => {
  const IMAGE = "/img/puzzle/animal1.jpg"; // Cambia por cualquier imagen
  const GRID_SIZE = 3;
  const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

  const [pieces, setPieces] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  // Mezclar piezas al iniciar
  useEffect(() => {
    const initial = [...Array(TOTAL_PIECES).keys()];
    const shuffled = initial.sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, []);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDrop = (index) => {
    const newPieces = [...pieces];
    [newPieces[index], newPieces[dragIndex]] = [newPieces[dragIndex], newPieces[index]];
    setPieces(newPieces);
    setDragIndex(null);

    checkWin(newPieces);
  };

  const checkWin = (board) => {
    const isCorrect = board.every((piece, index) => piece === index);
    if (isCorrect) {
      setTimeout(() => {
        alert("🎉 ¡Ganaste el Rompecabezas!");
      }, 200);
    }
  };

  return (
    <div className="puzzle-container">
      <BackToHome />
      <h1>🧩 Rompecabezas (Arrastra y Suelta)</h1>

      <div className="puzzle-grid">
        {pieces.map((piece, index) => {
          const posX = (piece % GRID_SIZE) * -100;
          const posY = Math.floor(piece / GRID_SIZE) * -100;

          return (
            <div
              key={index}
              className="puzzle-piece"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              style={{
                backgroundImage: `url(${IMAGE})`,
                backgroundPosition: `${posX}px ${posY}px`,
                backgroundSize: "300px 300px",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default PuzzleGame;
