import {
  Home as HomeIcon,
  Logs,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import Sidebar, { MenuItem } from "./sidebar";
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

const sidebarWidth = 240;
const menus: MenuItem[] = [
  {
    name: "Home",
    type: "single",
    path: "/dashboard/admin",
    permission: "",
    icon: HomeIcon,
  },
  {
    name: "Accounts",
    type: "single",
    path: "/dashboard/admin/accounts",
    permission: "",
    icon: User,
  },
  {
    name: "Authorization",
    type: "multiple",
    path: "/dashboard/admin/authorization",
    permission: "",
    icon: ShieldCheck,
    nestedMenus: [
      {
        name: "Roles",
        path: "/dashboard/admin/authorization/roles",
        permission: "",
      },
      {
        name: "Permissions",
        path: "/dashboard/admin/authorization/permissions",
        permission: "",
      },
    ],
  },
  {
    name: "Logs",
    type: "single",
    path: "/dashboard/admin/logs",
    permission: "",
    icon: Logs,
  },
  {
    name: "Settings",
    type: "single",
    path: "/dashboard/admin/settings",
    permission: "",
    icon: Settings,
  },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = useUser((state) => state.user);
  const isDesktop = useBreakpointValue(
    {
      base: false,
      md: true,
    },
    {
      fallback: "base",
    }
  ) as boolean;

  const menuDisclosure = useDisclosure();

  useEffect(() => {
    if (!user) {
      const currentUrl = router.asPath;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
    }

    if (user?.role_name !== "admin") {
      router.replace("/403");
    }
  }, [user]);

  useEffect(() => {
    useUser.getState().refetchUser();
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

export default AdminLayout;
