import { Box, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { MenuItemState } from "./types";

export const SingleMenuItem = ({ menu }: { menu: MenuItemState }) => {
  const isSelected = menu.selected;

  return (
    <Link href={menu.path}>
      <Box
        display="flex"
        alignItems="center"
        py={3}
        px={4}
        my={1}
        cursor="pointer"
        gap="3"
        transition="0.2s linear"
        borderColor="green.500"
        bgColor={isSelected ? "black" : "transparent"}
        color={isSelected ? "white" : "gray.300"}
        _hover={{
          bgColor: "black",
          color: "white",
        }}
      >
        <Icon as={menu.icon} size="md" />
        <Text fontSize="0.8rem">{menu.name}</Text>
      </Box>
    </Link>
  );
};
