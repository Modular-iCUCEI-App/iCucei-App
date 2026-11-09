import React from 'react';
import SectionPage from './SectionPage';

export default function Anuncios({ navigation }) {
  return (
    <SectionPage
      navigation={navigation}
      title="Anuncios"
      image={require('./Imagenes/Icons/Apartados/Anuncios_icon.png')}
      description="Consulta avisos, comunicados y eventos para la comunidad universitaria."
      detail="Por el momento no hay avisos conectados a la aplicación. Consulta los canales oficiales de CUCEI para información actualizada."
    />
  );
}
