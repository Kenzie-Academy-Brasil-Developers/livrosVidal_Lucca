// validationSchemas.ts
import { z } from 'zod';

export const bookSchema = z.object({
  name: z.string().min(1),
  pages: z.number().int().positive(),
  category: z.string(),
});
