import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import KidsZone from "./pages/KidsZone.jsx";
import Login from "./pages/login.jsx";
import Profile from "./pages/profile.jsx";

// Juegos
import AirplaneGame from "./pages/game/AirplaneGame.jsx";
import RocketGame from "./pages/game/RocketGame.jsx";
import KidsPuzzle from "./pages/game/KidsPuzzle.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/kids" element={<KidsZone />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* Juegos */}
        <Route path="/kids/airplane-game" element={<AirplaneGame />} />
        <Route path="/kids/rocket-game" element={<RocketGame />} />
        <Route path="/kids/puzzle" element={<KidsPuzzle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
