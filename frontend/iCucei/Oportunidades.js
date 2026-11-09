import React from 'react';
import SectionPage from './SectionPage';

export default function Oportunidades({ navigation }) {
  return (
    <SectionPage
      navigation={navigation}
      title="Oportunidades"
      image={require('./Imagenes/Icons/Apartados/Oportunidades_icon.png')}
      description="Explora convocatorias, prácticas, actividades y otras oportunidades para la comunidad CUCEI."
      detail="Aquí se reunirán las oportunidades disponibles. Revisa los canales oficiales de CUCEI para convocatorias vigentes."
    />
  );
}
