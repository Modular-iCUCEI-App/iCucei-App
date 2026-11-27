import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY = '#08749b';
const STORAGE_KEY = 'Datos';

const SECTIONS = [
  {
    key: 'MiAvance',
    title: 'Mi Avance',
    image: require('./Imagenes/Icons/Apartados/MiAvance_icon.png'),
    route: 'Student',
  },
  {
    key: 'Mapa',
    title: 'Mapa',
    image: require('./Imagenes/Icons/Apartados/Mapa_icon.png'),
    route: 'Mapa',
  },
  {
    key: 'Campus',
    title: 'Campus',
    image: require('./Imagenes/Icons/Apartados/Campus_icon.png'),
    route: 'Video',
  },
  {
    key: 'Directorio',
    title: 'Directorio',
    image: require('./Imagenes/Icons/Apartados/Directorio_icon.png'),
    route: 'Directorio',
  },
  {
    key: 'Oportunidades',
    title: 'Oportunidades',
    image: require('./Imagenes/Icons/Apartados/Oportunidades_icon.png'),
    route: 'Oportunidades',
  },
  {
    key: 'Servicios',
    title: 'Servicios',
    image: require('./Imagenes/Icons/Apartados/Servicios_icon.png'),
    route: 'Servicios',
  },
  {
    key: 'QceiIA',
    title: 'Qcei IA',
    image: require('./Imagenes/Icons/Apartados/Qcei_icon.png'),
    route: 'QceiIA',
  },
  {
    key: 'Estacionamiento',
    title: 'Estacionamiento',
    image: require('./Imagenes/Icons/Apartados/Estacionamiento_icon.png'),
    route: 'Estacionamiento',
  },
  {
    key: 'Anuncios',
    title: 'Anuncios',
    image: require('./Imagenes/Icons/Apartados/Anuncios_icon.png'),
    route: 'Anuncios',
  },
  {
    key: 'Actividades',
    title: 'Actividades',
    image: require('./Imagenes/Icons/Apartados/Actividades_icon.png'),
    route: 'Actividades',
  },
];

const DRAWER_ITEMS = [
  { title: 'Mi Dashboard', target: 'home', highlighted: true },
  { title: 'Mis Apartados', target: 'sections', heading: true },
  ...SECTIONS,
  { title: 'Becas', route: 'Becas' },
];

const NEWS = [
  {
    title: 'Avisos institucionales',
    description: 'Consulta comunicados y avisos importantes para la comunidad CUCEI.',
  },
  {
    title: 'Eventos del CUCEI',
    description: 'Encuentra actividades, conferencias y eventos de la comunidad universitaria.',
  },
  {
    title: 'Novedades de tu centro',
    description: 'Mantente al tanto de la información publicada por CUCEI.',
  },
];

