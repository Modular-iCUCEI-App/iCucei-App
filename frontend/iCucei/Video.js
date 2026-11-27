import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = (width * 9) / 16; // Relación 16:9

export default class Video extends Component {
  render() {
    return (
      <ImageBackground
        source={require("./Imagenes/Backgrounds/VideoBackg.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}> Video Institucional </Text>
            
            <View style={styles.videoWrapper}>
              <WebView
                source={{ uri: 'https://k1000ac.github.io/videoUdg/' }}
                style={styles.webVideo}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

// Estilos de la aplicación
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 15,
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    width: width,
    height: VIDEO_HEIGHT,
    marginTop: 350,
    
  },
  webVideo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerText: {
    fontFamily: 'FrauncesBlackItalic',
    fontSize: 58,
    color: "#ffffffff",
    position: "absolute",
    textAlign: "center",
    marginTop: 160,
  },
});
