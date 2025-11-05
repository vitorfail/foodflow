import type { ReactNode } from 'react';

interface Carregamento {
  loading: boolean;
  error: any |null;
}

const CarregarChart: React.FC<Carregamento> = ({ loading, error }) => {
  if (loading)
    return (
      <div className="-top-[5px] absolute z-7 w-full h-[110%] flex items-center justify-center bg-blue-100 border-2 border-dashed border-gray-200 dark:border-slate-600">
        <p>Carregando...</p>
      </div>
    );

  if (error)
    return (
      <div className="-top-[5px] absolute z-7 w-full h-[110%] flex items-center justify-center bg-red-300 border-2 border-dashed border-gray-200 dark:border-slate-600">
        <p>Ocorreu um erro</p>
      </div>
    );

  // ✅ Quando não está carregando nem com erro, renderiza o conteúdo normalmente
  return <></>;
};

export default CarregarChart;
