import React, { useState } from 'react';

// ADICIONADO: Mapeamentos de tradução de Inglês para Português
const raceTranslations = {
    'Spellcaster': 'Mago',
    'Dragon': 'Dragão',
    'Zombie': 'Zumbi',
    'Warrior': 'Guerreiro',
    'Beast-Warrior': 'Besta-Guerreira',
    'Beast': 'Besta',
    'Winged Beast': 'Besta Alada',
    'Fiend': 'Demônio',
    'Fairy': 'Fada',
    'Insect': 'Inseto',
    'Dinosaur': 'Dinossauro',
    'Reptile': 'Réptil',
    'Fish': 'Peixe',
    'Sea Serpent': 'Serpente Marinha',
    'Aqua': 'Água',
    'Pyro': 'Piro',
    'Thunder': 'Trovão',
    'Rock': 'Rocha',
    'Plant': 'Planta',
    'Machine': 'Máquina',
    'Psychic': 'Psíquico',
    'Divine-Beast': 'Besta-Divina',
    'Creator-God': 'Deus Criador',
    'Wyrm': 'Wyrm',
    'Cyberse': 'Ciberso',
    'Illusion': 'Ilusão',
    // Para Magias e Armadilhas
    'Normal': 'Normal',
    'Field': 'Campo',
    'Equip': 'Equipamento',
    'Continuous': 'Contínua',
    'Quick-Play': 'Jogo Rápido',
    'Ritual': 'Ritual',
    'Counter': 'Resposta',
};

const attributeTranslations = {
    'DARK': 'TREVAS',
    'LIGHT': 'LUZ',
    'EARTH': 'TERRA',
    'WATER': 'ÁGUA',
    'FIRE': 'FOGO',
    'WIND': 'VENTO',
    'DIVINE': 'DIVINO',
};


// Pequeno componente auxiliar para renderizar a secção de preços
const PriceDisplay = ({ prices }) => {
    if (!prices || prices.length === 0) {
        return null;
    }
    const priceData = prices[0];
    const vendorMap = {
        cardmarket_price: 'Cardmarket',
        tcgplayer_price: 'TCGplayer',
        ebay_price: 'Ebay',
        amazon_price: 'Amazon',
        coolstuffinc_price: 'CoolStuffInc',
    };
    return (
        <div className="mt-6 pt-4 border-t border-gray-700">
            <h4 className="font-bold text-lg mb-3 text-gray-300">Preços de Mercado (USD):</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(priceData).map(([vendorKey, price]) => {
                    const vendorName = vendorMap[vendorKey];
                    if (!vendorName) return null;
                    return (
                        <div key={vendorKey} className="flex justify-between items-center bg-gray-900 p-2 rounded">
                            <span className="text-gray-400">{vendorName}:</span>
                            <span className="font-bold text-green-400">${price}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


function CardModal({ card, onClose, isFavorite, toggleFavorite }) {
    const [isZoomed, setIsZoomed] = useState(false);

    if (!card) {
        return null;
    }

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const handleImageClick = (e) => {
        e.stopPropagation();
        setIsZoomed(true);
    }

    return (
        <>
            {/* O Modal Principal */}
            <div
                className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
                onClick={onClose}
            >
                <div
                    className="bg-slate-900/80 backdrop-blur-md border border-gray-700 text-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-6 p-6"
                    onClick={handleModalContentClick}
                >
                    {/* Coluna da Imagem */}
                    <div className="flex-shrink-0 w-full md:w-1/3">
                        <img
                            src={card.card_images[0].image_url}
                            alt={card.name}
                            className="rounded-lg w-full cursor-zoom-in"
                            onClick={handleImageClick}
                        />
                    </div>

                    {/* Coluna de Informações */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-3xl font-bold">{card.name}</h2>
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <button
                                    onClick={() => toggleFavorite(card.id)}
                                    title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                                    className={`text-3xl transition-transform duration-150 hover:scale-125 ${isFavorite ? '' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    {isFavorite ? '❤️' : '🤍'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <p className="text-lg text-yellow-400 mb-2">{card.type}</p>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-4 text-gray-300">
                            {/* MODIFICADO: Usa o mapa de tradução para a raça, com fallback para o original */}
                            {card.race && <p><b>Raça:</b> {raceTranslations[card.race] || card.race}</p>}
                            
                            {/* MODIFICADO: Usa o mapa de tradução para o atributo, com fallback para o original */}
                            {card.attribute && <p><b>Atributo:</b> {attributeTranslations[card.attribute] || card.attribute}</p>}
                        </div>

                        {card.level > 0 && (
                            <div className="flex items-center gap-1 mb-4">
                                {Array(card.level).fill(null).map((_, index) => (
                                    <span key={index} className="text-yellow-400 text-2xl">
                                        ⭐
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="bg-gray-900 p-4 rounded-md mb-4 whitespace-pre-wrap">{card.desc}</p>

                        {card.atk !== undefined && (
                            <div className="flex gap-4 text-xl">
                                <span className="text-red-500 font-bold">ATK / {card.atk}</span>
                                {card.def !== undefined && (
                                    <span className="text-blue-500 font-bold">DEF / {card.def}</span>
                                )}
                            </div>
                        )}
                        {card.archetype && <p className="mt-4"><b>Arquétipo:</b> {card.archetype}</p>}

                        <PriceDisplay prices={card.card_prices} />
                    </div>
                </div>
            </div>

            {/* Overlay de Zoom da Imagem */}
            {isZoomed && (
                <div
                    className="fixed inset-0 bg-black/80 flex justify-center items-center z-[60] p-4 cursor-zoom-out"
                    onClick={() => setIsZoomed(false)}
                >
                    <img
                        src={card.card_images[0].image_url}
                        alt={`${card.name} - Zoomed`}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                    />
                </div>
            )}
        </>
    );
}

export default CardModal;