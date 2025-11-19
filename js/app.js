// Manejo del formulario y la página de confirmación
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscriptionForm');
    if (form) {
        form.addEventListener('submit', onSubmit);
    }

    // Si estamos en confirmation.html, renderizar resumen y asignar botones (si existen)
    if (window.location.pathname.endsWith('confirmation.html') || location.href.includes('confirmation.html')) {
        renderConfirmation();

        const goBack = document.getElementById('goBack');
        const newSubs = document.getElementById('newSubs');

        if (goBack) goBack.addEventListener('click', () => history.back());
        if (newSubs) newSubs.addEventListener('click', () => {
            sessionStorage.removeItem('subscriptionData');
            window.location.href = 'index.html';
        });
    }
});

function onSubmit(e){
    e.preventDefault();
    clearErrors();

    const emailEl = document.getElementById('email');
    const nameEl = document.getElementById('name');
    const privacyEl = document.getElementById('privacy');

    const email = emailEl ? emailEl.value : '';
    const name = nameEl ? nameEl.value : '';
    const privacy = privacyEl ? privacyEl.checked : false;

    const interestsNodes = document.querySelectorAll('input[name="interests"]:checked');
    const interests = Array.from(interestsNodes).map(n => n.value);

    let valid = true;

    if (!isNonEmpty(name)) {
        showError('name', 'El nombre es obligatorio');
        valid = false;
    }

    if (!isNonEmpty(email) || !isValidEmail(email)) {
        showError('email', 'Introduce un email válido');
        valid = false;
    }

    if (!privacy) {
        showError('privacy', 'Debes aceptar la política de privacidad');
        valid = false;
    }

    if (!valid) return;

    const data = { name: name.trim(), email: email.trim(), interests, date: new Date().toISOString() };
    sessionStorage.setItem('subscriptionData', JSON.stringify(data));
    window.location.href = 'confirmation.html';
}

/* helpers de UI */
function showError(fieldName, message){
    const el = document.querySelector(`.error[data-for="${fieldName}"]`);
    if (el) el.textContent = message;
}

function clearErrors(){
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
}

/* Renderizar la página de confirmación */
function renderConfirmation(){
    const raw = sessionStorage.getItem('subscriptionData');
    const container = document.getElementById('summary');
    if (!container) return;

    if (!raw) {
        container.innerHTML = '<p>No se encontró información de suscripción. Vuelve al formulario para crear una.</p>';
        return;
    }

    const data = JSON.parse(raw);
    const date = data.date ? new Date(data.date) : new Date();

    const parts = [
        `<p><strong>Nombre:</strong> ${escapeHtml(data.name || '')}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(data.email || '')}</p>`,
        `<p><strong>Fecha:</strong> ${date.toLocaleString()}</p>`
    ];

    if (data.interests && data.interests.length) {
        const tags = data.interests.map(i => `<span class="tag">${escapeHtml(i)}</span>`).join('');
        parts.push(`<p><strong>Intereses:</strong><br>${tags}</p>`);
    } else {
        parts.push(`<p><strong>Intereses:</strong> No especificado</p>`);
    }

    container.innerHTML = parts.join('');
}

// evitar inyección en el contenido mostrado
function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(m){ return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]; });
}