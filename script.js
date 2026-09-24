// ========================================
// RSVP BABY SHOWER ALEXANDER
// ========================================

// PEGA AQUÍ TU URL DE GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxkneFr58LwffQgjHXhIA36yZxVyuXuFbTIiUTCKcZbL_QPyLX5mrWKJXud7d_254U6yg/exec";

// Elementos del formulario
const formulario = document.getElementById("rsvpForm");
const nombre = document.getElementById("nombre");

const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");

const grupoPersonas = document.getElementById("grupoPersonas");
const personas = document.getElementById("personas");

const btnConfirmar = document.getElementById("btnConfirmar");
const mensaje = document.getElementById("mensaje");

// Aquí guardaremos si la persona seleccionó Sí o No
let asistencia = "";

// ========================================
// BOTÓN "SÍ, ASISTIRÉ"
// ========================================

btnSi.addEventListener("click", function () {

    asistencia = "Sí";

    grupoPersonas.style.display = "block";

    btnSi.classList.add("seleccionado");
    btnNo.classList.remove("seleccionado");

});


// ========================================
// BOTÓN "NO PODRÉ ASISTIR"
// ========================================

btnNo.addEventListener("click", function () {

    asistencia = "No";

    grupoPersonas.style.display = "none";

    btnNo.classList.add("seleccionado");
    btnSi.classList.remove("seleccionado");

});


// ========================================
// ENVIAR FORMULARIO
// ========================================

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Comprobar nombre
    if (nombre.value.trim() === "") {

        mensaje.textContent = "Por favor escribe tu nombre.";
        return;

    }

    // Comprobar que eligió Sí o No
    if (asistencia === "") {

        mensaje.textContent = "Por favor indica si podrás acompañarnos.";
        return;

    }

    // Si dijo que no, serán 0 personas
    const numeroPersonas =
        asistencia === "Sí"
            ? personas.value
            : 0;

    // Desactivar botón mientras enviamos
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = "Enviando...";

    mensaje.textContent = "";

    const datos = {

        nombre: nombre.value.trim(),
        asistencia: asistencia,
        personas: numeroPersonas

    };

    try {

        const respuesta = await fetch(GOOGLE_SCRIPT_URL, {

            method: "POST",

            body: JSON.stringify(datos)

        });

        const resultado = await respuesta.json();

        if (!resultado.success) {
            throw new Error("Google Sheets no pudo guardar la confirmación.");
        }

        mensaje.textContent =
            asistencia === "Sí"
                ? "¡Gracias! Tu asistencia ha sido confirmada."
                : "Gracias por avisarnos. ¡Esperamos verte en otra ocasión!";

        // Limpiar formulario
        formulario.reset();

        asistencia = "";

        btnSi.classList.remove("seleccionado");
        btnNo.classList.remove("seleccionado");

        grupoPersonas.style.display = "none";

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No pudimos registrar tu respuesta. Intenta nuevamente.";

    } finally {

        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar asistencia";

    }

});