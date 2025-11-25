import type { FastifyInstance } from "fastify";
import { queue } from "../jobs/queue";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";


export default async function jobsRoute(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().get("/jobs/active", {
      schema: {
         summary: "Get Active Jobs",
         tags: ["Jobs"],
         description: "Get all active jobs"
      }
   }, async () => {
      return queue.getActive();
   });

   app.withTypeProvider<ZodTypeProvider>().get("/jobs/completed", {
      schema: {
         summary: "Get Completed Job",
         tags: ["Jobs"],
         description: "Get all Completed jobs"
      }
   }, async () => {
      return queue.getCompleted();
   });

   app.withTypeProvider<ZodTypeProvider>().get("/jobs/failed", {
      schema: {
         summary: "Get failure Jobs",
         tags: ["Jobs"],
         description: "Get all failure jobs"
      }
   }, async () => {
      return queue.getFailed();
   });

   app.withTypeProvider<ZodTypeProvider>().get("/jobs/waiting", {
      schema: {
         summary: "Get waiting jobs",
         tags: ["Jobs"],
         description: "Get all waiting jobs"
      }
   }, async () => {
      return queue.getWaiting();
   });

   app.withTypeProvider<ZodTypeProvider>().delete("/jobs/clean/:type", {
      schema: {
         summary: "Delete Jobs for Type ",
         tags: ["Jobs"],
         description: "Delete all Jobs for Type",
         body: z.object({
            type: z.enum(['completed', 'failed', 'active', 'wait']),
         })
      }
   }, async (req) => {
      const { type } = req.body

      await queue.clean(1000 * 60 * 10, 20, type); // limpa jobs mais antigos que 10min
      return { status: `cleaned ${type}` };
   });
} 