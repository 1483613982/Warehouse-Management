import request from '@/utils/request'

export function addNotice(data) {
  return request({
    url: '/api/Notice/addNotice',
    method: 'post',
    data
  })
}
export function deleteNoticeById(data) {
  return request({
    url: '/api/Notice/deleteNoticeById',
    method: 'get',
    params: data
  })
}
export function getShowNotice() {
  return request({
    url: '/api/Notice/getShowNotice',
    method: 'get'
  })
}

export function getNotice(data) {
  return request({
    url: '/api/Notice/getNotice',
    method: 'get',
    params: data
  })
}

export function getNoticeList(data) {
  return request({
    url: '/api/Notice/getNoticeList',
    method: 'get',
    params: data
  })
}

export function updateNotice(data) {
  return request({
    url: '/api/Notice/updateNotice',
    method: 'post',
    data
  })
}
