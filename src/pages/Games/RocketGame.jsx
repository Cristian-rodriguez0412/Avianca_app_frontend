import React, { useState, useEffect, useRef } from "react";
import BackToHome from "../../Components/BackToHome"; // Ajusta si tu carpeta es lowercase ../components/BackToHome
import "./rocketStyles.css"; // opcional: si quieres extra CSS, ver nota abajo

// Sonidos (URLs públicos). Puedes reemplazarlos por archivos locales en /public si prefieres.
const SOUND_EXPLOSION = "https://www.fesliyanstudios.com/play-mp3/6677"; // explosion
const SOUND_POINT = "https://www.fesliyanstudios.com/play-mp3/6413"; // point
const SOUND_SHIELD = "https://www.fesliyanstudios.com/play-mp3/5712"; // shield pickup
const MUSIC_BG = "https://www.fesliyanstudios.com/play-mp3/6596"; // background loop

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const createMeteor = (w) => {
  const typeRand = Math.random();
  if (typeRand < 0.12) {
    return { id: Date.now() + Math.random(), x: Math.random() * (w - 80), y: -80, speed: 2 + Math.random() * 2, size: 90, kind: "giant" };
  } else if (typeRand < 0.4) {
    return { id: Date.now() + Math.random(), x: Math.random() * (w - 50), y: -60, speed: 4 + Math.random() * 3, size: 55, kind: "fast" };
  } else if (typeRand < 0.7) {
    return { id: Date.now() + Math.random(), x: Math.random() * (w - 50), y: -60, speed: 2 + Math.random() * 2.5, size: 50, kind: "zigzag", zigDir: Math.random() > 0.5 ? 1 : -1, zigAmp: 40 + Math.random() * 50 };
  } else {
    return { id: Date.now() + Math.random(), x: Math.random() * (w - 40), y: -50, speed: 2 + Math.random() * 2, size: 40, kind: "normal" };
  }
};

