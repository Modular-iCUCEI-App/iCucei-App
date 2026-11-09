import React from 'react';
import SectionPage from './SectionPage';

export default function Servicios({ navigation }) {
  return (
    <SectionPage
      navigation={navigation}
      title="Servicios"
      image={require('./Imagenes/Icons/Apartados/Servicios_icon.png')}
      description="Encuentra los servicios y recursos de apoyo para estudiantes del CUCEI."
      detail="La información de servicios se publicará en este apartado conforme se integre a la aplicación."
    />
  );
}
