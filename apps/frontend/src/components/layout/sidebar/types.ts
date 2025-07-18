import { LucideIcon } from "lucide-react";

// Type definitions
export interface BaseMenuType {
  name: string;
  path: string;
  permission: string;
}

export interface MenuItemType extends BaseMenuType {
  type: "single" | "multiple";
  // TODO: Handle exact matching
  exact?: boolean;
  icon: LucideIcon;
  nestedMenus?: BaseMenuType[];
}

export interface MenuItemState extends MenuItemType {
  selected: boolean;
  nestedMenus?: Array<BaseMenuType & { selected: boolean }>;
}

export interface SidebarProps {
  isDesktop: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  menus: MenuItemType[];
}
