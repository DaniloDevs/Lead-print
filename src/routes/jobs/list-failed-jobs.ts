import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queue } from '../../connections/queue';


export default async function ListFailedJobs(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/jobs/failed", {
         schema: {
            summary: "List failed background jobs",
            tags: ['Jobs'],
            description: "Retrieves a registry of background jobs that encountered unrecoverable errors during execution. This endpoint provides critical debugging information, including the specific failure reason and stack trace, essential for root cause analysis and manual retry operations.",
         }
      }, async (request, reply) => {
         const jobsFailed = await queue.getFailed()

         return reply.status(200).send({ jobs: jobsFailed })
      })
}