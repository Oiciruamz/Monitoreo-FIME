import { database } from "./firebase.js"; // asegúrate de que el nombre sea correcto y tenga .js
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
let calendar;
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
        timezone: 'local',
        hiddenDays: [0], 
        slotMinTime: '07:00:00', 
        slotMaxTime: '21:30:00', 
        slotDuration: '00:50:00', 
        allDaySlot: false, 
        headerToolbar: false,
        height: 'auto',
        contentHeight: 'auto',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false }, 
        dayHeaderFormat: { day: 'numeric', weekday: 'long' }, 
        events: [],
        eventColor: '#FFFFFF',
        eventBackgroundColor: '#96B0FF',
        eventDisplay: 'list-item',
        eventOverlap: true,
        slotEventOverlap: true,
        eventMinHeight: 44,
        eventMaxHeight: 44,
        expandRows: true,
        eventMaxStack: 3,
        eventTimeFormat: { 
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        height: 'auto',

    });
    cargarTodosLosEventos();
    filterHorario();
    
    // Añadir evento al botón All existente
    const botonAll = document.getElementById('All');
    const botones = document.querySelectorAll(".btn-filter");
    if (botonAll) {
        botonAll.addEventListener('click', function(e) {
            e.preventDefault();
            botones.forEach(boton => {
                boton.classList.remove("active") 
            });
            botonAll.classList.add("active")
            cargarTodosLosEventos();
        });
    }
    
    calendar.render();
    
    // Funcionalidad para los botones de navegación
    document.getElementById('prev-week').addEventListener('click', function() {
        calendar.prev(); // Navegar a la semana anterior
    });

    document.getElementById('next-week').addEventListener('click', function() {
        calendar.next(); // Navegar a la siguiente semana
    });
});

function cargarTodosLosEventos() {
    const HorariosRef = ref(database, `salones/-ONCA6MFmoCbVvs0Jaj9/salones/`);
    get(HorariosRef).then((snapshot) => {
        if (snapshot.exists()) {
            const datos = snapshot.val();
            calendar.removeAllEvents();
            
            const hora = {
                M1: "07:00:00", M2: "07:50:00", M3: "08:40:00", M4: "09:30:00", M5: "10:20:00", M6: "11:10:00",
                V1: "12:00:00", V2: "12:50:00", V3: "13:40:00", V4: "14:30:00", V5: "15:20:00", V6: "16:10:00",
                N1: "17:00:00", N2: "17:45:00", N3: "18:30:00", N4: "19:15:00", N5: "20:00:00", N6: "20:45:00",
            };
            
            const horaFinal = {
                M1: "07:50:00", M2: "08:40:00", M3: "09:30:00", M4: "10:20:00", M5: "11:10:00", M6: "12:00:00",
                V1: "12:50:00", V2: "13:40:00", V3: "14:30:00", V4: "15:20:00", V5: "16:10:00", V6: "17:00:00",
                N1: "17:45:00", N2: "18:30:00", N3: "19:15:00", N4: "20:00:00", N5: "20:45:00", N6: "21:30:00",
            };
            
            const fechaSemana = {
                lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6
            };
            
            let eventosFiltrados = [];
            const fechaInicioSemana = calendar.view.activeStart;
            
            // Procesar todos los salones
            Object.entries(datos).forEach(([salonID, horarioSalon]) => {
                Object.entries(horarioSalon).forEach(([dia, info]) => {
                    const diaNormalizado = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const fechaBase = fechaSemana[diaNormalizado];
                    
                    if (!fechaBase || !info.horarios) return;
                    
                    const fechaEvento = new Date(fechaInicioSemana);
                    fechaEvento.setDate(fechaInicioSemana.getDate() + (fechaBase - 1));
                    const anio = fechaEvento.getFullYear();
                    const mes = (fechaEvento.getMonth() + 1).toString().padStart(2, '0');
                    const diaMes = fechaEvento.getDate().toString().padStart(2, '0');
                    const fechaISO = `${anio}-${mes}-${diaMes}`;
            
                    Object.values(info.horarios).forEach(clase => {
                        let bloqueInicio, bloqueFin;
                        
                        if (clase.bloque.includes("-")) {
                            [bloqueInicio, bloqueFin] = clase.bloque.split("-");
                        } else {
                            bloqueInicio = clase.bloque;
                            bloqueFin = clase.bloque;
                        }
                    
                        const horaInicio = hora[bloqueInicio];
                        const horaFin = bloqueFin === bloqueInicio ? horaFinal[bloqueInicio] : hora[bloqueFin];
                        
                        if (horaInicio && horaFin) {
                            const fechaInicio = new Date(`${fechaISO}T${horaInicio}`);
                            const fechaFin = new Date(`${fechaISO}T${horaFin}`);
                            
                            if (fechaFin > fechaInicio) {
                                // Crear una plantilla de evento para repetir
                                const eventTemplate = {
                                    title: `${clase.materia} (${clase.grupo}) - ${salonID}`,
                                    profesor: clase.profesor,
                                    salon: salonID,
                                    daysOfWeek: [fechaBase], // Día de la semana (1-7, donde 1 es lunes)
                                    startTime: horaInicio,
                                    endTime: horaFin,
                                    startRecur: '2023-01-01', // Fecha desde la que comienza la recurrencia
                                    endRecur: '2026-12-31',  // Fecha hasta la que dura la recurrencia (puedes ajustar según necesites)
                                    groupId: `${clase.materia}-${clase.grupo}-${diaNormalizado}`,
                                };
                                
                                eventosFiltrados.push(eventTemplate);
                            }
                        }
                    });
                });
            });
            
            calendar.addEventSource(eventosFiltrados);
           
            
        } else {
            alert("No hay datos disponibles.");
        }
    }).catch((error) => {
        console.error("Error al leer los datos:", error);
    });
}

