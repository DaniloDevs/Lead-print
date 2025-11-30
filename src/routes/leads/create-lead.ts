

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { queue } from "../../connections/queue";
import { leadSchema } from "../../types/lead";


export default async function CreateLeads(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post("/leads", {
         schema: {
            summary: "Create Lead",
            tags: ["Leads"],
            description: "Create a new lead",
            body: leadSchema
         }
      }, async (request, reply) => {
         const { age, name, eventId, cellphone } = request.body

         // Salvar user 
         const job = await queue.add("capture lead", { eventId, name, age, cellphone });

         return reply.status(201).send({
            message: "Create Lead",
            jobId: job.id
         })
      });
} 