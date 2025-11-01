'use client'

import { useEffect, useState } from "react";

type HeaderProps = {
  onTicketMedioChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  calendario: boolean;                               // ← Recebe o valor
  setCalendario: React.Dispatch<React.SetStateAction<boolean>>;
};
export function Header({onTicketMedioChange}: HeaderProps) {
  const [dia_index1, setdia_index1] = useState(1)
  const [demais_dias_index1, setdemais_dias_index1] = useState(31)
  const [dias_do_mes1,setDias_do_mes1] = useState(1)
    const mes_formatacao1 = (ano: string, mes: string) => {
      const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
      var checar_dias =  new Date(parseInt(ano), parseInt(mes), 0).getDate();
      setdia_index1(data.getDay());
      setdemais_dias_index1(31 - data.getDay());
      setDias_do_mes1(checar_dias) // Use o valor calculado, não o state
    };
  // Use useEffect para executar apenas uma vez
  useEffect(() => {

    mes_formatacao1("2025", "08");
  }, []); // ← Array vazio = executa apenas uma vez

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="absolute w-[30%] h-[300px] bg-white shadow-lg right-3.5 flex justify-between align-middle">
        <div className="w-[45%] h-full">
          <div className="bg-white rounded-lg shadow-md p-6 h-full w-full">
            <div className="w-full flex justify-between">
                <select>
                  <option value={"Janeiro"}>Janeiro</option>
                  <option value={"Fevereiro"}>Fevereiro</option>
                  <option value={"Março"}>Março</option>
                  <option value={"Abril"}>Abril</option>
                  <option value={"Maio"}>Maio</option>
                  <option value={"Junho"}>Junho</option>
                  <option value={"Julho"}>Julho</option>
                  <option value={"Agosto"}>Agosto</option>
                  <option value={"Setembro"}>Setembro</option>
                  <option value={"Outubro"}>Outubro</option>
                  <option value={"Novembro"}>Novembro</option>
                  <option value={"Dezembro"}>Dezembro</option>
                </select>
                  <select>
                  <option>Janeiro</option>
                  <option>Fevereiro</option>
                  <option>Março</option>
                  <option>Abril</option>
                  <option>Maio</option>
                  <option>Junho</option>
                  <option>Julho</option>
                  <option>Agosto</option>
                  <option>Setembro</option>
                  <option>Outubro</option>
                  <option>Novembro</option>
                  <option>Dezembro</option>
                </select>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="text-center font-semibold text-gray-600 py-2">Dom</div>
              <div className="text-center font-semibold text-gray-600 py-2">Seg</div>
              <div className="text-center font-semibold text-gray-600 py-2">Ter</div>
              <div className="text-center font-semibold text-gray-600 py-2">Qua</div>
              <div className="text-center font-semibold text-gray-600 py-2">Qui</div>
              <div className="text-center font-semibold text-gray-600 py-2">Sex</div>
              <div className="text-center font-semibold text-gray-600 py-2">Sáb</div>
            </div>

            <div className="grid grid-cols-7 grid-rows-5 gap-2">
              {/* Células vazias - exemplo: começando na QUINTA (índice 4) */}
              {Array.from({ length: dia_index1 }).map((_, index) => (
                <div className="aspect-square bg-transparent rounded-lg"></div>
              ))}
              
              {/* Dias do mês */}
              {Array.from({ length: dias_do_mes1 }).map((_, index) => (
                <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer">
                  <span className="text-sm text-gray-600">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg" />
            <h1 className="text-xl font-bold text-gray-900">FoodFlow</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <select onChange={onTicketMedioChange} className="border rounded-lg px-3 py-2 text-sm">
              <option value={7} >Últimos 7 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={"mes"}>Este mês</option>
              <option value={"person"}>Personalizado</option>
            </select>
            
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>Todas as lojas</option>
              <option>Loja Centro</option>
              <option>Loja Shopping</option>
            </select>
            
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
              + Novo Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}