import React from 'react';
import SectionPage from './SectionPage';

export default function Actividades({ navigation }) {
  return (
    <SectionPage
      navigation={navigation}
      title="Actividades"
      image={require('./Imagenes/Icons/Apartados/Actividades_icon.png')}
      description="Descubre actividades académicas, culturales y deportivas de la comunidad CUCEI."
      detail="Las actividades y sus fechas se mostrarán aquí cuando se conecte la fuente institucional."
    />
  );
}
