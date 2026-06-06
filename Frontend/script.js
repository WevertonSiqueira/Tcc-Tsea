function sair() {
    localStorage.removeItem('token');
    window.location.href = 'Login.html';
    if (window.location.href.endsWith('Login.html')) {
        alert('Você saiu com sucesso!');
    } else {
        alert('Você saiu com sucesso!');
    }
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
        username: email,
        password: senha
    };
    try {
        const resposta = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        const dados = await resposta.json();
        if (resposta.ok) {
            if (dados.token) {
                localStorage.setItem('token', dados.token);
            }
            // fallback: if backend returned a success message, proceed
            window.location.href = 'Dashborad.html';
        } else {
            alert('Erro ao fazer login: ' + (dados.mensagem || dados.message || JSON.stringify(dados)));
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
    }
}

function renderDashboardChart() {
    const ctx = document.getElementById('graficoLotes');
    if (!ctx) return;
    // render placeholder until lotes are fetched
    // actual chart will be rendered by renderLotesChart(lotes)
}

let lotesChart = null;
let statusChart = null;

function renderLotesChart(lotes) {
    const ctx = document.getElementById('graficoLotes');
    if (!ctx) return;
    const labels = lotes.map(l => l.nome || `Lote ${l.id}`);
    const data = lotes.map(l => Number(l.peso) || 0);

    if (lotesChart) {
        lotesChart.destroy();
        lotesChart = null;
    }

    lotesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Produção (kg)',
                data,
                backgroundColor: labels.map((_, i) => ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'][i % 6]),
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

function renderStatusChart(lotes) {
    const canvas = document.getElementById('graficoQualidade');
    if (!canvas) return;
    const counts = {};
    lotes.forEach(l => {
        const s = l.status || 'desconhecido';
        counts[s] = (counts[s] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = labels.map(k => counts[k]);

    if (statusChart) {
        statusChart.destroy();
        statusChart = null;
    }

    statusChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: ['#1cc88a', '#36b9cc', '#e74a3b', '#f6c23e', '#858796'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
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

// --- Lotes UI: data, filters, pagination, modal ---
let lotesData = [];
let currentPage = 1;
let pageSize = 10;
let loteModalInstance = null;

function ensureModalExists() {
    if (loteModalInstance) return;
    const modalEl = document.getElementById('loteModal');
    if (!modalEl) return;
    loteModalInstance = new bootstrap.Modal(modalEl, {});
    const form = document.getElementById('loteForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('loteId').value;
            const nome = document.getElementById('loteNome').value.trim();
            const pesoStr = document.getElementById('lotePeso').value.trim();
            const status = document.getElementById('loteStatus').value;
            const peso = pesoStr ? parseFloat(pesoStr.replace(',', '.')) : null;
            const payload = { nome, peso, status };
            try {
                if (id) {
                    const res = await fetch(`http://localhost:5000/api/lotes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    if (!res.ok) throw await res.json();
                } else {
                    const res = await fetch('http://localhost:5000/api/lotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    if (!res.ok) throw await res.json();
                }
                loteModalInstance.hide();
                await fetchLotes();
            } catch (err) {
                console.error('Erro ao salvar lote', err);
                alert('Erro ao salvar lote');
            }
        });
    }
}

function openCreateModal() {
    ensureModalExists();
    document.getElementById('loteId').value = '';
    document.getElementById('loteNome').value = '';
    document.getElementById('lotePeso').value = '';
    document.getElementById('loteStatus').value = 'pendente';
    loteModalInstance.show();
}

function openEditModal(lote) {
    ensureModalExists();
    document.getElementById('loteId').value = lote.id;
    document.getElementById('loteNome').value = lote.nome || '';
    document.getElementById('lotePeso').value = lote.peso ?? '';
    document.getElementById('loteStatus').value = lote.status || 'pendente';
    loteModalInstance.show();
}

function applyFilters(items) {
    const q = (document.getElementById('filterSearch')?.value || '').toLowerCase();
    const status = document.getElementById('filterStatus')?.value || '';
    return items.filter(i => {
        if (q && !(i.nome || '').toLowerCase().includes(q)) return false;
        if (status && (i.status || 'desconhecido') !== status) return false;
        return true;
    });
}

function renderTable(page = 1) {
    currentPage = page;
    pageSize = parseInt(document.getElementById('pageSize')?.value || pageSize, 10);
    const filtered = applyFilters(lotesData);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    const tbody = document.querySelector('#lotesTable tbody');
    tbody.innerHTML = '';
    pageItems.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${l.id}</td><td>${l.nome}</td><td>${l.peso ?? ''}</td><td>${l.status ?? ''}</td><td><button class="btn btn-sm btn-primary me-2" onclick="editLote(${l.id})">Editar</button><button class="btn btn-sm btn-danger" onclick="deleteLote(${l.id})">Excluir</button></td>`;
        tbody.appendChild(tr);
    });

    renderPagination(totalPages);
    renderLotesChart(filtered);
    renderStatusChart(filtered);
}

function renderPagination(totalPages) {
    const ul = document.getElementById('pagination');
    ul.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item' + (i === currentPage ? ' active' : '');
        li.innerHTML = `<a class="page-link" href="#" onclick="(function(e){e.preventDefault(); renderTable(${i});})(event)">${i}</a>`;
        ul.appendChild(li);
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
    // fetch and render lotes if present
    if (typeof fetchLotes === 'function') fetchLotes();
    const btnNovo = document.getElementById('btnNovoLote');
    if (btnNovo) btnNovo.addEventListener('click', openCreateModal);
    // filter listeners
    document.getElementById('filterSearch')?.addEventListener('input', () => renderTable(1));
    document.getElementById('filterStatus')?.addEventListener('change', () => renderTable(1));
    document.getElementById('pageSize')?.addEventListener('change', () => renderTable(1));
    // ensure modal wiring
    ensureModalExists();
});

async function fetchLotes() {
    try {
        const res = await fetch('http://localhost:5000/api/lotes');
        if (!res.ok) return;
        const lotes = await res.json();
        lotesData = lotes;
        renderTable(1);
    } catch (err) {
        console.error('Erro fetch lotes', err);
    }
}

function createLotePrompt() {
    openCreateModal();
}

async function createLote(payload) {
    try {
        const res = await fetch('http://localhost:5000/api/lotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            await fetchLotes();
            alert('Lote criado com sucesso');
        } else {
            const err = await res.json();
            alert('Erro ao criar lote: ' + (err.error || JSON.stringify(err)));
        }
    } catch (err) {
        console.error('Erro criar lote', err);
        alert('Erro ao criar lote');
    }
}

function editLote(id) {
    const lote = lotesData.find(l => Number(l.id) === Number(id));
    if (!lote) return alert('Lote não encontrado');
    openEditModal(lote);
}

async function deleteLote(id) {
    if (!confirm('Confirma exclusão do lote #' + id + '?')) return;
    try {
        const res = await fetch(`http://localhost:5000/api/lotes/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await fetchLotes();
            alert('Lote excluído');
        } else {
            const err = await res.json();
            alert('Erro ao excluir: ' + (err.error || JSON.stringify(err)));
        }
    } catch (err) {
        console.error('Erro delete lote', err);
        alert('Erro ao excluir lote');
    }
}



