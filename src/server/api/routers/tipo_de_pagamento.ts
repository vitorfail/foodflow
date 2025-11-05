import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

// Tipagem do Ticket que vem do BD
interface TiposdePagamento {
  id: number;
  description: string;
  brandId: number | null;
  total_value: number;
  payment_count: number;
}

export const PagamentosTipos = createTRPCRouter({
  getTiposdepagamemnto: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, loja_id } = input;

      const result = await ctx.db.$queryRawUnsafe<TiposdePagamento[]>(`
        SELECT 
          pt.id,
          pt.description,
          pt.brand_id as "brandId",
          SUM(p.value) as total_value,
          COUNT(p.id) as payment_count
        FROM payment_types pt
        INNER JOIN payments p ON p.payment_type_id = pt.id
        INNER JOIN sales s ON s.id = p.sale_id
        WHERE s.store_id = COALESCE($1, s.store_id)
          ${startDate ? "AND s.created_at >= $2::timestamp" : ""}
          ${endDate ? "AND s.created_at <= $3::timestamp" : ""}
        GROUP BY pt.id, pt.description, pt.brand_id
        ORDER BY total_value DESC;
      `, loja_id ?? null, startDate ?? undefined, endDate ?? undefined);

      return result.map(r => ({
        id: r.id,
        description: r.description,
        brandId: r.brandId,
        total_value: r.total_value,
        payment_count: r.payment_count,
      }));
    }),
});
