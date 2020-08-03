import axios from 'axios'
// import store from '../store'
// import {Toast} from 'vant'
// import router from '../router'

// 请求拦截器，在headers中加入localstorage的token
axios.interceptors.request.use(function (config) {
    return config
}, function (error) {
    return Promise.reject(error)
})

// 响应拦截器，如果token过期则自动跳转到发送验证码页面
axios.interceptors.response.use(function (res) {
    return res
}, function (err) {
    return Promise.reject(err)
})
export default axios
