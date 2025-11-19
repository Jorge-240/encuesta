// Funciones de validación reutilizables (mantener en un archivo separado)
function isValidEmail(email){
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function isNonEmpty(text){
    return String(text || "").trim().length > 0;
}