import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';

export default class Directorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <ImageBackground
        source={require('./Imagenes/Backgrounds/DirBackground.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>

            <Text style={styles.headerText} allowFontScaling={false}>
            Directorio
            </Text>

            <View style={styles.webDirectory}>
              <WebView source={{ uri: 'https://cuceimobile.space/directorio.html' }} style={{ width:'120%', height:'120%', backgroundColor:'transparent',}} />
            </View>

          </View>
        </View>
      </ImageBackground>
    );
  }
}


// Estilos de la aplicación
const styles = StyleSheet.create({
  webDirectory:{
  flex: 0.9,
  paddingTop: 130,
  alignContent: 'center',
  width: 370,
  height: 580,
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10, 

  },
  headerText: {
    fontFamily: 'FrauncesBlackItalic',
    fontSize: 60,
    color: "#2f48d1ff",
    position: "absolute",
    textAlign: "center",
    marginTop: 50,
  },
});


