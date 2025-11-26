import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPrinter } from "../../utils/setup-printer";

export async function TestPrintDevice(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/printer/test', {
         schema: {
            summary: "Test printing device",
            tags: ["Printer"],
            description: "Performs a test print with basic information (date/time) to validate the connectivity and operation of the configured thermal printer.",
         }
      }, async (_, reply) => {
         try {
            const printer = getPrinter();

            printer.clear();
            printer.alignLeft();
            printer.drawLine();
            printer.println('Impressão para Teste!');
            printer.println(new Date().toLocaleString('pt-BR',));
            printer.drawLine();
            printer.partialCut();

            await printer.execute();

            return { success: true, message: 'Teste enviado para impressão' };
         } catch (error) {
            return reply.code(500).send({
               error: 'Erro ao imprimir teste',
               message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
         }
      });
}