// Importa las funciones que necesitas de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2ua_OCt1iEi3K3rh0PzqvbX483JmaoTA",
  authDomain: "monitoreo-5a969.firebaseapp.com",
  databaseURL: "https://monitoreo-5a969-default-rtdb.firebaseio.com",
  projectId: "monitoreo-5a969",
  storageBucket: "monitoreo-5a969.firebasestorage.app",
  messagingSenderId: "385281802173",
  appId: "1:385281802173:web:526307890bece5bceedcd4",
  measurementId: "G-B776FDZQVV"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function leerDatos() {
  const dbRef = ref(database, 'salones/-ONCA6MFmoCbVvs0Jaj9/salones/9101/');
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log('Datos:', snapshot.val());
    } else {
      console.log("No hay datos disponibles.");
    }
  }).catch((error) => {
    console.error("Error al leer los datos:", error);
  });
}

const datosParaEnviar = [
  {
    id: "SENSOR_001",
    ip: "192.168.1.100",
    mac: "00:AA:BB:CC:DD:01",
    nombre: "Sensor_Temperatura_1",
    status: "open",
    timestamp: Date.now(), // Timestamp actual en milisegundos
    ubicacion: "Sala",
    valor: 25.5
  },
  {
    id: "SENSOR_002",
    ip: "192.168.1.101",
    mac: "00:AA:BB:CC:DD:02",
    nombre: "Sensor_Humedad_1",
    status: "closed",
    timestamp: Date.now() - 3600000, // Timestamp de hace una hora
    ubicacion: "Jardín",
    valor: 60.2
  },
  {
    id: "SENSOR_003",
    ip: "192.168.1.102",
    mac: "00:AA:BB:CC:DD:03",
    nombre: "Sensor_Movimiento_1",
    status: "open",
    timestamp: Date.now() - 7200000, // Timestamp de hace dos horas
    ubicacion: "Entrada",
    valor: 1
  }
];



export { database };

leerDatos();

