import React, { useState, useEffect } from 'react';
import CardModal from './CardModal'; // Reutilizamos o modal

// Estrutura de dados com o guia detalhado e exemplos de cartas em português
const rulesSections = [
    {
        title: 'O Objetivo do Jogo',
        content: 'O objetivo principal em Yu-Gi-Oh! é reduzir os Pontos de Vida (LP) do seu oponente de 5000 para 0. Você também vence se o seu oponente não puder comprar uma carta do baralho (Deck Out) ou se uma condição especial, como a do Exodia, for cumprida.',
        exampleCards: ['Exodia, "o Proibido"', 'Desvanecer da Batalha', 'Espadas da Luz Reveladora'],
    },
    {
        title: 'O Campo de Jogo',
        content: 'Cada duelista tem seu próprio lado do campo, dividido em zonas: \n• Zona de Monstros (5): Onde seus monstros lutam. \n• Zona de Magias & Armadilhas (5): Onde você ativa e baixa suas magias/armadilhas. \n• Cemitério (GY): Para onde as cartas vão após serem usadas ou destruídas. \n• Deck Principal: Seu baralho de 40 a 60 cartas. \n• Deck Adicional: Um deck de 0 a 15 cartas com monstros de Fusão, Synchro, Xyz e Link.',
    },
    {
        title: 'Tipos de Cartas de Monstro',
        content: 'Os monstros são a sua principal força de ataque e defesa. Existem vários tipos:',
        subsections: [
            {
                title: 'Monstros Normais (Amarelos)',
                content: 'Cartas simples com ATK (Ataque) e DEF (Defesa), mas sem efeitos especiais. A sua descrição (em itálico) conta uma pequena história sobre eles.',
                exampleCards: ['Dragão Branco de Olhos Azuis', 'Mago Negro', 'Kuriboh'],
            },
            {
                title: 'Monstros de Efeito (Laranja)',
                content: 'A espinha dorsal da maioria dos decks. Estes monstros têm efeitos especiais que podem ser ativados em diferentes momentos do jogo para virar o duelo a seu favor.',
                exampleCards: ['Inseto Devorador de Homens', 'Sangan', 'Guia de Excursão do Submundo'],
            },
            {
                title: 'Monstros de Ritual (Azuis)',
                content: 'Invocados da sua mão usando uma Carta de Magia de Ritual específica. Você precisa tributar monstros da sua mão ou campo cujos Níveis somados sejam iguais ou maiores que o do Monstro de Ritual.',
                exampleCards: ['Soldado do Lustro Negro - Super Soldado', 'Necroz de Brionac', 'Soldado do Lustro Negro'],
            },
            {
                title: 'Monstros de Fusão (Roxos)',
                content: 'Vivem no Deck Adicional. São invocados ao fundir dois ou mais monstros específicos (listados na carta) usando uma carta como a "Polimerização".',
                exampleCards: ['Dragão Definitivo de Olhos Azuis', 'Paladino Negro', 'Homem-Alado das Chamas, o HERÓI do Elemento'],
            },
            {
                title: 'Monstros Synchro (Brancos)',
                content: 'Vivem no Deck Adicional. São invocados ao enviar um monstro "Regulador" e um ou mais monstros "não-Reguladores" do seu campo para o Cemitério, desde que a soma dos seus níveis seja exatamente igual ao nível do Monstro Synchro.',
                exampleCards: ['Dragão da Poeira Estelar', 'Dragão Vermelho Arquidemônio', 'Dragão da Rosa Negra'],
            },
            {
                title: 'Monstros Xyz (Pretos)',
                content: 'Vivem no Deck Adicional. São invocados ao sobrepor dois ou mais monstros com o mesmo nível no seu campo. Esses monstros tornam-se "Materiais Xyz" e são usados para ativar os efeitos da carta.',
                exampleCards: ['Número 39: Utopia', 'Castel, o Mosqueteiro Destruidor Celeste', 'Cowboy Gagaga'],
            },
            {
                title: 'Monstros Pêndulo (Híbridos)',
                content: 'Cartas que são metade monstro, metade magia. Podem ser ativadas nas Zonas Pêndulo para permitir a "Invocação-Pêndulo", que invoca múltiplos monstros de uma vez da sua mão ou Deck Adicional.',
                exampleCards: ['Dragão Pêndulo de Olhos Anômalos', 'Mago Observador das Estrelas', 'Mago Observador do Tempo'],
            },
            {
                title: 'Monstros Link (Azul Escuro)',
                content: 'Vivem no Deck Adicional e não têm Nível ou DEF. São invocados ao enviar um número específico de monstros do seu campo para o Cemitério. As suas "Setas Link" apontam para outras zonas no campo, habilitando jogadas mais complexas.',
                exampleCards: ['Decodificar Transmissor', 'Dragão Firewall', 'Cavaleira do Pesadelo Fênix'],
            },
        ],
    },
    {
        title: 'Cartas de Magia (Verdes)',
        content: 'Estas cartas geralmente têm efeitos positivos para si e podem ser ativadas da sua mão na sua Fase Principal.',
        subsections: [
            {
                title: 'Magias Normais',
                content: 'Ative, resolva o efeito e envie-a para o Cemitério. Simples e direto.',
                exampleCards: ['Reviver Monstro', 'Pote da Ganância', 'Raigeki'],
            },
            {
                title: 'Magias Contínuas (∞)',
                content: 'Permanecem no campo após a ativação, e seu efeito continua ativo enquanto estiverem com a face para cima.',
                exampleCards: ['Mina Mística', 'Formação de Fogo - Tenki', 'Mensageiro da Paz'],
            },
            {
                title: 'Magias Rápidas (⚡)',
                content: 'Podem ser ativadas em qualquer fase do seu turno. Se baixadas, podem ser ativadas até mesmo no turno do oponente.',
                exampleCards: ['Tufão Espacial Místico', 'Livro da Lua', 'Lança Proibida'],
            },
            {
                title: 'Magias de Equipamento (+)',
                content: 'Anexam-se a um monstro em campo para lhe dar um novo efeito, aumentar ou diminuir seu ATK/DEF.',
                exampleCards: ['Machado do Desespero', 'Poder de Mago', 'Roubo Precipitado'],
            },
        ]
    },
    {
        title: 'Cartas de Armadilha (Magentas)',
        content: 'Sua principal forma de interagir durante o turno do oponente. Você precisa baixá-las (colocar viradas para baixo) primeiro e não pode ativá-las no mesmo turno.',
        subsections: [
            {
                title: 'Armadilhas Normais',
                content: 'São ativadas em resposta a uma ação específica (um ataque, uma invocação, etc.) e depois vão para o Cemitério.',
                exampleCards: ['Força do Espelho', 'Buraco Armadilha', 'Tributo Torrencial'],
            },
            {
                title: 'Armadilhas Contínuas (∞)',
                content: 'Assim como as Magias Contínuas, estas permanecem no campo aplicando seu efeito turno após turno.',
                exampleCards: ['Drenar Habilidades', 'Duelo Gozen', 'Ordem Imperial'],
            },
            {
                title: 'Armadilhas de Resposta (↩️)',
                content: 'As cartas mais rápidas do jogo. São ativadas em resposta direta à ativação de outra carta ou efeito, com o objetivo de negá-lo.',
                exampleCards: ['Julgamento Solene', 'Limpeza de Spells', 'Golpe Solene'],
            },
        ]
    },
    {
        title: 'As Fases de um Turno',
        content: 'Cada turno segue uma ordem: \n1. Fase de Compra: Compre uma carta. \n2. Fase de Apoio: Alguns efeitos são ativados. \n3. Fase Principal 1: Invoque monstros, ative magias, baixe cartas. \n4. Fase de Batalha: Ataque os monstros do oponente ou seus Pontos de Vida. \n5. Fase Principal 2: Ações da Fase Principal 1 novamente, após a batalha. \n6. Fase de Encerramento: Efeitos de fim de turno são ativados.',
    },
];


