import request from '@/utils/request'

export function getShelvesList(page, size) {
  return request({
    url: 'api/Shelves/getShelvesByPage',
    method: 'get',
    params: { page, size }
  })
}

export function getShelvesCount() {
  return request({
    url: 'api/Shelves/getShelvesCount',
    method: 'get'
  })
}

export function addShelves(data) {
  return request({
    url: 'api/Shelves/addShelves',
    method: 'post',
    data
  })
}

export function updateShelve(data) {
  return request({
    url: '/api/Shelves/updateShelves',
    method: 'post',
    data
  })
}

export function delShelve(id) {
  return request({
    url: '/api/Shelves/deleteShelves',
    method: 'get',
    params: { id }
  })
}

export function searchShelves(s_number) {
  return request({
    url: 'api/Shelves/getShelvesBySNumber',
    method: 'get',
    params: { s_number }
  })
}

export function getAllShelves() {
  return request({
    url: 'api/Shelves/getAllShelves',
    method: 'get'
  })
}
