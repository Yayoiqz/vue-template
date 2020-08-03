import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('@/views/Index')
// exsample
// const MessageCode = () => import('@/views/MessageCode')

Vue.use(Router)
export default new Router({
    linkActiveClass: 'active',
    mode: 'history',
    routes: [
        {
            path: '/index',
            name: 'index',
            component: Index
        }
    ]
})
