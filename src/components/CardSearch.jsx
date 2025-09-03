import React, { useState, useEffect, useCallback } from 'react';
import CardModal from './CardModal';
import Pagination from './pagination';

// Importação das imagens dos personagens
import yugiImage from '../assets/yami yugi.jpg';
import kaibaImage from '../assets/seto kaiba.jpg';
import joeyImage from '../assets/joey wheeler.jpg';
import pegasusImage from '../assets/maximillion pegasus.jpg';
import jadenImage from '../assets/jaden yuki.jpg';
import yuseiImage from '../assets/Yusei fudo.jpg';

// Dados dos personagens com os nomes das cartas em português
const charactersData = [
    { 
        id: 'yugi', 
        name: 'Yami Yugi', 
        image: yugiImage, 
        bio: 'O Rei dos Jogos, conhecido por sua habilidade inigualável e por possuir o Enigma do Milênio. Seu alter ego é um antigo Faraó com um profundo conhecimento do Duelo de Monstros.', 
        signatureCards: ['Mago Negro', 'Pequena Maga Negra', 'Slifer, o Dragão Celeste'], 
    },
    { 
        id: 'kaiba', 
        name: 'Seto Kaiba', 
        image: kaibaImage, 
        bio: 'O CEO da Kaiba Corporation e o principal rival de Yugi. Kaiba é um duelista genial e arrogante, obcecado pelo poder do Dragão Branco de Olhos Azuis.', 
        signatureCards: ['Dragão Branco de Olhos Azuis', 'Obelisco, o Atormentador', 'Dragão Definitivo de Olhos Azuis'], 
    },
    { 
        id: 'joey', 
        name: 'Joey Wheeler', 
        image: joeyImage, 
        bio: 'O melhor amigo de Yugi, que se tornou um dos duelistas mais fortes do mundo através de coragem e sorte. Seu deck é focado em monstros do tipo Guerreiro e na sorte.', 
        signatureCards: ['Dragão Negro de Olhos Vermelhos', 'Jinzo', 'Mago do Tempo'], 
    },
    { 
        id: 'pegasus', 
        name: 'Maximillion Pegasus', 
        image: pegasusImage, 
        bio: 'O criador do Duelo de Monstros. Ele usa o Olho do Milênio para ler a mente de seus oponentes e comanda um deck baseado nos divertidos e perigosos monstros "Toon".', 
        signatureCards: ['Renunciado', 'Mundo Toon', 'Restrição dos Mil Olhos'], 
    },
    { 
        id: 'jaden', 
        name: 'Jaden Yuki', 
        image: jadenImage, 
        bio: 'Um duelista energético e otimista da Academia de Duelos, Jaden adora duelar mais do que tudo. Ele consegue comunicar-se com os espíritos dos monstros e usa um deck de "Elemental HERO" para realizar fusões incríveis.', 
        signatureCards: ['Kuriboh Alado', 'Neos, o HERÓI do Elemento', 'Yubel'], 
    },
    {
        id: 'Yusei', 
        name: 'Yusei Fudo', 
        image: yuseiImage, 
        bio: 'Yusei Fudo é o protagonista de Yu-Gi-Oh! 5Ds, um duelista genial e mecânico habilidoso que cresceu na oprimida cidade de Satélite. Com uma personalidade calma, séria e determinada, Yusei é um mestre dos Duelos Turbo, competindo em alta velocidade em sua moto customizada, a D-Wheel.', 
        signatureCards: ['Dragão da Poeira Estelar', 'Dragão da Explosão Quasar', 'Guerreiro Sucata'],
    },
];

