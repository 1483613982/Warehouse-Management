import request from '@/utils/request'

export function imgUpload(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
