import request from '@/utils/request'

// 获取分组树(已完成)
export function getGroupTree(params) {
  return request({
    url: '/api/group/tree',
    method: 'get',
    params
  })
}
// 分组列表(已完成)
export function groupList(params) {
  return request({
    url: '/api/group/list',
    method: 'get',
    params
  })
}
// 添加分组(已完成)
export function groupAdd(data) {
  return request({
    url: '/api/group/add',
    method: 'post',
    data
  })
}
// 更新分组(已完成)
export function groupUpdate(data) {
  return request({
    url: '/api/group/update',
    method: 'post',
    data
  })
}
// 删除分组（已完成）
export function groupDel(data) {
  return request({
    url: '/api/group/delete',
    method: 'post',
    data
  })
}
// 在分组内的用户（已完成）
export function useGroupList(params) {
  return request({
    url: '/api/group/useringroup',
    method: 'get',
    params
  })
}
// 不再分组内的用户（已完成）
export function useGroupRole(params) {
  return request({
    url: '/api/group/usernoingroup',
    method: 'get',
    params
  })
}
// 添加用户到分组（已完成）
export function groupInfo(data) {
  return request({
    url: '/api/group/adduser',
    method: 'post',
    data
  })
}
// 将用户从分组移出（已完成）
export function delGroup(data) {
  return request({
    url: '/api/group/removeuser',
    method: 'post',
    data
  })
}
// 同步钉钉部门信息
export function syncDingTalkDeptsApi(data) {
  return request({
    url: '/api/group/syncDingTalkDepts',
    method: 'post',
    data
  })
}

// 同步企业微信部门信息
export function syncWeComDeptsApi(data) {
  return request({
    url: '/api/group/syncWeComDepts',
    method: 'post',
    data
  })
}

// 同步飞书部门信息
export function syncFeiShuDeptsApi(data) {
  return request({
    url: '/api/group/syncFeiShuDepts',
    method: 'post',
    data
  })
}

// 同步openldap部门信息
export function syncOpenLdapDeptsApi(data) {
  return request({
    url: '/api/group/syncOpenLdapDepts',
    method: 'post',
    data
  })
}
// 同步数据库的分组到ldap
export function syncSqlGroups(data) {
  return request({
    url: '/api/group/syncSqlGroups',
    method: 'post',
    data
  })
}