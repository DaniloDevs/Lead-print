import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../connections/prisma";
import z from "zod";


export default async function FetchEventsBySlug(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/events', {
         schema: {
            summary: "Fetch Events",
            tags: ["Events"],
            description: "Fetch All Events",
            body: z.object({
               slug: z.string()
            })
         }
      }, async (request, reply) => {
         const { slug } = request.body

         const events = await prisma.events.findFirst({
            where: { slug }
         })

         return reply.code(200).send({
            events,
         });
      });
}