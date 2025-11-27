import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Home from "./pages/Home";
import Search from "./pages/Search";
import KidsZone from "./pages/KidsZone";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import AirplaneGame from "./pages/games/AirplaneGame";
import RocketGame from "./pages/games/RocketGame";
import KidsPuzzle from "./pages/games/KidsPuzzle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/kids" element={<KidsZone />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/kids/airplane-game" element={<AirplaneGame />} />
        <Route path="/kids/rocket-game" element={<RocketGame />} />
        <Route path="/kids/puzzle" element={<KidsPuzzle />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

