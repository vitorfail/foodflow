'use client'

import { Line } from 'react-chartjs-2'
import { useFilter } from '~/app/context/filterContext'
import React from 'react'
import { api } from '~/trpc/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function HorariosdePico() {
    const { startDate, endDate, loja_id, formatarData } = useFilter()
    const { data: horarios, isLoading, error } = api.horarios_faturamento.gethorariosPico.useQuery({
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



  const safeNumber = (value: any): number => {
  if (typeof value === 'bigint') {
    return Number(value)
  }
  return Number(value) || 0
}

  // Mapeia os dados para o gráfico, garantindo tratamento seguro
  const dadosGrafico = horarios?.map((item) => safeNumber(item.total_vendas)) ?? []
  
  // Se você quiser usar as horas reais dos dados em vez de labels fixos
  const labelsHorarios = horarios?.map((item) => `${item.hora}h`) ?? ['10h', '12h', '14h', '16h', '18h', '20h', '22h']
  
  const data = {
    labels: labelsHorarios,
    datasets: [
      {
        label: 'Pedidos por Hora',
        data: dadosGrafico,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar dados</div>

  return <Line data={data} options={options} />
}