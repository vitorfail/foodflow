'use client'

import { Header } from './_components/Header'
import { MetricCard } from './_components/MetricCard'
import { Sidebar } from './_components/Sidebar'
import { Widget } from './_components/Widget'
import { RevenueChart } from './_components/charts/RevenueChart'
import { PeakHoursChart } from './_components/charts/PeakHoursChart'
import { api } from "~/trpc/react"
import { useEffect, useState } from 'react'


export default function Home() {
  const [calendario, setCalendario] = useState(false);
  const [data_person1, setData_person1] = useState<string>("");
  const [data_person2, setData_person2] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>('') // Estado para controlar o range selecionado
  const [queryDates, setQueryDates] = useState<{ startDate?: string; endDate?: string }>({})


  //Para debug
  useEffect(() => {
  console.log("Data1 atualizada:", data_person1)
    console.log("Data2 atualizada:", data_person2)

}, [data_person1,data_person2])

  // UseQuery deve ficar no nível do componente, não dentro de funções
  const { data, isLoading, error } = api.ticket.getAverageTicketByStoreAndDate.useQuery({
    startDate: queryDates.startDate!,
    endDate: queryDates.endDate!,
  }, {
    enabled: !!queryDates.startDate && !!queryDates.endDate, // Só executa quando as datas estão definidas
  })
  console.log(data)
  const ticket = data?.[0]?.ticket_medio ?? 0
  const formatarDataDB = (date: Date): string => {
      const ano = date.getFullYear();
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const dia = String(date.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
  };
  const consulta_personalizada = (startDate?: string, endDate?: string) =>{
    setQueryDates({ startDate, endDate })
    console.log("Buscando ticket médio:", { startDate, endDate })

    return true
  }
  const ticektMedioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setDateRange(selectedValue) // Atualiza o estado do range

    let startDate: string
    let endDate: string

    if (selectedValue === '7') {
      const hoje = new Date()
      const seteDiasAtras = new Date()
      seteDiasAtras.setDate(hoje.getDate() - 7)

      startDate = formatarDataDB(seteDiasAtras)
      endDate = formatarDataDB(hoje)
      setQueryDates({ startDate, endDate })
      console.log("Buscando ticket médio:", { startDate, endDate })

    }if (selectedValue === "30") {
      const hoje = new Date()
      const trintaDiasAtras = new Date()
      trintaDiasAtras.setDate(hoje.getDate() - 30)

      startDate = formatarDataDB(trintaDiasAtras)
      endDate = formatarDataDB(hoje)
      setQueryDates({ startDate, endDate })
      console.log("Buscando ticket médio:", { startDate, endDate })

    } 
    if(selectedValue === "mes"){
      const hoje = new Date()
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

      startDate = formatarDataDB(primeiroDiaMes)
      endDate = formatarDataDB(hoje)
      setQueryDates({ startDate, endDate })
      console.log("Buscando ticket médio:", { startDate, endDate })    
    }
    if(selectedValue === "person"){
      setCalendario(true)    
    }

    // Atualiza o estado para disparar a query
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const widgetType = e.dataTransfer.getData('widget-type')
    console.log('Adicionando widget:', widgetType)
    // Aqui você implementaria a lógica para adicionar o widget
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
      consultaPerso={consulta_personalizada}
      setData1={setData_person1}
      setData2={setData_person2}
      calendario={calendario}
      setCalendario={setCalendario}
      onTicketMedioChange={ticektMedioChange} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Faturamento Hoje"
            value="R$ 8.247"
            subtitle="vs ontem"
            trend={{ value: "↑ 12%", isPositive: true }}
          />
          <MetricCard
            title="Pedidos Ativos"
            value="24"
            subtitle="5 delivery • 19 balcão"
          />
          <MetricCard
            title="Ticket Médio"
            value={"R$"+ticket}
            subtitle="+R$ 2,30 vs semana passada"
          />
          <MetricCard
            title="Produto Top"
            value="Pizza Margherita"
            subtitle="48 vendas hoje"
          />
        </div>

        <div className="flex space-x-6">
          <Sidebar />
          
          {/* Área do Dashboard */}
          <div className="flex-1">
            <div className="widget mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Meu Dashboard Principal</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Compartilhar
                  </button>
                  <button className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors">
                    Salvar
                  </button>
                </div>
              </div>

              {/* Grid de Widgets */}
              <div 
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {/* Widget 1: Faturamento por Canal */}
                <Widget 
                  title="Faturamento por Canal" 
                  subtitle="Comparativo últimos 7 dias"
                  className="lg:col-span-2"
                >
                  <div className="h-64">
                    <RevenueChart />
                  </div>
                </Widget>

                {/* Widget 2: Top 5 Produtos */}
                <Widget title="Top 5 Produtos" subtitle="Mais vendidos hoje">
                  <div className="space-y-3">
                    {[
                      { name: 'Pizza Margherita', value: 48 },
                      { name: 'Hamburguer Artesanal', value: 32 },
                      { name: 'Coca-Cola 2L', value: 28 },
                      { name: 'Brownie com Sorvete', value: 19 },
                      { name: 'Salada Caesar', value: 15 },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{index + 1}. {item.name}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Widget>

                {/* Widget 3: Horários de Pico */}
                <Widget title="Horários de Pico" subtitle="Média de pedidos por hora">
                  <div className="h-48">
                    <PeakHoursChart />
                  </div>
                </Widget>

                {/* Widget 4: Performance de Entrega */}
                <Widget 
                  title="Performance de Entrega" 
                  subtitle="Comparativo de plataformas"
                  className="lg:col-span-2"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">38 min</div>
                      <div className="text-sm text-gray-600">Tempo Médio</div>
                      <div className="text-xs text-green-500">↓ 5 min</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.8★</div>
                      <div className="text-sm text-gray-600">Avaliação iFood</div>
                      <div className="text-xs text-green-500">↑ 0.2</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <div className="text-sm text-gray-600">Entregas no Prazo</div>
                      <div className="text-xs text-green-500">↑ 3%</div>
                    </div>
                  </div>
                </Widget>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}