

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { queue } from "../../connections/queue";
import { leadSchema } from "../../types/lead";
import { prisma } from "../../connections/prisma";


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
         const { name, cellphone, eventsId } = request.body

         const event = await prisma.events.findUnique({
            where: { id: eventsId },
            select: {
               bannerURL: true
            }
         })

         // Salvar user 
         const job = await queue.add("capture lead", {
            name,
            cellphone,
            bannerURL: event?.bannerURL!
         });

         return reply.status(201).send({
            message: "Create Lead",
            jobId: job.id
         })
      });
} 