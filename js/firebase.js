// Importa las funciones que necesitas de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";


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


const datosParaEnviar = {

    id: "SENSOR_001",
    ip: "192.168.1.100",
    mac: "00:AA:BB:CC:DD:01",
    nombre: "Sensor - 9102",
    status: "Abierto",
    timestamp:serverTimestamp(), 
    ubicacion: "9101",
    alarmaActiva:true,
    valor: 25.5
  
};
function datosaEnviar() {
  const referencia = ref(database, 'sensores/');
  const nuevoReporteRef = push(referencia);
  set(nuevoReporteRef, datosParaEnviar)
    .then(() => {
      alert("✅ Reporte guardado correctamente");
      location.reload(true);
    })
    .catch((error) => {
      console.error("❌ Error al guardar:", error);
    });
}



export { database };




