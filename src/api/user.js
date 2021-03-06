import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/User/login',
    method: 'post',
    data
  })
}

export function getInfo(username) {
  return request({
    url: 'api/User/getUser',
    method: 'get',
    params: { username }
  })
}

export function findUser(username) {
  return request({
    url: 'api/User/findUser',
    method: 'get',
    params: { username }
  })
}

export function logout() {
  return request({
    url: 'api/User/logOut',
    method: 'post'
  })
}

export function getUserList() {
  return request({
    url: '/api/User/getUserList',
    method: 'get'
  })
}

export function updateUser(data) {
  return request({
    url: '/api/User/updateUser',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/User/addUser',
    method: 'post',
    data
  })
}
export function delUser(id) {
  return request({
    url: '/api/User/deleteUser',
    method: 'get',
    params: { id }
  })
}
export function getCount() {
  return request({
    url: '/api/User/getCount',
    method: 'get'
  })
}
export function getPageUser(page, size) {
  return request({
    url: '/api/User/getPageUser',
    method: 'get',
    params: { page, size }
  })
}
