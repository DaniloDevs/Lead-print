import { PrinterTypes, ThermalPrinter } from "node-thermal-printer";

export async function detectPrinter() {
   const possiblePaths = [
      '/dev/usb/lp0',
      '/dev/usb/lp1',
      '/dev/ttyUSB0',
      '/dev/ttyUSB1',
      'printer:auto', 
   ];

   for (const path of possiblePaths) {
      try {
         const testPrinter = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: path,
         });

         const isConnected = await testPrinter.isPrinterConnected();
         if (isConnected) {
            console.log(`✓ Impressora encontrada em: ${path}`);
            return path;
         }
      } catch (error) {
         // Continua tentando
      }
   }

   return null;
}
