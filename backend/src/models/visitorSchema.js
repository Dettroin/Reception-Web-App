import { z } from 'zod';

export const createVisitorSchema = z.object({
  name: z.string().min(2),
  mobile: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  organization: z.string().optional(),
  purpose: z.string().optional(),
  personToMeet: z.string().min(1),
  department: z.string().optional(),
  idProofType: z.string().optional(),
  idProofNumber: z.string().optional(),
  remarks: z.string().optional(),
  entryTime: z.string().optional(),
});