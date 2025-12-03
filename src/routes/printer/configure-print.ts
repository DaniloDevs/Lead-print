import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPrinter, setupPrinter } from "../../utils/setup-printer";
import z from "zod";

export async function ConfigurePrintDevice(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .post('/printer/configure', {
         schema: {
            summary: "Initialize printer connection",
            tags: ["Printer"],
            description: "Sets the communication interface path for the physical printer and attempts to establish a handshake. This endpoint configures the internal driver and performs an immediate connectivity check to validate the device status.",
            body: z.object({
               path: z.string().describe("The system interface path or address (e.g., 'COM3', '/dev/usb/lp0', or network IP).")
            }),
            response: {
               200: z.object({
                  success: z.boolean(),
                  path: z.string(),
                  message: z.string(),
               }),
               500: z.object({
                  error: z.string(),
                  message: z.string()
               })
            }
         }
      }, async (request, reply) => {
         try {
            const { path } = request.body;
            // Setup lógico
            const newPaths = setupPrinter(path);
            const printer = getPrinter(newPaths);
      
            // Verificação física
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