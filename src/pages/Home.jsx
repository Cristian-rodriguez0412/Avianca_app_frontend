import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
return (
<div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center justify-center p-8 text-center">
<h1 className="text-4xl font-bold text-white drop-shadow-lg mb-6">
🛫 Bienvenido a Avianca Connect
</h1>


<p className="text-lg text-white/90 max-w-lg mb-8">
Explora vuelos, administra tu perfil y si viajas con niños,
disfruta de nuestra zona especial para ellos. ¡Una experiencia
pensada para toda la familia!
</p>


<div className="flex flex-col gap-4 w-full max-w-sm">
<a href="/search" className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl shadow-md text-lg font-semibold">
🔍 Buscar vuelos
</a>


<a href="/kids" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-xl shadow-md text-lg font-semibold">
🎮 Zona de Juegos Kids
</a>


<a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md text-lg font-semibold">
🔐 Iniciar sesión
</a>


<a href="/profile" className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl shadow-md text-lg font-semibold">
👤 Mi perfil
</a>
</div>
</div>
);
};


export default Home;
