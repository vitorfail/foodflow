import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

//Tipagem do Ticket que vem do bd
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
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;

      const result = await ctx.db.$queryRawUnsafe<TicketMedioRow[]>(`
        SELECT 
          s.store_id,
          st.name AS store_name,
          DATE(s.created_at) AS sale_date,
          ROUND(SUM(s.total_amount) / COUNT(s.id), 2) AS ticket_medio
        FROM sales s
        JOIN stores st ON st.id = s.store_id
        WHERE s.sale_status_desc NOT ILIKE '%cancel%'
          ${startDate ? `AND s.created_at >= '${startDate}'` : ""}
          ${endDate ? `AND s.created_at <= '${endDate}'` : ""}
        GROUP BY s.store_id, st.name, DATE(s.created_at)
        ORDER BY sale_date DESC, store_name;
      `);

      return result.map(r => ({
        store_id: r.store_id,
        store_name: r.store_name,
        sale_date: r.sale_date,
        ticket_medio: r.ticket_medio,
      }));
    }),
});