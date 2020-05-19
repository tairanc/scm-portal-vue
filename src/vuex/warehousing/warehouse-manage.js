import axios from '@/api/interception'
import tools from '@/utils/tools'
import router from '@/router/index'
import qs from 'qs'
import notify from '@/utils/notify'

const state = {
  pageData:{},
  warehouseEdit: {},
  loading: false
}

const mutations = {
  updateData (state,payload) {
    state[payload.name] = payload.value
  } 
}

const actions = {
  getPageData ({commit},params){
    commit('updateData',{
      name: 'loading',
      value: true
    })
    axios({
      method: 'get',
      url: '/system/warehousePage',
      params: params
    }).then((res) => {
      commit('updateData',{
        name: 'pageData',
        value: res.data.result
      })
      commit('updateData',{
        name: 'loading',
        value: false
      })
    })
  },
  getWarehouseEditById ({commit, dispatch}, id) {
    axios({
      method: 'get',
      url: '/system/warehouse/' + id
    }).then((res) => {
      commit('updateData', {
        name: 'warehouseEdit',
        value: res.result
      })
      router.push({path: '/warehousing/warehouse-manage/' + id})
    })
  }
}

export default {
  namespaced : true,
  state,
  mutations,
  actions
}