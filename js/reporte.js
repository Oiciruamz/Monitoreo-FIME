// reporte.js
import { database } from "./firebase.js"; // asegúrate de que el nombre sea correcto y tenga .js
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario-reporte");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que se recargue la página

    const datos = {
      fechaReporte: document.getElementById("fecha-reporte").value,
      horaReporte: document.getElementById("hora-reporte").value,
      idReporte: document.getElementById("id-reporte").value,
      ubicacion: document.getElementById("ubicacion").value,
      estadoReporte: document.getElementById("estado-reporte").value,
      fechaAcceso: document.getElementById("fecha-acceso").value,
      horaAcceso: document.getElementById("hora-acceso").value,
      duracion: document.getElementById("duracion").value,
      usuarioEncargado: document.getElementById("usuario-encargado").value,
      personaNotificada: document.getElementById("personaNotificada").value,
      comentarios: document.getElementById("comentarios").value
    };

    console.log("Datos capturados:", datos);
    alert("✅ Datos capturados correctamente. Guardando en Firebase...");
    guardarDatosFirebase(datos);
  });
  crearHistorial();
});

function crearHistorial(){
    const reportesRef = ref(database, 'reportes');
    get(reportesRef).then((snapshot) => {
        if (snapshot.exists()) {
          console.log('Datos:', snapshot.val());
          const reportes=snapshot.val();
          let html = '';
          for (const id in reportes){
            const reporte=reportes[id];
            html+= `
            <div class="reporte">
              <div class="info-section">
                <div class="salon-title">
                  <p><b>Id Reporte:</b> ${reporte.idReporte}</p>
                </div>
                <div class="details">
                  <div class="detail-item">
                    <p><b>Hora:</b> ${reporte.horaReporte}</p>
                  </div>
                  <div class="detail-item">
                    <p><b>Fecha:</b> ${reporte.fechaReporte}</p>
                  </div>
                  <div class="detail-item">
                    <p><b>Usuario Responsable:</b> ${reporte.usuarioEncargado}</p>
                  </div>
                  <div class="detail-item">
                    <p><b>Persona Notificada:</b> ${reporte.personaNotificada}</p>
                  </div>
                </div>
              </div>
            </div>
          `;
          }
          document.getElementById('Reporte-list').innerHTML = html; // Asegúrate de tener un contenedor con id="historial"

        } else {
          console.log("No hay datos disponibles.");
        }
      }).catch((error) => {
        console.error("Error al leer los datos:", error);
      });
    
}

function guardarDatosFirebase(datos) {
  const referencia = ref(database, 'reportes/');
  const nuevoReporteRef = push(referencia);

  set(nuevoReporteRef, datos)
    .then(() => {
      alert("✅ Reporte guardado correctamente en Firebase.");
      location.reload(true);
    })
    .catch((error) => {
      console.error("❌ Error al guardar:", error);
    });
}

