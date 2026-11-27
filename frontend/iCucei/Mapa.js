import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, ImageBackground, StyleSheet, Pressable, Modal, ScrollView, } from 'react-native';
import PagerView from 'react-native-pager-view';

// ===============================
// BASE DE DATOS DE EDIFICIOS
// ===============================
const EDIFICIOS = [
  {
    id: 'A',
    nombre: 'Rectoría',
    descripcion:
      'La Rectoría es el edificio principal del Centro Universitario. Aquí se concentran en la planta baja las oficinas de Control Escolar, Coordinaciones de: Investigación, Servicios Académicos, Programas Docentes, La Unidad de Enseñanza Incorpordada, Unidad de Vibculación, PROULEX; De igual manera en planta alta encontramos: Rectoría, Secretaría Administrativa y Académica, Coordinaciones de: Personal, Extensión, Finanzas y Planeación, Unidades de: Servicio Social, Adquisiciones y Suministros, Patrimonio y Difusión, Comisiones de Consejo y el Módulo de Actividades Cultutales.',
    rect: { top: 490, left: 180, width: 35, height: 85 },
    rotation: -12,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa4.jpeg',
    ],
    pies: [
      'Fachada principal del edificio',
      'Auditorio Enriquez Díaz De León',
      'Área de Control Escolar',
      'Jardines frente a la Rectoría',
    ],
  },
   {
    id: 'B',
    nombre: 'Módulo B',
    descripcion:
    'Ubicado junto al A y C, es parte de los módulos de docencia. Contiene aulas de menor escala, laboratorios simples y espacios de apoyo docente.',
    rect: { top: 520, left: 220, width: 20, height: 20 },
    rotation: 20,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta4.jpeg',
    ],
    pies: [  
      'Segunda Planta del edificio',
      'Vista de Jardines del Área',
      'Vista frente al Edificio',
      'Vista lateral del Edificio',
    ],
  },
    {
    id: 'C',
    nombre: 'Módulo C',
    descripcion:
    'Conecta con los módulos A y D. Aloja aulas, cubículos de estudio y espacios de apoyo para estudiantes. Por un lado se puede apreciar los primeros salones de Proulex',
    rect: { top: 498, left: 220, width: 20, height: 20 },
    rotation: 20,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleC/c1.png',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleC/c2.png',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleC/c3.png',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleC/c4.png',
    ],
    pies: [  
      'Vista lateral del Edificio',
      'Vista de Jardines del Área',
      'Vista de frente al edificio',
      'Vista a los salones Proulex a un lado del Edificio',
    ],
  },
    {
    id: 'D',
    nombre: 'Módulo D',
    descripcion:
    'Parte intermedia del conjunto A,B,C,D. Cercano a los laboratorios y módulos especializados. Sirve de puente de circulación entre bloques.',
    rect: { top: 472, left: 210, width: 30, height: 20 },
    rotation: 20,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleD/d1.png',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleD/d2.png',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleD/d3.png',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleD/d4.png',
    ],
    pies: [  
      'Segunda y Tercer Planta del edificio',
      'Vista de Jardines del Área',
      'Vista frente al Edificio',
      'Auditorio y baños del área',
    ],
  },
  {
    id: 'CID',
    nombre: 'Biblioteca CID',
    descripcion:
    'Es la biblioteca central del CUCEI, con un amplio acervo de libros físicos y electrónicos. Ofrece servicios como préstamo externo de libros, préstamo interno de equipo de cómputo, cubículos de lectura especiales, wifi y consulta en línea de bases de datos. Dentro del CID se encuentran en su planta baja: La Sala de usos múltiples del CID, Laboratio 1 y 2 CID, y la Sala de Juntas CID. En su planta Alta también se ubican la Unidad de Becas e Intercambio, Unidad de Desarrollo Bibliotecario y el Centro de Autoacceso.',
    rect: { top: 420, left: 210, width: 30, height: 50 },
    rotation: 15,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/CID/CID1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/CID/CID2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/CID/CID3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/CID/CID4.jpg',
    ],
    pies: [
      'Fachada principal del edificio',
      'Vista recepción de la Biblioteca',
      'Área de estudio principal',
      'Estacionamiento lateral a la Biblioteca',
    ],
  },
    {
    id: 'E',
    nombre: 'Módulo E',
    descripcion:
    'En este módulo se encuentran en su planta baja la Coordinaciones de Química, y QFB. En su planta alta la Coordinación de Ingeniería Química. También en el Módulo E se recibe atención para análisis clínicos (laboratorio de análisis clínicos y bacteriológicos). Colinda con los módulos F e I, y cuenta con la tienda de souvenirs "Soy CUCEI".',
    rect: { top: 345, left: 110, width: 145, height: 20 },
    rotation: 30,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleE/e1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleE/e2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleE/e3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleE/e4.jpg',
    ],
    pies: [ 
      'Fachada principal del edificio',
      'Vistazo a la tienda de souvenirs "Soy CUCEI"',
      'Área de acceso a segunda planta',
      'Jardines compartidos frente al Módulo y Biblioteca',
    ],
  },
     {
    id: 'F',
    nombre: 'Módulo F',
    descripcion:
    'Cercano al módulo E e I, participa en el entorno de la cafetería principal “El Globo”, (los módulos E, F e I lo rodean). En el Módulo F se ubican aulas especializadas y laboratorios vinculados a asignaturas.',
    rect: { top: 325, left: 210, width: 20, height: 40 },
    rotation: 0,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleF/f1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleF/f2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleF/f3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleF/f4.jpg',
    ],
    pies: [
      'Ubicación por uno de los pasillos principales del Centro',
      'Fachada principal/lateral del Módulo F',
      'Vista al "Jardín de los Químicos" conectan E,F,G y H ',
      'Vistazo a segunda planta',
    ],
  },
    {
    id: 'G',
    nombre: 'Módulo G',
    descripcion:
    'Es el módulo donde se realizan labores de soporte tecnológico para los demás edificios desde aquí, además cuenta con laboratorios y un estacionamiento.',
    rect: { top: 275, left: 120, width: 65, height: 25 },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleG/G1.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleG/G2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleG/G3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleG/G4.jpeg',
    ],
    pies: [ 
      'Fachada principal del edificio',
      'Vista lateral del Edificio',
      'Área de acceso a almacen del Edificio',
      'Estacionamiento frente al Módulo',
    ],
  },
  {
    id: 'H',
    nombre: 'Módulo H',
    descripcion:
    'Este edificio alberga los laboratorios de análisis clínico e investigación traslacional, oficinas del servicio social y administración relacionada con salud, dado su cercanía con el módulo E y la unidad médica-laboratorio.',
    rect: { top: 305, left: 180, width: 40, height: 15, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleH/H1.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleH/H2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleH/H3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleH/H4.jpeg',
    ],
    pies: [
      'Fachada principal del Módulo',
      'Escaleras a segunda planta del Edificio',
      'Laboratorio de análisis clínico e investigación traslacional',
    ],
  },
  {
    id: 'I',
    nombre: 'Módulo I',
    descripcion:
    'Forma parte del conjunto que bordea la cafetería “El Globo” junto con E y F. Contiene aulas de ciencias, talleres prácticos y servicios de apoyo para estudiantes.',
    rect: { top: 335, left: 228, width: 20, height: 10, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleI/I1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleI/I2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleI/I3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleI/I4.jpg',
    ],
    pies: [ 
      'Vista lateral del dificio',
      'Vista de segunda planta del edificio',
      'Pasillos de segunda planta',
      'Vista desde Jardines del Edificio',
    ],
  },
  {
    id: 'J',
    nombre: 'Módulo J',
    descripcion:
    'Es un módulo de docencia estándar, con aulas, salas de clase y laboratorios pequeños. Colinda con módulos I y K, facilitando el tránsito entre áreas académicas.',
    rect: { top: 305, left: 200, width: 40, height: 10, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleJ/j1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleJ/j2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleJ/j3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleJ/j4.jpg',
    ],
    pies: [
      'Fachada principal del edificio',
      'Vista del Edificio desde pasillo principal',
      'Segunda planta del Módulo',
      'Pasillo de Salones en segunda/tercera planta',
    ],
  },
  {
    id: 'K',
    nombre: 'Módulo K',
    descripcion:
    'Continuación del corredor docente, conecta con J y L, entre aulas teóricas y talleres prácticos. A partir de este edificio conecta el "pasillo rojo", y podemos encontrar un área de hidratación.',
    rect: { top: 290, left: 200, width: 40, height: 10, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleK/k1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleK/k2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleK/k3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleK/k4.jpg',
    ],
    pies: [
      'Fachada principal del edificio',
      'Vista a salones en planta baja',
      'Aulas en segunda planta',
      'Área de bebederos y Microondas.',
    ],
  },
    {
    id: 'ALFA',
    nombre: 'Duct1 "Alfa"',
    descripcion:
    'El módulo Alfa es un edificio de aulas/laboratorios de computación donde los estudiantes pueden hacer uso de equipos de cómputo de forma gratuita. Colinda con Beta y módulos contiguos en la zona este del campus.',  
    rect: { top: 322, left: 245, width: 20, height: 10 },
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Alfa/Alfa4.jpeg',
    ],
    pies: [
      'Vista lateral del Edificio',
      'Fachada Edificios Alfa y Beta',
      'Vista de frente a los laboratorios',
      'Segunda y tercer planta del Módulo',
    ],
  },
  {
   id: 'BETA',
    nombre: 'Duct2 "Beta"',
    descripcion:
    'Junto con el módulo Alfa, ofrece salas de cómputo gratuitas y apoyo tecnológico. Funciona como parte del sistema CTA / Tecnologías de Información para estudiantes. Conecta con Alfa y otros módulos de computación/servicio.',
    rect: { top: 332, left: 242, width: 20, height: 12 },
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Beta/Beta4.jpeg',
    ],
    pies: [ 
      'Vista lateral de Beta',
      'Acceso de escaleras a segunda y tercer planta',
      'Pasillos en segunda planta',
      'Pasillo planta baja',
    ],
  },
  {
    id: 'L',
    nombre: 'Módulo L',
    descripcion:
    'Edificio importante en el campus: existen L y módulo L2. Figura como módulo de aulas u oficinas y alberga departamentos administrativos, aulas mayores, laboratorios de escala intermedia, La División de Ciencias Básicas y La unidad de Servicios Médicos.',
    rect: { top: 305, left: 250, width: 26, height: 18},
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleL/L1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleL/L2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleL/L3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleL/L4.jpg',
    ],
    pies: [
      'Vista a la División de Ciencias Básicas',
      'Fachada principal del edificio',
      'Unidad de Servicios Médicos',
      'Laboratorios principales de Mecánica Eléctrica',
    ],
  },
  {
    id: 'Matute',
    nombre: ' Explanada\n\t"Matute"',
    descripcion:
      'En esta Explanada se ubica uno de los auditorios principales del CUCEI. Se usa para conferencias, eventos académicos, ceremonias, presentaciones culturales. Está cerca del módulo L y se le da acceso desde explanadas a vías internas del campus.',
    rect: { top: 285, left: 234, width: 18, height: 30},
    rotation: -340,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Matute/Mat1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Matute/Mat2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Matute/Mat3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Matute/Mat4.jpg',
    ],
    pies: [ 
      'Fachada principal de la explanada',
      'Vista a Auditorio Jorge Matute Remus',
      'Área completa "Matute"',
      'Cafebrería: café + librería, conecta Matute con Módulo L',
    ],
  },
  {
    id: 'M',
    nombre: 'Módulo M',
    descripcion:
      'Módulo docente de nivel medio a alto. Colinda con N y otros módulos vecinales. Es el edificio que concentra la mayoría de los Laboratorios de División DIVTIC, como el Laboratorio de Móviles, Inventores y Robótica Móvil. En su planta baja cuenta con una sucursal de Banco Santander.',
    rect: { top: 270, left: 200, width: 35, height: 15, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleM/M1.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleM/M2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleM/M3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleM/M4.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Atm/santander_modulem.jpeg',
    ],
    pies: [ 
      'Vista escaleras del edificio',
      'Área de Laboratorio de Robótica Móvil',
      'Pasillo a Laboratorio de App Móviles',
      'Fachada principal interior del Módulo',
      'Sucursal de Banco Santander en planta baja',
    ],
  },
  {
    id: 'N',
    nombre: 'Módulo N',
    descripcion:
    'Este módulo cuenta con un conjunto activo de aulas. Sirve para docencia de asignaturas teóricas o prácticas dependiendo del uso asignado por cada carrera. También podemos encontrar una papelería en la planta baja.',
    rect: { top: 255, left: 205, width: 35, height: 15, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleN/N1.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleN/N2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleN/N3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleN/N4.jpeg',
    ],
    pies: [
      'Fachada principal del edificio',
      'Papelería del Módulo',
      'Área de acceso principal',
      'Vista lateral del Módulo',
    ],
  },
  {
    id: 'O',
    nombre: 'Módulo O',
    descripcion:
    'Módulo de Coordinaciones. En su planta baja encontramos la División DIVTIC y las coordinaciones de las ingenierías de: Biomédica, Computación, Comunicaciones y Electrónica, Informática y Robótica. En su segunda planta encontamos la división de ingenierías y las coordinaciones de las ingenierías: Industrial, Civil y Topografía, Mecánica Eléctrica y Alimentos y Biotecnología.',
    rect: { top: 235, left: 205, width: 35, height: 15, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleO/O1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleO/O2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleO/O3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleO/O4.jpg',
    ],
    pies: [
      'Fachada principal del edificio',
      'Vista interior a Coordinación DIVTIC',
      'Área de acceso Coordinación de Ingenierías',
      'Vista interior de Coordinación de Ingenierías',
    ],
  },
  {
    id: 'P',
    nombre: 'Módulo P',
    descripcion:
    'Módulo docente, conectado con O y T, con laboratorios prácticos y aulas especializadas. ',
    rect: { top: 270, left: 238, width: 35, height: 12, },
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleP/p1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleP/p2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleP/p3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleP/p4.jpg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'Q',
    nombre: 'Módulo Q',
    descripcion:
      'CAMBIAR La Rectoría es el edificio principal del Centro Universitario. Aquí se concentran las oficinas administrativas, dirección y áreas de atención al alumnado.',
    rect: { top: 275, left: 260, width: 35, height: 10, },
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleQ/Q1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleQ/Q2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleQ/Q3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleQ/Q4.jpg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'R',
    nombre: 'Módulo R',
    descripcion:
      'CAMBIAR La Rectoría es el edificio principal del Centro Universitario. Aquí se concentran las oficinas administrativas, dirección y áreas de atención al alumnado.',
    rect: { top: 252, left: 242, width: 25, height: 10, },
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleR/R1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleR/R2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleR/R3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleR/R4.jpg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'S',
    nombre: 'Módulo S',
    descripcion:
      'CAMBIAR La Rectoría es el edificio principal del Centro Universitario. Aquí se concentran las oficinas administrativas, dirección y áreas de atención al alumnado.',
    rect: { top: 218, left: 210, width: 35, height: 15, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS/S1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS/S2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS/S3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS/S4.jpeg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'S2',
    nombre: 'Módulo S2',
    descripcion:
      'CAMBIAR La Rectoría es el edificio principal del Centro Universitario. Aquí se concentran las oficinas administrativas, dirección y áreas de atención al alumnado.',
    rect: { top: 198, left: 215, width: 20, height: 15, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS2/S2_1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS2/S2_2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS2/S2_3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleS2/S2_4.jpeg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'T',
    nombre: 'Módulo T',
    descripcion:
    'Módulo de transición entre áreas más centrales y zonas periféricas de docencia. Conecta con P, U.',
    rect: { top: 240, left: 245, width: 35, height: 12,},
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleT/T1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleT/T2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleT/T3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleT/T4.jpg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'U',
    nombre: 'Módulo U',
    descripcion:
    'Aulas de computación, talleres de informática y aulas prácticas de carreras tecnológicas. Conecta con T y otros módulos cercanos.',
    rect: { top: 228, left: 250, width: 35, height: 12,},
    rotation: -320,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleU/U1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleU/U2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleU/U3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleU/U4.jpg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'V',
    nombre: 'Módulo V',
    descripcion:
      'El módulo V alberga aulas de computación, informática, física y matemáticas. En este edificio encuentras el departamento de matemáticas.',
    rect: { top: 178, left: 225, width: 45, height: 12, },
    rotation: -315,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV/V1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV/V2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV/V3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV/V4.jpg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'V2',
    nombre: 'Módulo V2',
    descripcion:
    'El módulo V2 alberga aulas de computación, física e informática o espacios técnicos vinculados con ingeniería y ciencias.',
    rect: { top: 192, left: 217, width: 45, height: 12, },
    rotation: -318,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV2/V2_1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV2/V2_2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV2/V2_3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleV2/V2_4.jpg',
    ],
    pies: [  //Cambiar cada pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'W',
    nombre: 'Módulo W',
    descripcion:
      'Módulo docente ubicado hacia la parte trasera del campus. Sirve de apoyo para cursos menores y "cubículos" para docentes.',
    rect: { top: 160, left: 180, width: 45, height: 14, },
    rotation: -315,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleW/W1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleW/W2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleW/W3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleW/W4.jpg',
    ],
    pies: [  
      'Vista a cúbiculo w2',
      'Fachada del edificio hacia Módulo X',
      'Vista en conjunto con Módulo X',
      'Vista frente a Jardines',
    ],
  },
  {
    id: 'X',
    nombre: 'Módulo X',
    descripcion:
      'Módulo de aulas para clases y talleres menores, conectado con Z y W para circulación interna. También puedes encontarr en este edificio el "Hospital de Computadoras"',
    rect: { top: 142, left: 185, width: 45, height: 14, },
    rotation: -315,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleX/X1.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleX/X2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleX/X3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleX/X4.jpg',
    ],
    pies: [  //cambiar pie
      'Fachada principal del edificio',
      'Vista lateral de la Rectoría',
      'Área de acceso principal',
      'Jardines frente a la Rectoría',
    ],
  },
  {
    id: 'Y',
    nombre: 'Módulo Y',
    descripcion:
      'Módulo docente con aulas de especialidad (por ejemplo, seminarios, talleres, laboratorios ligeros), así como el auditorio Nikolai V. Mitskievich. Conectado al resto del campus mediante X y Z.',
    rect: { top: 180, left: 168, width: 25, height: 25, },
    rotation: -325,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleY/Y1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleY/Y2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleY/Y3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleY/Y4.jpeg',
    ],
    pies: [  
      'Fachada principal del edificio',
      'Vista Auditorio Nikolai V.',
      'Vista del edificio desde Lonaria',
      'Jardín y Mesas frente al Edificio',
    ],
  },
  {
    id: 'Z',
    nombre: 'Módulo Z',
    descripcion:
      'Es el edificio Z más antiguo, colinda con los edificos Z1, Z2, Y y Lonaria.',
    rect: { top: 170, left: 158, width: 15, height: 20, },
    rotation: -345,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ/Z1.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ/Z2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ/Z3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ/Z4.jpg',
    ],
    pies: [ 
      'Fachada principal del edificio',
      'Vista lateral y escaleras',
      'Baños planta baja',
      'Cruce con Lonaria',
    ],
  },
  {
    id: 'Z1',
    nombre: 'Módulo Z1',
    descripcion:
    'El Z1 es un módulo más pequeño adyacente a Z2, usado para aulas complementarias y cubículos de trabajo. Ambos módulos conectan con los módulos X, Y y la explanada Lonaria.',
    rect: { top: 160, left: 145, width: 15, height: 20, },
    rotation: -345,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ1/Z1_1.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ1/Z1_2.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ1/Z1_3.jpeg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ1/Z1_4.jpeg',
    ],
    pies: [ 
      'Fachada principal del edificio',
      'Aulas y baños de planta baja',
      'Pasillo segunda planta',
      'Interior de Aulas',
    ],
  },
  {
    id: 'Z2',
    nombre: 'Módulo Z2',
    descripcion:
      'Módulo de aulas especializadas; aparece junto con otros módulos mayores del CUCEI. Forma parte de los Edificios Z siendo de los más nuevos junto con el Z1.',
    rect: { top: 160, left: 165, width: 25, height: 15, },
    rotation: -315,
    imagenes: [
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ2/Z2_1.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ2/Z2_2.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ2/Z2_3.jpg',
      'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/ModuleZ2/Z2_4.jpg',
    ],
    pies: [
      'Fachada principal del edificio',
      'Plantas y aulas de frente',
      'Lonaria',
      'Jardines del área y letras CUCEI',
    ],
  },
];

