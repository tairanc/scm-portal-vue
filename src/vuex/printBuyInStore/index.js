import axios from '@/api/interception'
import tools from '@/utils/tools'
import router from '@/router/index'
import qs from 'qs'
import notify from '@/utils/notify'
import { Loading } from 'element-ui';

export default {
    namespaced: true,
    state: {
        data:{},
        datalist:[],
        goodsInfos : []
    },
    getters: {
      deleteRequest(state) {
        let p_uid = ''
        state.submitOrders.forEach(item => {
          p_uid += (item.p_uid + ',')
        })
        p_uid = p_uid.replace(/,$/, '')
        return p_uid
      }
    },
    mutations: {
      updataData(state, payload){
        state.data = payload
      },
      updateOrders(state, payload) {
        state.datalist = payload.datalist
      },
      updateGoodsInfo(state, payload){
        let _goodsInfos = []
        _goodsInfos.push(payload.goodsInfos)
        state.goodsInfos = payload.goodsInfos
      }
    },
    actions: {
      aList(ct, params) {
        // console.log(params)
        return (
            axios({
                    method: 'get',
                    url: '/wms-web'+ '/wmsAllocateIn/wmsAllocateInPage',
                    params: params
                }).then(res => {
                    console.log(res.data);
                    if(!res) return
                    ct.commit('updateOrders', {datalist: res.data.body})
                    ct.commit("updataData", res.data)
                })
        )
      },
      aDetailList (ct, params) {
        //   console.log(params.id)
        return (
            axios({
                method: 'get',
                url: '/warehouseNotice/warehouseNoticeDetail/',
                params : {warehouseNotice: 21}
                }).then(res => {
                    console.log(res)
                    if(!res) return
                    ct.commit('updateGoodsInfo', {goodsInfos: res.data})
                })
        )
      }
    }
  }
