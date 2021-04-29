import request from '@/utils/request'

export function getSupplierList(page, size) {
  return request({
    url: 'api/Supplier/getSupplierList',
    method: 'get',
    params: { page, size }
  })
}

export function getSupplierCount() {
  return request({
    url: 'api/Supplier/getcount',
    method: 'get'
  })
}
export function getAllSuppler() {
  return request({
    url: 'api/Supplier/getAllSuppler',
    method: 'get'
  })
}
export function addSupplier(data) {
  return request({
    url: 'api/Supplier/addSupplier',
    method: 'post',
    data
  })
}
export function updateSupplier(data) {
  return request({
    url: 'api/Supplier/updateSupplier',
    method: 'post',
    data
  })
}
export function deleteSupplier(id) {
  return request({
    url: 'api/Supplier/deleteSupplier',
    method: 'get',
    params: { id }
  })
}
export function searchSupplier(name) {
  return request({
    url: 'api/Supplier/getSupplierlistByName',
    method: 'get',
    params: { name }
  })
}
