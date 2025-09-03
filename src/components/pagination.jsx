import React from 'react';

function Pagination({ cardsPerPage, totalCards, paginate, currentPage }) {
  const pageNumbers = [];

  // Calcula o número total de páginas
  for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Não renderiza nada se houver apenas uma página
  if (pageNumbers.length <= 1) {
    return null;
  }

  return (
    <nav className="mt-8 flex justify-center">
      <ul className="flex items-center gap-2">
        {/* Botão de Voltar */}
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Anterior
          </button>
        </li>

        {/* Informação da Página Atual */}
        <li className="text-gray-300">
          Página {currentPage} de {pageNumbers.length}
        </li>

        {/* Botão de Avançar */}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Próximo
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;