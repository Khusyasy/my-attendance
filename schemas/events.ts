import { z } from "zod";

export const eventsPostSchema = z.object({
  name: z.string(),
  lat: z.number().min(-90).max(90).optional(),
  long: z.number().min(-180).max(180).optional(),
  radius: z.number().min(0).optional(),
});

export type EventsPostSchema = z.infer<typeof eventsPostSchema>;
