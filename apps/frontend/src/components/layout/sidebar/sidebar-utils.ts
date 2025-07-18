import { MenuItemType, BaseMenuType, MenuItemState } from "./types";

export const getAllPaths = (menus: MenuItemType[]) => {
  const paths: string[] = [];
  menus.forEach((menu) => {
    if (menu.type === "single") {
      paths.push(menu.path);
    } else if (menu.type === "multiple" && menu.nestedMenus) {
      menu.nestedMenus.forEach((nested: BaseMenuType) => {
        paths.push(nested.path);
      });
    }
  });
  return paths.sort((a, b) => b.length - a.length); // Sort by length desc for most specific first
};

export const findMostSpecificPath = (pathname: string, allPaths: string[]) => {
  return allPaths.find((path) => pathname.startsWith(path)) || null;
};

export const hasPermission = (
  permission: string,
  userPermissions?: string[],
) => {
  return !permission || userPermissions?.includes(permission);
};

export const processMenuItem = (
  menu: MenuItemType,
  selectedPath: string | null,
  userPermissions?: string[],
): MenuItemState => {
  const isPathSelected = (path: string) => path === selectedPath;

  if (menu.type === "single") {
    return {
      ...menu,
      selected: isPathSelected(menu.path),
      nestedMenus: undefined,
    };
  }

  if (menu.type === "multiple") {
    const filteredNestedMenus = menu.nestedMenus
      ?.filter((nested: BaseMenuType) =>
        hasPermission(nested.permission, userPermissions),
      )
      .map((nested: BaseMenuType) => ({
        ...nested,
        selected: isPathSelected(nested.path),
      }));

    return {
      ...menu,
      nestedMenus: filteredNestedMenus,
      selected:
        filteredNestedMenus?.some(
          (nested: BaseMenuType & { selected: boolean }) => nested.selected,
        ) || false,
    };
  }

  return {
    ...menu,
    selected: false,
    nestedMenus: undefined,
  };
};
