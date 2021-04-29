import request from '@/utils/request'

export function addGoodsIn(data) {
  return request({
    url: '/api/GoodsIn/addGoodsIn',
    method: 'post',
    data
  })
}
export function deleteGoodsIn(data) {
  return request({
    url: '/api/GoodsIn/deleteGoodsIn',
    method: 'get',
    params: data
  })
}

export function getGoodsIn(data) {
  return request({
    url: '/api/GoodsIn/getGoodsIn',
    method: 'get',
    params: data
  })
}

export function getGoodsInByPage(data) {
  return request({
    url: '/api/GoodsIn/getGoodsInByPage',
    method: 'get',
    params: data
  })
}

export function getGoodsInByGoodsName(data) {
  return request({
    url: '/api/GoodsIn/getGoodsInByGoodsName',
    method: 'get',
    params: data
  })
}
export function updateGoodsIn(data) {
  return request({
    url: '/api/GoodsIn/updateGoodsIn',
    method: 'post',
    data
  })
}
