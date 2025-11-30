import { Worker, type Job } from "bullmq";
import { env } from "../env";
import { getPrinter } from "../utils/setup-printer";
import type { Lead } from "../types/lead";
import path from "path";




new Worker(
   "leads-enqueue",
   async (job: Job<Lead>) => {
      const printer = getPrinter();
      
      
      const imagePath = path.resolve(process.cwd(), "src/assets/fatos-fotos.png");
      printer.alignCenter();
      
      await printer.printImage(imagePath);


      // Titulo 
      printer.alignCenter();
      printer.setTextNormal()
      printer.bold(true);
      printer.println("Ticket do Sorteio");
      printer.newLine();

      // Inserindo dados
      printer.alignLeft();
      printer.bold(false);
      printer.print("Partipante: ")
      printer.bold(true);
      printer.println(job.data.name)
      printer.bold(false);
      printer.print("Final do Telefone: ")
      printer.bold(true);
      printer.println(job.data.cellphone.slice(-4))

      // Footer
      printer.newLine();
      printer.alignRight();
      printer.println(new Date().toLocaleString('pt-BR'))
      printer.cut()

      await printer.execute();
      console.log("Executed Job")

   },
   {
      connection: {
         host: env.REDIS_HOST,
         port: env.REDIS_PORT,
      },
   }
);

console.log("Worker iniciado");