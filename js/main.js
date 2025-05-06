// Datos de ejemplo
console.log("main.js cargado");
import { database } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const alertaref=  ref(database, 'sensores');

let html;
let cont;


function createAlertCard() {
    get(alertaref).then((snapshots) => {
        if (snapshots.exists()) {
            const alertaData = snapshots.val();
            html = `<h2>Alertas De Acceso</h2>
                   `;
            cont = 0;

            Object.values(alertaData).forEach(alerta => {
               
                html += `  
                    <div class="alert-card">
                        <div class="alert-header">
                            <span><b>Salón:</b> ${alerta.ubicacion}</span>
                            <span class="material-symbols-outlined">more_vert</span>
                        </div>
                        <div class="alert-animation">
                            <span class="circle"></span>
                            <span class="circle"></span>
                            <span class="circle"></span>
                            <span class="circle"></span>
                            <span class="material-symbols-rounded">warning</span>
                        </div>
                        <div class="alert-body">
                            <h3>${alerta.status}</h3>
                            <p><b>Se abrió:</b> ${cont} vez</p>
                        </div>
                        <div class="alert-actions">
                            <button class="btn-desactivar">Desactivar</button>
                            <button class="btn-notificar">Notificar</button>
                        </div>
                    </div>`;
            });

           
            document.querySelector(".alerts-container").innerHTML = html;
        } else {
            document.querySelector(".alerts-container").innerHTML = "No hay alertas.";
        }
    }).catch(error => {
        console.error("Error al obtener alertas:", error);
        document.querySelector(".alerts-container").innerHTML = "Error al cargar las alertas.";
    });
}



// Función para crear el gráfico de accesos
function createAccessChart() {
    // Aquí puedes implementar la lógica para crear el gráfico circular
    // Usando una librería de gráficos o Canvas API
    const chartContainer = document.getElementById('accessChart');
    console.log("createAccessChart"); // Agregado console.log
    // Implementar lógica del gráfico
}

// Función para crear el gráfico de tiempo
function createTimeChart() {
    // Aquí puedes implementar la lógica para crear el gráfico de tiempo
    const chartContainer = document.getElementById('timeChart');
     console.log("createTimeChart"); // Agregado console.log
    // Implementar lógica del gráfico
}

// Función para actualizar la actividad reciente
function updateRecentActivity() {
    const activityList = document.querySelector('.activity-list');
     console.log("updateRecentActivity"); // Agregado console.log
    // Implementar lógica para actualizar la actividad reciente
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded");  // Agregado console.log
    createAlertCard(); // Llamar a la función para mostrar las alertas
    createAccessChart();
    createTimeChart();
    updateRecentActivity();
    // Event listener para los botones de alerta
    const alertsContainer = document.querySelector('.alerts-container'); // Mover fuera del evento
    if(alertsContainer){ //Verificar que el elemento exista.
        alertsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-desactivar')) {
                // Implementar lógica para desactivar alerta
                console.log("Desactivar Alerta");
            } else if (e.target.classList.contains('btn-notificar')) {
                // Implementar lógica para notificar
                console.log("Notificar Alerta");
            }
        });
    }
});

// Función para actualizar datos en tiempo real (simulado)
setInterval(() => {
    // Aquí puedes implementar la lógica para actualizar los datos en tiempo real
    // Por ejemplo, hacer una petición a un servidor
    console.log("Actualización de datos en tiempo real");
}, 30000); // Actualizar cada 30 segundos
