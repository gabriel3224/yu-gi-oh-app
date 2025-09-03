import React, { useState, useEffect } from 'react';
import CardModal from './CardModal'; 

function FavoritesPage({ favoriteIds, toggleFavorite }) {
  const [favoriteCards, setFavoriteCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setFavoriteCards([]);
      setLoading(false);
      return;
    }

    const fetchFavoriteCards = async () => {
      try {
        // A API permite buscar múltiplos cards por ID, separados por vírgula
        const idsQuery = favoriteIds.join(',');
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsQuery}`);
        const data = await response.json();
        setFavoriteCards(data.data);
      } catch (error) {
        console.error("Erro ao buscar cartas favoritas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCards();
  }, [favoriteIds]);

  const handleCardClick = (card) => setSelectedCard(card);
  const handleCloseModal = () => setSelectedCard(null);

  if (loading) {
    return <div className="text-center p-10 text-xl">Carregando seus favoritos...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Suas Cartas Favoritas</h1>
      
      {favoriteCards.length === 0 ? (
        <p className="text-center text-gray-400">Você ainda não adicionou nenhuma carta aos favoritos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
          {favoriteCards.map(card => (
            <div key={card.id} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer group">
              <img 
                src={card.card_images[0].image_url} 
                alt={card.name} 
                className="w-full object-cover aspect-[59/86] transition-transform duration-200 group-hover:scale-105"
                onClick={() => handleCardClick(card)}
              />
              {/* Botão de Favorito (coração) */}
              <button 
                onClick={() => toggleFavorite(card.id)}
                className="absolute top-2 right-2 text-2xl"
              >
                ❤️
              </button>
              <div className="p-3" onClick={() => handleCardClick(card)}>
                <h2 className="text-sm font-bold truncate">{card.name}</h2>
              </div>
            </div>
          ))}
        </div>
      )}

      <CardModal card={selectedCard} onClose={handleCloseModal} />
    </div>
  );
}

export default FavoritesPage;