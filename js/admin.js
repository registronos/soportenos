const personas = [
    "Walter León",
    "Alejandro Caycho",
    "Nelson Meza",
    "Andres Rojas"
];

// Leer datos
let turnos = JSON.parse(localStorage.getItem("turnos"));

if (!turnos) {

    turnos = {

        manana: {

            titular: "Walter León",

            apoyo: "Alejandro Caycho"

        },

        tarde: {

            titular: "Nelson Meza",

            apoyo: "Andres Rojas"

        },

        ultimaActualizacion: new Date().toLocaleString("es-PE")

    };

}

// Cargar combos

function llenar(id){

    const combo = document.getElementById(id);

    personas.forEach(nombre=>{

        let op = document.createElement("option");

        op.value = nombre;

        op.text = nombre;

        combo.appendChild(op);

    });

}

llenar("mt");
llenar("ma");
llenar("tt");
llenar("ta");

// Mostrar valores actuales

mt.value = turnos.manana.titular;

ma.value = turnos.manana.apoyo;

tt.value = turnos.tarde.titular;

ta.value = turnos.tarde.apoyo;

// Guardar

document.getElementById("guardar").addEventListener("click",()=>{

    turnos.manana.titular = mt.value;

    turnos.manana.apoyo = ma.value;

    turnos.tarde.titular = tt.value;

    turnos.tarde.apoyo = ta.value;

    turnos.ultimaActualizacion =
    new Date().toLocaleString("es-PE");

    localStorage.setItem(
        "turnos",
        JSON.stringify(turnos)
    );

    alert("✅ Turnos actualizados correctamente.");

    location.href="index.html";

});

// Volver

document.getElementById("volver").onclick=()=>{

location.href="index.html";

}