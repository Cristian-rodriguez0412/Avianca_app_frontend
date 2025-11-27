import React, { useState, useEffect } from "react";
import BackToHome from "../../Components/BackToHome";

// Sonidos opcionales (puedes poner archivos reales si deseas)
const soundPoint = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const soundFly = new Audio("https://www.fesliyanstudios.com/play-mp3/5936");

const AirplaneGame = () => {
  const [position, setPosition] = useState({ top: 200, left: 200 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [speed, setSpeed] = useState(1000); // cambia según dificultad

  // Cambiar velocidad según dificultad
  useEffect(() => {
    if (difficulty === "easy") setSpeed(1200);
    if (difficulty === "medium") setSpeed(800);
    if (difficulty === "hard") setSpeed(500);
  }, [difficulty]);

  // Movimiento del avión
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      const newTop = Math.random() * (window.innerHeight - 150);
      const newLeft = Math.random() * (window.innerWidth - 150);

      soundFly.volume = 0.2;
      soundFly.play();

      setPosition({ top: newTop, left: newLeft });
    }, speed);

    return () => clearInterval(interval);
  }, [speed, isGameOver]);

  // Temporizador
  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft <= 0) {
      setIsGameOver(true);
      saveRecord();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isGameOver]);

  const handleCatch = () => {
    soundPoint.volume = 0.4;
    soundPoint.play();

    setScore((prev) => prev + 1);
  };

  // Guardar récord en localStorage
  const saveRecord = () => {
    const record = localStorage.getItem("kids_airplane_record");
    if (!record || score > parseInt(record)) {
      localStorage.setItem("kids_airplane_record", score);
    }
  };

  // Recuperar récord
  const bestRecord =
    typeof window !== "undefined"
      ? localStorage.getItem("kids_airplane_record") || 0
      : 0;

  return (
    <div className="min-h-screen bg-blue-300 relative overflow-hidden p-4">

      <BackToHome />

      <h1 className="text-4xl font-bold text-center text-white drop-shadow mb-1">
        ✈️ Atrapa el avión
      </h1>

      <p className="text-center text-lg text-white -mt-2 mb-6">
        Tiempo: <b>{timeLeft}s</b> — Puntaje: <b>{score}</b>
      </p>

      {/* Dificultad */}
      {!isGameOver && (
        <div className="text-center mb-4">
          <label className="text-white text-lg mr-2">Dificultad:</label>
          <select
            className="p-2 rounded bg-white text-black"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Fácil (niños)</option>
            <option value="medium">Normal</option>
            <option value="hard">Difícil</option>
          </select>
        </div>
      )}

      {/* Avión */}
      {!isGameOver && (
        <div
          onClick={handleCatch}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            fontSize: "70px",
            userSelect: "none",
          }}
        >
          ✈️
        </div>
      )}

      {/* Pantalla final */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white text-center p-6">
          <h2 className="text-4xl font-bold mb-2">🎉 ¡Juego terminado!</h2>

          <p className="text-xl">Puntaje final: <b>{score}</b></p>

          <p className="text-lg mt-2">
            🏆 Mejor récord: <b>{bestRecord}</b>
          </p>

          <button
            className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-lg font-semibold"
            onClick={() => {
              setScore(0);
              setTimeLeft(60);
              setIsGameOver(false);
            }}
          >
            🔄 Jugar de nuevo
          </button>
        </div>
      )}

    </div>
  );
};

export default AirplaneGame;
