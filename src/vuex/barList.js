import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        warehouseList : [],
        isShowTab: true
    },
    mutations: {
      needList (state, obj) {
         state.warehouseList = obj
      },
      changeShowTab(state, isShow) {
        state.isShowTab = isShow;
      }
    },
    actions: {

    }
})
export default store