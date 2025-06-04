import { Box, Skeleton, Stack, StackProps, Text } from "@chakra-ui/react";
import { type ReactElement } from "react";

interface Props extends StackProps {
  label: string;
  value?: string | number | null;
  isLoading?: boolean;
  element?: ReactElement;
}

const DataProperty = ({
  label,
  value,
  isLoading,
  element,
  ...stackProps
}: Props) => {
  return (
    <Stack gap={0} {...stackProps}>
      <Text fontSize="sm" color="gray.500">
        {label}
      </Text>
      <Skeleton loading={isLoading}>
        {!!element ? (
          <Box mt={1}>{element}</Box>
        ) : (
          <Text fontWeight="medium" color="gray.900">
            {value || "-"}
          </Text>
        )}
      </Skeleton>
    </Stack>
  );
};

export default DataProperty;
