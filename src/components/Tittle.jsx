import React from 'react';

// Componente de título com estilização corrigida e melhorada
function Tittle() {
  return (
    <div className="w-full max-w-3xl text-white text-center border border-gray-700 rounded-lg p-6 my-8 bg-gradient-to-r from-red-800 via-purple-900 to-blue-800 shadow-2xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-2">
        Bem-vindo ao Yu-Gi-Oh!
      </h1>
      <p className="text-lg text-gray-200">
        Explore o mundo dos duelos e cartas mágicas.
      </p>
    </div>
  );
}


export default Tittle;
