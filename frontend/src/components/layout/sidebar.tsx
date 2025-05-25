import { useEffect, useRef, useState } from "react";
import {
  Box,
  Icon,
  Text,
  useDisclosure,
  Flex,
  Collapsible,
} from "@chakra-ui/react";
import { ChevronDown, EllipsisVertical, LucideIcon } from "lucide-react";
import { useRouter } from "next/router";
import useUser from "@/context/use-user";
import Link from "next/link";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";

const SingleMenuItem = ({ menu }: { menu: MenuItemState }) => {
  // TODO: HANDLE EXTERNAL LINKS 
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
        borderLeft={menu.selected ? "solid 3px" : "none"}
        borderColor="green.500"
        bgColor={menu.selected ? "#1e282c" : ""}
        color="gray.300"
        _hover={{
          bgColor: "#1e282c",
          color: "white",
        }}
      >
        <Icon
          as={menu.icon}
          color={menu.selected ? "white" : "inherit"}
          size="md"
        />
        <Text color={menu.selected ? "white" : "inherit"} fontSize="0.8rem">
          {menu.name}
        </Text>
      </Box>
    </Link>
  );
};

const MultipleMenuItem = ({ menu }: { menu: MenuItemState }) => {
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
        color="gray.300"
        _hover={{
          bgColor: "#1e282c",
          color: "white",
        }}
      >
        <Icon as={menu.icon} size="md" />
        <Text
          mb="0px"
          fontSize="0.8rem"
          color={menu.selected ? "white" : "inherit"}
        >
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
          {menu.nestedMenus!.map((nestedMenu) => (
            <Link href={nestedMenu.path} key={nestedMenu.path}>
              <Box
                display="flex"
                alignItems="center"
                py="10px"
                px="16px"
                fontSize="0.925rem"
                cursor="pointer"
                transition="0.2s linear"
                color="gray.300"
                bgColor={nestedMenu.selected ? "#1e282c" : ""}
                borderLeft={nestedMenu.selected ? "solid 3px" : "none"}
                borderColor="green.500"
                _hover={{
                  bgColor: "#1e282c",
                  color: "white",
                }}
              >
                <Text
                  ml={6}
                  fontSize="0.8rem"
                  color={nestedMenu.selected ? "white" : "inherit"}
                >
                  {nestedMenu.name}
                </Text>
              </Box>
            </Link>
          ))}
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};

interface SidebarProps {
  isDesktop: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  menus: MenuItem[];
}

