import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queue } from '../../connections/queue';



export default async function ListhWaitingJobs(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/jobs/waiting", {
         schema: {
            summary: "List pending background jobs",
            tags: ['Jobs'],
            description: "Retrieves the backlog of jobs currently in the 'waiting' state. These tasks are queued and pending execution, awaiting availability from a worker node or a scheduled execution time.",
         }
      }, async (_, reply) => {
         const jobsWaiting = await queue.getWaiting()

         return reply.status(200).send({ jobs: jobsWaiting })
      })
}