import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from "zod";
import { prisma } from "../../connections/prisma";
import { createSlug } from "../../utils/create-slug";
import dayjs from "dayjs";

export async function CreateEvent(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post('/events', {
         schema: {
            summary: "Create new event",
            tags: ["Events"],
            description: "Registers a new event resource in the system. Initializes the event with the provided details and assigns a unique identifier. Returns the newly created event object.",
            body: z.object({
               title: z.string().min(1),
               active: z.boolean().default(true)
            }),
            response: {
               201: z.object({
                  id: z.string()
               })
            }
         }
      }, async (request, reply) => {

         const { title, active } = request.body;

         const event = await prisma.events.create({
            data: {
               title,
               slug: createSlug(title),
               active,
               createdAt: dayjs().format("DD/MM/YYYY")
            }
         });

         return reply.code(201).send({ id: event.id });
      });
}