import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Worker, type Job } from "bullmq";
import { env } from "../env";
import { getPrinter } from "../utils/setup-printer";
import type { ThermalPrinter } from "node-thermal-printer";
import { s3 } from '../connections/minio';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { Ticket } from '../types/ticket';

import fs from "fs";
import path from "path";
import axios from "axios";

async function downloadImage(url: string) {
   const response = await axios.get(url, { responseType: "arraybuffer" });
   const buffer = Buffer.from(response.data);

   return buffer;
}


async function TempleteTickt(printer: ThermalPrinter, job: Job<Ticket>) {
   const [bucket, key] = job.data.bannerURL.split('/')

   const presignedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
         Bucket: bucket,
         Key: key,
      }),
      { expiresIn: 3600 }
   );

   const localPath = await downloadImage(presignedUrl);

   printer.alignCenter()
   await printer.printImageBuffer(localPath);

   // Titulo 
   printer.alignCenter();
   printer.setTextNormal()
   printer.bold(true);
   printer.println("Ticket do Sorteio");
   printer.newLine();

   // Inserindo dados
   printer.alignLeft();
   printer.bold(false);
   printer.print("Participante: ")
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
}

new Worker(
   "leads-enqueue",
   async (job: Job<Ticket>) => {
      const printer = getPrinter();

      await TempleteTickt(printer, job)

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