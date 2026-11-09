import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#08749b';

export default function SectionPage({ navigation, title, image, description, detail }) {
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Inicio');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={image} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.detailCard}>
          <Ionicons name="information-circle-outline" size={24} color={PRIMARY} />
          <Text style={styles.detail}>{detail}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY },
  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: PRIMARY,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#e3eef3',
    padding: 22,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
    elevation: 2,
  },
  image: { width: 170, height: 150, marginBottom: 8 },
  title: {
    color: '#075a75',
    fontFamily: 'MyFontRobotoSlab',
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 29,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: '#355563',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#d3edf6',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  detail: { flex: 1, color: '#075a75', fontSize: 14, lineHeight: 21 },
});