// Opções para os filtros
const filterOptions = {
    types: ['Spell Card', 'Trap Card', 'Aqua', 'Beast', 'Beast-Warrior', 'Cyberse', 'Dinosaur', 'Dragon', 'Fairy', 'Fiend', 'Fish', 'Insect', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile', 'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Warrior', 'Winged Beast', 'Zombie'],
    attributes: ['DARK', 'LIGHT', 'EARTH', 'WATER', 'FIRE', 'WIND', 'DIVINE'],
    levels: Array.from({ length: 12 }, (_, i) => i + 1),
};

function CardSearch({ favorites, toggleFavorite }) {
    const [cards, setCards] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const CARDS_PER_PAGE = 30;
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [signatureCardData, setSignatureCardData] = useState([]);
    const [loadingSignatureCards, setLoadingSignatureCards] = useState(false);

    const [typeFilter, setTypeFilter] = useState('');
    const [attributeFilter, setAttributeFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);


    useEffect(() => {
        let isActive = true;
        const fetchSuggestions = async () => {
            if (searchTerm.length < 3 || !isInputFocused) {
                setSuggestions([]);
                return;
            }
            try {
                const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(searchTerm)}&language=pt`;
                const response = await fetch(url);
                if (isActive && response.ok) {
                    const data = await response.json();
                    setSuggestions(data.data.slice(0, 7));
                } else if (isActive) {
                    setSuggestions([]);
                }
            } catch (e) {
                if (isActive) { console.error("Erro ao buscar sugestões:", e); setSuggestions([]); }
            }
        };
        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => {
            isActive = false;
            clearTimeout(debounceTimer);
        };
    }, [searchTerm, isInputFocused]);

    useEffect(() => {
        if (!selectedCharacter) {
            setSignatureCardData([]);
            return;
        }
        const fetchSignatureCards = async () => {
            setLoadingSignatureCards(true);
            try {
                const cardPromises = selectedCharacter.signatureCards.map(cardName =>
                    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cardName)}&language=pt`)
                    .then(res => res.json())
                    .then(data => (data && data.data) ? data.data[0] : null)
                );
                const cardsData = await Promise.all(cardPromises);
                setSignatureCardData(cardsData.filter(card => card));
            } catch (error) {
                console.error("Erro ao buscar as cartas do personagem:", error);
            } finally {
                setLoadingSignatureCards(false);
            }
        };
        fetchSignatureCards();
    }, [selectedCharacter]);

    const handleSearch = useCallback(async (isFilterSearch = false) => {
        let baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?';
        const params = ['language=pt'];

        if (searchTerm.trim()) params.push(`fname=${encodeURIComponent(searchTerm)}`);
        
        if (typeFilter) {
            if (typeFilter === 'Spell Card' || typeFilter === 'Trap Card') {
                params.push(`type=${encodeURIComponent(typeFilter)}`);
            } else {
                params.push(`race=${encodeURIComponent(typeFilter)}`);
            }
        }

        if (attributeFilter) params.push(`attribute=${encodeURIComponent(attributeFilter)}`);
        if (levelFilter) params.push(`level=${levelFilter}`);

        if (params.length === 1 && params[0] === 'language=pt') {
             if (!isFilterSearch) {
                alert("Por favor, digite um nome ou selecione um filtro para buscar.");
            }
            return;
        }

        const finalUrl = baseUrl + params.join('&');
        
        setLoading(true);
        setError(null);
        setCards([]);
        setSuggestions([]);
        setCurrentPage(1);
        setSelectedCharacter(null);
        try {
            const response = await fetch(finalUrl);
            if (!response.ok) { throw new Error(`Nenhuma carta encontrada com os filtros selecionados.`); }
            const data = await response.json();
            setCards(data.data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, typeFilter, attributeFilter, levelFilter]);
    
    useEffect(() => {
        if (typeFilter || attributeFilter || levelFilter) {
            handleSearch(true);
        }
    }, [typeFilter, attributeFilter, levelFilter, handleSearch]);


    const clearFilters = () => {
        setSearchTerm('');
        setTypeFilter('');
        setAttributeFilter('');
        setLevelFilter('');
        setCards([]);
        setError(null);
    };

    const handleSuggestionClick = (card) => {
        setSearchTerm(card.name);
        setShowFilters(false);
        setSuggestions([]);
        setTimeout(() => handleSearch(), 0);
    };

    const handleCharacterSelect = (character) => {
        if (selectedCharacter && selectedCharacter.id === character.id) {
            setSelectedCharacter(null);
        } else {
            setSelectedCharacter(character);
        }
    };

    const handleKeyPress = (event) => { if (event.key === 'Enter') handleSearch(); };
    const handleCardClick = (card) => { setSelectedCard(card); };
    const handleCloseModal = () => { setSelectedCard(null); };

    const indexOfLastCard = currentPage * CARDS_PER_PAGE;
    const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-transparent text-white min-h-screen font-sans p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center items-start gap-2">
                    <div className="relative w-full max-w-md">
                        <input type="text" placeholder="Digite o nome da carta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} onFocus={() => setIsInputFocused(true)} onBlur={() => setTimeout(() => setIsInputFocused(false), 200)} className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" autoComplete="off" />
                        {suggestions.length > 0 && (
                            <ul className="absolute w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                                {suggestions.map((card) => (
                                    <li key={card.id} className="p-3 hover:bg-gray-600 cursor-pointer flex items-center gap-4" onMouseDown={() => handleSuggestionClick(card)}>
                                        <img src={card.card_images[0].image_url} alt={card.name} className="w-10 h-auto rounded-sm flex-shrink-0" />
                                        <span className="truncate">{card.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-3 font-semibold bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 flex-shrink-0">
                        Filtros
                    </button>
                    <button onClick={() => handleSearch(false)} className="px-6 py-3 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex-shrink-0">
                        Buscar
                    </button>
                </div>

                {showFilters && (
                    <div className="max-w-lg mx-auto mt-4 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg flex flex-wrap justify-center gap-2 items-center transition-all duration-300">
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-gray-700 border-gray-600 rounded p-2 text-base text-white">
                            <option value="">Tipo/Raça</option>
                            {filterOptions.types.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <select value={attributeFilter} onChange={(e) => setAttributeFilter(e.target.value)} className="bg-gray-700 border-gray-600 rounded p-2 text-base text-white">
                            <option value="">Atributo</option>
                            {filterOptions.attributes.map(attr => <option key={attr} value={attr}>{attr}</option>)}
                        </select>
                        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="bg-gray-700 border-gray-600 rounded p-2 text-base text-white">
                            <option value="">Nível/Rank</option>
                            {filterOptions.levels.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                        <button onClick={clearFilters} className="text-gray-400 hover:text-white transition-colors px-3 py-2 text-base">Limpar</button>
                    </div>
                )}

                <div className="mt-32">
                    <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Personagens em Destaque</h2>
                    <div className="flex justify-center items-start gap-6 md:gap-10 flex-wrap max-w-4xl mx-auto">
                        {charactersData.map(character => (
                            <div key={character.id} className="flex flex-col items-center gap-2 cursor-pointer w-28 text-center" onClick={() => handleCharacterSelect(character)}>
                                <img src={character.image} alt={character.name} title={character.name} className={`w-24 h-24 rounded-full object-cover border-4 transition-all duration-300 ${selectedCharacter?.id === character.id ? 'border-yellow-400 scale-110' : 'border-gray-600 hover:border-gray-400'}`} />
                                <span className={`font-semibold transition-colors ${selectedCharacter?.id === character.id ? 'text-yellow-400' : 'text-gray-200'}`}>{character.name}</span>
                            </div>
                        ))}
                    </div>
                    {selectedCharacter && (
                        
                        // Div do personagem selecionado com suas cartas principais
                        <div className="max-w-3xl mx-auto mt-10 p-6 bg-slate-900/80 backdrop-blur-md rounded-lg border border-gray-700">
                            <h3 className="text-2xl font-bold text-yellow-400 text-center">{selectedCharacter.name}</h3>
                            <p className="text-gray-300 mt-4 text-center">{selectedCharacter.bio}</p>
                            <div className="mt-6">
                                <h4 className="font-bold text-center text-lg mb-4">Cartas Principais:</h4>
                                <div className="flex justify-center flex-wrap gap-4 min-h-[120px] items-center">
                                    {loadingSignatureCards ? (
                                        <p className="text-gray-400">A carregar cartas...</p>
                                    ) : (
                                        signatureCardData.map(card => (
                                            <img key={card.id} src={card.card_images[0].image_url} alt={card.name} title={card.name} onClick={() => handleCardClick(card)} className="w-24 md:w-28 cursor-pointer rounded-md hover:scale-110 transition-transform duration-200" />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="text-center mt-10">{loading && <div className="text-xl">Buscando...</div>}{!loading && error && <div className="text-xl text-red-500">{error}</div>}</div>
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${selectedCharacter ? 'mt-8' : 'mt-12'}`}>
                    {currentCards.map(card => {
                        const isFavorite = favorites.includes(card.id);
                        return (
                            <div key={card.id} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
                                <img src={card.card_images[0].image_url} alt={card.name} className="w-full object-cover aspect-[59/86] cursor-pointer" onClick={() => handleCardClick(card)} />
                                <button onClick={() => toggleFavorite(card.id)} title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"} className={`absolute top-2 right-2 text-2xl z-10 transition-all duration-200 hover:scale-125 ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {isFavorite ? '❤️' : '🤍'}
                                </button>
                                <div className="p-3 cursor-pointer" onClick={() => handleCardClick(card)}>
                                    <h2 className="text-sm font-bold truncate">{card.name}</h2>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Pagination cardsPerPage={CARDS_PER_PAGE} totalCards={cards.length} paginate={paginate} currentPage={currentPage} />
            </div>
            <CardModal card={selectedCard} onClose={handleCloseModal} isFavorite={selectedCard ? favorites.includes(selectedCard.id) : false} toggleFavorite={toggleFavorite} />
        </div>
    );
}

export default CardSearch;