import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/milestone',
    method: 'get',
    params
  })
}

export function createMilestone(data) {
  return request({
    url: '/milestone',
    method: 'post',
    data
  })
}

export function updateById(id, data) {
  return request({
    url: '/milestone/' + id,
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/milestone/' + id,
    method: 'delete'
  })
}

export function getMilestoneById(id) {
  return request({
    url: '/milestone/' + id,
    method: 'get'
  })
}

