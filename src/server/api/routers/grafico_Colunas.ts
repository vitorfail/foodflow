import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

// Tipagem do Ticket que vem do BD
interface Canais {
  canal: string;
  total_vendas: number;
  faturamento_total: number;
  ticket_medio: number;
}

export const graficodeColunas = createTRPCRouter({
  getGraficoColunas: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, loja_id } = input;

      // Monta a query usando COALESCE para loja_id
      const query = `
        SELECT 
          c.name AS canal,
          COUNT(s.id) AS total_vendas,
          SUM(s.total_amount) AS faturamento_total,
          AVG(s.total_amount) AS ticket_medio
        FROM channels c
        LEFT JOIN sales s ON c.id = s.channel_id
        WHERE s.store_id = COALESCE($1, s.store_id)
          ${startDate ? "AND s.created_at >= $2::timestamp" : ""}
          ${endDate ? "AND s.created_at <= $3::timestamp" : ""}
        GROUP BY c.id, c.name
        ORDER BY faturamento_total DESC;
      `;

      const result = await ctx.db.$queryRawUnsafe<Canais[]>(
        query,
        loja_id ?? null,
        startDate ?? undefined,
        endDate ?? undefined
      );

      return result.map(r => ({
        canal: r.canal,
        total_vendas: r.total_vendas,
        faturamento_total: r.faturamento_total,
        ticket_medio: r.ticket_medio,
      }));
    }),
});
