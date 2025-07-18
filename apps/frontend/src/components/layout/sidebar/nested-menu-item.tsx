import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BaseMenuType } from "./types";

export const NestedMenuItem = ({
  nestedMenu,
}: {
  nestedMenu: BaseMenuType & { selected: boolean };
}) => {
  const isSelected = nestedMenu.selected;

  return (
    <Link href={nestedMenu.path} key={nestedMenu.path}>
      <Box
        display="flex"
        alignItems="center"
        py="10px"
        px="16px"
        fontSize="0.925rem"
        cursor="pointer"
        transition="0.2s linear"
        color={isSelected ? "white" : "gray.300"}
        bgColor={isSelected ? "black" : "transparent"}
        borderColor="green.500"
        _hover={{
          bgColor: "black",
          color: "white",
        }}
      >
        <Text ml={6} fontSize="0.8rem">
          {nestedMenu.name}
        </Text>
      </Box>
    </Link>
  );
};
