import React, { useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#08749b';

export default function QceiIA({ navigation, route }) {
  const [question, setQuestion] = useState(route?.params?.query ?? '');

  const handleAsk = () => {
    if (!question.trim()) {
      Alert.alert('Escribe tu pregunta', 'Ingresa una duda para iniciar una conversación con Qcei.');
      return;
    }
    Alert.alert(
      'Qcei IA',
      'El servicio de chat de Qcei IA todavía no está conectado. Tu pregunta no se ha enviado.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Qcei IA</Text>
      </View>
      <View style={styles.content}>
        <Image
          source={require('./Imagenes/Icons/Apartados/Qcei_icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>¿En qué te puedo ayudar?</Text>
        <Text style={styles.description}>
          Escribe una pregunta sobre CUCEI para iniciar tu consulta.
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={question}
            onChangeText={setQuestion}
            placeholder="Escribe tu pregunta..."
            placeholderTextColor="#718894"
            multiline
            accessibilityLabel="Pregunta para Qcei IA"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleAsk}
            accessibilityRole="button"
            accessibilityLabel="Enviar pregunta"
          >
            <Ionicons name="send" size={21} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.notice}>
          El chat se habilitará cuando el servicio de Qcei IA esté conectado.
        </Text>
      </View>
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
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginLeft: 10 },
  content: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e3eef3',
    paddingHorizontal: 22,
    paddingTop: 48,
  },
  image: { width: 144, height: 120, marginBottom: 18 },
  title: {
    color: '#075a75',
    fontFamily: 'MyFontRobotoSlab',
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 26,
    textAlign: 'center',
  },
  description: { color: '#355563', fontSize: 15, marginTop: 10, marginBottom: 24, textAlign: 'center' },
  inputRow: {
    width: '100%',
    minHeight: 60,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, minHeight: 44, maxHeight: 120, color: '#203d4b', paddingHorizontal: 10, fontSize: 15 },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
  },
  notice: {
    color: '#55717d',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 16,
  },
});
