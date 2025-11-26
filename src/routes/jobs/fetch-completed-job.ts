import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queue } from '../../jobs/queue';



export default async function FetchCompletedJobs(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/jobs/completed", {
         schema: {
            summary: "Fetch Completed jobs",
            description: "Fetch all jobs in status is completed for current event",
            tags: ['Jobs']
         }
      }, async (request, reply) => {
         const jobsCompleted = await queue.getCompleted()

         return reply.status(200).send({ jobs: jobsCompleted })
      })
}