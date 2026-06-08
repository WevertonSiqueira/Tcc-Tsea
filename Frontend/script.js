function sair() {
    localStorage.removeItem('token');
    window.location.href = 'Login.html';
    alert('Você saiu com sucesso!');
}

// ===== Supabase Initialization =====
// Read config provided by supabase-config.js or global window vars
const SUPABASE_URL = window.SUPABASE_URL || (window.SUPABASE && window.SUPABASE.url) || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || (window.SUPABASE && window.SUPABASE.anonKey) || '';
let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && typeof supabase !== 'undefined') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabaseClient;
        console.info('Supabase: cliente inicializado');
    } catch (err) {
        console.warn('Supabase: erro ao inicializar cliente', err);
    }
} else {
    console.warn('Supabase lib não encontrada ou credenciais ausentes. Verifique supabase-config.js ou variáveis globais.');
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
    const payload = {
        // provide both naming styles so backend (app.py or auth.py) can accept
        username: email,
        password: senha,
        email: email,
        senha: senha
    };

    const endpoints = [
        '/login',
        'http://localhost:8080/login',
        'http://localhost:5000/login'
    ];

    let lastError = null;
    for (const url of endpoints) {
        try {
            console.info('Tentando login em', url);
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            let dados = null;
            try { dados = await resp.json(); } catch (e) { dados = null; }

            // Log for debugging
            console.info('Resposta de', url, resp.status, dados);

            if (resp.ok) {
                // prefer token if provided
                const token = dados?.token || dados?.access_token || dados?.token_access;
                if (token) localStorage.setItem('token', token);
                window.location.href = 'Dashboard.html';
                return;
            }

            // If server responded with 4xx/5xx but JSON message, show it and stop
            if (dados && (dados.mensagem || dados.message || dados.error)) {
                alert('Erro ao fazer login: ' + (dados.mensagem || dados.message || dados.error));
                return;
            }

            // otherwise continue to next endpoint
            lastError = `Endpoint ${url} retornou status ${resp.status}`;
        } catch (err) {
            console.warn('Falha ao conectar em', url, err);
            lastError = err;
            // try next endpoint
        }
    }

    console.error('Todas tentativas de login falharam:', lastError);
    alert('Não foi possível conectar ao servidor de autenticação. Verifique se o backend está rodando e se os endpoints estão acessíveis (veja console).');
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

let lotesData = [];
let currentPage = 1;
let pageSize = 10;
let loteModalInstance = null;

// ===== Toast Notification System =====
function showNotification(message, type = 'success', duration = 3000) {
    const alertId = 'alert-' + Date.now();
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '500px';
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-exclamation-circle' : 'bi-info-circle'} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.appendChild(alertDiv);
    
    if (duration > 0) {
        setTimeout(() => {
            const el = document.getElementById(alertId);
            if (el) el.remove();
        }, duration);
    }
    return alertId;
}

function hideNotification(alertId) {
    const el = document.getElementById(alertId);
    if (el) el.remove();
}

// ===== Modal Management =====
function ensureModalExists() {
    if (loteModalInstance) return;
    const modalEl = document.getElementById('loteModal');
    if (!modalEl) return;
    
    loteModalInstance = new bootstrap.Modal(modalEl, {
        backdrop: 'static',
        keyboard: false
    });
    
    const form = document.getElementById('loteForm');
    if (form) {
        form.addEventListener('submit', handleLoteSave);
    }
}

async function handleLoteSave(e) {
    e.preventDefault();
    
    const id = document.getElementById('loteId').value;
    const nome = document.getElementById('loteNome').value.trim();
    const pesoStr = document.getElementById('lotePeso').value.trim();
    const status = document.getElementById('loteStatus').value;
    
    // Validações
    if (!nome) {
        showNotification('Por favor, preencha o nome do lote', 'warning');
        document.getElementById('loteNome').focus();
        return;
    }
    
    if (!status) {
        showNotification('Por favor, selecione um status', 'warning');
        return;
    }
    
    let peso = null;
    if (pesoStr) {
        peso = parseFloat(pesoStr.replace(',', '.'));
        if (isNaN(peso) || peso <= 0) {
            showNotification('Peso deve ser um número válido maior que 0', 'warning');
            document.getElementById('lotePeso').focus();
            return;
        }
    }
    
    const payload = { nome, peso, status };
    
    // Disable button durante submit
    const submitBtn = document.querySelector('#loteForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Salvando...';
    
    try {
        if (supabaseClient) {
            // Use Supabase for insert/update
            if (id) {
                const { data, error } = await supabaseClient
                    .from('lote')  // Nome da tabela no Supabase é SINGULAR
                    .update({ nome, peso, status })
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { data, error } = await supabaseClient
                    .from('lote')  // Nome da tabela no Supabase é SINGULAR
                    .insert([{ nome, peso, status }])
                    .select();
                if (error) throw error;
            }

            loteModalInstance.hide();
            await fetchLotes();
            showNotification(id ? 'Lote atualizado com sucesso!' : 'Lote criado com sucesso!', 'success');
        } else {
            // Fallback to local API
            let res;
            if (id) {
                res = await fetch(`http://localhost:5000/api/lotes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('http://localhost:5000/api/lotes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Erro ao salvar lote');
            }

            loteModalInstance.hide();
            await fetchLotes();
            showNotification(id ? 'Lote atualizado com sucesso!' : 'Lote criado com sucesso!', 'success');
        }
    } catch (err) {
        console.error('Erro ao salvar lote', err);
        showNotification(`Erro: ${err.message || err}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function openCreateModal() {
    console.info('openCreateModal: invoked');
    ensureModalExists();
    const idEl = document.getElementById('loteId');
    const nomeEl = document.getElementById('loteNome');
    const pesoEl = document.getElementById('lotePeso');
    const statusEl = document.getElementById('loteStatus');
    if (idEl) idEl.value = '';
    if (nomeEl) nomeEl.value = '';
    if (pesoEl) pesoEl.value = '';
    if (statusEl) statusEl.value = 'pendente';
    if (nomeEl) nomeEl.focus();

    // ensure modal instance exists; fallback to direct bootstrap API
    if (loteModalInstance && typeof loteModalInstance.show === 'function') {
        loteModalInstance.show();
        return;
    }

    const modalEl = document.getElementById('loteModal');
    if (modalEl && typeof bootstrap !== 'undefined' && typeof bootstrap.Modal === 'function') {
        try {
            const tmp = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
            tmp.show();
            // keep reference
            loteModalInstance = tmp;
            return;
        } catch (err) {
            console.warn('openCreateModal: erro ao abrir modal via bootstrap.Modal', err);
        }
    }

    console.warn('openCreateModal: modal não encontrado ou bootstrap não disponível');
}

function openEditModal(lote) {
    ensureModalExists();
    document.getElementById('loteId').value = lote.id;
    document.getElementById('loteNome').value = lote.nome || '';
    document.getElementById('lotePeso').value = lote.peso ?? '';
    document.getElementById('loteStatus').value = lote.status || 'pendente';
    document.getElementById('loteNome').focus();
    loteModalInstance.show();
}

// ===== Table and Filtering =====
function applyFilters(items) {
    const q = (document.getElementById('filterSearch')?.value || '').toLowerCase();
    const status = document.getElementById('filterStatus')?.value || '';
    
    return items.filter(i => {
        if (q && !(i.nome || '').toLowerCase().includes(q)) return false;
        if (status && (i.status || 'desconhecido') !== status) return false;
        return true;
    });
}

function getStatusBadge(status) {
    const statusMap = {
        'pendente': 'badge-pendente',
        'pronto': 'badge-pronto',
        'em_producao': 'badge-em_producao',
        'desconhecido': 'badge-desconhecido'
    };
    const badgeClass = statusMap[status] || 'badge-desconhecido';
    return `<span class="badge ${badgeClass}">${status || 'Desconhecido'}</span>`;
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
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    console.info('renderTable: pageItems count =', pageItems.length, 'filtered total =', filtered.length);
    if (pageItems.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" class="text-center py-4 text-muted">Nenhum lote encontrado</td>';
        tbody.appendChild(tr);
    } else {
        pageItems.forEach(l => {
                const tr = document.createElement('tr');
                const peso = l.peso ? `${l.peso.toFixed(2)} kg` : '-';
                const tdActions = document.createElement('td');

                const btnEdit = document.createElement('button');
                btnEdit.className = 'btn btn-sm btn-primary me-2 btn-edit';
                btnEdit.setAttribute('data-id', l.id);
                btnEdit.title = 'Editar';
                btnEdit.innerHTML = '<i class="bi bi-pencil"></i> Editar';

                const btnDelete = document.createElement('button');
                btnDelete.className = 'btn btn-sm btn-danger btn-delete';
                btnDelete.setAttribute('data-id', l.id);
                btnDelete.title = 'Excluir';
                btnDelete.innerHTML = '<i class="bi bi-trash"></i> Excluir';

                tdActions.appendChild(btnEdit);
                tdActions.appendChild(btnDelete);

                tr.innerHTML = `
                    <td><strong>#${l.id}</strong></td>
                    <td>${l.nome}</td>
                    <td>${peso}</td>
                    <td>${getStatusBadge(l.status)}</td>
                `;
                tr.appendChild(tdActions);
                tbody.appendChild(tr);
            });
    }
    
    renderPagination(totalPages);
    renderLotesChart(filtered);
    renderStatusChart(filtered);
}

function renderPagination(totalPages) {
    const ul = document.getElementById('pagination');
    if (!ul) return;
    
    ul.innerHTML = '';

    // Botão anterior
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    const prevA = document.createElement('a');
    prevA.className = 'page-link';
    prevA.href = '#';
    prevA.textContent = 'Anterior';
    prevA.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage > 1) renderTable(currentPage - 1);
    });
    prevLi.appendChild(prevA);
    ul.appendChild(prevLi);

    // Páginas numeradas (mostrar apenas as úteis)
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = 'page-item' + (i === currentPage ? ' active' : '');
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = String(i);
        a.addEventListener('click', function (e) {
            e.preventDefault();
            renderTable(i);
        });
        li.appendChild(a);
        ul.appendChild(li);
    }

    // Botão próximo
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
    const nextA = document.createElement('a');
    nextA.className = 'page-link';
    nextA.href = '#';
    nextA.textContent = 'Próximo';
    nextA.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage < totalPages) renderTable(currentPage + 1);
    });
    nextLi.appendChild(nextA);
    ul.appendChild(nextLi);
}

