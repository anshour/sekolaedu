import { ZodType, type infer as zodInfer } from "zod/v4";
import { HttpValidationError } from "~/types/http-error";

const validate = <T extends ZodType>(
  schema: T,
  data: Record<string, unknown> = {},
): zodInfer<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new HttpValidationError(result.error.issues, 422);
  }

  return result.data;
};

export default validate;
