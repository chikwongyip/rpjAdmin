import Vue from 'vue'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from "vue-router";
import App from './App.vue'
import routes from "../src/routers/router"
import axios from "axios";
import VueAxios from "vue-axios";
import VueCookies from "vue-cookies";
Vue.use(VueAxios,axios)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueCookies,{expires:'7d'});
const router = new VueRouter({
  mode:"history",
  routes
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
