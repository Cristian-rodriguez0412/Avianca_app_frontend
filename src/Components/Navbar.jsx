import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="w-full bg-red-600 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">Avianca App</h1>

      <div className="flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/search">Buscar vuelos</Link>
        <Link to="/profile">Perfil</Link>
        <Link to="/KidsZone">Kids Zone</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};
