import React from 'react';
import SectionPage from './SectionPage';

export default function Estacionamiento({ navigation }) {
  return (
    <SectionPage
      navigation={navigation}
      title="Estacionamiento"
      image={require('./Imagenes/Icons/Apartados/Estacionamiento_icon.png')}
      description="Consulta información relacionada con el estacionamiento del centro universitario."
      detail="La disponibilidad y los avisos de estacionamiento aún no están conectados a la aplicación."
    />
  );
}
