import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PRINCIPAL from "./Principal";
import DIRECTORIO from "./Directorio";
import VIDEO from "./Video";
import MAPA from "./Mapa";
import INTROAPP from "./IntroApp";
import LOGINN from "./Loginn";
import STUDENT from "./Student";
import OPORTUNIDADES from "./Oportunidades";
import SERVICIOS from "./Servicios";
import QCEI from "./QceiIA";
import ESTACIONAMIENTO from "./Estacionamiento";
import ANUNCIOS from "./Anuncios";
import ACTIVIDADES from "./Actividades";
import BECAS from "./Becas";


export default class Menu extends Component {
  render() {
    const Stack = createNativeStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="IntroApp"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="IntroApp" component={INTROAPP} />
          <Stack.Screen name="Inicio" component={PRINCIPAL} />
          <Stack.Screen name="Directorio" component={DIRECTORIO} />
          <Stack.Screen name="Video" component={VIDEO} />
          <Stack.Screen name="Mapa" component={MAPA} />
          <Stack.Screen name="Loginn" component={LOGINN} />
          <Stack.Screen name="Student" component={STUDENT} />
          <Stack.Screen name="Oportunidades" component={OPORTUNIDADES} />
          <Stack.Screen name="Servicios" component={SERVICIOS} />
          <Stack.Screen name="QceiIA" component={QCEI} />
          <Stack.Screen name="Estacionamiento" component={ESTACIONAMIENTO} />
          <Stack.Screen name="Anuncios" component={ANUNCIOS} />
          <Stack.Screen name="Actividades" component={ACTIVIDADES} />
          <Stack.Screen name="Becas" component={BECAS} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
