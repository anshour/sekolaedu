import http, { HttpError } from "@/utils/http";
import { handleMutationError } from "@/utils/new-error-handler";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import {
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import toast from "react-hot-toast";

export interface FormProviderProps {
  defaultValues: Record<string, any>;
  transform?: (data: Record<string, any>) => Record<string, any>;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  successMessage?: string;
  nextPage?: string;
  api: string; //TODO: ADD API BASED ON BACKEND (ONLY POST, PUT, PATCH)
  method?: "post" | "put" | "patch";
  fieldArrays?: string[];
  children?: (props: {
    isLoading: boolean;
    form: UseFormReturn<Record<string, any>>;
    control: UseFormReturn<Record<string, any>>["control"];
    formErrors: Record<string, any>;
    formRegister: UseFormReturn<Record<string, any>>["register"];
    fieldArrays?: Record<
      string,
      UseFieldArrayReturn<Record<string, any>, string, "id">
    >;
  }) => ReactNode;
}

export const FormProvider = ({
  defaultValues,
  transform,
  onSuccess,
  onError,
  successMessage,
  method = "post",
  nextPage,
  api,
  fieldArrays = [],
  children,
}: FormProviderProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues,
  });

  // Automatically detect array fields from defaultValues if fieldArrays not provided
  const detectedArrayFields =
    fieldArrays.length > 0
      ? fieldArrays
      : Object.keys(defaultValues).filter((key) =>
          Array.isArray(defaultValues[key])
        );

  // Create field array hooks for each detected array field
  const fieldArrayHooks: Record<
    string,
    UseFieldArrayReturn<Record<string, any>, string, "id">
  > = {};

  detectedArrayFields.forEach((fieldName) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    fieldArrayHooks[fieldName] = useFieldArray({
      control: form.control,
      name: fieldName,
    });
  });

  const mutation = useMutation({
    mutationFn: (param: any) => http[method](api, param),
    onSuccess: (res) => {
      if (onSuccess) {
        onSuccess(res);
      }

      if (successMessage) {
        toast.success(successMessage);
      }

      if (nextPage) {
        router.push(nextPage);
      }
    },
    onError: (err) => {
      if (onError) {
        onError(err);
      } else {
        handleMutationError(err as HttpError);
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    const formData = transform ? transform(data) : data;
    mutation.mutate(formData);
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  return (
    <form onSubmit={onSubmit}>
      {!!children &&
        children({
          isLoading: mutation.isPending,
          form,
          control: form.control,
          formRegister: form.register,
          formErrors: form.formState.errors,
          fieldArrays:
            Object.keys(fieldArrayHooks).length > 0
              ? fieldArrayHooks
              : undefined,
        })}
    </form>
  );
};

export default FormProvider;
