document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email')?.value.trim();
        const senha = document.getElementById('senha')?.value;

        if (!email || !senha) {
            alert('Informe e-mail e senha.');
            return;
        }

        await Logar();
    });
});
