import { Worker } from "bullmq";
import { env } from "../env";

new Worker(
   "leads-enqueue",
   async job => {
      console.log("Processando job:", job.id, job.data);
   },
   {
      connection: {
         host: env.REDIS_HOST,
         port: env.REDIS_PORT,
      },
   }
);

console.log("Worker iniciado");
