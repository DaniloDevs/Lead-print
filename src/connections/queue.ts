import { Queue } from "bullmq";
import { env } from "../env";
import type { Lead } from "../types/lead";
import type { Ticket } from "../types/ticket";

export const queue = new Queue<Ticket>("leads-enqueue", {
   connection: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT
   },
});
