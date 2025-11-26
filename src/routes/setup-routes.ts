import type { FastifyInstance } from "fastify";
import FetchActivatedJobs from "./jobs/fetch-activated-jobs";
import FetchCompletedJobs from "./jobs/fetch-completed-job";
import FetchFailedJobs from "./jobs/fetch-failed-jobs";
import FetchWaitingJobs from "./jobs/fetch-waiting-jobs";
import CreateLeads from "./leads/create-lead";
import PrinterRoutes from "./printer-routes";


export default async function SetupRoutes(app: FastifyInstance) {
   // Jobs
   app.register(FetchActivatedJobs)
   app.register(FetchCompletedJobs)
   app.register(FetchFailedJobs)
   app.register(FetchWaitingJobs)
   

   // Create Lead
   app.register(CreateLeads)

   // Printers
   app.register(PrinterRoutes)
}