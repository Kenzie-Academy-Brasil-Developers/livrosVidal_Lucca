import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

interface ValidationSchema {
  params?: z.ZodObject<any, any, any, { [x: string]: any }, { [x: string]: any }>;
  body?: z.ZodObject<any, any, any, { [x: string]: any }, { [x: string]: any }>;
  query?: z.ZodObject<any, any, any, { [x: string]: any }, { [x: string]: any }>;
}

// Função auxiliar para lidar com erros
const handleValidationError = (error: ZodError, res: Response) => {
  const firstError = error.errors[0];
  const errorMessage = firstError.message;

  if (errorMessage === "Required") {
    res.status(409).json({ error: "Invalid request body" });
  } else {
    res.status(409).json({ error: errorMessage });
  }
};

// Middleware de validação
export const validationMiddleware = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        schema.params.parse(req.params);
      }

      if (schema.body) {
        schema.body.parse(req.body);
      }

      if (schema.query) {
        schema.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        handleValidationError(error, res);
      } else {
        next(error);
      }
    }
  };
};

const bookSchema = {
  body: z.object({
    name: z.string().min(3),
    pages: z.number().min(1),
    category: z.string().optional(),
  }),
};

const updateBookSchema = {
  body: z.object({
    name: z.string().min(3).optional(),
    pages: z.number().min(1).optional(),
    category: z.string().optional(),
  }),
};

export { bookSchema, updateBookSchema };


