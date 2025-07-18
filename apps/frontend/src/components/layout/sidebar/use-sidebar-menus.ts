import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useUser from "@/context/use-user";
import { MenuItemType, MenuItemState, BaseMenuType } from "./types";
import {
  getAllPaths,
  findMostSpecificPath,
  hasPermission,
  processMenuItem,
} from "./sidebar-utils";

export const useSidebarMenus = (initialMenus: MenuItemType[]) => {
  const router = useRouter();
  const { pathname } = router;
  const user = useUser((state) => state.user);
  const [menus, setMenus] = useState<MenuItemState[]>([]);

  useEffect(() => {
    // Process menus based on current path and user permissions
    const allPaths = getAllPaths(initialMenus);
    const selectedPath = findMostSpecificPath(pathname, allPaths);

    const processedMenus = initialMenus
      .filter((menu) => {
        if (menu.type === "single") {
          return hasPermission(menu.permission, user?.permissions);
        }
        return menu.nestedMenus?.some((nested: BaseMenuType) =>
          hasPermission(nested.permission, user?.permissions),
        );
      })
      .map((menu) => processMenuItem(menu, selectedPath, user?.permissions))
      .filter(
        (menu) =>
          menu.type === "single" ||
          (menu.type === "multiple" && menu.nestedMenus?.length),
      );

    setMenus(processedMenus);
  }, [pathname, user?.permissions, initialMenus]);

  return menus;
};
