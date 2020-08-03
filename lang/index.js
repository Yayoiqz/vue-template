import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import indo from './indo'
import store from '../src/client/store'
// import zh from './zh'
Vue.use(VueI18n)
const messages = {
    // indo, zh
}
const i18n = new VueI18n({
    // locale: localStorage.lang || 'indo',
    // locale: store.state.lang || 'indo',
    messages
})
export default i18n
