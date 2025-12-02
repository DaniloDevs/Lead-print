import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from "../../connections/prisma";
import z from "zod";

export async function DisabledEventById(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/events/:id/disable', {
         schema: {
            summary: "Disabled Event",
            tags: ["Events"],
            description: "Disables an event by ID",
            params: z.object({
               id: z.string()
            })
         }
      }, async (request, reply) => {
         const { id } = request.params;
         // Busca eventos
         await prisma.events.update({
            where: { id },
            data: { active: false }
         });

         return reply.code(200).send();
      });
}