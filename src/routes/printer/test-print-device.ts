import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPrinter } from "../../utils/setup-printer";
import z from "zod";

export async function TestPrintDevice(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/printer/test', {
         schema: {
            summary: "Trigger test print job",
            tags: ["Printer"],
            description: "Dispatches a standard diagnostic print job to the active device. The printout includes a connectivity confirmation message and the current server timestamp, followed by a paper cut command. Useful for verifying mechanical alignment and character encoding.",
            response: {
               200: z.object({
                  success: z.boolean().describe("Indicates that the command sequence was successfully sent to the printer buffer/driver."),
                  message: z.string().describe("Confirmation message.")
               }),
               500: z.object({
                  error: z.string(),
                  message: z.string()
               })
            }
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