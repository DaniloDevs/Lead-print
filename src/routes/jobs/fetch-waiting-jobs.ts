import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queue } from '../../jobs/queue';



export default async function FetchWaitingJobs(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/jobs/waiting", {
         schema: {
            summary: "Fetch Waiting jobs",
            description: "Fetch all jobs in status is waiting for current event",
            tags: ['Jobs']
         }
      }, async (_, reply) => {
         const jobsWaiting = await queue.getWaiting()

         return reply.status(200).send({ jobs: jobsWaiting })
      })
}