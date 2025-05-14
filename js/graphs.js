import { database } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Agrupar incidentes por mes desde Realtime Database
async function obtenerIncidentesPorMes() {
    const meses = Array(12).fill(0);
    const snapshot = await get(ref(database, "reportes"));
    if (snapshot.exists()) {
        const data = snapshot.val();
        Object.values(data).forEach(reporte => {
            const fecha = new Date(reporte.fechaReporte);
            if (!isNaN(fecha)) {
                const mes = fecha.getMonth();
                meses[mes]++;
            }
        });
    }
    return meses;
}

// Agrupar accesos no autorizados por día desde Realtime Database
async function obtenerAccesosNoAutorizadosPorDia() {
    const dias = Array(6).fill(0);
    const snapshot = await get(ref(database, "reportes"));
    if (snapshot.exists()) {
        const data = snapshot.val();
        Object.values(data).forEach(reporte => {
            const fecha = new Date(reporte.fechaAcceso);
            if (!isNaN(fecha)) {
                const dia = fecha.getDay();
                if (dia >= 1 && dia <= 6) dias[dia - 1]++;
            }
        });
    }
    return dias;
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", async function () {
    const incidentesPorMes = await obtenerIncidentesPorMes();
    const accesosPorDia = await obtenerAccesosNoAutorizadosPorDia();

    console.log("incidentesPorMes", incidentesPorMes);
    console.log("accesosPorDia", accesosPorDia);

    //const incidentesPorMes = [5, 2, 3, 4, 1, 0, 0, 0, 0, 0, 0, 0];
    //const accesosPorDia = [1, 2, 3, 4, 5, 6];

    // Gráfica 1: Incidentes por mes
    var ctx1 = document.getElementById("incidents").getContext("2d");
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [{
                label: 'Número de incidentes por mes',
                data: incidentesPorMes,
                backgroundColor: '#7995E9',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    // Gráfica 2: Accesos no autorizados por día
    var ctx2 = document.getElementById("dailyA").getContext("2d");
    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            datasets: [{
                label: 'Tendencia de Accesos No Autorizado (Lunes a Sábado)',
                data: accesosPorDia,
                backgroundColor: '#040CA8',
                borderColor: '#040CA8',
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});