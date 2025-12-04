import type { FastifyInstance } from "fastify";
import CreateLeads from "./leads/create-lead";
import { DetectPrinter } from "./printer/detect-printer";
import { GetPrintStatus } from "./printer/get-print-status";
import { TestPrintDevice } from "./printer/test-print-device";
import { ConfigurePrintDevice } from "./printer/configure-print";
import { CreateEvent } from "./events/create-event";
import { ListEvents } from "./events/list-events";
import { ListLeadsByEvent } from "./events/list-leads-by-event";
import ListEventsBySlug from "./events/list-events-by-slug";
import { UpdateEventBanner } from "./events/update-event-banner";
import { UpdateEventStatus } from "./events/update-event-status";
import { ExportEventLeads } from "./events/export-event-leads";
import { DailyMetrics } from "./metrics/daily-metrics";
import { EventMetrics } from "./metrics/event-metrics";
import { OverviewMetrics } from "./metrics/overview";
import { EventRankings } from "./metrics/event-rankings";


export default async function SetupRoutes(app: FastifyInstance) {
   // Create Lead
   app.register(CreateLeads)

   // Printers
   app.register(DetectPrinter)
   app.register(GetPrintStatus)
   app.register(TestPrintDevice)
   app.register(ConfigurePrintDevice)

   // Events
   app.register(CreateEvent)
   app.register(ListEvents)
   app.register(ListLeadsByEvent)
   app.register(ListEventsBySlug)
   app.register(UpdateEventBanner)
   app.register(UpdateEventStatus)
   app.register(ExportEventLeads)

   // Metrics
   app.register(DailyMetrics)
   app.register(EventMetrics)
   app.register(EventRankings)
   app.register(OverviewMetrics)
}