// Datos de ejemplo
const alertData = [
    {
        salon: '9105',
        estado: 'Sin clase',
        tiempo: '20 minutos',
        tipo: 'Acceso no autorizado'
    },
    // Más alertas pueden ser agregadas aquí
];

// Función para crear una tarjeta de alerta
function createAlertCard(alert) {
    return `
     <h2>Alertas De Acceso</h2>
     <span class="material-symbols-outlined">
chevron_left
</span>
        <div class="alert-card">
            <div class="alert-header">
                <span><b>Salón:</b> ${alert.salon}</span>
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
                <h3>${alert.tipo}</h3>
                <span><b>Tiempo:</b> ${alert.tiempo}</span>
                <p><b>Estado:</b> ${alert.estado}</p>
            </div>
            <div class="alert-actions">
                <button class="btn-desactivar">Desactivar</button>
                <button class="btn-notificar">Notificar</button>
            </div>
        </div>
        <span class="material-symbols-outlined">
chevron_right
</span>
    `;
}

// Función para renderizar las alertas
function renderAlerts() {
    const alertsContainer = document.querySelector('.alerts-container');
    alertsContainer.innerHTML = alertData.map(alert => createAlertCard(alert)).join('');
}

// Función para crear el gráfico de accesos
function createAccessChart() {
    // Aquí puedes implementar la lógica para crear el gráfico circular
    // Usando una librería de gráficos o Canvas API
    const chartContainer = document.getElementById('accessChart');
    // Implementar lógica del gráfico
}

// Función para crear el gráfico de tiempo
function createTimeChart() {
    // Aquí puedes implementar la lógica para crear el gráfico de tiempo
    const chartContainer = document.getElementById('timeChart');
    // Implementar lógica del gráfico
}

// Función para actualizar la actividad reciente
function updateRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    // Implementar lógica para actualizar la actividad reciente
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderAlerts();
    createAccessChart();
    createTimeChart();
    updateRecentActivity();

    // Event listener para los botones de alerta
    document.querySelector('.alerts-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-desactivar')) {
            // Implementar lógica para desactivar alerta
        } else if (e.target.classList.contains('btn-notificar')) {
            // Implementar lógica para notificar
        }
    });
});

// Función para actualizar datos en tiempo real (simulado)
setInterval(() => {
    // Aquí puedes implementar la lógica para actualizar los datos en tiempo real
    // Por ejemplo, hacer una petición a un servidor
}, 30000); // Actualizar cada 30 segundos 