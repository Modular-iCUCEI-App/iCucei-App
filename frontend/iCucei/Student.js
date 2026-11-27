import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
  Alert, Dimensions, ActivityIndicator, SectionList, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressChart, BarChart, LineChart } from 'react-native-chart-kit';

const STORAGE_KEY = 'Datos';
const screenWidth = Dimensions.get('window').width;

/* ====================== Helpers ====================== */
const sum = (arr) => arr.reduce((a, b) => a + Number(b || 0), 0);
const numFromCalif = (s) => {
  const m = String(s || '').match(/\d+/);
  return m ? Number(m[0]) : 0;
};

/**
 * Normaliza el ciclo:
 * - "2025-V" | "2024B" | "2024 B" | "2023" -> "2025A"/"2024B"
 * - Si es Verano (V), devuelve null para EXCLUIRLO de las series.
 */
function normalizeCycle(raw) {
  const s = String(raw || '').toUpperCase().trim();
  const yearMatch = s.match(/20\d{2}/);
  if (!yearMatch) return null;
  const year = yearMatch[0];

  // Excluir verano (V) de las gráficas/listados por ciclo
  if (/\bV\b/.test(s) || /-V\b/.test(s) || s.endsWith('V')) return null;

  if (s.includes('B')) return `${year}B`;
  // por defecto A
  return `${year}A`;
}

