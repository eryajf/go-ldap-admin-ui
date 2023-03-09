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
// 输入邮箱获取验证码
export function sendCode(data) {
  return request({
    url: '/api/base/sendcode',
    method: 'post',
    data
  })
}
// 邮箱更新用户密码（已完成）
export function emailPass(data) {
  return request({
    url: '/api/base/changePwd',
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

