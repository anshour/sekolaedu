import { Home as HomeIcon } from "lucide-react";
import { Sidebar, MenuItemType } from "./sidebar";
import {
  Box,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import Topbar from "./topbar";
import useUser from "@/context/use-user";
import { useRouter } from "next/router";
import useAcademicYear from "@/context/use-academic-year";

const sidebarWidth = 240;
const menus: MenuItemType[] = [
  {
    name: "Home",
    type: "single",
    path: "/dashboard/teacher",
    permission: "",
    icon: HomeIcon,
  },
];

const PrincipalLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = useUser((state) => state.user);
  const isDesktop = useBreakpointValue(
    {
      base: false,
      md: true,
    },
    {
      fallback: "base",
    },
  ) as boolean;

  const menuDisclosure = useDisclosure();

  useEffect(() => {
    if (!user) {
      const currentUrl = router.asPath;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
    }

    if (user?.role?.name !== "principal") {
      router.replace("/403");
    }
  }, [user]);

  useEffect(() => {
    useUser.getState().refetchUser();
  }, []);

  useEffect(() => {
    useAcademicYear.getState().refetchAcademicYear();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Box css={{ "--sidebar-width": `${sidebarWidth}px` }}>
      <Topbar
        isDesktop={isDesktop}
        isOpen={menuDisclosure.open}
        onToggle={menuDisclosure.onToggle}
      />
      <Sidebar
        menus={menus}
        isDesktop={isDesktop}
        isOpen={menuDisclosure.open}
        onClose={menuDisclosure.onClose}
        onOpen={menuDisclosure.onOpen}
      />
      <Box
        bgColor="gray.100"
        minHeight="calc(100vh)"
        marginLeft={
          menuDisclosure.open && isDesktop ? "var(--sidebar-width)" : "0"
        }
        transition="margin 0.4s"
        pt={14}
        pb={10}
      >
        <VStack alignItems="stretch" px="2" pt="2">
          {children}
        </VStack>
      </Box>
    </Box>
  );
};

export default PrincipalLayout;
