import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPrinter, setupPrinter } from "../../utils/setup-printer";
import z from "zod";
import { prisma } from "../../connections/prisma";
import { createSlug } from "../../utils/create-slug";

export async function CreateEvent(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post('/events', {
         schema: {
            summary: "Create Event",
            tags: ["Events"],
            description: "Create a new Event",
            body: z.object({
               title: z.string().min(1),
               active: z.boolean().default(true),
            })
         }
      }, async (request, reply) => {

         const { title, active } = request.body;

         const event = await prisma.events.create({
            data: {
               title,
               slug: createSlug(title),
               active,
               createdAt: new Date()
            }
         });

         return reply.code(201).send({ id: event.id });
      });
}