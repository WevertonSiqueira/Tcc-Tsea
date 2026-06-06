function sair() {
    localStorage.removeItem('token');
    window.location.href = 'Login.html';
}

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

async function Logar() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const usuario = {
        email: email,
        senha: senha
    };
    try {
        const resposta = await fetch('http://localhost:8080/login', {
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
            alert('Erro ao fazer login: ' + (dados.mensagem || dados.message));
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
    }
}

function renderDashboardChart() {
    const ctx = document.getElementById('graficoLotes');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lote 1', 'Lote 2', 'Lote 3', 'Lote 4', 'Lote 5', 'Lote 6'],
            datasets: [{
                label: 'Produção (kg)',
                data: [1200, 950, 780, 1100, 900, 1050],
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => value + ' kg'
                    }
                }
            }
        }
    });
}

function renderVisaoGeralChart() {
    const ctx = document.getElementById('graficoVisaoGeral');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Produção semanal (kg)',
                data: [650, 780, 720, 860, 950, 900, 980],
                backgroundColor: 'rgba(78, 115, 223, 0.15)',
                borderColor: '#4e73df',
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#4e73df'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => value + ' kg'
                    }
                }
            }
        }
    });
}

function renderAnalisesCharts() {
    const chartQualidade = document.getElementById('graficoQualidade');
    const chartTendencia = document.getElementById('graficoTendencia');

    if (chartQualidade) {
        new Chart(chartQualidade, {
            type: 'doughnut',
            data: {
                labels: ['Alta', 'Média', 'Baixa'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#1cc88a', '#36b9cc', '#e74a3b'],
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    if (chartTendencia) {
        new Chart(chartTendencia, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Volume processado (kg)',
                    data: [2400, 2600, 2500, 2700, 2900, 3100],
                    backgroundColor: 'rgba(28, 200, 138, 0.15)',
                    borderColor: '#1cc88a',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#1cc88a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: value => value + ' kg'
                        }
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const botaoSair = document.getElementById('btn-sair');

    if (botaoSair) {
        botaoSair.addEventListener('click', sair);
    }

    renderDashboardChart();
    renderVisaoGeralChart();
    renderAnalisesCharts();
});



