import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../connections/prisma";

export async function ExportEventLeads(app: FastifyInstance) {
   app
      .withTypeProvider<ZodTypeProvider>().
      get("/events/:id/export/leads.csv", {
         schema: {
            summary: "Export Event Leads CSV",
            tags: ["Events"],
            description: ".",
            params: z.object({
               id: z.string(),
            }),
         },
      }, async (request, reply) => {
         const { id } = request.params;

         const [events, leads] = await Promise.all([
            prisma.events.findUnique({ where: { id } }),
            prisma.leads.findMany({
               where: {
                  eventsId: id,
                  isValid: true
               },
               select: { id: true, name: true, cellphone: true }
            }),
         ]);

         if (!events) {
            return reply.status(404).send({ message: "Event not found" });
         }

         // Montar CSV corretamente
         const header = "id,name,cellphone\n";

         const rows = leads
            .map((lead) => `${lead.id},${lead.name},${lead.cellphone}`)
            .join("\n");

         const csv = header + rows;

         reply.header("Content-Type", "text/csv");
         reply.header(
            "Content-Disposition",
            `attachment; filename="${events.slug}-leads.csv"`
         );

         return reply.send(csv);
      });
}
