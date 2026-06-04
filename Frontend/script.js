const ctx = document.getElementById('meuGrafico').getContext('2d');

const meuGrafico = new Chart(ctx, {
    type: 'bar', // Tipo de gráfico: 'bar', 'line', 'pie', etc.
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
            label: 'Vendas Mensais (R$)',
            data: [2000, 4000, 3500, 5000, 6000],
            backgroundColor: '#3498db',
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});
