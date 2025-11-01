interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function MetricCard({ title, value, subtitle, trend }: MetricCardProps) {
  return (
    <div className="widget">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-gray-500">{subtitle}</span>
        {trend && (
          <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}