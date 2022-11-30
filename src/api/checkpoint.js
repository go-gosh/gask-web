import request from '@/utils/request'

export function listCheckpoint(params) {
  return request({
    url: '/checkpoint',
    method: 'get',
    params
  })
}

export function createCheckpoint(data) {
  return request({
    url: '/checkpoint',
    method: 'post',
    data
  })
}

export function updateById(id, data) {
  return request({
    url: '/checkpoint/' + id,
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/checkpoint/' + id,
    method: 'delete'
  })
}

