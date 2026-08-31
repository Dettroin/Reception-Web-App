 import { z } from 'zod';

export const createCallLogSchema = z.object({
  callerName: z.string().trim().min(1, 'Caller name is required'),
  mobile: z.string().trim().min(10, 'Mobile number must be at least 10 digits'),
  callType: z.enum(['Incoming', 'Outgoing', 'Missed']),
  personOrDepartment: z.string().optional().or(z.literal('')),
  purpose: z.string().optional().or(z.literal('')),
  remarks: z.string().optional().or(z.literal('')),
  dateTime: z.string().optional().or(z.literal('')),
}).strict();