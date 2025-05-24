import {
  Input as ChakraInput,
  InputElementProps,
  type InputProps,
} from "@chakra-ui/react";
import { type ReactNode } from "react";
import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from "react-hook-form";
import { Field } from "../field";
import { InputGroup } from "../input-group";

export interface InputFieldProps<TFieldValues extends FieldValues>
  extends Omit<InputProps, "name" | "defaultValue">,
    Pick<
      UseControllerProps<TFieldValues>,
      "rules" | "control" | "name" | "shouldUnregister"
    > {
  label?: string;
  autoComplete?: string;
  optionalText?: string;
  helperText?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  prefix?: string;
  suffix?: string;
}

interface Props<TFieldValues extends FieldValues>
  extends InputFieldProps<TFieldValues> {
  startElementProps?: InputElementProps;
  endElementProps?: InputElementProps;
  startElement?: ReactNode;
  endElement?: ReactNode;
  startOffset?: InputElementProps["paddingStart"];
  endOffset?: InputElementProps["paddingEnd"];
}

export const InputField = <TFieldValues extends FieldValues>({
  rules,
  control,
  name,
  shouldUnregister,
  label,
  size,
  autoComplete = "on",
  optionalText,
  helperText,
  leftElement,
  rightElement,
  prefix,
  suffix,
  startElement,
  endElement,
  startElementProps,
  endElementProps,
  startOffset,
  endOffset,
  ...inputProps
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
      <InputGroup
        startElement={startElement}
        endElement={endElement}
        startElementProps={startElementProps}
        endElementProps={endElementProps}
        startOffset={startOffset}
        endOffset={endOffset}
        {...inputProps}
      >
        <ChakraInput
          type="text"
          size={size}
          autoComplete={autoComplete}
          {...field}
          {...inputProps}
        />
      </InputGroup>
    </Field>
  );
};
