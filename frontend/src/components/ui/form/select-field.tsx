import {
  createListCollection,
  Field,
  Portal,
  Select,
  SelectRootProps,
} from "@chakra-ui/react";
import { Control, Controller, useController } from "react-hook-form";

interface Props
  extends Omit<SelectRootProps, "collection" | "value" | "multiple"> {
  control: Control;
  options: { label: string; value: string }[];
  name: string;
  placeholder?: string;
  label?: string;
}

export const SelectField = ({
  control,
  name,
  label,
  placeholder = "Select",
  options: arrayOptions,
  ...props
}: Props) => {
  const options = createListCollection({
    items: arrayOptions,
  });

  const { fieldState } = useController({
    control,
    name,
  });

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: props.required ? true : false }}
      render={({ field }) => (
        <Field.Root invalid={Boolean(fieldState.error)}>
          <Select.Root
            value={
              field.value === ""
                ? []
                : [
                    options.items.find((item) => item.value === field.value)
                      ?.value || "",
                  ]
            }
            onValueChange={({ value, items }) => {
              if (value.length === 0) {
                field.onChange("");
                return;
              }
              field.onChange(items[0].value);
            }}
            onInteractOutside={() => field.onBlur()}
            collection={options}
            name={name}
            {...props}
          >
            <Select.HiddenSelect />
            <Select.Label>{label}</Select.Label>

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={placeholder} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
                <Select.ClearTrigger />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {options.items.map((role) => (
                    <Select.Item key={role.value} item={role}>
                      {role.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
};
