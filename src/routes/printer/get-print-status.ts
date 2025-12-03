import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPrinter } from "../../utils/setup-printer";
import z from "zod";

export async function GetPrintStatus(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/printer/status', {
         schema: {
            summary: "Check printer connectivity",
            tags: ["Printer"],
            description: "Performs a heartbeat check on the currently configured printer interface to verify if the device is reachable. This endpoint is lightweight and suitable for periodic polling to update UI status indicators.",
            response: {
               200: z.object({
                  connected: z.boolean()
               }),

               500: z.object({
                  error: z.string(),
                  message: z.string(),
                  tip: z.string().optional().describe("Actionable command-line suggestions to fix permission issues (e.g., Linux `chmod` or `usermod` commands).")
               })
            }
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