function HowToPlayPage() {
    const [cardData, setCardData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        // Coleta todos os nomes de cartas de exemplo num único array, sem duplicados
        const allCardNames = new Set();
        rulesSections.forEach(section => {
            if (section.exampleCards) {
                section.exampleCards.forEach(name => allCardNames.add(name));
            }
            if (section.subsections) {
                section.subsections.forEach(sub => {
                    if (sub.exampleCards) {
                        sub.exampleCards.forEach(name => allCardNames.add(name));
                    }
                });
            }
        });

        const fetchAllCardData = async () => {
            try {
                const cardPromises = Array.from(allCardNames).map(name =>
                    // A chamada da API busca os nomes das cartas em português
                    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt&name=${encodeURIComponent(name)}`)
                        .then(res => res.json())
                        .then(data => (data && data.data) ? { name, data: data.data[0] } : null)
                );

                const results = await Promise.all(cardPromises);
                const cardMap = {};
                results.forEach(result => {
                    if (result && result.data) {
                        cardMap[result.name] = result.data;
                    }
                });
                setCardData(cardMap);
            } catch (error) {
                console.error("Erro ao buscar os exemplos de cartas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCardData();
    }, []);

    const handleCardClick = (card) => setSelectedCard(card);
    const handleCloseModal = () => setSelectedCard(null);

    const renderCardExamples = (cardNames) => {
        if (loading) return <p className="text-gray-400">A carregar exemplos...</p>;

        return (
            <div className="flex justify-center flex-wrap gap-4 mt-4">
                {cardNames.map(name => {
                    const card = cardData[name];
                    if (!card) return null;
                    return (
                        <img
                            key={card.id}
                            src={card.card_images[0].image_url}
                            alt={card.name} // O alt agora mostrará o nome em português
                            title={card.name} // O title agora mostrará o nome em português
                            onClick={() => handleCardClick(card)}
                            className="w-24 md:w-28 cursor-pointer rounded-md hover:scale-110 transition-transform duration-200"
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 text-gray-200">
            <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-yellow-400">Como Jogar Yu-Gi-Oh!</h1>

            <div className="space-y-8">
                {rulesSections.map(section => (
                    <section key={section.title} className="bg-slate-900/80 backdrop-blur-md p-6 rounded-lg border border-gray-700">
                        <h2 className="text-3xl font-bold text-blue-400 mb-4">{section.title}</h2>
                        {/* Usamos 'whitespace-pre-line' para que as quebras de linha (\n) no texto sejam renderizadas */}
                        <p className="text-lg leading-relaxed whitespace-pre-line">{section.content}</p>
                        {section.exampleCards && renderCardExamples(section.exampleCards)}

                        {section.subsections && (
                            <div className="mt-6 space-y-6">
                                {section.subsections.map(sub => (
                                    <div key={sub.title} className="pl-4 border-l-4 border-gray-600">
                                        <h3 className="text-2xl font-semibold text-gray-100">{sub.title}</h3>
                                        <p className="mt-1 text-base text-gray-300">{sub.content}</p>
                                        {sub.exampleCards && renderCardExamples(sub.exampleCards)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>
            <CardModal card={selectedCard} onClose={handleCloseModal} />
        </div>
    );
}

export default HowToPlayPage;