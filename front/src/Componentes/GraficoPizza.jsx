import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

//regustrando os elementos necessários
Chart.register(ArcElement, Tooltip, Legend);

const GraficoPizza = () => {
    const [dadosGrafico, setDadosGrafico] = useState(null);

    useEffect(() => {
        // Recupera o token de autenticação do localstorage
        const token = localStorage.getItem("access");

        if (!token) {
            console.warn("Token de autenticação não encontrado.");
            return;
        }

        // Requisição à API para obter resumo do status dos sensores
        fetch('http://localhost:8000/api/sensores/status-resumo/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados da API.");
                }
                return response.json();
            })
            .then(resumo => {
                //formata os dados para o gráfico de pizza
                const dadosFormatados = {
                    labels: ['Ativos', 'Inativos'],
                    datasets: [{
                        data: [resumo.ativos, resumo.inativos],
                        backgroundColor: ['#8806B0', '#451B5A'],
                        borderWidth: 1
                    }]
                };
                setDadosGrafico(dadosFormatados);
            })
            .catch(error => {
                console.error("Erro ao buscar dados do gráfico:", error);
            });
    }, []);

    // configurações do gráfico
    const options = {
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem) {
                        const valor = tooltipItem.raw;
                        return `Valor: ${valor}`;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    // Exibição enquanto os dados não carregam
    if (!dadosGrafico) {
        return (
            <section aria-busy="true">
                <p>Carregando gráfico...</p>
            </section>
        );
    }

    return (
        <section className="graficoPizza" role="img" aria-label="Gráfico de pizza com sensores ativos e inativos" style={{ width: '300px', height: '300px' }}>
            <Pie data={dadosGrafico} options={options} />
        </section>
    );
};

export default GraficoPizza;
