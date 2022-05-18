import request from '@/utils/request'

// 获取接口列表（已完成）
export function getApis(params) {
  return request({
    url: '/api/api/list',
    method: 'get',
    params
  })
}

// 获取接口树(按接口Category字段分类)（已完成）
export function getApiTree(params) {
  return request({
    url: '/api/api/tree',
    method: 'get',
    params
  })
}

// 创建接口（已完成）
export function createApi(data) {
  return request({
    url: '/api/api/add',
    method: 'post',
    data
  })
}

// 更新接口（已完成）
export function updateApiById(data) {
  return request({
    url: '/api/api/update',
    method: 'post',
    data
  })
}

// 批量删除接口（已完成）
export function batchDeleteApiByIds(data) {
  return request({
    url: '/api/api/delete',
    method: 'post',
    data
  })
}
