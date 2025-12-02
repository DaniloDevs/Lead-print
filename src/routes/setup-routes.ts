import type { FastifyInstance } from "fastify";
import FetchActivatedJobs from "./jobs/fetch-activated-jobs";
import FetchCompletedJobs from "./jobs/fetch-completed-job";
import FetchFailedJobs from "./jobs/fetch-failed-jobs";
import FetchWaitingJobs from "./jobs/fetch-waiting-jobs";
import CreateLeads from "./leads/create-lead";
import { DetectPrinter } from "./printer/detect-printer";
import { GetPrintStatus } from "./printer/get-print-status";
import { TestPrintDevice } from "./printer/test-print-device";
import { ConfigurePrintDevice } from "./printer/configure-print";
import DeleteAllJobsByType from "./jobs/delete-all-jobs-by-type";
import { CreateBannerById } from "./events/create-banner-by-id";
import { CreateEvent } from "./events/create-event";
import { DisabledEventById } from "./events/disabled-event-by-id";
import { FetchEvents } from "./events/fetch-events";


export default async function SetupRoutes(app: FastifyInstance) {
   // Jobs
   app.register(FetchActivatedJobs)
   app.register(FetchCompletedJobs)
   app.register(FetchFailedJobs)
   app.register(FetchWaitingJobs)
   app.register(DeleteAllJobsByType)
   

   // Create Lead
   app.register(CreateLeads)

   // Printers
   app.register(DetectPrinter)
   app.register(GetPrintStatus)
   app.register(TestPrintDevice)
   app.register(ConfigurePrintDevice)

   // Events
   app.register(CreateBannerById)
   app.register(CreateEvent)
   app.register(DisabledEventById)
   app.register(FetchEvents)
}