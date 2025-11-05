'use client'

import { Bar } from 'react-chartjs-2'
import { useFilter } from '~/app/context/filterContext'
import { api } from '~/trpc/react'
import BorderBox from '../BorderBox'
import CarregarChart from '../CarrgarChar'
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

export function GraficoColunasGenero() {
  // Usando o contexto para acessar as variáveis de filtro
  const { startDate, endDate, loja_id, formatarData } = useFilter()
  const { data: generos, isLoading, error } = api.ConsumoGenero.getGeneroconsumo.useQuery({
    startDate: startDate!,
    endDate: endDate!,
    loja_id: loja_id!
  }, {
    enabled: !!startDate && !!endDate, // Só executa quando as datas estão definidas
  })
  
  React.useEffect(() => {
    if (startDate && endDate) {
      // Efeito para recarregar dados quando as datas mudam
    }
  }, [startDate, endDate, loja_id])
  
  // Dados convertendo BigInt para Number
  const generoData = {
    labels: generos?.map(item => item.genero),
    datasets: [
      {
        label: 'Total de Clientes',
        data: generos?.map(item => safeNumber(item.total_clientes)),
        backgroundColor: '#4c00c5',
        yAxisID: 'y',
        order: 2,
      },
      {
        label: 'Ticket Médio (R$)',
        data: generos?.map(item => safeNumber(item.ticket_medio)),
        backgroundColor: '#ffcbdb',
        yAxisID: 'y1',
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
        text: `Desempenho por Gênero ${startDate && endDate ? `(${formatarData(startDate)} à ${formatarData(endDate)})` : ''}${loja_id ? ` - Loja ${loja_id}` : ''}`,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Ticket Médio (R$)') {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y.toLocaleString('pt-BR') + ' clientes';
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
          text: 'Gêneros'
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Total de Clientes'
        },
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString('pt-BR');
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Ticket Médio (R$)'
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
    },
  };

  return (
    <BorderBox>
      <CarregarChart loading={isLoading} error={error}></CarregarChart>
      <Bar data={generoData} options={options} />
    </BorderBox>
  )
}