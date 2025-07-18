import { useRef } from "react";
import { Box } from "@chakra-ui/react";
import useUser from "@/context/use-user";
import {
  SidebarProps,
  SingleMenuItem,
  MultipleMenuItem,
  UserProfile,
  SidebarOverlay,
  SidebarHeader,
  useSidebarVisibility,
  useSidebarMenus,
} from "./sidebar/index";

export type {
  MenuItemType,
  MenuItemState,
  BaseMenuType,
  SidebarProps,
} from "./sidebar/index";

export const Sidebar = ({
  isDesktop,
  isOpen,
  onOpen,
  onClose,
  menus: initialMenus,
}: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menus = useSidebarMenus(initialMenus);

  useSidebarVisibility({ isDesktop, isOpen, onOpen, onClose });

  return (
    <>
      <SidebarOverlay isOpen={isOpen} isDesktop={isDesktop} onClose={onClose} />

      <Box
        position="fixed"
        bgColor="#222d32"
        h="full"
        w="var(--sidebar-width)"
        top={0}
        transition="transform 0.35s"
        transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
        zIndex={4}
        ref={sidebarRef}
      >
        <SidebarHeader />
        <UserProfile />
        {menus.map((menu) => {
          if (menu.type === "single")
            return <SingleMenuItem key={menu.path} menu={menu} />;

          if (menu.type === "multiple")
            return <MultipleMenuItem key={menu.path} menu={menu} />;

          return null;
        })}
      </Box>
    </>
  );
};