const Sidebar = ({
  isDesktop,
  isOpen,
  onOpen,
  onClose,
  menus: initialMenus,
}: SidebarProps) => {
  const router = useRouter();
  const pathname = router.pathname;
  const user = useUser((state) => state.user);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [menus, setMenus] = useState<MenuItemState[]>([]);

  const handleClickLogout = () => {
    useUser.setState({ user: null });
    router.push("/auth/login");
  };

  useEffect(() => {
    if (isDesktop !== isOpen) {
      if (isDesktop) {
        onOpen();
      } else {
        onClose();
      }
    }

    const hasPermission = (permission: string) =>
      !permission || user?.permissions?.includes(permission);

    // Get all possible paths for exact matching
    const getAllPaths = (menus: MenuItem[]) => {
      const paths: string[] = [];
      menus.forEach((menu) => {
        if (menu.type === "single") {
          paths.push(menu.path);
        } else if (menu.type === "multiple" && menu.nestedMenus) {
          menu.nestedMenus.forEach((nested) => {
            if (hasPermission(nested.permission)) {
              paths.push(nested.path);
            }
          });
        }
      });
      return paths.sort((a, b) => b.length - a.length); // Sort by length desc for most specific first
    };

    // Find the most specific matching path
    const findMostSpecificPath = (pathname: string, allPaths: string[]) => {
      return allPaths.find((path) => pathname.startsWith(path)) || null;
    };

    const allPaths = getAllPaths(initialMenus);
    const selectedPath = findMostSpecificPath(pathname, allPaths);

    const isPathSelected = (path: string) => path === selectedPath;

    const processMenu = (menu: any) => {
      if (menu.type === "single") {
        return {
          ...menu,
          selected: isPathSelected(menu.path),
        };
      }

      if (menu.type === "multiple") {
        const filteredNestedMenus = menu.nestedMenus
          ?.filter((nested: any) => hasPermission(nested.permission))
          .map((nested: any) => ({
            ...nested,
            selected: isPathSelected(nested.path),
          }));

        return {
          ...menu,
          nestedMenus: filteredNestedMenus,
          selected: filteredNestedMenus?.some((nested: any) => nested.selected),
        };
      }

      return { ...menu, selected: false };
    };

    const menuState = initialMenus
      .filter((menu) =>
        menu.type === "single"
          ? hasPermission(menu.permission)
          : menu.nestedMenus?.some((nested) => hasPermission(nested.permission))
      )
      .map(processMenu)
      .filter(
        (menu) =>
          menu.type === "single" ||
          (menu.type === "multiple" && menu.nestedMenus?.length)
      );

    setMenus(menuState);
  }, [isDesktop, pathname, user?.permissions, initialMenus]);

  return (
    <>
      {/* Sidebar Mobile Overlay */}
      <Box
        position="fixed"
        bgColor="transparent"
        w="full"
        h="full"
        top={0}
        left={0}
        zIndex={3}
        willChange="transform"
        transform={isOpen && !isDesktop ? "translateX(0)" : "translateX(-100%)"}
      >
        <Box
          position="fixed"
          bgColor="rgba(0, 0, 0, 0.6)"
          w="full"
          h="full"
          top={0}
          left={0}
          willChange="transform"
          data-state={isOpen ? "open" : "closed"}
          _open={{
            animation: "fade-in 300ms ease-out",
          }}
          transform={
            isOpen && !isDesktop ? "translateX(0)" : "translateX(-100%)"
          }
          zIndex={3}
          onClick={onClose}
        />
      </Box>

      {/* The sidebar */}
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
        <Flex
          pt={3}
          pb={3}
          px="4"
          bgColor="#008d4c"
          justifyContent="center"
          alignItems="center"
          gap="2"
        >
          <Flex alignItems="center" gap="2">
            <Text fontWeight="medium" fontSize="lg" color="white">
              App
            </Text>
          </Flex>
        </Flex>

        <MenuRoot>
          <MenuTrigger asChild>
            <Flex
              rounded="sm"
              alignItems="center"
              px="3"
              m="3"
              py="2"
              gap="3"
              bgColor="gray.700"
              cursor="pointer"
              _hover={{
                bgColor: "gray.800",
              }}
            >
              <Box
                w="7"
                h="7"
                rounded="full"
                bgColor="gray.500"
                flexShrink={0}
              />
              <Flex justifyContent="space-between" w="full" alignItems="center">
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" color="white">
                    {user?.name}
                  </Text>
                  <Text fontSize="xs" color="gray.300">
                    Your jabatan
                  </Text>
                </Box>
                <EllipsisVertical size="18" color="white" />
              </Flex>
            </Flex>
          </MenuTrigger>
          <MenuContent>
            <MenuItem width="200px" value="profile">
              Profile
            </MenuItem>
            <MenuItem
              width="200px"
              value="logout"
              color="fg.error"
              onClick={handleClickLogout}
              _hover={{ bg: "bg.error", color: "fg.error" }}
            >
              Logout
            </MenuItem>
          </MenuContent>
        </MenuRoot>

        {menus.map((menu) => {
          if (menu.type === "single")
            return <SingleMenuItem key={menu.path} menu={menu} />;

          if (menu.type === "multiple")
            return <MultipleMenuItem key={menu.path} menu={menu} />;
        })}
      </Box>
    </>
  );
};

interface BaseMenuType {
  name: string;
  path: string;
  permission: string;
}

export interface MenuItem extends BaseMenuType {
  type: "single" | "multiple";
  icon: LucideIcon;
  nestedMenus?: BaseMenuType[];
}

interface MenuItemState extends MenuItem {
  selected: boolean;
  nestedMenus?: Array<BaseMenuType & { selected: boolean }>;
}

export default Sidebar;
