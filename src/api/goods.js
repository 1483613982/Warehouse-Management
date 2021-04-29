import request from '@/utils/request'

export function getGoodsList(page, size) {
  return request({
    url: 'api/Goods/getGoodsByPage',
    method: 'get',
    params: { page, size }
  })
}

export function getGoodsCount() {
  return request({
    url: 'api/Goods/getGoodsCount',
    method: 'get'
  })
}

export function getAllGoods() {
  return request({
    url: 'api/Goods/getAllGoods',
    method: 'get'
  })
}

export function getGoodsWarning(data) {
  return request({
    url: 'api/Goods/getGoodsWarning',
    method: 'get',
    params: data
  })
}
export function addGoods(data) {
  return request({
    url: '/api/Goods/addGoods',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/api/Goods/updateGoods',
    method: 'post',
    data
  })
}

export function deleteGoods(data) {
  return request({
    url: '/api/Goods/deleteGoods',
    method: 'get',
    params: data
  })
}

