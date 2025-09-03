import React from 'react';
import backgroundImage from '../assets/WCS-hero-banner.png';

// Este componente cria um div que cobre todo o ecrã e aplica a imagem de fundo.
function Tela() {
  return (
    <div 
      className="fixed inset-0 -z-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
    </div>
  );
}

export default Tela;
