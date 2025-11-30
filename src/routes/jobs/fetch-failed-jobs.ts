import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queue } from '../../connections/queue';


export default async function FetchFailedJobs(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/jobs/failed", {
         schema: {
            summary: "Fetch Failed jobs",
            description: "Fetch all jobs in status is failed for current event",
            tags: ['Jobs']
         }
      }, async (request, reply) => {
         const jobsFailed = await queue.getFailed()

         return reply.status(200).send({ jobs: jobsFailed })
      })
}