import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { detectPrinter } from "../../utils/detect-printer";
import { setupPrinter } from "../../utils/setup-printer";
import z from "zod";

export async function DetectPrinter(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>()
      .get('/printer/detect', {
         schema: {
            summary: "Auto-detect and configure printer",
            tags: ["Printer"],
            description: "Scans available system interfaces (USB/Serial) to identify a compatible connected printing device. If a device is found, it is automatically initialized and set as the active printer path.",
            response: {
               200: z.object({
                  success: z.boolean().describe("Always true when a device is successfully detected."),
                  path: z.string().describe("The system path of the detected device (e.g., 'COM3', '/dev/usb/lp0')."),
                  message: z.string().describe("Confirmation message.")
               }),
               404: z.object({
                  success: z.boolean().default(false),
                  message: z.string().describe("Explanation of why detection failed."),
                  tip: z.string().optional().describe("Actionable advice for the user (e.g., 'Check cables', 'Verify permissions').")
               }),
               500: z.object({
                  error: z.string(),
                  message: z.string()
               })
            }
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