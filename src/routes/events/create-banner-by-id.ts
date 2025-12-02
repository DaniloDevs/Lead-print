
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from "../../connections/prisma";
import z from "zod";
import { s3 } from "../../connections/minio";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "process";


export async function CreateBannerById(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/events/:id/banner', {
         schema: {
            summary: "Create Banner By ID",
            tags: ["Events"],
            description: "Add a banner to the event using the ID. ",
            params: z.object({
               id: z.string()
            })
         }
      }, async (request, reply) => {
         const { id } = request.params;

         const file = await request.file();
         if (!file) return reply.code(400).send("Banner obrigatório");

         if (!file.mimetype.startsWith("image/")) {
            return reply.code(400).send("Apenas imagens são permitidas");
         }

         const event = await prisma.events.findUnique({ where: { id } });
         if (!event) return reply.code(404).send("Evento não encontrado");

         const buffer = await file.toBuffer();
         const filename = `${Date.now()}-${id}`;

         // ------ UPLOAD MINIO ------
         await s3.send(
            new PutObjectCommand({
               Bucket: env.MINIO_BUCKET,  
               Key: filename,
               Body: buffer,
               ContentType: file.mimetype
            })
         );

         // URL pública depende da sua política de bucket
         const publicUrl = `${env.MINIO_BUCKET}/${filename}`;

         await prisma.events.update({
            where: { id },
            data: { bannerURL: publicUrl }
         });

         return reply.code(200).send({
            message: "Banner atualizado",
            url: publicUrl
         });
      });
}