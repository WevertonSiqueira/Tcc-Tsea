function sair() {
    localStorage.removeItem('token');
    window.location.href = 'Dashborad.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const botaoSair = document.getElementById('btn-sair');

    if (botaoSair) {
        botaoSair.addEventListener('click', sair);
    }
});

function salvarConfiguracao() {
    const nome = document.getElementById('nome')?.value;
    const email = document.getElementById('email')?.value;
    const telefone = document.getElementById('telefone')?.value;
    const tema = document.getElementById('tema')?.value;
    const unidade = document.getElementById('unidade')?.value;
    const autoUpdate = document.getElementById('autoUpdate')?.checked;
    const emailAlerts = document.getElementById('emailAlerts')?.checked;
    const productionAlerts = document.getElementById('productionAlerts')?.checked;
    const dailyReport = document.getElementById('dailyReport')?.checked;

    const configuracoes = {
        nome,
        email,
        telefone,
        tema,
        unidade,
        autoUpdate,
        emailAlerts,
        productionAlerts,
        dailyReport
    };

    localStorage.setItem('configuracoes', JSON.stringify(configuracoes));
    alert('Configurações salvas com sucesso!');
}


async function Logar () {
    const email = document.getElementById('email').value; 
    const senha = document.getElementById('senha').value; 
    const usuario = {
        email: email,
        senha: senha
    };  
    try {
        const resposta = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        const dados = await resposta.json();
        if (resposta.ok) {
            localStorage.setItem('token', dados.token);
            window.location.href = 'Dashborad.html';
        } else {
            alert('Erro ao fazer login: ' + dados.message); 
        }
    }  catch (error) { 
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
    }
}
 


