import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { queue } from '../../jobs/queue';


export default async function DeleteAllJobsByType(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/jobs/waiting", {
         schema: {
            summary: "Delete Jobs by Type",
            description: "Permanently removes all job entries matching the specified job-type parameter from the current event. This action cannot be undone",
            tags: ['Jobs'],
            body: z.object({
               type: z.enum(['completed', 'failed', 'active', 'wait']),
            })
         }
      }, async (request, reply) => {
         const { type } = request.body

         await queue.clean(1000 * 60 * 10, 20, type)
         return reply.status(204).send({ message: `All jobs of this type ${type} have been deleted.` })
      })
}