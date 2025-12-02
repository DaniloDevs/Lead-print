import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../connections/prisma";
import { createSlug } from "../utils/create-slug";
import { s3 } from "../connections/minio";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default function EventsRoutes(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post("/events", {
         schema: {
            body: z.object({
               title: z.string().min(1),
               active: z.boolean().default(true),
            })
         }
      }, async (req, reply) => {

         const { title, active } = req.body;

         const event = await prisma.events.create({
            data: {
               title,
               slug: createSlug(title),
               active,
               createdAt: new Date()
            }
         });

         return reply.code(201).send({ id: event.id });
      });

   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/events", async (req, reply) => {
         // Busca eventos
         const events = await prisma.events.findMany()

         return reply.code(200).send({
            events,
         });
      });

   app
      .withTypeProvider<ZodTypeProvider>()
      .get("/events/:id/disable", {
         schema: {
            params: z.object({
               id: z.string()
            })
         }
      }, async (req, reply) => {
         const { id } = req.params;
         // Busca eventos
         await prisma.events.update({
            where: { id },
            data: { active: false }
         });

         return reply.code(200).send();
      });



   app
      .withTypeProvider<ZodTypeProvider>()
      .post("/events/:id/banner", {
         schema: {
            params: z.object({
               id: z.string()
            })
         }
      }, async (req, reply) => {

         const { id } = req.params;

         const file = await req.file();
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
               Bucket: "banners-bucket",   // obrigatório
               Key: filename,
               Body: buffer,
               ContentType: file.mimetype
            })
         );

         // URL pública depende da sua política de bucket
         const publicUrl = `${process.env.MINIO_PUBLIC_URL}/${filename}`;

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