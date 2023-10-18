/** fixMenuItemIcon.tsx */
import type {MenuDataItem} from "@ant-design/pro-components";
import { isNil } from "lodash";

const findMenuByPath = (path: string, menus: MenuDataItem[]): MenuDataItem|null => {
  let menu: MenuDataItem|null = null;
  menus.forEach((item: MenuDataItem) => {
    if (!isNil(menu)) {
      return;
    }
    if (item.path === path) {
      menu = item;
    } else if (!isNil(item.children) && item.children.length > 0) {
      menu = findMenuByPath(path, item.children);
    }
  })

  return menu;
}

const fixMenuItemIcon = (menus: MenuDataItem[], defaultMenuData: MenuDataItem[]): MenuDataItem[] => {
  const data: MenuDataItem[] = [];
  menus.forEach((item) => {
    if (isNil(item.path)) {
      return;
    }
    const menu = findMenuByPath(item.path, defaultMenuData);
    if (isNil(menu)) {
      return;
    }

    item.name = menu.name;
    item.icon = menu.icon;
    if (!isNil(item.children) && item.children.length > 0) {
      item.children = fixMenuItemIcon(item.children, defaultMenuData);
    }
    data.push(item);
  });
  return data;
};

export default fixMenuItemIcon;