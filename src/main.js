import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import MarkdownIt from 'markdown-it'
import Storage from './plugins/storage'

Vue.config.productionTip = false
Vue.prototype.md = new MarkdownIt()
Vue.prototype.storage = Storage.storage

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
