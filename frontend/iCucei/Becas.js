import React from 'react';
import SectionPage from './SectionPage';

export default function Becas({ navigation }) {
  return (
    <SectionPage
      navigation={navigation}
      title="Becas"
      image={require('./Imagenes/Icons/Apartados/Oportunidades_icon.png')}
      description="Encuentra información sobre apoyos y convocatorias de becas para estudiantes."
      detail="Consulta las convocatorias oficiales de CUCEI y la Universidad de Guadalajara para conocer requisitos y fechas vigentes."
    />
  );
}
