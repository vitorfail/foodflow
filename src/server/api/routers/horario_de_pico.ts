import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

//Tipagem do Ticket que vem do bd
interface Horarios {
  data: string
  hora: number;
  total_vendas: number;
  faturamento_total: number; // ou string se vier como formato monetário do BD
}
export const horariosfaturamento = createTRPCRouter({
  gethorariosPico: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate,loja_id } = input;
      const result = await ctx.db.$queryRawUnsafe<Horarios[]>(
`SELECT 
    DATE(s.created_at) AS data,
    EXTRACT(HOUR FROM s.created_at) AS hora,
    COUNT(s.id) AS total_vendas,
    SUM(s.total_amount) AS faturamento_hora
FROM sales s
WHERE s.store_id = ${loja_id? loja_id: "62"}
  AND s.created_at BETWEEN ${startDate? `'${startDate}'`: ""} AND ${endDate? `'${endDate}'`: ""}
GROUP BY DATE(s.created_at), EXTRACT(HOUR FROM s.created_at)
ORDER BY data, hora;`
        );

      return result.map(r => ({
        data:r.data,
        hora: r.hora,
        total_vendas: r.total_vendas,
        faturamento_total: r.faturamento_total,
      }));
    }),
});