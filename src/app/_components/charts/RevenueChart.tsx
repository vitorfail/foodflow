'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const data = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Balcão',
      data: [1200, 1100, 1400, 1300, 1800, 2200, 1900],
      backgroundColor: '#f97316',
    },
    {
      label: 'iFood',
      data: [800, 900, 950, 1000, 1500, 1800, 1600],
      backgroundColor: '#ef4444',
    },
    {
      label: 'App Próprio',
      data: [300, 400, 350, 500, 600, 700, 650],
      backgroundColor: '#3b82f6',
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

export function RevenueChart() {
  return <Bar data={data} options={options} />
}