import request from '@/utils/request'

// 获取当前登录用户信息 (已完成)
export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

// 获取用户列表 （已完成）
export function getUsers(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

// 更新用户登录密码（已完成）
export function changePwd(data) {
  return request({
    url: '/api/user/changePwd',
    method: 'post',
    data
  })
}

// 创建用户（已完成）
export function createUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

// 更新用户（已完成）
export function updateUserById(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}
// 批量删除记录*（已完成）
export function batchDeleteUserByIds(data) {
  return request({
    url: '/api/user/delete',
    method: 'post',
    data
  })
}
// 同步钉钉用户信息
export function syncDingTalkUsersApi(data) {
  return request({
    url: '/api/user/syncDingTalkUsers',
    method: 'post',
    data
  })
}

// 同步企业微信用户信息
export function syncWeComUsersApi(data) {
  return request({
    url: '/api/user/syncWeComUsers',
    method: 'post',
    data
  })
}

// 同步飞书用户信息
export function syncFeiShuUsersApi(data) {
  return request({
    url: '/api/user/syncFeiShuUsers',
    method: 'post',
    data
  })
}

// 同步openldap用户信息
export function syncOpenLdapUsersApi(data) {
  return request({
    url: '/api/user/syncOpenLdapUsers',
    method: 'post',
    data
  })
}
