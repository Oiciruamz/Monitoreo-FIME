import { database } from "./firebase.js"; // asegúrate de que el nombre sea correcto y tenga .js
import { ref, push, set, get,remove,update} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
let calendar;
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const ahora = new Date();
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek', // vista inicial
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay,listWeek'
        },
        events: [],
        locale:'es',
        hiddenDays: [0], 
        slotMinTime: '07:00:00', 
        slotMaxTime: '21:30:00', 
        slotDuration: '00:50:00',               // Aumenta la altura de cada slot (en píxeles)
        slotEventOverlap: false,        // Evita que los eventos se solapen
        eventMaxStack: 1,   
        height: 'auto',
        contentHeight: 'auto',
        expandRows: true, 
        eventDisplay: 'block',
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true // 👈 Esto activa el formato de 12 horas con AM/PM
        },
        contentHeight: 'auto',
        allDaySlot: false, 
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: true }, 
        dayHeaderFormat: { day: 'numeric', weekday: 'long' },
        eventClick: function(info) {
            verEvento(info.event);  // Aquí sí llamas a tu función con el evento clicado
          }
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
  });

function cargarTodosLosEventos() {
    const HorariosRef = ref(database, `horarios/`);
    get(HorariosRef).then((snapshot) => {
        if (snapshot.exists()){
            const datos = snapshot.val();
            calendar.removeAllEvents();
            let eventos=[]
            Object.entries(datos).forEach(([salonID, horariosSalon])=>{
                Object.entries(horariosSalon).forEach(([dia,info])=>{
                    Object.values(info).forEach(clase =>{
                        const nuevoEvento = {
                            title: `${clase.materia} (${clase.grupo}) - ${clase.salon}`,
                            daysOfWeek: clase.daysOfWeek, 
                            startTime: clase.horaInicio,
                            endTime: clase.horaFin,
                            extendedProps:{
                                salon: clase.salon,
                                profesor: clase.profesor,
                                nombremateria: clase.materia,
                                grupomateria: clase.grupo,
                                diamateria: clase.frecuencia,
                                horaInicio: clase.horaInicio,
                                horaFin: clase.horaFin,
                            },
                            startRecur: '2023-01-01',
                            endRecur: '2026-12-31',  
                        }
                        eventos.push(nuevoEvento)
                    })
                })
            })
        calendar.addEventSource(eventos);    
        } else {
            alert("No hay datos disponibles.");
        }
    }).catch((error) => {
        console.error("Error al leer los datos:", error);
    });
}
const botonNuevohorario=document.querySelector(".btn-new");
botonNuevohorario.addEventListener('click',()=>{
    nuevoHorario();
})
function nuevoHorario(){
   const container = document.getElementById("container");
    const nuevoElemento = document.createElement("div");
    nuevoElemento.classList.add("modalInformacion");
    container.appendChild(nuevoElemento);
    nuevoElemento.innerHTML=`     
 <div class="infoContainer">
    <button class="botonCerrar" id="botonCerrar">
        <span class="material-symbols-outlined">close</span>
    </button>

    <form id="horarioForm">
        <div class="InputContainers">
            <label for="profesor">Profesor:</label>
            <input type="text" id="profesor" name="profesor" required>
        </div>

        <div class="InputContainers">
            <label for="materia">Materia:</label>
            <input type="text" id="materia" name="materia" required>
        </div>

        <div class="InputContainers">
            <label for="grupo">Grupo:</label>
            <input type="text" id="grupo" name="grupo" required>
        </div>
 
        <div class="InputContainers">
            <label for="horaInicio">Hora de Inicio:</label>
            <input type="text" id="horaInicio" name="horaInicio" list="listaHoras" required>
            <datalist id="listaHoras">
                <option value="M1"></option>
                <option value="M2"></option>
                <option value="M3"></option>
                <option value="M4"></option>
                <option value="M5"></option>
                <option value="M6"></option>
                <option value="V1"></option>
                <option value="V2"></option>
                <option value="V3"></option>
                <option value="V4"></option>
                <option value="V5"></option>
                <option value="V6"></option>
                <option value="N1"></option>
                <option value="N2"></option>
                <option value="N3"></option>
                <option value="N4"></option>
                <option value="N5"></option>
                <option value="N6"></option>
            </datalist>
        </div>

        <div class="InputContainers">
            <label for="horaFin">Hora de Fin:</label>
            <input type="text" id="horaFin" name="horaFin" list="listaHoras" required>
            <datalist id="listaHoras">
                <option value="M1"></option>
                <option value="M2"></option>
                <option value="M3"></option>
                <option value="M4"></option>
                <option value="M5"></option>
                <option value="M6"></option>
                <option value="V1"></option>
                <option value="V2"></option>
                <option value="V3"></option>
                <option value="V4"></option>
                <option value="V5"></option>
                <option value="V6"></option>
                <option value="N1"></option>
                <option value="N2"></option>
                <option value="N3"></option>
                <option value="N4"></option>
                <option value="N5"></option>
                <option value="N6"></option>
            </datalist>
        </div>

        <div class="InputContainers">
            <label for="inputClase">Tipo de Clase:</label>
            <input type="text" id="inputClase" name="clase" list="listaTipoClase" required>
            <datalist id="listaTipoClase">
                <option value="Clase Ordinario"></option>
                <option value="Laboratorio"></option>
                <option value="Asesorias Extraordinarias"></option>
            </datalist>
        </div>

        <div class="InputContainers">
            <label for="inputDias">Días de la Semana:</label>
            <input type="text" id="inputDias" name="dias" list="listaDias" required>
            <datalist id="listaDias">
                <option value="Lunes, Miércoles y Viernes"></option>
                <option value="Lunes"></option>
                <option value="Martes"></option>
                <option value="Miercoles"></option>
                <option value="Jueves"></option>
                <option value="Viernes"></option>
                <option value="Sábado"></option>
            </datalist>
        </div>
        <div class="InputContainers">
            <label for="inputSalon">Salon:</label>
            <input type="text" id="inputSalon" name="salon" list="listaSalon" required>
            <datalist id="listaSalon">
                <option value="9101"></option>
                <option value="9102"></option>
                <option value="9103"></option>
                <option value="9104"></option>
            </datalist>
        </div>

        <br>
        <div class="botonesContainer">
            <button id="botonGuardar" type="button">Guardar Horario</button>
        </div>
    </form>
</div>

    `;
    const profesorInput = document.getElementById("profesor");
    const materiaInput = document.getElementById("materia");
    const grupoInput = document.getElementById("grupo");
    const horaInicioInput = document.getElementById("horaInicio");
    const horaFinInput = document.getElementById("horaFin");
    const tipoClaseInput = document.getElementById("inputClase");
    const frecuenciaInput = document.getElementById("inputDias");
    const salonInput = document.getElementById("inputSalon");


  
    const botonCerrar = document.getElementById("botonCerrar");
    botonCerrar.addEventListener("click", function () {
      CerrarModal(nuevoElemento,container);
    });
    const botonGuardar = document.getElementById("botonGuardar");
    botonGuardar.addEventListener("click", () =>  {
    const profesor = profesorInput.value;
    const materia = materiaInput.value;
    const grupo = grupoInput.value;
    const horaInicio = horaInicioInput.value;
    const horaFin = horaFinInput.value;
    const tipoClase = tipoClaseInput.value;
    const frecuencia = frecuenciaInput.value;
    const salon = salonInput.value;

    const infoHorario = {
        profesor: profesor,
        materia: materia,
        grupo: grupo,
        horaInicio: horaInicio,
        horaFin: horaFin,
        tipoClase: tipoClase,
        frecuencia: frecuencia,
        salon: salon,
    };

      guardarElementoFirebase(infoHorario);
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
        const HorariosRef = ref(database, `horarios/${filter}`);
        get(HorariosRef).then((snapshot) => {
            if (snapshot.exists()){
                const datos = snapshot.val();
                calendar.removeAllEvents();
                let eventos=[]
                Object.entries(datos).forEach(([dia, infoHorario])=>{
                        Object.values(infoHorario).forEach(clase =>{
                            const nuevoEvento = {
                                title: `${clase.materia} (${clase.grupo}) - ${clase.salon}`,
                                daysOfWeek: clase.daysOfWeek, 
                                startTime: clase.horaInicio,
                                endTime: clase.horaFin,
                                extendedProps:{
                                    salon: clase.salon,
                                    profesor: clase.profesor,
                                    nombremateria: clase.materia,
                                    grupomateria: clase.grupo,
                                    diamateria: clase.frecuencia,
                                    horaInicio: clase.horaInicio,
                                    horaFin: clase.horaFin,
                                },
                                startRecur: '2023-01-01',
                                endRecur: '2026-12-31',  
                            }
                            eventos.push(nuevoEvento)
                        })
                })
            calendar.addEventSource(eventos);    
            } else {
                alert("No hay datos disponibles.");
            }
        }).catch((error) => {
            console.error("Error al leer los datos:", error);
        });
    });
}
function verEvento(evento) {
    const container = document.getElementById("container");
    const nuevoElemento = document.createElement("div");
    nuevoElemento.classList.add("modalInformacion");
    container.appendChild(nuevoElemento);
    nuevoElemento.innerHTML=`     
    <div class="infoContainer">
    <button class="botonCerrar" id="botonCerrar"><span class="material-symbols-outlined">close</span></button>
        <div id="infoReporte">
        <h2><b>Clase: </b>${evento.extendedProps.nombremateria}</h2>
        <p><b>Profesor: </b>${evento.extendedProps.profesor}</p>
        <hr>
        <p><b>Hora: </b>${evento.extendedProps.horaInicio} - ${evento.extendedProps.horaFin}</p>
        <p><b>Grupo: </b>${evento.extendedProps.grupomateria}</p>
        <p><b>Salon: </b>${evento.extendedProps.salon}</p>
        <p><b>Dia: </b>${evento.extendedProps.diamateria}</p>
        </div> 
    <div class="botonesContainer">
        <button id="botonBorrar">Eliminar</button>
        <button id="botonEditar">Editar</button>
    </div>
    </div> 
    `;

    const infoevento={
        salon:evento.extendedProps.salon,
        frecuencia: evento.extendedProps.diamateria,
        idMateria: `${evento.extendedProps.nombremateria}-${evento.extendedProps.grupomateria}`
    }
    const botonCerrar = document.getElementById("botonCerrar");
    botonCerrar.addEventListener("click", function () {
      CerrarModal(nuevoElemento,container);
    });
    const botonEditar = document.getElementById("botonEditar");
    botonEditar.addEventListener("click", function () {
      editarElementoFirebase(infoevento);
    });
    const botonBorrar = document.getElementById("botonBorrar");
    botonBorrar.addEventListener("click", function(){
      borrarElementoFirebase(infoevento)
    })
  }
