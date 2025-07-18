import { Flex, Text } from "@chakra-ui/react";

export const SidebarHeader = () => {
  return (
    <Flex
      pt={3}
      pb={3}
      px="4"
      justifyContent="center"
      alignItems="center"
      gap="2"
    >
      <Flex alignItems="center" gap="2">
        <Text fontWeight="medium" fontSize="lg" color="white">
          App Name
        </Text>
      </Flex>
    </Flex>
  );
};
