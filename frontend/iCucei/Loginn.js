import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ImageBackground, Alert,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'Datos';

/**
 * La API a veces devuelve DOS objetos JSON seguidos:  {...}{...}
 * y dentro del segundo viene: materias:[{...},{...},...], creditosAreas:[...]
 *
 * Este parser:
 * 1) Separa SOLO top-level objetos con el patrón `}{` (nunca ocurre dentro de arrays)
 * 2) Parsea cada bloque con JSON.parse
 * 3) Normaliza a:
 *    {
 *      alumno: { carrera, nombre, codigo, ciclo, campus, situacion },
 *      academico: { creditos, creditosRequeridos, promedio, materias[], creditosAreas[] }
 *    }
 */
function parseCuceiPayload(rawText) {
  const txt = String(rawText || '').trim().replace(/^\uFEFF/, '');
  // Si ya es un único JSON válido, úsalo directo
  try {
    const once = JSON.parse(txt);
    return normalizeShape(once);
  } catch {}

  // Si vienen pegados:  ...}{...
  const SAFE_SPLIT = '@@SPLIT@@';
  const joined = txt.replace(/}\s*{/g, `}${SAFE_SPLIT}{`);
  const chunks = joined.split(SAFE_SPLIT);

  const blocks = [];
  for (const chunk of chunks) {
    try { blocks.push(JSON.parse(chunk)); } catch {}
  }
  if (!blocks.length) throw new Error('Respuesta no contiene JSON válido');

  // fusiona manteniendo arrays
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

  return normalizeShape(merged);
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
          typeof obj?.academico?.promedio === 'number'
            ? obj?.academico?.promedio
            : obj?.promedio ?? 0
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

export default function Login({ navigation }) {
  const [codigo, setCodigo] = useState('');
  const [nip, setNip] = useState('');
  const [showNip, setShowNip] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const nipInputRef = useRef(null);

  // Si ya hay sesión, saltar a Student
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          navigation.replace('Inicio');
          return;
        }
      } catch {}
      setChecking(false);
    })();
  }, [navigation]);

  const handleLogin = async () => {
    if (!codigo || !nip) {
      Alert.alert('Campos requeridos', 'Por favor ingresa el Código y NIP');
      return;
    }

    const url = `https://cuceimobile.space/campusCucei/auth.php?codigo=${encodeURIComponent(
      codigo.trim()
    )}&nip=${encodeURIComponent(nip.trim())}`;

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.log('HTTP no OK:', res.status, txt.slice(0, 200));
        Alert.alert('Servidor no disponible', `HTTP ${res.status}`);
        return;
      }

      const raw = await res.text();
      if (/\"message\"/i.test(raw) && !/{/.test(raw)) {
        Alert.alert('Error', 'Credenciales inválidas');
        return;
      }

      const payload = parseCuceiPayload(raw);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      Alert.alert('Bienvenid@', `Hola ${payload?.alumno?.nombre || 'Alumno'}`);

      navigation.replace('Inicio');
    } catch (error) {
      const isAbort = error?.name === 'AbortError';
      console.log('Error de red/login:', error);
      Alert.alert(
        isAbort ? 'Tiempo de espera agotado' : 'Error de conexión',
        isAbort ? 'El servidor tardó demasiado en responder.' : (error?.message || 'No se pudo conectar con el servidor')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Para recuperar tu contraseña, utiliza los canales oficiales de SIIAU/LEO.'
    );
  };

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.backgroundImage}>
      <View style={styles.brandArea}>
        <ImageBackground
          source={require('./assets/iCuceiLogo.png')}
          style={styles.logo}
          imageStyle={styles.logoImage}
        />
        <Text style={styles.brandName}>iCucei</Text>
      </View>
      <View style={styles.formArea}>
        <Text style={styles.headerText}>Log In</Text>
        <Text style={styles.text}>Inicie sesión con su cuenta UDG</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Código de Estudiante"
            placeholderTextColor="#e9f4f8"
            value={codigo}
            onChangeText={setCodigo}
            returnKeyType="next"
            autoCapitalize="none"
            onSubmitEditing={() => nipInputRef.current?.focus()}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#e9f4f8"
            secureTextEntry={!showNip}
            value={nip}
            onChangeText={setNip}
            returnKeyType="done"
            ref={nipInputRef}
          />
          <TouchableOpacity
            onPress={() => setShowNip(!showNip)}
            style={styles.iconContainer}
            accessibilityRole="button"
            accessibilityLabel={showNip ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <FontAwesome name={showNip ? 'eye' : 'eye-slash'} size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} accessibilityRole="button">
          <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, backgroundColor: '#c9edf7' },
  brandArea: {
    height: '34%',
    minHeight: 230,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logo: { width: 126, height: 126 },
  logoImage: { resizeMode: 'contain' },
  brandName: {
    marginTop: 6,
    color: '#08749b',
    fontFamily: 'MyFontRobotoSlab',
    fontSize: 34,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  formArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  text: {
    fontSize: 18,
    color: '#07536e',
    textAlign: 'center',
    fontFamily: 'MyFontArialR',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 36,
    color: '#08749b',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#075a75',
    borderRadius: 28,
  },
  input: {
    height: 58,
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'MyFontArialR',
    paddingHorizontal: 48,
  },
  iconContainer: { position: 'absolute', right: 18, top: 17 },
  button: {
    backgroundColor: '#72bfd4',
    borderRadius: 28,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 28,
    width: '55%',
    minHeight: 52,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'MyFontArialR',
  },
  forgotText: {
    color: '#075a75',
    fontFamily: 'MyFontArialR',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