export default class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edificioSeleccionado: null,
    };
  }

  // Abrir y cerrar modal dinámicamente
  abrirModal = (edificio) => {
    this.setState({ edificioSeleccionado: edificio });
  };

  cerrarModal = () => {
    this.setState({ edificioSeleccionado: null });
  };

  render() {
    const { edificioSeleccionado } = this.state;

    return (
      <ImageBackground
        source={{ uri: 'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/background/MapBackground.png' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safe}>
          <Text style={styles.headerText} allowFontScaling={false}>
            Mapa CUCEI
          </Text>

          {/* === CONTENEDOR DEL MAPA === */}
          <View style={styles.mapFrame}>
            <Image
              source={{ uri:'https://cqtjnhlxxyqbuuknzqfo.supabase.co/storage/v1/object/public/Images/buildings_cucei/Map/map_2024.jpg'}}
              style={styles.mapImage}     
            />

            {/* === HOTSPOTS DE EDIFICIOS === */}
            {EDIFICIOS.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => this.abrirModal(e)}
                style={[
                  styles.hotspot,
                  {
                    top: e.rect.top,
                    left: e.rect.left,
                    width: e.rect.width,
                    height: e.rect.height,
                    transform: [{ rotate: `${e.rotation || 0}deg` }],
                  },
                ]}
              />
            ))}
          </View>

          {/* === MODAL DE EDIFICIO SELECCIONADO === */}
          {edificioSeleccionado && (
            <Modal
              animationType="slide"
              transparent
              visible
              onRequestClose={this.cerrarModal}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>
                    {edificioSeleccionado.nombre}
                  </Text>

                  <ScrollView
                    style={{ maxHeight: 820, width: 350 }}
                    contentContainerStyle={{ alignItems: 'center' }}
                  >
                    <PagerView style={styles.pager} initialPage={0}>
                      {edificioSeleccionado.imagenes.map((img, idx) => (
                        <View style={styles.page} key={idx}>
                          <Image source={{ uri: img }} style={styles.pageImg} resizeMode="cover" />              
                          <Text style={styles.imageCaption}>
                            {edificioSeleccionado.pies?.[idx] || `Foto ${idx + 1}`}
                          </Text>

                        </View>
                      ))}
                    </PagerView>

                    <Text style={styles.modalText}>
                      {edificioSeleccionado.descripcion}
                    </Text>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={this.cerrarModal}
                    >
                      <Text style={styles.textButton}>Cerrar ventana</Text>
                    </Pressable>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          )}
        </SafeAreaView>
      </ImageBackground>
    );
  }
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  safe: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerText: {
    fontFamily: 'FrauncesBlackItalic',
    fontSize: 50,
    color: '#fff',
    textAlign: 'center',
  },
  mapFrame: {
    width: 370,
    height: 650,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    position: 'relative',

  },
  mapImage: {
    width: 560,
    height: 370,
    transform: [{ rotate: '90deg' }],
    borderRadius: 12,
    borderColor: 'rgba(250, 80, 159, 1)',
    borderWidth: 5,
  },
  hotspot: {
    position: 'absolute',
    borderRadius: 4,
    //backgroundColor: 'rgba(255, 0, 140, 0.42)', 
  },

  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(2, 2, 2, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    

  },
  modalView: {
    transform: [{ rotate: '90deg' }],
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    height: '45%',
    borderColor: 'pink',
    borderWidth: 4,

  },
  modalTitle: {
    fontSize: 35,
    marginTop: -15,
    fontFamily: 'MyFontRobotoSlab',
  },
  modalText: {
    marginTop: 2,
    marginBottom: 10,
    textAlign: 'center',
    maxWidth: '90%',
    fontFamily: 'MyFontArialR',
  },
  pager: {
    marginTop: 10,
    alignSelf: 'center',
    height: 300,
    width: 400,
    maxWidth: '90%',

  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImg: {
    width: 260,
    height: 260,
    borderRadius: 1,
  },
  imageCaption: {
  fontSize: 14,
  fontFamily: 'MyFontArialR', 
  color: '#6b6969ff',                  
  textAlign: 'center',
  marginTop: 6,
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'MyFontArialR',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 5,
  },
  buttonClose: {
    backgroundColor: '#fc2187ff',
  },
});

