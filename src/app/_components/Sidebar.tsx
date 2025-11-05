'use client'

const draggableWidgets = [
  { type: 'chart-bar', label: '📊 Gráfico de Coluna' },
  { type: 'chart-line', label: '📈 Gráfico de Barras' },
  { type: 'chart-pizza', label: '🍕 Pizza' },
  { type: 'table', label: '📋 Tabela de Dados' },
  { type: 'top-products', label: '🍕 Top Produtos' },
]

interface SidebarProps {
  onWidgetAdd?: (widgetType: string) => void;
}

export function Sidebar({ onWidgetAdd }: SidebarProps) {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('widget-type', type)
    e.dataTransfer.setData('text/plain', type) // Para alguns browsers
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
              className="draggable p-3 border-2 border-dashed border-gray-200 rounded-lg text-sm cursor-move hover:border-orange-300 transition-colors"
            >
              {widget.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}