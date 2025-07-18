import { useEffect } from "react";
import { Box, Icon, Text, useDisclosure, Collapsible } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { MenuItemState } from "./types";
import { NestedMenuItem } from "./nested-menu-item";

export const MultipleMenuItem = ({ menu }: { menu: MenuItemState }) => {
  const { open, onToggle, onOpen } = useDisclosure();

  useEffect(() => {
    if (menu.selected) {
      onOpen();
    }
  }, [menu.selected, onOpen]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        py={3}
        px={4}
        cursor="pointer"
        onClick={onToggle}
        color={menu.selected ? "white" : "gray.300"}
        _hover={{
          bgColor: "black",
          color: "white",
        }}
      >
        <Icon as={menu.icon} size="md" />
        <Text mb="0px" fontSize="0.8rem">
          {menu.name}
        </Text>
        <Icon
          as={ChevronDown}
          fontSize="18px"
          ml="auto"
          size="md"
          willChange="transform"
          transform={open ? "rotate(180deg)" : ""}
          transition="transform 0.3s"
        />
      </Box>
      <Collapsible.Root open={open}>
        <Collapsible.Content>
          {menu.nestedMenus?.map((nestedMenu) => (
            <NestedMenuItem key={nestedMenu.path} nestedMenu={nestedMenu} />
          ))}
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};
