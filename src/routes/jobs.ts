import type { FastifyInstance } from "fastify";
import { queue } from "../jobs/queue";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";


export default async function jobsRoute(app: FastifyInstance) {
   app.get("/jobs/active", async () => {
      return queue.getActive();
   });

   app.get("/jobs/completed", async () => {
      return queue.getCompleted();
   });

   app.get("/jobs/failed", async () => {
      return queue.getFailed();
   });

   app.get("/jobs/waiting", async () => {
      return queue.getWaiting();
   });

   app.withTypeProvider<ZodTypeProvider>().delete("/jobs/clean/:type", {
      schema: {
         params: z.object({
            type: z.enum(['completed', 'failed', 'delayed', 'active', 'wait', 'paused'])
         })
      }
   }, async (req) => {
      const { type } = req.params

      await queue.clean(1000 * 60 * 10, 20, type); // limpa jobs mais antigos que 10min
      return { status: `cleaned ${type}` };
   });
} 