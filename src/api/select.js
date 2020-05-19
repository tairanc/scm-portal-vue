import axios from '@/api/interception'

const getSupplierOrderStatus = () => {
  return axios({
    method: 'get',
    url: '/select/selectByTypeCode/supplierOrderStatus'
  })
}

const getWarehouseNoticeStatus = () => {
  return axios({
    method: 'GET',
    url: '/select/warehouseNoticeStatus'
  })
}

const getPurchaseTypes = () => {
  return axios({
    method: 'GET',
    url: '/select/purchaseType'
  })
}

const getOutboundOrderStatus = () => {
  return axios({
    method: 'GET',
    url: '/select/outboundOrderStatus'
  })
}

export default {
  getSupplierOrderStatus,
  getWarehouseNoticeStatus,
  getPurchaseTypes,
  getOutboundOrderStatus
}