function compareCycles(a, b) {
  const ya = parseInt(a.slice(0, 4), 10), yb = parseInt(b.slice(0, 4), 10);
  if (ya !== yb) return ya - yb;
  const ta = a[4] || 'A', tb = b[4] || 'A';
  return ta.localeCompare(tb);
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(44, 192, 230, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

/** Nuevo: solo cuenta materias ORDINARIO con calif. numérica >= 50 (para promedios por ciclo) */
function isOrdinaryGraded(m) {
  const tipo = String(m?.tipo || '').toUpperCase();
  if (!tipo.includes('ORDINARIO')) return false;
  const n = numFromCalif(m?.calificacion);
  return Number.isFinite(n) && n >= 50;
}

/* ====================== Screen ====================== */
export default function Student({ route, navigation }) {
  // ---- hooks (orden fijo) ----
  const [datos, setDatos] = useState(route?.params?.userData ?? null);
  const [ready, setReady] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [showMaterias, setShowMaterias] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!datos) {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (raw && alive) setDatos(JSON.parse(raw));
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (ready && !datos) {
      const id = setTimeout(() => navigation.replace('Loginn'), 0);
      return () => clearTimeout(id);
    }
  }, [ready, datos, navigation]);

  // ----- Detectar forma de los datos: plano vs { alumno, academico } -----
  const alumno    = datos?.alumno ? datos.alumno : datos ?? {};
  const academico = datos?.academico ? datos.academico : datos ?? {};

  // ----- Colecciones reales -----
  const materias = Array.isArray(academico.materias) ? academico.materias : [];
  const areas    = Array.isArray(academico.creditosAreas) ? academico.creditosAreas : [];

  // ----- KPIs (se mantienen igual) -----
  const creditos           = Number(academico.creditos ?? sum(areas.map(a => a.creditos)));
  const creditosRequeridos = Number(academico.creditosRequeridos ?? sum(areas.map(a => a.requeridos)));
  const creditsPct         = creditosRequeridos ? (creditos / creditosRequeridos) * 100 : 0;

  // promedio general: NO lo tocamos (sigue tu lógica previa)
  let promedio = Number(academico.promedio ?? NaN);
  if (!Number.isFinite(promedio) || promedio === 0) {
    let w = 0, c = 0;
    materias.forEach(m => { const g = numFromCalif(m.calificacion); const cr = Number(m.creditos || 0); w += g * cr; c += cr; });
    promedio = c ? +(w / c).toFixed(2) : 0;
  }

  // ----- Barras por área -----
  const areaLabels     = areas.map(a => String(a.area || '').trim());
  const areaObtenidos  = areas.map(a => Number(a.creditos || 0));
  const areaRequeridos = areas.map(a => Number(a.requeridos || 0));

  // ======= Promedio por ciclo (ahora solo ORDINARIO >= 50 y sin Verano) =======
  const cycleSeries = useMemo(() => {
    const buckets = {};
    for (const m of materias) {
      const cy = normalizeCycle(m.ciclo);
      if (!cy) continue;                 // excluye Verano
      if (!isOrdinaryGraded(m)) continue; // solo ORD >= 50
      const cr = Number(m.creditos || 0);
      const g  = numFromCalif(m.calificacion);
      if (!buckets[cy]) buckets[cy] = { w: 0, c: 0 };
      buckets[cy].w += g * cr;
      buckets[cy].c += cr;
    }
    const labels = Object.keys(buckets).sort(compareCycles);
    const data   = labels.map(l => {
      const { w, c } = buckets[l];
      return c ? +(w / c).toFixed(2) : 0;
    });
    return { labels, data };
  }, [materias]);

  // ----- SectionList (materias agrupadas por ciclo) -----
  const sections = useMemo(() => {
    if (!showMaterias) return [];
    const map = new Map();
    for (const m of materias) {
      const cy = normalizeCycle(m.ciclo);
      if (!cy) continue; // también excluye Verano en el listado por ciclo
      if (!map.has(cy)) map.set(cy, []);
      map.get(cy).push(m);
    }
    const keys = Array.from(map.keys()).sort(compareCycles);
    return keys.map(k => ({
      title: k,
      data: map.get(k).sort((a, b) => (a.descripcion || '').localeCompare(b.descripcion || '')),
    }));
  }, [showMaterias, materias]);

  // Dimensiones para charts
  const CARD_HPAD = 16;
  const cardWidth = Math.floor(screenWidth * 0.92);
  const safeChartWidth = Math.max(260, cardWidth - CARD_HPAD * 2);

  const handleLogout = async () => {
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
    Alert.alert('Saliendo', 'Cerrando sesión...');
    navigation.reset({ index: 0, routes: [{ name: 'Loginn' }] });
  };
  const handleGoHome = () => navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });

  if (!ready) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!datos)  return <View style={styles.center}><Text>Cargando…</Text></View>;

  /* ====================== Header con tarjetas y gráficas ====================== */
  const ListHeader = (
    <ImageBackground
      source={require('./Imagenes/Backgrounds/StudentBackground.png')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Datos del Estudiante</Text>

            <InfoRow label="Nombre"   value={alumno?.nombre} />
            <InfoRow label="Código"   value={alumno?.codigo} />
            <InfoRow label="Carrera"  value={alumno?.carrera} />
            <InfoRow label="Campus"   value={alumno?.campus} />
            <InfoRow label="Ciclo"    value={alumno?.ciclo} />
            <InfoRow label="Situación" value={alumno?.situacion} />

            {/* Toggle Avance Académico */}
            <TouchableOpacity onPress={() => setShowCharts(s => !s)} style={styles.toggleBtnBlue}>
              <Text style={styles.toggleTxt}>{showCharts ? 'Ocultar avance académico' : 'Avance académico'}</Text>
            </TouchableOpacity>

            {showCharts && (
              <View style={{ width: '100%', alignItems: 'center' }}>
                {/* ====== Anillos ====== */}
                <View style={styles.cardInner}>
                  <Text style={styles.sectionTitle}>Avance académico</Text>
                  <View style={styles.metricsRow}>
                    <View style={styles.metricBox}>
                      <ProgressChart
                        data={{ labels: [], data: [Math.min(Math.max(creditsPct / 100, 0), 1)] }}
                        width={Math.min(screenWidth * 0.42, 280)}
                        height={180}
                        strokeWidth={12}
                        radius={44}
                        chartConfig={chartConfig}
                        hideLegend
                      />
                      <Text style={styles.metricValue}>{creditsPct.toFixed(2)}%</Text>
                      <Text style={styles.metricLabel}>Créditos</Text>
                      <Text style={styles.helperSmall}>({creditos}/{creditosRequeridos})</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <ProgressChart
                        data={{ labels: [], data: [Math.min(Math.max(promedio / 100, 0), 1)] }}
                        width={Math.min(screenWidth * 0.42, 280)}
                        height={180}
                        strokeWidth={12}
                        radius={44}
                        chartConfig={chartConfig}
                        hideLegend
                      />
                      <Text style={styles.metricValue}>{promedio.toFixed(2)}</Text>
                      <Text style={styles.metricLabel}>Promedio</Text>
                    </View>
                  </View>
                </View>

                {/* ====== Barras por área (scroll + pop-up) ====== */}
                {!!areaLabels.length && (
                  <View style={styles.cardInner}>
                    <Text style={styles.sectionTitle}>Créditos por área</Text>

                    {(() => {
                      const abbrev = (s = '') =>
                        s
                          .split(/\s+/)
                          .map(w => w[0] || '')
                          .join('')
                          .replace(/[^A-ZÁÉÍÓÚÑ]/gi, '')
                          .slice(0, 6)
                          .toUpperCase();

                      const xLabels = areaLabels.map(abbrev);
                      const chartWidth = Math.max(safeChartWidth, xLabels.length * 90);

                      return (
                        <>
                          <View style={{ width: '100%', overflow: 'hidden' }}>
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ paddingBottom: 4 }}
                            >
                              <BarChart
                                data={{
                                  labels: xLabels,
                                  datasets: [
                                    { data: areaObtenidos },
                                    { data: areaRequeridos },
                                  ],
                                  legend: ['Obtenidos', 'Requeridos'],
                                }}
                                width={chartWidth}
                                height={280}
                                fromZero
                                verticalLabelRotation={-25}
                                chartConfig={{
                                  ...chartConfig,
                                  decimalPlaces: 0,
                                  barPercentage: 0.55,
                                  propsForBackgroundLines: { strokeDasharray: '6 6' },
                                }}
                                style={{ marginVertical: 8, borderRadius: 12 }}
                                onDataPointClick={({ index, value, dataset }) => {
                                  const area = areaLabels[index] || 'Área';
                                  const obt  = areaObtenidos[index] ?? 0;
                                  const req  = areaRequeridos[index] ?? 0;
                                  const serie = dataset === 0 ? 'Obtenidos' : 'Requeridos';
                                  Alert.alert(
                                    'Créditos por área',
                                    `${area}\n${serie}: ${value}\nTotal: ${obt}/${req}`
                                  );
                                }}
                              />
                            </ScrollView>
                          </View>

                          {/* Leyenda con nombre completo */}
                          <View style={styles.legendWrap}>
                            {areaLabels.map((full, i) => (
                              <View key={`${i}-${full}`} style={styles.legendItem}>
                                <Text style={styles.legendBadge}>{xLabels[i]}</Text>
                                <Text style={styles.legendText}>{full}</Text>
                                <Text style={styles.legendValue}>
                                  {areaObtenidos[i]}/{areaRequeridos[i]}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </>
                      );
                    })()}
                  </View>
                )}

                {/* ====== Promedio por ciclo (línea + pop-up) ====== */}
                {!!cycleSeries.labels.length && (
                  <View style={styles.cardInner}>
                    <Text style={styles.sectionTitle}>Promedio por ciclo</Text>
                    <LineChart
                      data={{
                        labels: cycleSeries.labels,
                        datasets: [
                          { data: cycleSeries.data },
                          { data: Array(cycleSeries.labels.length || 1).fill(100),
                            withDots: false, strokeWidth: 0, color: () => 'rgba(0,0,0,0)' },
                        ],
                      }}
                      width={safeChartWidth}
                      height={260}
                      fromZero
                      segments={10}
                      formatYLabel={v => `${Math.round(Number(v))}`}
                      chartConfig={chartConfig}
                      bezier
                      style={{ borderRadius: 12, marginTop: 8, alignSelf: 'center', overflow: 'hidden' }}
                      onDataPointClick={({ index, value }) => {
                        const ciclo = cycleSeries.labels[index] || 'Ciclo';
                        Alert.alert('Promedio por ciclo', `${ciclo}: ${Number(value).toFixed(2)}`);
                      }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Toggle Materias */}
            <TouchableOpacity onPress={() => setShowMaterias(v => !v)} style={styles.toggleBtnDark}>
              <Text style={styles.toggleTxt}>
                {showMaterias ? 'Ocultar materias' : 'Ver materias con calificación'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );

  /* ====================== SectionList (materias) ====================== */
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, idx) => (item.nrc || String(idx)) + '_' + idx}
      ListHeaderComponent={ListHeader}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section: { title } }) =>
        showMaterias ? (
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionHeaderText}>Ciclo: {title}</Text>
          </View>
        ) : null
      }
      renderItem={({ item }) => {
        const n = numFromCalif(item.calificacion);
        let bg = '#eef7fb';
        if (Number.isFinite(n)) {
          if (n >= 90) bg = '#eaf7ee';
          else if (n >= 80) bg = '#fff8e6';
          else bg = '#fdeaea';
        }
        return (
          <View style={[styles.courseCard, { backgroundColor: bg, width: screenWidth - 32, alignSelf: 'center' }]}>
            <Text style={styles.courseTitle}>{item.descripcion}</Text>
            <Text style={styles.courseRow}>
              Clave: <Text style={styles.bold}>{item.clave}</Text>   Ciclo: {normalizeCycle(item.ciclo) || item.ciclo}
            </Text>
            <Text style={styles.courseRow}>
              Créditos: <Text style={styles.bold}>{item.creditos}</Text>
            </Text>
            <Text style={styles.courseRow}>
              Calificación: <Text style={styles.bold}>{item.calificacion}</Text>   Tipo: {item.tipo}
            </Text>
            <Text style={styles.courseRow}>
              NRC: {item.nrc}   Fecha: {item.fecha}
            </Text>
          </View>
        );
      }}
      ListEmptyComponent={
        showMaterias
          ? <Text style={{ textAlign: 'center', padding: 12, color: '#6b7280' }}>Sin materias.</Text>
          : null
      }
      ListFooterComponent={
        <View style={{ paddingHorizontal: 16, paddingBottom: 28, paddingTop: showMaterias ? 6 : 0 }}>
          <TouchableOpacity onPress={handleGoHome} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Ir al inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 12 }}
    />
  );
}