// ===== Lotes Operations =====
async function fetchLotes() {
    // If Supabase client is configured, try to fetch from Supabase
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('lote')  // Nome da tabela no Supabase é SINGULAR
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                showNotification('Erro ao carregar lotes (Supabase)', 'error', 5000);
            } else if (data) {
                // transform registros do banco para o formato esperado pelo frontend
                lotesData = data.map(d => transformLote(d));
                renderTable(1);
                updateDashboardStats(lotesData);
                console.info('Lotes carregados via Supabase:', lotesData.length);
                return;
            }
        } catch (err) {
            console.error('Erro ao buscar lotes no Supabase', err);
            showNotification('Erro ao conectar com Supabase', 'error', 5000);
        }
    }

    // Fallback: antiga API local
    try {
        console.info('fetchLotes: tentando http://localhost:5000/api/lotes');
        const res = await fetch('http://localhost:5000/api/lotes');
        if (!res.ok) {
            let text = '';
            try { text = await res.text(); } catch (e) { text = res.statusText; }
            console.error('Erro ao buscar lotes:', res.status, text);
            showNotification('Erro ao carregar lotes (API local): ' + res.status, 'error', 5000);
            return;
        }
        const lotes = await res.json();
        console.info('fetchLotes: resposta recebida, registros:', (lotes || []).length);
        lotesData = (lotes || []).map(d => transformLote(d));
        renderTable(1);
        updateDashboardStats(lotesData);
    } catch (err) {
        console.error('Erro fetch lotes', err);
        showNotification('Erro ao conectar com o servidor: ' + (err.message || err), 'error', 5000);
    }
}

