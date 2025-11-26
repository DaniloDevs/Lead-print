

import type { FastifyInstance } from "fastify";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { queue } from "../../jobs/queue";


export default async function CreateLeads(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post("/leads", {
         schema: {
            summary: "Create Lead",
            tags: ["Leads"],
            description: "Create a new lead",
            body: z.object({
               event: z.string(),
               name: z.string(),
               age: z.number()
            })
         }
      }, async (request, reply) => {
         const { age, name, event } = request.body

         // Salvar user 
         const job = await queue.add("capture lead", { name, age });

         return reply.status(201).send({
            message: "Create user",
            jobId: job.id
         })
      });
} 