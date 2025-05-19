import { ZodSchema, type infer as zodInfer } from "zod";
import { HttpValidationError } from "../types/http-error";

const validate = <T extends ZodSchema>(
  schema: T,
  data: Record<string, any> = {},
): zodInfer<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new HttpValidationError(result.error.issues, 422);
  }

  return result.data;
};

export default validate;
