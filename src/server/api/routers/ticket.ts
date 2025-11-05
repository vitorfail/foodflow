import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

// Tipagem do Ticket que vem do BD
type TicketMedioRow = {
  store_id: number;
  store_name: string;
  sale_date: string;
  ticket_medio: number;
};

export const tickeMedio = createTRPCRouter({
  getAverageTicketByStoreAndDate: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, loja_id } = input;

      const result = await ctx.db.$queryRawUnsafe<TicketMedioRow[]>(`
        SELECT 
          s.store_id,
          st.name AS store_name,
          DATE(s.created_at) AS sale_date,
          ROUND(SUM(s.total_amount) / COUNT(s.id), 2) AS ticket_medio
        FROM sales s
        JOIN stores st ON st.id = s.store_id
        WHERE s.sale_status_desc NOT ILIKE '%cancel%'
          AND s.store_id = COALESCE($1, s.store_id)
          ${startDate ? `AND s.created_at >= $2::timestamp` : ""}
          ${endDate ? `AND s.created_at <= $3::timestamp` : ""}
        GROUP BY s.store_id, st.name, DATE(s.created_at)
        ORDER BY sale_date DESC, store_name;
      `, loja_id ?? null, startDate ?? undefined, endDate ?? undefined);

      return result.map(r => ({
        store_id: r.store_id,
        store_name: r.store_name,
        sale_date: r.sale_date,
        ticket_medio: r.ticket_medio,
      }));
    }),
});
