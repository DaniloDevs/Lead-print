import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { queue } from '../../connections/queue';


export default async function DeleteAllJobsByType(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .delete('/jobs', {
         schema: {
            summary: "Bulk delete jobs by status",
            tags: ["Jobs"],
            description: "Performs a bulk deletion of background job entries based on their current execution status. This operation is irreversible and is typically used for maintenance (e.g., purging all 'failed' or 'completed' jobs from the queue).",
            body: z.object({
               type: z.enum(['completed', 'failed', 'active', 'wait'])
            }),
            response: {
               204: z.object({
                  message: z.string()
               })
            }
         }
      }, async (request, reply) => {
         const { type } = request.body

         await queue.clean(1000 * 60 * 10, 20, type)
         return reply.status(204).send({ message: `All jobs of this type ${type} have been deleted.` })
      })
}