'use client'

import { useEffect, useState, useMemo} from "react";
import { useFilter } from "../context/filterContext";

type LojasStore = {
  store_id: number;
  store_name: string;
};

type HeaderProps = {
  calendario: boolean;
  Store:number;
  setLoja: React.Dispatch<React.SetStateAction<number>>;                              
  setCalendario: React.Dispatch<React.SetStateAction<boolean>>;
  lojas:LojasStore[]
};
export function Header({ calendario, setCalendario,lojas}: HeaderProps) {
  //Context
  const { startDate, endDate, loja_id, setStartDate, setEndDate, setLojaId,formatarData } = useFilter()
  //Dias do calendário
  const [dia_calendario1, setdiacalendario1] = useState<string>("");
  const [dia_calendario2, setdiacalendario2] = useState<string>("");
  //Verificador de clicks
  const [intervalo, setIntervalo] = useState<boolean>(false)
  //Indexadoras  dos lado esquerdo
  const [dia_index1, setdia_index1] = useState(1)
  const [ano_index1, setano_index1] = useState("2025")
  const [mes_index1, setMes_index1] = useState("01")
  //Indexadores do lado direito
  const [dia_index2, setdia_index2] = useState(1)
  const [ano_index2, setano_index2] = useState("2025")
  const [mes_index2, setMes_index2] = useState("01")
  //Conjuntos de anos do select
  const [anos, setAnos] = useState<number[]>([2001, 2003])
  //Ordem dos dias do calendário 1
  const [demais_dias_index1, setdemais_dias_index1] = useState(31)
  const [dias_do_mes1,setDias_do_mes1] = useState(1)
  //Ordem dos dias do calendário 2
  const [demais_dias_index2, setdemais_dias_index2] = useState(31)
  const [dias_do_mes2,setDias_do_mes2] = useState(1)


  const [searchTerm, setSearchTerm] = useState('');
    // Filtra as lojas baseado no termo de pesquisa
  const lojasFiltradas = useMemo(() => {
    if (!searchTerm) return lojas;
    return lojas.filter(loja => 
      loja.store_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lojas, searchTerm]);

  const mes_formatacao = (ano: string, mes: string, lado:number) => {
    const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    if(lado==1){
      setano_index1(ano)
      var checar_dias =  new Date(parseInt(ano), parseInt(mes), 0).getDate();
      setdia_index1(data.getDay());
      setdemais_dias_index1(31 - data.getDay());
      setDias_do_mes1(checar_dias)
      setdiacalendario1("")
      setMes_index1(mes)
      setdiacalendario2("")
      setIntervalo(false)
    }
    else{
      setano_index2(ano)
      var checar_dias =  new Date(parseInt(ano), parseInt(mes), 0).getDate();
      setdia_index2(data.getDay());
      setdemais_dias_index2(31 - data.getDay());
      setDias_do_mes2(checar_dias)
      setdiacalendario1("")
      setdiacalendario2("")
      setMes_index2(mes)
      setIntervalo(false)

    }
    // Use o valor calculado, não o state
  };
  const switchIntervalo = (e:string) =>{
    if(!intervalo && dia_calendario1 == "" && dia_calendario2==""){
      setIntervalo(true)
      setdiacalendario1(e)
    }
    if(intervalo && dia_calendario1 !== "" && dia_calendario2==""){
      setdiacalendario2(e)
    }
    if(intervalo && dia_calendario1 !== "" && dia_calendario2 !==""){
      setdiacalendario1(e)
      setdiacalendario2("")
    }
  }
  const aplicar = () => {
    let dataFinal1 = ""
    let dataFinal2 = ""

    if(dia_calendario1.includes("A") && dia_calendario2.includes("A")){
      var dia_formatado1 = parseInt(dia_calendario1.replace("-A", ""))
      var dia_formatado2 = parseInt(dia_calendario2.replace("-A", ""))
      
      if(dia_formatado1 > dia_formatado2){
        dataFinal1 = `${ano_index1}-${mes_index1}-${dia_formatado2.toString().padStart(2, '0')}`
        dataFinal2 = `${ano_index1}-${mes_index1}-${dia_formatado1.toString().padStart(2, '0')}`
      } else {
        dataFinal1 = `${ano_index1}-${mes_index1}-${dia_formatado1.toString().padStart(2, '0')}`
        dataFinal2 = `${ano_index1}-${mes_index1}-${dia_formatado2.toString().padStart(2, '0')}`
      }
    } 
    else if(dia_calendario1.includes("B") && dia_calendario2.includes("B")){
      var dia_formatado1 = parseInt(dia_calendario1.replace("-B", ""))
      var dia_formatado2 = parseInt(dia_calendario2.replace("-B", "")) 
      
      if(dia_formatado1 > dia_formatado2){
        dataFinal1 = `${ano_index2}-${mes_index2}-${dia_formatado2.toString().padStart(2, '0')}`
        dataFinal2 = `${ano_index2}-${mes_index2}-${dia_formatado1.toString().padStart(2, '0')}`
      } else {
        dataFinal1 = `${ano_index2}-${mes_index2}-${dia_formatado1.toString().padStart(2, '0')}`
        dataFinal2 = `${ano_index2}-${mes_index2}-${dia_formatado2.toString().padStart(2, '0')}`
      }
    }
    else {
      var data_a = ""
      var data_b = ""
      
      if(dia_calendario1.includes("A")){
        data_a = dia_calendario1.replace("-A", "").padStart(2, '0')
        data_b = dia_calendario2.replace("-B", "").padStart(2, '0')
        
        var data_teste_formato = new Date(`${ano_index1}-${mes_index1}-${data_a}`)
        var data_teste_formato2 = new Date(`${ano_index2}-${mes_index2}-${data_b}`)
        
        if(data_teste_formato < data_teste_formato2){
          dataFinal1 = `${ano_index1}-${mes_index1}-${data_a}`
          dataFinal2 = `${ano_index2}-${mes_index2}-${data_b}`
        } else {
          dataFinal1 = `${ano_index2}-${mes_index2}-${data_b}`
          dataFinal2 = `${ano_index1}-${mes_index1}-${data_a}`
        }
      } else {
        data_a = dia_calendario2.replace("-A", "").padStart(2, '0')
        data_b = dia_calendario1.replace("-B", "").padStart(2, '0')
        
        var data_teste_formato = new Date(`${ano_index1}-${mes_index1}-${data_a}`)
        var data_teste_formato2 = new Date(`${ano_index2}-${mes_index2}-${data_b}`)
        
        if(data_teste_formato < data_teste_formato2){
          dataFinal1 = `${ano_index1}-${mes_index1}-${data_a}`
          dataFinal2 = `${ano_index2}-${mes_index2}-${data_b}`
        } else {
          dataFinal1 = `${ano_index2}-${mes_index2}-${data_b}`
          dataFinal2 = `${ano_index1}-${mes_index1}-${data_a}`
        }
      }
    }

    console.log("Datas definidas:", { dataFinal1, dataFinal2 })

    // Primeiro atualiza os estados
    setStartDate(dataFinal1)
    setEndDate(dataFinal2)
    setCalendario(false)
  }
  const ticektMedioChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value
  
      let startDate: string | null
      let endDate: string | null
  
      if (selectedValue === '7') {
        const hoje = new Date()
        const seteDiasAtras = new Date()
        seteDiasAtras.setDate(hoje.getDate() - 7)
  
        setStartDate(formatarData(seteDiasAtras))
        setEndDate(formatarData(hoje))
  
      }if (selectedValue === "30") {
        const hoje = new Date()
        const trintaDiasAtras = new Date()
        trintaDiasAtras.setDate(hoje.getDate() - 30)
  
        setStartDate(formatarData(trintaDiasAtras))
        setEndDate(formatarData(hoje))
      } 
      if(selectedValue === "mes"){
        const hoje = new Date()
        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  
        setStartDate(formatarData(primeiroDiaMes))
        setEndDate(formatarData(hoje))
      }
      if(selectedValue === "person"){
        setCalendario(true)    
      }
  
      // Atualiza o estado para disparar a query
  };
  // Use useEffect para executar apenas uma vez
  useEffect(() => {
    var hoje = new Date().getFullYear()+1;
    var array_anos = []
    for(var i=2001; hoje>i;i++ ){
      array_anos.push(i)
    }
    setAnos(array_anos)
    mes_formatacao("2025", "11",1);
    mes_formatacao("2025", "11",2);
  }, []); 
  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className={`absolute w-fit h-fit top-18 z-10 py-1.5 px-3.5 bg-white shadow-lg right-3.5 ${calendario? "flex flex-col" :"hidden"}  justify-between align-middle`}>
        <div className="flex w-fit h-fit">
          <div className="w-fit h-fit ">
            <div className="bg-white rounded-lg shadow-md p-6 h-[380px] w-[350px]">
              <div className="w-full flex justify-between">
                  <select value={mes_index1} onChange={(e) => mes_formatacao(ano_index1, e.target.value,1)}>
                    <option value={"01"}>Janeiro</option>
                    <option value={"02"}>Fevereiro</option>
                    <option value={"03"}>Março</option>
                    <option value={"04"}>Abril</option>
                    <option value={"05"}>Maio</option>
                    <option value={"06"}>Junho</option>
                    <option value={"07"}>Julho</option>
                    <option value={"08"}>Agosto</option>
                    <option value={"09"}>Setembro</option>
                    <option value={"10"}>Outubro</option>
                    <option value={"11"}>Novembro</option>
                    <option value={"12"}>Dezembro</option>
                  </select>
                  <select value={ano_index1} onChange={(e) => mes_formatacao(e.target.value, String(dia_index1), 1)}>
                    {
                      anos?.map((v, index) =>(
                        <option key={index} value={v}>{v}</option>
                      ))
                    }
                  </select>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="text-center font-semibold text-gray-600 py-1">Dom</div>
                <div className="text-center font-semibold text-gray-600 py-1">Seg</div>
                <div className="text-center font-semibold text-gray-600 py-1">Ter</div>
                <div className="text-center font-semibold text-gray-600 py-1">Qua</div>
                <div className="text-center font-semibold text-gray-600 py-1">Qui</div>
                <div className="text-center font-semibold text-gray-600 py-1">Sex</div>
                <div className="text-center font-semibold text-gray-600 py-1">Sáb</div>
              </div>

              <div className="grid grid-cols-7 grid-rows-5 gap-2">
                {/* Células vazias - exemplo: começando na QUINTA (índice 4) */}
                {Array.from({ length: dia_index1 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-transparent rounded-lg"></div>
                ))}
                
                {/* Dias do mês */}
                {Array.from({ length: dias_do_mes1 }).map((_, index) => (
                  <div key={index}
                  onClick={(e) => {switchIntervalo(String(((index + 1)+"-A")))}}
                      className={`aspect-square rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer transition-colors
                    ${
                      dia_calendario1 === String(((index + 1)+"-A")) || dia_calendario2 === String((index + 1+"-A"))
                        ? "bg-blue-500 text-white border-blue-500" // Clicado
                        : "bg-gray-50 hover:bg-blue-50" // Normal
                  }`}>
                    <span   className="text-sm text-gray-600">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-fit h-fit ">
            <div className="bg-white rounded-lg shadow-md p-6 h-[380px] w-[350px]">
              <div className="w-full flex justify-between">
                  <select value={mes_index2} onChange={(e) => mes_formatacao(ano_index2, e.target.value,2)}>
                    <option value={"01"}>Janeiro</option>
                    <option value={"02"}>Fevereiro</option>
                    <option value={"03"}>Março</option>
                    <option value={"04"}>Abril</option>
                    <option value={"05"}>Maio</option>
                    <option value={"06"}>Junho</option>
                    <option value={"07"}>Julho</option>
                    <option value={"08"}>Agosto</option>
                    <option value={"09"}>Setembro</option>
                    <option value={"10"}>Outubro</option>
                    <option value={"11"}>Novembro</option>
                    <option value={"12"}>Dezembro</option>
                  </select>
                  <select value={ano_index2} onChange={(e) => mes_formatacao(e.target.value, String(dia_index2), 2)}>
                    {
                      anos?.map((v, index) =>(
                        <option key={index} value={v}>{v}</option>
                      ))
                    }
                  </select>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="text-center font-semibold text-gray-600 py-1">Dom</div>
                <div className="text-center font-semibold text-gray-600 py-1">Seg</div>
                <div className="text-center font-semibold text-gray-600 py-1">Ter</div>
                <div className="text-center font-semibold text-gray-600 py-1">Qua</div>
                <div className="text-center font-semibold text-gray-600 py-1">Qui</div>
                <div className="text-center font-semibold text-gray-600 py-1">Sex</div>
                <div className="text-center font-semibold text-gray-600 py-1">Sáb</div>
              </div>

              <div className="grid grid-cols-7 grid-rows-5 gap-2">
                {/* Células vazias - exemplo: começando na QUINTA (índice 4) */}
                {Array.from({ length: dia_index2 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-transparent rounded-lg"></div>
                ))}
                
                {/* Dias do mês */}
                {Array.from({ length: dias_do_mes2 }).map((_, index) => (
                  <div key={index}
                  onClick={(e) => {switchIntervalo(String(((index + 1)+"-B")))}}
                    className={`aspect-square rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer transition-colors
                    ${
                      dia_calendario2 === String(((index + 1)+"-B")) || dia_calendario2 === String((index + 1+"-B"))
                        ? "bg-blue-500 text-white border-blue-500" // Clicado
                        : "bg-gray-50 hover:bg-blue-50" // Normal
                  }`}>
                    <span   className="text-sm text-gray-600">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
            <div className="flex justify-between w-[30%] py-1.5">
                <button onClick={() => aplicar()} className="bg-blue-700 text-white py-1.5 px-4.5 rounded-lg">Aplicar</button>
                <button onClick={() => setCalendario(false)} className="bg-red-500 text-white py-1.5 px-3.5 rounded-lg">Cancelar</button>
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
            <p className="p-2 bg-blue-100 rounded-xl font-medium">{startDate + " á "+ endDate}</p>
            <select onChange={(e) => ticektMedioChange(e)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="7" >Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="mes">Este mês</option>
              <option value="person">Personalizado</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar lojas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
              
              {/* Dropdown personalizado */}
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-10 shadow-lg">
                  {lojasFiltradas.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setLojaId(item.store_id);
                        setSearchTerm(item.store_name); // Mostra o nome no input
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {item.store_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
              + Novo Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}