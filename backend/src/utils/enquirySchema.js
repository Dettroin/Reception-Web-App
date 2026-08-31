import { z } from 'zod';

export const createEnquirySchema = z.object({
  name: z.string().min(2),
  mobile: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  enquiryType: z.string().optional(),
  message: z.string().min(1),
  assignedTo: z.string().optional(),
  followUpDate: z.string().optional(),
  remarks: z.string().optional(),
}).strict();