import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Tipagem correta baseada no seu SELECT
type StoreRow = {
  id: number;
  name: string;
};

export const lojasRouter = createTRPCRouter({
  getStores: publicProcedure
    .query(async ({ ctx }) => {
      const result = await ctx.db.$queryRawUnsafe<StoreRow[]>(`
        SELECT 
          id,
          name
        FROM stores;
      `);
            
      // Retorna diretamente o resultado pois já tem id e name
      return result.map(r => ({
        store_id: r.id,  // Mapeia id para store_id
        store_name: r.name,  // Mapeia name para store_name
      }));
    }),
});