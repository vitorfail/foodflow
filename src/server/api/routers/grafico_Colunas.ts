import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

//Tipagem do Ticket que vem do bd
interface Canais {
  canal: string;
  total_vendas: number;
  faturamento_total: number; // ou string se vier como formato monetário do BD
  ticket_medio: number; // ou string se vier como formato monetário do BD
}
export const graficodeColunas = createTRPCRouter({
  getGraficoColunas: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate,loja_id } = input;
      const result = await ctx.db.$queryRawUnsafe<Canais[]>(`
          SELECT 
          c.name AS canal,
          COUNT(s.id) AS total_vendas,
          SUM(s.total_amount) AS faturamento_total,
          AVG(s.total_amount) AS ticket_medio
          FROM channels c
          LEFT JOIN sales s ON c.id = s.channel_id
          WHERE s.store_id = ${loja_id? loja_id:""}
            ${startDate? `AND s.created_at >=  '${startDate}'`:""} ${endDate?` AND s.created_at<= '${endDate}'`:""}
          GROUP BY c.id, c.name
          ORDER BY faturamento_total DESC;`
        );

      return result.map(r => ({
        canal: r.canal,
        total_vendas: r.total_vendas,
        faturamento_total: r.faturamento_total,
        ticket_medio: r.ticket_medio,
      }));
    }),
});