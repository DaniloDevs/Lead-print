import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { createBullBoard } from "@bull-board/api";
import { FastifyAdapter } from "@bull-board/fastify";
import { queue } from "./queue";



const serverAdapter = new FastifyAdapter();
serverAdapter.setBasePath("/dashboard/jobs");

createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter,
});


export { serverAdapter }


