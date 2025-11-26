import type { FastifyInstance } from 'fastify';
import { detectPrinter } from '../utils/detect-printer';
import { getPrinter, setupPrinter } from '../utils/setup-printer';
import z from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';


export default async function PrinterRoutes(app: FastifyInstance) {
   app.get('/printer/detect', async (request, reply) => {
      try {
         const detected = await detectPrinter();

         if (detected) {
            setupPrinter(detected)

            return {
               success: true,
               path: detected,
               message: 'Impressora detectada e configurada'
            };
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

   // Rota para verificar status
   app.get('/printer/status', async (request, reply) => {
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

   // Rota para teste de impressão simples
   app.get('/printer/test', async (request, reply) => {
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
   })

   app
      .withTypeProvider<ZodTypeProvider>()
      .post('/printer/configure', {
         schema: {
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
