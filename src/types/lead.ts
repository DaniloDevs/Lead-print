import z from "zod";


export const leadSchema = z.object({
   eventId: z.string(),
   name: z.string(),
   age: z.number(),
   cellphone: z.string()
})

export type Lead = z.infer<typeof leadSchema>