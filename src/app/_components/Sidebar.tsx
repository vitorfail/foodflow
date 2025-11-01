'use client'

const draggableWidgets = [
  { type: 'chart-line', label: '📈 Gráfico de Linha' },
  { type: 'chart-bar', label: '📊 Gráfico de Barras' },
  { type: 'metric', label: '🔢 Métrica Simples' },
  { type: 'table', label: '📋 Tabela de Dados' },
  { type: 'top-products', label: '🍕 Top Produtos' },
]

const templates = [
  { label: '🚀 Análise de Delivery' },
  { label: '⏰ Horários de Pico' },
  { label: '📋 Performance do Cardápio' },
]

export function Sidebar() {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('widget-type', type)
  }

  return (
    <div className="w-64 flex-shrink-0 space-y-6">
      {/* Widgets Disponíveis */}
      <div className="widget">
        <h3 className="font-semibold text-gray-900 mb-3">Adicionar Widget</h3>
        <div className="space-y-2">
          {draggableWidgets.map((widget) => (
            <div
              key={widget.type}
              draggable
              onDragStart={(e) => handleDragStart(e, widget.type)}
              className="draggable p-3 border-2 border-dashed border-gray-200 rounded-lg text-sm cursor-move hover:border-orange-300"
            >
              {widget.label}
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="widget">
        <h3 className="font-semibold text-gray-900 mb-3">Templates</h3>
        <div className="space-y-2">
          {templates.map((template, index) => (
            <button
              key={index}
              className="w-full text-left p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}