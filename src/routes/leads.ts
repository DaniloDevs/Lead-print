

import type { FastifyInstance } from "fastify";
import { queue } from "../jobs/queue";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";


export default async function leadsRoute(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().post("/leads", {
      schema: {
         summary: "Create Lead",
         tags: ["Leads"],
         description: "Create a new lead",
         body: z.object({
            name: z.string(),
            age: z.number()
         })
      }
   }, async (request, reply) => {
      const { age, name } = request.body

      // Salvar user 
      const job = await queue.add("capture lead", { name, age });

      return reply.status(201).send({
         message: "Create user",
         jobId: job.id
      })
   });
} 