import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
    },
    mutations: {
        changeState (state, payload) {
            // 变更状态
            state[payload.key] = payload.value
        }
    },
    actions: {

    }
})