// transforma um registro de lote do banco no formato usado pelo frontend
function transformLote(d) {
    if (!d) return { id: null, nome: '--', peso: 0, status: 'desconhecido' };

    const id = d.id ?? dId(d) ?? null;

    // nome: tenta vários campos disponíveis, ou gera 'Lote {id}'
    const nome = d.nome || d.setor || d.sector || d.lote_nome || `Lote ${id}`;

    // peso: aceita vários nomes de campo
    const peso = Number(d.peso ?? d.peso_total ?? d.peso_total_kg ?? d.peso_total) || 0;

    // status: tenta campo status ou deduz pelo data_termino
    let status = (d.status || d.estado || d.situacao || '').toString();
    if (!status) {
        const data_termino = d.data_termino || d.dataSaida || d.data_saida || d.data_saida;
        status = data_termino ? 'pronto' : 'em_producao';
    }

    return { id, nome, peso, status };
}

function dId(d) {
    // helper para casos onde id vem com outras chaves
    return d.id || d.lote_id || d.id_lote || d._id || null;
}

// Test Supabase connectivity (simple read)
async function testSupabaseConnection() {
    if (!supabaseClient) return false;
    try {
        const { data, error } = await supabaseClient.from('lote').select('id').limit(1);
        if (error) {
            console.error('Supabase test error:', error);
            showNotification('Supabase: erro de conexão (ver console)', 'error', 4000);
            return false;
        }
        console.info('Supabase: conexão OK, encontrou', (data || []).length, 'registros (teste)');
        showNotification('Supabase: comunicação estabelecida', 'success', 3000);
        return true;
    } catch (err) {
        console.error('Erro no teste Supabase', err);
        showNotification('Supabase: falha na conexão (ver console)', 'error', 4000);
        return false;
    }
}

