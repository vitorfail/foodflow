// app/components/Widget.tsx - CORRIGIDO
import type { ReactNode } from 'react';

interface WidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode; // ✅ Aceita qualquer conteúdo
  className?: string;
}

export function Widget({ title, subtitle, children, className = '' }: WidgetProps) {
  return (
    <div className={`widget ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button className="text-gray-400 hover:text-gray-600">⚙️</button>
      </div>
      
      {/* children pode ser QUALQUER coisa */}
      {children}
    </div>
  );
}