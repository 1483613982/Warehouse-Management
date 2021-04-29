import request from '@/utils/request'

export function addOrderSale(data) {
  return request({
    url: '/api/OrderSale/addOrderSale',
    method: 'post',
    data
  })
}
export function deleteOrderSaleById(data) {
  return request({
    url: '/api/OrderSale/deleteOrderSaleById',
    method: 'get',
    params: data
  })
}

export function getOrderSale(data) {
  return request({
    url: '/api/OrderSale/getOrderSale',
    method: 'get',
    params: data
  })
}

export function getOrderSaleList(data) {
  return request({
    url: '/api/OrderSale/getOrderSaleList',
    method: 'post',
    data
  })
}

export function updateOrderSale(data) {
  return request({
    url: '/api/OrderSale/updateOrderSale',
    method: 'post',
    data
  })
}