function updateDashboardStats(lotes) {
    // Total de lotes
    const totalLotes = document.getElementById('totalLotes');
    if (totalLotes) {
        totalLotes.textContent = lotes.length;
    }
    
    // Peso total
    const totalPeso = document.getElementById('totalPeso');
    if (totalPeso) {
        const peso = lotes.reduce((sum, l) => sum + (l.peso || 0), 0);
        totalPeso.textContent = `${peso.toFixed(2)} kg`;
    }
    
    // Produção hoje (lotes em produção ou pronto)
    const prodHoje = document.getElementById('prodHoje');
    if (prodHoje) {
        const produzindo = lotes.filter(l => l.status === 'pronto' || l.status === 'em_producao').length;
        prodHoje.textContent = `${produzindo} lotes`;
    }
}

function editLote(id) {
    const lote = lotesData.find(l => Number(l.id) === Number(id));
    if (!lote) {
        showNotification('Lote não encontrado', 'error');
        return;
    }
    openEditModal(lote);
}

async function deleteLote(id) {
    if (!confirm('Tem certeza que deseja excluir este lote?')) return;
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('lote').delete().eq('id', id);
            if (error) throw error;
            await fetchLotes();
            showNotification('Lote excluído com sucesso!', 'success');
        } else {
            const res = await fetch(`http://localhost:5000/api/lotes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchLotes();
                showNotification('Lote excluído com sucesso!', 'success');
            } else {
                const err = await res.json();
                showNotification(`Erro ao excluir: ${err.error}`, 'error');
            }
        }
    } catch (err) {
        console.error('Erro delete lote', err);
        showNotification('Erro ao excluir lote', 'error');
    }
}

// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', async function () {
    // Sair button
    const botaoSair = document.getElementById('btn-sair');
    if (botaoSair) {
        botaoSair.addEventListener('click', sair);
    }

    // Render charts
    renderDashboardChart();
    renderVisaoGeralChart();
    renderAnalisesCharts();
    
    // Fetch and render lotes
    // If supabase is configured, test connection first
    if (supabaseClient) await testSupabaseConnection();
    fetchLotes();

    // Realtime subscription to lotes: refresh on insert/update/delete
    if (supabaseClient) {
        try {
            if (window.supabaseChannel && typeof window.supabaseChannel.unsubscribe === 'function') {
                // clean previous
                window.supabaseChannel.unsubscribe();
            }

            const channel = supabaseClient.channel('public:lote')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'lote' }, payload => {
                    console.info('Supabase realtime change:', payload);
                    fetchLotes();
                });

            // subscribe (v2 API)
            await channel.subscribe();
            window.supabaseChannel = channel;
            console.info('Subscribed to Supabase realtime for table: lote');
        } catch (err) {
            console.warn('Erro ao subscribir Realtime Supabase:', err);
        }
    }
    
    // Novo Lote button
    const btnNovo = document.getElementById('btnNovoLote');
    if (btnNovo) {
        btnNovo.addEventListener('click', openCreateModal);
    }
    
    // Filter listeners
    document.getElementById('filterSearch')?.addEventListener('input', () => renderTable(1));
    document.getElementById('filterStatus')?.addEventListener('change', () => renderTable(1));
    document.getElementById('pageSize')?.addEventListener('change', () => renderTable(1));
    
    // Delegated actions for edit/delete buttons in the table (mobile-friendly)
    const lotesTbody = document.querySelector('#lotesTable tbody');
    if (lotesTbody) {
        lotesTbody.addEventListener('click', function (e) {
            const editBtn = e.target.closest('.btn-edit');
            const delBtn = e.target.closest('.btn-delete');
            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                if (id) editLote(id);
                return;
            }
            if (delBtn) {
                const id = delBtn.getAttribute('data-id');
                if (id) deleteLote(id);
                return;
            }
        });
    }
    
    // Initialize modal
    ensureModalExists();
    
    // Auto-refresh lotes a cada 30 segundos
    setInterval(fetchLotes, 30000);
});

// Safety attach: garante que o botão "Novo Lote" sempre abra o modal
function attachNovoLoteButton() {
    const btn = document.getElementById('btnNovoLote');
    if (!btn) return;
    // evita múltiplas ligações
    if (btn.dataset.attached === '1') return;
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        openCreateModal();
    });
    btn.dataset.attached = '1';
}

// tente anexar imediatamente (caso script seja carregado após DOM) e novamente após breve atraso
attachNovoLoteButton();
setTimeout(attachNovoLoteButton, 500);

