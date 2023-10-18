// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有菜单 GET /api/admin/allMenus */
export async function getAllMenus() {
  return request<{
    data: API.Menu[];
  }>('/api/admin/allMenus', {
    method: 'GET',
  });
}

/** 新建菜单 POST /api/admin/menu */
export async function addMenu(options: API.Menu) {
  return request<Record<string, any>>('/api/admin/menu', {
    method: 'POST',
    ...options,
  });
}

/** 更新菜单 PATCH /api/admin/menu/:id */
export async function updateMenu(options: API.Menu) {
    return request<Record<string, any>>(`/api/admin/menu/${options.id}`, {
      method: 'PATCH',
      ...options,
    });
}

/** 更新排序全部菜单 POST /api/admin/menu/order */
export async function updateMenusOrder(options: API.Menu[]) {
    return request<Record<string, any>>(`/api/admin/menu/order`, {
      method: 'POST',
      ...options,
    });
}

/** 删除菜单 DELETE /api/admin/menu/:id */
export async function removeMenu(options: API.Menu) {
  return request<Record<string, any>>(`/api/admin/menu/${options.id}`, {
    method: 'DELETE',
  });
}
