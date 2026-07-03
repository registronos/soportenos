
function login(){



const user = document.getElementById("user").value;
const pass = document.getElementById("pass").value;

if(user === "admin" && pass === "Nospucp2026"){

// guardar sesión
localStorage.setItem("auth", "ok");

// 🔥 redirigir al administrador
window.location.href = "admin.html";

}else{

document.getElementById("msg").textContent =
"❌ Usuario o contraseña incorrectos";
}



}

function triggerLogin(event){
    if (event.key === "Enter") {
        login();
    }
}

document.getElementById("user").addEventListener("keydown", triggerLogin);
document.getElementById("pass").addEventListener("keydown", triggerLogin);