/* ====================== Subcomponentes ====================== */
function InfoRow({ label, value }) {
  return (
    <View style={{ marginBottom: 8, alignSelf: 'stretch' }}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );
}

/* ====================== Estilos ====================== */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { width: '100%' },
  overlay: { backgroundColor: 'rgba(255,255,255,0.6)' },
  container: { padding: 16 },
  title: {
    fontFamily: 'FrauncesBlackItalic',
    fontSize: 36, color: '#2cc0e6ff', marginBottom: 6, textAlign: 'center',
  },
  card: {
    backgroundColor: 'white', borderRadius: 20, padding: 16, width: '100%',
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  cardInner: { width: '100%', backgroundColor: '#f3f4f6', borderRadius: 16, padding: 16, marginTop: 12 },
  label: { color: '#2cc0e6', fontSize: 14, fontWeight: 'bold' },
  value: { fontSize: 18, color: '#000' },
  sectionTitle: { fontFamily: 'FrauncesBlackItalic', fontSize: 18, color: '#111827', marginBottom: 6 },
  helperSmall: { textAlign: 'center', color: '#6b7280', marginTop: 4, fontSize: 12 },

  toggleBtnBlue: { backgroundColor: '#2cc0e6', borderRadius: 12, marginTop: 12, paddingVertical: 12, paddingHorizontal: 16, alignSelf: 'stretch' },
  toggleBtnDark: { backgroundColor: '#0a223f', borderRadius: 12, marginTop: 12, paddingVertical: 12, paddingHorizontal: 16, alignSelf: 'stretch' },
  toggleTxt: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },

  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  metricBox: { width: '49%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 6, alignItems: 'center' },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginTop: 4 },
  metricLabel: { fontSize: 14, color: '#374151' },

  legendWrap: { marginTop: 8, gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  legendBadge: {
    minWidth: 34, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
    textAlign: 'center', fontWeight: '700', color: '#0a223f', backgroundColor: '#e6f7fb',
  },
  legendText: { flex: 1, color: '#1f2937' },
  legendValue: { color: '#0a223f', fontWeight: '700' },

  sectionHeaderWrap: { paddingHorizontal: 16, paddingTop: 12 },
  sectionHeaderText: { fontSize: 18, fontWeight: '700', color: '#0a223f' },

  courseCard: { borderRadius: 12, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#d8e6ef' },
  courseTitle: { fontWeight: '800', marginBottom: 4, color: '#0a223f' },
  courseRow: { color: '#1f2937' },
  bold: { fontWeight: '800' },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2cc0e6ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryText: { color: '#2cc0e6ff', fontSize: 18, fontFamily: 'MyFontArialR', fontWeight: '700' },
  logoutButton: { backgroundColor: '#2cc0e6ff', borderRadius: 12, marginTop: 2, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 18, fontFamily: 'MyFontArialR' },
});
