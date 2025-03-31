document.addEventListener("DOMContentLoaded", function() {
    var ctx1 = document.getElementById("incidents").getContext("2d");
    var incidents = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [{
                label: 'Número de incidentes por mes',
                data: [12, 19, 3, 5, 2, 3, 7, 8, 6, 4, 9, 11],
                backgroundColor: '#7995E9',
            }]
        },
        options:{
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    var ctx2 = document.getElementById("dailyA").getContext("2d");
    var dailyA = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            datasets: [{
                label: 'Tendencia de Accesos No Autorizado (Lunes a Sábado)',
                data: [12, 19, 3, 5, 2, 7],
                backgroundColor: '#040CA8',
            }]
        },
        options:{
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