
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');


    fetch('https://monitoreo-5a969-default-rtdb.firebaseio.com/salones.json')
    .then(response => response.json())
    .then(data => {
        const events = [];

        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const bloques = data['-ONCA6MFmoCbVvs0Jaj9'].bloques;
        const salones = data['-ONCA6MFmoCbVvs0Jaj9'].salones;
    
        for (let salon in salones) {
            dias.forEach(dia => {
                if (salones[salon][dia]) {
                    salones[salon][dia].horarios.forEach(horario => {
                        const bloquesRango = horario.bloque.split('-');
                        const inicio = bloques[bloquesRango[0]].inicio;
                        const fin = bloques[bloquesRango[bloquesRango.length - 1]].fin;

                        events.push({
                            title: `${horario.materia} - ${horario.profesor}`,
                            startTime: inicio,
                            endTime: fin,
                            daysOfWeek: [dias.indexOf(dia)], 
                            description: `Grupo: ${horario.grupo} | Salón: ${salon}`
                        });
                    });
                }
            });
        }    

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
        timezone: 'local',
        hiddenDays: [0], 
        slotMinTime: '07:00:00', 
        slotMaxTime: '22:00:00', 
        slotDuration: '00:50:00', 
        allDaySlot: false, 
        headerToolbar: false,
        height: 'auto',
        contentHeight: 'auto',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false }, 
        dayHeaderFormat: { day: 'numeric', weekday: 'long' }, 
        events: events,
        eventColor: '#FFFFFF',
        eventBackgroundColor: '#96B0FF',
        eventDisplay: 'list-item',
        eventOverlap: false, 
        slotEventOverlap: false,
        slotEventOverlap: false,
        eventMinHeight: 44,
        eventMaxHeight: 44,
        expandRows: true,
        eventMaxStack: 2,
        eventTimeFormat: { 
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }
  
    });


    calendar.render();

     // Funcionalidad para los botones de navegación
     document.getElementById('prev-week').addEventListener('click', function() {
        calendar.prev(); // Navegar a la semana anterior
    });

    document.getElementById('next-week').addEventListener('click', function() {
        calendar.next(); // Navegar a la siguiente semana
    });

})})