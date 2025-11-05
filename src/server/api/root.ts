import { tickeMedio } from "~/server/api/routers/ticket";
import { lojasRouter } from "~/server/api/routers/lojas";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import {produtosComplain} from "~/server/api/routers/produto_mais_vendido";
import { graficodeColunas } from "~/server/api/routers/grafico_Colunas";
import { horariosfaturamento } from "~/server/api/routers/horario_de_pico";
import { PagamentosTipos } from "~/server/api/routers/tipo_de_pagamento";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ticket:tickeMedio,
  lojas:lojasRouter,
  produtos_complain: produtosComplain,
  grafico_de_colunas:graficodeColunas,
  horarios_faturamento: horariosfaturamento,
  pagamentoTipo: PagamentosTipos
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
