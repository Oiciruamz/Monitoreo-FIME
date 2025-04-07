// Importa las funciones que necesitas de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
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

export { database };
leerDatos();