// También necesitamos actualizar la función filterHorario() para que use el mismo patrón
function filterHorario() {
    const filters = document.getElementById("calendar-filters");
    const botones = document.querySelectorAll(".btn-filter");
   
    filters.addEventListener("click", function(e) {
        e.preventDefault();
        botones.forEach(boton => {
            boton.classList.remove("active") 
        });
        e.target.classList.add("active");
        const filter = e.target.id;
        const HorariosRef = ref(database, `salones/-ONCA6MFmoCbVvs0Jaj9/salones/`);
        get(HorariosRef).then((snapshot) => {
            if (snapshot.exists()) {
                const datos = snapshot.val();
                // Primero limpiamos los eventos actuales
                calendar.removeAllEvents();
     
                const hora = {
                    M1: "07:00:00", M2: "07:50:00", M3: "08:40:00", M4: "09:30:00", M5: "10:20:00", M6: "11:10:00",
                    V1: "12:00:00", V2: "12:50:00", V3: "13:40:00", V4: "14:30:00", V5: "15:20:00", V6: "16:10:00",
                    N1: "17:00:00", N2: "17:45:00", N3: "18:30:00", N4: "19:15:00", N5: "20:00:00", N6: "20:45:00",
                };
                
                const horaFinal = {
                    M1: "07:50:00", M2: "08:40:00", M3: "09:30:00", M4: "10:20:00", M5: "11:10:00", M6: "12:00:00",
                    V1: "12:50:00", V2: "13:40:00", V3: "14:30:00", V4: "15:20:00", V5: "16:10:00", V6: "17:00:00",
                    N1: "17:45:00", N2: "18:30:00", N3: "19:15:00", N4: "20:00:00", N5: "20:45:00", N6: "21:30:00",
                };
                
                const fechaSemana = {
                    lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6
                };
                
                let eventosFiltrados = [];
               
                Object.keys(datos).forEach(salonID => {
                    if (salonID === filter) {
                        const horarioSalon = datos[salonID];
                        console.log("Salon", salonID);
                        Object.entries(horarioSalon).forEach(([dia, info]) => {
                            const diaNormalizado = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const fechaBase = fechaSemana[diaNormalizado];
                            
                            if (!fechaBase || !info.horarios) return;
                            
                            Object.values(info.horarios).forEach(clase => {
                                let bloqueInicio, bloqueFin;
                                
                                if (clase.bloque.includes("-")) {
                                    [bloqueInicio, bloqueFin] = clase.bloque.split("-");
                                } else {
                                    bloqueInicio = clase.bloque;
                                    bloqueFin = clase.bloque;
                                }
                            
                                const horaInicio = hora[bloqueInicio];
                                const horaFin = bloqueFin === bloqueInicio ? horaFinal[bloqueInicio] : hora[bloqueFin];
                                
                                if (horaInicio && horaFin) {
                                    // Crear evento recurrente
                                    const nuevoEvento = {
                                        title: `${clase.materia} (${clase.grupo})`,
                                        profesor: clase.profesor,
                                        daysOfWeek: [fechaBase], // Día de la semana (1-7, donde 1 es lunes)
                                        startTime: horaInicio,
                                        endTime: horaFin,
                                        startRecur: '2023-01-01', // Fecha desde la que comienza la recurrencia
                                        endRecur: '2026-12-31',  // Fecha hasta la que dura la recurrencia
                                        groupId: `${clase.materia}-${clase.grupo}-${diaNormalizado}`,
                                    };
                                    
                                    eventosFiltrados.push(nuevoEvento);
                                } else {
                                    console.warn("Bloque de horario no encontrado:", {
                                        bloqueInicio,
                                        bloqueFin,
                                        clase: clase.materia
                                    });
                                }
                            });
                        });
                    }
                });
              
                // Añadir todos los eventos al calendario
                calendar.addEventSource(eventosFiltrados);
                
                // Verificar eventos añadidos
                const currentEvents = calendar.getEvents();
                console.log("Eventos renderizados en el calendario:", currentEvents.length);
                console.log("Eventos totales en el array:", eventosFiltrados.length);
                
            } else {
                console.log("No hay datos disponibles.");
                calendar.removeAllEvents();
            }
        }).catch((error) => {
            console.error("Error al leer los datos:", error);
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
        timezone: 'local',
        hiddenDays: [0], 
        slotMinTime: '07:00:00', 
        slotMaxTime: '21:30:00', 
        slotDuration: '00:50:00', 
        allDaySlot: false, 
        headerToolbar: false,
        height: 'auto',
        contentHeight: 'auto',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false }, 
        dayHeaderFormat: { day: 'numeric', weekday: 'long' }, 
        
        events: [],
        eventColor: '#FFFFFF',
        eventBackgroundColor: '#96B0FF',
        eventDisplay: 'list-item',
        eventOverlap: true,
        slotEventOverlap: true,
        eventMinHeight: 44,
        eventMaxHeight: 44,
        expandRows: true,
        eventMaxStack: 3,

        eventTimeFormat: { 
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    });
    cargarTodosLosEventos();
    filterHorario();
    
    // Añadir evento al botón All existente
    const botonAll = document.getElementById('All');
    if (botonAll) {
        botonAll.addEventListener('click', function(e) {
            e.preventDefault();
            cargarTodosLosEventos();
        });
    }
    
    calendar.render();
    const currentEvents = calendar.getEvents();
    console.log("Eventos renderizados en el calendario:", currentEvents);

    // Funcionalidad para los botones de navegación
    document.getElementById('prev-week').addEventListener('click', function() {
        calendar.prev(); // Navegar a la semana anterior
    });

    document.getElementById('next-week').addEventListener('click', function() {
        calendar.next(); // Navegar a la siguiente semana
    });
});