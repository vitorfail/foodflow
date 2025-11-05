import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

interface ConsumoPorGeneroResult {
  genero: string;
  total_clientes: number;
  ticket_medio: number;
}

export const ConsumoporGenero = createTRPCRouter({
  getGeneroconsumo: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, loja_id } = input;

      // Monta a query - retorna todos os gêneros, filtrando apenas por loja e data
      const query = `
        SELECT 
          c.gender as genero,
          COUNT(DISTINCT c.id) as total_clientes,
          AVG(s.total_amount) as ticket_medio
        FROM sales s
        INNER JOIN customers c ON s.customer_id = c.id
        WHERE c.gender IS NOT NULL 
          AND c.gender != ''
          AND s.store_id = COALESCE($1, s.store_id)
          ${startDate ? "AND s.created_at >= $2::timestamp" : ""}
          ${endDate ? "AND s.created_at <= $3::timestamp" : ""}
        GROUP BY c.gender
        ORDER BY total_clientes DESC;
      `;

      // Prepara os parâmetros
      const params = [
        loja_id ?? null,
        ...(startDate ? [startDate] : []),
        ...(endDate ? [endDate] : [])
      ];

      const result = await ctx.db.$queryRawUnsafe<ConsumoPorGeneroResult[]>(
        query,
        ...params
      );

      return result.map(r => ({
        genero: r.genero,
        total_clientes: Number(r.total_clientes),
        ticket_medio: Number(r.ticket_medio),
      }));
    }),
});