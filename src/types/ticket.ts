import z from "zod";


export const ticketSchema = z.object({
   name: z.string(),
   cellphone: z.string(),
   bannerURL: z.string(),
})

export type Ticket = z.infer<typeof ticketSchema>