import axios from '@/api/interception'
import qs from 'qs'

const deleteOrder = (data) => {
  return axios({
    method: 'PUT',
    url: '/purchase/purchaseOrder/updateState/' + data.id,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data)
  })
}

const getWarehouseNoticePage = (params) => {
  return axios({
    method: 'GET',
    url: '/warehouseNotice/warehouseNoticePage',
    params: params
  })
}

const getWarehouseNoticeById = (id) => {
  return axios({
    method: 'get',
    url: '/warehouseNotice/warehouseNoticeDetail',
    params : {warehouseNotice: id}
  })
}

const getWarehouseNoticeDetail = (id) => {
  return axios({
    method: 'get',
    url: '/warehouseNotice/warehouseNoticeInfo/'+ id,
  })
}
export default {
  deleteOrder,
  getWarehouseNoticePage,
  getWarehouseNoticeById,
  getWarehouseNoticeDetail
}
