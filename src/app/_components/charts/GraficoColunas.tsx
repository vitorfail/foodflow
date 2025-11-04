'use client'

import { Bar } from 'react-chartjs-2'
import { useFilter } from '~/app/context/filterContext'
import { api } from '~/trpc/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import React from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Função para converter BigInt para Number de forma segura
const safeNumber = (value: any): number => {
  if (typeof value === 'bigint') {
    return Number(value)
  }
  return Number(value) || 0
}

export function GraficoColunas() {
  // Usando o contexto para acessar as variáveis de filtro
  const { startDate, endDate, loja_id, formatarData } = useFilter()
  const { data: canais, isLoading, error } = api.grafico_de_colunas.getGraficoColunas.useQuery({
    startDate: startDate!,
    endDate: endDate!,
    loja_id: loja_id!
  }, {
    enabled: !!startDate && !!endDate, // Só executa quando as datas estão definidas
  })
  React.useEffect(() => {
    if (startDate && endDate) {
    
    }
  }, [startDate, endDate, loja_id])
  // Dados convertendo BigInt para Number
  const channelData = {
    labels: canais?.map(item => item.canal),
    datasets: [
      {
        label: 'Total de Vendas',
        data: canais?.map(item => safeNumber(item.total_vendas)),
        backgroundColor: '#3b82f6',
        yAxisID: 'y',
        order: 3,
      },
      {
        label: 'Faturamento (R$)',
        data: canais?.map(item => safeNumber(item.faturamento_total)),
        backgroundColor: '#10b981',
        yAxisID: 'y1',
        order: 2,
      },
      {
        label: 'Ticket Médio (R$)',
        data: canais?.map(item => safeNumber(item.ticket_medio)),
        backgroundColor: '#f59e0b',
        yAxisID: 'y2',
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Esta é a chave para ocupar 100% da largura
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Desempenho por Canal de Vendas ${startDate && endDate ? `(${formatarData(startDate)} à ${formatarData(endDate)})` : ''}${loja_id ? ` - Loja ${loja_id}` : ''}`,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Faturamento (R$)' || context.dataset.label === 'Ticket Médio (R$)') {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y + ' vendas';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Canais de Venda'
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Total de Vendas'
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Faturamento (R$)'
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      },
      y2: {
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
        beginAtZero: true,
      },
    },
  };

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar dados: {error.message}</div>

  return (
    <div style={{ width: '100%', height: '400px' }}> {/* Container com altura fixa */}
      <Bar data={channelData} options={options} />
    </div>
  )
}