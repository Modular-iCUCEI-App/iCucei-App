import React from 'react';
import { View, StatusBar, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import MENU from './Menu';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    MyFontArialR: require('./Fonts/ArialR.ttf'),
    MyFontRobotoSlab: require('./Fonts/RobotoSlab.ttf'),
    MyFontSourceSansPro: require('./Fonts/SourceSansPro.ttf'),
    FrauncesBlack: require('./Fonts/FrauncesBlack.ttf'),
    FrauncesBlackItalic: require('./Fonts/FrauncesBlackItalic.ttf'),
    PoppinsBold: require('./Fonts/Poppins-Bold.ttf'),
    Poppins: require('./Fonts/Poppins.ttf'),
    ArialNova: require('./Fonts/ArialNova.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.splashWrap}>
        <Image
          source={require('./assets/iCuceiLogo.png')}
          style={styles.splashImg}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <MENU />
    </View>
  );
}

const styles = StyleSheet.create({
  splashWrap: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImg: {
    width: 220,  
    height: 220,
  },
});
