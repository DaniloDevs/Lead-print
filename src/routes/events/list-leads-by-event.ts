import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from "../../connections/prisma";
import z from "zod";

export async function ListLeadsByEvent(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/events/:id/leads', {
         schema: {
            summary: "Retrieve event leads",
            tags: ["Events"],
            description: "Retrieves the collection of leads (registrants or attendees) associated with the specified event ID. Returns a list containing contact information and registration details.",
            params: z.object({
               id: z.string()
            }),
            response: {
               200: z.object({
                  currentLeads: z.number(),
                  leads: z.object({
                     name: z.string(),
                     cellphone: z.string()
                  }).array()
               }),
               400: z.object({
                  message: z.string()
               })
            }
         }
      }, async (request, reply) => {
         const { id } = request.params

         const [events, leads, count] = await Promise.all([
            prisma.events.findUnique({ where: { id } }),
            prisma.leads.findMany({
               where: {
                  eventsId: id,
                  isValid: true
               },
               select: { name: true, cellphone: true }
            }),
            prisma.leads.count({
               where: {
                  eventsId: id,
                  isValid: true
               }
            })
         ]);


         if (!events) return reply.status(400).send({ message: "Events not exist!" })


         return reply.code(200).send({
            currentLeads: count,
            leads: leads,
         });
      });
}