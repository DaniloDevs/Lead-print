import type { FastifyInstance } from "fastify";
import { prisma } from "../../connections/prisma";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";


export async function EventRankings(app: FastifyInstance) {
   app.get(
      "/metrics/events-ranking",
      {
         schema: {
            summary: "Retrieve global event leaderboard",
            tags: ["Metrics"],
            description: "Generates a ranked list of all events based on lead capture volume, sorted from highest to lowest. This endpoint is useful for identifying top-performing campaigns or locations.",
            response: {
               200: z.array(
                  z.object({
                     position: z.number().int().positive(),
                     totalLeads: z.number().int().nonnegative(),
                     event: z.object({
                        id: z.string(),
                        title: z.string().optional(),
                        slug: z.string().optional(),
                        active: z.boolean().optional(),
                     }).nullable(),
                  })
               ),
            }
         },
      },
      async () => {
         const grouped = await prisma.leads.groupBy({
            by: ["eventsId"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
         });

         const events = await prisma.events.findMany({
            where: { id: { in: grouped.map((g) => g.eventsId) } },
         });

         return grouped.map((g, i) => ({
            position: i + 1,
            event: events.find((e) => e.id === g.eventsId),
            totalLeads: g._count.id,
         }));
      }
   );
}