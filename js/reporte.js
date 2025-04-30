// reporte.js
import { database } from "./firebase.js"; // asegúrate de que el nombre sea correcto y tenga .js
import { ref, push, set, get , remove} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";


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
    guardarDatosFirebase(datos);
  });
  crearHistorial();
  renderizarReporte();
});

function crearHistorial(){
    const reportesRef = ref(database, 'reportes');
    get(reportesRef).then((snapshot) => {
        if (snapshot.exists()) {
          const reportes=snapshot.val();
          let html = '';
          for (const id in reportes){
            const reporte=reportes[id];
            html+= `
            <div class="reporte" id="${reporte.idReporte}" >
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
          document.getElementById('Reporte-list').innerHTML = html;
          const listaReporte= document.querySelectorAll('.reporte');
          listaReporte.forEach(report => {
            report.addEventListener("click", function() {
              verReporte(report,reportes);
            });
          });
        
        } else {
          console.log("No hay datos disponibles.");
        }
      }).catch((error) => {
        console.error("Error al leer los datos:", error);
      });
    
}
function verReporte(report, reportes) {
  const container = document.getElementById("container");
  if (container) { 
    Object.values(reportes).forEach((reporte,index) => {
      if (reporte.idReporte === report.id) {
        let idElemento
        Object.entries(reportes).forEach(([clave, valor]) => {
          if (valor.idReporte === report.id) {
            idElemento=clave;
          }
        });
        const nuevoElemento = document.createElement("div");
        nuevoElemento.classList.add("modalInformacion");
        container.appendChild(nuevoElemento);
        nuevoElemento.innerHTML=`     
    <div class="infoContainer">
       <button class="botonCerrar" id="botonCerrar"><span class="material-symbols-outlined">close</span></button>
        <div id="infoReporte">
          <h2>Reporte ${reporte.idReporte}</h2>
          <p>El día ${reporte.fechaAcceso} a las ${reporte.horaAcceso} horas, se registró un incidente en el ${reporte.ubicacion}. El acceso al área fue reportado inmediatamente por el usuario encargado ${reporte.usuarioEncargado}, quien notificó al personal de seguridad ${reporte.personalNotificada} a las ${reporte.horaReporte} horas del mismo día.</p>
          <br>
          <p>La situación requirió una intervención rápida del equipo autorizado, logrando estabilizar las condiciones en un tiempo estimado de ${reporte.duracion}. Se realizó una inspección preliminar para identificar posibles causas, por parte del personal involucrado.</p>
          <br>
          <p>Cometarios adicionales: ${reporte.comentarios}</p>
          <br>
          <p>El reporte fue marcado como ${reporte.estadoReporte}" en el sistema de incidencias, siguiendo los protocolos establecidos. Se recomienda realizar una revisión técnica complementaria en el área afectada para prevenir futuras ocurrencias.</p>
        </div> 
      <div class="botonesContainer">
        <button id="botonBorrar">Eliminar</button>
        <button id="botonImprimir">Imprimir</button>
      </div>
    </div> 
        `;
        const botonCerrar = document.getElementById("botonCerrar");
        botonCerrar.addEventListener("click", function () {
          CerrarModal(nuevoElemento,container);
        });
        const botonImprimir = document.getElementById("botonImprimir");
        const datosImprimir = document.getElementById("infoReporte");
        botonImprimir.addEventListener("click", function () {
          imprimirPdf(datosImprimir);
        });
        const botonBorrar = document.getElementById("botonBorrar");
        botonBorrar.addEventListener("click", function(){
          borrarElementoFirebase(idElemento)
        })
      }
    });
  } else {
    console.error("No se encontró ningún elemento con el ID 'container'.");
  }
}
function imprimirPdf(datos){

}
function CerrarModal(modal,contenedor){
  contenedor.removeChild(modal);
}
function borrarElementoFirebase(elementoBorrado){
  const reportesfirebase = ref(database, 'reportes/' + elementoBorrado);
  console.log(reportesfirebase)
  remove(reportesfirebase)
  .then(() => {
    alert("Reporte borrado exitosamente.");
    window.location.reload();
    
  })
  .catch((error) => {
    alert("Error al borrar el reporte:", error);
  });

}
function renderizarReporte () {
  const reporterenderizar = ref(database, 'reportes');
  get(reporterenderizar).then((snapshot)=>{
    if(snapshot.exists()){ 
      const reportes=Object.values(snapshot.val());
      const ultimoReporte= reportes[reportes.length-1];
      const htmlVistaprevia=`
      <h2>Reporte ${ultimoReporte.idReporte}</h2>
<p>El día ${ultimoReporte.fechaAcceso} a las ${ultimoReporte.horaAcceso} horas, se registró un incidente en el ${ultimoReporte.ubicacion}. El acceso al área fue reportado inmediatamente por el usuario encargado ${ultimoReporte.usuarioEncargado}, quien notificó al personal de seguridad ${ultimoReporte.personalNotificada} a las ${ultimoReporte.horaReporte} horas del mismo día.</p>
<br>
<p>La situación requirió una intervención rápida del equipo autorizado, logrando estabilizar las condiciones en un tiempo estimado de ${ultimoReporte.duracion}. Se realizó una inspección preliminar para identificar posibles causas, por parte del personal involucrado.</p>
<br>
<p>Cometarios adicionales: ${ultimoReporte.comentarios}</p>
<br>
<p>El reporte fue marcado como ${ultimoReporte.estadoReporte}" en el sistema de incidencias, siguiendo los protocolos establecidos. Se recomienda realizar una revisión técnica complementaria en el área afectada para prevenir futuras ocurrencias.</p>
<div class="shadowContainer"><div class="shadow"></div><div class="clip"></div></div>
      `;
      document.querySelector(".vistaprevia").innerHTML=htmlVistaprevia;
    }else {
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
      alert("✅ Reporte guardado correctamente");
      location.reload(true);
    })
    .catch((error) => {
      console.error("❌ Error al guardar:", error);
    });
}