export default function Principal({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const drawerGesture = useMemo(() => {
    const swipeLeft = Gesture.Pan()
      .activeOffsetX(-20)
      .failOffsetY([-16, 16])
      .runOnJS(true)
      .onEnd(({ translationX, velocityX }) => {
        if (translationX < -56 || (translationX < -20 && velocityX < -450)) {
          setDrawerOpen(false);
        }
      });
    return Gesture.Simultaneous(Gesture.Native(), swipeLeft);
  }, []);
  const [newsIndex, setNewsIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [firstName, setFirstName] = useState('estudiante');
  const scrollRef = useRef(null);
  const sectionsOffset = useRef(0);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const datos = JSON.parse(raw);
        const name = datos?.alumno?.nombre || datos?.nombre;
        if (typeof name === 'string' && name.trim()) {
          setFirstName(name.trim().split(/\s+/)[0]);
        }
      })
      .catch((error) => {
        console.warn('No se pudo leer el nombre del estudiante:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setDrawerOpen(false);
      return true;
    });
    return () => subscription.remove();
  }, [drawerOpen]);

  const toggleDrawer = () => {
    Keyboard.dismiss();
    setDrawerOpen((open) => !open);
  };

  const goTo = (route, params) => {
    setDrawerOpen(false);
    navigation.navigate(route, params);
  };

  const changeNews = useCallback((step) => {
    setNewsIndex((current) => (current + step + NEWS.length) % NEWS.length);
  }, []);

  const newsSwipe = useMemo(() => Gesture.Pan()
    .activeOffsetX([-18, 18])
    .failOffsetY([-14, 14])
    .runOnJS(true)
    .onEnd(({ translationX, velocityX }) => {
      const distance = Math.abs(translationX);
      const quickSwipe = Math.sign(translationX) === Math.sign(velocityX)
        && Math.abs(velocityX) >= 450;
      if (distance >= 48 || (distance >= 22 && quickSwipe)) {
        changeNews(translationX < 0 ? 1 : -1);
      }
    }), [changeNews]);

  const handleSearch = () => {
    goTo('QceiIA', { query: query.trim() });
  };

  const handleDrawerItem = (item) => {
    setDrawerOpen(false);
    if (item.target === 'sections') {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: sectionsOffset.current, animated: true });
      });
      return;
    }
    if (item.target === 'home') {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    if (item.route) goTo(item.route);
  };

  const news = NEWS[newsIndex];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={toggleDrawer}
          accessibilityRole="button"
          accessibilityLabel={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
          accessibilityState={{ expanded: drawerOpen }}
        >
          <Ionicons name="menu" size={27} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.greeting} numberOfLines={1}>
          ¡Hola, {firstName}!
        </Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => goTo('Anuncios')}
          accessibilityRole="button"
          accessibilityLabel="Abrir anuncios"
        >
          <Ionicons name="notifications-outline" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <GestureHandlerRootView style={styles.body}>
        <ScrollView
          ref={scrollRef}
          importantForAccessibility={drawerOpen ? 'no-hide-descendants' : 'auto'}
          accessibilityElementsHidden={drawerOpen}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.dashboardTitle}>Mi Dashboard</Text>

          <View style={styles.newsSection}>
            <View style={styles.newsBadge}>
              <Text style={styles.newsBadgeText} accessibilityRole="header">News!</Text>
            </View>
            <GestureDetector gesture={newsSwipe}>
              <TouchableOpacity
                style={styles.newsCardButton}
                onPress={() => goTo('Anuncios')}
                activeOpacity={0.9}
                accessibilityRole="link"
                accessibilityLabel={`${news.title}. ${news.description} Ir al tablón de anuncios.`}
              >
                <ImageBackground
                  source={require('./Imagenes/CuadroNotificacion.png')}
                  style={[styles.newsCard, { minHeight: 210 * Math.max(1, fontScale) }]}
                  resizeMode="stretch"
                >
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle}>{news.title}</Text>
                    <Text style={styles.newsDescription}>{news.description}</Text>
                  </View>
                  <View style={styles.newsAction}>
                    <Text style={styles.newsLink}>Ir al tablón de anuncios</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </GestureDetector>
            <View style={styles.carouselControls}>
              <TouchableOpacity
                onPress={() => changeNews(-1)}
                accessibilityRole="button"
                accessibilityLabel="Aviso anterior"
                style={styles.carouselArrow}
              >
                <Ionicons name="arrow-back" size={22} color={PRIMARY} />
              </TouchableOpacity>
              <View style={styles.dots}>
                {NEWS.map((item, index) => (
                  <TouchableOpacity
                    key={item.title}
                    onPress={() => setNewsIndex(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Mostrar aviso ${index + 1}`}
                    accessibilityState={{ selected: index === newsIndex }}
                    style={styles.dotButton}
                  >
                    <View style={[styles.dot, index === newsIndex && styles.activeDot]} />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => changeNews(1)}
                accessibilityRole="button"
                accessibilityLabel="Siguiente aviso"
                style={styles.carouselArrow}
              >
                <Ionicons name="arrow-forward" size={22} color={PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.assistantImageButton}
            onPress={() => goTo('QceiIA')}
            accessibilityRole="button"
            accessibilityLabel="Abrir Qcei IA"
          >
            <Image
              source={require('./Imagenes/Icons/Apartados/Qcei_icon.png')}
              style={styles.assistantImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
              <Ionicons name="search-outline" size={21} color={PRIMARY} />
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Pregúntale a Qcei…"
                placeholderTextColor="#55717d"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                accessibilityLabel="Pregunta a Qcei"
              />
            </View>
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={handleSearch}
              accessibilityRole="button"
              accessibilityLabel="Abrir Qcei IA"
            >
              <Ionicons name="mic-outline" size={25} color={PRIMARY} />
            </TouchableOpacity>
          </View>
          <Text style={styles.assistantHint}>¿Tienes una duda? Pregúntale a Qcei</Text>

          <View
            onLayout={(event) => {
              sectionsOffset.current = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.sectionsTitle}>Mis Apartados</Text>
            <View style={styles.sectionGrid}>
              {SECTIONS.map((section) => (
                <TouchableOpacity
                  key={section.key}
                  style={styles.sectionCard}
                  onPress={() => goTo(section.route)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={section.title}
                >
                  <Image source={section.image} style={styles.sectionImage} resizeMode="contain" />
                  <Text
                    style={styles.sectionLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                  >
                    {section.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {drawerOpen && (
          <View style={styles.drawerLayer}>
            <TouchableOpacity
              style={styles.drawerBackdrop}
              onPress={() => setDrawerOpen(false)}
              accessible={false}
            />
            <GestureDetector gesture={drawerGesture}>
              <ScrollView
                style={styles.drawerPanel}
                contentContainerStyle={{ paddingBottom: bottom }}
                showsVerticalScrollIndicator={false}
              >
                {DRAWER_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.title}
                    style={[
                      styles.drawerItem,
                      item.highlighted && styles.drawerHighlighted,
                      item.heading && styles.drawerHeading,
                    ]}
                    onPress={() => handleDrawerItem(item)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.drawerText,
                        item.heading && styles.drawerHeadingText,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
                <Text style={styles.versionText}>iCucei v1.0</Text>
              </ScrollView>
            </GestureDetector>
          </View>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY },
  header: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: 'FrauncesBlackItalic',
    flex: 1,
    marginHorizontal: 12,
    color: '#ffffff',
    fontSize: 28,
  },
  notificationButton: { width: 32, alignItems: 'center' },
  body: { flex: 1, position: 'relative', backgroundColor: '#e3eef3' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
  dashboardTitle: {
    fontFamily: 'FrauncesBlackItalic',
    color: '#075a75',
    fontSize: 29,
    marginBottom: 8,
  },
  newsSection: { alignItems: 'center', marginBottom: 40 },
  newsBadge: {
    alignSelf: 'flex-start',
    zIndex: 1,
    marginLeft: 22,
    marginBottom: -8,
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  newsBadgeText: { fontFamily: 'FrauncesBlackItalic', color: '#ffffff', fontSize: 22 },
  newsCardButton: { width: '100%' },
  newsCard: { width: '100%' },
  newsContent: {
    position: 'absolute',
    top: '15%',
    bottom: '30%',
    left: '7%',
    right: '9%',
    justifyContent: 'center',
    gap: 8,
  },
  newsTitle: {
    fontFamily: 'FrauncesBlackItalic',
    color: '#243c58',
    textAlign: 'center',
    fontSize: 18,
  },
  newsDescription: {
    fontFamily: 'ArialNova',
    color: '#576b80',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 19,
  },
  newsAction: {
    position: 'absolute',
    top: '72.3%',
    height: '16.6%',
    left: '5%',
    right: '7%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsLink: {
    fontFamily: 'PoppinsBold',
    color: PRIMARY,
    fontSize: 12,
    textAlign: 'center',
  },
  carouselControls: {
    width: '100%',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carouselArrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dotButton: { width: 26, height: 44, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#86bbca' },
  activeDot: { backgroundColor: PRIMARY },
  assistantImageButton: { alignSelf: 'center', marginBottom: 10 },
  assistantImage: { width: 100, height: 82 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInputWrap: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#9bcbd8',
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, color: '#203d4b', fontFamily: 'ArialNova', fontSize: 16, paddingHorizontal: 8 },
  voiceButton: {
    width: 56,
    minHeight: 56,
    alignSelf: 'stretch',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#9bcbd8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  assistantHint: {
    color: '#075a75',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 40,
  },
  sectionsTitle: {
    fontFamily: 'FrauncesBlackItalic',
    color: '#075a75',
    fontSize: 28,
    marginBottom: 10,
    marginLeft: -2,
  },
  sectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionCard: {
    width: '46%',
    aspectRatio: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PRIMARY,
  },
  sectionImage: { width: '94%', height: '72%' },
  sectionLabel: {
    fontFamily: 'FrauncesBlackItalic',
    width: '100%',
    minHeight: 32,
    color: '#ffffff',
    fontSize: 19,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  drawerLayer: { ...StyleSheet.absoluteFillObject, zIndex: 5, flexDirection: 'row' },
  drawerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
  drawerPanel: { flexGrow: 0, width: '90%', backgroundColor: '#ffffff' },
  drawerItem: { minHeight: 55, justifyContent: 'center', paddingHorizontal: 24 },
  drawerHighlighted: { backgroundColor: '#d3edf6' },
  drawerHeading: { minHeight: 65 },
  drawerText: {
    fontFamily: 'FrauncesBlackItalic',
    color: PRIMARY,
    fontSize: 24,
  },
  drawerHeadingText: { fontSize: 27 },
  versionText: {
    fontFamily: 'FrauncesBlack',
    color: '#075a75',
    fontSize: 12,
    marginHorizontal: 24,
    marginTop: 14,
    marginBottom: 20,
  },
});
