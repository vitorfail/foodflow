import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

// Tipagem do Ticket que vem do BD
type ProdutoMaster = {
  id: number;
  produto: string;
  loja: string;
  quantidade_total: number;
  total_vendas: number;
};

export const produtosComplain = createTRPCRouter({
  getPrdutosComplain: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, loja_id } = input;

      // Query usando parâmetros SQL seguros
      const query = `
        SELECT 
          p.id,
          p.name AS produto,
          s.name AS loja,
          SUM(ps.quantity) AS quantidade_total,
          COUNT(ps.id) AS total_vendas,
          ROUND(SUM(ps.total_price)::numeric, 2) AS valor_total
        FROM products p
        INNER JOIN product_sales ps ON p.id = ps.product_id
        INNER JOIN sales sa ON ps.sale_id = sa.id
        INNER JOIN stores s ON sa.store_id = s.id
        WHERE p.deleted_at IS NULL
          AND s.id = COALESCE($1, s.id)
          ${startDate ? `AND sa.created_at >= $2::timestamp` : ""}
          ${endDate ? `AND sa.created_at <= $3::timestamp` : ""}
        GROUP BY p.id, p.name, s.id, s.name
        ORDER BY quantidade_total DESC
        LIMIT 10;
      `;

      const result = await ctx.db.$queryRawUnsafe<ProdutoMaster[]>(
        query,
        loja_id ?? null,
        startDate ?? undefined,
        endDate ?? undefined
      );

      return result.map(r => ({
        id: r.id,
        produto: r.produto,
        loja: r.loja,
        quantidade_total: r.quantidade_total,
        total_vendas: r.total_vendas,
      }));
    }),
});
