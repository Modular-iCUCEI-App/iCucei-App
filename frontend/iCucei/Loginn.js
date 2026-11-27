import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image, ImageBackground, Alert,
  Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
  StatusBar, useWindowDimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const STORAGE_KEY = 'Datos';

const paper = require('./Imagenes/MedioFondoLogIn.png');
const notification = require('./Imagenes/NotificacionLogIn.png');
const logo = require('./assets/iCuceiLogo.png');
const spinner = require('./assets/Loading.gif');

function readResponseObjects(raw) {
  // El servidor puede concatenar varios objetos JSON en la misma respuesta.
  const blocks = [];
  let start = 0;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
    } else if (depth === 0) {
      if (/\s/.test(char)) continue;
      if (char !== '{') throw new SyntaxError('Respuesta de autenticación inesperada');
      start = i;
      depth = 1;
    } else if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth++;
    } else if (char === '}' && --depth === 0) {
      blocks.push(JSON.parse(raw.slice(start, i + 1)));
    }
  }

  if (depth || !blocks.length) throw new SyntaxError('Respuesta de autenticación incompleta');
  return blocks;
}

function hasStudent(data) {
  const name = data?.alumno?.nombre ?? data?.nombre;
  return typeof name === 'string' && name.trim().length > 0;
}

function parseCuceiPayload(raw) {
  const blocks = readResponseObjects(raw);
  const merged = blocks.reduce((acc, cur) => {
    const out = { ...acc };

    if (Array.isArray(cur.materias)) {
      const prev = Array.isArray(out.materias) ? out.materias : [];
      const all = [...prev, ...cur.materias];
      const seen = new Set();
      out.materias = all.filter(it => {
        const key = `${it?.nrc || ''}|${it?.clave || ''}|${it?.descripcion || ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    if (Array.isArray(cur.creditosAreas)) {
      out.creditosAreas = cur.creditosAreas;
    }

    for (const k of Object.keys(cur)) {
      if (k === 'materias' || k === 'creditosAreas') continue;
      // no sobrescribir con vacío
      const v = cur[k];
      if (v === undefined || v === null || v === '') continue;
      if (typeof out[k] === 'number' && typeof v === 'number' && out[k] > 0 && v === 0) continue;
      out[k] = v;
    }
    return out;
  }, {});

  return blocks.length === 1 ? normalizeShape(blocks[0]) : normalizeShape(merged);
}

function normalizeShape(obj) {
  // Si ya viene con alumno/academico, respétalo
  if (obj?.alumno || obj?.academico) {
    return {
      alumno: {
        carrera: obj?.alumno?.carrera ?? obj?.carrera ?? '',
        nombre: obj?.alumno?.nombre ?? obj?.nombre ?? '',
        codigo: obj?.alumno?.codigo ?? obj?.codigo ?? '',
        ciclo: obj?.alumno?.ciclo ?? obj?.ciclo ?? '',
        campus: obj?.alumno?.campus ?? obj?.campus ?? '',
        situacion: obj?.alumno?.situacion ?? obj?.situacion ?? '',
      },
      academico: {
        creditos: Number(obj?.academico?.creditos ?? obj?.creditos ?? 0),
        creditosRequeridos: Number(obj?.academico?.creditosRequeridos ?? obj?.creditosRequeridos ?? 0),
        promedio: Number(
          obj?.academico?.promedio ?? obj?.promedio ?? 0
        ),
        materias: Array.isArray(obj?.academico?.materias) ? obj.academico.materias
                 : Array.isArray(obj?.materias) ? obj.materias : [],
        creditosAreas: Array.isArray(obj?.academico?.creditosAreas) ? obj.academico.creditosAreas
                      : Array.isArray(obj?.creditosAreas) ? obj.creditosAreas : [],
      },
    };
  }

  // Forma plana -> a forma normalizada
  return {
    alumno: {
      carrera: obj?.carrera ?? '',
      nombre: obj?.nombre ?? '',
      codigo: obj?.codigo ?? '',
      ciclo: obj?.ciclo ?? '',
      campus: obj?.campus ?? '',
      situacion: obj?.situacion ?? '',
    },
    academico: {
      creditos: Number(obj?.creditos ?? 0),
      creditosRequeridos: Number(obj?.creditosRequeridos ?? 0),
      promedio: Number(obj?.promedio ?? 0),
      materias: Array.isArray(obj?.materias) ? obj.materias : [],
      creditosAreas: Array.isArray(obj?.creditosAreas) ? obj.creditosAreas : [],
    },
  };
}

// Borde irregular con fibras sombreadas entre el papel blanco y el fondo azul.
const paperEdge = 'M0 2 L7 5 12 4 18 7 23 5 30 8 38 7 45 11 52 10 58 14 65 13 70 17 77 17 84 21 91 20 97 24 106 23 112 27 120 25 126 22 134 24 141 23 148 28 156 26 162 29 170 26 177 30 183 28 190 32 199 30 206 34 214 31 220 34 226 33 234 37 242 36 248 41 255 40 263 43 271 42 277 44 285 41 293 44 301 42 309 45 317 44 325 47 331 45 340 48 347 46 355 49 362 48 370 51 377 50 385 54 392 53 399 57 406 56 414 53';

export default function Login({ navigation }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [codigo, setCodigo] = useState('');
  const [nip, setNip] = useState('');
  const [showNip, setShowNip] = useState(false);
  const [phase, setPhase] = useState('checking');
  const nipInputRef = useRef(null);
  const requestRef = useRef(null);
  const mounted = useRef(false);
  const sending = phase === 'sending';

  useEffect(() => {
    mounted.current = true;
    let active = true;
    (async () => {
      let nextPhase = 'form';
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const cached = (() => {
            try { return JSON.parse(raw); } catch { return null; }
          })();
          if (hasStudent(cached)) nextPhase = 'welcome';
          else await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Si la sesión local no se puede leer, se puede iniciar sesión otra vez.
      }
      if (active) setPhase(nextPhase);
    })();

    return () => {
      active = false;
      mounted.current = false;
      requestRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'welcome') return;
    const timer = setTimeout(() => navigation.replace('Inicio'), 1600);
    return () => clearTimeout(timer);
  }, [navigation, phase]);

  const handleLogin = async () => {
    if (phase !== 'form' || requestRef.current) return;

    const studentCode = codigo.trim();
    const password = nip.trim();
    if (!studentCode || !password) {
      Alert.alert('Campos requeridos', 'Ingresa tu código de estudiante y contraseña.');
      return;
    }

    Keyboard.dismiss();
    const controller = new AbortController();
    requestRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    setPhase('sending');

    const url = `https://cuceimobile.space/campusCucei/auth.php?codigo=${encodeURIComponent(studentCode)}&nip=${encodeURIComponent(password)}`;
    let nextPhase = 'form';
    try {
      const response = await fetch(url, {
        headers: { 'Cache-Control': 'no-store' },
        signal: controller.signal,
      });

      if (!mounted.current) return;
      if ([401, 403].includes(response.status)) {
        Alert.alert('No se pudo iniciar sesión', 'Revisa tu código y contraseña.');
      } else if (!response.ok) {
        Alert.alert('Servidor no disponible', `Intenta de nuevo más tarde (HTTP ${response.status}).`);
      } else {
        const raw = await response.text();
        if (!mounted.current) return;
        if (/^error code:\s*5\d{2}\s*$/i.test(raw.trim())) {
          Alert.alert('Servidor no disponible', 'Intenta de nuevo más tarde.');
          return;
        }
        const payload = parseCuceiPayload(raw);
        if (!hasStudent(payload)) {
          Alert.alert('No se pudo iniciar sesión', 'Revisa tu código y contraseña e inténtalo de nuevo.');
          return;
        }
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        nextPhase = 'welcome';
      }
    } catch (error) {
      if (!mounted.current) return;
      if (controller.signal.aborted) {
        Alert.alert('Tiempo de espera agotado', 'El servidor tardó demasiado en responder. Intenta de nuevo.');
      } else if (error instanceof SyntaxError) {
        Alert.alert('Respuesta inesperada', 'El servidor no devolvió datos válidos. Intenta de nuevo más tarde.');
      } else {
        Alert.alert('No se pudo iniciar sesión', 'Verifica tu conexión e inténtalo de nuevo.');
      }
    } finally {
      clearTimeout(timeoutId);
      requestRef.current = null;
      if (mounted.current) setPhase(nextPhase);
    }
  };

  if (phase === 'welcome') {
    return (
      <ImageBackground source={paper} style={styles.screen} blurRadius={7}>
        <StatusBar barStyle="dark-content" />
        <ImageBackground
          source={notification}
          resizeMode="stretch"
          style={[styles.notification, { top: Math.max(insets.top + 16, height * 0.272) }]}
        >
          <Image source={spinner} style={styles.spinner} />
          <Text accessibilityRole="header" style={styles.welcomeTitle}>
            {'¡Bienvenid@\nde vuelta!'}
          </Text>
          <Text accessibilityLiveRegion="polite" style={styles.redirectText}>
            Redirigiendo a tu Dashboard...
          </Text>
        </ImageBackground>
      </ImageBackground>
    );
  }

  if (phase === 'checking') return <View style={styles.checking} />;

  const brandHeight = Math.max(222, height * 0.29);
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        automaticallyAdjustContentInsets={false}
      >
        <View style={[styles.loginPaper, { top: brandHeight }]} pointerEvents="none">
          <Image source={paper} style={styles.paperImage} />
        </View>
        <View style={[styles.brandArea, { height: brandHeight, paddingTop: insets.top + 14 }]}>
          <View style={[styles.dots, { top: Math.max(20, insets.top + 8) }]} pointerEvents="none">
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.brandName}>iCucei</Text>
        </View>
        <Svg width="100%" height={58} viewBox="0 0 414 58" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="edgeShadow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#c4c7c7" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#a6a8a9" stopOpacity="0.35" />
            </LinearGradient>
          </Defs>
          <Path d={paperEdge} stroke="url(#edgeShadow)" strokeWidth={7} fill="none" />
          <Path d={`${paperEdge} L414 0 H0 Z`} fill="#fdfdfd" />
        </Svg>

        <View style={[styles.formArea, { paddingBottom: insets.bottom + 15 }]}>
          <Text accessibilityRole="header" style={styles.headerText}>Log In</Text>
          <Text style={styles.subtitle}>Inicie sesión con su cuenta Udg</Text>

          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              accessibilityLabel="Código de estudiante"
              placeholder="Código de Estudiante"
              placeholderTextColor="#e9f4f8"
              value={codigo}
              onChangeText={setCodigo}
              editable={!sending}
              returnKeyType="next"
              keyboardType="number-pad"
              autoComplete="username"
              autoCapitalize="none"
              onSubmitEditing={() => nipInputRef.current?.focus()}
            />
          </View>

          <View style={[styles.inputField, styles.passwordField]}>
            <TextInput
              style={styles.input}
              accessibilityLabel="Contraseña"
              placeholder="Contraseña"
              placeholderTextColor="#e9f4f8"
              secureTextEntry={!showNip}
              value={nip}
              onChangeText={setNip}
              editable={!sending}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              ref={nipInputRef}
            />
            {(nip.length > 0 || showNip) && (
              <TouchableOpacity
                onPress={() => setShowNip(!showNip)}
                style={styles.iconContainer}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showNip ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <FontAwesome name={showNip ? 'eye-slash' : 'eye'} size={18} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            disabled={sending}
            accessibilityRole="button"
            accessibilityState={{ busy: sending, disabled: sending }}
          >
            <Text style={styles.buttonText}>{sending ? 'Conectando…' : 'Entrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert(
              'Recuperar contraseña',
              'Para recuperar tu contraseña, utiliza los canales oficiales de SIIAU/LEO.'
            )}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.replace('Inicio')}
            style={styles.preview}
            disabled={sending}
            accessibilityRole="button"
          >
            <Text style={styles.previewText}>Explorar como invitado</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const blue = '#006e94';
const ink = '#00536f';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#c9edf7' },
  checking: { flex: 1, backgroundColor: '#fdfdfd' },
  scrollContent: { flexGrow: 1 },
  loginPaper: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  paperImage: { width: '100%', height: '100%' },
  brandArea: { backgroundColor: '#fdfdfd', alignItems: 'center', justifyContent: 'center' },
  dots: { position: 'absolute', left: '10%', flexDirection: 'row', gap: 4 },
  dot: { height: 7, width: 7, borderRadius: 4, backgroundColor: '#367963' },
  logo: { width: 126, height: 126 },
  brandName: {
    marginTop: 2,
    color: blue,
    fontFamily: 'FrauncesBlack',
    fontSize: 42,
  },
  formArea: { alignSelf: 'center', alignItems: 'center', width: '80%', maxWidth: 440, paddingTop: 38 },
  headerText: { fontFamily: 'FrauncesBlackItalic', fontSize: 36, color: blue, marginBottom: 25 },
  subtitle: {
    fontFamily: 'PoppinsBold',
    fontSize: 18, color: ink, textAlign: 'center', marginBottom: 28,
  },
  inputField: { width: '100%', borderRadius: 32, backgroundColor: ink },
  passwordField: { marginTop: 26 },
  input: {
    width: '100%',
    minHeight: 59,
    paddingHorizontal: 30,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'ArialNova',
    transform: [{ skewX: '-8deg' }],
  },
  iconContainer: { position: 'absolute', right: 16, top: 19 },
  button: {
    backgroundColor: '#75b9cf',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 33,
    marginBottom: 45,
    width: '52%',
    minHeight: 45,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff', textAlign: 'center', fontSize: 21,
    fontFamily: 'ArialNova', transform: [{ skewX: '-8deg' }],
  },
  forgotText: {
    color: ink, fontFamily: 'Poppins', fontSize: 14, textDecorationLine: 'underline',
  },
  preview: { marginTop: 12, minHeight: 44, justifyContent: 'center' },
  previewText: { color: ink, fontFamily: 'ArialNova', fontSize: 12 },
  notification: { position: 'absolute', width: '81%', maxWidth: 360, alignSelf: 'center', aspectRatio: 1600 / 1024 },
  spinner: { position: 'absolute', top: '7%', width: '13%', aspectRatio: 1, alignSelf: 'center' },
  welcomeTitle: {
    fontFamily: 'FrauncesBlackItalic',
    position: 'absolute', top: '30%', width: '100%', textAlign: 'center', color: blue,
    fontSize: 26, lineHeight: 28,
  },
  redirectText: {
    position: 'absolute', top: '61%', width: '100%', textAlign: 'center',
    fontFamily: 'ArialNova', fontSize: 16, color: ink, transform: [{ skewX: '-8deg' }],
  },
});
