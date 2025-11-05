'use client'
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface FilterContextType {
  startDate: string | null
  endDate: string | null
  loja_id: number | null
  setStartDate: (date: string | null) => void
  setEndDate: (date: string | null) => void
  setLojaId: (id: number | null) => void
  formatarData: (date: Date | string | null) => string | null 
  clearFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

interface FilterProviderProps {
  children: ReactNode
}

// Corrigindo a função para aceitar null e retornar null quando a data for null
function formatarData(date: Date | string | null): string | null {
  // Se a data for null, retorna null
  if (date === null) {
    return null;
  }
  
  let data: Date;
  
  // Se for string, converte para Date
  if (typeof date === 'string') {
    data = new Date(date);
    
    // Se a string já estiver no formato YYYY-MM-DD, retorna diretamente
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
  } else {
    data = date;
  }
  
  // Verifica se a data é válida
  if (isNaN(data.getTime())) {
    throw new Error('Data inválida fornecida para formatação');
  }
  
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
}

function getDataXDiasAtras(diasAtras: number): string {
  const data = new Date();
  data.setDate(data.getDate() - diasAtras);
  
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
}

export function FilterProvider({ children }: FilterProviderProps) {
  function getDataAtualFormatada(): string {
    const hoje = new Date();
    const offset = hoje.getTimezoneOffset() * 60000;
    const dataLocal = new Date(hoje.getTime() - offset);
    
    const dataFormatada = dataLocal.toISOString().split('T')[0];
    
    if (!dataFormatada) {
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const dia = String(hoje.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    }
    
    return dataFormatada;
  }

  const defaultEndDate = getDataAtualFormatada()
  const defaultStartDate = getDataXDiasAtras(7);

  const [startDate, setStartDate] = useState<string | null>(defaultStartDate)
  const [endDate, setEndDate] = useState<string | null>(defaultEndDate)
  const [loja_id, setLojaId] = useState<number | null>(null)

  const clearFilters = () => {
    setStartDate(defaultStartDate)
    setEndDate(defaultEndDate)
    setLojaId(62)
  }

  return (
    <FilterContext.Provider
      value={{
        startDate,
        endDate,
        loja_id,
        setStartDate,
        setEndDate,
        setLojaId,
        formatarData,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}