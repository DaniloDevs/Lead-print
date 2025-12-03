import z from "zod";


export const leadSchema = z.object({
   eventsId: z.string(),
   name: z.string(),
   cellphone: z.string(),
   isValid: z.boolean()
})

export type Lead = z.infer<typeof leadSchema>