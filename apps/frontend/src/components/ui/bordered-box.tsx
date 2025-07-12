import { Box, type BoxProps } from "@chakra-ui/react";
import { type ReactNode } from "react";

interface Props extends BoxProps {
  children: ReactNode;
}

const BorderedBox = (props: Props) => {
  return (
    <Box
      borderStyle="solid"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.300"
      p="2"
      {...props}
    />
  );
};
export default BorderedBox;
