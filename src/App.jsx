import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importando os seus componentes
import Tittle from "./components/Tittle";
import Tela from "./components/Tela";

// Importando os componentes de página
import CardSearch from './components/CardSearch';
import FavoritesPage from './components/favoritePage';
import HowToPlayPage from './components/HowToPlayPage';

function App() {
  const [favorites, setFavorites] = useState([]);

  // Carrega os favoritos do localStorage quando a app inicia
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorite-cards'));
    if (savedFavorites) {
      setFavorites(savedFavorites);
    }
  }, []);

  // Salva os favoritos no localStorage sempre que a lista muda
  useEffect(() => {
    localStorage.setItem('favorite-cards', JSON.stringify(favorites));
  }, [favorites]);

  // Função para adicionar ou remover um favorito
  const toggleFavorite = (cardId) => {
    if (favorites.includes(cardId)) {
      setFavorites(favorites.filter((id) => id !== cardId));
    } else {
      setFavorites([...favorites, cardId]);
    }
  };

  return (
    <Router>
      <div className="relative min-h-screen w-screen">
        {/* O seu componente Tela a funcionar como fundo */}
        <Tela />

        {/* Conteúdo principal por cima do fundo */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* O seu componente Tittle */}
          <Tittle />

          {/* Barra de Navegação para as múltiplas páginas */}
          <nav className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl mb-4">
            <ul className="flex justify-center gap-6 text-lg">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors px-3 py-2">Busca</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-blue-400 transition-colors px-3 py-2">
                  Favoritos ({favorites.length})
                </Link>
              </li>
              <li>
                <Link to="/how-to-play" className="hover:text-blue-400 transition-colors px-3 py-2">Como Jogar</Link>
              </li>
            </ul>
          </nav>

          {/* As Routes definem qual componente de página mostrar */}
          <main className="w-full">
            <Routes>
              <Route 
                path="/" 
                element={
                  <CardSearch 
                    favorites={favorites} 
                    toggleFavorite={toggleFavorite} 
                  />
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <FavoritesPage 
                    favoriteIds={favorites} 
                    toggleFavorite={toggleFavorite} 
                  />
                } 
              />
              <Route path="/how-to-play" element={<HowToPlayPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;