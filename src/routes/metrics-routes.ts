import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../connections/prisma";

export async function MetricsRoutes(app: FastifyInstance) {
   app.get(
      "/metrics/overview",
      {
         schema: {
            summary: "System Overview Metrics",
            tags: ["Metrics"],
         },
      },
      async () => {
         const totalEvents = await prisma.events.count();
         const totalLeads = await prisma.leads.count();

         const activeEvents = await prisma.events.count({
            where: { active: true },
         });

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

   // ----------------------------------------
   // GET /metrics/events/:id
   // ----------------------------------------
   app
      .withTypeProvider<ZodTypeProvider>()
      .get(
         "/metrics/events/:id",
         {
            schema: {
               summary: "Event Metrics",
               tags: ["Metrics"],
               params: z.object({
                  id: z.string(),
               }),
            },
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

   // ----------------------------------------
   // GET /metrics/events/:id/funnel
   // ----------------------------------------
   app
      .withTypeProvider<ZodTypeProvider>()
      .get(
         "/metrics/events/:id/funnel",
         {
            schema: {
               summary: "Event Funnel Metrics",
               tags: ["Metrics"],
               params: z.object({
                  id: z.string(),
               }),
            },
         },
         async (req) => {
            const { id } = req.params;

            const leadsCount = await prisma.leads.count({
               where: { eventsId: id },
            });

            // Caso você tenha tracking de visitas -> colocar aqui
            const visits = null;

            return {
               visits,
               leads: leadsCount,
               conversionRate: visits ? leadsCount / visits : null,
            };
         }
      );

   // ----------------------------------------
   // GET /metrics/events-ranking
   // ----------------------------------------
   app.get(
      "/metrics/events-ranking",
      {
         schema: {
            summary: "Ranking of Events by Leads",
            tags: ["Metrics"],
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

   // ----------------------------------------
   // GET /metrics/daily
   // ----------------------------------------
   app.get(
      "/metrics/daily",
      {
         schema: {
            summary: "Daily Metrics Overview",
            tags: ["Metrics"],
         },
      },
      async () => {
         const today = new Date();
         today.setHours(0, 0, 0, 0);

         const yesterday = new Date(today);
         yesterday.setDate(yesterday.getDate() - 1);

         const todayLeads = await prisma.leads.count({
            where: { createdAt: { gte: today } },
         });

         const yesterdayLeads = await prisma.leads.count({
            where: {
               createdAt: {
                  gte: yesterday,
                  lt: today,
               },
            },
         });

         const change =
            yesterdayLeads === 0 ? null : (todayLeads - yesterdayLeads) / yesterdayLeads;

         const last30Days = await prisma.leads.groupBy({
            by: ["createdAt"],
            _count: { id: true },
            orderBy: { createdAt: "asc" },
            take: 30,
         });

         return {
            todayLeads,
            yesterdayLeads,
            variation: change,
            last30Days,
         };
      }
   );
}
