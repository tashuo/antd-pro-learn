// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有角色 GET /api/admin/role */
export async function getRoles(
    params: {
      // query
      /** 当前的页码 */
      current?: number;
      /** 页面的容量 */
      pageSize?: number;
    }) {
  return request<{
    data: API.Role[];
  }>('/api/admin/role', {
    method: 'GET',
    params,
  });
}

/** 新建角色 POST /api/admin/role */
export async function addRole(data: API.AddRole) {
  console.log(data)
  return request<Record<string, any>>('/api/admin/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

/** 更新角色 PATCH /api/admin/role/:id */
export async function updateRole(data: API.AddRole) {
  console.log(data)
  return request<Record<string, any>>(`/api/admin/role/${data.id}`, {
    method: 'PATCH',
    data,
  });
}

/** 删除角色 DELETE /api/admin/role/:id */
export async function removeRole(id: number) {
  return request<Record<string, any>>(`/api/admin/role/${id}`, {
    method: 'DELETE',
  });
}
