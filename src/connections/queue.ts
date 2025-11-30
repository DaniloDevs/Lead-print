import { Queue } from "bullmq";
import { env } from "../env";
import type { Lead } from "../types/lead";

export const queue = new Queue<Lead>("leads-enqueue", {
   connection: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT
   },
});
