import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPrinter } from "../../utils/setup-printer";

export async function GetPrintStatus(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/printer/status', {
         schema: {
            summary: "Get Print Device Status",
            tags: ["Printer"],
            description: "Get the status of a printing device.",
         }
      }, async (_, reply) => {
         try {
            const printer = getPrinter();

            const isConnected = await printer.isPrinterConnected();
            return {
               connected: isConnected,
            };
         } catch (error) {
            return reply.code(500).send({
               error: 'Erro ao verificar status',
               message: error instanceof Error ? error.message : 'Erro desconhecido',
               tip: 'Execute: sudo chmod 666 /dev/usb/lp0 ou sudo usermod -a -G lp $USER'
            });
         }
      });
}