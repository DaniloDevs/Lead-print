import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from "../../connections/prisma";

export async function FetchEvents(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/events', {
         schema: {
            summary: "Fetch Events",
            tags: ["Events"],
            description: "Fetch All Events",
         }
      }, async (_, reply) => {
         const events = await prisma.events.findMany()

         return reply.code(200).send({
            events,
         });
      });
}