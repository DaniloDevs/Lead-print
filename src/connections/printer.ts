import { ThermalPrinter, PrinterTypes, CharacterSet } from "node-thermal-printer";

export function createPrinter(path: string) {
   return new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: path,
      characterSet: CharacterSet.PC860_PORTUGUESE,
      removeSpecialCharacters: false,
      lineCharacter: "=",
      options: {
         timeout: 5000
      }
   });
}
