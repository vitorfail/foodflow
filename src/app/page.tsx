'use client'

import { Header } from './_components/Header'
import { MetricCard } from './_components/MetricCard'
import { Sidebar } from './_components/Sidebar'
import { Widget } from './_components/Widget'
import { GraficoColunas } from './_components/charts/GraficoColunas'
import { HorariosdePico } from './_components/charts/HorariosdePico'
import { GraficoPizza } from './_components/charts/GraficoPizza'
import { GraficoColunasGenero } from './_components/charts/GraficoColunasGenero'
import { api } from "~/trpc/react"
import { useEffect, useState } from 'react'
import { useFilter } from './context/filterContext'
import React from 'react'


export default function Home() {
  //Context
  const { startDate, endDate, loja_id, setStartDate, setEndDate, setLojaId } = useFilter()

  const [calendario, setCalendario] = useState(false);
  const [loja, setLoja] = useState<number>(1)

  const [isDragOver, setIsDragOver] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const widgetComponents = {
    'chart-bar': GraficoColunas,
    'chart-line': HorariosdePico, 
    'chart-pizza': GraficoPizza,
    'chart gender': GraficoColunasGenero,
    'top-products': GraficoColunas, // ou o componente que você quiser
  }

  const [widgets, setWidgets] = useState([
    { 
      id: 1, 
      type: 'faturamento-canal', 
      title: "Faturamento por Canal", 
      component: GraficoColunas 
    },
    { 
      id: 2, 
      type: 'top-produtos', 
      title: "Top 5 Produtos", 
      component: HorariosdePico
    }

  ])
  const getWidgetComponent = (type: string) => {
    return widgetComponents[type as keyof typeof widgetComponents] || null
  }

  // Função para obter o título baseado no tipo
  const getWidgetTitle = (type: string) => {
    const titles: Record<string, string> = {
      'chart-bar': 'Gráfico de Linha',
      'chart-line': 'Gráfico de Barras',
      'chart-pizza': 'Métrica Simples',
      'table': 'Tabela de Dados',
      'top-products': 'Top Produtos'
    }
    return titles[type] || 'Novo Widget'
  }
  const handleDragOver_r = (e: React.DragEvent, index?: number) => {
    e.preventDefault()
    setDragOverIndex(index ?? null)
  }

  const handleDragLeave_r = (e: React.DragEvent) => {
    e.preventDefault()
    // Só remove o indicador se o mouse saiu completamente da área do relatório
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null)
    }
  }

  const handleDrop_r = (e: React.DragEvent, index?: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    
    const widgetType = e.dataTransfer.getData('widget-type')
    
    if (widgetType && typeof index === 'number') {
      console.log(`Widget ${widgetType} dropped at position: ${index}`)
      
      const Component = getWidgetComponent(widgetType)
      
      if (Component) {
        const newWidget = {
          id: Date.now(),
          type: widgetType,
          title: getWidgetTitle(widgetType),
          component: Component
        }
        
        const newWidgets = [...widgets]
        newWidgets.splice(index, 0, newWidget)
        setWidgets(newWidgets)
        
        // Chama a callback se existir
      }
    }
  }
  //Para debug
  useEffect(() => {
  }, [])

  // UseQuery deve ficar no nível do componente, não dentro de funções
  const { data:ticketData, isLoading, error } = api.ticket.getAverageTicketByStoreAndDate.useQuery({
    startDate: startDate!,
    endDate: endDate!,
    loja_id:loja_id!
  }, {
    enabled: !!startDate && !!endDate, // Só executa quando as datas estão definidas
  })
  const { data:produtos_complain, isLoading:isloading_produtos, error:error_produtos } = api.produtos_complain.getPrdutosComplain.useQuery({
    startDate: startDate!,
    endDate: endDate!,
    loja_id:loja_id!
  }, {
    enabled: !!startDate && !!endDate, // Só executa quando as datas estão definidas
  })
  const{data:pegarLojas} = api.lojas.getStores.useQuery()
  const ticket = ticketData?.[0]?.ticket_medio ?? 0
  const produto_mais_vendidos = produtos_complain?.[0]?.produto?? ""
  const organizar_produtos = produtos_complain?.sort((a, b) => 
      Number(b.total_vendas) - Number(a.total_vendas),
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
      calendario={calendario}
      setCalendario={setCalendario}
      lojas={pegarLojas|| []}
      Store={loja} 
      setLoja={setLoja}/>

      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Olá"
            value=""
            subtitle=""
            trend={{ value: "", isPositive: true }}
          />

          <MetricCard
            title="Ticket Médio"
            value={ticket? "R$"+ticket: "Carregando..."}
            subtitle="+R$ 2,30 vs semana passada"
          />
          <MetricCard
            title="Produto Top"
            value={produto_mais_vendidos||"Carregando..."}
            subtitle={String(produtos_complain?.[0]?.quantidade_total?? 0)+ " Vendidas no período"}
          />
          <MetricCard
            title="Produto Rentável"
            value={organizar_produtos?.[0]?.produto||"Carregando..."}
            subtitle={String(organizar_produtos?.[0]?.total_vendas?? 0)+ " Receita no período"}
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
  id="relatorio"
  onDragOver={(e) => handleDragOver_r(e)}
  onDragLeave={handleDragLeave_r}
  className="grid grid-cols-1 gap-6 relative"
>
  {widgets.map((widget, index) => {
    const WidgetComponent = widget.component
    
    return (
      <React.Fragment key={widget.id}>
        {/* Indicador de drop entre widgets */}
        {dragOverIndex === index && (
          <div className="h-1 bg-orange-500 rounded-full my-2 mx-4 transition-all duration-200" />
        )}
        
        {/* Widget existente */}
        <div
          onDragOver={(e) => handleDragOver_r(e, index)}
          onDrop={(e) => handleDrop_r(e, index)}
          className={`transition-all duration-200 ${
            dragOverIndex === index ? 'opacity-50' : ''
          }`}
        >
          <Widget title={widget.title} subtitle="...">
            <WidgetComponent />
          </Widget>
        </div>
      </React.Fragment>
    )
  })}
  
  {/* Indicador de drop no final */}
  {dragOverIndex === widgets.length && (
    <div className="h-1 bg-orange-500 rounded-full my-2 mx-4 transition-all duration-200" />
  )}
  
  {/* Área vazia para drop no final */}
  <div
    onDragOver={(e) => handleDragOver_r(e, widgets.length)}
    onDrop={(e) => handleDrop_r(e, widgets.length)}
    className="min-h-20 rounded-lg border-2 border-dashed border-gray-300 transition-all duration-200"
  />
</div> 
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}