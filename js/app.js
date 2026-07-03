
// ====== DATOS POR DEFECTO ======
let modoManual = false;

const datosIniciales = {
    manana: {
        titular: "Walter León",
        apoyo: "Alejandro Caycho"
    },
    tarde: {
        titular: "Nelson Meza",
        apoyo: "Andres Rojas"
    },

    telefonos: {
        "Walter León": "963802944",
        "Alejandro Caycho": "963802954",
        "Nelson Meza": "963802904",
        "Andres Rojas": "963802888"
    },

    ultimaActualizacion: new Date().toLocaleString("es-PE")
};

document.addEventListener("DOMContentLoaded", () => {

    const ahora = new Date();

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const fecha = ahora.toLocaleDateString('es-PE', opciones);

    const elemento = document.getElementById("fechaActual");

    if (elemento) {
        elemento.textContent = "📅 " + fecha;
    }

});

// =========================
// INICIALIZAR STORAGE
// =========================
if (!localStorage.getItem("turnos")) {
    localStorage.setItem("turnos", JSON.stringify(datosIniciales));
}

let turnos = JSON.parse(localStorage.getItem("turnos"));

// reparar datos si vienen incompletos
if (!turnos.manana || !turnos.tarde) {
    turnos = datosIniciales;
    localStorage.setItem("turnos", JSON.stringify(turnos));
}

// asegurar teléfonos
if (!turnos.telefonos) {
    turnos.telefonos = datosIniciales.telefonos;
    localStorage.setItem("turnos", JSON.stringify(turnos));
}

// =========================
// FUNCIÓN PARA MOSTRAR
// =========================
function mostrar(nombre) {
    const tel = turnos.telefonos?.[nombre] || "sin número";
    return `${nombre} 📱 ${tel}`;
}

// =========================
// MOSTRAR DATOS
// =========================
document.getElementById("mananaTitular").textContent =
    mostrar(turnos.manana.titular);

document.getElementById("mananaApoyo").textContent =
    mostrar(turnos.manana.apoyo);

document.getElementById("tardeTitular").textContent =
    mostrar(turnos.tarde.titular);

document.getElementById("tardeApoyo").textContent =
    mostrar(turnos.tarde.apoyo);

document.getElementById("ultimaActualizacion").textContent =
    turnos.ultimaActualizacion;

// =========================
// BOTÓN ADMIN
// =========================
document.getElementById("btnAdmin").addEventListener("click", () => {
    location.href = "login.html";
});

// =========================
// LÓGICA DE TURNOS AUTOMÁTICA
// =========================
function actualizarPantalla() {

    if (modoManual) return;

    const ahora = new Date();
    const hora = ahora.getHours();

    document.getElementById("horaActual").textContent =
        ahora.toLocaleTimeString("es-PE");

    const estado = document.getElementById("estado");

    const manana = document.getElementById("cardManana");
    const tarde = document.getElementById("cardTarde");

    manana.classList.add("oculto");
    tarde.classList.add("oculto");

    if (hora >= 7 && hora < 14) {

        estado.innerHTML = "🟢  EN VIVO - TURNO ACTUAL";
        manana.classList.remove("oculto");

    } else if (hora >= 14 && hora <= 16) {

        estado.innerHTML = "🟢 EN VIVO (AMBOS TURNOS ACTIVOS)";
        manana.classList.remove("oculto");
        tarde.classList.remove("oculto");

    } else if (hora > 16 && hora <= 23) {

        estado.innerHTML = "🟢  EN VIVO - TURNO ACTUAL";
        tarde.classList.remove("oculto");

    } else {

        estado.innerHTML = "⚫ FUERA DE HORARIO";
    }
}

// iniciar sistema
actualizarPantalla();
setInterval(actualizarPantalla, 1000);

// =========================
// SWITCH PRO (VER OTRO TURNO)
// =========================
const switchBtn = document.getElementById("btnSegundoTurno");
const label = document.getElementById("switchLabel");
const estado = document.getElementById("estado");

function actualizarLabel() {
    if (switchBtn.checked) {
        label.textContent = "👀 Viendo otro turno";
    } else {
        label.textContent = "🔄 Ver otro turno";
    }
}

switchBtn.addEventListener("change", () => {

    modoManual = switchBtn.checked;

    const manana = document.getElementById("cardManana");
    const tarde = document.getElementById("cardTarde");

    actualizarLabel();

    if (modoManual) {

        const hora = new Date().getHours();

        if (hora < 14) {
            manana.classList.add("oculto");
            tarde.classList.remove("oculto");
            estado.innerHTML = "🔄 VIENDO TURNO TARDE";
        } else {
            tarde.classList.add("oculto");
            manana.classList.remove("oculto");
            estado.innerHTML = "🔄 VIENDO TURNO MAÑANA";
        }



    } else {
        actualizarPantalla();
    }
});

// 🔥 sincronizar al cargar la página (ADIOS "Modo automático")
actualizarLabel();