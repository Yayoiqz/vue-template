import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import store from './store'
import axios from './tools/Axios'
import i18n from '../../lang' // 国际化
Vue.prototype.$axios = axios
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
// 开发环境下面使用vConsole进行调试
// if (process.env.NODE_ENV === 'development') {
//     const VConsole = require('vconsole')
//     new VConsole()
// }
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
