import request from '@/utils/request'

// 获取菜单树(已完成)
export function getMenuTree() {
  return request({
    url: '/api/menu/tree',
    method: 'get'
  })
}

// 获取菜单列表
export function getMenus() {
  return request({
    url: '/api/menu/list',
    method: 'get'
  })
}

// 创建菜单(已完成)
export function createMenu(data) {
  return request({
    url: '/api/menu/add',
    method: 'post',
    data
  })
}

// 更新菜单(已完成)
export function updateMenuById(data) {
  return request({
    url: '/api/menu/update',
    method: 'post',
    data
  })
}

// 批量删除菜单(已完成)
export function batchDeleteMenuByIds(data) {
  return request({
    url: '/api/menu/delete',
    method: 'post',
    data
  })
}

// 获取用户的可访问菜单列表
export function getUserMenusByUserId(Id) {
  return request({
    url: '/api/menu/access/list/' + Id,
    method: 'get'
  })
}

// 获取用户的可访问菜单树
export function getUserMenuTreeByUserId(params) {
  return request({
    url: '/api/menu/access/tree/',
    method: 'get',
    params
  })
}
