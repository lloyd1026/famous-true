import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueRouter from 'vue-router'
import router from "./router"
import store from "./store"
import * as echarts from 'echarts'

Vue.config.productionTip = false
// Vue.prototype.$httpUrl='http://localhost:5000'  // 本地
// Vue.prototype.$httpUrl='http://47.104.4.216:5000'  // 服务器 + 前端 本地
Vue.prototype.$httpUrl = '/api'                 // 全部署
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

Vue.prototype.$fixImgUrl = function (url) {
  return url
    .replace('http://localhost:5000', 'https://famous-tree.top')
    .replace('http://47.104.4.216:5000', 'https://famous-tree.top');
}


Vue.use(VueRouter)
Vue.use(ElementUI)

new Vue({
  router,store,
  render: h => h(App),
}).$mount('#app')
