import request from '@/utils/request'

export function addGoodsOut(data) {
  return request({
    url: '/api/GoodsOut/addGoodsOut',
    method: 'post',
    data
  })
}
export function deleteGoodsOut(data) {
  return request({
    url: '/api/GoodsOut/deleteGoodsOut',
    method: 'get',
    params: data
  })
}

export function getGoodsOut(data) {
  return request({
    url: '/api/GoodsOut/getGoodsOut',
    method: 'get',
    params: data
  })
}

export function getGoodsOutByPage(data) {
  return request({
    url: '/api/GoodsOut/getGoodsOutByPage',
    method: 'get',
    params: data
  })
}

export function getGoodsOutByGoodsName(data) {
  return request({
    url: '/api/GoodsOut/getGoodsOutByGoodsName',
    method: 'get',
    params: data
  })
}
export function updateGoodsOut(data) {
  return request({
    url: '/api/GoodsOut/updateGoodsOut',
    method: 'post',
    data
  })
}
