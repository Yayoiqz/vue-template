import axios from 'axios'
axios.interceptors.response.use(function (response) {
    // 处理响应
    return response
}, function (error) {
    return Promise.reject(error)
})