function CerrarModal(modal,contenedor){
    contenedor.removeChild(modal);
}
function borrarElementoFirebase(evento){
    const eventofirebase = ref(database, `horarios/${evento.salon}/${evento.frecuencia}/${evento.idMateria}`);
    remove(eventofirebase)
    .then(() => {
      alert("Reporte borrado exitosamente.");
      window.location.reload();
      
    })
    .catch((error) => {
      alert("Error al borrar el reporte:", error);
    });
}
function editarElementoFirebase(evento){
    const eventofirebase = ref(database, `horarios/${evento.salon}/${evento.frecuencia}/${evento.idMateria}`);
    console.log(evento.idMateria)
    get(eventofirebase).then((snapshot) => {
        if (snapshot.exists()) {
            const eventoFirebaseData = snapshot.val();
            console.log("Datos de Firebase para editar:", eventoFirebaseData);
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
            const container = document.getElementById("container");
            const nuevoElemento = document.createElement("div");
            nuevoElemento.classList.add("modalInformacion");
            container.appendChild(nuevoElemento);
            nuevoElemento.innerHTML = `
         <div class="infoContainer">
            <button class="botonCerrar" id="btnCerrar">
                <span class="material-symbols-outlined">close</span>
            </button>

            <form id="horarioForm">
                <div class="InputContainers">
                    <label for="profesor">Profesor:</label>
                    <input value="${eventoFirebaseData.profesor || ''}" type="text" id="profesor" name="profesor" required>
                </div>

                <div class="InputContainers">
                    <label for="materia">Materia:</label>
                    <input  value="${eventoFirebaseData.materia || ''}" type="text" id="materia" name="materia" required>
                </div>

                <div class="InputContainers">
                    <label for="grupo">Grupo:</label>
                    <input  value="${eventoFirebaseData.grupo || ''}" type="text" id="grupo" name="grupo" required>
                </div>

                 <div class="InputContainers">
            <label for="horaInicio">Hora de Inicio:</label>
            <input type="text" value="${Object.keys(hora).find(clave => hora[clave] === eventoFirebaseData.horaInicio) || ''}" id="horaInicio" name="horaInicio" list="listaHoras" required>
            <datalist id="listaHoras">
                <option value="M1"></option>
                <option value="M2"></option>
                <option value="M3"></option>
                <option value="M4"></option>
                <option value="M5"></option>
                <option value="M6"></option>
                <option value="V1"></option>
                <option value="V2"></option>
                <option value="V3"></option>
                <option value="V4"></option>
                <option value="V5"></option>
                <option value="V6"></option>
                <option value="N1"></option>
                <option value="N2"></option>
                <option value="N3"></option>
                <option value="N4"></option>
                <option value="N5"></option>
                <option value="N6"></option>
            </datalist>
        </div>

        <div class="InputContainers">
            <label for="horaFin">Hora de Fin:</label>
            <input type="text" value="${Object.keys(horaFinal).find(clave => horaFinal[clave] === eventoFirebaseData.horaFin)|| ''}" id="horaFin" name="horaFin" list="listaHoras" required>
            <datalist id="listaHoras">
                <option value="M1"></option>
                <option value="M2"></option>
                <option value="M3"></option>
                <option value="M4"></option>
                <option value="M5"></option>
                <option value="M6"></option>
                <option value="V1"></option>
                <option value="V2"></option>
                <option value="V3"></option>
                <option value="V4"></option>
                <option value="V5"></option>
                <option value="V6"></option>
                <option value="N1"></option>
                <option value="N2"></option>
                <option value="N3"></option>
                <option value="N4"></option>
                <option value="N5"></option>
                <option value="N6"></option>
            </datalist>
        </div>

                <div class="InputContainers">
                    <label for="inputClase">Tipo de Clase:</label>
                    <input  value="${eventoFirebaseData.tipoClase || ''}" type="text" id="inputClase" name="clase" list="listaTipoClase" required>
                    <datalist id="listaTipoClase">
                        <option value="Clase Ordinario"></option>
                        <option value="Laboratorio"></option>
                        <option value="Asesorias Extraordinarias"></option>
                    </datalist>
                </div>

                <div class="InputContainers">
                    <label for="inputDias">Días de la Semana:</label>
                    <input  value="${eventoFirebaseData.frecuencia || ''}" type="text" id="inputDias" name="dias" list="listaDias" required>
                    <datalist id="listaDias">
                        <option value="Lunes, Miércoles y Viernes"></option>
                        <option value="Lunes"></option>
                        <option value="Martes"></option>
                        <option value="Miercoles"></option>
                        <option value="Jueves"></option>
                        <option value="Viernes"></option>
                        <option value="Sábado"></option>
                    </datalist>
                </div>
                <div class="InputContainers">
                    <label for="inputSalon">Salon:</label>
                    <input  value="${eventoFirebaseData.salon || ''}" type="text" id="inputSalon" name="salon" list="listaSalon" required>
                    <datalist id="listaSalon">
                        <option value="9101"></option>
                        <option value="9102"></option>
                        <option value="9103"></option>
                        <option value="9104"></option>
                    </datalist>
                </div>

                <br>
                <div class="botonesContainer">
                    <button id="botonGuardarEdicion" type="button" data-evento-id="${eventoFirebaseData.idMateria}">Guardar Cambios</button>
                </div>
            </form>
        </div>
            `;

            const profesorInput = document.getElementById("profesor");
            const materiaInput = document.getElementById("materia");
            const grupoInput = document.getElementById("grupo");
            const horaInicioInput = document.getElementById("horaInicio");
            const horaFinInput = document.getElementById("horaFin");
            const tipoClaseInput = document.getElementById("inputClase");
            const frecuenciaInput = document.getElementById("inputDias");
            const salonInput = document.getElementById("inputSalon");
            
            const btnCerrar = document.getElementById("btnCerrar");
            btnCerrar.addEventListener("click", function () {
            CerrarModal(nuevoElemento,container);
            });

            const botonGuardarEdicion = document.getElementById("botonGuardarEdicion");
            botonGuardarEdicion.addEventListener("click", () => {
                const profesor = profesorInput.value;
                const materia = materiaInput.value;
                const grupo = grupoInput.value;
                const horaInicio = horaInicioInput.value;
                const horaFin = horaFinInput.value;
                const tipoClase = tipoClaseInput.value;
                const frecuencia = frecuenciaInput.value;
                const salon = salonInput.value;
                const eventoId = botonGuardarEdicion.dataset.eventoId; 
                const horario = {
                    profesor: profesor,
                    materia: materia,
                    grupo: grupo,
                    horaInicio: horaInicio,
                    horaFin: horaFin,
                    tipoClase: tipoClase,
                    frecuencia: frecuencia,
                    salon: salon,
                };
                const dias=horario.frecuencia.toLowerCase()
                let infoHorario
                const daysOfWeekMap={
                    lunes:1,
                    martes:2,
                    miercoles:3,
                    jueves:4,
                    viernes:5,
                    sabado:6,
                }
                
            
                if(horario.frecuencia=="Lunes, Miércoles y Viernes"){
                    infoHorario = {
                        profesor: horario.profesor,
                        materia: horario.materia,
                        grupo: horario.grupo,
                        horaInicio: hora[horario.horaInicio],
                        horaFin: horaFinal[horario.horaFin],
                        tipoClase: horario.tipoClase,
                        frecuencia: horario.frecuencia,
                        daysOfWeek:[1,3,5],
                        salon: horario.salon,
                    };
                }else{
                    infoHorario = {
                        profesor: horario.profesor,
                        materia: horario.materia,
                        grupo: horario.grupo,
                        horaInicio: hora[horario.horaInicio],
                        horaFin: horaFinal[horario.horaFin],
                        tipoClase: horario.tipoClase,
                        frecuencia: horario.frecuencia,
                        daysOfWeek:[daysOfWeekMap[dias]],
                        salon: horario.salon,
                    };
                }
                console.log(infoHorario)
               
                update(eventofirebase, infoHorario)
                    .then(() => {
                        alert("✅ Evento editado correctamente.");
                        cargarTodosLosEventos();
                        CerrarModal(nuevoElemento, container);
                        
                    })
                    .catch((error) => {
                        console.error("❌ Error al editar el evento:", error);
                        alert("❌ Error al editar el evento.");
                        CerrarModal(nuevoElemento, container);
                    });
                   
            });

        } else {
            alert("No se encontraron datos del evento para editar.");
        }
    }).catch((error) => {
        console.error("Error al leer los datos del evento:", error);
    });
}
function guardarElementoFirebase(horario){
    const dias=horario.frecuencia.toLowerCase()
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
    let infoHorario
    const daysOfWeekMap={
        lunes:1,
        martes:2,
        miercoles:3,
        jueves:4,
        viernes:5,
        sabado:6,
    }
    if(horario.frecuencia=="Lunes, Miércoles y Viernes"){
        infoHorario = {
            profesor: horario.profesor,
            materia: horario.materia,
            grupo: horario.grupo,
            horaInicio: hora[horario.horaInicio],
            horaFin: horaFinal[horario.horaFin],
            tipoClase: horario.tipoClase,
            frecuencia: horario.frecuencia,
            daysOfWeek:[1,3,5],
            salon: horario.salon,
        };
       
    }else{
        infoHorario = {
            profesor: horario.profesor,
            materia: horario.materia,
            grupo: horario.grupo,
            horaInicio: hora[horario.horaInicio],
            horaFin: horaFinal[horario.horaFin],
            tipoClase: horario.tipoClase,
            frecuencia: horario.frecuencia,
            daysOfWeek:[daysOfWeekMap[dias]],
            salon: horario.salon,
        };
    }
    const HorariosRef=ref(database,`horarios/${horario.salon}/${horario.frecuencia}/${horario.materia}-${horario.grupo}/`);
    set(HorariosRef,infoHorario)
        .then(()=>{
        alert("✅ Reporte guardado correctamente");
        location.reload(true); 
        })
        .catch((error) => {
            console.error("❌ Error al guardar:", error);
        });
    infoHorario={}
    
}