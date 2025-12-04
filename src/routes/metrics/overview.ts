import type { FastifyInstance } from "fastify";
import { prisma } from "../../connections/prisma";
import z from "zod";


export async function OverviewMetrics(app: FastifyInstance) {
   app.get(
      "/metrics/overview",
      {
         schema: {
            summary: "Retrieve dashboard overview metrics",
            tags: ["Metrics"],
            description: "Aggregates key performance indicators (KPIs) for the administrative dashboard. Returns total counts, event activity status, a leaderboard of top-performing events, and recent lead acquisition data.",
            response: {
               200: z.object({
                  totalEvents: z.number().int().nonnegative(),
                  totalLeads: z.number().int().nonnegative(),
                  activeEvents: z.number().int().nonnegative(),
                  eventsRankingTop5: z.array(
                     z.object({
                        event: z.object({
                           id: z.string(),
                           title: z.string().optional(),
                           slug: z.string().optional(),
                        }).nullable(),
                        totalLeads: z.number().int(),
                     })
                  ),
                  last7Days: z.array(
                     z.object({
                        createdAt: z.union([z.string(), z.date()]),
                        _count: z.object({
                           id: z.number().int()
                        }),
                     })
                  ),
               })
            }
         }
      },
      async () => {
         const [totalEvents, totalLeads, activeEvents] = await prisma.$transaction([
            prisma.events.count(),
            prisma.leads.count(),
            prisma.events.count({
               where: { active: true },
            })
         ])

         const leadsPerEvent = await prisma.leads.groupBy({
            by: ["eventsId"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 5,
         });

         const events = await prisma.events.findMany({
            where: { id: { in: leadsPerEvent.map((l) => l.eventsId) } },
         });

         const ranking = leadsPerEvent.map((item) => ({
            event: events.find((e) => e.id === item.eventsId),
            totalLeads: item._count.id,
         }));

         const recentLeads = await prisma.leads.groupBy({
            by: ["createdAt"],
            _count: { id: true },
            orderBy: { createdAt: "asc" },
            take: 7,
         });

         return {
            totalEvents,
            totalLeads,
            activeEvents,
            eventsRankingTop5: ranking,
            last7Days: recentLeads,
         };
      }
   );

}