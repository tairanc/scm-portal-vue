import axios from '@/api/interception'
import qs from 'qs'
import notify from '@/utils/notify'
import navStatic from '@/assets/nav-config.json'
import router from '@/router/index'

const array2map = (array, result) => {
  array.map((val) => {
    result[val.code] = {...val, 'isLink': !val.children}
    if (val.children) {
      array2map(val.children, result)
    }
  })
}
const createRoute = (parent, child, action) => {
  let param
  let actionName
  let componentName
  switch (action) {
    case 'add':
      param = '/add'
      actionName = '新增'
      componentName = `-${action}`
      break
    case 'edit':
      param = '/:id'
      actionName = '编辑'
      componentName = `-${action}`
      break
    default:
      param = ''
      actionName = ''
      componentName = ''
  }
  let result = {
    path: child.path + param,
    meta: {
      title: child.name,
      self: child.self,
      vueName: `${parent.path}-${child.path}`,
      isLink: !child.children
    },
    component: () => import(`@/views/${parent.path}/${child.path}${componentName}`)
  }
  if (action) {
    result.meta.title += `-${actionName}`
    result.meta.navPath = `/${parent.path}/${child.path}`
  }
  return result
}

const state = {
  publicKey: '',
  channelList: [],
  navList: []
}
const mutations = {
  updateData (state, payload) {
    state[payload.name] = payload.value
  }
}
const actions = {
  getPublicKey ({commit}) {
    axios({
      method: 'get',
      url: '/scm-web'+'/account/user/encrypt/pub_key'
    }).then((res) => {
      commit('updateData', {
        name: 'publicKey',
        value: res.data.pub_key
      })
    })
  },
  login ({dispatch}, payload) {
    axios({
      method: 'post',
      url: '/phone',
      headers: {'content-type': 'application/json'},
      data: payload
    }).then((res) => {
      if(res.data.code == 200){
          document.cookie="token="+ res.data.body.token
          router.push({path: '/bar'})
          notify.success('登录成功！')
      }else{
          notify.error(res.data.message)
      }
      
    })
  },
  getChannel ({commit, dispatch}) {
      
  },
  exportReport (content, payload) {
    window.open(`/scm-web/${payload.url}?${qs.stringify(payload.params)}`)
  }
}

export default {
  state,
  mutations,
  actions
}
