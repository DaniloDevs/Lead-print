import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPrinter, setupPrinter } from "../../utils/setup-printer";
import z from "zod";

export async function ConfigurePrintDevice(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post('/printer/configure', {
         schema: {
            summary: "Configure Printer Device",
            tags: ["Printer"],
            description: "Configure the printer device for physical printing. ",
            body: z.object({
               path: z.string()
            })
         }
      }, async (request, reply) => {
         try {
            const { path } = request.body;
            const newPaths = setupPrinter(path);
            const printer = getPrinter(newPaths);

            const isConnected = await printer.isPrinterConnected();

            return {
               success: isConnected,
               path: path,
               message: isConnected ? 'Impressora configurada' : 'Caminho definido, mas impressora não conectada'
            };
         } catch (error) {
            return reply.code(500).send({
               error: 'Erro ao configurar',
               message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
         }
      });
}