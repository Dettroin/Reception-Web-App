import { z } from 'zod';

export const createAppointmentSchema = z.object({
  visitorName: z.string().min(2),
  mobile: z.string().min(10),
  meetingWith: z.string().min(1),
  department: z.string().optional(),
  date: z.string(),
  time: z.string().min(1),
  purpose: z.string().optional(),
  notes: z.string().optional(),
}).strict();