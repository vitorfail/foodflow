'use client'

import { Pie } from 'react-chartjs-2'
import { useFilter } from '~/app/context/filterContext'
import React from 'react'
import { api } from '~/trpc/react'
import BorderBox from '../BorderBox'
import CarregarChart from '../CarrgarChar'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export function GraficoPizza() {
  const { startDate, endDate, loja_id, formatarData } = useFilter()
  
  const { data: tiposPagamento, isLoading, error } = api.pagamentoTipo.getTiposdepagamemnto.useQuery({
    startDate: startDate!,
    endDate: endDate!,
    loja_id: loja_id!
  }, {
    enabled: !!startDate && !!endDate,
  })

  React.useEffect(() => {
    if (startDate && endDate) {
      // Lógica adicional se necessário
    }
  }, [startDate, endDate, loja_id])

  const safeNumber = (value: any): number => {
    if (typeof value === 'bigint') {
      return Number(value)
    }
    return Number(value) || 0
  }

  // Preparar dados para o gráfico de pizza
  const labels = tiposPagamento?.map((item) => item.description) ?? []
  const valores = tiposPagamento?.map((item) => safeNumber(item.total_value)) ?? []

  const backgroundColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
  ]

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Valor Total (R$)',
        data: valores,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },title: {
        display: true,
        text: `Faturamento Por Meio de Pagamento ${startDate && endDate ? `(${formatarData(startDate)} à ${formatarData(endDate)})` : ''}${loja_id ? ` - Loja ${loja_id}` : ''}`,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
          }
        }
      },
    },
  }


  return (
    <BorderBox>
      <CarregarChart loading={isLoading} error={error}></CarregarChart>
      <Pie className='h-full' data={data} options={options} />
    </BorderBox>
  )
}