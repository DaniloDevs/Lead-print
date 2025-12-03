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
import DeleteAllJobsByType from "./jobs/delete-all-jobs-by-type";
import ListhWaitingJobs from "./jobs/list-waiting-jobs";
import ListCompletedJobs from "./jobs/list-completed-job";
import ListFailedJobs from "./jobs/list-failed-jobs";
import ListActivatedJobs from "./jobs/list-activated-jobs";


export default async function SetupRoutes(app: FastifyInstance) {
   // Jobs
   app.register(DeleteAllJobsByType)
   app.register(ListhWaitingJobs)
   app.register(ListCompletedJobs)
   app.register(ListFailedJobs)
   app.register(ListActivatedJobs)

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
}