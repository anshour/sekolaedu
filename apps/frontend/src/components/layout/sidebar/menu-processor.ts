import { MenuItemType, MenuItemState, BaseMenuType } from "./types";
import {
  getAllPaths,
  findMostSpecificPath,
  hasPermission,
  processMenuItem,
} from "./sidebar-utils";

export const processMenus = (
  initialMenus: MenuItemType[],
  pathname: string,
  userPermissions?: string[],
): MenuItemState[] => {
  const allPaths = getAllPaths(initialMenus);
  const selectedPath = findMostSpecificPath(pathname, allPaths);

  return initialMenus
    .filter((menu) => {
      if (menu.type === "single") {
        return hasPermission(menu.permission, userPermissions);
      }
      return menu.nestedMenus?.some((nested: BaseMenuType) =>
        hasPermission(nested.permission, userPermissions),
      );
    })
    .map((menu) => processMenuItem(menu, selectedPath, userPermissions))
    .filter(
      (menu) =>
        menu.type === "single" ||
        (menu.type === "multiple" && menu.nestedMenus?.length),
    );
};
