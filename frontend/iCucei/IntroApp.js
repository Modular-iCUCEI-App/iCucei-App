import React, { Component, useEffect, useCallback } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

function IntroAppInner({ navigation }) {
  const player = useVideoPlayer(require("./assets/iCucei_Intro.mp4"), (p) => {
    p.loop = false; 
    p.muted = true;    
    p.play();           
  });

  const goHome = useCallback(() => {
    navigation.replace("Loginn");
  }, [navigation]);

  useEffect(() => {
    const subStatus = player.addListener("statusChange", (e) => {
      if (e.status === "idle") goHome();
    });
    let subEnded;
    try { subEnded = player.addListener("playToEnd", goHome); } catch {}

    return () => {
      subStatus.remove();
      subEnded?.remove?.();
    };
  }, [player, goHome]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"              
        nativeControls={false}
        fullscreenOptions={{ enabled: false }}
        allowsPictureInPicture={false}
      />

      <Pressable
        onPress={goHome}
        style={styles.skip}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Saltar intro"
      >
        <Text style={styles.skipText}>Saltar Intro</Text>
      </Pressable>
    </View>
  );
}

export default class IntroApp extends Component {
  render() {
    return <IntroAppInner navigation={this.props.navigation} />;
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    justifyContent: "center" 
},
  video: { 
    position: "absolute", 
    top: 0, 
    right: 0, 
    bottom: 0, 
    left: 0 
},
  skip: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 20, 
    fontFamily: 'ArialR',
},
});
