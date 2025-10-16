import { z } from 'zod';

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  mobileNumber: z.string(),
});
