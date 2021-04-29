import request from '@/utils/request'

export function addOrderPurchase(data) {
  return request({
    url: '/api/OrderPurchase/addOrderPurchase',
    method: 'post',
    data
  })
}
export function deleteOrderPurchasenById(data) {
  return request({
    url: '/api/OrderPurchase/deleteOrderPurchasenById',
    method: 'get',
    params: data
  })
}

export function getOrderPurchase(data) {
  return request({
    url: '/api/OrderPurchase/getOrderPurchase',
    method: 'get',
    params: data
  })
}

export function getOrderPurchaseList(data) {
  return request({
    url: '/api/OrderPurchase/getOrderPurchaseList',
    method: 'post',
    data
  })
}

export function updateOrderPurchasen(data) {
  return request({
    url: '/api/OrderPurchase/updateOrderPurchasen',
    method: 'post',
    data
  })
}
