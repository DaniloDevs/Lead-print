import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queue } from '../../jobs/queue';



export default async function FetchActivatedJobs(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/jobs/active", {
         schema: {
            summary: "Fetch Actives jobs",
            description: "Fetch all jobs in status is active for current event",
            tags: ['Jobs']
         }
      }, async (request, reply) => {
         const jobsActivated = await queue.getActive()

         return reply.status(200).send({ jobs: jobsActivated })
      })
}