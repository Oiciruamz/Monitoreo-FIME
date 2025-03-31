
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
        timezone: 'local',
        hiddenDays: [0, 6], 
        slotMinTime: '07:00:00', 
        slotMaxTime: '21:30:00', 
        slotDuration: '00:50:00', 
        allDaySlot: false, 
        headerToolbar: false,
        height: 'auto',
        contentHeight: 'auto',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false }, 
        dayHeaderFormat: { day: 'numeric', weekday: 'long' }, 
        
        events: [
            { title: '9102', start: '2025-03-31T09:00:00', end: '2025-03-31T10:00:00' },
            { title: '9103', start: '2025-03-31T09:00:00', end: '2025-03-31T10:00:00' },
            { title: '9104', start: '2025-03-31T09:00:00', end: '2025-03-31T10:00:00' },
            { title: '9103', start: '2025-04-01T10:20:00', end: '2025-04-01T11:10:00' }
        ],
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

});
  