import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { queue } from "../../connections/queue";
import { leadSchema } from "../../types/lead";
import { prisma } from "../../connections/prisma";
import z from "zod";


export default async function CreateLeads(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post("/leads", {
         schema: {
            summary: "Register new lead",
            tags: ["Leads"],
            description: "Registers a new lead in the database and enqueues a background task for further processing (e.g., CRM sync, welcome email). Returns the Job ID to allow tracking of the asynchronous operation status.",
            body: leadSchema,
            response: {
               201: z.object({
                  message: z.string(),
               }),
               400: z.object({
                  message: z.string()
               })
            }
         }
      }, async (request, reply) => {
         const { name, cellphone, eventsId } = request.body

         const event = await prisma.events.findUnique({
            where: { id: eventsId },
            select: {
               bannerURL: true
            }
         })

         if (!event) return reply.status(400).send({ message: "Event not found!" })

         await prisma.leads.create({
            data: {
               name,
               cellphone,
               eventsId
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
         })
      });
} 