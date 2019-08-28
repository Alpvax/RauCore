import Vue from "vue"
import App from "./App.vue"
import store from "./store"

Vue.config.productionTip = false

import { RunesPage, MsgPage } from "./components";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: RunesPage},
  {
    path: "/runes",
    component: RunesPage
  },
  {
    path: "/messages",
    component: MsgPage,
    beforeEnter: (to, from, next) => {
      next(vm => {
        return false;//TODO: Check authentication
      });
    },
  },
  //{ path: "/bar", component: Bar }
]

const router = new VueRouter({
  routes,
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")
