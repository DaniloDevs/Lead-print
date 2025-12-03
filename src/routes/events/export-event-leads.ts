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

         const event = await prisma.events.findUnique({
            where: { id },
            include: { leads: true },
         });

         if (!event) {
            return reply.status(404).send({ message: "Event not found" });
         }

         // Montar CSV corretamente
         const header = "id,name,cellphone\n";

         const rows = event.leads
            .map((lead) => `${lead.id},${lead.name},${lead.cellphone}`)
            .join("\n");

         const csv = header + rows;

         reply.header("Content-Type", "text/csv");
         reply.header(
            "Content-Disposition",
            `attachment; filename="${event.slug}-leads.csv"`
         );

         return reply.send(csv);
      });
}
