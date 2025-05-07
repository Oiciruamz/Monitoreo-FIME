// Datos de ejemplo
console.log("main.js cargado");
import { database } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { update, remove, push } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";


const alertaref = ref(database, 'sensores');
const horariosref = ref(database, 'horarios')
let html;
let cont;
let horasTotales = []
function salonesenClase(enClase, sinClase) {
    get(horariosref)
        .then((snapshots) => {
            if (snapshots.exists()) {
                const salones = snapshots.val()
                Object.values(salones).forEach(salon => {
                    Object.values(salon).forEach(dia => {
                        Object.values(dia).forEach(hora => {
                            const horasformato = {
                                salon: hora.salon,
                                horaInicio: hora.horaInicio,
                                horaFin: hora.horaFin
                            }
                            horasTotales.push(horasformato)
                        })
                    })
                })

            }
            let horasClase = 0;
            let horasSinClase = 0;
            const fecha = new Date();
            const horaActual = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            horasTotales.forEach(horario => {
                if (horario.horaInicio < horaActual && horaActual < horario.horaFin) {
                    horasClase++;
                } else {
                    horasSinClase++;
                }
            });
            console.log(`Salones en clase: ${horasClase} Salones sin clase: ${horasSinClase} Total de clases: ${horasTotales.length}`);
            sinClase.textContent = `${horasSinClase}`;
            enClase.textContent = `${horasClase}`;


        }).catch(error => {
            console.error("Error al obtener horarios:", error);
        })
}

function createAlertCard() {
    get(alertaref).then((snapshots) => {
        if (snapshots.exists()) {
            const alertaData = snapshots.val();
            let html = `<h2>Alertas De Acceso</h2>`;
            const alertasArray = Object.values(alertaData);

            get(horariosref).then((horariosSnapshots) => {
                const horariosData = horariosSnapshots.val();
                if (horariosData) {
                    alertasArray.forEach(alerta => {
                        const timestampAlarma = alerta.timestamp;
                        const fechaAlarma = new Date(timestampAlarma);
                        const horaAlarma = fechaAlarma.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        const diaSemanaAlarma = fechaAlarma.getDay(); // 0 (Domingo) - 6 (Sábado)
                        const salonAlarma = alerta.ubicacion;
                        let eventoEncontrado = false;
                        if (horariosData[salonAlarma]) {
                            const horariosSalon = horariosData[salonAlarma];
                            Object.values(horariosSalon).forEach(dias => {
                                Object.values(dias).forEach(infoHorario => {
                                    // Verificar si el día de la semana coincide
                                    if (infoHorario.daysOfWeek && infoHorario.daysOfWeek.includes(diaSemanaAlarma === 0 ? 7 : diaSemanaAlarma)) { // Ajustar Domingo (0) a 7 para comparación
                                        // Verificar si la hora de la alarma está dentro del rango del evento
                                        if (horaAlarma >= infoHorario.horaInicio && horaAlarma <= infoHorario.horaFin) {
                                            eventoEncontrado = true;
                                        }
                                    }
                                });
                            });
                        }
                        if (!eventoEncontrado && alerta.alarmaActiva == true) {
                            const fechaAlarmaFormateada = fechaAlarma.toLocaleDateString();
                            html += `
                                <div class="alert-card">
                                    <div class="alert-header">
                                        <span><b>Salón:</b> ${salonAlarma}</span>
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
                                        <p><b>Acceso no Autorizado:</b> ${fechaAlarmaFormateada} - ${horaAlarma}</p>
                                    </div>
                                    <div class="alert-actions">
                                        <button class="btn-desactivar">Desactivar</button>
                                        <button class="btn-notificar">Notificar</button>
                                    </div>
                                </div>`;
                        }
                    });
                    document.querySelector(".alerts-container").innerHTML = html;
                } else {
                    document.querySelector(".alerts-container").innerHTML = "No hay horarios disponibles.";
                }
            }).catch(error => {
                console.error("Error al obtener horarios:", error);
                document.querySelector(".alerts-container").innerHTML = "Error al cargar los horarios.";
            });
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
    const historialRef = ref(database, 'historial');

    get(historialRef).then(snapshot => {
        if (snapshot.exists()) {
            const historial = Object.values(snapshot.val());
            let html = '';
            historial.forEach(entrada => {
                const fecha = new Date(entrada.timestamp);
                const hora = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                const fechaStr = fecha.toLocaleDateString('es-MX');

                let tiempoTexto = '—';
                if (typeof entrada.tiempo === 'number' && entrada.tiempo > 0) {
                    const minutos = Math.floor(entrada.tiempo / 60000);
                    const segundos = Math.floor((entrada.tiempo % 60000) / 1000);
                    tiempoTexto = `${minutos} min ${segundos} seg`;
                }

                html += `
                <div class="activity">
                    <div class="info-section">
                        <div class="salon-title">
                            <p><b>Salón:</b> ${entrada.ubicacion}</p>
                        </div>
                        <div class="details">
                            <div class="detail-item"><p><b>Hora:</b> ${hora}</p></div>
                            <div class="detail-item"><p><b>Tiempo:</b> ${tiempoTexto}</p></div>
                            <div class="detail-item"><p><b>Fecha:</b> ${fechaStr}</p></div>
                        </div>
                    </div>
                    <Button class="notification-status-active">
                        <span class="material-symbols-outlined">notifications</span>
                        <p>Notificado</p>
                    </Button>
                </div>
                `;
            });
            activityList.innerHTML = html;
        } else {
            activityList.innerHTML = "<p>No hay actividad reciente.</p>";
        }
    });
}



// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded");
    const enClase = document.getElementById("salonesenClase");
    const sinClase = document.getElementById("salonessinClase");
    createAlertCard();
    createAccessChart();
    createTimeChart();
    salonesenClase(enClase, sinClase);
    updateRecentActivity();

    const alertsContainer = document.querySelector('.alerts-container');
    if (alertsContainer) {
        alertsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-desactivar')) {
                const alertCard = e.target.closest('.alert-card');
                const salonText = alertCard.querySelector('.alert-header span').textContent;
                const salon = salonText.split(':')[1].trim();

                get(ref(database, 'sensores')).then(snapshot => {
                    if (snapshot.exists()) {
                        const alertas = snapshot.val();
                        const claveAlerta = Object.keys(alertas).find(
                            key => alertas[key].ubicacion === salon && alertas[key].alarmaActiva === true
                        );

                        if (claveAlerta) {
                            const alerta = alertas[claveAlerta];
                            const alertaRef = ref(database, `sensores/${claveAlerta}`);
                            const historialRef = ref(database, 'historial');

                            const ahora = Date.now();
                            const duracion = alerta.timestamp ? (ahora - alerta.timestamp) : 0;

                            update(alertaRef, { alarmaActiva: false }).then(() => {
                                push(historialRef, {
                                    ...alerta,
                                    alarmaActiva: false,
                                    timestamp: alerta.timestamp, // mantener la hora de la alerta
                                    tiempo: duracion // duración en ms
                                }).then(() => {
                                    createAlertCard();
                                    updateRecentActivity();
                                });
                            });
                        }
                    }
                });
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
