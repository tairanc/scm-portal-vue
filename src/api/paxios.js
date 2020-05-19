import axios from 'axios'
import { Message, Loading } from 'element-ui';
import Qs from 'qs'
import router from '../router'


let loadingInstance = false;
let loadFunc = (loadFlag) => {
    if (loadFlag) {
        loadingInstance = Loading.service({
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.8)',
            spinner: 'el-icon-loading'
        });
    }
};


let judge = (code, msg) => {
    if ( code == 403 ) {
        Message({
            message: "该用户已被停用，请联系管理员！",
            type: 'error'
        })
        setTimeout(() => {
            router.push({path: '/login'})
        },1000)

    }else if( code == 401 ){
        Message({
            message: "用户无权限，请切换用户重新登录",
            type: 'error'
        })
        setTimeout(() => {
            router.push({path: '/login'})
        },1000)
    } else if (code >= 500) {
        Message({
            message: msg || "网络错误,请稍后重新刷新页面",
            type: 'error'
        })
    }else{
        Message({
            message: msg || '网络错误,请稍后重新刷新页面',
            type: 'error'
        })
    }

}



const instance = axios.create({
  baseURL: '/wms-web',
  timeout: 0,
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
})

instance.interceptors.request.use((config) => {
    return config
}, error => {
    let status = error.response.status
    judge(status)
    return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
    //请求不等于200时自动拦截
    if (loadingInstance) loadingInstance.close();
    let code = response.data.code
    let msg = response.data.message
    if (code == '200'){
        return response.data
    }else{
        judge(code, msg)
        return Promise.reject()
    }
}, error => {
    if (loadingInstance) loadingInstance.close();
    let status = error.response.data.code
    let msg = error.response.data.message
    judge(status, msg)
    return Promise.reject(error)
})

let GET = (url, params, flag) => {
    loadFunc(flag)
    return instance.get(url, { params })
}
let POST = (url, body, flag) => {
    loadFunc(flag)
    return instance.post(url, body)
 }
let PUT = (url, body, flag) => {
    loadFunc(flag)
    return instance.put(url, body)
 }
let PATCH = (url, body, flag) => {
    loadFunc(flag)
    return instance.patch(url, body)
}
let DELETE = (url, id, flag) => {
   loadFunc(flag)
   return instance.delete(url + id)
}

export {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
}
