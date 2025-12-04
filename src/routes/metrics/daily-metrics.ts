import type { FastifyInstance } from "fastify";
import { prisma } from "../../connections/prisma";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";


export async function DailyMetrics(app: FastifyInstance) {
   app.get(
      "/metrics/daily",
      {
         schema: {
            summary: "Retrieve daily growth metrics",
            tags: ["Metrics"],
            description: "Calculates the daily performance velocity. Compares the volume of leads captured today (from 00:00) against the previous day to determine the growth or churn rate. Also provides a historical snapshot.",
            response: {
               200: z.object({
                  todayLeads: z.number().int().nonnegative(),
                  yesterdayLeads: z.number().int().nonnegative(),
                  variation: z.number().nullable(),
                  last30Days: z.array(
                     z.object({
                        createdAt: z.union([z.string(), z.date()]),
                        _count: z.object({ id: z.number() })
                     })
                  ),
               }),
            }
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