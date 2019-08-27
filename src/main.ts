import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

import { RunesPage } from "./components";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  { path: '/runes', component: RunesPage },
  //{ path: '/bar', component: Bar }
]

const router = new VueRouter({
  routes,
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
