import React from "react";
import { Field } from "../field";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import ReactAsyncSelect, { AsyncProps } from "react-select/async";

interface Props<TFieldValues extends FieldValues>
  extends Pick<
      UseControllerProps<TFieldValues>,
      "rules" | "control" | "name" | "shouldUnregister"
    >,
    Omit<AsyncProps<any, false, any>, "name" | "onChange"> {
  loadOptions: (inputValue: string, ...otherFilter: any[]) => Promise<any>;
  otherFilter?: any[];
  optionalText?: string;
  helperText?: string;
  label?: string;
  optionLabel?: string;
  optionValue?: string;
}

export const AsyncSelectField = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  shouldUnregister,
  optionalText,
  helperText,
  label,
  loadOptions,
  otherFilter = [],
  optionLabel = "name",
  optionValue = "id",
  ...props
}: Props<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
    shouldUnregister,
  });

  return (
    <Field
      invalid={Boolean(error)}
      errorText={error?.message}
      required={!!rules?.required}
      optionalText={optionalText}
      helperText={helperText}
      label={label}
    >
      <ReactAsyncSelect
        getOptionLabel={(option) => option[optionLabel]}
        getOptionValue={(option) => option[optionValue]}
        isClearable
        loadOptions={(v) => loadOptions(v, ...otherFilter)}
        value={field.value}
        onChange={field.onChange}
        {...props}
      />
    </Field>
  );
};
