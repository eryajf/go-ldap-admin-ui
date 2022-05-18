import request from '@/utils/request'
// 获取首页的数据 (已完成)
export function getDash() {
    return request({
      url: '/api/base/dashboard',
      method: 'get'
    })
  }