export default function RocketGame() {
  const [rocketX, setRocketX] = useState(window.innerWidth / 2 - 40);
  const [rocketSpeed, setRocketSpeed] = useState(10); // base movement step
  const [meteorites, setMeteorites] = useState([]);
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [shieldActive, setShieldActive] = useState(false);
  const [turboActive, setTurboActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [spawnRate, setSpawnRate] = useState(900); // ms
  const [musicOn, setMusicOn] = useState(false);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("kids_rocket_best") || "0", 10));

  const explosionAudio = useRef(null);
  const pointAudio = useRef(null);
  const shieldAudio = useRef(null);
  const bgMusic = useRef(null);

  const gameRef = useRef(null);
  const meteorsRef = useRef([]);
  meteorsRef.current = meteorites;

  // init audios
  useEffect(() => {
    explosionAudio.current = new Audio(SOUND_EXPLOSION);
    pointAudio.current = new Audio(SOUND_POINT);
    shieldAudio.current = new Audio(SOUND_SHIELD);
    bgMusic.current = new Audio(MUSIC_BG);
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.25;

    return () => {
      if (bgMusic.current) {
        bgMusic.current.pause();
        bgMusic.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // background stars (animated)
  useEffect(() => {
    const s = Array.from({ length: 40 }).map(() => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.6,
    }));
    setStars(s);

    const t = setInterval(() => {
      setStars((prev) =>
        prev.map((st) => {
          const ny = st.y + st.speed;
          return { ...st, y: ny > window.innerHeight ? -10 : ny };
        })
      );
    }, 30);
    return () => clearInterval(t);
  }, []);

  // spawn meteoritos
  useEffect(() => {
    if (gameOver) return;
    const spawn = setInterval(() => {
      setMeteorites((prev) => {
        const next = [...prev, createMeteor(window.innerWidth)];
        // limit meteor count
        if (next.length > 30) next.shift();
        return next;
      });
    }, spawnRate);
    return () => clearInterval(spawn);
  }, [spawnRate, gameOver]);

  // move meteoritos (physics + zigzag) & collision detection
  useEffect(() => {
    if (gameOver) return;
    let raf = null;
    const loop = () => {
      setMeteorites((prev) => {
        const rocketY = window.innerHeight - 130;
        const rLeft = rocketX;
        const rRight = rocketX + 80;
        const rTop = rocketY;
        const rBottom = rocketY + 80;
        const next = prev
          .map((m) => {
            const nm = { ...m };
            nm.y = nm.y + nm.speed;
            if (nm.kind === "zigzag") {
              nm.x = nm.x + Math.sin((nm.y / 30) * nm.zigDir) * (nm.zigAmp / 25);
            }
            return nm;
          })
          .filter((m) => {
            // if off screen -> award point
            if (m.y > window.innerHeight + 80) {
              // point for dodged meteor
              setScore((s) => {
                const newS = s + (m.kind === "fast" ? 2 : 1);
                if (pointAudio.current) {
                  pointAudio.current.volume = 0.2;
                  pointAudio.current.currentTime = 0;
                  pointAudio.current.play().catch(() => {});
                }
                return newS;
              });
              return false; // remove
            }
            // collision?
            const mLeft = m.x;
            const mRight = m.x + (m.size || 40);
            const mTop = m.y;
            const mBottom = m.y + (m.size || 40);

            const collided =
              !(mRight < rLeft || mLeft > rRight || mBottom < rTop || mTop > rBottom);

            if (collided) {
              if (shieldActive) {
                // shield consumes meteor (disappear)
                return false;
              } else {
                // take damage
                setLives((L) => {
                  const newL = L - 1;
                  if (newL <= 0) {
                    // explosion and game over
                    if (explosionAudio.current) {
                      explosionAudio.current.volume = 0.6;
                      explosionAudio.current.play().catch(() => {});
                    }
                    setGameOver(true);
                    saveBest(score);
                  }
                  return newL;
                });
                // remove meteor on hit
                return false;
              }
            }
            return true;
          });
        return next;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [rocketX, shieldActive, gameOver, score]);

  // keyboard movement
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      const step = turboActive ? rocketSpeed * 1.8 : rocketSpeed;
      if (e.key === "ArrowLeft") {
        setRocketX((x) => clamp(x - step, 0, window.innerWidth - 80));
      }
      if (e.key === "ArrowRight") {
        setRocketX((x) => clamp(x + step, 0, window.innerWidth - 80));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [rocketSpeed, turboActive, gameOver]);

  // touch controls for mobile (simple)
  const touchRef = useRef({ active: false });
  useEffect(() => {
    const area = gameRef.current;
    if (!area) return;
    const onTouchMove = (e) => {
      if (gameOver) return;
      const t = e.touches[0];
      const rect = area.getBoundingClientRect();
      const x = t.clientX - rect.left - 40;
      setRocketX(clamp(x, 0, window.innerWidth - 80));
    };
    area.addEventListener("touchmove", onTouchMove);
    return () => area.removeEventListener("touchmove", onTouchMove);
  }, [gameOver]);

  // power-ups spawn (shield & turbo)
  useEffect(() => {
    if (gameOver) return;
    const puInterval = setInterval(() => {
      // 30% chance to spawn either shield or turbo
      const spawnType = Math.random() < 0.5 ? "shield" : "turbo";
      const power = {
        id: Date.now() + Math.random(),
        type: spawnType,
        x: Math.random() * (window.innerWidth - 60),
        y: -60,
        speed: 2,
      };
      setMeteorites((prev) => [...prev, power]);
    }, 9000); // every 9s approximate
    return () => clearInterval(puInterval);
  }, [gameOver]);

  // move power-ups together with meteor loop - we added powerups into meteorites array; when colliding, detect type below

  // detect pickup on rocket (powerups)
  useEffect(() => {
    if (gameOver) return;
    setMeteorites((prev) => prev.filter(Boolean)); // noop to refresh
    const checkPU = () => {
      const rocketY = window.innerHeight - 130;
      const rLeft = rocketX;
      const rRight = rocketX + 80;
      const rTop = rocketY;
      const rBottom = rocketY + 80;

      setMeteorites((prev) =>
        prev.filter((m) => {
          if (!m.type) return true; // normal meteors stay
          // powerup detection
          const mLeft = m.x;
          const mRight = m.x + 56;
          const mTop = m.y;
          const mBottom = m.y + 56;
          const collided =
            !(mRight < rLeft || mLeft > rRight || mBottom < rTop || mTop > rBottom);
          if (collided) {
            // pickup
            if (m.type === "shield") {
              setShieldActive(true);
              if (shieldAudio.current) {
                shieldAudio.current.volume = 0.4;
                shieldAudio.current.play().catch(() => {});
              }
              // shield duration 5s
              setTimeout(() => setShieldActive(false), 5000);
            } else if (m.type === "turbo") {
              setTurboActive(true);
              setRocketSpeed(16); // boost speed
              setTimeout(() => {
                setTurboActive(false);
                setRocketSpeed(10);
              }, 8000);
            }
            return false; // remove powerup
          }
          return true;
        })
      );
    };

    const id = setInterval(checkPU, 200);
    return () => clearInterval(id);
  }, [rocketX, gameOver]);

  // save best
  const saveBest = (s) => {
    const prev = parseInt(localStorage.getItem("kids_rocket_best") || "0", 10);
    if (s > prev) {
      localStorage.setItem("kids_rocket_best", String(s));
      setBest(s);
    }
  };

  // toggle music
  const toggleMusic = () => {
    if (!bgMusic.current) return;
    if (musicOn) {
      bgMusic.current.pause();
      setMusicOn(false);
    } else {
      bgMusic.current.play().catch(() => {});
      setMusicOn(true);
    }
  };

  // restart
  const restart = () => {
    setMeteorites([]);
    setScore(0);
    setLives(3);
    setShieldActive(false);
    setTurboActive(false);
    setGameOver(false);
    setRocketX(window.innerWidth / 2 - 40);
  };

  // render
  return (
    <div
      ref={gameRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-600 to-black"
      style={{ color: "white" }}
    >
      <BackToHome />

      {/* Header: score / lives / controls */}
      <div style={{ position: "absolute", top: 14, left: 18, right: 18, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 40 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontWeight: "700", fontSize: 18 }}>🚀 Puntaje: <span style={{ fontWeight: "900" }}>{score}</span></div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i} style={{ fontSize: 22 }}>💓</span>
            ))}
            {lives === 0 && <span style={{ fontSize: 18, color: "#ffdddd" }}>0</span>}
          </div>
          <div style={{ marginLeft: 12, fontSize: 16 }}>
            Best: <b>{best}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={toggleMusic} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}>
            {musicOn ? "🔊 Música ON" : "🔈 Música OFF"}
          </button>

          <button onClick={restart} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.08)", color: "white", border: "none" }}>
            🔄 Reiniciar
          </button>
        </div>
      </div>

      {/* Stars background */}
      {stars.map((st) => (
        <div key={st.id} style={{ position: "absolute", left: st.x, top: st.y, width: st.size, height: st.size, background: "white", opacity: 0.9, borderRadius: "50%", zIndex: 1 }} />
      ))}

      {/* Meteoritos and powerups (render) */}
      {meteorites.map((m) => {
        // render powerups differently
        if (m.type === "shield") {
          return (
            <div key={m.id} style={{ position: "absolute", left: m.x, top: m.y, zIndex: 30, fontSize: 44 }}>
              🛡️
            </div>
          );
        }
        if (m.type === "turbo") {
          return (
            <div key={m.id} style={{ position: "absolute", left: m.x, top: m.y, zIndex: 30, fontSize: 44 }}>
              ⚡
            </div>
          );
        }

        // meteor
        const size = m.size || 40;
        const style = {
          position: "absolute",
          left: m.x,
          top: m.y,
          zIndex: 20,
          fontSize: Math.max(28, size / 1.2),
          filter: m.kind === "giant" ? "drop-shadow(0 0 6px rgba(255,120,50,0.5))" : undefined,
        };
        return <div key={m.id} style={style}>☄️</div>;
      })}

      {/* Rocket */}
      <div style={{ position: "absolute", bottom: 40, left: rocketX, zIndex: 50, transition: "left 0.08s linear" }}>
        <div style={{ fontSize: 72, transform: turboActive ? "scale(1.08)" : "scale(1)", transition: "transform 120ms" }}>
          {shieldActive ? <span style={{ textShadow: "0 0 12px rgba(0,255,255,0.6)" }}>🛡️🚀</span> : "🚀"}
        </div>
      </div>

      {/* If game over overlay */}
      {gameOver && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 48, fontWeight: 800 }}>💥 ¡Fin del juego!</div>
          <div style={{ fontSize: 22 }}>Tu puntaje: <b>{score}</b></div>
          <div style={{ fontSize: 18 }}>Mejor puntaje: <b>{Math.max(best, score)}</b></div>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button onClick={() => { restart(); }} style={{ padding: "10px 18px", borderRadius: 10, background: "#ff4757", color: "white", fontWeight: 700 }}>🔄 Jugar de nuevo</button>
            <button onClick={() => { saveBest(score); setGameOver(false); restart(); }} style={{ padding: "10px 18px", borderRadius: 10, background: "#2ed573", color: "white", fontWeight: 700 }}>💾 Guardar y jugar</button>
          </div>
        </div>
      )}
    </div>
  );
}
