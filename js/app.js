// ===============================
// CONFIGURACIÓN
// ===============================

const URL_API = "https://script.google.com/macros/s/AKfycbz0TXoNLzkG0LGlM6VBLPgUMEgM21iVc5Rfe7XZlq7uaDoXxbeO6WM8kefYhVO60Wl12w/exec";

let datosTurnos = {};

// ===============================
// HELPERS
// ===============================

function crearLinkWhatsApp(texto) {

    if (!texto) return "";

    // Detecta número dentro del texto (9 dígitos Perú)
    const match = texto.match(/(\d{9})/);

    if (!match) {
        return texto;
    }

    const telefono = match[1];

    const url = `https://wa.me/51${telefono}`;

    return `<a href="${url}" target="_blank" style="
        color:#0a66c2;
        text-decoration:none;
        font-weight:600;
        cursor:pointer;
    ">${texto}</a>`;
}

// ===============================
// CARGAR DATOS DESDE GOOGLE SHEETS
// ===============================

async function cargarTurnos() {

    try {

        const respuesta = await fetch(URL_API + "?t=" + Date.now(), {
            method: "GET",
            cache: "no-store"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con Apps Script.");
        }

        datosTurnos = await respuesta.json();

        if (datosTurnos.error) {
            throw new Error(datosTurnos.error);
        }

        // ===============================
        // MAÑANA
        // ===============================

        document.getElementById("mananaTitular").innerHTML =
            crearLinkWhatsApp(datosTurnos.turnos?.MANANA?.titular1 || "");

        document.getElementById("mananaApoyo").innerHTML =
            crearLinkWhatsApp(datosTurnos.turnos?.MANANA?.titular2 || "");

        // ===============================
        // TARDE
        // ===============================

        document.getElementById("tardeTitular").innerHTML =
            crearLinkWhatsApp(datosTurnos.turnos?.TARDE?.titular1 || "");

        document.getElementById("tardeApoyo").innerHTML =
            crearLinkWhatsApp(datosTurnos.turnos?.TARDE?.titular2 || "");

        // ===============================
        // ACTUALIZACIÓN
        // ===============================

        document.getElementById("ultimaActualizacion").textContent =
            datosTurnos.ultimaActualizacion || "";

    } catch (error) {

        console.error(error);

        document.getElementById("estado").innerHTML =
            "❌ Error al conectar con Google Sheets";
    }
}

// ===============================
// RELOJ
// ===============================

function actualizarHora() {

    const ahora = new Date();

    document.getElementById("horaActual").textContent =
        ahora.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    document.getElementById("fechaActual").textContent =
        ahora.toLocaleDateString("es-PE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    detectarTurno();
}

// ===============================
// DETECTAR TURNO
// ===============================

function detectarTurno() {

    const hora = new Date().getHours();

    const cardManana = document.getElementById("cardManana");
    const cardTarde = document.getElementById("cardTarde");
    const estado = document.getElementById("estado");
    const sinPersonal = document.getElementById("sinPersonal");

    // Restablecer estado
    sinPersonal.classList.add("oculto");

    cardManana.classList.remove("activo");
    cardTarde.classList.remove("activo");

    cardManana.style.display = "block";
    cardTarde.style.display = "block";

    // ===============================
    // 07:00 - 13:59 -> SOLO MAÑANA
    // ===============================
    if (hora >= 7 && hora < 14) {

        cardTarde.style.display = "none";

        cardManana.classList.add("activo");

        estado.innerHTML = "🟢 Turno actual: MAÑANA";

    }

    // ===============================
    // 14:00 - 15:59 -> AMBOS
    // ===============================
    else if (hora >= 14 && hora < 16) {

        cardManana.classList.add("activo");
        cardTarde.classList.add("activo");

        estado.innerHTML = "🟢 Turno actual: MAÑANA Y TARDE";

    }

    // ===============================
    // 16:00 - 22:59 -> SOLO TARDE
    // ===============================
    else if (hora >= 16 && hora < 23) {

        cardManana.style.display = "none";

        cardTarde.classList.add("activo");

        estado.innerHTML = "🌙 Turno actual: TARDE";

    }

    // ===============================
    // 23:00 - 06:59 -> SIN PERSONAL
    // ===============================
    else {

        cardManana.style.display = "none";
        cardTarde.style.display = "none";

        sinPersonal.classList.remove("oculto");

        estado.innerHTML = "⚪ Fuera de horario - Sin personal";

    }

}

// ===============================
// INICIO
// ===============================

cargarTurnos();
actualizarHora();

setInterval(actualizarHora, 1000);
setInterval(cargarTurnos, 30000);

// ===============================
// BOTÓN ADMIN
// ===============================

document.getElementById("btnAdmin").addEventListener("click", () => {
    window.open("https://www.nos.pucp.edu.pe/", "_blank");
});

// ===============================
// BOTÓN ACTUALIZAR
// ===============================

document.getElementById("btnActualizar").addEventListener("click", async function () {

    this.disabled = true;
    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Actualizando...';

    actualizarHora();
    detectarTurno();

    await cargarTurnos();

    actualizarHora();

    this.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Actualizar información';
    this.disabled = false;
});