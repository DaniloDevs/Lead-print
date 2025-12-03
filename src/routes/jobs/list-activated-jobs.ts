import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queue } from '../../connections/queue';

export default async function ListActivatedJobs(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/jobs/active', {
         schema: {
            summary: "List active background jobs",
            tags: ['Jobs'],
            description: "Retrieves a collection of jobs currently in the 'active' state (being processed by workers) associated with the current event context. Useful for monitoring system throughput and long-running tasks.",
         }
      }, async (_, reply) => {
         const jobsActivated = await queue.getActive()

         return reply.status(200).send({ jobs: jobsActivated })
      })
}