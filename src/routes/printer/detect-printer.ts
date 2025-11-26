import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { detectPrinter } from "../../utils/detect-printer";
import { setupPrinter } from "../../utils/setup-printer";

export async function DetectPrinter(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/printer/detect', {
         schema: {
            summary: "Detect Print Device",
            tags: ["Printer"],
            description: "Detect a new print device conected",
         }
      }, async (_, reply) => {
         try {
            const detected = await detectPrinter();

            if (detected) {
               setupPrinter(detected)

               return reply.code(200).send({
                  success: true,
                  path: detected,
                  message: 'Impressora detectada e configurada'
               })
            } else {
               return reply.code(404).send({
                  success: false,
                  message: 'Nenhuma impressora encontrada',
                  tip: 'Verifique as permissões e conexões'
               });
            }
         } catch (error) {
            return reply.code(500).send({
               error: 'Erro ao detectar impressora',
               message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
         }
      });
}