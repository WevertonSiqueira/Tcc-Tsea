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

        // Tentar login direto com Supabase Auth
        if (window.supabaseClient) {
            try {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: senha
                });

                if (error) {
                    alert('Erro ao fazer login: ' + error.message);
                    return;
                }

                if (data.session) {
                    localStorage.setItem('token', data.session.access_token);
                    localStorage.setItem('refresh_token', data.session.refresh_token);
                    window.location.href = 'Dashboard.html';
                    return;
                }
            } catch (err) {
                console.error('Erro ao fazer login com Supabase:', err);
                alert('Erro ao fazer login com Supabase: ' + err.message);
                return;
            }
        }

        // Fallback para API backend
        await Logar();
    });
});
