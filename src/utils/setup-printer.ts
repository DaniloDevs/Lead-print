import { createPrinter } from "../connections/printer";

let printerPath = "/dev/usb/lp0";

export function setupPrinter(customPath?: string) {
  printerPath = customPath || "/dev/usb/lp0";

  return printerPath;
}

export function getPrinter(path?: string) {
  return createPrinter(printerPath);
}
