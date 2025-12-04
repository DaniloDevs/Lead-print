import type { FastifyInstance } from "fastify";
import { prisma } from "../../connections/prisma";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";


export async function EventMetrics(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get(
         "/metrics/events/:id",
         {
            schema: {
               summary: "Retrieve specific event metrics",
               tags: ["Metrics"],
               description: "Calculates performance indicators for a single event context. Provides volume data (total leads), relative contribution to the system, and chronological timestamps of lead acquisition.",
               params: z.object({
                  id: z.string()
               }),
               response: {
                  200: z.object({
                     totalLeads: z.number().int().nonnegative(),
                     percentageOfSystem: z.number(),
                     growthLast30Days: z.array(
                        z.object({
                           createdAt: z.union([z.string(), z.date()]),
                           _count: z.object({ id: z.number() })
                        })
                     ),
                     latestLead: z.object({
                        id: z.string(),
                        name: z.string(),
                        createdAt: z.union([z.string(), z.date()]),
                     }).nullable(),
                     firstLead: z.object({
                        id: z.string(),
                        name: z.string(),
                        createdAt: z.union([z.string(), z.date()]),
                     }).nullable(),
                  })
               }
            }
         },
         async (req) => {
            const { id } = req.params;

            const totalLeads = await prisma.leads.count({
               where: { eventsId: id },
            });

            const totalSystemLeads = await prisma.leads.count();

            const growth = await prisma.leads.groupBy({
               by: ["createdAt"],
               where: { eventsId: id },
               _count: { id: true },
               orderBy: { createdAt: "asc" },
               take: 30,
            });

            const latestLead = await prisma.leads.findFirst({
               where: { eventsId: id },
               orderBy: { createdAt: "desc" },
            });

            const firstLead = await prisma.leads.findFirst({
               where: { eventsId: id },
               orderBy: { createdAt: "asc" },
            });

            return {
               totalLeads,
               percentageOfSystem: totalSystemLeads
                  ? (totalLeads / totalSystemLeads) * 100
                  : 0,
               growthLast30Days: growth,
               latestLead,
               firstLead,
            };
         }
      );

}