import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

//Tipagem do Ticket que vem do bd
type ProdutoMaster = {
  id: number;
  produto: string;
  loja: string;
  quantidade_total: number;
  total_vendas:number
};
export const produtosComplain = createTRPCRouter({
  getPrdutosComplain: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        loja_id: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate,loja_id } = input;
      const result = await ctx.db.$queryRawUnsafe<ProdutoMaster[]>(`
          SELECT 
            p.id,
            p.name as produto,
            s.name as loja,
            SUM(ps.quantity) as quantidade_total,
            COUNT(ps.id) as total_vendas,
            ROUND(SUM(ps.total_price)::numeric, 2) as valor_total
          FROM products p
          INNER JOIN product_sales ps ON p.id = ps.product_id
          INNER JOIN sales sa ON ps.sale_id = sa.id
          INNER JOIN stores s ON sa.store_id = s.id
          WHERE p.deleted_at IS NULL  
          ${startDate ? `AND sa.created_at >= '${startDate}'` : ""}
          ${endDate ? `AND sa.created_at <= '${endDate}'` : ""} ${loja_id ? 
            `AND s.id = ${loja_id}` : 
            ""}
          GROUP BY p.id, p.name, s.id, s.name
          ORDER BY quantidade_total DESC
          LIMIT 10;`);

      return result.map(r => ({
        id: r.id,
        produto: r.produto,
        loja: r.loja,
        quantidade_total: r.quantidade_total,
        total_vendas: r.total_vendas,
      }));
    }),
});